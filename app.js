require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { PORT = 3000} = process.env;
const morgan = require('morgan')

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRouter = require('./routes/user.routes');
const profileRouter = require('./routes/profile.routes')
const courseRouter = require('./routes/course.routes')
const chapterRouter = require('./routes/chapter.routes')

app.use('/auth', userRouter);
app.use('/profile', profileRouter)
app.use('/course', courseRouter)
app.use('/chapter', chapterRouter)


app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
