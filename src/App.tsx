import 'react-native-reanimated';
import React from 'react';
import {AppNavigator} from './navigation/AppNavigator';
import {CartProvider} from './context/CartContext';
import Toast from 'react-native-toast-message';

import firebase from '@react-native-firebase/app';

// Optional Firebase config (uncomment and replace if needed)
// if (!firebase.apps.length) {
//   const firebaseConfig = {
//     apiKey: 'YOUR_API_KEY',
//     authDomain: 'YOUR_AUTH_DOMAIN',
//     projectId: 'YOUR_PROJECT_ID',
//     storageBucket: 'YOUR_STORAGE_BUCKET',
//     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//     appId: 'YOUR_APP_ID',
//   };
//   firebase.initializeApp(firebaseConfig);
// }

const App = () => {
  return (
    <CartProvider>
      <Toast />

      <AppNavigator />
    </CartProvider>
  );
};

export default App;
