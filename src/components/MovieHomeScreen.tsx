import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, ActivityIndicator, View} from 'react-native';
import HorizontalMovieSlider from './HorizontalMovieSlider';
import {useCart} from '../context/CartContext';
import Toast from 'react-native-toast-message';

const GENRES = [
  {id: 28, name: 'Action'},
  {id: 35, name: 'Comedy'},
  {id: 18, name: 'Drama'},
];

const API_KEY = '3f3d99a0fd1f7198cfee2091f5b351bf';

const MovieHomeScreen = () => {
  const [moviesByGenre, setMoviesByGenre] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const {addToCart} = useCart();

  useEffect(() => {
    const fetchMovies = async () => {
      const data: any = {};
      for (const genre of GENRES) {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`,
        );
        const json = await response.json();
        data[genre.name] = json.results.slice(0, 10);
      }
      setMoviesByGenre(data);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const handleAddToCart = (movie: any) => {
    const cartItem = {
      ...movie,
      price: 9.99,
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
      <ScrollView contentContainerStyle={styles.container}>
        {GENRES.map(genre => (
          <HorizontalMovieSlider
            key={genre.id}
            genre={genre.name}
            movies={moviesByGenre[genre.name]}
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
  },
  container: {
    padding: 10,
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieHomeScreen;
