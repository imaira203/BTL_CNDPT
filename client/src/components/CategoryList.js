// src/components/CategoryList.js
import React from 'react';
import VideoContent from './VideoContent';

const CategoryList = ({ movies }) => {
  const categories = [...new Set(movies.map(movie => movie.category))];

  return (
    <div>
      {categories.map(category => (
        <div key={category}>
          <h2>{category}</h2>
          {movies
            .filter(movie => movie.category.includes(category))
            .map(movie => (
              <VideoContent key={movie.id} movie={movie} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
