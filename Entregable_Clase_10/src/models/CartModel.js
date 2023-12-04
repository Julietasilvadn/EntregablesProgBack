import * as fs from 'fs';

// CLASE ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class CartManager {
    constructor(path) {
      this.path = path;
      this.carts = [];
      this.lastCartId = 0;
      this.loadCarts().then(() => {

        console.log("Carritos cargados");
        
        });
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
  

