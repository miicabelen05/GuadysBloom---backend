const fs  = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            console.error('Error al leer los productos:', error);
            return [];
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newID = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const newProduct = { id: newID, ...product };
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;  
        }   
        catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }
}

module.exports = ProductManager;
    
