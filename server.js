const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = "skating_hour_super_secret_key";
const DB_FILE = './database.json';

app.use(cors());
app.use(express.json());

// Security middleware to block access to backend files
app.use((req, res, next) => {
    const forbidden = ['.json', 'server.js', 'init-db.js', 'package.json'];
    if (forbidden.some(ext => req.url.includes(ext))) {
        return res.status(403).send("Forbidden");
    }
    next();
});

app.use(express.static(path.join(__dirname)));

// Explicit fallback for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper to read/write JSON DB
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        return { admins: {}, enquiries: [], settings: {} };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const userHash = db.admins[username || 'admin'];
    
    if (!userHash) return res.status(401).json({ error: "Invalid credentials" });

    if (bcrypt.compareSync(password, userHash)) {
        const token = jwt.sign({ id: 1, username: username || 'admin' }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ valid: true });
});

app.post('/api/enquiries', (req, res) => {
    const data = req.body;
    const date = new Date().toLocaleString();
    const db = readDB();
    
    db.enquiries.push({
        id: Date.now(),
        subject: data._subject || '',
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        location: data.location || '',
        participants: data.participants || '',
        message: data.message || '',
        date: date
    });
    
    writeDB(db);
    res.json({ success: true });
});

app.get('/api/enquiries', authenticateToken, (req, res) => {
    const db = readDB();
    res.json(db.enquiries.reverse());
});

app.delete('/api/enquiries', authenticateToken, (req, res) => {
    const db = readDB();
    db.enquiries = [];
    writeDB(db);
    res.json({ success: true });
});

app.get('/api/schedules', (req, res) => {
    const db = readDB();
    if (db.settings.schedules) {
        res.json(JSON.parse(db.settings.schedules));
    } else {
        res.json(null);
    }
});

app.post('/api/schedules', authenticateToken, (req, res) => {
    const db = readDB();
    db.settings.schedules = JSON.stringify(req.body);
    writeDB(db);
    res.json({ success: true });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
