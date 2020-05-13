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

artistsRouter.post('/', (req, res, next) =>{

});

artistsRouter.get('/:artistId', (req, res, next) => {
    res.status(200).json({artist: req.artist});
});

artistsRouter.post('/', (req, res, next) =>{
    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    if(!req.body.artists.name || !req.body.artists.dataOfBirth || !req.body.artists.biography ){
        res.sendStatus(400);
    }
    db.run(`INSERT INTO Artists(name, date_of_birth, biography, is_currently_employed) VALUES(${req.body.artist.name}, ${req.body.artists.dateOfBirth},${req.body.artist.biography},${isCurrentlyEmployed})`, (err,artist) =>{
        res.status(201).json({artist: artist});
    },function(){

    })
});

artistsRouter.put('/:artistId', (req, res, next) =>{
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;
    const isCurrentlyEmployed = req.body.artist.is_currently_employed === 0 ? 0: 1;

    if (!name || !dateOfBirth || !biography) {
         return res.sendStatus(400);
    }

    const sql = `UPDATE Artists SET name = ${name}, date_of_Birth = ${dateOfBirth}, biography = ${biography}, is_currently_employed =${isCurrentlyEmployed} WHERE Artists.id = ${req.params.art}`
    
    db.run(sql, error => {
        if(error){
         next(error);
        } else{
            db.get(`SELECT * FROM Artists WHERE Artists.id = ${req.params.artistsId}`, (error, artist) => {
                res.status(200).json({artist: artist});
            });
        }
    });
});

artistsRouter.delete('/:artistsId', (res, req, next) => {
   const sql = `UPDATE Artists SET is_currently_employed = 0`
    db.run(sql, error => {
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Artists WHERE Artists.id = ${req.params.artistsId}`, (error,artist) => {
                res.send(200).json({artist: artist});
        });
        }
    })
});


module.exports = artistsRouter;