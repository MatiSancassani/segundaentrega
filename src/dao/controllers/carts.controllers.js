import { request, response } from 'express';
import config from '../../config.js'
import cartModel from '../models/carts.model.js';


export const getCartById = async (req = request, res= response) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.id'); //Traemos todas las propiedades dentro del cart
        
        res.status(200).send({ origin: config.SERVER, payload: { cart }});         
    } catch (err) {
        console.log('getCartById ->', err)
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};


export const addCart = async (req = request, res= response) => {
    try {
        const cart = await cartModel.create({});
        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (err) {
        console.log('addCart ->', err)
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};

export const addProductInCart = async (req = request, res= response) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);

        if (!cart) {
            console.log(`El carrito con ${cid} no existe`)
        }
        const productInCart = cart.products.find(p => p.id.toString() === pid);

        if (productInCart)
            productInCart.quantity++;
         else 
            cart.products.push({ id: pid, quantity: 1 });

        cart.save();
        res.status(200).send({ origin: config.SERVER, payload: { cart } });

    } catch (err) {
        console.log('addProductInCart ->', err)
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};

export const updateProductInCart = async (req = request, res= response) => {
    try {

        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (!quantity || !Number.isInteger(quantity)) {
            console.log('Debe ser un numero entero')
        }

        const cart = await cartModel.findOneAndUpdate(
            {_id: cid, 'products.id': pid },
            {$set: {'products.$.quantity' :quantity}},
            {new: true}
        );
        
        res.status(200).send({ origin: config.SERVER, payload: { cart } });
    } catch (err) {
        console.log('deleteProductInCart ->', err)
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};

export const deleteProductInCart = async (req = request, res= response) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findByIdAndUpdate(cid, {$pull:{'products':{id:pid}}}, { new: true });
        
        res.status(200).send({ origin: config.SERVER, payload: { cart } });
    } catch (err) {
        console.log('deleteProductInCart ->', err)
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};

export const deleteAllProducts = async (req = request, res= response) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findByIdAndUpdate(cid, {$set:{'products':[]}}, { new: true });
        // const cart = await cartModel.findByIdAndDelete(cid); // Eliminariamos todo el carrito
        res.status(200).send({ origin: config.SERVER, payload: { cart } });

    } catch (err) {
        console.log('deleteAllProducts ->', err)
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
};



