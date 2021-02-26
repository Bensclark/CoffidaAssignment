import React, { Component } from 'react';
import { Text, View,Button, FlatList, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';


class HomeScreen extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style = {styles.homeBackground}>
        <View style = {styles.titleview}>
          <Text style = {styles.title}> Welcome to Coffida! </Text>
        </View>
        <Image style ={styles.image} source = {require('../storage/photos/home.jpg')} />
        <View style = {styles.accountButtons}>
          <Button
            color = '#6ed9ef'
            title = 'Login'
            onPress = {() => this.props.navigation.navigate('LoginScreen')}
          />
          <Button
            color = '#0066cc'
            title = 'Sign Up'
            onPress = {() => this.props.navigation.navigate('RegisterScreen')}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  homeBackground:{
    margin:10,
    alignItems: 'stretch',
    height : '95%',
    justifyContent: 'space-between'
  },
  accountButtons:{
    margin: 5
  },
  image:{
    width:'100%',
    height: '70%'
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold'
  },
  titleview:{
    alignItems:'center'
  }
})

export default HomeScreen;
