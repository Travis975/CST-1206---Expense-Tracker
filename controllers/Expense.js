const ExpenseModel = require('../models/Expense');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const getAllExpenses = async (req, res) => {

    try {
        const trackedExpenses = await ExpenseModel.find();
        return res.status(200).json({
            message: 'Succesfully found the expenses!',
            data: trackedExpenses
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching expenses!',
            error
        })
    }
}

const createExpense = async (req, res) => {
    const allHeaders = req.headers;

    if (!allHeaders.authorization) {
        return res.status(401).json({
            message: "Please provide the token"
        })
    }
    const token = allHeaders.authorization;   


    const decodedToken = jwt.decode(token, { complete: true});
    
    const userId = decodedToken.payload.id;

    const userExists = await UserModel.findById(userId);

    console.log('this is the user: ',decodedToken);

    if (!userExists) {
        return res.status(401).json({
            message: 'You are not authorized to add an expense!'
        })
    }

    const expenseBody = req.body;

    const newExpense = new ExpenseModel({
        user: userId,
        category: expenseBody.category,
        amount: expenseBody.amount,
        description: expenseBody.description,
        date: expenseBody.date
    })

    const savedExpense = await newExpense.save();

    return res.status(201).json({
        message: "Expense Logged Succesfully!",
        data: savedExpense
    })
    

}

module.exports = {
    getAllExpenses,
    createExpense
}