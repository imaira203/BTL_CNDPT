import './home.css';

function Home() {
  return (
    <div className="main">
        
       <div className="header">
             <a href="/" className="logo">
             <i className='bx bxs-movie'>Dinhprovip</i>
             </a>
             <div className ='bx bx-menu' id='menu-icon'></div>
             
             <ul className='navbar'>
              <li><a href='#home' className='active'>Home</a></li>
              <li><a href='#movie'>Movie</a></li>
              <li><a href='#coming'>Coming</a></li>
              <li><a href='#newsletter'>Newsletter</a></li>
             </ul>
             <a href='#' className='btn'>Sign In</a>
       </div>
    </div>
  );
}

export default Home;
