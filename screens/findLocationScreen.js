import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class FindLocationScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      locations : []
    }
  }

  componentDidMount(){
    this.loadLocations();
  }

  async loadLocations(){

    const key = await AsyncStorage.getItem('session_token');

    return fetch("http://10.0.2.2:3333/api/1.0.0/find",{
      method:'get',
      headers: {
        'X-Authorization': key
      }
    })
    .then((responce) => responce.json())
    .then((responceJson) => {
      console.log(responceJson);
      this.setState({
        locations: responceJson,
        isLoading:false
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    if (!this.state.isLoading){
      return(
        <ScrollView>
          <Button
            color= '#b266ff'
            title = "My Account"
            onPress = {() => {
              this.props.navigation.navigate('UserScreen')}
            }
          />

          <FlatList
            data = {this.state.locations}
            renderItem = {({item}) => (
              <View style = {styles.reviewBox}>
                <Text> {"Store name: "+item.location_name}</Text>
                <Text> {"Location: "+item.location_town}</Text>
                <Text> {"Overall Rating: "+item.avg_overall_rating}</Text>
                <Text> {"Average Price rating: "+item.avg_price_rating}</Text>
                <Text> {"Average Quality rating: "+item.avg_quality_rating}</Text>
                <Text> {"Average cleanliness rating: "+item.avg_clenliness_rating} </Text>              
                <Button
                  color = '#b266ff'
                  title = {"View Reviews"}
                  onPress = {async () => {
                    await AsyncStorage.setItem('locationId',item.location_id.toString());
                    this.props.navigation.navigate('LocationScreen');
                  }}
                />
              </View>
            )}
          />
        </ScrollView>
      )
    }
    else{
      return(
        <View style = {styles.activityIndicator}>
          <ActivityIndicator color = '#b266ff' size = 'large' />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  reviewBox:{
    backgroundColor: '#ffcc99',
    borderWidth: 2,
    margin :10
  },
  activityIndicator:{
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }

})


export default FindLocationScreen;
