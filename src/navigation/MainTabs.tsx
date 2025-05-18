// src/navigation/MainTabs.tsx
import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Dashboard from '../screens/Dashboard';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const emojiMap: Record<string, string> = {
  Dashboard: '🏠',
  Cart: '🛒',
  Profile: '👤',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({focused, color, size}) => (
        <Text
          style={{
            fontSize: size,
            color: color,
            opacity: focused ? 1 : 0.6,
          }}
          accessibilityLabel={`${route.name} tab icon`}>
          {emojiMap[route.name]}
        </Text>
      ),
    })}>
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabs;
