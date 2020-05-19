const express = require('express');
const issuesRouter = express.Router({merge: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.param('/issueId', (req, res, next, issueId) =>{
    db.get('SELECT * FROM Issue WHERE Issue.id = $issueId', {$issueId: issueId}, (error, issue) =>{
        if(error){
            next(error);
        }else if(issue){
            next();
        }else{
            res.sendStatus(404);
            
        }
    })
});

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
    const name = req.body.issue.name
    const issueNumber = req.body.issue.issueNumber
    const publicationDate = req.body.issue.publicationDate
    const artistId = req.body.issue.artistId
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

issuesRouter.put('/:issueId', (req, res, next) => {
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;
    const artistSql = `SELECT * FROM Artist WHERE Artists.id = ${artistId}`;

    if(!name || !issueNumber || !publicationDate || !artistId){
        res.sendStatus(400);
    }else{
        
        db.get(artistSql, (error, artist) => {
            if(error){
                next(error);
            }else if(artist){
                db.run(`UPDATE ISSUE SET name = ${name}, issue_number = ${issueNumber}, publication_date = ${publicationDate}`, function(error) {
                    if(error){
                        next(error);
                    }else{
                        db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (error, issue) => {
                            res.status(200).json({issue: issue});
                        });
                    }
                });
            }else{
                res.sendStatus(404);
            }
        })
    }
});

issuesRouter.delete('/:issueId', (req, res, next) => {
        
        db.run(`DELETE FROM Issue WHERE Issue.id = ${req.params.issueId}`, error => {
            if(error){
                next(error);
            }else{
                res.sendStatus(204);
            }
        })
});

module.exports = issuesRouter;