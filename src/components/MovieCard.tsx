import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

interface MovieCardProps {
  title: string;
  description: string;
  poster: string;
  onAdd: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  description,
  poster,
  onAdd,
}) => (
  <View style={styles.card}>
    <Image source={{uri: poster}} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {description}
      </Text>
      <TouchableOpacity onPress={onAdd} style={styles.button}>
        <Text style={styles.buttonText}>Add to Cart 🛒</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  info: {
    padding: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#444',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});

export default MovieCard;
