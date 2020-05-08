const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistsRouter.param('artistsId', (req, res, next, ArtistsId) => {
    db.get(`SELECT * FROM Artists WHERE id = ${ArtistsId}`, (err, artists) => {
        if (err) {
            next(err);
          } else if (artist) {
            req.artist = artist;
            next();
          } else {
            res.sendStatus(404);
          }
    })
});

artistsRouter.get('/', (req, res, next) =>{
    db.all(`SELECT * FROM Artists WHERE is_currently_employed = 1`,
        (err, artists) => {
            if(err){
                next(err);
            }else{ 
                res.status(200).json({artists: artists});
            }
        })
})

module.exports = artistsRouter;