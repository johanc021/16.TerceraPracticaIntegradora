import { Router } from 'express';
import productController from '../../controllers/product.controller.js';
import { policyRoles } from '../../config/middlewareAuth/authRole/forRole.js';

import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';
import compression from 'express-compression'

class ProductRouter {
    constructor() {
        this.router = Router();
        this.router.get('/', authenticate, compression(), productController.getAllProducts);
        this.router.get('/:productId', authenticate, productController.getProductById);
        this.router.post('/', authenticate, policyRoles(['admin', 'premium']), productController.createProduct);
        this.router.put('/:productId', authenticate, policyRoles(['admin']), productController.updateProduct);
        this.router.delete('/:productId', authenticate, policyRoles(['admin', 'premium']), productController.deleteProduct);
    }

    getRouter() {
        return this.router;
    }
}

export default ProductRouter;
