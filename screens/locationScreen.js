import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class LocationScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      locationId: 1,
      locationData: [],
      token: '',
      isFavourite: false
    }
  }

  componentDidMount(){
    this.loadData();
  }

  async loadData(){
    console.log('Loading Data');
    this.setState({isLoading: true, isFavourite: false});

    const token = await AsyncStorage.getItem('session_token');
    const userId = await AsyncStorage.getItem('user_id');
    var locationId = await AsyncStorage.getItem('locationId');

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+locationId,{
      method:'get',
      headers: {
        'X-Authorization': token
      }
    })
    .then((responce) => responce.json())
    .then((responceJson) => {
      this.setState({
        locationData: responceJson,
        locationId: locationId,
        isLoading: false,
        token: token
      });
    })
    .catch((error) => console.log(error))
  }


  Favourite(){
    if(this.state.isFavourite){
      var method = 'devare'
    }
    else{
      var method = 'post'
    }
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationId+'/favourite', {
      method:method,
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.state.token
      },
    })
    .then(() => {
      this.setState({isFavourite: !this.state.isFavourite})
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render()
  {
    if (!this.state.isLoading) {
      return(
        <View>
          <ScrollView>
            <View style={styles.navigation}>
              <Button
                color = '#6ed9ef'
                width= '50%'
                title = 'Go Back'
                onPress = {async () => {
                  this.props.navigation.navigate('FindLocationScreen');
                }}
              />
              <Button
                color = '#29C7E6'
                title = 'Refresh Page'
                onPress = { () => {
                  this.loadData();
                }}
              />
            </View>
            <View style = {styles.storeDetails}>
              <View style = {styles.banner}>
                <Text style={styles.title}> Store Details </Text>
              </View>
              <View>
                <Text> {'Name: '+this.state.locationData.location_name} </Text>
                <Text> {'Location: '+this.state.locationData.location_town} </Text>
                <Text> {'Rating: '+this.state.locationData.avg_overall_rating} </Text>
                <Button
                  color = '#0066cc'
                  title = {this.state.isFavourite?'UnFavourite':'Favourite'}
                  onPress = { () => {
                    this.Favourite();
                  }}
                />
              </View>
            </View>
            <View style = {styles.reviewForm}>
              <View style = {styles.banner}>
                <Text style={styles.title}> Post a review </Text>
              </View>
            <ReviewForm
              token ={this.state.token}
              locationId ={this.state.locationData.location_id}
            />
          </View>
          <View style = {styles.banner}>
            <Text style={styles.title}> Reviews </Text>
          </View>
          <View>
            <FlatList
              data = {this.state.locationData.location_reviews}
              renderItem = {({item}) => (
                <Review
                  data ={item}
                  token ={this.state.token}
                  locationId = {this.state.locationData.location_id}
                />
              )}
            />
          </View>
        </ScrollView>
      </View>
    )}
    else{
      return(
        <View style = {styles.activityIndicator}>
          <ActivityIndicator color = '#b266ff' size = 'large' />
        </View>
      )
    }
  }
}

//a component for posting a new review
class ReviewForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      overall : '',
      price: '',
      quality: '',
      hygiene: '',
      body: '',
      token : this.props.token,
      locationId: this.props.locationId
    }
  }

  Filter(){

    const profanity = ['tea','cake','pastry'];
    var isAcceptable = true;

    profanity.forEach((item,i) => {
      if(this.state.body.includes(item))
      {
        isAcceptable = false;
      }
    });
    return (isAcceptable)
  }

  Validate(){
    var isAcceptable = true;

    var ratings = [this.state.overall,this.state.price,this.state.quality,this.state.hygiene]

    ratings.forEach((item, i) => {
      if(isNaN(item)){
        Alert.alert('Ratings must be a number');
        isAcceptable = false;
      }
      else if(item < 0 || item > 5)
      {
        Alert.alert('Ratings must be between 0 - 5');
        isAcceptable = false;
      }
    });
    return(isAcceptable)
  }

  postReview(){
    if(this.Validate())
    {
      var toSend = {
        'overall_rating': parseInt(this.state.overall,10),
        'price_rating': parseInt(this.state.price,10),
        'quality_rating': parseInt(this.state.quality,10),
        'clenliness_rating': parseInt(this.state.hygiene,10),
        'review_body': this.state.body
      };
      if(this.Filter())
      {
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationId+'/review', {
          method:'post',
          headers: {
            'Content-type': 'application/json',
            'X-Authorization': this.state.token
          },
          body: JSON.stringify(toSend)
        })
        .then(() => {
          console.log('review submitted');

        })
        .catch((error) => {
          console.log(error);
        })
      }
      else{
        return(
          Alert.alert(
            'Reviews must not contain any mention of tea, cake or pastry'
          )
        )
      }
    }
  }
  render(){
    if (true)
    {
      return(
        <View>
          <TextInput placeholder = 'Add an overall rating / 5' onChangeText={(text) => this.setState({overall:text})}
          />
          <TextInput placeholder = 'Add a price rating / 5' onChangeText={(text) => this.setState({price:text})}
          />
          <TextInput placeholder = 'Add a quality rating / 5' onChangeText={(text) => this.setState({quality:text})}
          />
          <TextInput placeholder = 'Add a hygiene rating / 5'onChangeText={(text) => this.setState({hygiene:text})}
          />
          <TextInput placeholder = 'enter a short review' onChangeText={(text) => this.setState({body:text})}
          />
          <Button
            color = '#0066cc'
            title='Submit'
            onPress = {() => {
              this.postReview();

            }}
          />
        </View>
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


// A component for displaying a existing review for a resturaunt
class Review extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data,
      isLiked: false,

    }
  }

  Togglelike(){
    if(this.state.isLiked){
      var method = 'devare'
    }
    else{
      var method = 'post'
    }

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.props.locationId+'/review/'+this.state.data.review_id+'/like', {
      method:method,
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
      console.log('Like toggled');
      this.setState({isLiked:!this.state.isLiked})
    })
    .catch((error) => {
      console.log(error);
    })
  }



  render(){
    return(
      <View style = {styles.reviewBox}>
        <View style = {styles.ratings}>
          <Text> Overall Rating: </Text>
          <Text>{this.state.data.overall_rating}</Text>
        </View>
        <View style = {styles.ratings}>
          <Text> Price Rating: </Text>
          <Text>{this.state.data.price_rating}</Text>
        </View>
        <View style = {styles.ratings}>
          <Text> Quality Rating: </Text>
          <Text>{this.state.data.quality_rating}</Text>
        </View>
        <View style = {styles.ratings}>
          <Text> Cleanliness Rating: </Text>
          <Text>{this.state.data.clenliness_rating}</Text>
        </View>
        <View style = {styles.ratings}>
          <Text> Review: </Text>
          <Text>{this.state.data.review_body}</Text>
        </View>
        <View style = {styles.ratings}>
          <Text> Likes: </Text>
          <Text>{this.state.data.likes}</Text>
        </View>
        <Button
          color = {this.state.isLiked ? '#b266ff': '#0066cc'}
          title= {this.state.isLiked ? 'Liked': 'Like'}
          onPress = {
            () => this.Togglelike()
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  reviewBox:{
    backgroundColor: '#6ed9ef',
    borderWidth: 2,
    margin : 10
  },
  banner:{

    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    height : 40
  },
  reviewForm:{
    borderWidth: 2,
    margin :10
  },
  activityIndicator:{
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navigation:{

  },
  ratings:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  storeDetails:{
    borderWidth: 2,
    margin: 10
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold'
  },

})


export default LocationScreen;
