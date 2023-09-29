import express from 'express'
import socketServer from '../app.js';
import __dirname from '../utils.js';
import { ChatRepository } from '../daos/repositories/chat.repository.js';
import { handleRequestError, logRequestError, logRequestInfo } from '../utils/winston/logger.js';

const chatRepository = new ChatRepository();

const app = express()

app.use(express.json());
app.use(express.static(__dirname + "/public"))

class ChatController {
    async getAllMessages(req, res) {
        try {
            const messages = await chatRepository.getAllMessages();
            if (!messages || messages.length === 0) {
                return handleRequestError(res, 404, { message: "No se encontraron mensajes" });
            }
            logRequestInfo(req)
            res.status(200).json({ payload: messages });
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message }); */
        }
    }

    async saveMessage(req, res) {
        try {
            const { user, message } = req.body;
            if (!user || !message) {
                logRequestDebug(req, { error: "Los parametros no es correcto" });
                return handleRequestError(res, 400, { message: "parametros incorrectos" });
            }
            const result = await chatRepository.saveMessage(user, message);
            socketServer.emit("newMessage", result)
            logRequestInfo(ref)
            res.status(201).json({ result, payload: result });
        } catch (error) {
            logRequestError(req, error)
            /* res.status(400).json({ error: error.message }); */
        }
    }
}

export default new ChatController();
