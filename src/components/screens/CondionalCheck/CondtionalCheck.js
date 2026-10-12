import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';


const ConditionCheck = ({ navigation }) => {

//   const tokenLogin = () => {
//     AsyncStorage.getItem('user').then((value) => {
//       if (value !== null) {
//         console.log(value);
//         let data = (JSON.parse(value));
//         //navigation.navigate('firstscreen');
//          navigation.navigate('Footer', { userid: data.id });
//       }
//       else {
//          navigation.navigate('LoginScreen');
//       }
//     })
//   }


const tokenLogin = () => {
    AsyncStorage.getItem('user').then((value) => {
        console.log('async value');
        console.log(value);
        
        if (value != null) {
            navigation.navigate('Footer', { userid: value });
        }
        else{
            navigation.navigate('LoginScreen');
        }
    })
  }


  useEffect(() => {
  tokenLogin();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
      {/* <ActivityIndicator size={'small'} color='#A6222C' /> */}
      <Image source={require('../../assets/images/Welcome/launch_screen.jpg')} style={{flex:1, resizeMode:'cover'}}/>
    </View>
  )
}

export default ConditionCheck

const styles = StyleSheet.create({})