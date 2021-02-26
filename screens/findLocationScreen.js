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
    return fetch('http://10.0.2.2:3333/api/1.0.0/find',{
      method: 'get',
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
            color= '#0066cc'
            title = 'My Account'
            onPress = {() => {
              this.props.navigation.navigate('UserScreen')}
            }
          />
          <View>
            <FlatList
              data = {this.state.locations}
              renderItem = {({item}) => (
                <View style = {styles.reviewBox}>
                  <View style = {styles.storeTitle}>
                    <Text> {item.location_name}</Text>
                    <Text> {item.location_town}</Text>
                  </View>
                  <View style = {styles.ratings}>
                    <Text> Overall Rating: </Text>
                    <Text>{item.avg_overall_rating}</Text>
                  </View>
                  <View style = {styles.ratings}>
                    <Text> Average Price rating: </Text>
                    <Text>{item.avg_price_rating}</Text>
                  </View>
                  <View style = {styles.ratings}>
                    <Text> Average Quality rating: </Text>
                    <Text>{item.avg_quality_rating}</Text>
                  </View>
                  <View style = {styles.ratings}>
                    <Text>Average cleanliness rating: </Text>
                    <Text>{item.avg_clenliness_rating}</Text>
                  </View>
                  <Button
                    color = '#0066cc'
                    title = {'View Reviews'}
                    onPress = {async () => {
                      await AsyncStorage.setItem('locationId',item.location_id.toString());
                      this.props.navigation.navigate('LocationScreen');
                    }}
                  />
                </View>
              )}
              keyExtractor = {item => item.location_id.toString()}
            />
          </View>
        </ScrollView>
      )
    }
    else{
      return(
        <View style = {styles.activityIndicator}>
          <ActivityIndicator color = '#0066cc' size = 'large' />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  reviewBox:{
    backgroundColor: '#6ed9ef',
    borderWidth: 2,
    margin : 10
  },
  activityIndicator:{
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  storeTitle:{
    alignItems: 'center'
  },
  ratings:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})


export default FindLocationScreen;
