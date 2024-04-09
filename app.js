const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const UserRoutes = require('./routes/User')
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.log(`Error connecting to the database: ${error}`);
});

app.get('/', (req, res) => {
    res,send('Expense Tracker endpoints!');
});

app.use('', UserRoutes);

app.listen(PORT, () => {
    console.log(`Server Running at this port: ${PORT}`);
});