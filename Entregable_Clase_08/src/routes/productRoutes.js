import express from "express";
import { ProductManager } from "../models/ProductModel.js";
const rutaProducto = express.Router();

const productos = new ProductManager('src/db/products.json');

//ENDPOINTS ----------------------------------------------------------------------------------------------------------------------------------------------------------------

rutaProducto.get('/',async (req,res)=>{
    try {
        let limit = await parseInt(req.query.limit);
        let products;
        if(!limit){
            const data1 = JSON.stringify(await productos.getProducts());
            products = JSON.parse(data1)
            res.setHeader('Content-Type', 'application/json')
            res.send( JSON.stringify(await products, null,2));
        } else{
            const data = await fs.readFileSync('products.json')
            products = JSON.parse(data)
            res.setHeader('Content-Type', 'application/json')
            await res.send(JSON.stringify(products.slice(0, limit), null, 2));
        }
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
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