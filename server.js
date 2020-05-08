const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const apiRouter = require('./api/api.js');
const PORT = process.env.PORT || 4001;

app.use(app.use(bodyParser.json()));
app.use(morgan('dev'));
app.use(cors());

app.use('/api', apiRouter);

app.use(errorhandler());

app.listen(PORT, function(){
    console.log(`listening on port ${PORT}`);
})

module.exports = app;