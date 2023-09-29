import dotenv from 'dotenv'
import params from './params.js'
import __dirname from '../utils.js'

const mode = params.mode

dotenv.config({
    path: `./.env.${mode}`
})

const config = {
    app: {
        APP_URL: process.env.APP_URL
    },
    mode_enviroment: {
        APP_ENV: process.env.APP_ENV,
    },
    mongo: {
        PORT: process.env.PORT || '',
        MONGO_URI: process.env.MONGO_URI || 3000,
    },
    mailing: {
        SERVICE: process.env.MAILING_SERVICE,
        USER: process.env.MAILING_USER,
        PASSWORD: process.env.MAILING_PASSWORD
    },
    persistence: {
        DATASOURCE: process.env.PERSISTENCE || ''
    },
    jwt: {
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_COOKIE: process.env.JWT_COOKIE
    }

    /* JWT_COOKIE=coderCookie

 */
}

export default config