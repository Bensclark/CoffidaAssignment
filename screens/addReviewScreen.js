import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class ReviewForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      overall: '',
      price: '',
      quality: '',
      hygiene: '',
      body : '',
      locationId: '',
      key: '',
      id: '',
    }
  }

  componentDidMount(){
    this.loadInfo()
  }

  async loadInfo(){
    const key = await AsyncStorage.getItem('session_token');
    const id = await AsyncStorage.getItem('user_id');
    const locationId = await AsyncStorage.getItem('location_id');
    this.setState({id:id, key:key , locationId: locationId})
  }

  postReview(){
    let to_send = {
      "overall_rating": this.state.overall,
      "price_rating": this.state.price_rating,
      "quality_rating": this.state.quality_rating,
      "clenliness_rating": this.state.hygiene,
      "review_body": this.state.review_body
    };
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.locationId+"/review", {
      method:'post',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.state.key
      },
      body: JSON.stringify(to_send)
    })
    .then(() => {this.props.navigation.navigate('ReviewScreen');})
  }

  render(){
    return(
      <View>

        <View>

          <TextInput placeholder = "Add an overall rating / 5" onChangeText={(text) => this.setState({overall:text})} />

          <TextInput placeholder = "Add a price rating / 5" onChangeText={(text) => this.setState({price:text})}
          />
          <TextInput placeholder = "Add a quality rating / 5" onChangeText={(text) => this.setState({quality:text})}
          />
          <TextInput placeholder = "Add a hygiene rating / 5"onChangeText={(text) => this.setState({hygiene:text})}
          />
          <TextInput placeholder = "enter a short review" onChangeText={(text) => this.setState({body:text})}
          />
          <Button title="Submit" onPress = {() => this.postReview()} />

        </View>
      </View>
    )
  }
}
export default ReviewForm
