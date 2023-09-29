import winston from 'winston';
import { STATUS } from '../constantes.js';

const levelOptions = {
    levels: {
        debug: 1,
        http: 2,
        info: 3,
        warning: 4,
        error: 5,
        fatal: 6,
    },
    colors: {
        debug: 'green',
        http: 'gray',
        info: 'blue',
        warning: 'yellow',
        error: 'cyan',
        fatal: 'red',
    }
};

let logger;

if (process.env.APP_ENV === 'PRODUCTION') {
    logger = winston.createLogger({
        levels: levelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ colors: levelOptions.colors }),
                    winston.format.timestamp(),
                    winston.format.simple()
                )
            }),
            new winston.transports.Console({
                level: "fatal",
                format: winston.format.combine(
                    winston.format.colorize({ colors: levelOptions.colors }),
                    winston.format.timestamp(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: './errors.log',
                level: 'fatal',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        ]
    });
} else {
    console.log("entras aqui")
    logger = winston.createLogger({
        levels: levelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: levelOptions.colors }),
                    winston.format.simple()
                )
            })
        ]
    });
}

export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
};

export const createResponse = (res, statusCode, data) => {
    res.status(statusCode).json({ ...data, status: statusCode === 200 ? STATUS.SUCCESS : STATUS.FAIL });
};

export const handleRequestError = (res, statusCode, error) => {
    console.error(error); // Loguear error en consola para debug
    createResponse(res, statusCode, { error: error.message, code: error.code, cause: error.cause });
};

export const logRequestInfo = (req) => {
    req.logger.info(`Petición para ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
};

export const logRequestError = (req, error) => {
    req.logger.error(`Error en la petición para ${req.method} en ${req.url} - ${error.message} - ${new Date().toLocaleTimeString()}`);
};

export const logRequestDebug = (req, error) => {
    req.logger.debug(`Error en la petición para ${req.method} en ${req.url} - ${error.message} - ${new Date().toLocaleTimeString()}`);
}

