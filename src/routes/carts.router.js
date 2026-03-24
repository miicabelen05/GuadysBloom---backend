const express = require("express");
const router = express.Router();

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");


// Crear carrito
router.post("/", async (req, res) => {
  try {

    const newCart = await Cart.create({ products: [] });

    res.status(201).json({
      status: "success",
      payload: newCart
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear carrito"
    });
  }
});


// Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: cart
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener carrito"
    });
  }
});


// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {

    const cart = await Cart.findById(req.params.cid);

    const product = await Product.findById(req.params.pid);

    if (!cart || !product) {
      return res.status(404).json({
        status: "error",
        message: "Carrito o producto no encontrado"
      });
    }

    const existingProduct = cart.products.find(p => p.product.toString() === req.params.pid);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({
        product: req.params.pid,
        quantity: 1
      });
    }

    await cart.save();

    res.json({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto"
    });
  }
});

//Actualizar TODO el carrito 
router.put("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: req.body },
      { new: true }
    );

    res.json({ status: "success", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar carrito" });
  }
});

//Actualizar Cantidad en el Carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findById(req.params.cid);

    const product = cart.products.find(
      p => p.product.toString() === req.params.pid
    );

    if (product) {
      product.quantity = quantity;
    }

    await cart.save();

    res.json({ status: "success", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar cantidad" });
  }
});

//Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    cart.products = cart.products.filter(
      p => p.product.toString() !== req.params.pid
    );

    await cart.save();

    res.json({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto"
    });
  }
});

//Vaciar Carrito
router.delete("/:cid", async (req, res) => {
  try {

    const result = await Cart.findByIdAndDelete(req.params.cid);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Carrito eliminado"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar carrito"
    });
  }
});


module.exports = router;