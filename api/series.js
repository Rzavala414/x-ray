const express = require('express');
const seriesRouter = express.Router();
const issuesRouter = require('./issues.js');
seriesRouter.use('/:seriesId/issues', issuesRouter);
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

seriesRouter.use('/:seriesId/issues', issuesRouter);

issuesRouter.get('/', (req, res, next) =>{
    db.all(`SELECT * FROM Issue`, (error, issues)=> {
        if(error){
            next(error);
        }else{
            res.json({issues: issues})
        }
    });
});

seriesRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Series`, (error, series)=> {
        if(error){
            next(error);
        }else{
            res.json({series: series})
        }
    });
});

seriesRouter.get('/:seriesId', (req, res, next) => {

    db.all(`SELECT * FROM Series WHERE id = ${req.body.series.id}`, (error, series) =>{
        if(error){
            next(error);
        }else{

            res.status(200).json({series: series});
        }
    });

});

seriesRouter.post('/', (req, res, next) => {
    const name = req.body.series.name;
    const description = req.body.series.description;
    
    if(!name || !description){
        res.sendStatus(400);
    }else{
        
       db.run(`INSERT INTO Series Values(${req.body.series.description}, ${req.body.series.description})`, error =>{
           
        if(error){
             next(error);
           }else{
                db.get(`SELECT * FROM Series WHERE id = ${req.body.series.id}`, (error,series) =>{

                    if(error){
                        next(error);
                    }else{
                        res.status(201).json({series: series});
                    }

                });
           }

       });
    }
});

seriesRouter.put('/', (req, res, next) => {
    const name = req.body.series.name;
    const description = req.body.series.description;
    const id = req.body.series.id

    if(!name || !description){
        res.statusCode(400);
    }else{
        db.run(`UPDATE Series WHERE id = ${id} SET name =${name}, description = ${description}`, error => {
            if(error){
                next(error);
            }else{
                db.get(`SELECT * FROM Series WHERE id = ${id}`, (error, series) => {

                    if(error){
                        next(error);
                    }else{
                        res.status(201).json({series: series});
                    }

                });
            }
        });
    }

});



// seriesRouter.delete('/:seriesId', (req, res, next) => {

// });

module.exports = seriesRouter;