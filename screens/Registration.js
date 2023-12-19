import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioForm from 'react-native-simple-radio-button';
import { CheckBox } from 'react-native-elements';
import { firebase } from '../dbconf';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Registration extends Component {
  // Refs for managing focus on input fields
  firstnameInputRef = React.createRef();
  lastnameInputRef = React.createRef();
  ageInputRef = React.createRef();
  immunizationsInputRef = React.createRef();

  // Component state for managing form data and errors
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      age: '',
      gender: '',
      immunizations: [],
      showFirstnameError: false,
      showLastnameError: false,
      showAgeError: false,
      ageErrorText: '',
      showGenderError: false,
      showImmunizationsError: false,
    };
    this.submitPressed = this.submitPressed.bind(this);
  }

  // Function to get an array of input refs
  inputs = () => [
    this.firstnameInputRef,
    this.lastnameInputRef,
    this.ageInputRef,
    this.immunizationsInputRef,
  ];

  // Function to move focus to the next input field
  editNextInput = () => {
    const activeIndex = this.getActiveInputIndex();
    if (activeIndex === -1) {
      return;
    }

    const nextIndex = activeIndex + 1;
    if (nextIndex < this.inputs().length && this.inputs()[nextIndex].current != null) {
      this.setFocus(this.inputs()[nextIndex], true);
    } else {
      this.finishEditing();
    }
  };

  // Callback when an input field is focused
  onInputFocus = () => {
    this.setState({
      activeIndex: this.getActiveInputIndex(),
    });
  };

  // Handler for input value changes
  onChangeInputHandler = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  // Function to get the index of the active input field
  getActiveInputIndex = () => {
    const activeIndex = this.inputs().findIndex((input) => {
      if (input.current == null) {
        return false;
      }
      return input.current.isFocused();
    });
    return activeIndex;
  };

  // Finish editing by removing focus from the active input field
  finishEditing = () => {
    const activeIndex = this.getActiveInputIndex();
    if (activeIndex === -1) {
      return;
    }
    this.setFocus(this.inputs()[activeIndex], false);
  };

  // Set focus on an input field
  setFocus(textInputRef, shouldFocus) {
    if (shouldFocus) {
      setTimeout(() => {
        textInputRef.current.focus();
      }, 100);
    } else {
      textInputRef.current.blur();
    }
  }

  // Handle the form submission
  async submitPressed() {
    // Validation checks
    if (
      this.state.firstname.length < 1 ||
      this.state.lastname.length < 1 ||
      this.state.age.length < 1 ||
      this.state.gender.length < 1 ||
      this.state.immunizations.length === 0
    ) {
      this.setState({
        showFirstnameError: this.state.firstname.length < 1,
        showLastnameError: this.state.lastname.length < 1,
        showAgeError: this.state.age.length < 1,
        showGenderError: this.state.gender.length < 1,
        showImmunizationsError: this.state.immunizations.length === 0,
      });
      return;
    } else {
      // Additional age validation checks
      const ageValue = parseInt(this.state.age, 10);
      if (isNaN(ageValue) || ageValue < 1 || ageValue > 16) {
        this.setState({
          showAgeError: true,
          ageErrorText: ageValue > 16 ? 'Age exceeds 16' : 'Please enter a valid age (1-16)',
        });
        return;
      }

      try {
        const registrationData = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          age: ageValue,
          gender: this.state.gender,
          immunizations: this.state.immunizations,
        };

        // Saving to the database
        await firebase.firestore().collection('registrations').add(registrationData);

        // Reset form after successful submission
        this.setState({
          firstname: '',
          lastname: '',
          age: '',
          gender: '',
          immunizations: [],
          showFirstnameError: false,
          showLastnameError: false,
          showAgeError: false,
          ageErrorText: '',
          showGenderError: false,
          showImmunizationsError: false,
        });

        // Show success message and options
        Alert.alert(
          'Success',
          'Child added successfully!',
          [
            {
              text: 'Register New Child',
              onPress: () => console.log('Register New Child Pressed'),
            },
            {
              text: 'View Registered Children',
              onPress: () => this.navigateToRegisteredChildrenList(),
            },
          ],
          { cancelable: false }
        );

        console.log('Data saved successfully!');
        console.log('Registration Data', registrationData);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }


  navigateToRegisteredChildrenList() {
    const { navigation } = this.props;
    navigation.navigate('RegisteredChildren');
  }

  
  toggleImmunization(type) {
    const { immunizations } = this.state;
    const updatedImmunizations = immunizations.includes(type)
      ? immunizations.filter((item) => item !== type)
      : [...immunizations, type];
    this.setState({ immunizations: updatedImmunizations });
  }

  
  render() {
    const radio_props = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ];

    const radioStyle = {
      labelStyle: { fontSize: 16, color: 'black' }, // 
      radioStyle: { marginLeft: 10, marginRight: 10 }, 
      buttonColor: 'lightgray', 
    };

    return (
      <KeyboardAwareScrollView
        style={styles.container}
        contentOffset={{ x: 0, y: 24 }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 24 }}
        contentInsetAdjustmentBehavior="always"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        enableOnAndroid={true}
        extraHeight={32}
        extraScrollHeight={Platform.OS == 'android' ? 32 : 0}
      >
        <View style={styles.container}>
          
          <Text style={styles.header}>
            <Icon name="account-plus-outline" size={48} style={styles.icon} /> Registration
          </Text>
          
          <View style={styles.inputTextWrapper}>
            <TextInput
              placeholder="First Name"
              style={styles.textInput}
              returnKeyType="next"
              onSubmitEditing={this.editNextInput}
              onFocus={this.onInputFocus}
              onChangeText={(value) => this.onChangeInputHandler('firstname', value)}
              ref={this.firstnameInputRef}
            />
            {this.state.showFirstnameError && (
              <Text style={styles.errorText}>Please enter your first name.</Text>
            )}
          </View>
         
          <View style={styles.inputTextWrapper}>
            <TextInput
              placeholder="Last Name"
              style={styles.textInput}
              returnKeyType="next"
              onSubmitEditing={this.editNextInput}
              onFocus={this.onInputFocus}
              onChangeText={(value) => this.onChangeInputHandler('lastname', value)}
              ref={this.lastnameInputRef}
            />
            {this.state.showLastnameError && (
              <Text style={styles.errorText}>Please enter your last name.</Text>
            )}
          </View>

          <View style={styles.inputTextWrapper}>
            <TextInput
              placeholder="Age"
              style={styles.textInput}
              returnKeyType="next"
              onSubmitEditing={this.editNextInput}
              onFocus={this.onInputFocus}
              onChangeText={(value) => this.onChangeInputHandler('age', value)}
              ref={this.ageInputRef}
            />
            {this.state.showAgeError && (
              <Text style={styles.errorText}>{this.state.ageErrorText}</Text>
            )}
          </View>
          
         <View style={styles.inputTextWrapper}>
            <Text style={{ marginRight: 10 }}>Gender:</Text>
            <RadioForm
              radio_props={radio_props}
              initial={-1}
              onPress={(value) => this.setState({ gender: value })}
              {...radioStyle}
            />
            {this.state.showGenderError && (
              <Text style={styles.errorText}>Please select your gender.</Text>
            )}
          </View>

          <View style={styles.inputTextWrapper}>
            <Text>Immunizations:</Text>
            <View>
              <CheckBox
                title="BCG"
                checked={this.state.immunizations.includes('BCG')}
                onPress={() => this.toggleImmunization('BCG')}
              />
              <CheckBox
                title="MMR"
                checked={this.state.immunizations.includes('MMR')}
                onPress={() => this.toggleImmunization('MMR')}
              />
              <CheckBox
                title="RV"
                checked={this.state.immunizations.includes('RV')}
                onPress={() => this.toggleImmunization('RV')}
              />
              <CheckBox
                title="DTaP"
                checked={this.state.immunizations.includes('DTaP')}
                onPress={() => this.toggleImmunization('DTaP')}
              />
            </View>
            {this.state.showImmunizationsError && (
              <Text style={styles.errorText}>Please select at least one immunization.</Text>
            )}
          </View>

          <View style={styles.btnContainer}>
            <Button title="Submit" onPress={this.submitPressed} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

// Styles for the Registration component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 36,
    padding: 24,
    margin: 12,
    textAlign: 'center',
  },
  inputTextWrapper: {
    marginBottom: 24,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    paddingRight: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 36,
  },
});
