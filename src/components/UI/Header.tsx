// src/components/UI/Header.tsx
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

interface HeaderProps {
  name: string;
  profilePicUri?: string; // optional remote URI
}

const Header: React.FC<HeaderProps> = ({name, profilePicUri}) => {
  const profileImage = profilePicUri
    ? {uri: profilePicUri}
    : require('../../images/profile.png'); // fallback to local

  const inboxIcon = require('../../images/appinbox.png'); // local image

  return (
    <View style={styles.container}>
      <Image source={profileImage} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.hello}>Hello,</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity>
        <Image source={inboxIcon} style={styles.inboxIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  hello: {
    fontSize: 20,
    color: '#888',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  inboxIcon: {
    width: 48,
    height: 40,
    // tintColor: '#444',
  },
});

export default Header;
