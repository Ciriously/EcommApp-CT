import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import HorizontalMovieSlider from './HorizontalMovieSlider';
import {useCart} from '../context/CartContext';
import Toast from 'react-native-toast-message';

const GENRES = [
  {id: 28, name: 'Action'},
  {id: 35, name: 'Comedy'},
  {id: 18, name: 'Drama'},
  {id: 10749, name: 'Romance'},
  {id: 53, name: 'Thriller'},
  {id: 27, name: 'Horror'},
  {id: 878, name: 'Sci-Fi'},
  {id: 10751, name: 'Family'},
  {id: 10402, name: 'Music'},
  {id: 10770, name: 'TV Movie'},
];

const BOLLYWOOD_GENRES = [
  {id: 28, name: 'Bollywood Action'},
  {id: 35, name: 'Bollywood Comedy'},
  {id: 10402, name: 'Bollywood Musical'},
];

const API_KEY = '3f3d99a0fd1f7198cfee2091f5b351bf';

const MovieHomeScreen = () => {
  const [moviesByGenre, setMoviesByGenre] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const {addToCart} = useCart();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data: any = {};

        // Fetch Hollywood movies by genre
        for (const genre of GENRES) {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`,
          );
          const json = await response.json();
          data[genre.name] = json.results.slice(0, 10);
        }

        // Fetch Bollywood movies
        for (const genre of BOLLYWOOD_GENRES) {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&with_original_language=hi`,
          );
          const json = await response.json();
          data[genre.name] = json.results.slice(0, 10);
        }

        setMoviesByGenre(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to load movies',
          text2: 'Please check your internet connection',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleAddToCart = (movie: any) => {
    const cartItem = {
      ...movie,
      price: movie.vote_average > 7 ? 12.99 : 9.99, // Premium pricing for highly rated movies
      quantity: 1,
    };

    addToCart(cartItem);

    Toast.show({
      type: 'success',
      position: 'top',
      text1: '🎬 Added to Cart 🛒',
      text2: movie.title,
      visibilityTime: 2000,
      topOffset: 60,
      props: {
        moviePoster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : null,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Hollywood Sections */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hollywood Movies</Text>
        </View>
        {GENRES.map(genre => (
          <HorizontalMovieSlider
            key={`hollywood-${genre.id}`}
            genre={genre.name}
            movies={moviesByGenre[genre.name] || []}
            onAddToCart={handleAddToCart}
          />
        ))}

        {/* Bollywood Sections */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bollywood Movies</Text>
        </View>
        {BOLLYWOOD_GENRES.map(genre => (
          <HorizontalMovieSlider
            key={`bollywood-${genre.id}`}
            genre={genre.name}
            movies={moviesByGenre[genre.name] || []}
            onAddToCart={handleAddToCart}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e50914',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MovieHomeScreen;
