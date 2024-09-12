import './library.css';

import { useEffect, useState } from 'react';
import VideoContent from '../../components/VideoContent'; // Import VideoContent

const API_URL = process.env.REACT_APP_API_URL;


function Library() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [actived, setActived] = useState('');
  const [searchString, setSearchString] = useState('');
  const [userRole, setUserRole] = useState('');
  const [latestMovies, setLatestMovies] = useState([]);

  //eslint-disable-next-line
  let [selectedType] = useState('');


  useEffect(() => {
    document.title = 'PhimHay - Thư viện';
  }, []);

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
      }
    };
    fetchMovies();
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


  const SearchSubmit = (event) => {
    event.preventDefault();
    console.log(searchString);
  };

  const SearchChange = (event) => {
    setSearchString(event.target.value);
  };

  useEffect(() => {
    const savedActive = localStorage.getItem('active');
    if (savedActive) {
      setActived(savedActive);
    } else {
      setActived('home')
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
        <div className='library-container'>
          <h1>Phim lẻ</h1>
          <div className='new-movie-container'>
                {latestMovies
                  .filter(movie => (selectedType = 'single' && movie.theloai === "Phim lẻ"))
                  .map((movie) => (
                    <VideoContent key={movie.id} movie={movie} />
                  ))}
          </div>
          <h1>Phim bộ</h1>
          <div className='new-movie-container'>
              {latestMovies
                .filter(movie => (selectedType = 'series' && movie.theloai === "Phim bộ"))
                .map((movie) => (
                  <VideoContent key={movie.id} movie={movie} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Library;
