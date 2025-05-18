import 'react-native-reanimated';
import React from 'react';
import {AppNavigator} from './navigation/AppNavigator';
import firebase from '@react-native-firebase/app';

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
  return <AppNavigator />;
};

export default App;
