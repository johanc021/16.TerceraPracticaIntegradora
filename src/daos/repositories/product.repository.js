import getDAOS from "../daos.factory.js";

const { productsDAO } = getDAOS();

export class ProductRepository {
    constructor() {
        this.dao = productsDAO;
    }

    async getAllProducts(page, limit) {
        try {
            const products = await this.dao.getAll(page, limit);
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductById(productId) {
        try {
            const product = await this.dao.getProductById(productId);
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createProduct(product) {
        try {
            const createdProduct = await this.dao.saveProduct(product);
            return createdProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(productId, updatedProduct) {
        try {
            const updated = await this.dao.editProduct(productId, updatedProduct);
            return updated;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductStock(productId, newStock) {
        try {
            const update = await this.dao.updateProductStock(productId, newStock)
            return update
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct(productId) {
        try {
            const deleted = await this.dao.deleteProduct(productId);
            return deleted;
        } catch (error) {
            throw new Error(error.message);
        }
    }


}