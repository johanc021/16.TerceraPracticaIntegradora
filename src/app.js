import express from "express";
import __dirname from './utils.js'
import session from "express-session";
import MongoStore from "connect-mongo";
import appRouter from "./routers/app.router.js"
import appViewsRouter from "./routers/app.views.router.js";
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import { Server } from 'socket.io'
import passport from "passport";
import initializedPassport from "./config/middlewareAuth/passport.middleware.js";
import initPassportGithub from "./config//middlewareAuth/passportGithub.config.js";
import cookieParser from 'cookie-parser'
import config from "./config/config.js";
/* import env from './config/config.js' */
import cors from 'cors'
import middlewareErrors from './config/middlewareErrors/indexControlError.js'
import { addLogger } from "./utils/winston/logger.js";

const app = express();

const connection = mongoose.connect(
    config.mongo.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//sesiones
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.MONGO_URI,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 3600
    }),
    secret: config.jwt.JWT_COOKIE,
    resave: false,
    saveUninitialized: false

}))

//passport
initializedPassport();
initPassportGithub();
app.use(passport.initialize())
app.use(cookieParser())

// uso de json con postman
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cors
app.use(cors())

// Middleware customErrors
app.use(middlewareErrors)

//Logger
app.use(addLogger)

// rutas del router API - Navegador
app.use('/api', appRouter)
app.use('/', appViewsRouter)


const server = app.listen(config.mongo.PORT, () => {
    console.log("Servidor levantado en http://localhost:8080")
})

const socketServer = new Server(server)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})

export default socketServer
