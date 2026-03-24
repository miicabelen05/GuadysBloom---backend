const express = require('express');
const router = express.Router();

const Product = require("../models/product.model");

router.get("/", async (req, res) => {
  try {

    // Query params
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro
    let filter = {};
    if (query) {
      filter.category = query;
    }

    // Orden
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    // Paginación
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    const baseUrl = "http://localhost:8080/api/products";

  res.json ({
    status: "success",
    payload: products,
    totalPages,
    page: Number(page),
    hasPrevPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
    prevPage: page > 1 ? Number(page) - 1 : null,
    nextPage: page < totalPages ? Number(page) + 1 : null,

    prevLink: page > 1 
      ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}` 
      : null,

    nextLink: page < totalPages 
      ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}` 
      : null
    });
    
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener productos"
    });
  }
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

router.post("/", async (req, res) => {
  try {

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

    // Validacion
    if (!title || !description || !code || price == null || stock == null || !category) {
      return res.status(400).json({ 
        status: "error",
        message: 'Faltan campos obligatorios'
      });
    }

    // Objeto Limpio
    const newProduct = {
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    const createdProduct = await Product.create(newProduct);

    res.status(201).json({
      status: "success",
      payload: createdProduct
    });

  } catch (error) {

    // Manejo de error
    res.status(500).json({
      status: "error",
      message: "Error al crear producto",
      error: error.message
    });

  }
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