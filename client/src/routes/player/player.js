import React from 'react';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Player() {
  const { slug } = useParams();
  const [movie, setMovie] = React.useState(null);

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/latest-movies`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const movie = data.data.all.find(m => slugify(m.name) === slug);
        if (movie) {
          fetchMovieDetails(movie.id);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchMovieDetails = async (id) => {
      try {
        const response = await fetch(`${API_URL}/getMovie/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovies();
  }, [slug]);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const actorsList = movie.actors ? movie.actors.split(',').map(actor => actor.trim()) : [];
  const videoEmbedURL = movie.chapter[0].url; 

  return (
    <div className="movie-detail">
      <h1>{movie.name}</h1>
      <img src={movie.thumbnail_image} alt={movie.name} />
      <iframe
        width="600"
        height="400"
        src={videoEmbedURL}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Video"
      ></iframe>
      <p>{movie.description}</p>
      <p>Release Year: {movie.release_year}</p>
      <p>Nation: {movie.nation}</p>
      <p>Actors: {actorsList.join(', ')}</p>
    </div>
  );
}

export default Player;
