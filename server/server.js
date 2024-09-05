// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = 'https://unxjcplzfnrpncotttrm.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueGpjcGx6Zm5ycG5jb3R0dHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1NDM1NTAsImV4cCI6MjA0MTExOTU1MH0.w0VhcQHunOIVVh_CZvE8i5nEih-Y4htqHn_S3tnXtyA'
const supabase = createClient(supabaseUrl, supabaseKey)

if (supabase){
    console.log('Connected to DB!');
} else {
    console.log("Error connecting to DB");
}

// Register new user
app.post('/register', (req, res) => {
    const { username, password, name } = req.body;
    const query = 'INSERT INTO accounts (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) return res.status(500).send(err);

        const accountId = result.insertId;
        const userQuery = 'INSERT INTO user (account_id, name) VALUES (?, ?)';
        db.query(userQuery, [accountId, name], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(`User registered with username: ${name}`);
        });
    });
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM accounts WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            const token = 'abcdefghiklmnoupw12345'; 
            res.status(200).json({
                message: 'Login successful',
                token: token, 
                username: results[0].username,
                account_id: results[0].id
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

const port = 81;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
