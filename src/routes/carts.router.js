const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Carrito creado' });
});

  router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    res.json({ message: `Detalles del carrito con ID: ${cid}` });
  });

  router.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    res.json({ message: `Producto con ID: ${pid} agregado al carrito con ID: ${cid}` });
  });

    router.delete('/:cid/products/:pid', (req, res) => {    
        const { cid, pid } = req.params;
    res.json({ message: `Producto con ID: ${pid} eliminado del carrito con ID: ${cid}` });
  });

  router.delete('/:cid', (req, res) => {
    const { cid } = req.params;
    res.json({ message: `Carrito con ID: ${cid} eliminado` });
  });

  module.exports = router;