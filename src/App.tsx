import 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {AppNavigator} from './navigation/AppNavigator';
import {CartProvider} from './context/CartContext';
import Toast from 'react-native-toast-message';
import CleverTap from 'clevertap-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Setup notification channels (Android only)
        if (Platform.OS === 'android') {
          await setupNotificationChannels();
        }

        // 2. Request notification permissions (iOS only)
        if (Platform.OS === 'ios') {
          await requestNotificationPermissions();
        }

        // 3. Check and show notification primer if needed
        await checkAndShowNotificationPrimer();

        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitialized(true); // Continue app even if initialization fails
      }
    };

    initializeApp();
  }, []);

  const setupNotificationChannels = async () => {
    try {
      await Promise.all([
        CleverTap.createNotificationChannel(
          'CT_PRIMARY_CHANNEL',
          'Essential Notifications',
          'Important account updates',
          4, // High importance
          true, // Enable vibration
        ),
        CleverTap.createNotificationChannel(
          'CT_PROMOTIONS_CHANNEL',
          'Special Offers',
          'Personalized deals',
          3, // Default importance
          false, // No vibration
        ),
      ]);
    } catch (error) {
      console.warn('Notification channel setup failed:', error);
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      CleverTap.registerForPush();
    } catch (error) {
      console.warn('Push permission request failed:', error);
    }
  };

  const checkAndShowNotificationPrimer = async () => {
    try {
      const hasSeenPrimer = await AsyncStorage.getItem(
        '@notificationPrimerShown',
      );
      if (hasSeenPrimer !== 'true') {
        await showPushNotificationPrimer();
      }
    } catch (error) {
      console.warn('Notification primer check failed:', error);
    }
  };

  const showPushNotificationPrimer = async () => {
    try {
      CleverTap.promptPushPrimer({
        inAppType: 'half-interstitial',
        titleText: 'Get Notified',
        messageText:
          'Please enable notifications on your device to use Push Notifications.',
        followDeviceOrientation: true,
        positiveBtnText: 'Allow',
        negativeBtnText: 'Cancel',
        // Optional parameters:
        backgroundColor: '#FFFFFF',
        btnBorderColor: '#0000FF',
        titleTextColor: '#0000FF',
        messageTextColor: '#000000',
        btnTextColor: '#FFFFFF',
        btnBackgroundColor: '#0000FF',
        btnBorderRadius: '2',
        fallbackToSettings: true, //Setting this parameter to true will open an in-App to redirect you to Mobile's OS settings page.
      });
      await AsyncStorage.setItem('@notificationPrimerShown', 'true');
    } catch (error) {
      console.warn('Failed to show notification primer:', error);
    }
  };

  if (!initialized) {
    return null; // Or show a splash screen
  }

  return (
    <CartProvider>
      <AppNavigator />
      <Toast />
    </CartProvider>
  );
};

export default App;
