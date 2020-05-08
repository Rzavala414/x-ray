const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const PORT = process.env.PORT || 4001;

app.use(app.use(bodyParser.json()));
app.use(morgan('dev'));
app.use(errorhandler());
app.use(cors());

app.listen(PORT, function(){
    console.log(`listening on port ${PORT}`);
})

module.exports = app;