import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import CleverTap from 'clevertap-react-native';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  price?: number;
}

interface Props {
  genre: string;
  movies: Movie[];
  onAddToCart: (movie: Movie) => void;
}

const HorizontalMovieSlider: React.FC<Props> = ({
  genre,
  movies,
  onAddToCart,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    CleverTap.recordEvent('Product Viewed', {
      'Product Name': movie.title,
      Category: genre,
      MovieID: movie.id,
      'Release Date': movie.release_date,
      Rating: movie.vote_average,
    });
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleAddToCart = () => {
    if (selectedMovie) {
      const movieWithPrice = {
        ...selectedMovie,
        price: 9.99,
      };

      onAddToCart(movieWithPrice);

      CleverTap.recordEvent('Add to Cart', {
        'Product Name': selectedMovie.title,
        Category: genre,
        MovieID: selectedMovie.id,
        Price: 9.99,
      });

      Toast.show({
        type: 'success',
        text1: '🎬 Added to Cart!',
        text2: `${selectedMovie.title} was added to your cart`,
        position: 'bottom',
      });

      closeModal();
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.genreTitle}>{genre}</Text>
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={styles.card}
            activeOpacity={0.7}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.image}
            />
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐ {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <Animated.View style={[styles.modalOverlay, {opacity: fadeAnim}]}>
          <Pressable style={styles.modalBackground} onPress={closeModal} />

          <View style={styles.modalContainer}>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>❌</Text>
            </Pressable>

            {selectedMovie && (
              <>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
                  }}
                  style={styles.modalImage}
                />

                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedMovie.title}</Text>

                  <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                      <Text>📅</Text>
                      <Text style={styles.metaText}>
                        {new Date(selectedMovie.release_date).getFullYear()}
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text>⭐</Text>
                      <Text style={styles.metaText}>
                        {selectedMovie.vote_average.toFixed(1)}
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text>💰</Text>
                      <Text style={styles.metaText}>9.99</Text>
                    </View>
                  </View>

                  <Text style={styles.modalOverview}>
                    {selectedMovie.overview || 'No overview available.'}
                  </Text>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddToCart}
                    activeOpacity={0.8}>
                    <Text style={styles.addButtonText}>🛒 Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  genreTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  card: {
    width: 150,
    height: 225,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 150,
    height: 225,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  ratingContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 18,
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginLeft: 6,
  },
  modalOverview: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

export default HorizontalMovieSlider;
