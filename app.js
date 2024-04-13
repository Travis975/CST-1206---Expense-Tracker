const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 4000;
const UserRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config();


app.use(express.json());


mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.log(`Error connecting to the database: ${error}`);
});

// app.get('/', (req, res) => {
//     res.send('Expense Tracker endpoints!');
// });

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/v2/users', UserRoutes);

app.listen(PORT, () => {
    console.log(`Server Running at this port: ${PORT}`);
});