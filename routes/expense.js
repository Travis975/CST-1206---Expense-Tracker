const express = require('express');
const Router = express.Router();
const ExpenseController = require('../controllers/Expense');

// Create expense API
Router.post('/', ExpenseController.createExpense)

// Get All Expenses API
Router.get('/', ExpenseController.getAllExpenses);

// Get Expenses by Month API
Router.get('/by-month', ExpenseController.getExpensesByMonth);

// Delete Expense
Router.delete('/:id', ExpenseController.deleteExpense);

module.exports = Router;