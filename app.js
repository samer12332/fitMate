const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoute');
const authenticateToken = require('./middlewares/authenticateToken');
const allowedTo = require('./middlewares/allowedTo');
const isConfirmed = require('./middlewares/isConfirmed');

//Only Used Once
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);

const app = express();
dotenv.config();

const port = process.env.PORT || 3001;
const dbUri = process.env.DB_URI;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', authenticateToken, isConfirmed, allowedTo('SUBSCRIBER'), (req, res) => {
    res.send('Success');
});

mongoose.connect(dbUri)
.then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
});


app.use('/api/user', authRouter);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || 'error',
        message: err.message,
        code: err.statusCode || 500
    });
});
