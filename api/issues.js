const express = require('express');
const issuesRouter = express.Router({merge: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.get('/', (req, res, next) =>{
    db.all(`SELECT * FROM Issue WHERE Issue.series_id = ${req.params.seriesId}`, (error, issues)=> {
        if(error){
            next(error);
        }else{
            res.json({issues: issues})
        }
    });
});


module.exports = issuesRouter;