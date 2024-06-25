import { request, response } from "express";
import config from "../config.js";

export const verifyAuthoentication = (req = request, res = response, next) => {

    if (!req.user) return res.status(401).send({ origin: config.SERVER, payload: 'Usuario no autenticado' });

    return next();
}

export const verifyAuthorization = (req = request, res = response, next) => {
   
    if (req.session.user?.rol !== 'admin') return res.status(403).send({ origin: config.SERVER, payload: 'No tiene permisos para acceder al recurso' });
            
    next();

}