import { request, response } from "express"




export const loginGet = async (req = request, res =response) => {
    return res.render ('login', {showError: req.query.error ? true : false, errorMessage: req.query.error, title: 'Login'})
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
            image: req.user.image,
            rol:req.user.rol
        }


       return res.redirect('/products')
       
};

export const jwtlogin = async (req = request, res =response) => {
    try {
        // Passport inyecta los datos del done en req.user
        // Creamos un token (una nueva credencial) para enviarle al usuario
        const token = createToken(req.user, '1h');
        // Notificamos al navegador para que almacene el token en una cookie
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.status(200).send({ origin: config.SERVER, payload: 'Usuario autenticado' });
        // También podemos retornar el token en la respuesta, en este caso el cliente tendrá
        // que almacenar manualmente el token.
        // res.status(200).send({ origin: config.SERVER, payload: 'Usuario autenticado', token: token });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
    
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

