import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const Home = () => {
  return (
    <ImageBackground
      source={require('../assets/bg2.png')}
      style={styles.background}>
      <View style={styles.container}>
        {/* Your content goes here */}
        <Text style={styles.title}>Welcome </Text>
        <Text style={styles.subtitle}>A place for something amazing</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
background: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Text color
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Home;
