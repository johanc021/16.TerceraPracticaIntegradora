import { chatsModel } from "../schema/chats.schema.js";
import { MongoManager } from '../db/mongo.manager.js'

export class ChatsMongoDAO {

    constructor() {
        MongoManager.start()
    }

    getAll = async () => {
        let messages = await chatsModel.find().lean()
        return messages
    }

    saveMessages = async (user, message) => {
        if (!user || !message) return ({ status: "error", error: "Faltan datos" })
        let result = await chatsModel.create({ user, message })
        return result
    }
}