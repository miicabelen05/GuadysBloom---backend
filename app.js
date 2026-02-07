const express = require('express');
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
  res.send('Servidor GuadysBloom funcionando!');
});
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});