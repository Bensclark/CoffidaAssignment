import React, { Component } from 'react';
import { Text, View, Button, TextInput, StyleSheet} from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
  constructor(props){
    super(props)

    this.state = {
      email:'',
      password:''
    }
  }

  login(){
    let to_send = {
      email: this.state.email,
      password: this.state.password
    };

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
      method:'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(to_send)
    })
    .then((responce) => responce.json())
    .then((responceJson) => {
      console.log("logging in");
      console.log(responceJson);
      AsyncStorage.setItem('session_token', responceJson.token);
      AsyncStorage.setItem('user_id', responceJson.id.toString());
      console.log("login id = "+  responceJson.id )
    })
    .then( () => {
      console.log(AsyncStorage.getItem('user_id'));
      this.props.navigation.navigate('FindLocationScreen')
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    return(
        <View style = {styles.loginForm}>
          <Text> Login </Text>
          <TextInput
            onChangeText = {text => this.setState({email:text})}
            placeholder = "Enter your email"
          />
          <TextInput
            onChangeText = {text => this.setState({password:text})}
            placeholder = "Enter your password"
          />
          <Button
            color = '#b266ff'
            title = "Login"
            onPress = {() => this.login()}
          />
          <Button
            color = '#b266ff'
            onPress = {() => this.props.navigation.navigate('HomeScreen')}
            title = "go back"
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  loginForm:{
    margin:10,
  }
})

export default LoginScreen;
