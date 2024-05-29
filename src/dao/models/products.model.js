import {Schema, mongoose} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'product';

const productsSchema = new mongoose.Schema ({
    
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: false },
    stock: { type: Number, required: true },
    code: { type: String, required: false },
    status: { type: Boolean, required: false },
    category: { type: String, required: false }
    
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collection, productsSchema);

export default productsModel;