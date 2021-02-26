import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet } from 'react-native';

class RegisterScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      firstName:'dd',
      lastName:'',
      email:'',
      password:'',
    }
  }

  addUser(){
    let to_send = {
      "first_name": this.state.firstName,
      "last_name": this.state.lastName,
      "email": this.state.email,
      "password": this.state.password
    };
    console.log(to_send);
    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method:'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(to_send)
    })
    .then((responce) => {
      responce.json()
    })
    .then((responceJson) => {
      console.log(JSON.stringify(responceJson));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render(){
    return(
        <View style = {styles.container}>
          <Text>Register</Text>
          <View style = {styles.enterDetails}>

            <TextInput
              onChangeText = {text => this.setState({firstName:text})}
              placeholder = "Enter your first name"
            />
          </View>
          <View style = {styles.enterDetails}>

            <TextInput
              onChangeText = {text => this.setState({lastName:text})}
              placeholder = "Enter your second name"
            />
          </View>
          <View style = {styles.enterDetails}>

            <TextInput
              onChangeText = {text => this.setState({email:text})}
              placeholder = "Enter your email"
            />
          </View>
          <View style = {styles.enterDetails}>

            <TextInput
              onChangeText = {text => this.setState({password:text})}
              placeholder = "Enter a password"
            />
          </View>
          <Button
            title = "Sign Up"
            onPress = {() => this.addUser()} color = '#b266ff'
          />
          <Button onPress = {() => this.props.navigation.navigate('LoginScreen')} title = "Login Instead" color = '#b266ff'/>
          <Button onPress = {() => this.props.navigation.navigate('HomeScreen')} title = "Go Back" color = '#b266ff'/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  enterDetails:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container:{
    margin:10
  }

})

export default RegisterScreen;
