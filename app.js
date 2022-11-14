// npm install --save-dev nodemon
// npm i mongoose
// npm i slugify
// npm i node-geocoder
// node seeder -i or -d
// npm i express-fileupload
// npm i jsonwebtoken bcryptjs
// npm i nodemailer

// Vulnerabilities:
// npm i express-mongo-sanitize
// npm i helmet
// npm i xss-clean
// npm i express-rate-limit
// npm i hpp
// npm i cors

// Deployment:
// npm i -g pm2

const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

// Vulnerability protection:
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

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

// Reduce Fingerprinting:
app.disable('x-powered-by')

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
// Limit to 100 requests per 10 mins from same IP:
// Documentation: Limit certain routes possible too:
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

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
