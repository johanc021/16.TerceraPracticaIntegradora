import { cartModel } from "../schema/carts.schema.js";
import { productModel } from "../schema/products.schema.js";
import { MongoManager } from "../db/mongo.manager.js";

export class CartsMongoDAO {
    constructor() {
        MongoManager.start()
    }

    getAll = async () => {
        let carts = await cartModel.find().populate('products.product').lean();
        return carts;
    };

    getCart = async (cartId) => {
        const cart = await cartModel.findById(cartId).populate('products.product').lean();
        return cart;
    };

    deleteProductByIdFromCart = async (cartId, productId) => {
        /* console.log(cartId)
        console.log(productId) */
        try {
            const cart = await cartModel.findById(cartId);
            /* console.log(cart) */
            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            // Encuentra el índice del producto en el carrito
            const productIndex = cart.products.findIndex(productItem => productItem.product._id.toString() === productId);

            if (productIndex === -1) {
                console.log('No se encontró el producto en el carrito.');
                return null;
            }

            // Elimina el producto del carrito utilizando el índice encontrado
            cart.products.splice(productIndex, 1);

            await cart.save();

            return cart;
        } catch (error) {
            console.log('Error al eliminar el producto del carrito:', error.message);
            return null;
        }
    };


    /* deleteProductByIdFromCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            const updatedProducts = cart.products.filter(product => product._id.toString() !== productId);
            cart.products = updatedProducts;

            await cart.save();


            return cart;
        } catch (error) {
            console.log('Error al eliminar el producto del carrito:', error.message);
            return null;
        }
    }; */

    saveCart = async (idProduct, idCart, quantity) => {


        let product = await productModel.findOne({ _id: idProduct });

        if (!product) {
            throw new Error('El producto no existe');
        }

        let cart;

        if (!idCart) {
            cart = await cartModel.create({ products: [{ product: idProduct, quantity }] });
        } else {
            cart = await cartModel.findById(idCart);

            if (!cart) {
                throw new Error('El carrito no existe');
            }

            cart.products.push({ product: idProduct, quantity });
            await cart.save();
        }

        // Función para guardar en JSON
        /*  saveJSON(cart); */

        return cart;
    };

    //actualizar productos de un carrito
    updateCartById = async (cartId, products) => {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            cart.products = products;

            await cart.save();
            /* saveJSON(cart); */

            return cart;
        } catch (error) {
            console.log('Error al actualizar el carrito:', error.message);
            return null;
        }
    };

    //Metodo para actualizar la cantidad de un producto en carrito
    updateProductQuantity = async (cartId, productId, quantity) => {

        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            const productIndex = cart.products.findIndex(product => product._id.toString() === productId);

            if (productIndex === -1) {
                console.log('No se encontró el producto en el carrito.');
                return null;
            }

            cart.products[productIndex].quantity = quantity;

            await cart.save();
            /* saveJSON(cart) */

            return cart;
        } catch (error) {
            console.log('Error al actualizar la cantidad de ejemplares:', error.message);
            return null;
        }
    };
    // Dejar carrito vacio
    deleteAllProductsFromCart = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                return null;
            }

            cart.products = [];
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error('Error al eliminar los productos del carrito');
        }
    };
}