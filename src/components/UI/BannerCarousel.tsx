import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';

const {width} = Dimensions.get('window');

const movies = [
  {
    id: 1,
    title: 'Joker',
    genre: 'Crime, Drama',
    image:
      'https://i.pinimg.com/736x/79/bc/89/79bc896099994aab63a99f1ce7d88aca.jpg',
  },
  {
    id: 2,
    title: 'In the Mood for Love',
    genre: 'Romance, Drama',
    image:
      'https://i.pinimg.com/736x/21/c2/4b/21c24b042511e6fa5f208ddbcbbad090.jpg',
  },
  {
    id: 3,
    title: 'Hasee Toh Phasee',
    genre: 'Romantic Comedy',
    image:
      'https://i.pinimg.com/736x/e5/de/fa/e5defa0f30d91aebadf1b57a2e0a107b.jpg',
  },
];

const BannerCarousel = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % movies.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}>
        {movies.map(item => (
          <View key={item.id} style={styles.cardContainer}>
            <View style={styles.imageCard}>
              <Image source={{uri: item.image}} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    backgroundColor: '#fff',
  },
  cardContainer: {
    width,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  imageCard: {
    width: width * 0.9,
    height: 500,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    marginTop: 12,
    width: width * 0.9,
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#222',
  },
  genre: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 4,
  },
});

export default BannerCarousel;
