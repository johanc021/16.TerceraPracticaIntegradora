import { CartRepository } from '../daos/repositories/cart.repository.js';
import { STATUS } from '../utils/constantes.js'
import ticketModel from '../daos/schema/tickets.schema.js';
import { generateTicketCode, calculateTotalAmount } from '../utils.js';
import { ProductRepository } from '../daos/repositories/product.repository.js';
import { handleRequestError, logRequestError, logRequestInfo } from '../utils/winston/logger.js';

const cartRepository = new CartRepository()
const productRepository = new ProductRepository();

class CartController {
    constructor() {
        this.getAllCarts = this.getAllCarts.bind(this);
        this.getCart = this.getCart.bind(this);
        this.deleteProductFromCart = this.deleteProductFromCart.bind(this);
        this.saveProductToCart = this.saveProductToCart.bind(this);
        this.updateCart = this.updateCart.bind(this);
        this.updateProductQuantity = this.updateProductQuantity.bind(this);
        this.deleteAllProductsFromCart = this.deleteAllProductsFromCart.bind(this);
        this.purchaseCart = this.purchaseCart.bind(this);
    }

    async getAllCarts(req, res) {
        try {
            const carts = await cartRepository.getAllCarts();
            if (!carts || carts.length === 0) {
                return handleRequestError(res, 404, { message: "No se pueden encontrar carritos" });
            }
            logRequestInfo(req)
            res.status(200).json({ carts });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    async getCart(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await cartRepository.getCart(cartId);
            if (!cart) {
                return handleRequestError(res, 404, { message: "No se pueden encontrar el carrito" });
            }
            logRequestInfo(req)
            res.status(200).json({ cart });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            console.log(req.user)
            const { cartId, productId } = req.params;
            if (!cartId || !productId) {
                return handleRequestError(res, 400, { message: "Datos incorrectos" });
            }
            const updatedCart = await cartRepository.deleteProductFromCart(cartId, productId);
            logRequestInfo(req)
            res.status(200).json({ cart: updatedCart });
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    async saveProductToCart(req, res) {
        try {
            const { idProduct, idCart, quantity } = req.body;
            if (!idProduct || !idCart || !quantity) {
                return handleRequestError(res, 400, { message: "Los datos no son correctos" });
            }
            const product = await productRepository.getProductById(idProduct)

            if (req.user.role === 'premium' && product.owner === req.user.email) {
                return handleRequestError(res, 403, { message: "No puede agregar productos suyos al carrito " })
            }

            const cart = await cartRepository.saveProductToCart(idProduct, idCart, quantity);
            logRequestInfo(req)
            res.status(201).json({ cart });
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(400).json({ error: error.message }); */
        }
    }

    async updateCart(req, res) {
        try {
            const { cartId } = req.params;
            const { products } = req.body;
            if (!cartId || !products) {
                return handleRequestError(res, 400, { message: "Los datos no son correctos" });
            }
            const updatedCart = await cartRepository.updateCart(cartId, products);
            logRequestInfo(req)
            res.status(200).json({ cart: updatedCart });
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(400).json({ error: error.message }); */
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cartId, productId } = req.params;
            const { quantity } = req.body;
            if (!cartId || !productId || !quantity) {
                return handleRequestError(res, 400, { message: "Datos incorrectos" });
            }
            const updatedCart = await cartRepository.updateProductQuantity(cartId, productId, quantity);
            logRequestInfo(req)
            res.status(200).json({ cart: updatedCart });
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(400).json({ error: error.message }); */
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const { cartId } = req.params;
            if (!cartId) {
                return handleRequestError(res, 400, { data: cartId, message: "Dato incorrecto" });
            }
            const cart = await cartRepository.deleteAllProductsFromCart(cartId);
            logRequestInfo(req)
            res.status(200).json({ cart });
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const { user } = req;
            if (!cid || !user) {
                return handleRequestError(res, 400, { data: { cid, user }, message: "Dato incorrecto" });
            }
            // Obtener el carrito y usuario autorizado
            const cart = await cartRepository.getCart(cid);

            //obtener id del usuario
            /* const userIdAuthorized = await userRepository.getIdUserByEmail(user.email);
            userIdAuthorized._id.toString() */

            // Inicializar arreglos para productos comprados y no comprados
            const productsNotPurchased = [];
            const productsPurchased = [];

            let totalAmount = 0; // Inicializar el monto total en 0

            for (const productItem of cart.products) {
                const { product, quantity } = productItem;
                const availableProduct = await productRepository.getProductById(product)
                if (availableProduct && availableProduct.stock >= quantity) {
                    // Restar la cantidad comprada del stock del producto
                    const newStock = availableProduct.stock - quantity;
                    await productRepository.updateProductStock(product, newStock);
                    // Calcular el precio total para este producto y agregarlo al monto total
                    totalAmount += availableProduct.price * quantity;
                    productsPurchased.push(productItem); // Agregar al arreglo de productos comprados
                } else {
                    productsNotPurchased.push(productItem);
                }
            }

            // Crear el ticket con los productos comprados y el monto total
            const ticket = await ticketModel.create({
                code: generateTicketCode(),
                purchase_datetime: new Date(),
                amount: Number(totalAmount), // Usar el monto total calculado
                purchaser: user.email,
            });

            for (const productItem of productsPurchased) {
                const { product } = productItem;
                const productId = product._id.toString();
                await cartRepository.deleteProductFromCart(cid, productId);
            }

            console.log("Productos no comprados " + productsNotPurchased)
            logRequestInfo(ref)
            res.status(200).json({ status: STATUS.SUCCESS })

        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }


}

export default new CartController();
