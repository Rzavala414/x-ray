const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    
    db.run(`CREATE TABLE IF NOT EXISTS Artists(
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL, 
        date_of_birth INTEGER NOT NULL, 
        biography TEXT NOT NULL, 
        is_currently_employed INTEGER DEFAULT 1)`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Series(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL
    )`);
});
