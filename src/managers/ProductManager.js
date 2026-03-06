const fs  = require('fs');
const path = require("path");

class ProductManager {
           
    constructor(filePath) {
        this.path = path.join(__dirname, "../data/products.json");
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

    async getProductById(pid) {
        const products = await this.getProducts();
        const product = products.find(p => p.id == pid);
        return product || null;
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

    async updateProduct(pid, updatedFields) {

        const products = await this.getProducts();

        const index = products.findIndex(p => p.id == pid);

        if (index === -1) {
        return null;
        }

        products[index] = {
        ...products[index],
        ...updatedFields,
        id: products[index].id
        };

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        return products[index];

    }
}

module.exports = ProductManager;


    
