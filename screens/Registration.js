import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioForm from 'react-native-simple-radio-button';
import { CheckBox } from 'react-native-elements';
import {firebase} from '../dbconf';
import { useNavigation } from '@react-navigation/native';
export default class Registration extends Component {

  firstnameInputRef = React.createRef();
  lastnameInputRef = React.createRef();
  ageInputRef = React.createRef();
  immunizationsInputRef = React.createRef();

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
      showGenderError: false,
      showImmunizationsError: false,
    };
    this.submitPressed = this.submitPressed.bind(this);
  }

  inputs = () => {
    return [
      this.firstnameInputRef,
      this.lastnameInputRef,
      this.ageInputRef,
      this.immunizationsInputRef,
    ];
  };

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
  }

  onInputFocus = () => {
    this.setState({
      activeIndex: this.getActiveInputIndex(),
    });
  }

  onChangeInputHandler = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  getActiveInputIndex = () => {
    const activeIndex = this.inputs().findIndex((input) => {
      if (input.current == null) {
        return false;
      }
      return input.current.isFocused();
    });
    return activeIndex;
  }

  finishEditing = () => {
    const activeIndex = this.getActiveInputIndex();
    if (activeIndex === -1) {
      return;
    }
    this.setFocus(this.inputs()[activeIndex], false);
  }

  setFocus(textInputRef, shouldFocus) {
    if (shouldFocus) {
      setTimeout(() => {
        textInputRef.current.focus();
      }, 100);
    } else {
      textInputRef.current.blur();
    }
  }

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
    }

    try {
      const registrationData = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        age: this.state.age,
        gender: this.state.gender,
        immunizations: this.state.immunizations,
      };

      //Saving to database

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
        extraScrollHeight={Platform.OS == "android" ? 32 : 0}
      >
        <View style={styles.container}>
          <Text style={styles.header}> Registration</Text>

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
              <Text style={styles.errorText}>Please enter your age.</Text>
            )}
          </View>

          <View style={styles.inputTextWrapper}>
            <Text>Gender:</Text>
            <RadioForm
              radio_props={radio_props}
              initial={-1}
              onPress={(value) => this.setState({ gender: value })}
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
