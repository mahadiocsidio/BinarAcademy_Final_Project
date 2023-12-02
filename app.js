require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const { PORT = 3000} = process.env;
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');
const fs = require('fs')
const file  = fs.readFileSync('./documentation/swagger.yaml', 'utf8')
const swaggerDocument = yaml.parse(file)

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRouter = require('./routes/user.routes');
const profileRouter = require('./routes/profile.routes')
const courseRouter = require('./routes/course.routes')
app.use('/auth', userRouter);
app.use('/profile', profileRouter)
app.use('/course', courseRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
