const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // Create Admins Table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Create Admin User (Default Password: "123")
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('123', salt);
    
    db.get("SELECT id FROM admins WHERE username = 'admin'", (err, row) => {
        if (!row) {
            db.run("INSERT INTO admins (username, password) VALUES (?, ?)", ['admin', hash]);
        }
    });

    // Create Enquiries Table
    db.run(`CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        location TEXT,
        participants TEXT,
        message TEXT,
        date TEXT
    )`);

    // Create Settings Table for Schedules
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`);

    console.log("Database initialized successfully!");
});

db.close();
