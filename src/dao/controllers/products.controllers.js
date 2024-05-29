import { request, response } from 'express';
import config from '../../config.js'
import productsModel from '../models/products.model.js';

export const getAll = async (req = request, res= response) => {
    try {   
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let sort = req.query.sort;
        if (sort === 'asc' || sort === 'desc') {
            sort = { price: sort}
        } else {
            sort = null
        }
        const filter = {};


        const products = await productsModel.paginate(filter, {page, limit, sort} );

        const hasNextPage = products.hasNextPage;
        const hasPrevPage = products.hasPrevPage;          
        const totalPages = products.totalPages;
        const prevPage = products.prevPage;
        const nextPage = products.nextPage;
        const prevLink = products.prevLink;
        const nextLink = products.nextLink;

        const response = {
            hasNextPage,
            hasPrevPage,
            totalPages,
            prevPage,
            nextPage,
            prevLink,
            nextLink,
            payload: products,
        }
        
        res.status(200).send({ origin: config.SERVER, payload: { response } });
    } catch (err) {
        console.log('getAll ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const getById = async (req = request, res= response) => {
    try {
        const { pid } = req.params;
        const product = await productsModel.findById(pid);
        if (!product) {
            res.status(404).send({ msg: 'El producto no existe' });
        }
        res.status(200).send({ origin: config.SERVER, payload: { product } });
    } catch (err) {
        console.log('getById ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const add = async (req = request, res= response) => {
    try {
        const {title, description, price, thumbnail, stock , code, status ,category } = req.body;

        // if (!title, !description, !price, !thumbnail, !stock, !code, !status, !category) {
        //     return res.status(404).send({ msg: 'Faltan campos por completar' });
            
        // }        
        const producto = await productsModel.create({title, description, price, thumbnail, stock , code, status ,category})
        
        res.status(200).send({ origin: config.SERVER, payload: ({msg: 'Producto agregado exitosamente', producto}) });
    } catch (err) {
        console.log('add ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const update = async (req = request, res= response) => {
    try {
        const { pid } =req.params;
        const {_id, ...rest} = req.body;
        const producto = await productsModel.findByIdAndUpdate(pid, {...rest}, {new: true}).lean();
        res.status(200).send({ origin: config.SERVER, payload: ({msg: 'Se actualizo el producto', producto}) });
    } catch (err) {
        console.log('update ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const remove = async (req = request, res= response) => {
    try {
        const { pid }= req.params;
        const producto = await productsModel.findByIdAndDelete(pid).lean();
        res.status(200).send({ origin: config.SERVER, payload: ({msg: 'Producto eliminado', producto})});
    } catch (err) {
        console.log('remove ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}
