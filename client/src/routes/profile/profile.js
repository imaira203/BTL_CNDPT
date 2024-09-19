import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css'
const API_URL = process.env.REACT_APP_API_URL;

function Profile() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [actived, setActived] = useState('');
  const [user, setUser] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tabActive, setTabActive] = useState('info');
  const [favoritedMovies, setFavoritedMovies] = useState([]);
  const [showChangePassForm, setShowChangePassForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewDisplayName] = useState('');
  const [showChangeNameForm, setShowChangeNameForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  // eslint-disable-next-line
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    document.title = 'PhimHay - Tài khoản';
    localStorage.setItem('active', '');
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
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`${API_URL}/getUser/${userId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setUser(data.user);

          const favoritedMoviesResponse = await fetch(`${API_URL}/getMoviesByIds`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: data.user.favorited }), 
          });

          if (!favoritedMoviesResponse.ok) {
            throw new Error(`HTTP error! Status: ${favoritedMoviesResponse.status}`);
          }

          const favoritedMoviesData = await favoritedMoviesResponse.json();
          setFavoritedMovies(favoritedMoviesData.movies);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleNavClick = (page) => {
    setActived(page);
  };

  const handleTabClick = (tab) => {
    setTabActive(tab)
  }

  const toggleChangePassForm = () => {
    setShowChangePassForm(!showChangePassForm);
    setShowChangeNameForm(false);
  }

  const toggleChangeNameForm = () => {
    setShowChangeNameForm(!showChangeNameForm);
    setShowChangePassForm(false);
  }


  const handleChangeDisplayName = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${API_URL}/change-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newName }),
      });
  
      if (!response.ok) {
        // eslint-disable-next-line
        const errorData = await response.json();
        throw new Error('Đổi tên hiển thị thất bại');
      }
  
      const data = await response.json();
      if (data){
        setPopupMessage('Đổi tên hiển thị thành công!');
        setIsSuccess(true);
        setShowPopup(true);
    
        setTimeout(() => {
          setShowPopup(false);
          setPopupMessage('');
        }, 2000);
    
        setShowChangeNameForm(false);
        setNewDisplayName('');
        setUser((prevUser) => ({ ...prevUser, name: newName }));
      } else {
        setPopupMessage('Có lỗi xảy ra, vui lòng thử lại!');
        setIsSuccess(true);
        setShowPopup(true);
    
        setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
        }, 2000);
      }
    } catch (error) {
      setPopupMessage(`${error.message}`);
      setIsSuccess(false);
      setShowPopup(true);
  
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    }
  };

  const handleChangePass = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPass: newPassword }), 
      });
  
      if (!response.ok) {
        // eslint-disable-next-line
        const errorData = await response.json();
        throw new Error('Đổi mật khẩu thất bại');
      }
      setPopupMessage('Đổi mật khẩu thành công!');
      setIsSuccess(true);
      setShowPopup(true);
  
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage(''); 
      }, 2000);
  
      setShowChangePassForm(false);
      setNewPassword('');
    } catch (error) {
      setPopupMessage(`${error.message}`);
      setIsSuccess(false);
      setShowPopup(true);
  
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    }
  };

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

  const handleMovieClick = (movieName) => {
    const slug = slugify(movieName);
    navigate(`/movie/${slug}`);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setActived('home');
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
      <div className="profile-page">
      <div className='side-tab'>
        <div
        className={`hoso-item ${tabActive === 'info' ? 'active' : ''}`}
        onClick={() => handleTabClick('info')}
        >
        Hồ sơ
        </div>
        <div
        className={`hoso-item ${tabActive === 'favorites' ? 'active' : ''}`}
        onClick={() => handleTabClick('favorites')}
        >
        Phim đã thích
        </div>
    </div>
    <div className="info">
      {tabActive === 'info' ? (
        user ? (
          <div className="info-container">
            <p>Tên hiển thị: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Tên tài khoản: {user.username}</p>
            <p className="change-password">
              <button onClick={toggleChangePassForm}>Đổi mật khẩu</button> 
              <button onClick={toggleChangeNameForm}>Đổi tên hiển thị</button>
            </p>
            <div className={`change-pass ${showChangePassForm ? 'active' : ''}`}>
              Mật khẩu mới: 
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleChangePass}>Xác nhận</button>
            </div>
            <div className={`change-pass ${showChangeNameForm ? 'active' : ''}`}>
              Tên hiển thị mới: 
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <button onClick={handleChangeDisplayName}>Xác nhận</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <div className="favorites-container">
          {favoritedMovies.length > 0 ? (
            favoritedMovies.map((movie) => (
              <div onClick={() => handleMovieClick(movie.name)} key={movie.id} className="movie-item">
                <img src={movie.thumbnail_image} alt={movie.name} />
                <p>{movie.name}</p>
              </div>
            ))
          ) : (
            <h2>Chưa có phim yêu thích</h2>
          )}
        </div>
      )}
    </div>
      </div>
      {showPopup && (
        <div className={`popup ${isSuccess ? 'success' : ''}`}>
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
