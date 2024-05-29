import { Server } from "socket.io";
import productModel from './dao/models/products.model.js'
import cartModel from './dao/models/carts.model.js'


const initSocket = (httpServer) => {
    const io = new Server(httpServer);

    
    io.on('connection', async (socket) => {
        const products = await productModel.find();
        socket.emit('products', products);
        
        socket.on('addProduct', async (product) => {
            const newProduct = await productModel.create({...product});
            if (newProduct) {
                products.push(newProduct)
                socket.emit('products', products);                
            }
        })
    })
}


export default initSocket;