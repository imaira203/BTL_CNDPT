import './home.css';
import { useEffect, useState } from 'react';

function Home() {
  const [actived, setActived] = useState('');
  const [searchString, setSearchString] = useState('');
  const [banner, setBanner] = useState('');

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
              <li><a href='/category/action'>Hành động</a></li>
              <li><a href='/category/drama'>Drama</a></li>
              <li><a href='/category/comedy'>Hài hước</a></li>
              <li><a href='/category/romance'>Lãng mạn</a></li>
              <li><a href='/category/horror'>Kinh dị</a></li>
              <li><a href='/category/horror'>Trinh thám</a></li>
              <li><a href='/category/horror'>Cổ trang</a></li>
              <li><a href='/category/horror'>Phim tài liệu</a></li>
              <li><a href='/category/horror'>Phiêu lưu</a></li>
              <li><a href='/category/horror'>Khoa học - viễn tưởng</a></li>
              <li><a href='/category/horror'>Hoạt hình</a></li>
              <li><a href='/category/horror'>Thần thoại</a></li>
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
              <li><a href='/country/china'>Việt Nam</a></li>
              <li><a href='/country/usa'>Hoa Kỳ</a></li>
              <li><a href='/country/uk'>Anh</a></li>
              <li><a href='/country/japan'>Nhật Bản</a></li>
              <li><a href='/country/south-korea'>Hàn Quốc</a></li>
              <li><a href='/country/china'>Trung Quốc</a></li>
              <li><a href='/country/china'>Thái Lan</a></li>
              <li><a href='/country/china'>Ấn Độ</a></li>
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
          <img src={banner}></img>
          <img src={banner}></img>
          <img src={banner}></img>
          <img src={banner}></img>
          <img src={banner}></img>
        </div>
        <div className='main-page'>
          <div className='main-movie'>
            <div className='hot'></div>
            <div className='new-movie'></div>
          </div>
          <aside className='bxh'></aside>
        </div>
      </div>
    </div>
  );
}

export default Home;
