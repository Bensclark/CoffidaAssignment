import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet, ActivityIndicator, FlatList, ScrollView, Alert } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class UserScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      userData : [],
      isLoading: true,
      id: '',
      token: '',
      firstName: '',
      lastName: '',
      email : '@' ,
      password: ''
    }
  }

  componentDidMount(){
    this.loadUserInfo();
  }

  Validate(){
    let isAcceptable = true;
    let passwordArr = this.state.password.split('');
    let hasNumber = false;

    if (!this.state.email.includes('@' || this.state.email )){
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

  async loadUserInfo(){

    this.setState({isLoading:true});

    const token = await AsyncStorage.getItem('session_token');
    const id = await AsyncStorage.getItem('user_id');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+id,{
      method:'get',
      headers: {
        'X-Authorization':token
      }
    })
    .then((responce) => responce.json())
    .then((responceJson) => {
      this.setState({
        userData : responceJson,
        isLoading: false,
        id : id,
        token : token,
        firstName: responceJson.first_name,
        lastName: responceJson.last_name,
        email: responceJson.email
      });
    })
    .catch((error) => console.log(error))
  }

  async logout(){
    const token = await AsyncStorage.getItem('session_token');
    await AsyncStorage.setItem('session_token', '');

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method:'post',
      headers: {
        'X-Authorization': token
      }
    })
    .then(() => {
      this.props.navigation.navigate('HomeScreen');
    })
    .catch((error) => {
        console.log(error);
    })
  }

  updateUserInfo(){
    if(this.Validate()){
      this.setState({isLoading:true});
      let toSend = {};

      if (this.state.firstName != this.state.userData.first_name){
        toSend['firstName'] = this.state.firstName
      }

      if (this.state.lastName != this.state.userData.last_name){
        toSend['lastName'] = this.state.lastName
      }

      if (this.state.email != this.state.userData.email){
        toSend['email'] = this.state.email
      }

      if (this.state.password != ''){
        toSend['password'] = this.state.password
      }

      return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+this.state.id, {
        method: 'patch',
        headers: {
          'Content-type': 'application/json',
          'X-Authorization': this.state.token
        },
        body: JSON.stringify(toSend)
      })
      .then((responce) => {
        this.loadUserInfo();
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  render(){
    if (!this.state.isLoading)
    {
      return(
        <ScrollView>
          {/* A form for updating user details*/}
          <View>
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
                  this.loadUserInfo();
                }}
              />
            </View>
            <View style = {styles.detailsBox}>
              <View style = { styles.banner}>
                <Text style={styles.title}> Update Details </Text>
              </View>
              <TextInput
                defaultValue = {this.state.userData.first_name}
                onChangeText = {(text) => this.setState({'firstName':text})}
              />
              <TextInput
                defaultValue = {this.state.userData.last_name}
                onChangeText = {(text) => this.setState({'lastName':text})}
              />
              <TextInput
                defaultValue = {this.state.userData.email}
                onChangeText = {(text) => this.setState({'email':text})}
              />
              <TextInput
                placeholder = {'Enter new password'}
                onChangeText = {(text) => this.setState({'password':text})}
              />
              <Button
                color = '#29C7E6'
                title='update info'
                onPress = {() => this.updateUserInfo()}
              />
              <Button
                color = '#0066cc'
                title='log out'
                onPress= {() => this.logout()}
              />
            </View>
          </View>
          {/*Display a list of all reviews posted by the logged in user*/ }
          <View>
            <View style = {styles.banner}>
              <Text style = {styles.title}> My Reviews </Text>
            </View>
            <FlatList
              data = {this.state.userData.reviews}
              renderItem = {({item}) => (
                <View>
                  <MyReview
                    data ={item}
                    token = {this.state.token}
                  />
                </View>
              )}
              keyExtractor = {item => item.review.review_id.toString()}
            />
          </View>

          {/*Display a list of all reviews liked by the logged in user*/ }
          <View>
            <View style= {styles.banner}>
              <Text style = {styles.title}> Liked Reviews </Text>
            </View>
            <FlatList
              data = {this.state.userData.liked_reviews}
              renderItem = {({item}) => (
                <View>
                  <LikedReview
                    data ={item}
                    token = {this.state.token}
                  />
                </View>
              )}
              keyExtractor = {item => item.review.review_id.toString()}
            />
          </View>
          {/*Display a list of all locations favourited by the logged in user*/ }
          <View style = {styles.locationBox}>
            <View style= {styles.banner}>
              <Text style = {styles.title}> Favourite Locations </Text>
              </View>
            <FlatList
              data = {this.state.userData.favourite_locations}
              renderItem = {({item}) => (
                <View>
                  <FavouriteLocation
                    data ={item}
                    token = {this.state.token}
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
          <ActivityIndicator />
        </View>
      )
    }
  }
}

class LikedReview extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data,
    }
  }

  Unlike(){
    console.log('unliking');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.data.location.location_id+'/review/'+this.state.data.review.review_id+'/like', {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
      console.log('unliked');
    })
    .catch((error) => {
      console.log(error);
    })
  }
  render(){
    return(
      <View style = {styles.reviewBox}>
        <Text> {'Name: '+this.state.data.location.location_name} </Text>
        <Text> {'Overall Rating: '+this.state.data.review.overall_rating}  </Text>
        <Text> {'Price Rating: '+this.state.data.review.price_rating} </Text>
        <Text> {'Quality Rating: '+this.state.data.review.quality_rating} </Text>
        <Text> {'Hygiene Rating: '+this.state.data.review.clenliness_rating} </Text>
        <Text> {'Review: '+this.state.data.review.review_body} </Text>
        <Text> {'Likes: '+this.state.data.review.likes} </Text>
        <Button
          title= 'Unlike'
          onPress = {() => this.Unlike()}
        />
      </View>
    );
  }
}

class MyReview extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data,
      overall: null ,
      price: null,
      quality: null,
      hygiene: null,
      body : null,
    }
  }

  DeleteReview(){
    console.log('deleting');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.data.location.location_id+'/review/'+this.state.data.review.review_id, {
      method :'delete',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
      console.log('Deleted');
    })
    .catch((error) => {
      console.log(error);
    })
  }

  updateReview(){
    let toSend = {};

    if (this.state.data.review.overall_rating != this.state.overall && this.state.overall != null){
      toSend['overall_rating'] = parseInt(this.state.overall,10)
    }

    if (this.state.data.price_rating != this.state.price && this.state.price != null){
      toSend['price_rating'] = parseInt(this.state.price,10)
    }

    if (this.state.data.review.quality_rating != this.state.quality && this.state.quality != null){
      toSend['quality_rating'] = parseInt(this.state.quality,10)
    }

    if (this.state.data.review.clenliness_rating != this.state.quality && this.state.hygiene != null){
      toSend['clenliness_rating'] = parseInt(this.state.hygiene,10)
    }
    if (this.state.data.review.review_body != this.state.body && this.state.body != null){
      toSend['review_body'] = this.state.body
    }

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.data.location.location_id+'/review/'+this.state.data.review.review_id, {
      method: 'patch',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
      body: JSON.stringify(toSend)
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    return(
      <View style = {styles.reviewBox}>
        <Text> {'Name: '+this.state.data.location.location_name} </Text>
        <View style={styles.myRating}>
          <Text> Overall: </Text>
          <TextInput
            defaultValue = {this.state.data.review.overall_rating.toString()}
            onChangeText = {(text) => this.setState({'overall':text})}
          />
        </View>
        <View style={styles.myRating}>
          <Text> Price: </Text>
          <TextInput
            defaultValue = {this.state.data.review.price_rating.toString()}
            onChangeText = {(text) => this.setState({'price':text})}
          />
        </View>
        <View style={styles.myRating}>
          <Text> Quality: </Text>
          <TextInput
            defaultValue = {this.state.data.review.quality_rating.toString()}
            onChangeText = {(text) => this.setState({'quality':text})}
          />
        </View>
        <View style={styles.myRating}>
          <Text> Cleanliness: </Text>
          <TextInput
            defaultValue = {this.state.data.review.clenliness_rating.toString()}
            onChangeText = {(text) => this.setState({'hygiene':text})}
          />
        </View>
        <View style={styles.myRating}>
          <Text> Review: </Text>
          <TextInput
            defaultValue = {this.state.data.review.review_body}
            onChangeText = {(text) => this.setState({'body':text})}
          />
        </View>
        <Button
          title= 'Update'
          onPress = {() => this.updateReview()}
        />
        <Button
          title= 'Delete'
          onPress = {() => this.DeleteReview()}
        />
      </View>
    );
  }
}

class FavouriteLocation extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data,
      overall: '',
      price: '',
      quality: '',
      hygiene: '',
      body : '',
    }
  }

  UnFavourite(){
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.data.location_id+'/favourite', {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
    })
    .catch((error) => {
      console.log(error);
    })
  }


  render(){
    return(
      <View>
        <Text> {'Name: '+this.state.data.location_name} </Text>
        <Text> {'Location: '+this.state.data.location_town} </Text>
        <Text> {'Rating: '+this.state.data.avg_overall_rating} </Text>
        <Button
          color = '#b266ff'
          title = {'UnFavourite'}
          onPress = { () => {
            this.UnFavourite();
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  activityIndicator:{
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reviewBox: {
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
  title:{
    fontSize: 20,
    fontWeight: 'bold'
  },
  locationBox:{
    backgroundColor: '#6ed9ef',
    borderWidth: 2,
    margin : 10
  },
  detailsBox:{
    borderWidth: 2,
    margin : 10
  },
  myRating:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default UserScreen;
