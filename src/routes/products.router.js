const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', (req, res) => {
  const {pid} = req.params;
  res.send({ message: `Producto con ID: ${pid}` });
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
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
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
    if (createdProduct) {
        res.status(201).json(createdProduct);
    } else {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  res.send({ message: `Producto con ID: ${pid} actualizado` });
});

router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
    res.send({ message: `Producto con ID: ${pid} eliminado` });
});

module.exports = router;