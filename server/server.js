// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  const categoryMapping = {
    'action': 'Hành động',
    'drama': 'Drama',
    'comedy': 'Hài hước',
    'romance': 'Lãng mạn',
    'horror': 'Kinh dị',
    'mystery': 'Trinh thám',
    'historical': 'Cổ trang',
    'documentary': 'Phim tài liệu',
    'adventure': 'Phiêu lưu',
    'sci-fi': 'Khoa học - viễn tưởng',
    'animation': 'Hoạt hình',
    'mythology': 'Thần thoại'
  };
  
  const countryMapping = {
    'vietnam': 'Việt Nam',
    'usa': 'Hoa Kỳ',
    'uk': 'Anh',
    'japan': 'Nhật Bản',
    'south-korea': 'Hàn Quốc',
    'china': 'Trung Quốc',
    'thailand': 'Thái Lan',
    'india': 'Ấn Độ'
  };


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

app.post('/api/register', async (req, res) => {
    const { username, password, name, email } = req.body;
    const token = generateToken();
    try {
        const { data: accountData, error: accountError } = await db
            .from('accounts')
            .insert([{ username, password, name, email, token }])
            .select();

        if (accountError) {
            return res.status(500).json({message: 'Username was already taken', error: accountError.message });
        }
        res.status(200).json({ message: 'User registered successfully', data: accountData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
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
            res.status(200).json({
                message: 'User logged successfully',
                data: {
                    token: account.token,
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

app.get('/api/category/:categoryName', async (req, res) => {
    const categoryName = req.params.categoryName;
    const vietnameseCategory = categoryMapping[categoryName.toLowerCase()];
  
    if (!vietnameseCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
  
    try {
      const { data: movies, error } = await db
        .from('movies')
        .select('*')
        .ilike('category', `%${vietnameseCategory}%`);
  
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: error.message });
      }
  
      res.status(200).json({ data: movies });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/api/country/:countryName', async (req, res) => {
    const countryName = req.params.countryName;
    const vietnameseCountry = countryMapping[countryName.toLowerCase()];
  
    if (!vietnameseCountry) {
      return res.status(404).json({ message: 'Country not found' });
    }
  
    try {
      const { data: movies, error } = await db
        .from('movies')
        .select('*')
        .ilike('nation', `%${vietnameseCountry}%`);
  
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: error.message });
      }
  
      res.status(200).json({ data: movies });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: err.message });
    }
  });  

  app.get('/api/top-movies', async (req, res) => {
    try {
        // Fetch all movies
        const { data: movies, error } = await db
            .from('movies')
            .select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Aggregate views
        const movieViews = movies.map(movie => {
            let totalViews = 0;

            try {
                let chapters;
                if (typeof movie.chapter === 'string') {
                    chapters = JSON.parse(movie.chapter);
                } else if (Array.isArray(movie.chapter)) {
                    chapters = movie.chapter;
                } else {
                    throw new Error('Unexpected chapter format');
                }

                totalViews = chapters.reduce((sum, chapter) => sum + parseInt(chapter.views, 10), 0);
            } catch (e) {
                console.error(`Failed to parse chapter field for movie ID ${movie.id}:`, e);
                return {
                    ...movie,
                    totalViews: 0
                };
            }

            return {
                ...movie,
                totalViews
            };
        });

        const sortedMovies = movieViews.sort((a, b) => b.totalViews - a.totalViews);

        const topMovies = sortedMovies.slice(0, 5);

        res.status(200).json({ data: topMovies });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/latest-movies', async (req, res) => {
    try {
        const { data: movies, error } = await db
            .from('movies')
            .select('*')
            .order('last_updated', { ascending: false })
            .limit(10);

        if (error) {
            throw error;
        }

        const categorizedMovies = {
            all: movies,
            single: movies.filter(movie => movie.theloai === 'Phim lẻ'),
            series: movies.filter(movie => movie.theloai === 'Phim bộ')
        };

        res.status(200).json({ data: categorizedMovies });
    } catch (error) {
        console.error('Error fetching latest movies:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = 81;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});