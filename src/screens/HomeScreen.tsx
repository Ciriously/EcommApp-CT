import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';
import CleverTap from 'clevertap-react-native';

const {width, height} = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const MOVIE_POSTERS = [
  'https://i.pinimg.com/736x/89/a1/13/89a113130158124f4e0270d7c038a89c.jpg',
  'https://i.pinimg.com/736x/d0/19/31/d01931b768a48405cefb0d43b55c030d.jpg',
  'https://i.pinimg.com/736x/c1/b3/09/c1b309a68e8d129d084d2e4e97e5d933.jpg',
  'https://i.pinimg.com/736x/89/c4/3d/89c43dc6134a289040d68684ccff81ac.jpg',
  'https://i.pinimg.com/736x/52/03/51/52035175c835c41b2e3a6cc65b675259.jpg',
];

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    Animated.timing(contentSlide, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setBgIndex(prev => (prev + 1) % MOVIE_POSTERS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const trackButtonClick = (buttonName: string) => {
    CleverTap.recordEvent('HomeScreen Interaction', {
      Action: buttonName,
      Screen: 'Home',
      Timestamp: new Date().toISOString(),
    });
  };

  const handleLoginPress = () => {
    animateButton();
    trackButtonClick('Login');
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    animateButton();
    trackButtonClick('Register');
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/* Background Slideshow */}
      <Animated.View style={[styles.animatedBg, {opacity: fadeAnim}]}>
        <ImageBackground
          source={{uri: MOVIE_POSTERS[bgIndex]}}
          style={styles.background}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Overlay with UI */}
      <View style={styles.overlay}>
        <View style={styles.topSpace} />

        <Animated.View
          style={[
            styles.bottomContent,
            {
              transform: [{translateY: contentSlide}],
            },
          ]}>
          <Text style={styles.title}>MovieFlix</Text>
          <Text style={styles.subtitle}>
            Your favorite movies, all in one place.
          </Text>

          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginPress}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={handleRegisterPress}
              activeOpacity={0.8}>
              <Text style={[styles.buttonText, styles.secondaryText]}>
                Register
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  topSpace: {
    flex: 1,
  },
  bottomContent: {
    padding: 32,
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#ddd',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 16,
  },
  buttonText: {
    color: '#222',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
});

export default HomeScreen;
