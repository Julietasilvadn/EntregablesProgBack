import express from "express";
import { ProductManager } from "../models/ProductModel.js";
import { CartManager } from "../models/CartModel.js";

const rutaCarrito = express.Router();
const carritos = new CartManager()
const productos = new ProductManager();

//ENDPOINTS ----------------------------------------------------------------------------------------------------------------------------------------------------------------

rutaCarrito.get('/:cid', async(req, res)=>{
    try {
        const idCarrito = parseInt(req.params.cid);
        const carrito = await carritos.getCartById(idCarrito).populate('products');
        if (carrito) {
          res.render('cartDetail', { idCarrito, products: carrito.products });
        } else {
          res.json({ error: 'Carrito no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
      }
    
});

rutaCarrito.post('/', async(req,res)=>{
    const carrito = await carritos.createCart();
    res.json(carrito);
})

rutaCarrito.post('/:cid/product/:pid', async(req,res)=>{
    const idCarrito = parseInt(req.params.cid);
    const idProducto = parseInt(req.params.pid);
    const carrito = await carritos.getCartById(idCarrito)

    if(!carrito){
        await carritos.createCart();
        await carritos.addProductToCart(idCarrito, idProducto);
        res.json(`Carrito con id ${idCarrito} creado y producto con id ${idProducto} agregado`)
    } else {
        await carritos.addProductToCart(idCarrito,idProducto);
        res.json(`Producto agregado al carrito ${idCarrito}`)
    }
})

rutaCarrito.delete('/:cid/products/:pid', async (req, res) => {
    try {
      const idCarrito = parseInt(req.params.cid);
      const idProducto = parseInt(req.params.pid);
      await carritos.removeProductFromCart(idCarrito, idProducto);
      res.json(`Producto con id ${idProducto} eliminado del carrito con id ${idCarrito}`);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

rutaCarrito.put('/:cid', async (req, res) => {
    try {
      const idCarrito = parseInt(req.params.cid);
      const { products } = req.body;
      await carritos.updateCart(idCarrito, products);
      res.json(`Carrito con id ${idCarrito} actualizado`);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

rutaCarrito.put('/:cid/products/:pid', async (req, res) => {
    try {
      const idCarrito = parseInt(req.params.cid);
      const idProducto = parseInt(req.params.pid);
      const { quantity } = req.body;
      await carritos.updateProductQuantity(idCarrito, idProducto, quantity);
      res.json(`Cantidad del producto con id ${idProducto} actualizada en el carrito con id ${idCarrito}`);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

rutaCarrito.delete('/:cid', async (req, res) => {
    try {
      const idCarrito = parseInt(req.params.cid);
      await carritos.clearCart(idCarrito);
      res.json(`Se eliminaron todos los productos del carrito con id ${idCarrito}`);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});



export { rutaCarrito }