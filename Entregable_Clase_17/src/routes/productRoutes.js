import express from "express";
import { ProductManager } from "../models/ProductModel.js";

const rutaProducto = express.Router();
const productos = new ProductManager();

//ENDPOINTS ----------------------------------------------------------------------------------------------------------------------------------------------------------------
rutaProducto.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts');
  });

rutaProducto.get('/',async (req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const availability = req.query.availability || '';
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const products = await productos.getProducts();
  
        const filteredByCategory = category
        ? products.filter((product) => product.category === category)
        : products;
  
        const filteredByAvailability = availability === 'available'
        ? filteredByCategory.filter((product) => product.stock > 0)
        : filteredByCategory;
  
        const filteredByQuery = query
        ? filteredByAvailability.filter((product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          )
        : filteredByAvailability;
  
  
        const sortedProducts = filteredByQuery.sort((a, b) =>
          a.price > b.price ? sort : -sort
        );
  
        const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  
        res.render('home', { products: paginatedProducts });
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
      }  
});

rutaProducto.get('/:pid', async (req,res)=>{
    const productId = parseInt(req.params.pid);
    try {
        const product = await productos.getProductById(productId);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(product, null, 2));
      } catch (error) {
        res
        .status(404).send(`ERROR!! No existe el producto con el id: ${productId}`);
        
      }
    

    
});

rutaProducto.post('/', async (req,res)=>{
    const producto = req.body;
    await productos.addProduct(producto.title, producto.description, producto.price, producto.thumbnail,producto.code, producto.stock);
    await productos.saveProduct();
    res.send(producto)
})

rutaProducto.put('/:pid',async (req,res)=>{
    const id = parseInt(req.params.pid);
    const producto = req.body;
    await productos.updateProduct(id,producto)
    res.json(producto);
})

rutaProducto.delete('/:pid',async(req,res)=>{
    const id = parseInt(req.params.pid);
    const deletedProduct = await productos.getProductById(id);
    await productos.deleteProduct(id);
    if (deletedProduct) {
        res.json({ status: 'Producto borrado', producto: deletedProduct });
    } else {
        res.json({ error: 'ID de producto no encontrado' });
    }
    
})


export { rutaProducto }