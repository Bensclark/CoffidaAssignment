import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';

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

  Validate(){
    let isAcceptable = true;
    let passwordArr = this.state.password.split('');
    let hasNumber = false;

    if (!this.state.email.includes('@')){
      isAcceptable = false;
      Alert.alert('Invalid email');
    }

    passwordArr.forEach((item, i) => {
      if (!isNaN(item)){
        hasNumber = true
      }
    });
    if (!hasNumber){
      Alert.alert('Password must contain a number')
      isAcceptable = false;
    }
    return(isAcceptable)
  }

  addUser(){
    if(this.Validate())
    {
      let toSend = {
        'first_name': this.state.firstName,
        'last_name': this.state.lastName,
        'email': this.state.email,
        'password': this.state.password
      };
      console.log(toSend);
      return fetch('http://10.0.2.2:3333/api/1.0.0/user', {
        method:'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(toSend)
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
  }

  render(){
    return(
      <ScrollView style = {styles.container}>
        <View style = {styles.banner}>
          <Text>Register</Text>
        </View>
        <View style = {styles.enterDetails}>
          <TextInput
            onChangeText = {text => this.setState({firstName:text})}
            placeholder = 'Enter your first name'
          />
        </View>
        <View style = {styles.enterDetails}>
          <TextInput
            onChangeText = {text => this.setState({lastName:text})}
            placeholder = 'Enter your second name'
          />
        </View>
        <View style = {styles.enterDetails}>
          <TextInput
            onChangeText = {text => this.setState({email:text})}
            placeholder = 'Enter your email'
          />
        </View>
        <View style = {styles.enterDetails}>
          <TextInput
            onChangeText = {text => this.setState({password:text})}
            placeholder = 'Enter a password'
          />
        </View>
        <Button
          title = 'Sign Up'
          onPress = {() => this.addUser()} color = '#6ed9ef'
        />
        <Button
          onPress = {() =>{
             this.props.navigation.navigate('LoginScreen')
          }}
          title = 'Login Instead'
          color = '#29C7E6'
        />
        <Button
          onPress = {() => {
            this.props.navigation.navigate('HomeScreen')
          }}
          title = 'Go Back'
          color = '#0066cc'
        />
      </ScrollView>
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
  },
  banner:{
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    height : 40
  },
})

export default RegisterScreen;
