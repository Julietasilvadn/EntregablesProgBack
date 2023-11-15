const express = require('express')
const app = express()
PORT = 8080
const ProductManager = require('./main.js');
const productManager = new ProductManager('products.json');

// ENDPOINTS -------------------------------------------------------------------------------------------------------
app.get('/products',async (req,res)=>{
    let limit = await parseInt(req.query.limit);
    let products;
    if(!limit){
        await res.sendFile(__dirname+'/products.json')
    } else{
        const data = await fs.readFileSync('products.json')
        products = JSON.parse(data)
        res.setHeader('Content-Type', 'application/json')
        await res.send(JSON.stringify(products.slice(0, limit), null, 2));
    }
        
})

app.get('/products/:pid', async (req,res)=>{
    let idProduct = parseInt(req.params.pid)
    const product = await productManager.getProductById(idProduct)
    if(!product){
        await res.send(`ERROR!! No existe el producto con el id : ${idProduct}`)
    } else {
        res.setHeader('Content-Type', 'application/json')
        await res.send(JSON.stringify(product, null, 2));
    }

    
})

// SERVIDOR ----------------------------------------------------------------------------------------------------------------

app.listen(PORT, ()=>{
    console.log(`Server en el puerto ${PORT}`)
})