import productsModel from "../dao/models/products.model.js";



export const getAllService = async (req) => {
    try {   
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let sort = req.query.sort;
        if (sort === 'asc' || sort === 'desc') {
            sort = { price: sort}
        } else {
            sort = null
        }
        const products =  await productsModel.paginate({}, {page, limit, sort, lean: true});
        
        const hasNextPage = products.hasNextPage;
        const hasPrevPage = products.hasPrevPage;          
        const totalPages = products.totalPages;
        const prevPage = products.prevPage;
        const nextPage = products.nextPage;
        const prevLink = products.prevLink;
        const nextLink = products.nextLink;

        return {
            hasNextPage,
            hasPrevPage,
            totalPages,
            prevPage,
            nextPage,
            prevLink,
            nextLink,
            payload: products,
        }
        
    } catch (err) {
        console.log('getAll ->', err);
    }
}

export const getByIdService = async (pid) => {
    try {        
        return await productsModel.findById(pid);
    } catch (err) {
        console.log('getByIdService ->', err);
    }
}

export const addService = async ({title, description, price, thumbnail, stock , code, status ,category }) => {
    try {
       

        // if (!title, !description, !price, !stock, !code, !category) {
        //     return res.status(404).send({ msg: 'Faltan campos por completar' });
            
        // }        
        return await productsModel.create({title, description, price, thumbnail, stock , code, status ,category })
    } catch (err) {
        console.log('addService ->', err);
    }
}

export const updateService = async (pid, rest) => {
    try {
        return await productsModel.findByIdAndUpdate(pid, {...rest}, {new: true}).lean();
    } catch (err) {
        console.log('updateService ->', err);
    }
}

export const removeService = async (pid) => {
    try {
        return await productsModel.findByIdAndDelete(pid).lean();
    } catch (err) {
        console.log('removeService ->', err);
    }
}

class ProductsManager {
    constructor() {
    }
    newService = async (limit , page = 1) => {
        try {
            if (limit === 0) {
                return await productsModel.find().lean();
            } else {
                return await productsModel.paginate({}, { page: page, limit: limit, lean: true });
            }
        } catch (err) {
            return err.message;
        };
       
         
    }
}

export default ProductsManager;
