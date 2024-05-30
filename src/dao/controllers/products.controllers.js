import { request, response } from 'express';
import config from '../../config.js'
import { addService, 
    getAllService, 
    getByIdService, 
    removeService, 
    updateService } from '../../services/products.services.js';


export const getAll = async (req = request, res= response) => {
    try {
        const products = await getAllService(req);
        res.status(200).send({ origin: config.SERVER, payload: {result: products}  });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const getById = async (req = request, res= response) => {
    try {
        const { pid } = req.params;
        const product = await getByIdService(pid);
        if (!product) {
            res.status(404).send({ msg: 'El producto no existe' });
        }
        res.status(200).send({ origin: config.SERVER, payload: product });
    } catch (err) {
        console.log('getById ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const add = async (req = request, res= response) => {
    try {        
        const {title, description, price, thumbnail, stock , code, status ,category } = req.body;

        if (!title, !description, !price, !stock, !code, !category) {
            return res.status(404).send({ msg: 'Faltan campos por completar' });
            
        }     
        const product = await addService(req.body);
        res.status(200).send({ origin: config.SERVER, payload: ({msg: 'Producto agregado exitosamente', product}) });
    } catch (err) {
        console.log('add ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const update = async (req = request, res= response) => {
    try {
        const { pid } =req.params;
        const {_id, ...rest} = req.body;
        const producto = await updateService(pid, rest);
        res.status(200).send({ origin: config.SERVER, payload: ({msg: 'Se actualizo el producto', producto}) });
    } catch (err) {
        console.log('update ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}

export const remove = async (req = request, res= response) => {
    try {
        const { pid }= req.params;
        const producto = await removeService(pid);
        res.status(200).send({ origin: config.SERVER, payload: ({msg: 'Producto eliminado', producto})});
    } catch (err) {
        console.log('remove ->', err);
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
}
