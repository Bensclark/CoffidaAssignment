import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class SidePanel extends Component{
  constructor(props){
    super(props)
  }

  async logout(){
    const key = await AsyncStorage.getItem('session_token');
    console.log(key);
    await AsyncStorage.setItem('session_token', '');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method:'post',
      headers: {
        'X-Authorization': key
      }
    })
    .then(() => {
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
        console.log(error);
    })
  }

  render(){
    return(
      <View>
        <Button title="my info" />
        <Button title="log out" onPress= {() => this.logout()} />
      </View>
    )
  }


}
export default SidePanel
