// npm install --save-dev nodemon
// npm i mongoose
// npm i slugify

const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHandler = require('./middleware/error');
const connectToDB = require('./config/db');

// Route files:
const bootcampRouter = require('./routes/bootcamps');

// Load env vars:
dotenv.config({path: './config/config.env'});

// Connect to mongodb:
connectToDB().then();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers:
app.use('/api/v1/bootcamps', bootcampRouter);

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
