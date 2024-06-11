import { mongoose } from "mongoose";

mongoose.pluralize(null);

const collection = 'user';

const usersSchema = new mongoose.Schema ({
    
    name: { type: String, required: [true, 'Name is required'] },
    lastName: { type: String },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    rol: { type: String,  default:'user', enum: ['user', 'admin'] },
    status: { type: Boolean, required: false },
    dateOfCreation: { type: Date, default: Date.now },    
    github: {type: Boolean, default: false},
    
});



const usersModel = mongoose.model(collection, usersSchema);

export default usersModel;
