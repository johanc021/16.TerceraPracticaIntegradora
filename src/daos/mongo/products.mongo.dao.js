import { productModel } from '../schema/products.schema.js';
import { MongoManager } from '../db/mongo.manager.js'

export class ProductsMongoDAO {
    constructor() {
        MongoManager.start()
    }

    getAll = async (page, limit) => {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true
            };

            const result = await productModel.paginate({}, options);
            return result;
        } catch (error) {
            throw new Error('Error al obtener los productos');
        }
    }

    getProductById = async (productId) => {
        try {
            const product = await productModel.findById(productId).lean();
            if (product === null) {
                throw new Error('El producto no se encuentra en la base de datos')
            }
            if (!product) {
                throw new Error('Producto no encontrado por ID');
            }
            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto por ID');
        }
    }

    saveProduct = async (product) => {
        try {
            const result = await productModel.create(product);
            return result;
        } catch (error) {
            throw new Error('Error al guardar el producto');
        }
    }

    editProduct = async (productId, updatedProduct) => {
        try {
            const result = await productModel.findByIdAndUpdate(
                productId,
                updatedProduct,
                { new: true }
            );
            return result;
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    };

    async updateProductStock(productId, newStock) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $set: { stock: newStock } },
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            throw new Error('Error al actualizar el stock del producto');
        }
    }

    deleteProduct = async (productId) => {
        try {
            const result = await productModel.findByIdAndDelete(productId);
            return result;
        } catch (error) {
            throw new Error('Error al eliminar el producto');
        }
    };

    generateUsers = async (param) => {
        try {
            const result = await productModel.insertMany(param)
            return result
        } catch (error) {

        }
    }
}
