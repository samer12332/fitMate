const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticateToken = require('./middlewares/authenticateToken');
const allowedTo = require('./middlewares/allowedTo');
const isConfirmed = require('./middlewares/isConfirmed');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/usersRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();
dotenv.config();

const cors = require('cors');
app.use(cors());
app.use(passport.initialize());

const port = process.env.PORT || 3001;
const dbUri = process.env.DB_URI;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', authenticateToken, isConfirmed, allowedTo('SUBSCRIBER'), (req, res) => {
    res.send('Success'); 
});


//dbConnection
mongoose.connect(dbUri) 
.then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
});


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({
        status: err.statusText || 'error',
        message: err.message,
        code: err.statusCode || 500
    }); 
});


//Only Used Once
// const crypto = require('crypto');
// const passport = require('passport');
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);
