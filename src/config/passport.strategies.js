import passport from "passport";
import local from 'passport-local';
import gitHubStrategy from 'passport-github2';
import { getUserById, getUserEmail, registerUser } from "../services/users.services.js";
import { createHash, isValidPassword } from "../utils/bcryptPassword.js";
import config from "../config.js";

const LocalStrategy = local.Strategy;

export const initialPassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, 
        async(req, username, password, done)=> {
            try {
                const { confirmPassword } = req.body

                if (password !== confirmPassword) {
                    return done (null, false);
                }

                const user = await getUserEmail(username);

                if (user) {
                    return done (null, false);
                }

                req.body.password = createHash(password);
                
                const newUser = await registerUser({...req.body});
                if (newUser) {
                    return done (null, newUser)
                } else {
                    return done (null, false);
                }


            } catch (error) {
                done(error)
            }
        }));

    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, 
        async(username, password, done)=>{
            try {
                const user = await getUserEmail(username);

                if (!user) {
                    return done (null, false);
                }

                if (!isValidPassword(password,user.password)) {
                    return done (null, false);
                }

                return done (null, user);
            } catch (error) {
                done(error)
                
            }
        }));

    passport.use('github', new gitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async(accessToken, refreshToken, profile, done)=> {
            try {
                const email = profile._json.email
                const user = await getUserEmail(email)

                if(user)
                    return done (null, user);

                const newUser = {
                    name: profile._json.name,
                    email, 
                    password:'.$',
                    github: true
                };
                const result = await registerUser({...newUser})
                return done(null, result);
            } catch (error) {
                done(error)
            }
    }) )

    passport.serializeUser((user, done)=> {
            done(null, user._id);
        });

    passport.deserializeUser(async (id, done)=> {
            const user = await getUserById(id);
            done(null, user);
        });
}


// Estructura base del middware
// passport.use('github', new gitHubStrategy(
//     {},
//     async()=> {
// }) )