import passport from 'passport';
/* import userModel from '../dao/models/users.js' */
import userModel from '../../daos/schema/users.schema.js'
import gitHubStrategy from "passport-github2"

const initPassportGithub = () => {
    passport.use('github', new gitHubStrategy({
        clientID: "Iv1.5fc2ea363a045e15",
        clientSecret: "8cddbe51c0fcedc867d4e9014ab8b13ce500f581",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.family_name || '',
                    email: profile._json.email,
                    age: '',
                    role: 'user',
                    password: ''
                }
                let result = await userModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }
    ))
}

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
})

export default initPassportGithub;