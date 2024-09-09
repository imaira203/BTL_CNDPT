import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './player.css';

const API_URL = process.env.REACT_APP_API_URL;

function Player() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [actived, setActived] = useState('');
  const [searchString, setSearchString] = useState('');
  const [userRole, setUserRole] = useState('');

  const [totalViews, setTotalViews] = useState(0);

  const genres = [
    { name: 'Hành động', path: 'action' },
    { name: 'Drama', path: 'drama' },
    { name: 'Hài hước', path: 'comedy' },
    { name: 'Lãng mạn', path: 'romance' },
    { name: 'Kinh dị', path: 'horror' },
    { name: 'Trinh thám', path: 'detective' },
    { name: 'Cổ trang', path: 'ancient' },
    { name: 'Phim tài liệu', path: 'documentary' },
    { name: 'Phiêu lưu', path: 'adventure' },
    { name: 'Khoa học - viễn tưởng', path: 'scifi' },
    { name: 'Hoạt hình', path: 'animation' },
    { name: 'Thần thoại', path: 'mythology' }
  ];

  const countries = [
    { name: 'Việt Nam', path: 'vietnam' },
    { name: 'Hoa Kỳ', path: 'usa' },
    { name: 'Anh', path: 'uk' },
    { name: 'Nhật Bản', path: 'japan' },
    { name: 'Hàn Quốc', path: 'south-korea' },
    { name: 'Trung Quốc', path: 'china' },
    { name: 'Thái Lan', path: 'thailand' },
    { name: 'Ấn Độ', path: 'india' }
  ];
  
  useEffect(() => {
    if (movie) {
      document.title = `PhimHay - xem phim ${movie.name}`;
    } else {
      document.title = `PhimHay - xem phim miễn phí`;
    }
  }, [movie]);  

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setLoggedIn(true);
      setUserRole(role);
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/latest-movies`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const movie = data.data.all.find(m => slugify(m.name) === slug);
        if (movie) {
          fetchMovieDetails(movie.id);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchMovieDetails = async (id) => {
      try {
        const response = await fetch(`${API_URL}/getMovie/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data);
        if (data.chapter.length > 0) {
          setSelectedChapter(data.chapter[0]);
        }
        const totalViews = data.chapter.reduce((sum, chap) => {
          const chapViews = Number(chap.views) || 0;
          return sum + chapViews;
        }, 0);
    
        setTotalViews(totalViews);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovies();
  }, [slug]);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');
  };

  const handleChapterChange = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleNavClick = (page) => {
    setActived(page);
  };

  const SearchSubmit = (event) => {
    event.preventDefault();
    console.log(searchString);
  };

  const SearchChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    setActived('home');
  };

  const isLoading = !movie;

  return (
    <div className="main">
      <div className="header">
        <a href="/" className="logo" onClick={() => handleNavClick('home')}>
          <i className="bx bxs-movie">PhimHay</i>
        </a>
        <div className="bx bx-menu" id="menu-icon"></div>

        <ul className="navbar">
          <li>
            <a
              href="/"
              className={actived === 'home' ? 'active' : ''}
              onClick={() => handleNavClick('home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/thu-vien"
              className={actived === 'thu-vien' ? 'active' : ''}
              onClick={() => handleNavClick('thu-vien')}
            >
              Thư viện
            </a>
          </li>
          <li className="dropdown">
            <a
              href="/"
              className="dropbtn"
              onClick={(e) => e.preventDefault()}
            >
              Thể loại
            </a>
            <ul className="dropdown-content">
              {genres.map((genre) => (
                <li key={genre.path}>
                  <a href={`/category/${genre.path}`}>{genre.name}</a>
                </li>
              ))}
            </ul>
          </li>
          <li className="dropdown">
            <a
              href="/"
              className="dropbtn"
              onClick={(e) => e.preventDefault()}
            >
              Quốc gia
            </a>
            <ul className="dropdown-content">
              {countries.map((country) => (
                <li key={country.path}>
                  <a href={`/country/${country.path}`}>{country.name}</a>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <form onSubmit={SearchSubmit} className="search-bar">
          <input
            className="search"
            placeholder="Tìm kiếm..."
            value={searchString}
            onChange={SearchChange}
          />
          <button type="submit" style={{ display: 'none' }}>Submit</button>
        </form>
        {loggedIn ? (
          <div className="profile-container">
            <img
              src="/images/profile.png"
              alt="Profile"
              className="profile-icon"
            />
            <ul className="profile-dropdown">
              <li>
                <a href="/profile">Hồ sơ</a>
              </li>
              {userRole === 'admin' && (
                <li>
                  <a href="/upload">Upload phim</a>
                </li>
              )}
              <li>
                <a href="/" onClick={handleLogout}>Đăng xuất</a>
              </li>
            </ul>
          </div>
        ) : (
          <a href="/dang-nhap" className="btn">Đăng nhập</a>
        )}
      </div>

      <div className="player-container">
        <main className="main-player-container">
          <h1>{isLoading ? 'Đang tải...' : `${movie.name} - Tập ${selectedChapter.chap}`}</h1>
          <div className="video-player">
            {isLoading ? (
              <iframe title='player' src='' alt='Loading...' allowFullScreen />
            ) : (
              <iframe title='player' src={selectedChapter.url} alt={movie.name} allowFullScreen />
            )}
          </div>
          <h3>Danh sách tập:</h3>
          <div className="chapter-list">
            {isLoading ? (
              <ul>
                <li>Đang tải...</li>
              </ul>
            ) : (
              <ul>
                {movie.chapter.map((chap, index) => (
                  <li key={index}>
                    <button
                      className={selectedChapter === chap ? 'active' : ''}
                      onClick={() => handleChapterChange(chap)}
                    >
                      {movie.theloai === "Phim bộ" ? (chap.title || `Tập ${index + 1}`) : "Phim lẻ"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className='movie-info'>
            {isLoading ? (
              <img src='' alt='Loading'/>
            ) : (
              <img src={movie.thumbnail_image} alt='Thumbnail'/>
              )}
            <div className='info-content'>
              {isLoading ? (
                <h2>Đang tải...</h2>
              ) : (
                <>
                  <h2>{movie.name}</h2>
                  <p><strong>Số tập:</strong> {movie.chapter.length}</p>
                  <p><strong>Thể loại:</strong> {Array.isArray(movie.category) ? movie.category.join(', ') : movie.category}</p>
                  <p><strong>Diễn viên:</strong> {movie.actors}</p>
                  <p><strong>Năm ra mắt:</strong> {movie.release_year}</p>
                  <p><strong>Tổng số lượt xem:</strong> {totalViews}</p>
                  <p><strong>Mô tả:</strong> {movie.description}</p>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Player;
