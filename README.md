# GuadysBloom Backend

Proyecto de Backend desarrollado con Node.js, Express y MongoDB (Mongoose)

## Funcionalidades

- API REST de productos
- CRUD de productos
- Paginación, filtros y ordenamiento
- Carritos de compra
- Persistencia en MongoDB
- Populate en carritos
- Handlebars + Socket.io (tiempo real)

## Endpoints principales

### Productos

GET /api/products  
GET /api/products/:pid  
POST /api/products  

### Carritos

POST /api/carts  
GET /api/carts/:cid  
POST /api/carts/:cid/products/:pid  
PUT /api/carts/:cid/products/:pid  
DELETE /api/carts/:cid/products/:pid  
DELETE /api/carts/:cid  

## Instalación

npm install

## Ejecutar proyecto

npm start

## Base de datos

MongoDB local:

mongodb://localhost:27017/ecommerce