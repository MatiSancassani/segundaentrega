import { request, response } from "express"
import { getUserEmail, registerUser } from "../../services/users.services.js";
import { createHash, isValidPassword } from "../../utils/bcryptPassword.js";




export const loginGet = async (req = request, res =response) => {
    return res.render ('login', {title: 'Login'})
};

export const registerGet = async (req = request, res =response) => {
    return res.render ('register', {title: 'Register'})
};

export const registerPost = async (req = request, res =response) => {
    if (!req.user) 
        return res.redirect('/register');
        
    return res.redirect('/login');
    
};

export const login = async (req = request, res =response) => {

       if (!req.user)
            return res.redirect('/login');
        
        req.session.user = {
            name:req.user.name, 
            lastName:req.user.lastName, 
            email:req.user.email, 
            rol:req.user.rol
        }
       return res.redirect('/products')
       
};

export const logout = async (req = request, res =response) => {
    try {
        req.session.destroy((err) => {
        if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
                    // res.status(200).send({ origin: config.SERVER, payload: 'Usuario desconectado' });
        res.redirect('/login'); 
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};

// export const loginGithub = async (req = request, res =response) => {
//     if (!req.user) {
//         return res.redirect('/login');
//     }
//     req.session.user = {
//         name:req.user.name, 
//         lastName:req.user.lastName, 
//         email:req.user.email, 
//         rol:req.user.rol
//     }
//    return res.redirect('/products')
// }


