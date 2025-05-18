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
} from 'react-native';
import CleverTap from 'clevertap-react-native';

const {width} = Dimensions.get('window');

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
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

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);

    // 🔥 Track Product Viewed
    CleverTap.recordEvent('Product Viewed', {
      'Product Name': movie.title,
      Category: genre,
      MovieID: movie.id,
      'Release Date': movie.release_date,
      Rating: movie.vote_average,
    });
  };

  const handleAddToCart = () => {
    if (selectedMovie) {
      onAddToCart(selectedMovie);

      // 🛒 Track Add to Cart
      CleverTap.recordEvent('Add to Cart', {
        'Product Name': selectedMovie.title,
        Category: genre,
        MovieID: selectedMovie.id,
      });

      setModalVisible(false);
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
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.image}
            />
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedMovie && (
              <>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                <Text style={styles.modalSub}>
                  Released: {selectedMovie.release_date} | ⭐{' '}
                  {selectedMovie.vote_average}
                </Text>
                <Text style={styles.modalOverview}>
                  {selectedMovie.overview}
                </Text>

                <Pressable style={styles.addButton} onPress={handleAddToCart}>
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 12,
  },
  genreTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
  },
  card: {
    width: 140,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 210,
    borderRadius: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 180,
    height: 270,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
  },
  modalSub: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  modalOverview: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
});

export default HorizontalMovieSlider;
