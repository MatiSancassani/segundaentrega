import { Router } from 'express';
import config from '../config.js';
import productsModel from '../dao/models/products.model.js';
import ProductsManager from '../services/products.services.js';
import { getCartByIdService } from '../services/carts.services.js';
import { loginGet, login, logout, registerGet, registerPost } from '../dao/controllers/users.controllers.js';
import { auth } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();

const manager = new ProductsManager();

router.get('/products', async (req, res) => {
    // const products = await productsModel.find().lean();
    const  products  = await manager.newService(req.params.page);
    const user = req.session.user;
    return res.render('index',  {products: products , user ,  title: 'Index'} );
});  

router.get('/products/:page', auth, async (req, res) => {
    const data = await manager.newService(config.PRODUCTS_PER_PAGE, req.params.page)
return res.render('products', {title: 'Productos', data: data});
});

router.get('/realTime', auth, async (req, res) => {
    const products = await productsModel.find().lean();
    res.render('real', {products, title: 'Real Time'});
});

router.get('/profile', async (req, res) => {
    const user = req.session.user
    res.render('profile', {user});
});

router.get('/cart/:cid', auth, async (req, res) => {
    const { cid } = req.params;
    const cart = await getCartByIdService(cid);
    res.render('cart', {title: 'Cart', cart});
});


router.get('/login', loginGet);;
router.post('/login',passport.authenticate('login', {failureRedirect:'/login'}),login)
router.get('/register', registerGet);
router.post('/register',passport.authenticate('register', {failureRedirect:'/register'}) ,registerPost);
router.get('/logout', logout); 


router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res)=>{});
router.get('/ghlogin', passport.authenticate('github',{failureRedirect:'/register'}), login)





// router.get('/profile', (req, res) => {
//     if (!req.session.user) return res.redirect('/login')
//     res.render('profile', {title: 'Profile', style: '', user: req.session.user })
// });
    

        


export default router;
