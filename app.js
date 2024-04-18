import express from 'express';
import { connect } from 'mongoose';
const app = express();
const PORT = 4000;
import UserRoutes from './routes/user';
import ExpenseRoutes from './routes/expense';
import { join } from 'path';
require('dotenv').config();


app.use(json());


connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.log(`Error connecting to the database: ${error}`);
});

// app.get('/', (req, res) => {
//     res.send('Expense Tracker endpoints!');
// });

app.use(join(__dirname, 'frontend'));

app.use('/api/v2/user', UserRoutes);
app.use('/api/v2/user/expenses', ExpenseRoutes);

app.listen(PORT, () => {
    console.log(`Server Running at this port: ${PORT}`);
});