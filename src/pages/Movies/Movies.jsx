import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from 'utils/ApiKey';
import { BiSearchAlt } from 'react-icons/bi';

import {
  MoviesContainer,
  MoviesSearchForm,
  MoviesSearchInput,
  MoviesSearchBtn,
  MoviesSearchList,
  MoviesSearchItemImg,
  MoviesSearchItemPrg,
} from './Movies.styled';

const Movies = () => {
  const [movies, setMovies] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const searhQuery = searchParams.get('query');

  useEffect(() => {
    if (searhQuery === null) {
      return;
    }
    const getMovieByQuery = async () => {
      try {
        const respons = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searhQuery}&page=1&include_adult=false`
        );

        const data = respons.data.results;

        const filteredData = data.map(({ id, title, name, poster_path }) => ({
          id,
          title: title || name,
          poster: poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Question_mark.svg/1200px-Question_mark.svg.png',
        }));

        setMovies(filteredData);
      } catch (error) {
        console.log(error);
      }
    };

    getMovieByQuery();
  }, [searchParams, searhQuery]);

  const handleSubmit = e => {
    e.preventDefault();
    const query = e.target[0].value.trim();
    if (query === '') {
      return;
    }
    setSearchParams({ query });
  };

  return (
    <MoviesContainer>
      <MoviesSearchForm onSubmit={e => handleSubmit(e)}>
        <MoviesSearchInput type="text" placeholder="Search images..." />
        <MoviesSearchBtn type="submit">
           <BiSearchAlt />
        </MoviesSearchBtn>
      </MoviesSearchForm>

      {movies ? (
        <MoviesSearchList>
          {movies.map(({ id, title, poster }) => {
            return (
              <li key={id}>
                <Link to={`${id}`} state={{ from: location }}>
                  <MoviesSearchItemImg src={poster} alt={title} />
                  <MoviesSearchItemPrg>{title}</MoviesSearchItemPrg>
                </Link>
              </li>
            );
          })}
        </MoviesSearchList>
      ) : (
        <></>
      )}
    </MoviesContainer>
  );
};

export default Movies;
