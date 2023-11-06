// CLASE -------------------------------------------------------------------------------
class ProductManager {
    constructor() {
      this.products = [];
      this.lastProductId = 0;
    }

    generateCode() {
        this.lastProductId++;
        return this.lastProductId;
    }
  
    getProducts() {
      return this.products;
    }
  
    addProduct(title, description, price, thumbnail, stock) {

      if (!title || !description || !price || !thumbnail || !stock) {
        throw new Error("Todos los campos son obligatorios.");
       }
    
      if (this.products.some(existingProduct => existingProduct.code === code)) {
        throw new Error("El código del producto ya existe.");
      }

      const code = this.generateCode();

      const product = { title, description, price, thumbnail, code, stock };

      this.products.push(product);

      return product;
    }
  
    getProductById(id) {
      const product = this.products.find(p => p.code === id); 
      if (product) {
        return product;
      } else {
        throw new Error("Producto no encontrado");
      }
    }
  }
  

// TEST

const manager = new ProductManager();

console.log("1. Instancia creada:", manager);

const products = manager.getProducts();

console.log("2. Resultado de getProducts:", products);

try {

  const product1 = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

  console.log("3. Producto agregado:", product1);

} catch (error) {

  console.log("3. Error al agregar producto:", error.message);

}

const productsAfterAdding = manager.getProducts();

console.log("4. Productos después de agregar uno:", productsAfterAdding);

try {

  const product2 = manager.addProduct("producto repetido", "Este es un producto repetido", 150, "Otra imagen", "abc123", 15);

  console.log("5. Producto repetido agregado:", product2);

} catch (error) {

  console.log("5. Error al agregar producto repetido:", error.message);

}

try {

  const productFound = manager.getProductById(1);

  console.log("6. Producto encontrado:", productFound);

} catch (error) {

  console.log("6. Error al buscar producto:", error.message);

}

try {

  const productNotFound = manager.getProductById(2);

  console.log("6. Producto no encontrado:", productNotFound);

} catch (error) {

  console.log("6. Error al buscar producto no encontrado:", error.message);

}