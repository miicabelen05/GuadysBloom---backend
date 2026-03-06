const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {

  const { limit } = req.query;

  const products = await productManager.getProducts();

  if(limit){
    return res.json(products.slice(0, limit));
  }

  res.json(products);

});

router.get('/:pid', async (req, res) => {

  const { pid } = req.params;

  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ 
    status: "error",
    message: "Producto no encontrado"
    });
  }

  res.json(product);

});

router.post('/', async(req, res) => {
    const {
        title, 
        description,
        code, 
        price,
        status,
        stock,
        category,
        thumbnails
    } = req.body;

    if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({ 
        status: "error",
        message: 'Faltan campos obligatorios'
        });
    }
    const newProduct = {
        title,
        description,
        code,
        price,
        status : status ?? true,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    const createdProduct = await productManager.addProduct(newProduct);
    
    res.status(201).json({
    status: "success",
    payload: createdProduct
    });
});

router.put('/:pid', async (req, res) => {

  const { pid } = req.params;

  const updatedProduct = await productManager.updateProduct(pid, req.body);

  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updatedProduct);

});

router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
    res.send({ message: `Producto con ID: ${pid} eliminado` });
});

module.exports = router;