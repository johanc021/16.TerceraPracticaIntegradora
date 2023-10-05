import passport from "passport";
import passportJWT from "passport-jwt";
import local from 'passport-local'
import { cookieExtractor, isValidPassword, createHast, isMatch } from "../../utils.js";
import config from "../config.js";
import userModel from '../../daos/schema/users.schema.js'
import { SaveUserDTO } from "../../daos/dto/users.dto.js";
import { extractToken } from "../../utils/resetPassword.js";
import { redirectToLogin } from "../../utils/redirects.js";

const localStrategy = local.Strategy;
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const initializedPassport = () => {
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {

          //Opcion 1 - para devolver el usuario de la base de datos de acuerdo a la cookie (funciona)
          /* const user = await userModel.findOne({ email: jwt_payload.email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          return done(null, user); */

          //Opcion 2 - devuelve los datos de la cookie - se debe comentar si se va a utilizar el codigo comentado
          return done(null, jwt_payload);

        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use('register', new localStrategy(
    { passReqToCallback: true, usernameField: 'email', session: false }, async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body;
      try {
        let user = await userModel.findOne({ email: username });
        if (user) {
          return done(null, false, { message: 'Correo electrónico ya registrado' });
        }
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHast(password)
        };
        const userPayload = new SaveUserDTO(newUser)
        let result = await userModel.create(userPayload);
        return done(null, result);
      } catch (error) {
        return done("Error de usuario" + error);
      }
    }
  ));

  passport.use('login', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        console.log(user.password)
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        console.log(isMatch(password, user.password))
        if (!isMatch(password, user.password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('resetPassword', new localStrategy(
    { passReqToCallback: true, usernameField: 'token' }, async (req, res, password) => {
      const { token } = req.body
      try {
        // Extrae el usuario desde el token
        const userId = extractToken(token);

        const user = await userModel.findOne({ _id: userId });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        if (isMatch(password, user.password)) {
          console.log("La nueva contraseña es igual a la existente en la base de datos");
          return res.status(400).json({ status: "error", error: "La contraseña ya existe en la base de datos" });
        }
        // Hashea la nueva contrasñea
        const newHashedPassword = createHast(password);
        //actualiza el modelo
        await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

        // redirecciona al login
        console.log('contraseña restablecida')
        redirectToLogin(req, res);
        /* res.status(201).json({ status: "success", user }) */
      } catch (error) {
        return error
      }
    }
  ));


  /* passport.use('resetPassword', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Actualizar la contraseña en la base de datos
        const newHashedPassword = createHast(password);
        await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

        // Retorna el usuario actualizado (opcional)
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )); */

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
  })
};

export default initializedPassport;
