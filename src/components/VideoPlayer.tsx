import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
// For TypeScript, you might need to install the types for react-native-video
// npm install --save-dev @types/react-native-video

// Get the screen width for responsive styling
const {width} = Dimensions.get('window');

// --- Video Player Component ---
const VideoPlayer = () => {
  // useRef to get a reference to the Video component instance.
  // We explicitly type the ref to be a Video component or null.
  const videoRef = useRef<React.ComponentRef<typeof Video>>(null);

  // useState to manage the paused state of the video.
  // We explicitly type the state as a boolean.
  const [isPaused, setIsPaused] = useState<boolean>(true);

  /**
   * Handles the play button press.
   * Sets the paused state to false, which starts the video.
   */
  const handlePlay = (): void => {
    setIsPaused(false);
  };

  /**
   * Handles the pause button press.
   * Sets the paused state to true, which pauses the video.
   */
  const handlePause = (): void => {
    setIsPaused(true);
  };

  /**
   * This function is called when the video playback finishes.
   * We set the video to paused and seek back to the beginning.
   */
  const onEnd = (): void => {
    setIsPaused(true);
    // The ref might be null, so we check before using it.
    videoRef.current?.seek(0);
  };

  return (
    <View style={styles.container}>
      {/* The Video component from react-native-video */}
      <Video
        ref={videoRef}
        // A placeholder video from the web. Replace with your video source.
        source={{
          uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        style={styles.video}
        // The `paused` prop controls playback.
        paused={isPaused}
        // We don't want the native controls
        controls={false}
        onEnd={onEnd}
        resizeMode="contain" // Ensures the video fits within the view
      />

      {/* Custom Controls Container */}
      <View style={styles.controlsContainer}>
        {/* Play Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.playButton,
            !isPaused && styles.disabledButton,
          ]}
          onPress={handlePlay}
          // Disable the button if the video is already playing
          disabled={!isPaused}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>

        {/* Pause Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.pauseButton,
            isPaused && styles.disabledButton,
          ]}
          onPress={handlePause}
          // Disable the button if the video is already paused
          disabled={isPaused}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.statusText}>
        Status: {isPaused ? 'Paused' : 'Playing'}
      </Text>
    </View>
  );
};

// We export the component as the default export
export default VideoPlayer;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#1F2937', // Slightly lighter dark background
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  video: {
    // Make video responsive, aspect ratio 16:9
    width: '100%',
    aspectRatio: 16 / 9,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#10B981', // Green
  },
  pauseButton: {
    backgroundColor: '#EF4444', // Red
  },
  disabledButton: {
    backgroundColor: '#4B5563', // Gray for disabled state
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: 12,
  },
});
