import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { rutaProducto } from './routes/productRoutes.js';
import { rutaCarrito } from './routes/cartRoutes.js';
import { ProductManager } from './models/ProductModel.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dbConnect from './db/db.js';

const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app);
const io = new Server(server);


dbConnect.connect().then((connection) => {
  console.log('Conexión exitosa a MongoDB');

  const db = connection;

  const productos = new ProductManager(db);

  //Motor de Plantilla
  app.engine('handlebars', handlebars.engine({
    extname: "handlebars",
    defaultLayout: "main.handlebars",
    layoutsDir: __dirname + "/views"
  }));
  app.set('view engine', 'handlebars');
  app.set('views', './src/views');

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

    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado');
    
      const emitProductList = async () => {
        try {
          const products = await productos.getProducts();
          socket.emit('productList', products);
        } catch (error) {
          console.log('Error al obtener los productos:', error);
        }
      };
    
      emitProductList();
    
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    
    });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});