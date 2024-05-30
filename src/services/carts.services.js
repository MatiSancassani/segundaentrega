import cartModel from "../dao/models/carts.model.js";


export const getCartByIdService = async (cid) => {
    try {
        return cartModel.findById(cid).populate('products.id').lean(); //Traemos todas las propiedades dentro del cart
               
    } catch (err) {
        console.log('getCartByIdService ->', err);
        throw err;
    }
};


export const addCartService = async () => {
    try {
        return await cartModel.create({});
    } catch (err) {
        console.log('addCartService ->', err);
        throw err;
    }
};

export const addProductInCartService = async (cid, pid) => {
    try {
        const cart = await cartModel.findById(cid)

        if (!cart) {
            return null;
        }
        const productInCart = cart.products.find(p => p.id.toString() === pid);

        if (productInCart)
            productInCart.quantity++;
         else 
            cart.products.push({ id: pid, quantity: 1 });

        cart.save();

        return cart;
    } catch (err) {
        console.log('addProductInCartService ->', err);
        throw err;
    }
};

export const updateProductInCartService = async (cid, pid, quantity) => {
    try {
        return await cartModel.findOneAndUpdate(
            {_id: cid, 'products.id': pid },
            {$set: {'products.$.quantity' :quantity}},
            {new: true}
        );
    } catch (err) {
        console.log('deleteProductInCart ->', err);
        throw err;
    }
};

export const deleteProductInCartService = async (cid, pid) => {
    try {
        return await cartModel.findByIdAndUpdate(cid, {$pull:{'products':{id:pid}}}, { new: true });
    } catch (err) {
        console.log('deleteProductInCartService ->', err);
        throw err;
    }
};

export const deleteAllProductsService = async (cid) => {
    try {
        return cartModel.findByIdAndUpdate(cid, {$set:{'products':[]}}, { new: true });
    //  return cartModel.findByIdAndDelete(cid); // Eliminariamos todo el carrito

    } catch (err) {
        console.log('deleteAllProductsService ->', err);
        throw err;
    }
};
