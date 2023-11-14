const fs = require('fs');

// CLASE ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class ProductManager {
    constructor(path) {
      this.products = [];
      this.path = path;
      this.lastProductId = 0;
      this.loadProducts();

    }

    loadProducts() {
      try {
        const data = fs.readFileSync(this.path);
        this.products = JSON.parse(data);
        this.lastProductId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      } catch (error) {
        this.products = [];
        this.lastProductId = 0;
      }
    }

    saveProduct(){
      try{
          fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
      } catch(err){
          console.log('Error al guardar', err)
      }
    }

    generateCode() {
        this.lastProductId++;
        return this.lastProductId;
    }
  
    getProducts() {
      try {
        return this.products;
      } catch (error) {
        console.log('Error al buscar productos', error)
      }
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios.");
      }

      if (this.products.some(existingProduct => existingProduct.code === code)) {

        throw new Error("El código del producto ya existe.");
    
      }

      const product = {id: this.generateCode(), title, description, price, thumbnail, code, stock };

      this.products.push(product);
      
      this.saveProduct();

      return product;
    }
  
    getProductById(id) {
      const product = this.products.find(p => p.id === id); 
      if (product) {
        return product;
      } else {
        throw new Error("Producto no encontrado");
      }
    }

    updateProduct(id, update){
      
      const product = this.products.findIndex(p => p.id === id);
        if (product !== -1) {
          const updatedProduct = Object.assign({}, this.products[product], update);
          this.products[product] = updatedProduct;
          this.saveProduct();
          console.log(`El producto con el id ${id} fue actualizado`);
          return updatedProduct;
        }else{
          throw new Error("Producto no se pudo actualizar");
        }
    }

    deleteProduct(id){
      try {
          const product = this.products.findIndex(p => p.id === id);
          this.products.splice(product,1);
          this.saveProduct();
          console.log(`El producto con el id ${id} fue borrado`)
          
      } catch (err) {
          console.log('Error al borrar producto', err)
      }
    }
  }
  

// TEST ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const manager = new ProductManager("productos.json");

console.log("1. Instancia creada:", manager);

const products = manager.getProducts();

console.log("2. Resultado de getProducts:", products);

// AGREGAR PRODUCTOS
try {

  product1 = manager.addProduct("producto 1", "Este es el producto de prueba 1", 100, "sin imagen","asd123", 10);
  product2 = manager.addProduct("producto 2", "Este es el producto de prueba 2", 150, "sin imagen","asd124", 15);
  product3 = manager.addProduct("producto 3", "Este es el producto de prueba 3", 200, "sin imagen","asd125", 20);
  product4 = manager.addProduct("producto 4", "Este es el producto de prueba 4", 250, "sin imagen","asd126", 25);
  product5 = manager.addProduct("producto 5", "Este es el producto de prueba 5", 300, "sin imagen","asd127", 30);

  console.log("3. Productos agregados");

} catch (error) {

  console.log("3. Error al agregar productos:", error.message);

}

const productsAfterAdding = manager.getProducts();

console.log("4. Productos después de agregar uno:", productsAfterAdding);

// AGREGAR UN PRODUCTO REPETIDO
try {

  const product6 = manager.addProduct("producto repetido", "Este es un producto repetido", 150, "Otra imagen","asd123", 15);

  console.log("5. Producto repetido agregado:", product6);

} catch (error) {

  console.log("5. Error al agregar producto repetido:", error.message);

}

// GET BY ID (EXISTE)

try {

  const productFound = manager.getProductById(1);

  console.log("6. Producto encontrado:", productFound);

} catch (error) {

  console.log("6. Error al buscar producto:", error.message);

}

// GET BY ID (NO EXISTE)
try {

  const productNotFound = manager.getProductById(90);

  console.log("6. Producto no encontrado:", productNotFound);

} catch (error) {

  console.log("6. Error al buscar producto no encontrado:", error.message);

}

// UPDATE

try {
  const updateProduct = manager.updateProduct(1, {title: "producto con el titulo editado", thumbnail: "sin imagen pero editado"});

  console.log("7. Producto editado:", updateProduct);

} catch (error) {

  console.log("7. Error al editar producto:", error.message);

}

// DELETE

try {
  
  const deletedProduct = manager.deleteProduct(2);

  console.log("8. Producto borrado con exito")

} catch (error) {

  console.log("8. Error al borrar producto:", error.message);

}