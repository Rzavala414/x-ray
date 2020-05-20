const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const cors = require('cors');
const apiRouter = require('./api/api.js');

const PORT = process.env.PORT || 4001;


app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api', apiRouter);

app.use(errorhandler());

app.listen(PORT, function(){
    console.log(`listening on port ${PORT}`);
})

module.exports = app;