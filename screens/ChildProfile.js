import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const ChildProfile = ({ route }) => {
  const { child } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.childItem}>
        <Icon name="human-child" size={50} color="#555" style={styles.icon} />
        <Text style={styles.header}>{child.firstname} {child.lastname}'s Profile</Text>
      </View>
      <View style={styles.childItem}>
        <Icon name="cake" size={35} color="#555" style={styles.icon} />
        <Text style={styles.text}>Age: {child.age}</Text>
      </View>
      <View style={styles.childItem}>
        <Icon name="gender-male-female" size={35} color="#555" style={styles.icon} />
        <Text style={styles.text}>Gender: {child.gender}</Text>
      </View>

      <View style={styles.childItem}>
        <Icon name="needle" size={35} color="#555" style={styles.icon} />
        <Text style={styles.text}>Immunizations: {child.immunizations.join(', ')}</Text>
      </View>
    </View>
  );
};

// Styles for the ChildProfile component
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});


export default ChildProfile;
