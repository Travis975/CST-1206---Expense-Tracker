const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const RegisterUser = async (req,res) => { 
    // console.log(req.body);
    const userBody = req.body;

    if (!userBody.name || !userBody.email || !userBody.password){
        return res.status(400).json({
            message: 'Name, Email, or Password missing!'
        });
    }

    const userExists = await UserModel.findOne({ email: userBody.email });

    if (userExists) {
        console.log(userExists, 'user found!');
        return res.status(403).json({
            message: 'User already exists, use a different email'
        });
    }

    const encryptedPassword = await bcrypt.hash(userBody.password, 10);

    const newUser = new UserModel({
        name: userBody.name,
        email: userBody.email,
        password: encryptedPassword
    })
    try {
        const savedUser = await newUser.save();
        return res.status(201).json({
            message: 'User Registered Succesfully!',
            data: savedUser
        })
    } catch(error){
        return res.status(500).json({
            message: 'There was an error registering',
            error
        })
    }
    
}

const LoginUser = async (req, res) => {
    const userBody = req.body;
    if (!userBody.email || !userBody.password){
        return res.status(400).json({
            message: 'Email, or Password missing!'
        })
    }
    const userExists = await UserModel.findOne({ email: userBody.email });

    if (!userExists){
        return res.status(401).json({
            message: 'User Does Not Exists'
        })
    }

    const isPasswordSame = await bcrypt.compare(userBody.password, userExists.password);

    if (!isPasswordSame) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        })
    }

    const accessToken = jwt.sign({
        emai: userExists.email,
        name: userExists.name,
        id: userExists._id
    }, process.env.JWT_SECRET_KEY);

    const userData = {
        id: userExists._id,
        email: userExists.email,
        name: userExists.name,
        token: accessToken
    }

    return res.status(200).json({
        message: "User Logged In!",
        data: userData

    })

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
    GetUsers,
    LoginUser
}
