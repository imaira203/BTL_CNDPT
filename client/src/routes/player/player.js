import React from 'react';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Player() {
  const { slug } = useParams();
  const [movie, setMovie] = React.useState(null);
  const [selectedChapter, setSelectedChapter] = React.useState(null);

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
        if (data.chapter.length > 0) {
          setSelectedChapter(data.chapter[0].url); // Set the first chapter as default
        }
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

  const handleChapterChange = (url) => {
    setSelectedChapter(url);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const actorsList = movie.actors ? movie.actors.split(',').map(actor => actor.trim()) : [];
  const videoEmbedURL = selectedChapter;

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
      <div className="chapters-list">
        <h3>Chapters:</h3>
        <ul>
          {movie.chapter.map((chap, index) => (
            <li key={index}>
              <button onClick={() => handleChapterChange(chap.url)}>
                {chap.title || `Chapter ${index + 1}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Player;
