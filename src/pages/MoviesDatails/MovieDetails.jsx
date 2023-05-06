import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';
import { API_KEY } from 'utils/ApiKey';
import {
  Container,
  MoviesIdImg,
  AdditionalInfo,
  DescriptionContainer,
  AdditionalLink,
  MovieDatailsContainer,
  LoaderContainer,
  ContainerForImgAndDescription,
  BackLink,
  ErrorContainer,
  ErrorPrg,
} from './MoviesDatails.styles';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [errorMas, setErrorMas] = useState(null);
  const location = useLocation();
  const backLinkLocationRef = useRef(location.state?.from ?? '/');
  const { movieId } = useParams();

  useEffect(() => {
    const getMovieById = async () => {
      try {
        const respons = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );

        const data = respons.data;

        const movieObj = {
          title: data.title || data.name,
          average: data.vote_average,
          overview: data.overview,
          genres: data.genres.map(({ name }) => name).join(', '),
          poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
          date: data.release_date.split('-')[0],
        };

        setMovie(movieObj);
      } catch (error) {
        setErrorMas(
          'Sorry, but there is no detailed information about this movie, choose another movie =('
        );
      }
    };

    getMovieById();
  }, [movieId]);

  return (
    <MovieDatailsContainer>
      {movie ? (
        <Container>
          <BackLink to={backLinkLocationRef.current}>
            <BiArrowBack />
            Go back</BackLink>
          <ContainerForImgAndDescription>
            <MoviesIdImg src={movie.poster} alt={movie.title} />
            <DescriptionContainer>
              <h2>
                {movie.title} ({movie.date})
              </h2>
              <p>User score: {movie.average}</p>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
              <h3>Genres</h3>
              <p>{movie.genres}</p>

              <AdditionalInfo>
                <h3>Additional information:</h3>
                <AdditionalLink to={'cast'}>Cast </AdditionalLink>
                <AdditionalLink to={'reviews'}>Reviews </AdditionalLink>
              </AdditionalInfo>

              <div>
                <Suspense fallback={<p>loading</p>}>
                  <Outlet />
                </Suspense>
              </div>
            </DescriptionContainer>
          </ContainerForImgAndDescription>
        </Container>
      ) : (
        (errorMas === null && (
          <LoaderContainer>
            <Oval
                height={80}
                width={80}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
          </LoaderContainer>
        )) || (
          <ErrorContainer>
            <BackLink to={backLinkLocationRef.current}></BackLink>
            <ErrorPrg>{errorMas}</ErrorPrg>
          </ErrorContainer>
        )
      )}
    </MovieDatailsContainer>
  );
};

export default MovieDetails;
