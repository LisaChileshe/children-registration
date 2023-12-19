import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NavigationBar = () => {
  const navigation = useNavigation();

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
   const navigateToRegisteredChildrenList = () => {
    navigation.navigate('RegisteredChildren');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToHome} style={styles.button}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToRegister} style={styles.button}>
        <Text>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToRegisteredChildrenList} style={styles.button}>
        <Text>Registered Children</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
  },
  button: {
    padding: 10,
  },
});

export default NavigationBar;