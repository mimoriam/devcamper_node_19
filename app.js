// npm install --save-dev nodemon
// npm i mongoose
// npm i slugify
// npm i node-geocoder
// node seeder -i or -d
// npm i express-fileupload
// npm i jsonwebtoken bcryptjs
// npm i nodemailer

const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectToDB = require('./config/db');

// Load env vars:
dotenv.config({ path: './config/config.env' });

// Route files:
const bootcampRouter = require('./routes/bootcamps');
const courseRouter = require('./routes/courses');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const reviewRouter = require('./routes/reviews');

// Connect to mongodb:
connectToDB().then();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express-fileupload:
app.use(fileupload({}));

// Mount Routers:
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Use Error Handler:
app.use(errorHandler);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
