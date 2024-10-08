import './category.css';
import { useEffect, useState } from 'react';
import VideoContent from '../../components/VideoContent';
import { useParams, useNavigate } from 'react-router-dom'; 

const API_URL = process.env.REACT_APP_API_URL;

const categoryMap = {
  action: 'Hành động',
  drama: 'Drama',
  comedy: 'Hài hước',
  romance: 'Lãng mạn',
  horror: 'Kinh dị',
  detective: 'Trinh thám',
  ancient: 'Cổ trang',
  documentary: 'Phim tài liệu',
  adventure: 'Phiêu lưu',
  scifi: 'Khoa học - Viễn tưởng',
  animation: 'Hoạt hình',
  mythology: 'Thần thoại'
};

function Category() {
  const { categoryName } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [actived, setActived] = useState('');
  const [searchString, setSearchString] = useState('');
  const [userRole, setUserRole] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  // eslint-disable-next-line
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
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

  const countries = [
    { name: 'Úc', path: 'australia' },
    { name: 'Nga', path: 'Russia' },
    { name: 'Canada', path: 'Canada' },
    { name: 'Hoa Kỳ', path: 'usa' },
    { name: 'Anh', path: 'uk' },
    { name: 'Nhật Bản', path: 'japan' },
    { name: 'Hàn Quốc', path: 'south-korea' },
    { name: 'Trung Quốc', path: 'china' },
    { name: 'Thái Lan', path: 'thailand' },
    { name: 'Ý', path: 'italia' },
  ];

  useEffect(() => {
    document.title = `PhimHay - ${categoryMap[categoryName] || 'Danh mục không xác định'}`;
    localStorage.setItem('active', 'thu-vien');
  }, [categoryName]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/category/${categoryName}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        setMovies(data.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [categoryName]);

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

  
  const handleMovieClick = (movieName) => {
    const slug = slugify(movieName);
    navigate(`/movie/${slug}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const SearchChange = (event) => {
    const query = event.target.value;
    setSearchString(query);
    
    if (query) {
      const filteredMovies = [...latestMovies].filter(movie =>
        movie.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredMovies);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const savedActive = localStorage.getItem('active');
    if (savedActive) {
      setActived(savedActive);
    } else {
      setActived('home');
    }
  }, []);

  useEffect(() => {
    if (actived) {
      localStorage.setItem('active', actived);
    }
  }, [actived]);

  const handleNavClick = (page) => {
    setActived(page);
  };

  return (
    <div className="main">
      <div className="header">
        <a href="/" className="logo" onClick={() => handleNavClick('home')}        >
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
          <li>
            <a 
              href='/thanh-vien' 
              className={actived === 'thanh-vien' ? 'active' : ''} 
              onClick={() => handleNavClick('thanh-vien')}
            >
              Thành viên
            </a>
          </li>
        </ul>
        <form className='search-bar'>
          <input 
            className='search' 
            placeholder='Tìm kiếm...' 
            value={searchString}
            onChange={SearchChange} 
          />
          <button type='submit' style={{ display: 'none' }}>Submit</button>
          <div 
            className={`search-results ${searchResults.length > 0 ? 'visible' : ''}`} 
          >
            {searchResults.slice(0, 10).map((movie) => (
              <div 
                key={movie.id}
                className='search-result-item'
                onClick={() => handleMovieClick(movie.name)}
              >
                <img src={movie.thumbnail_image} alt={movie.name} />
                <p>{movie.name}</p>
              </div>
            ))}
          </div>
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
                  <a href="/ho-so">Hồ sơ</a>
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
        <div className='category-container'>
          <h1>Danh sách phim: {categoryMap[categoryName] || 'Danh mục không xác định'}</h1>
          <div className='new-movie-container'>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <VideoContent key={movie.id} movie={movie} />
              ))
            ) : (
              <p>Không tìm thấy phim nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
