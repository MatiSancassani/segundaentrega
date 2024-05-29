import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';
import { getAll } from '../dao/controllers/products.controllers.js';

const router = Router();

router.get('/', async (req, res) => {
    const products = await productsModel.find().lean();
    res.render('index',  {products, title: 'Index'} );
});

router.get('/realTime', async (req, res) => {
    const products = await productsModel.find().lean();
    res.render('real', {products, title: 'Real Time'});
});



export default router;
