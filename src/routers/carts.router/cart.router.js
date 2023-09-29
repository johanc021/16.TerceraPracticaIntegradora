import { Router } from 'express';
import cartController from '../../controllers/cart.controller.js';
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';
import isUser from '../../config/middlewareAuth/authRole/isUser.js';
import { policyRoles } from '../../config/middlewareAuth/authRole/forRole.js';

class CartRouter {
    constructor() {
        this.router = Router();
        this.router.get('/', authenticate, cartController.getAllCarts);
        this.router.get('/:cartId', authenticate, cartController.getCart);
        this.router.delete('/:cartId/products/:productId', authenticate, cartController.deleteProductFromCart);
        this.router.post('/', authenticate, policyRoles(['user', 'admin', 'premium']), cartController.saveProductToCart);
        this.router.put('/:cartId', authenticate, cartController.updateCart);
        this.router.put('/:cartId/products/:productId', authenticate, cartController.updateProductQuantity);
        this.router.delete('/:cartId', authenticate, cartController.deleteAllProductsFromCart);
        this.router.post('/:cid/purchase', authenticate, cartController.purchaseCart)

    }

    getRouter() {
        return this.router;
    }
}

export default CartRouter;
