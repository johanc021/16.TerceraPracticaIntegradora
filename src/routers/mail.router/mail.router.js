import { Router } from 'express';
import mailController from '../../controllers/mail.controller.js';
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';

class MailRouter {
    constructor() {
        this.router = Router();
        this.router.get('/', mailController.sendEmail);
    }

    getRouter() {
        return this.router;
    }
}

export default MailRouter;
