import React, { Component } from 'react';
import { Text, View, Button, TextInput, StyleSheet, Alert} from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }



  login(){
    let toSend = {
      email: this.state.email,
      password: this.state.password
    };

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
      method:'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(toSend)
    })
    .then((responce) => responce.json())
    .then((responceJson) => {
      AsyncStorage.setItem('session_token', responceJson.token);
      AsyncStorage.setItem('user_id', responceJson.id.toString());
    })
    .then( () => {
      console.log(AsyncStorage.getItem('user_id'));
      this.props.navigation.navigate('FindLocationScreen')
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Invalid Login Details');
    })
  }

  render(){
    return(
      <View style = {styles.loginForm}>
        <View style = {styles.banner}>
          <Text> Welcome </Text>
        </View>
        <TextInput
          onChangeText = {text => this.setState({email:text})}
          placeholder = 'Enter your email'
        />
        <TextInput
          onChangeText = {text => this.setState({password:text})}
          placeholder = 'Enter your password'
        />
        <Button
          color = '#6ed9ef'
          title = 'Login'
          onPress = {() => this.login()}
        />
        <Button
          color = '#0066cc'
          onPress = {() => this.props.navigation.navigate('HomeScreen')}
          title = 'go back'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginForm:{
    margin:10,
  },
  banner:{
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    height : 40
  },
})

export default LoginScreen;
