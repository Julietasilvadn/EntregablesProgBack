import * as fs from 'fs';

// CLASE ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class ProductManager {
    constructor(path) {
      this.products = [];
      this.path = path;
      this.lastProductId = 0;
      this.loadProducts().then(() => {

        console.log("Productos cargados:", this.products);
        
        });

    }

    async loadProducts() {
      try {
        const data = await fs.promises.readFile(this.path);
        this.products = JSON.parse(data);
        this.lastProductId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        console.log("Productos cargados:", this.products);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        this.products = [];
        this.lastProductId = 0;
      }
    }

    async saveProduct(){
      try{
          await fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
      } catch(err){
          console.log('Error al guardar', err)
      }
    }

    generateCode() {
        this.lastProductId++;
        return this.lastProductId;
    }
  
    async getProducts() {
      try {
        return await this.products;
      } catch (error) {
        console.log('Error al buscar productos', error)
      }
    }
  
    async addProduct(title, description, price, thumbnail, code, stock) {

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios.");
      }

      if (await this.products.some(existingProduct => existingProduct.code === code)) {

        throw new Error("El código del producto ya existe.");
    
      }

      const product = {id: this.generateCode(), title, description, price, thumbnail, code, stock };

      this.products.push(product);
      
      await this.saveProduct();

      return product;
    }
  
    async getProductById(id) {
      try {
        const product = await this.products.find(p => p.id === id); 
        if (!product) {
          throw new Error("Producto no encontrado");
        } else {
          return product;
        }
      } catch (error) {
        throw new Error("Error al buscar producto");
      }
    }

    async updateProduct(id, update){
      
      const product = await this.products.findIndex(p => p.id === id);
        if (product !== -1) {
          const updatedProduct = await Object.assign({}, this.products[product], update);
          this.products[product] = updatedProduct;
          await this.saveProduct();
          console.log(`El producto con el id ${id} fue actualizado`);
          return await updatedProduct;
        }else{
          throw new Error("Producto no se pudo actualizar");
        }
    }

    async deleteProduct(id){
      try {
          const product = await this.products.findIndex(p => p.id === id);
          this.products.splice(product,1);
          await this.saveProduct();
          console.log(`El producto con el id ${id} fue borrado`)
          
      } catch (err) {
          console.log('Error al borrar producto', err)
      }
    }
};

export class CartManager {
    constructor(path) {
      this.path = path;
      this.carts = [];
      this.lastCartId = 0;
      this.loadCarts();
    }
  
    async loadCarts() {
      try {
        const data = await fs.readFileSync(this.path);
        this.carts = JSON.parse(data);
        this.lastCartId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
      } catch (error) {
        this.carts = [];
        this.lastCartId = 0;
      }
    }
  
    generateCartId() {
      this.lastCartId++;
      return this.lastCartId.toString();
    }
  
    async saveCarts() {
      try {
        await fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
      } catch (error) {
        console.log('Error al guardar los carritos', error);
      }
    }
  
    async getCartById(cartId) {
      try {
        const cart = this.carts.find(c => c.id === cartId);
        return cart;
      } catch (error) {
        console.log('Error al obtener el carrito', error);
      }
    }
  
    async createCart() {
      try {
        const cart = {
          id: parseInt(this.generateCartId()),
          products: []
        };
        this.carts.push(cart);
        await this.saveCarts();
        return cart;
      } catch (error) {
        console.log('Error al crear el carrito', error);
      }
    }
  
    async addProductToCart(cartId, productId) {
      try {
        const cart = await this.getCartById(cartId);
        if (cart) {
          const existingProduct = cart.products.find(product => product.product === productId);
          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cart.products.push({ product: productId, quantity: 1 });
          }
          await this.saveCarts();
          return cart;
        } else {
          console.log('Carrito no encontrado');
        }
      } catch (error) {
        console.log('Error al agregar el producto al carrito', error);
      }
    }
}
  

