import * as fs from 'fs';
import mongoose from 'mongoose';

// CLASE ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class ProductManager {
    constructor(path) {
      this.products = [];
      this.path = path;
      this.lastProductId = 0;
      this.loadProducts();

    }

    
    async loadProducts() {
      try {
        const data = await fs.promises.readFile(this.path);
        this.products = JSON.parse(data);
        this.lastProductId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        console.log("Productos cargados");
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


// MONGOOSE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const productoSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  stock: Number,
});

const ProductoModel1 = mongoose.model('Producto', productoSchema);

export default ProductoModel1;