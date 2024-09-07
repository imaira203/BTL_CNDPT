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
        <div className='new-like'>{movie.likes}</div>
      </div>
    </div>
  );
}

export default VideoContent;
