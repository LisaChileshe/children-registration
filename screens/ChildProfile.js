import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChildProfile = ({ route }) => {
  const { child } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{child.firstname} {child.lastname}'s Profile</Text>
      <View style={styles.childItem}>
        <Text>Age: {child.age}</Text>
        <Text>Gender: {child.gender}</Text>
        <Text>Immunizations: {child.immunizations.join(', ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  childItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
});

export default ChildProfile;
