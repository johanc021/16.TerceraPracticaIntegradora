import { Router } from 'express';
import loggerController from '../../controllers/logger.controller.js';
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';


class ChatRouter {
    constructor() {
        this.router = Router();
        this.router.get('/', authenticate, loggerController.testLogger);
    }

    getRouter() {
        return this.router;
    }
}

export default ChatRouter;

