import { request, response } from "express"
import { getUserEmail, registerUser } from "../../services/users.services.js";




export const loginGet = async (req = request, res =response) => {
    return res.render ('login', {title: 'Login'})
};

export const registerGet = async (req = request, res =response) => {
    return res.render ('register', {title: 'Register'})
};

export const registerPost = async (req = request, res =response) => {
        
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/register');
    }
    const user = await registerUser({...req.body});

    if (user) {
        const userName = `${user.name} ${user.lastName}`;
        req.session.user = userName;
        req.session.rol = user.rol;

        return res.redirect('/login');
        
    }

    return res.redirect('/register');
};

export const loginPost = async (req = request, res =response) => {

        const {email, password } = req.body;
        const user = await getUserEmail(email);

        if (user && user.password === password) {
        const userName = `${user.name} ${user.lastName}`;
        req.session.user = userName;
        req.session.rol = user.rol;
        return res.redirect('/products');
        }

        return res.redirect('/login');
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


