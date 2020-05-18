const express = require('express');
const issuesRouter = express.Router({merge: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.get('/', (req, res, next) =>{
    db.all(`SELECT * FROM Issue WHERE Issue.series_id = ${req.params.seriesId}`, (error, issues)=> {
        if(error){
            next(error);
        }else{
            res.status(200).json({issues: issues})
        }
    });
});

issuesRouter.post('/', (req, res, next) => {
    const name = req.body.issues.name
    const issueNumber = req.body.issues.issueNumber
    const publicationDate = req.body.issues.publicationDate
    const artistId = req.body.issues.artistId
    const artistSql = `SELECT * FROM Artist WHERE Artists.id = ${artistId}`

    db.get(artistSql, (error, artist) =>{
        if(error){
            next(error);
        }else if(!name || !issueNumber || !publicationDate || !artistId){
            return res.statusCode(400);
        }else{
            const sql = `INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES(${name},${issueNumber},${publicationDate},${artistId},${req.params.seriesId})`

            db.run(sql, function(error){
                if(error){
                    next(error);
                }else{
                    db.get(`SELECT * FROM Issue WHERE issue.id =${this.lastID}`, (error, issue)=>{
                        res.send(201).json({issue: issue})
                    })
                }
            })
        }
    });

    
 
});

module.exports = issuesRouter;