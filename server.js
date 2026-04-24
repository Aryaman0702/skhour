const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = "skating_hour_super_secret_key";

app.use(cors());
app.use(express.json());

// Security middleware to block access to backend files
app.use((req, res, next) => {
    const forbidden = ['.sqlite', 'server.js', 'init-db.js', 'package.json'];
    if (forbidden.some(ext => req.url.includes(ext))) {
        return res.status(403).send("Forbidden");
    }
    next();
});

app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./database.sqlite');

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
    db.get("SELECT * FROM admins WHERE username = ?", [username || 'admin'], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ valid: true });
});

app.post('/api/enquiries', (req, res) => {
    const data = req.body;
    const date = new Date().toLocaleString();
    db.run(`INSERT INTO enquiries (subject, name, phone, email, location, participants, message, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data._subject || '', data.name || '', data.phone || '', data.email || '', data.location || '', data.participants || '', data.message || '', date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.get('/api/enquiries', authenticateToken, (req, res) => {
    db.all("SELECT * FROM enquiries ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/enquiries', authenticateToken, (req, res) => {
    db.run("DELETE FROM enquiries", [], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/schedules', (req, res) => {
    db.get("SELECT value FROM settings WHERE key = 'schedules'", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json(JSON.parse(row.value));
        } else {
            res.json(null);
        }
    });
});

app.post('/api/schedules', authenticateToken, (req, res) => {
    const schedules = JSON.stringify(req.body);
    db.run("INSERT INTO settings (key, value) VALUES ('schedules', ?) ON CONFLICT(key) DO UPDATE SET value = ?", [schedules, schedules], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
