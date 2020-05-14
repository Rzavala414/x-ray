const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

seriesRouter.param('/seriesId', (req, res, next, id) => {

    db.get(`SELECT * FROM Series WHERE id = ${id}`, (error, series) => {

        if(error){
            next(error);
        }else if(series){
            req.series = series;
            next();
        }else{
            res.sendStatus(404);
        }

    });
});

seriesRouter.get('/:seriesId', (req, res, next) => {

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