import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/home/home';
import 'boxicons/css/boxicons.min.css';

import Register from './routes/register/register';
import Login from './routes/login/login';
import Category from './routes/category/category';
import Country from './routes/country/country';
import Library from './routes/library/library';
import Player from './routes/player/player.js'; 
import Profile from './routes/profile/profile.js'; 
import Member from './routes/member/member.js';

import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/dang-nhap' element={<Login />} />
          <Route path='/dang-ky' element={<Register />} />
          <Route path='/thu-vien' element={<Library />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/country/:countryName" element={<Country />} />
          <Route path="/movie/:slug" element={<Player />} />
          <Route path="/ho-so" element={<Profile />} />
          <Route path="/thanh-vien" element={<Member />} />
          </Routes>
    </Router>
  );
}

export default App;
