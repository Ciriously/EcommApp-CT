import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import clevertap from 'clevertap-react-native';

const ImagePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);

    clevertap.recordEvent('Play Clicked', {
      action_time: new Date().toISOString(),
      platform: Platform.OS,
    });

    console.log('Play button pressed');
  };

  const handlePause = () => {
    setIsPlaying(false);

    clevertap.recordEvent('Pause Clicked', {
      action_time: new Date().toISOString(),
      platform: Platform.OS,
    });

    console.log('Pause button pressed');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: isPlaying
            ? 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif' // sample GIF when playing
            : 'https://via.placeholder.com/500x300.png?text=Click+Play', // fallback image when paused
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.button}
          onPress={isPlaying ? handlePause : handlePlay}>
          <Text style={styles.buttonText}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePlayer;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 220,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  button: {
    backgroundColor: '#e50914',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
