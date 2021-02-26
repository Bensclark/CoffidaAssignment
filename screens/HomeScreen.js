import React, { Component } from 'react';
import { Text, View,Button, FlatList, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class HomeScreen extends Component{
  constructor(props){
    super(props);

    this.state = {loggedIn: false, locationData: [], key: ''
    };

  }


  render(){

      return(
        <View style = {styles.homeBackground}>
          <Text> Welcome to Coffida! </Text>
          <View style = {styles.loginButton}>
            <Button
            //style = {styles.buttonCustom}

              color = '#b266ff'
              title = 'Login'
              onPress = {() => this.props.navigation.navigate('LoginScreen')}
              />
          </View>
          <Button
            color = '#b266ff'
            title = 'Sign Up'
            onPress = {() => this.props.navigation.navigate('RegisterScreen')}
          />

        </View>

      )
  }

//  componentDidMount(){
  //  this.getData();

//  }

}

const styles = StyleSheet.create({
  homeBackground:{
    margin:10,
    backgroundColor: '#cc99ff',
  }
})



export default HomeScreen;
