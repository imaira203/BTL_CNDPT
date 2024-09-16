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
    'detective': 'Trinh thám',
    'ancient': 'Cổ trang', 
    'documentary': 'Phim tài liệu',
    'adventure': 'Phiêu lưu',
    'scifi': 'Khoa học - Viễn tưởng',
    'animation': 'Hoạt hình',
    'mythology': 'Thần thoại'
  };
  
  
  const countryMapping = {
    'australia': 'Úc',
    'usa': 'Hoa Kỳ',
    'uk': 'Anh',
    'japan': 'Nhật Bản',
    'south-korea': 'Hàn Quốc',
    'china': 'Trung Quốc',
    'thailand': 'Thái Lan',
    'russia': 'Nga',
    'italia': 'Ý',
    'canada': 'canada'
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
                    email: account.email,
                    role: account.role
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
        return res.status(500).json({ error: error.message });
      }
  
      res.status(200).json({ data: movies });
    } catch (err) {
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
        return res.status(500).json({ error: error.message });
      }
  
      res.status(200).json({ data: movies });
    } catch (err) {
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
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/getRecommend', async (req, res) => {
    try {
        const { data: movies, error } = await db
            .from('recommend')
            .select('*')
            .order('id', { ascending: false })
            .limit(5);

        if (error) {
            throw error;
        }
        res.status(200).json({ data: movies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/latest-movies', async (req, res) => {
    try {
        const { data: movies, error } = await db
            .from('movies')
            .select('*')
            .order('last_updated', { ascending: false })

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
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/getMovie/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    
    try {
      const { data: movie, error } = await db
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) {
        throw error;
      }
  
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await db
      .from('accounts')
      .select('id, name');

    if (error) {
      throw error;
    }
    res.status(200).json({ users: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/userFavorited/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const { data, error } = await db
      .from('accounts')
      .select('id, name, favorited')
      .eq('id', userId);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/post-comment', async (req, res) => {
  const { movieId, id, comment } = req.body;

  if (!id || !comment) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    const { data: movie, error: fetchError } = await db
      .from('movies')
      .select('comments')
      .eq('id', movieId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const updatedComments = [...(movie.comments || []), { user: id, comment }];

    const { data: updatedMovie, error: updateError } = await db
      .from('movies')
      .update({ comments: updatedComments })
      .eq('id', movieId)
      .single();

    if (updateError) {
      throw updateError;
    }

    res.status(200).json({ comment: { user: id, comment }, ...updatedMovie });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});  

app.post('/api/change-name', async (req, res) => {
  const { userId, newName } = req.body; 

  if (!userId || !newName) {
    return res.status(400).json({ message: 'User ID and new password are required' });
  }

  try {
    const { data, error } = await db
      .from('accounts')
      .update({ name: newName }) 
      .eq('id', userId) 
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      res.json({ message: 'Name updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/change-password', async (req, res) => {
  const { userId, newPass } = req.body; 

  if (!userId || !newPass) {
    return res.status(400).json({ message: 'User ID and new password are required' });
  }

  try {
    const { data, error } = await db
      .from('accounts')
      .update({ password: newPass }) 
      .eq('id', userId) 
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/getUser/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const { data, error } = await db
      .from('accounts')
      .select('username, name, email, favorited')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      res.json({ user: data });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/update-favorites', async (req, res) => {
  const { userId, movieId, action } = req.body;

  try {
    const { data: user } = await db
      .from('accounts')
      .select('favorited')
      .eq('id', userId)
      .single();

      const { data: movieData } = await db
      .from('movies')
      .select('likes')
      .eq('id', movieId)
      .single();

    let updatedFavorites = user.favorited || [];

    const currentLike = (movieData && movieData.likes) ? movieData.likes : 0;

    if (action === 'add') {
      updatedFavorites.push({ id: movieId });
      await db
        .from('movies')
        .update({ likes: currentLike + 1 })
        .eq('id', movieId);
    } else if (action === 'remove') {
      updatedFavorites = updatedFavorites.filter(fav => fav.id !== movieId);
      await db
        .from('movies')
        .update({ likes: currentLike - 1 })
        .eq('id', movieId);
    }

    const { data, error } = await db
      .from('accounts')
      .update({ favorited: updatedFavorites })
      .eq('id', userId);

    if (error) throw error;

    res.json({ message: 'Favorites updated successfully', favorited: updatedFavorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
});

app.post('/api/getMoviesByIds', async (req, res) => {
  const { ids } = req.body;
  
  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No movie IDs provided' });
  }

  try {    
    const numericIds = ids.map(item => item.id);
    const { data: movies, error } = await db
      .from('movies')
      .select('*')
      .in('id', numericIds); 

    if (error) {
      return res.status(500).json({ error: 'Error fetching movies', details: error.message });
    }
    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/api/update-view', async (req, res) => {
  const { movieId, chapter } = req.body;

  try {
    let { data: movie, error } = await db
      .from('movies')
      .select('chapter')
      .eq('id', movieId)
      .single();

    if (error || !movie) throw error || new Error('Movie not found');

    const updatedChapter = movie.chapter.map(chap => {
      if (chap.chap === chapter) {
        return {
          ...chap,
          views: (parseInt(chap.views) + 1).toString() 
        };
      }
      return chap;
    });
    const { data, updateError } = await db
      .from('movies')
      .update({ chapter: updatedChapter })
      .eq('id', movieId)
      .select()

    if (updateError) throw updateError;

    res.status(200).send({ success: true, data: data});
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
    console.log(err)
  }
});

app.post('/api/search', async (req, res) => {
  const { query } = req.body; 
  try {
    const { data, error } = await db
      .from('movies')
      .select('*')
      .ilike('name', `%${query}%`);

    if (error) {
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: error.message });
  }
});
  
const port = 81;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});