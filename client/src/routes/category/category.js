import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './category.css'

const API_URL = process.env.REACT_APP_API_URL;

function Category() {
    const { categoryName } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch(`${API_URL}/api/category/${categoryName}`);
          if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
          }
  
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text(); 
            throw new Error(`Expected JSON response, got: ${text}`);
          }
  
          const data = await response.json();
          setMovies(data.data);
        } catch (error) {
          console.error('Error fetching movies:', error);
          setError(error.message);
        }
      };
  
      fetchMovies();
    }, [categoryName]);
  
    return (
      <div>
        <h1>Movies in {categoryName}</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {movies.length > 0 ? (
            movies.map(movie => (
              <li key={movie.id}>
                <h2>{movie.name}</h2>
                <p>{movie.description}</p>
              </li>
            ))
          ) : (
            <p>No movies found</p>
          )}
        </ul>
      </div>
    );
  }
  
export default Category;
