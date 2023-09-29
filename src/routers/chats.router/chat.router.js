import { Router } from 'express';
import chatController from '../../controllers/chat.controller.js';
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';
import isUser from '../../config/middlewareAuth/authRole/isUser.js';

class ChatRouter {
    constructor() {
        this.router = Router();
        this.router.get('/', authenticate, isUser, chatController.getAllMessages);
        this.router.post('/', authenticate, isUser, chatController.saveMessage);
    }

    getRouter() {
        return this.router;
    }
}

export default ChatRouter;

