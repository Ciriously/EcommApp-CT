// src/screens/MainPage.tsx
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Header from '../components/UI/Header';
import CleverTap from 'clevertap-react-native';

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
    <View style={styles.container}>
      <Header name={userName} />
      {/* Add e-commerce content here below */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default MainPage;
