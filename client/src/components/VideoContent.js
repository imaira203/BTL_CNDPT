import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoContent({ movie }) {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');
  };
  

  const checkMarquee = () => {
    const titleElement = titleRef.current;
    return titleElement && titleElement.scrollWidth > titleElement.clientWidth;
  };

  const handleMovieClick = (movieName) => {
    const slug = slugify(movieName);
    navigate(`/movie/${slug}`);
  };

  return (
    <div className='movie-content' onClick={() => handleMovieClick(movie.name)}>
      <div className='img'>
        <img alt='Thumbnail' src={movie.thumbnail_image} />
        <i className='bx bx-play-circle'></i>
      </div>
      <div
        ref={titleRef}
        className={`new-title ${checkMarquee() ? 'marquee-active' : ''}`}
      >
        {movie.name}
      </div>
      <div className='new-nation'>{movie.nation}</div>
      <div className='movie-footer'>
        <div className='new-year'>Năm: {movie.release_year}</div>
        <div className='new-like'>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
          </svg>
          {movie.likes}
        </div>
      </div>
    </div>
  );
}

export default VideoContent;
