import './home.css';
import { useEffect, useState } from 'react';
import VideoContent from '../../components/VideoContent'; // Import VideoContent

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
  const [latestMovies, setLatestMovies] = useState([]);

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
    const fetchMovies = async () => {
      try {
        const topMoviesResponse = await fetch('http://localhost:81/api/top-movies');
        if (!topMoviesResponse.ok) {
          const errorText = await topMoviesResponse.text();
          throw new Error(`HTTP error! Status: ${topMoviesResponse.status}, Message: ${errorText}`);
        }
        const topMoviesData = await topMoviesResponse.json();
        setTopMovies(topMoviesData.data);

        const latestMoviesResponse = await fetch('http://localhost:81/api/latest-movies');
        if (!latestMoviesResponse.ok) {
          const errorText = await latestMoviesResponse.text();
          throw new Error(`HTTP error! Status: ${latestMoviesResponse.status}, Message: ${errorText}`);
        }
        const latestMoviesData = await latestMoviesResponse.json();
        setLatestMovies(latestMoviesData.data.all); // Adjust based on actual data structure
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
              {latestMovies
                .filter(movie => selectedType === 'all' || (selectedType === 'single' && movie.theloai === 'Phim lẻ') || (selectedType === 'series' && movie.theloai === 'Phim bộ'))
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
