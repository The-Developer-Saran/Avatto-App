import { BackHandler, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import { TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

const NoInternet = ({navigation}) => {

  return (
    <>
    <StatusBar  backgroundColor='#0000' />
    <View style={styles.container}>
    <View style={{width:wp(100),height:hp(100),justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
        <Lottie resizeMode='contain' source={require('../../assets/json/Nointernet.json')} style={{ width: hp(45), height: hp(45) }} autoPlay loop />
     <Text style={{fontSize:hp(2),textAlign:'center',fontWeight:'700'}}>Please check your intenet connection !</Text>
    </View>
    </View>
    </>
  )
}

export default NoInternet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

})