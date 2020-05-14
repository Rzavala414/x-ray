const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

seriesRouter.get('/', (req, res, next) => {

    db.all('SELECT * FROM Series', (error, series) =>{
        if(error){
            next(error);
        }else{

            res.status(200).json({series: series});
        }
    });

});

// seriesRouter.get('/', (req, res, next) => {

// });

// seriesRouter.put('/', (req, res, next) => {

// });

// seriesRouter.post('/', (req, res, next) => {

// });

// seriesRouter.delete('/', (req, res, next) => {

// });

module.exports = seriesRouter;