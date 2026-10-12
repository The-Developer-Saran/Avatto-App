import { BackHandler, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import { TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

const CommingSoon = ({navigation}) => {

        function handleBackButtonClick() {
              navigation.navigate('Footer');
              return true;
          }
      
          useEffect(() => {
              const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
              return () => {
                  backhandler.remove();
              };
          }, []);
      

  return (
    <>
    <StatusBar  backgroundColor='#0000' />
    <View style={styles.container}>
 
            <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={styles.header}>
                <Icon onPress={() => navigation.navigate("Footer")}  name="left" size={22} color="white" style={{ marginTop: hp(4) }} />
                <Text  onPress={() => navigation.navigate("Footer")} style={styles.headerText}>Back</Text>
            </TouchableOpacity>

    <View style={{width:wp(100),height:hp(90),justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
        <Lottie resizeMode='contain' source={require('../assets/json/commingSoon.json')} style={{ width: hp(40), height: hp(40) }} autoPlay loop />
        
    </View>
    </View>
    </>
  )
}

export default CommingSoon

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#A6222C',
        // backgroundColor: '#ff6000',
        height: hp(10),
        padding: hp(1.5),
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
    },

    headerText: {
        color: "#fff",
        fontSize: hp(2),
        fontWeight: "bold",
        marginTop: hp(4),
        marginLeft: wp(5),
        fontFamily: "DMSans-Medium",
    },
})