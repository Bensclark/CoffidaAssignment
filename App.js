import 'react-native-gesture-handler';
import React, { Component, useState, useEffect } from 'react';
import { Text, View, TextInput, Button, FlatList } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage  from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/registerScreen';
import LoginScreen from './screens/loginScreen';
import FindLocationScreen from './screens/findLocationScreen';
import UserScreen from './screens/userScreen';
import LocationScreen from './screens/locationScreen';

const Stack = createStackNavigator ();

class App extends Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='HomeScreen' component = {HomeScreen} />
          <Stack.Screen name='RegisterScreen' component = {RegisterScreen} />
          <Stack.Screen name='LoginScreen' component = {LoginScreen} />
          <Stack.Screen name='FindLocationScreen' component = {FindLocationScreen} />
          <Stack.Screen name='UserScreen' component = {UserScreen}/>
          <Stack.Screen name='LocationScreen' component = {LocationScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
