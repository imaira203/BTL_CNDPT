import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/home/home';
import 'boxicons/css/boxicons.min.css';

import Register from './routes/register/register';
import Login from './routes/login/login';
// import Profile from './routes/Profile/Profile';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/dang-nhap' element={<Login />} />
          <Route path='/dang-ky' element={<Register />} />
        </Routes>
    </Router>
  );
}

export default App;
