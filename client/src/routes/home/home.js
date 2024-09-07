import './home.css';
import { useEffect, useState } from 'react';

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
            <div className='new-movie'>
              cái này là phim mới
            </div>
          </div>
          <aside className='bxh'>
            <h1>Bảng xếp hạng</h1>
            <div className='bxh-content'>
              <div className='child-content'>
                <div className='img'>
                  <img alt='img' src='https://image.motchilltv.vc/motchill/lieu-chu-ky-kieu-tang-x350.webp'></img>
                </div>
                <div className='content-container'>
                  <div className='title'>abc</div>
                  <div className='year'>2024</div>
                  <div className='icon'>
                    <i className='bx bx-bar-chart-alt' >124485</i>
                  </div>
                </div>
              </div>
              <div className='child-content'>
                <div className='img'>
                  <img alt='img' src='https://image.motchilltv.vc/motchill/lieu-chu-ky-kieu-tang-x350.webp'></img>
                </div>
                <div className='content-container'>
                  <div className='title'>Mo</div>
                  <div className='year'>2024</div>
                  <div className='icon'>
                    <i className='bx bx-bar-chart-alt' >124485</i>
                  </div>
                </div>
              </div>
              <div className='child-content'>
                <div className='img'>
                  <img alt='img' src='https://image.motchilltv.vc/motchill/lieu-chu-ky-kieu-tang-x350.webp'></img>
                </div>
                <div className='content-container'>
                  <div className='title'>abc</div>
                  <div className='year'>2024</div>
                  <div className='icon'>
                    <i className='bx bx-bar-chart-alt' >124485</i>
                  </div>
                </div>
              </div>
              <div className='child-content'>
                <div className='img'>
                  <img alt='img' src='https://image.motchilltv.vc/motchill/lieu-chu-ky-kieu-tang-x350.webp'></img>
                </div>
                <div className='content-container'>
                  <div className='title'>abc</div>
                  <div className='year'>2024</div>
                  <div className='icon'>
                    <i className='bx bx-bar-chart-alt' >124485</i>
                  </div>
                </div>
              </div>
              <div className='child-content'>
                <div className='img'>
                  <img alt='img' src='https://image.motchilltv.vc/motchill/lieu-chu-ky-kieu-tang-x350.webp'></img>
                </div>
                <div className='content-container'>
                  <div className='title'>abc</div>
                  <div className='year'>2024</div>
                  <div className='icon'>
                    <i className='bx bx-bar-chart-alt' >124485</i>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Home;
