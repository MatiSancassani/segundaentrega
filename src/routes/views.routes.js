import { Router } from 'express';
import config from '../config.js';
import productsModel from '../dao/models/products.model.js';
import ProductsManager from '../services/products.services.js';
import { getCartByIdService } from '../services/carts.services.js';


const router = Router();
const manager = new ProductsManager();



router.get('/', async (req, res) => {
    // const products = await productsModel.find().lean();
    const  products  = await manager.newService(req.params.page)
    return res.render('index',  {products: products , title: 'Index'} );
});  



router.get('/products/:page', async (req, res) => {
    const data = await manager.newService(config.PRODUCTS_PER_PAGE, req.params.page)
return res.render('products', {title: 'Productos', data: data});
});




router.get('/realTime', async (req, res) => {
    const products = await productsModel.find().lean();
    res.render('real', {products, title: 'Real Time'});
});

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await getCartByIdService(cid);
    res.render('cart', {title: 'Cart', cart});
});


export default router;
