# INFO:
   * Para descargar las dependencies:
      - npm i o npm install
   * Para iniciar el srv:
      - npm start
   * http://localhost:8080/*AcaVaElEndpointQueNecesites* 

# Consigna

## Websockets + Handlebars

Configurar nuestro proyecto para que trabaje con Handlebars y websocket.

- Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.

- Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento.

- Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
   * Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.


