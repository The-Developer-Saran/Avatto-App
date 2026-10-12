import React, { useState, useEffect, } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@react-native-vector-icons/ant-design';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Icon from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { ScrollView } from 'react-native-virtualized-view';


const PurchaseWalletHistory = () => {
  const navigation = useNavigation();
  // const userId = '12763';


  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);

  // const GoBack = () => {
  //   navigation.goBack();
  // };

  useEffect(() => {
    handleGetData();
  }, []);



  const handleGetData = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        //alert(value)
        try {
          setLoading(true);

          const response = await axios.get(`${BaseUrl}cashTransactionGet?userId=${value}`);

          if (response.data?.Response?.Success == '1') {
            setResult(response.data.Response.Result);
          } else {
            console.log('No data found:', response.data?.Response?.Message || 'Unknown error');
          }
        } catch (error) {
          console.error('Fetch error:', error.message);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
      Alert.alert('Error', `Failed to read user data: ${error.message}`);
    }
  }


  console.log("result :::>>>", result);

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa', }}>
    //   <View style={styles.topBar}>
    //     <TouchableOpacity style={styles.topIconDiv} onPress={GoBack}>
    //       <AntDesign name="left" style={styles.topIcon} />
    //       <Text style={styles.topTitle}>Cash Transaction History</Text>
    //     </TouchableOpacity>
    //   </View>


    <>
      <StatusBar  backgroundColor='#A6222C' />
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(3) }}>
            <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
            <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>PURCHASE WALLET HISTORY</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderDiv}>
            <LottieView
              source={require('../../assets/json/loader.json')}
              style={{
                alignSelf: "center",
                width: wp(100),
                height: hp(20),
                marginBottom: hp(-4),
                backgroundColor: '#fff'
              }} autoPlay loop
            />
          </View>
        ) : (
          <ScrollView >
            <FlatList
              data={result}
              renderItem={({ item, index }) => {
                const backgroundColor = item.v_cash_transactions_pay_status === 0 ? '#ffd2c7' : '#c7ffd6';

                return (
                  <View key={index}>
                    <TouchableOpacity style={[styles.card, { backgroundColor }]}>
                      <View style={styles.cardTop}>
                        <Text style={styles.brandContent}>{item.v_cash_transactions_for}</Text>
                        <Text style={styles.brandContent}>{item.v_cash_transactions_amount_wallet}</Text>
                      </View>

                      <View style={styles.cardBtm}>
                        <Text style={styles.brandContent}>{item.v_cash_transactions_tracking_id}</Text>
                        <Text style={styles.brandContent}>{item.v_cash_transactions_trans_date}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={styles.noUpcomingYet}>
                  <Text style={styles.noUpcomingYetTxt}>No data found</Text>
                </View>
              }
            />
            <View style={{height:hp(0)}}></View>
            <View style={styles.footer}></View>
          </ScrollView>
        )}
      </View>
    </>
  )
}

export default PurchaseWalletHistory

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    color: "#fff",
    fontSize: hp(2),
    fontWeight: "bold",
    marginTop: hp(0),
    marginLeft: wp(5),
    fontFamily: "DMSans-Medium",
  },
  loaderDiv: {
    height: hp(90),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  topBar: {
    backgroundColor: '#fafafa',
    height: hp(5),
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center'
  },
  topIconDiv: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    fontSize: hp(2),
    color: '#000',
    marginLeft: hp(1)
  },
  shopIcon: {
    fontSize: hp(5),
    color: '#000',
    position: 'absolute',
  },
  topTitle: {
    fontSize: hp(2.2),
    marginLeft: hp(1),
    color: 'gray',
    fontWeight: '700'
  },
  card: {
    width: wp(90),
    marginVertical: hp(1),
    borderRadius: hp(2),
    elevation: 10,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: hp(2),
    alignSelf: 'center',
    justifyContent: 'space-between'
  },
  imageContainer: {
    position: 'relative',
    width: hp(9),
    height: hp(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: hp(9),
    height: hp(9),
    resizeMode: 'contain',
    borderRadius: hp(1),
    alignSelf: 'center',
    backgroundColor: '#fff'
  },
  brandContent: {
    fontSize: hp(2),
    color: '#000',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:'red',
    width: wp(82)
  },
  cardBtm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    width: wp(82),
    marginTop: hp(1.5)
  },
  noUpcomingYet: {
    width: wp(90),
    marginVertical: hp(1),
    borderRadius: hp(2),
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: hp(1),
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: hp(3)
  },
  noUpcomingYetTxt: {
    color: 'gray',
    alignSelf: 'center',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'transparent',
    height: hp(10),
    width: wp(100),
  },
})