import { request, response } from "express";

export const auth = (req = request, res = response, next) => {

    if(req.session?.rol !== 'admin')
        return res.status(403).send({payload: 'Access dennied'})

    return next();
}