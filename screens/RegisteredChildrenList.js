import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { firebase } from '../dbconf';
import { useNavigation } from '@react-navigation/native';

// RegisteredChildrenList functional component start
export default function RegisteredChildrenList({ navigation }) {
  // State variables for managing data and sorting
  const [sortedChildren, setSortedChildren] = useState([]);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const snapshot = await firebase.firestore().collection('registrations').get();
      const registeredChildren = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          firstname: data.firstname,
          lastname: data.lastname,
          age: data.age,
          gender: data.gender,
          immunizations: data.immunizations || [],
        };
      });

      setSortedChildren(registeredChildren);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to sort children by age
  const sortByAge = () => {
    const sortedByAge = [...sortedChildren].sort((a, b) =>
      ascendingOrder ? a.age - b.age : b.age - a.age
    );
    setSortedChildren(sortedByAge);
    setAscendingOrder(!ascendingOrder);
  };

  // Function to sort children by name
  const sortByName = () => {
    const sortedByName = [...sortedChildren].sort((a, b) =>
      ascendingOrder
        ? a.firstname.localeCompare(b.firstname)
        : b.firstname.localeCompare(a.firstname)
    );
    setSortedChildren(sortedByName);
    setAscendingOrder(!ascendingOrder);
  };

  // Function to navigate to a child's profile
  const goToProfile = (child) => {
    navigation.navigate('Profile', { child });
  };

  // Function to handle search and filter children
  const handleSearch = () => {
    const filteredChildren = sortedChildren.filter((child) => {
      const fullName = `${child.firstname} ${child.lastname}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

    setSortedChildren(filteredChildren);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.sortButton}>
          <TouchableOpacity onPress={sortByAge} activeOpacity={0.7}>
            <Text style={styles.sortButtonText}>
              Sort by Age ({ascendingOrder ? 'Ascending' : 'Descending'})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sortButton}>
          <TouchableOpacity onPress={sortByName} activeOpacity={0.7}>
            <Text style={styles.sortButtonText}>
              Sort by Name ({ascendingOrder ? 'Ascending' : 'Descending'})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search input and button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList to display registered children */}
      <FlatList
        data={sortedChildren}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToProfile(item)} style={styles.childItem}>
            <Text>Name: {item.firstname} {item.lastname}</Text>
            <Text>Age: {item.age}</Text>
            <Text>Gender: {item.gender}</Text>
            <Text>Immunizations: {item.immunizations.join(', ')}</Text>
            <Button title="View Profile" onPress={() => goToProfile(item)} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

// Styles for the RegisteredChildrenList component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sortButton: {
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 10,
    width: '48%', 
  },
  sortButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  childItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
});
