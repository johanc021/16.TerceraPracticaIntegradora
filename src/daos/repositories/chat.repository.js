import { logRequestDebug } from "../../utils/winston/logger.js";
import getDAOS from "../daos.factory.js";

const { chatsDAO } = getDAOS();

export class ChatRepository {
    constructor() {
        this.dao = chatsDAO;
    }

    async getAllMessages() {
        try {
            const messages = await this.dao.getAll();
            return messages;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async saveMessage(user, message) {
        try {
            const result = await this.dao.saveMessages(user, message);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}