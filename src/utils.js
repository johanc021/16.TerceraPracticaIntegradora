import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt, { genSaltSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "./config/config.js";

export const createHast = password => bcrypt.hashSync(password, genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user)

export const isMatch = (passwordNew, passwordOld) => bcrypt.compareSync(passwordNew, passwordOld);

const generateToken = (user) => {
    const token = jwt.sign({ ...user }, config.jwt.JWT_SECRET, { expiresIn: '24h' });
    return token
}

const cookieExtractor = (req, res) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['cookie']
    }
    return token
}

// para generar el ticket
function generateTicketCode() {
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 10000);
    const ticketCode = `TICKET-${timestamp}-${randomValue}`;

    return ticketCode;
}
//para calcular el valor total de compra
function calculateTotalAmount(productsPurchased) {
    // Calcula el monto total de la compra sumando el precio de los productos comprados
    let totalAmount = 0;

    for (const productItem of productsPurchased) {
        const { product, quantity } = productItem;
        // Suponiendo que cada elemento de productsPurchased tiene un campo "price" que representa el precio del producto
        const productPrice = product.price;
        totalAmount += productPrice * quantity;
    }

    return totalAmount;
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { generateToken, cookieExtractor, generateTicketCode, calculateTotalAmount };

export default __dirname