# Consigna

## Manejo de archivos

Realizar una clase “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
 - La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
 - Debe guardar objetos con el siguiente formato:
    * title (nombre del producto)
    * description (descripción del producto)
    * price (precio)
    * thumbnail (ruta de imagen)
    * code (código identificador)   
    * stock (número de piezas disponibles)
- Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial (Validar que no se repita el campo “code” y que todos los campos sean obligatorios. Al agregarlo, debe crearse con un id autoincrementable).
- Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento.
- Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id (En caso de no coincidir ningún id, mostrar en consola un error “Not found”).
- Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID.
- Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
