// src/components/UI/Header.tsx
import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderProps {
  name: string;
  profilePicUri?: string; // optional remote URI
  onInboxPress?: () => void;
  onProfilePress?: () => void;
  showNotificationBadge?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  name,
  profilePicUri,
  onInboxPress,
  onProfilePress,
  showNotificationBadge = false,
}) => {
  const [profileImage, setProfileImage] = useState<ImageSourcePropType>(
    profilePicUri ? {uri: profilePicUri} : require('../../images/profile.png'),
  );
  const insets = useSafeAreaInsets();
  const inboxIcon = require('../../images/appinbox.png');

  // Handle potential image loading errors
  useEffect(() => {
    if (profilePicUri) {
      setProfileImage({uri: profilePicUri});
    }
  }, [profilePicUri]);

  // Animation for wave emoji
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Animation for inbox icon when notification appears
  const notificationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wave animation
    const waveSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
      ]),
    );
    waveSequence.start();

    // Notification animation if badge is shown
    if (showNotificationBadge) {
      Animated.sequence([
        Animated.timing(notificationAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.elastic(2),
          useNativeDriver: true,
        }),
        Animated.spring(notificationAnim, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      waveSequence.stop();
    };
  }, [waveAnim, notificationAnim, showNotificationBadge]);

  const waveInterpolation = waveAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const notificationScale = notificationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const handleImageError = () => {
    setProfileImage(require('../../images/profile.png'));
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 15}]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onProfilePress}
        style={styles.profileTouchable}>
        <Image
          source={profileImage}
          style={styles.avatar}
          onError={handleImageError}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.hello}>
          Hello{' '}
          <Animated.Text
            style={[
              styles.waveEmoji,
              {transform: [{rotate: waveInterpolation}]},
            ]}>
            👋
          </Animated.Text>
          ,
        </Text>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onInboxPress}
        style={styles.inboxButton}>
        <Animated.Image
          source={inboxIcon}
          style={[styles.inboxIcon, {transform: [{scale: notificationScale}]}]}
        />
        {showNotificationBadge && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
    }),
  },
  profileTouchable: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  hello: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: -4,
  },
  waveEmoji: {
    fontSize: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins-ExtraBold',
    color: '#222',
    lineHeight: 28,
    maxWidth: '90%',
  },
  inboxButton: {
    position: 'relative',
    padding: 8,
  },
  inboxIcon: {
    width: 28,
    height: 28,
    tintColor: '#555',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});

export default Header;
