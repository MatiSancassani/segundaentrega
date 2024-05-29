import { Router } from "express";
import { getCartById, 
        addCart, 
        addProductInCart, 
        deleteProductInCart, 
        updateProductInCart, 
        deleteAllProducts } from "../dao/controllers/carts.controllers.js";


const router = Router();

router.get('/:cid', getCartById )
router.post('/', addCart )
router.post('/:cid/product/:pid', addProductInCart )
router.put('/:cid/products/:pid', updateProductInCart)
router.delete('/:cid/products/:pid', deleteProductInCart )
router.delete('/:cid', deleteAllProducts)
export default router;