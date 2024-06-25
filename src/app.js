import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
// import FileStore from 'session-file-store' Al usar almancenamiento en mongo desabilitamos, si queremos almacenar en archivo activamos

import config from './config.js';
import initSocket from './socket.js';
import { initialPassport } from './config/passport.strategies.js';

import productsRoutes from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
// const fileStorage = fileStorage(session); Habilitamos si necesitamos almacenar archivo


const expressInstance = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);

    const socketServer = initSocket(expressInstance);
    app.set('socketServer', socketServer);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true})); 
    app.use(cookieParser(config.SECRET));

    
    app.use(session({
        // store:new fileStorage({ path: './session', ttl: 15, retries: 0 }), //Almacenamiento archivo
        store: MongoStore.create({
            mongoUrl: config.MONGODB_URI,
            ttl: 1000 //seg
        }), //Almacenando en la Base de datos
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true
    }))

    initialPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/', viewsRouter);
    app.use('/api/products', productsRoutes);
    app.use('/api/carts', cartsRouter);
    app.use('/static', express.static(`${config.DIRNAME}/public`));

    console.log(`Servidor escuchando en el PORT: ${config.PORT}`)
});



