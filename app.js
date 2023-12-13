require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const { PORT = 3000} = process.env;
const morgan = require('morgan')

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRouter = require('./routes/user.routes');
const profileRouter = require('./routes/profile.routes')
const courseRouter = require('./routes/course.routes')
const chapterRouter = require('./routes/chapter.routes')
const classes = require('./routes/user_course.routes')
const category = require('./routes/category.routes')
const video = require('./routes/video.routes')
const rating = require('./routes/rating.routes')
const payment = require('./routes/payment.routes')
const mentor = require('./routes/mentor.routes')
const mentorCourse = require('./routes/mentor-course.routes')

app.use('/auth', userRouter);
app.use('/profile', profileRouter)
app.use('/course', courseRouter)
app.use('/chapter', chapterRouter)
app.use('/class', classes)
app.use('/category', category)
app.use('/video', video)
app.use('/rating', rating)
app.use('/payment',payment)
app.use('/mentor',mentor)
app.use('/mentor-course',mentorCourse)

app.use('/',(req,res)=>{
    try {
        const welcomeMessage = {
          message: 'Selamat datang di API kami!'
        };
        res.json(welcomeMessage);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan internal server' });
      }
})

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
