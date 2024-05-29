import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'

import config from './config.js';
import initSocket from './socket.js';

import productsRoutes from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js'


const app = express();

const expressInstance = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);

    const socketServer = initSocket(expressInstance);
    app.set('socketServer', socketServer);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/', viewsRouter);
    app.use('/api/products', productsRoutes);
    app.use('/api/carts', cartsRouter);
    app.use('/static', express.static(`${config.DIRNAME}/public`));

    console.log(`Servidor escuchando en el PORT: ${config.PORT}`)
});



