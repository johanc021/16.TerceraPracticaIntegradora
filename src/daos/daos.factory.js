import config from "../config/config.js";

let usersDAO, productsDAO, cartsDAO, chatsDAO

switch (config.persistence.DATASOURCE) {
    case "MEMORY": {
        /* const { ContactsMemoryDAO } = await import("../models/daos/memory/contacts.memory.dao.js")
        contactsDAO = new ContactsMemoryDAO(); */
        break
    }
    case "MONGO": {
        const { UsersMongoDAO } = await import('./mongo/users.mongo.dao.js')
        usersDAO = new UsersMongoDAO();
        const { ProductsMongoDAO } = await import('./mongo/products.mongo.dao.js')
        productsDAO = new ProductsMongoDAO();
        const { CartsMongoDAO } = await import('./mongo/carts.mongo.dao.js')
        cartsDAO = new CartsMongoDAO();
        const { ChatsMongoDAO } = await import('./mongo/chats.mongo.dao.js')
        chatsDAO = new ChatsMongoDAO();
        break
    }

    default: {
        throw Error(`Unknown datasource '${config.persistence.DATASOURCE}'`)
    }
}

const getDAOS = () => {
    return {
        usersDAO,
        productsDAO,
        cartsDAO,
        chatsDAO,
    }
}

export default getDAOS