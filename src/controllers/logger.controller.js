import express from 'express'
import socketServer from '../app.js';
import __dirname from '../utils.js';
import { logRequestError, logRequestInfo } from '../utils/winston/logger.js';


class ChatController {
    async testLogger(req, res) {
        req.logger.debug('Esto es un mensaje de debug');
        req.logger.http('Esto es un mensaje HTTP');
        req.logger.info('Esto es un mensaje de información');
        req.logger.warning('Esto es un mensaje de advertencia');
        req.logger.error('Esto es un mensaje de error');
        req.logger.fatal('Esto es un mensaje fatal');
        res.send('Logs enviados, revisa la consola o el archivo de logs.');
    }
}

export default new ChatController();
