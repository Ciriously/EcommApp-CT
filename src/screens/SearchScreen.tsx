import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import clevertap from 'clevertap-react-native';

const API_KEY = '3f3d99a0fd1f7198cfee2091f5b351bf';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query,
        )}`,
      );
      const json = await response.json();
      setResults(json.results || []);
    } catch (error) {
      console.error('Search error:', error);
      Toast.show({
        type: 'error',
        text1: 'Search Failed',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: any) => {
    setSelectedMovie(movie);

    // Record CleverTap event
    clevertap.recordEvent('Movie Clicked', {
      title: movie.title,
      movie_id: movie.id,
      click_time: new Date().toISOString(),
      platform: Platform.OS,
    });
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      onPress={() => handleMoviePress(item)}
      style={styles.card}>
      {item.poster_path ? (
        <Image
          source={{uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`}}
          style={styles.poster}
        />
      ) : (
        <View style={styles.noPoster}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.overview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search movies..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e50914"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Modal for movie details */}
      <Modal
        visible={!!selectedMovie}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMovie(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{padding: 16}}>
              <Text style={styles.modalTitle}>{selectedMovie?.title}</Text>
              {selectedMovie?.poster_path ? (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`,
                  }}
                  style={styles.modalPoster}
                />
              ) : (
                <View style={styles.noPoster}>
                  <Text>No Image</Text>
                </View>
              )}
              <Text style={styles.modalText}>{selectedMovie?.overview}</Text>
              <TouchableOpacity
                onPress={() => setSelectedMovie(null)}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
  },
  noPoster: {
    width: 100,
    height: 150,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
    marginBottom: 4,
  },
  overview: {
    fontSize: 14,
    color: '#444',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  modalPoster: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
