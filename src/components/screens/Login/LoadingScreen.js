import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ScrollView, Modal, TouchableWithoutFeedback, Linking, TextInput, ActivityIndicator, } from 'react-native';
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const LoadingScreen = () => {
  return (
    <View style={styles.container}>
    <ActivityIndicator size="large" color="#990099" style={styles.loader} />
  </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
  container:{
flex:1,
alignItems:'center',
backgroundColor:'#000'
  },
  loader:{
marginTop:hp(45)
  },
})