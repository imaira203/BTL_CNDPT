// src/components/VideoContent.js
import React, { useRef } from 'react';

function VideoContent({ movie }) {
  const titleRef = useRef(null);

  const checkMarquee = () => {
    const titleElement = titleRef.current;
    return titleElement && titleElement.scrollWidth > titleElement.clientWidth;
  };

  return (
    <div className='movie-content'>
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
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
            </svg>
            {movie.likes}
        </div>
      </div>
    </div>
  );
}

export default VideoContent;
