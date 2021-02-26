import React, { Component } from 'react';
import {Text, View, Button, TextInput, StyleSheet, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

class SidePanel extends Component{
  constructor(props){
    super(props)
    this.state = {
      userData : [],
      isLoading: true,
      id: '',
      token: '',
      first_name: '',
      last_name: '',
      email : '',
    }
  }

  componentDidMount(){
    this.loadUserInfo();
  }

  async loadUserInfo(){

    this.setState({isLoading:true});

    const token = await AsyncStorage.getItem('session_token');
    const id = await AsyncStorage.getItem('user_id');
    console.log("isfsfsfd= "+id);
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+id,{
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
        token : token
        });
        console.log(this.state.userData.liked_reviews);
    })
    .catch((error) => console.log(error))
  }

  async logout(){

    const token = await AsyncStorage.getItem('session_token');
    await AsyncStorage.setItem('session_token', '');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method:'post',
      headers: {
        'X-Authorization': token
      }
    })
    .then(() => {
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
        console.log(error);
    })
  }

  updateUserInfo(){
    this.setState({isLoading:true});
    let to_send = {};

    if (this.state.first_name != this.state.userData.first_name){
      to_send['first_name'] = this.state.first_name
    }

    if (this.state.last_name != this.state.userData.last_name){
      to_send['last_name'] = this.state.last_name
    }

    if (this.state.email != this.state.userData.email){
      to_send['email'] = this.state.email
    }

    if (this.state.password != ''){
      to_send['password'] = this.state.password
    }

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+this.state.id, {
      method:'patch',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.state.token
      },
      body: JSON.stringify(to_send)
    })
    .then((responce) => {
      this.loadUserInfo();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    if (!this.state.isLoading)
    {
      return(
        <ScrollView>

          {/* A form for updating user details*/}
          <View>
            <Button color = '#b266ff' title="Go Back" onPress= {() => this.props.navigation.navigate('FindLocationScreen')} />
            <Button color = '#b266ff' title="Refresh Page" onPress= {() => this.loadUserInfo()} />
            <Text> name </Text>
            <TextInput
              defaultValue = {this.state.userData.first_name}
              onChangeText = {(text) => this.setState({'first_name':text})}
              />
              <TextInput
              defaultValue = {this.state.userData.last_name}
              onChangeText = {(text) => this.setState({'last_name':text})}
              />
              <TextInput
              defaultValue = {this.state.userData.email}
              onChangeText = {(text) => this.setState({'email':text})}
              />
              <TextInput
              placeholder = {"Enter new password"}
              onChangeText = {(text) => this.setState({'password':text})}
              />
              <Button title="update info" onPress = {() => this.updateUserInfo()} />
              <Button title="log out" onPress= {() => this.logout()} />
          </View>

          {/*Display a list of all reviews posted by the logged in user*/ }
          <View>
            <Text style = {styles.banner}> My Reviews </Text>
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
            />
          </View>

          {/*Display a list of all reviews liked by the logged in user*/ }
          <View>
            <Text style = {styles.banner}> Liked Reviews </Text>
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
            />
          </View>

          {/*Display a list of all locations favourited by the logged in user*/ }
          <View>
            <Text style = {styles.banner}> Favourite Locations </Text>
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
            />
          </View>

        </ScrollView>
    )}
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
    console.log("unliking");
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.data.location.location_id+"/review/"+this.state.data.review.review_id+"/like", {
      method:'delete',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
      console.log("unliked");
    })
    .catch((error) => {
      console.log(error);
    })
  }
  render(){
    return(
      <View style = {styles.reviewBox}>
        <Text> {"Name: "+this.state.data.location.location_name} </Text>
        <Text> {"Overall Rating: "+this.state.data.review.overall_rating}  </Text>
        <Text> {"Price Rating: "+this.state.data.review.price_rating} </Text>
        <Text> {"Quality Rating: "+this.state.data.review.quality_rating} </Text>
        <Text> {"Hygiene Rating: "+this.state.data.review.clenliness_rating} </Text>
        <Text> {"Review: "+this.state.data.review.review_body} </Text>
        <Text> {"Likes: "+this.state.data.review.likes} </Text>
        <Button
          title= "Unlike"
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
      overall: '',
      price: '',
      quality: '',
      hygiene: '',
      body : '',
    }
  }

  DeleteReview(){
    console.log("deleting");
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.data.location.location_id+"/review/"+this.state.data.review.review_id, {
      method:'delete',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
      console.log("Deleted");
    })
    .catch((error) => {
      console.log(error);
    })
  }

  updateReview(){
    let to_send = {};

    if (this.state.data.review.overall_rating != this.state.overall){
      to_send['overall_rating'] = parseInt(this.state.overall,10)
    }

    if (this.state.data.price_rating != this.state.price){
      to_send['price_rating'] = parseInt(this.state.price,10)
    }

    if (this.state.data.review.quality_rating != this.state.quality){
      to_send['quality_rating'] = parseInt(this.state.quality,10)
    }

    if (this.state.data.review.clenliness_rating != this.state.quality){
      to_send['clenliness_rating'] = parseInt(this.state.hygiene,10)
    }
    if (this.state.data.review.review_body != this.state.body){
      to_send['review_body'] = this.state.body
    }

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.data.location.location_id+"/review/"+this.state.data.review.review_id, {
      method:'patch',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
      body: JSON.stringify(to_send)
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    return(
      <View style = {styles.reviewBox}>
        <Text> {"Name: "+this.state.data.location.location_name} </Text>
        <TextInput
        defaultValue = {this.state.data.review.overall_rating.toString()}
        onChangeText = {(text) => this.setState({'overall':text})}
        />
        <TextInput
        defaultValue = {this.state.data.review.price_rating.toString()}
        onChangeText = {(text) => this.setState({'price':text})}
        />
        <TextInput
        defaultValue = {this.state.data.review.quality_rating.toString()}
        onChangeText = {(text) => this.setState({'quality':text})}
        />
        <TextInput
        defaultValue = {this.state.data.review.clenliness_rating.toString()}
        onChangeText = {(text) => this.setState({'hygiene':text})}
        />
        <TextInput
        defaultValue = {this.state.data.review.review_body}
        onChangeText = {(text) => this.setState({'body':text})}
        />
        <Button
          title= "Update"
          onPress = {() => this.updateReview()}
        />
        <Button
          title= "Delete"
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
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.data.location_id+"/favourite", {
      method:'delete',
      headers: {
        'Content-type': 'application/json',
        'X-Authorization': this.props.token
      },
    })
    .then(() => {
      console.log("unfav");
    })
    .catch((error) => {
      console.log(error);
    })
  }


  render(){
    return(
      <View>
        <Text> {"Name: "+this.state.data.location_name} </Text>
        <Text> {"Location: "+this.state.data.location_town} </Text>
        <Text> {"Rating: "+this.state.data.avg_overall_rating} </Text>
        <Button
          color = '#b266ff'
          title = {"UnFavourite"}
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
    backgroundColor: '#ffcc99',
    borderWidth: 2,
    margin :10
  },
  banner:{
    backgroundColor: '#e5ccff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    height : 40
  },

})

export default SidePanel
