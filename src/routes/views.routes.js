import { Router } from 'express';
import config from '../config.js';
import productsModel from '../dao/models/products.model.js';
import ProductsManager from '../services/products.services.js';
import { getCartByIdService } from '../services/carts.services.js';
import { loginGet, loginPost, logout, registerGet, registerPost } from '../dao/controllers/users.controllers.js';
import { auth } from '../middleware/auth.js';


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

router.get('/cart/:cid', auth, async (req, res) => {
    const { cid } = req.params;
    const cart = await getCartByIdService(cid);
    res.render('cart', {title: 'Cart', cart});
});


router.get('/login', loginGet);;
router.post('/login', loginPost)
router.get('/register', registerGet);
router.post('/register', registerPost);
router.get('/logout', logout); 







// router.get('/profile', (req, res) => {
//     if (!req.session.user) return res.redirect('/login')
//     res.render('profile', {title: 'Profile', style: '', user: req.session.user })
// });
    

        


export default router;
