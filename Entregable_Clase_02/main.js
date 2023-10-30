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
        console.error("Producto no encontrado");
      }
    }
  }
  