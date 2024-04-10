const UserModel = require('../models/user');

const RegisterUser = async (req,res) => {
    const userBody = req.body;

    if (!userBody.name || !userBody.email || !userBody.password){
        return res.status(400).json({
            message: 'Name, Email, or Password missing!'
        })
    }

    const userExists = await UserModel.findOne({ email: userBody.email });

    if (userExists){
        return res.status(403).json({
            message: 'User already exists, use a different email'
        })
    }

    const newUser = new UserModel({
        name: userBody.name,
        email: userBody.email,
        password: userBody.password
    })
    try {
        const savedUser = await newUser.save();
        return res.status(201).json({
            mesaage: 'User Register Succesfully',
            data: savedUser
        })
    } catch(error){
        return res.status(500).json({
            message: 'There was an error',
            error
        })
    }
    
}

const GetUsers = async (req,res) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json({
            message: "Succesfully found the users!",
            data: users
        })
    }catch(error){
        return res.status(500).json({
            message: "There was an error fetching users!",
            error
        })
    }
}

const GetUserById = async (req,res) => {

}
module.exports = {
    RegisterUser,
    GetUsers
}
