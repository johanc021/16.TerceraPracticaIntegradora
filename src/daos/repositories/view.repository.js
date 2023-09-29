import { truncateSync } from "fs";
import getDAOS from "../daos.factory.js";

const { cartsDAO, chatsDAO, productsDAO } = getDAOS();

export class ViewRepository {
    constructor() {
        this.daoCarts = cartsDAO;
        this.daoChats = chatsDAO
        this.daoProducts = productsDAO;
    }

    async getAllProducts(page) {
        try {
            return await this.daoProducts.getAll(page, 5)
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAllCarts() {
        try {
            return await this.daoCarts.getAll()
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAllmessages() {
        try {
            return await this.daoChats.getAll();
        } catch (error) {
            throw new Error(error)
        }
    }

    async getCartById(cartId) {
        try {
            return await this.daoCarts.getCart(cartId)
        } catch (error) {
            throw new Error(error)
        }
    }

    async generateUsers(param) {
        try {
            return await this.daoProducts.generateUsers(param)
        } catch (error) {
            throw new Error(error)
        }
    }

}