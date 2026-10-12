import React, { useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image, FlatList, Linking, Alert, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from '@react-native-vector-icons/entypo';
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';

 

const Eshopping = ({ navigation }) => {
  //   const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [fetching, setFetching] = useState(false);

  const EncKey = encryptPiDataNew(Authentication_Key)
  // const GoBack = () => {
  //   navigation.goBack();
  // };



  //   useEffect(() => {    
  //     handleAllBrands();
  //   }, []);

  useEffect(() => {
    console.log("Component mounted or focused");
    handleAllBrands();
  }, []);



  const handleAllBrands = async () => {
    console.log("===============================================================================================================================================================");
    setLoading(true);

    try {
      const response = await fetch(`${BaseUrl}getAffiliate?screen_type=M`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "authentication": EncKey
        },
      });

      console.log("Response Status:", response.status);  // Check status code
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("BRAND LIST:", responseData.Response.Result);

      if (responseData?.Response?.Success == '1') {
        setResult(responseData.Response.Result);
      } else {
        console.error("Nearby Brands list Error:", responseData?.Response?.Message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };











  const handleExplore = (link) => {
    console.log("Selected link:", link);

    if (link && typeof link === "string") {
      Linking.canOpenURL(link)
        .then((supported) => {
          if (supported) {
            Linking.openURL(link);
          } else {
            Alert.alert("Invalid URL", "The provided link cannot be opened.");
          }
        })
        .catch((error) => {
          console.error("Error checking link support:", error);
          Alert.alert("Error", "An error occurred while trying to open the link.");
        });
    } else {
      Alert.alert("Invalid Link", "No valid link was provided.");
    }
  };




  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa', }}>
    //   <View style={styles.topBar}>
    //     <TouchableOpacity style={styles.topIconDiv} onPress={GoBack}>
    //       <AntDesign name="left" style={styles.topIcon} />
    //       <Text style={styles.topTitle}>E Shopping</Text>
    //     </TouchableOpacity>
    //   </View>

    <>
      <StatusBar  backgroundColor='#A6222C' />
      <View style={styles.container}>
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
            <Icon onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
            <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>E-Shopping</Text>
          </TouchableOpacity>

        </View>


        {loading ? (
          <View style={styles.loaderDiv}>
            {/* <ActivityIndicator size="large" /> */}
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
          <ScrollView>
            <FlatList
              data={result}
              // onEndReached={() => BrandonEndReached(result.length)}
              // ListFooterComponent={fetching ?
              //   <View style={styles.loaderDiv}>
              //     <LottieView
              // source={require('../../assets/json/commingSoon.json')}
              // style={{
              //         alignSelf: "center",
              //         width: hp(10),
              //         height: hp(10),
              //         backgroundColor: 'rgba(0,0,0,0)',
              //         marginBottom: hp(30),
              //         marginTop: hp(3),
              //       }} autoPlay loop
              //     />
              //   </View>
              //   :
              //   null}
              renderItem={({ item, index }) => {
                return (
                  <View key={index}>
                    <TouchableOpacity style={styles.card} onPress={() => handleExplore(item.link)}>
                      <View style={styles.cardLeft}>
                        <View style={styles.imageContainer}>
                          <Entypo name="shop" style={styles.shopIcon} />
                          <Image
                            key={index}
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                          />
                        </View>
                        <Text style={styles.brandContent}>{item.title}</Text>
                      </View>

                      {/* <View style={styles.cardRight}>
                      <Text style={styles.brandContent}>{item.v_business_crc} %</Text>
                    </View> */}

                      <TouchableOpacity style={styles.buyButtonBox}
                        onPress={() => handleExplore(item.link)}>
                        <Text style={styles.buyButton}>Buy</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{height:50}}></View>}
              ListEmptyComponent={
                <View style={styles.noUpcomingYet}>
                  <Text style={styles.noUpcomingYetTxt}>No data found</Text>
                </View>
              }
            />
          </ScrollView>
        )}
      </View>
    </>
  )
}

export default Eshopping

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
    elevation:5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: hp(1),
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
    backgroundColor: '#fff',
  },
  brandContent: {
    fontSize: hp(2.5),
    color: '#000',
    marginLeft: hp(2),
    fontWeight: '700',
    marginLeft: hp(3),
    width: wp(38),
  },
  buyButtonBox: {
    borderRadius: hp(2),
    backgroundColor: '#A6222C',
    paddingHorizontal: hp(3),
    paddingVertical: hp(0.3),
  },
  buyButton: {
    fontSize: hp(2),
    color: '#fff',
    fontWeight: '700',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardRight: {
    marginRight: hp(2)
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
})