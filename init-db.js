const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_FILE = './database.json';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('12345678', salt);

const initialDB = {
    admins: {
        "skatinghour": hash
    },
    enquiries: [],
    settings: {}
};

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf8');
    console.log("JSON Database initialized successfully!");
} else {
    console.log("JSON Database already exists.");
}
