import  usersModel  from '../dao/models/users.model.js'

export const getUserEmail = async (email) => {
    try {
        return await usersModel.findOne({email});
    } catch (error) {
        console.log('getUserEmail ->', error);
        throw error;     
    }
}

export const registerUser = async (user) => {
    try {
        return await usersModel.create({...user});
    } catch (error) {
        console.log('registerUser ->', error);
        throw error;     
    }
}