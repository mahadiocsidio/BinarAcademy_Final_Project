require('dotenv').config();
const express = require('express');
const app = express();
const { PORT = 3000} = process.env;


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/user.routes');
app.use('/auth', userRouter);


app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
