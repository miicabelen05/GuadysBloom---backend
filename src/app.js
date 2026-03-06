const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const ProductManager = require('./managers/ProductManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

const productManager = new ProductManager('./data/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  // enviar lista actual
  const products = await productManager.getProducts();
  socket.emit('updateProducts', products);

  // agregar producto
  socket.on('addProduct', async (product) => {
    console.log ("Producto Recibido", product);
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });

  // eliminar producto
  socket.on('deleteProduct', async (pid) => {
    const products = await productManager.getProducts();
    const filtered = products.filter(p => p.id != pid);
    const fs = require('fs');
    await fs.promises.writeFile('./src/data/products.json', JSON.stringify(filtered, null, 2));

    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});