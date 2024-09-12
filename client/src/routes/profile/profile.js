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
  const [showPass, setShowPass] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tabActive, setTabActive] = useState('info');
  const navigate = useNavigate();


  useEffect(() => {
    document.title = 'PhimHay - Tài khoản';
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
          console.log(user)
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
    { name: 'Việt Nam', path: 'vietnam' },
    { name: 'Hoa Kỳ', path: 'usa' },
    { name: 'Anh', path: 'uk' },
    { name: 'Nhật Bản', path: 'japan' },
    { name: 'Hàn Quốc', path: 'south-korea' },
    { name: 'Trung Quốc', path: 'china' },
    { name: 'Thái Lan', path: 'thailand' },
    { name: 'Ấn Độ', path: 'india' }
  ];

  const togglePasswordVisibility = () => {
    setShowPass(!showPass);
  };

  const SearchSubmit = (event) => {
    event.preventDefault();
    console.log(searchString);
  };

  const SearchChange = (event) => {
    setSearchString(event.target.value);
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
                    <p>Họ và Tên: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Tên tài khoản: {user.username}</p>
                    <p className='change-password'><button>Đổi mật khẩu</button></p>
                </div>
                ) : (
                <p>Loading...</p>
                )
            ) : (
                <a href="/dang-nhap" className="btn">
                Đăng nhập
                </a>
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
