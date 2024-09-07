import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/home/home';
import 'boxicons/css/boxicons.min.css';

import Register from './routes/register/register';
import Login from './routes/login/login';
import Category from './routes/category/category';
import Country from './routes/country/country';

import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/dang-nhap' element={<Login />} />
          <Route path='/dang-ky' element={<Register />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/country/:countryName" element={<Country />} />
        </Routes>
    </Router>
  );
}

export default App;
