import './home.css';
import { useEffect, useState } from 'react';
import VideoContent from '../../components/VideoContent'; 
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;


function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [actived, setActived] = useState('');
  const [searchString, setSearchString] = useState('');
  const [userRole, setUserRole] = useState('');

  const [recommendMovies, setRecommendMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'PhimHay - Trang chủ';
  }, []);

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


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setActived('home');
  };

  const slugify = (text) => {
    const charMap = {
      'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
      'Đ': 'D', 'đ': 'd'
    };
  
    const normalizedText = text
      .split('')
      .map(char => charMap[char] || char)
      .join('');
  
    return normalizedText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  };

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
    { name: 'Khoa học - Viễn tưởng', path: 'scifi' },
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

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const SearchSubmit = (event) => {
    event.preventDefault();
    console.log(searchString);
  };

  const SearchChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleMovieClick = (movieName) => {
    const slug = slugify(movieName);
    navigate(`/movie/${slug}`);
  };

  useEffect(() => {
    const savedActive = localStorage.getItem('active');
    if (savedActive) {
      setActived(savedActive);
    } 
    else {
      setActived('home')
    }
  }, []);

  useEffect(() => {
    if (actived) {
      localStorage.setItem('active', actived);
    }
  }, [actived]);

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const response = await fetch(`${API_URL}/getRecommend`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        console.log(data)
        setRecommendMovies(data.data);
      } catch (error) {
        console.error('Error fetching recommend:', error);
        setError(error.message);
      }
    };
    fetchRecommend();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const topMoviesResponse = await fetch(`${API_URL}/top-movies`);
        if (!topMoviesResponse.ok) {
          const errorText = await topMoviesResponse.text();
          throw new Error(`HTTP error! Status: ${topMoviesResponse.status}, Message: ${errorText}`);
        }
        const topMoviesData = await topMoviesResponse.json();
        setTopMovies(topMoviesData.data);

        const latestMoviesResponse = await fetch(`${API_URL}/latest-movies`);
        if (!latestMoviesResponse.ok) {
          const errorText = await latestMoviesResponse.text();
          throw new Error(`HTTP error! Status: ${latestMoviesResponse.status}, Message: ${errorText}`);
        }
        const latestMoviesData = await latestMoviesResponse.json();
        setLatestMovies(latestMoviesData.data.all); 
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError(error.message);
      }
    };
    fetchMovies();
  }, []);

  const handleNavClick = (page) => {
    setActived(page);
  };

  return (
    <div className="main">
      <div className="header">
        <a href="/" className="logo"
           onClick={() => handleNavClick('home')}
        >
          <i className='bx bxs-movie'>PhimHay</i>
        </a>
        <div className='bx bx-menu' id='menu-icon'></div>

        <ul className='navbar'>
          <li>
            <a 
              href='/' 
              className={actived === 'home' ? 'active' : ''} 
              onClick={() => handleNavClick('home')}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href='/thu-vien' 
              className={actived === 'thu-vien' ? 'active' : ''} 
              onClick={() => handleNavClick('thu-vien')}
            >
              Thư viện
            </a>
          </li>
          <li className='dropdown'>
            <a 
              href='/' 
              className='dropbtn'
              onClick={(e) => e.preventDefault()} 
            >
              Thể loại
            </a>
            <ul className='dropdown-content'>
              {genres.map((genre) => (
                <li key={genre.path}>
                  <a href={`/category/${genre.path}`}>{genre.name}</a>
                </li>
              ))}
            </ul>
          </li>

          <li className='dropdown'>
            <a 
              href='/' 
              className='dropbtn'
              onClick={(e) => e.preventDefault()} 
            >
              Quốc gia
            </a>
            <ul className='dropdown-content'>
              {countries.map((country) => (
                <li key={country.path}>
                  <a href={`/country/${country.path}`}>{country.name}</a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <form onSubmit={SearchSubmit} className='search-bar'>
          <input 
            className='search' 
            placeholder='Tìm kiếm...' 
            value={searchString}
            onChange={SearchChange} 
          />
          <button type='submit' style={{ display: 'none' }}>Submit</button>
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
                  <a href="/" onClick={handleLogout}>
                    Đăng xuất
                  </a>
                </li>
              </ul>
          </div>
        ) : (
          <a href="/dang-nhap" className="btn">
            Đăng nhập
          </a>
        )}
      </div>
      <div className='body_home'>
        <div className='recommend'>
          {recommendMovies.map((movie) => (
            <img key={movie.id} src={movie.thumbnail} alt={movie.name} />
          ))}
        </div>
        <div className='main-page'>
          <div className='main-movie'>
            <div className='nav-movie-container'>
              <h2>Phim mới cập nhật</h2>
              <div 
                className={`nav-type ${selectedType === 'all' ? 'selected' : ''}`} 
                onClick={() => handleTypeClick('all')}
              >
                Toàn bộ
              </div>
              <div 
                className={`nav-type ${selectedType === 'single' ? 'selected' : ''}`} 
                onClick={() => handleTypeClick('single')}
              >
                Phim lẻ
              </div>
              <div 
                className={`nav-type ${selectedType === 'series' ? 'selected' : ''}`} 
                onClick={() => handleTypeClick('series')}
              >
                Phim bộ
              </div>
            </div>
            <div className='new-movie-container'>
            {latestMovies
              .filter(movie => selectedType === 'all' || (selectedType === 'single' && movie.theloai === 'Phim lẻ') || (selectedType === 'series' && movie.theloai === 'Phim bộ'))
              .slice(0, 10)
              .map((movie) => (
                <VideoContent key={movie.id} movie={movie} />
              ))}
          </div>
          </div>
          <aside className='bxh'>
            <h1>Bảng xếp hạng</h1>
            <div className='bxh-content'>
              {error && <p>Error: {error}</p>}
              {topMovies.map((movie, index) => (
                <div className='child-content' key={movie.id} onClick={() => handleMovieClick(movie.name)}>
                  <div className={`rank rank-${index + 1}`}>#{index + 1}</div>
                  <div className='img'>
                    <img alt={movie.name} src={movie.thumbnail_image} />
                    <i className='bx bx-play-circle' ></i>
                  </div>
                  <div className='content-container'>
                    <div className={`title rank-${index + 1 }`}>{movie.name}</div>
                    <div className='year'>{movie.release_year}</div>
                    <div className='icon'>
                      <i className='bx bx-bar-chart-alt'>{movie.totalViews} lượt xem</i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Home;
