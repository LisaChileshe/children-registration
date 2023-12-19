import React from 'react';
import { View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Registration from './screens/Registration';
import RegisteredChildrenList from './screens/RegisteredChildrenList';
import ChildProfile from './screens/ChildProfile';
import NavigationBar from './components/Navigation';
import Home from './screens/Home';

const Stack = createNativeStackNavigator()
const Tab = createMaterialTopTabNavigator();

// const TopNav = () => (
//   <Tab.Navigator>
//     <Tab.Screen name="Register" component={Registration} />
//     <Tab.Screen name="RegisteredChildren" component={RegisteredChildrenList} />
//   </Tab.Navigator>
// );

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name = "Home" component={Home} options={{header: () => <NavigationBar />}}/>        
        <Stack.Screen
        name = "Register" component={Registration} options={{header: () => <NavigationBar />}}/>
        <Stack.Screen
        name = "RegisteredChildren" component={RegisteredChildrenList}/>
        <Stack.Screen name = "Profile" component={ChildProfile}/>
      </Stack.Navigator>
  

    </NavigationContainer>
   
     
     
   
  );
};

export default App;
