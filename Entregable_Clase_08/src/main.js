import express from 'express';
import { rutaProducto } from './routes/productRoutes.js';
import { rutaCarrito } from './routes/cartRoutes.js';
const app = express();
const PORT = process.env.PORT || 8080;

//JSON----------------------------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS----------------------------------------------------------------------------------------------------------------
app.use('/api/products', rutaProducto);
app.use('/api/carts', rutaCarrito);

//MIDLEWARE----------------------------------------------------------------------------------------------------------------
app.use((peticion, respuesta, next) => {
  if (!peticion.route) {
    respuesta.status(404).send({ error : -2, descripcion: `ruta ${peticion.url} no encontrada` });
  } else {
    next();
  }
})

// SERVIDOR ----------------------------------------------------------------------------------------------------------------
const servidor = app.listen(PORT, () => {
    console.log(`Servidor escuchando: ${PORT}`);
  });
  
  servidor.on('error', error => console.log(`Error: ${error}`));