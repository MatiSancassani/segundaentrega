import passport from "passport";
import local from 'passport-local';
import gitHubStrategy from 'passport-github2'; 
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
import jwt from 'passport-jwt';


import { getUserById, getUserEmail, registerUser } from "../services/users.services.js";
import { createHash, isValidPassword } from "../utils/bcryptPassword.js";
import config from "../config.js";


dotenv.config();
const LocalStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const jwtExtractor = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies[`${config.APP_NAME}_cookie`];
    
    return token;
}


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
                    email: email, 
                    password:'.$',
                    image: profile._json.avatar_url,
                    github: true
                };
                const result = await registerUser({...newUser});

                return done(null, result);

            } catch (error) {
                done(error)
            }
        }));

     passport.use('google', new GoogleStrategy(
     {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
     },
     async(accessToken, refreshToken, profile, cb)=> {
        try {
            const email = profile._json.email
            const user = await getUserEmail(email)

            if(user)
                return cb (null, user);

            const newUser = {
                name: profile._json.name,
                email: email, 
                password:'.$',
                image: profile._json.picture,
                google: true
            };
            const result = await registerUser({...newUser});

            return cb(null, result);

        } catch (error) {
            cb(error)
        }
         }));

    passport.use('jwtlogin', new jwtStrategy(
        {
            jwtFromRequest: jwtExtractor.fromExtractors([cookieExtractor]),
            secretOrKey: config.SECRET
        },
            async(jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (err) {
                    return done(err);
                }
        }));

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