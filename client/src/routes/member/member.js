import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './member.css'
const API_URL = process.env.REACT_APP_API_URL;

function Member() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [actived, setActived] = useState('');
    const [searchString, setSearchString] = useState('');
    const [userRole, setUserRole] = useState('');
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [latestMovies, setLatestMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'PhimHay - Thành viên';
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

    const handleNavClick = (page) => {
        setActived(page);
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
        <div className='member-container'>
            <h1>Giới thiệu thành viên</h1>
            <div className='member-content'>
            <div className="column">
                <div className="card">
                    <img src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/442384348_1157413532173057_6256722979044235522_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=K_jYlPs6XLEQ7kNvgEPmxat&_nc_ht=scontent.fhan14-2.fna&_nc_gid=AXE_pmIDJcHdFqBq8XoX9AA&oh=00_AYAwVy3uslWESgOUQXNJI0AciU91YKHUC66C8SilEK749w&oe=66EECC4E" alt="Cuong" width="100%"/>
                    <div className="container">
                        <h2>Trần Kim Cương</h2>
                        <p className="title">Fullstack</p>
                        <p>Lớp: DCCNTT.14.C.2</p>
                        <p>MSV: 20231192</p>
                        <p>Email: 20231192@eaut.edu.vn</p>
                    </div>
                </div>
                <div className="card">
                    <img src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/342201050_149115407895246_3026273684423722485_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=xj6B3vgSoawQ7kNvgFiYZQ2&_nc_ht=scontent.fhan14-1.fna&_nc_gid=AUcZrtfupW4OZZ3x7hf0LPJ&oh=00_AYBbGhZs3hIwR7-pb-wdQSigxfQP02Fclz6rjwKzYZnuCw&oe=66EEF098" alt="Hieu" width="100%"/>
                    <div className="container">
                        <h2>Phạm Minh Hiếu</h2>
                        <p className="title">Designer</p>
                        <p>Lớp: DCCNTT.14.C.2</p>
                        <p>MSV: 20230957</p>
                        <p>Email: 20230957@eaut.edu.vn</p>
                    </div>
                </div>
                <div className="card">
                    <img src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/460078106_1041353497358877_6411697858462144097_n.jpg?stp=dst-jpg_p526x296&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=I1zra5MrFTUQ7kNvgHViPdf&_nc_ht=scontent.fhan14-3.fna&oh=00_AYCCbnBcYpgUo65fx959bhdF4XwugCq-cDdb9YdCXqBkIA&oe=66EEF46A" alt="John" width="100%"/>
                    <div className="container">
                        <h2>Đoàn Duy Đường</h2>
                        <p className="title">Designer</p>
                        <p>Lớp: DCCNTT.14.C.2</p>
                        <p>MSV: 20232092 </p>
                        <p>Email: 20232092@eaut.edu.vn</p>
                    </div>
                </div>
                <div className="card">
                    <img src="https://i.pinimg.com/280x280_RS/08/84/1c/08841cfb2f636e49c21308142283b92d.jpg" alt="John" width="100%"/>
                    <div className="container">
                        <h2>Đặng Phúc Đình</h2>
                        <p className="title">Frontend/Designer</p>
                        <p>Lớp: DCCNTT.14.C.2</p>
                        <p>MSV: 20231110</p>
                        <p>Email: 20231110@eaut.edu.vn</p>
                    </div>
                </div>
                <div className="card">
                    <img src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/458778268_1244651350225760_2911907702970353918_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=669761&_nc_ohc=vQhKj7v3NyYQ7kNvgGztvMV&_nc_ht=scontent.fhan14-1.fna&oh=00_AYCWiHlAzB4_9MP0W0seEbblM97FFqrNL49dSEJQ8m-KZg&oe=66EEE924" alt="John" width="100%"/>
                    <div className="container">
                        <h2>Trần Quang Huy</h2>
                        <p className="title">Designer</p>
                        <p>Lớp: DCCNTT.14.C.2</p>
                        <p>MSV: 20231338</p>
                        <p>Email: 20231338@eaut.edu.vn</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}

export default Member