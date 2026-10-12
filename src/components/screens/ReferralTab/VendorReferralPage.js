// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const VendorReferralPage = () => {
//   return (
//     <View>
//       <Text>VendorReferralPage</Text>
//     </View>
//   )
// }

// export default VendorReferralPage

// const styles = StyleSheet.create({})


import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-virtualized-view';
import { Authentication_Key } from "../../key/Key";
import { encryptPiDataNew } from "../Encryption/encryption";
import { BaseUrl } from "../BaseUrl/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "@react-native-vector-icons/ionicons";

const VendorReferralPage = () => {

  const EncKey = encryptPiDataNew(Authentication_Key);
  const [ReferralData, setReferralData] = useState([]);
  const [searchText, setSearchText] = useState("");



  useEffect(() => {
    Vendor_Referral_Get();
  }, []);

  const Vendor_Referral_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const response = await fetch(`${BaseUrl}vendor_referedby?ref_uId=${value}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', authentication: EncKey },
        });

        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);

        const data = await response.json();
        if (data.Response.Success === '1') {
          setReferralData(data.Response.Result);
        } else {
          console.log(data.Response.Message || 'Unknown error');
          setReferralData([]);
        }
      } else {
        console.log('No user data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  // const filteredData = searchText ? ReferralData.filter(item => item.business_name.includes(searchText)) : ReferralData;

  const filteredData = searchText
  ? ReferralData.filter(item =>
      item.business_name.toLowerCase().includes(searchText.toLowerCase())
    )
  : ReferralData;

  return (
    <View style={styles.subcontainer}>
      {/* <TouchableOpacity style={styles.walletViewTot}>
        <Text style={styles.wlletNameTot}>My Total Referrals</Text>
        <Text style={styles.wlletTextTot}>{TotalReferral}</Text>
      </TouchableOpacity>

      <View style={styles.walletcontainer}>
        <TouchableOpacity style={styles.walletView}>
          <Text style={styles.wlletName}>Premium Dealer</Text>
          <Text style={styles.wlletText}>{PremiumCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.walletView}>
          <Text style={styles.wlletName}>Executive</Text>
          <Text style={styles.wlletText}>{ExecutiveCount}</Text>
        </TouchableOpacity>

        <View style={styles.walletView}>
          <Text style={styles.wlletName}>Regional</Text>
          <Text style={styles.wlletText}>{RegionalCount}</Text>
        </View>
      </View> */}


      {/* <TextInput
                    style={styles.input}
                    placeholder="Type mobile number..."
                    keyboardType="numeric"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                /> */}

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Type Shop Name..."
          keyboardType="numeric"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          // maxLength={10}
          // onChangeText={(text) => {
          //   const numericText = text.replace(/[^0-9]/g, ""); // Removes non-numeric characters
          //   setSearchText(numericText);
          // }}
        />
      </View>
      <ScrollView style={styles.listcontainer} showsVerticalScrollIndicator={false}>
        {searchText.length > 0 && filteredData.length === 0 ? (
          <Text style={styles.noDataText}>No Record found</Text>
        ) : (
          <FlatList
            data={filteredData || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Animatable.View animation="zoomIn" duration={1000} delay={index * 100} useNativeDriver>
                <View style={styles.card}>
                  <View style={{ width: wp(90), height: hp(12), justifyContent: "space-evenly", flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <View style={{ width: hp(11), height: hp(11), backgroundColor: '#fff', elevation: 5, borderRadius: hp(5.5), justifyContent: 'center', alignItems: 'center', marginLeft: wp(-3) }}>
                      <Image
                        source={item.logo ? {uri:item.logo} : require('../../assets/images/Utility/shop1.png')}
                        style={styles.icon}
                      />
                    </View>
                    <View style={{ width: wp(0.5), height: hp(12), marginLeft: wp(-3),backgroundColor:'#888' }}></View>
                    <View style={{ width: wp(55), height: hp(10), marginLeft: wp(-3),justifyContent:'center',alignItems:"flex-start" }}>
                      <Text style={{fontSize:hp(2.2),fontWeight:'bold',marginTop:hp(0.5),marginLeft: wp(2),}}>{item.business_name}</Text>
                      <Text style={{fontSize:hp(1.8),fontWeight:'500',marginTop:hp(0.5),marginLeft: wp(2)}}>{item.address}</Text>
                      <Text style={{fontSize:hp(1.8),fontWeight:'500',marginTop:hp(0.5),marginLeft: wp(2)}}>{item.city_name},<Text style={{fontSize:hp(1.8),fontWeight:'bold'}}>{item.state_name}</Text></Text>
                      <Text style={{fontSize:hp(1.8),fontWeight:'500',marginTop:hp(0.5),marginLeft: wp(2)}}>{item.pincode}</Text>
                    </View>

                  </View>
                </View>
              </Animatable.View>
            )}
          />
        )}
        <View style={{ height: hp(5) }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subcontainer: {
    flex: 1,
    // marginTop: hp(2),
    paddingVertical:hp(1),
    paddingHorizontal: wp(5),
    backgroundColor: '#fff',
  },
  walletcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width: wp(90),
    height: hp(9),
    // marginTop: hp(1),
    // backgroundColor:'red'
  },
  walletView: {
    width: wp(28),
    height: hp(8),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#A6222C',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  walletViewTot: {
    width: wp(90),
    height: hp(7),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: '#A6222C',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    flexDirection: 'row'
  },
  wlletTextTot: {
    fontSize: hp(2.5),
    color: '#000',
    fontWeight: '400'
  },
  wlletNameTot: {
    fontSize: hp(1.8),
    color: '#A6222C',
    fontWeight: '400'
  },
  wlletText: {
    fontSize: hp(2.3),
    color: '#000',
    fontWeight: '400'
  },
  wlletName: {
    fontSize: hp(1.6),
    color: '#A6222C',
    marginVertical: hp(1),
    fontWeight: '400'
  },
  listcontainer: {
    width: wp(100),
    padding: hp(1),
    backgroundColor: "#fff",
    alignSelf: 'center'
  },
  // input: {
  //     height: hp(6),
  //     width: wp(90),
  //     borderColor: "#ccc",
  //     borderWidth: 1,
  //     borderRadius: hp(1),
  //     alignSelf: 'center',
  //     marginTop: hp(1),
  //     padding: hp(1.5)
  // },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: hp(1),
    paddingHorizontal: wp(2),
    width: wp(90),
    height: hp(6),
    alignSelf: "center",
    marginTop: hp(1),
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: wp(2),
  },
  input: {
    flex: 1, // Makes input take the remaining space
    height: hp(6),
    fontSize: hp(2),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: hp(1),
    marginBottom: hp(2),
    padding: hp(1),
    width: wp(90),
    height: hp(15),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    // flexDirection: 'row',
  },
  name: {
    fontSize: hp(2),
    fontWeight: 'bold'
  },
  premiumText: {
    fontSize: hp(1.6),
    marginLeft: wp(0),
  },
  crownimg: {
    width: hp(2),
    height: hp(2),
    marginRight: wp(1)
  },
  value: {
    fontSize: hp(1.8),
    width: wp(100),
    marginTop: hp(0.5),
  },
  noDataText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "red",
    marginTop: hp(10),
  },
  icon: {
    width: hp(10),
    height: hp(10),
    borderRadius:hp(5),
    resizeMode: 'Cover',
    // tintColor: '#800000',

  },
});

export default VendorReferralPage;
