// src/screens/MainPage.tsx
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import CleverTap from 'clevertap-react-native';

import Header from '../components/UI/Header';
import BannerCarousel from '../components/UI/BannerCarousel';
import MovieHomeScreen from '../components/MovieHomeScreen';

const MainPage = () => {
  const route = useRoute<any>();

  const userName = route.params?.name || 'User';
  const email = route.params?.email || '';
  const phone = route.params?.phone || '';

  useEffect(() => {
    CleverTap.recordEvent('MainScreen Viewed', {
      Name: userName,
      Email: email,
      Phone: phone,
    });
  }, [userName, email, phone]);

  return (
    <ScrollView style={styles.container}>
      <Header name={userName} />
      <BannerCarousel />
      <MovieHomeScreen /> {/* Embed the movie list here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default MainPage;
