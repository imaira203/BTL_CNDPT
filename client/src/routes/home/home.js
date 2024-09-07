import './home.css';
import { useEffect, useRef, useState } from 'react';

function Home() {
  const [actived, setActived] = useState('');
  const [searchString, setSearchString] = useState('');
  const [banners] = useState([
    '../../images/test.jpg',
    '../../images/test.jpg',
    '../../images/test.jpg',
    '../../images/test.jpg',
    '../../images/test.jpg',
  ]);

  const [topMovies, setTopMovies] = useState([]);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');


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

  useEffect(() => {
    const savedActive = localStorage.getItem('active');
    if (savedActive) {
      setActived(savedActive);
    }
  }, []);

  useEffect(() => {
    if (actived) {
      localStorage.setItem('active', actived);
    }
  }, [actived]);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await fetch('http://localhost:81/api/top-movies');
        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text(); 
          throw new Error(`Expected JSON response, got: ${text}`);
        }

        const data = await response.json();
        setTopMovies(data.data);
      } catch (error) {
        console.error('Error fetching top movies:', error);
        setError(error.message);
      }
    };

    fetchTopMovies();
  }, []);

  const handleNavClick = (page) => {
    setActived(page);
  };

  const movieTitlesRefs = useRef([]);

  const checkMarquee = (index) => {
    const titleElement = movieTitlesRefs.current[index];
    return titleElement && titleElement.scrollWidth > titleElement.clientWidth;
  };

  return (
    <div className="main">
      <div className="header">
        <a href="/" className="logo">
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
              href='/movie' 
              className={actived === 'movie' ? 'active' : ''} 
              onClick={() => handleNavClick('movie')}
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
        <a href='/dang-nhap' className='btn'>Đăng nhập</a>
      </div>
      <div className='body_home'>
        <div className='recommend'>
          {banners.map((banner, index) => (
              <img key={index} src={banner} alt={`Banner ${index + 1}`} />
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
              {topMovies.map((movie, index) => (
                <div className='movie-content' key={movie.id}>
                  <div className='img'>
                    <img alt='img' src={movie.thumbnail_image}></img>
                    <i className='bx bx-play-circle' ></i>
                  </div>
                    <div 
                      ref={el => movieTitlesRefs.current[index] = el}
                      className={`new-title ${checkMarquee(index) ? 'marquee-active' : ''}`}
                    >
                      {movie.name}
                    </div>
                    <div className='new-nation'>{movie.nation}</div>
                    <div className='movie-footer'>
                      <div className='new-year'>Năm: {movie.release_year}</div>
                      <div className='new-like'>{movie.likes}</div>
                    </div>
                </div>
              ))}
            </div>
          </div>
          <aside className='bxh'>
            <h1>Bảng xếp hạng</h1>
            <div className='bxh-content'>
              {error && <p>Error: {error}</p>}
              {topMovies.map((movie, index) => (
                <div className='child-content' key={movie.id}>
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
