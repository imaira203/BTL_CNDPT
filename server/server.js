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
const db = createClient(supabaseUrl, supabaseKey);

if (db) {
    console.log('Connected to Supabase DB!');
} else {
    console.log("Error connecting to Supabase DB");
}

app.post('/register', async (req, res) => {
    const { username, password, name, email } = req.body;

    try {
        const { data: accountData, error: accountError } = await db
            .from('accounts')
            .insert([{ username, password, name, email }])
            .select();

        if (accountError) {
            return res.status(500).json({ error: accountError.message });
        }
        res.status(200).json({ message: 'User registered successfully', data: accountData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data: accounts, error } = await db
            .from('accounts')
            .select('*')
            .eq('username', username)
            .eq('password', password);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (accounts.length > 0) {
            const account = accounts[0];
            const token = 'abcdefghiklmnoupw12345';

            res.status(200).json({
                message: 'User logged successfully',
                data: {
                    id: account.id, 
                    username: account.username,
                    name: account.name,
                    email: account.email
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = 81;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});