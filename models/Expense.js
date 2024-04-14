const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserExpense",
    required: true
  }
}, {
    timestamps: true
});

const ExpenseModel = mongoose.model('Expense', ExpenseSchema);

module.exports = ExpenseModel;
