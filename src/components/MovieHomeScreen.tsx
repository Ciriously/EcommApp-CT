// src/screens/MovieHomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, ActivityIndicator, View} from 'react-native';
import HorizontalMovieSlider from './HorizontalMovieSlider';

const GENRES = [
  {id: 28, name: 'Action'},
  {id: 35, name: 'Comedy'},
  {id: 18, name: 'Drama'},
];

const API_KEY = '3f3d99a0fd1f7198cfee2091f5b351bf'; // Replace with your TMDb API key

const MovieHomeScreen = () => {
  const [moviesByGenre, setMoviesByGenre] = useState<any>({});
  const [loading, setLoading] = useState(true);

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
    console.log('Added to cart:', movie.title);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieHomeScreen;
