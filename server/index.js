//basic module
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//custom_module
const dbConn = require('./modules/database');

//basic var setting
const app = express();
require('dotenv').config();
const PORT = process.env.PORT

//db_conn
dbConn.connect();

//include_routers
const acctRouter = require('./router/account');

//middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors());

//routers
app.use("/account", acctRouter);

//server_start
app.listen(PORT, function () {
    console.log(`Server is Running. Port: ${PORT}`);
});