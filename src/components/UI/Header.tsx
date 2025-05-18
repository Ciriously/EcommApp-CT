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
import CleverTap from 'clevertap-react-native';

interface HeaderProps {
  name: string;
  profilePicUri?: string;
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
  const [unreadCount, setUnreadCount] = useState(0);
  const insets = useSafeAreaInsets();
  const inboxIcon = require('../../images/appinbox.png');

  // Initialize CleverTap Inbox
  useEffect(() => {
    CleverTap.initializeInbox();

    CleverTap.addListener(
      CleverTap.CleverTapInboxDidInitialize,
      updateUnreadCount,
    );

    CleverTap.addListener(
      CleverTap.CleverTapInboxMessagesDidUpdate,
      updateUnreadCount,
    );

    return () => {
      CleverTap.removeListener(CleverTap.CleverTapInboxDidInitialize);
      CleverTap.removeListener(CleverTap.CleverTapInboxMessagesDidUpdate);
    };
  }, []);

  const updateUnreadCount = () => {
    CleverTap.getInboxMessageUnreadCount((err, res) => {
      if (!err && res && typeof (res as any).count === 'number') {
        setUnreadCount((res as any).count);
      }
    });
  };

  const handleInboxPress = () => {
    if (onInboxPress) {
      onInboxPress();
    } else {
      showAppInbox();
    }
  };

  const showAppInbox = () => {
    CleverTap.showInbox({
      tabs: ['Offers', 'Promotions'],
      navBarTitle: 'My App Inbox',
      navBarTitleColor: '#FF0000',
      navBarColor: '#FFFFFF',
      inboxBackgroundColor: '#AED6F1',
      backButtonColor: '#00FF00',
      unselectedTabColor: '#0000FF',
      selectedTabColor: '#FF0000',
      selectedTabIndicatorColor: '#000000',
      noMessageText: 'No message(s)',
      noMessageTextColor: '#FF0000',
    });
  };

  useEffect(() => {
    if (profilePicUri) {
      setProfileImage({uri: profilePicUri});
    }
  }, [profilePicUri]);

  // Animations
  const waveAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    if (showNotificationBadge || unreadCount > 0) {
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

    return () => waveSequence.stop();
  }, [waveAnim, notificationAnim, showNotificationBadge, unreadCount]);

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
    <View style={[styles.container, {paddingTop: insets.top + 10}]}>
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
        </Text>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleInboxPress}
        style={styles.inboxButton}>
        <Animated.Image
          source={inboxIcon}
          style={[styles.inboxIcon, {transform: [{scale: notificationScale}]}]}
        />
        {(showNotificationBadge || unreadCount > 0) && (
          <View style={styles.badge} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  profileTouchable: {
    borderRadius: 28,
    backgroundColor: '#F5F5F7',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  hello: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.2,
  },
  waveEmoji: {
    fontSize: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginTop: 2,
    lineHeight: 24,
  },
  inboxButton: {
    width: 48,
    height: 48,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  inboxIcon: {
    width: 22,
    height: 22,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#F5F5F7',
  },
});

export default Header;
