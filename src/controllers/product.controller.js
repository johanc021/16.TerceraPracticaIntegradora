import { ProductRepository } from '../daos/repositories/product.repository.js';
import { STATUS } from '../utils/constantes.js'
import CustomError from '../utils/customErrors/customError.js';
import { generateProductError } from '../utils/customErrors/info.js'
import Error from '../utils/customErrors/enum.js';
import { createResponse, handleRequestError, logRequestError, logRequestInfo } from '../utils/winston/logger.js';

const productRepository = new ProductRepository()


class ProductController {
    constructor() {
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    async getAllProducts(req, res) {
        try {
            const { page, limit } = req.query;
            const products = await productRepository.getAllProducts(page, limit);
            logRequestInfo(req)
            createResponse(res, 200, { products })
            /* res.status(200).json({ products }); */
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    async getProductById(req, res) {
        try {
            const { productId } = req.params;
            const product = await productRepository.getProductById(productId);
            res.status(200).json({ product });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    /*  async createProduct(req, res) {
         try {
             const product = req.body;
             const role = req.user
             console.log(role)
             if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category || !product.thumbnail) {
                 CustomError.createError({
                     name: "Error al crear el usuario",
                     cause: generateProductError(product),
                     message: "Error al crear el producto",
                     code: Error.INVALID_TYPE_ERROR
                 })
             }
             const createdProduct = await productRepository.createProduct(product);
             logRequestInfo(req)
             res.status(201).json({ createdProduct });
         } catch (error) {
             logRequestError(req, error);
             handleRequestError(res, 500, error);
             res.status(400).json({ error: error.message, code: error.code, cause: error.cause, status: STATUS.FAIL });
         }
     } */

    async createProduct(req, res) {
        try {
            const product = req.body;

            if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category || !product.thumbnail) {
                CustomError.createError({
                    name: "Error en los parametros dados del producto",
                    cause: generateProductError(product),
                    message: "Los parametros son incorrectos.",
                    code: Error.INVALID_TYPE_ERROR
                })
            }

            // Revisar si el usuario es premium
            const isPremiumUser = req.user && req.user.role === 'premium';

            // Establecer el propietario según el estado premium del usuario
            const owner = isPremiumUser ? (req.user.email || req.user._id) : 'admin';

            // Dueño(a) del producto
            product.owner = owner;

            const createdProduct = await productRepository.createProduct(product);
            logRequestInfo(req);
            res.status(201).json({ createdProduct });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
        }
    }


    async updateProduct(req, res) {
        try {
            const { productId } = req.params;
            const updatedProduct = req.body;
            const updated = await productRepository.updateProduct(productId, updatedProduct);
            logRequestInfo(req)
            res.status(200).json({ updated });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /* res.status(400).json({ error: error.message }); */
        }
    }

    async deleteProduct(req, res) {
        try {
            const { productId } = req.params;

            // Obtener el producto por su ID
            const product = await productRepository.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Verificar si el usuario es un administrador o el propietario del producto, o un usuario premium que es propietario
            if (
                req.user &&
                (req.user.role === 'admin' || product.owner === req.user.email || (req.user.role === 'premium' && product.owner === req.user.role))
            ) {
                const deleted = await productRepository.deleteProduct(productId);
                logRequestInfo(req);
                return res.status(200).json({ deleted });
            } else {
                // Si el usuario no es admin ni propietario (o usuario premium propietario), no está autorizado para eliminar el producto
                return res.status(403).json({ error: 'Acceso no autorizado' });
            }
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
        }
    }


    /*  async deleteProduct(req, res) {
         try {
             const { productId } = req.params;
 
             // Obtener el producto por su ID
             const product = await productRepository.getProductById(productId);
             if (!product) {
                 return res.status(404).json({ error: 'Producto no encontrado' });
             }
 
             // Verificar si el usuario es un administrador o el propietario del producto
             if (req.user && (req.user.role === 'admin' || product.owner === req.user.email)) {
                 const deleted = await productRepository.deleteProduct(productId);
                 logRequestInfo(req);
                 return res.status(200).json({ deleted });
             } else {
                 // Si el usuario no es admin ni propietario, no está autorizado para eliminar el producto
                 return res.status(403).json({ error: 'Acceso no autorizado' });
             }
         } catch (error) {
             logRequestError(req, error);
             handleRequestError(res, 500, error);
         }
     } */


    /* async deleteProduct(req, res) {
        try {
            const { productId } = req.params;
            const deleted = await productRepository.deleteProduct(productId);
            logRequestInfo(req)
            res.status(200).json({ deleted });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            res.status(400).json({ error: error.message });
        }
    } */
}

export default new ProductController();
