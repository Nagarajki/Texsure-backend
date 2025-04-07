const express = require("express");
const cors = require("cors");
const createHttpError = require("http-errors");
const dotenv = require("dotenv");

//dotenv config call always before PORT numbrt declearation
dotenv.config();
require('./config/db')

const PORT = process.env.PORT || 9000;

//route file importing
const userRoute = require('./routes/userRoute');
const companyRoute = require('./routes/companyRoute');

const taxSureRouters = express.Router();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount the `/taxsure` router
app.use('/taxsure', taxSureRouters);

//middlewares
taxSureRouters.use('/auth', userRoute)
taxSureRouters.use('/company', companyRoute)


app.get("/", (req, res, next) => {
    res.send("Express");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createHttpError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send('Internal Server Error');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});