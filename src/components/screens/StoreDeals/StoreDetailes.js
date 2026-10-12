import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ScrollView, Modal, TouchableWithoutFeedback, Linking, TextInput, ActivityIndicator, StatusBar, ToastAndroid, PermissionsAndroid, Platform, } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { SafeAreaView } from 'react-native-safe-area-context';
import { encryptPiDataNew } from '../Encryption/encryption';
import { Authentication_Key } from '../../key/Key';
import Icon from '@react-native-vector-icons/ant-design';
import FontAwesome5 from "@react-native-vector-icons/fontawesome5";
import { BaseUrl } from '../BaseUrl/BaseUrl';
import Lottie from 'lottie-react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function StoreDetailes({ route }) {
  const navigation = useNavigation();
  const { Result } = route.params;
  const viewShotRef = useRef();
  const EncKey = encryptPiDataNew(Authentication_Key);






  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [payConfirmVisible, setPayConfirmVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [AlertModalVisible, setAlertModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [APiResponse, setAPiResponse] = useState(false);
  const [orderID, setOrderID] = useState('');
  const [responseModalMessage, setResponseModalMessage] = useState('');
  const [ordersuccessmodal, setOrderSuccessmodal] = useState(false);
    const [successdata, setSuccessdata] = useState(false);


  console.log("City", Result.city);
  console.log("Id", Result.id);
  console.log("pincode", Result.pincode);
  console.log("userid", Result.user_id);
  console.log("amount", amount);






//==============================================Location Fetch==========================================
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);



    const [profileData, setProfileData] = useState("");

    const [Uid, setUid] = useState(null);
      const isFocused = useIsFocused();
    console.log("Uid", Uid);
    console.log("profileData", profileData);

  
  
    useEffect(() => {
      if (isFocused) {
        User_Details_Get();
      }
    }, [isFocused]);
  
    const User_Details_Get = async () => {
      try {
        const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
  
        if (value !== null) {
          setUid(value);
          try {
            const response = await fetch(
              `${BaseUrl}userGet?req_type=1&res_type=1&id=${value}&type=M`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: EncKey,
                },
              }
            );
  
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.status}`);
            }
  
            const data = await response.json();
            console.log("data :::>>>", data.Response);
  
            if (data.Response.Success === '1') {
              setProfileData(data.Response.Result);
            } else {
              console.log(data?.Response?.Message || 'Unknown error');
              setProfileData(null);
         
  
            }
          } catch (error) {
            console.error('Fetch error:', error.message);
          }
        } else {
          console.log('No user data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error reading AsyncStorage:', error.message);
      }
    };





useEffect(()=>{
  getLocation();
},[])

  // Request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission denied');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setLatitude(position.coords?.latitude)
        setLongitude(position.coords?.longitude)
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  console.log("latitude",latitude);
  console.log("longitude",longitude);
  

  // ====================================================>>>> 


  const handleBack = () => {
    navigation.goBack();
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const renderCategoryItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.extraImageBox}
      onPress={() => openImageModal(index)}
    >
      <Image source={{ uri: item.url }} style={styles.businessExtraImage} />
    </TouchableOpacity>
  );


  const handleCall = () => {
    if (Result?.mobile) {
      const phoneNumber = `tel:${Result.mobile}`;
      Linking.openURL(phoneNumber).catch((err) =>
        console.error('Failed to make a call:', err)
      );
    } else {
      console.log('No mobile number available');
    }
  };



  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        title: 'Check out this store',
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };


  const handleOpenPaymentModal = () => {
    setPaymentModalVisible(true)
  }


  const handleAmountChange = (text) => {
    setAmount(text);
  };




  const StoreDeal_FinalPayment = async () => {

    if (isLoading) return; // prevent duplicate payment calls from repeated taps
    setIsLoading(true);

    const purchase_add_data = new FormData();


    purchase_add_data.append("uId",Uid);
    purchase_add_data.append("type", "SD");
    purchase_add_data.append("storeId", Result.id);
    purchase_add_data.append("billAmt", amount);
    purchase_add_data.append("pincode", Result.pincode);
    purchase_add_data.append("districtId", Result.city);


    console.log(purchase_add_data);
    try {
      const response = await fetch(`${BaseUrl}purchase_add`, {
        method: 'POST',
        headers: {
          authentication: EncKey, // No need for Content-Type for FormData
        },
        body: purchase_add_data,
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData?.Response?.Success === "1") {
        // ToastAndroid.showWithGravity(
        //   responseData?.Response?.Message || "Success",
        //   ToastAndroid.LONG,
        //   ToastAndroid.BOTTOM
        // );
         setSuccessdata(responseData?.Response?.Message);
         setOrderSuccessmodal(true);
         setPaymentModalVisible(false)

      } else {
        ToastAndroid.showWithGravity(
          responseData?.Response?.Message || "An error occurred",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
        console.log(responseData?.Response?.Message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      ToastAndroid.showWithGravity(
        "No Server Response",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    } finally {
      setIsLoading(false);
    }
  }


  const handlePayment = async () => {

    if (amount.length < 2) {
      setAlertModalVisible(true);
      setModalMessage("Please enter valid amount.");
      return;
    }


    setIsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
        method: 'GET',
        headers: {
          authentication: EncKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const FinalData = data.Response;
      if (FinalData.Success == '1') {
        setAPiResponse(true)
        setOrderID('899876567')
        setResponseModalMessage('Payment Success.')
      } else {
        setAPiResponse(true)
        setOrderID('899876567')
        setResponseModalMessage('Payment Failed.')
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDone = () => {
    setPaymentModalVisible(false)
    setAPiResponse(false)
    setOrderID('')
    setAmount(0)
    setResponseModalMessage('')
  }


  const handleOpenMap = () => {
    // const latitude = Result.latitude;
    // const longitude = Result.longitude;


    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open map", err);
    });
  };


  return (

    <>
      <StatusBar  backgroundColor='#0000' />
      <ViewShot style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("StoreDealsHome")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
            <Icon onPress={() => navigation.navigate("StoreDealsHome")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
            <Text onPress={() => navigation.navigate("StoreDealsHome")} style={styles.headerText}>STORE DEALS</Text>
          </TouchableOpacity>
        </View>



        <ScrollView style={styles.scrollContainer}>
          <View style={styles.businessListContainer}>
            <View style={styles.BusinessContainer}>
              <Image source={{ uri: Result.logo }} style={styles.businessImage} />

              <View style={styles.midSection}>
                <Text style={styles.businessTitle}>{Result.business_name}</Text>

                <View style={styles.locationContainer}>
                  <Text style={styles.businessAddress}>{Result.address}</Text>
                  <Text style={styles.businessCity}>{Result.city_name}</Text>
                </View>

                <View style={styles.distenceContainer}>
                  <Ionicons style={styles.locationIcon} name="location" color="#000" />
                  <Text style={styles.businessDistance}>{Result.distance.toFixed(2)} km</Text>
                </View>
              </View>
            </View>


            <View style={styles.midButtonContainer}>
              <TouchableOpacity style={styles.midButtons}
                onPress={handleCall}>
                <View style={styles.midIconContainer}>
                  <Feather style={styles.midButtonsIcons} name="phone-call" />
                </View>

                <View style={styles.midTitleContainer}>
                  <Text style={styles.midButtonsTitles}>Call Now</Text>
                </View>
              </TouchableOpacity>


              <TouchableOpacity style={styles.midButtons}
                onPress={handleShare}>
                <View style={styles.midIconContainer}>
                  <FontAwesome style={styles.midButtonsIcons} name="share-alt" />
                </View>

                <View style={styles.midTitleContainer}>
                  <Text style={styles.midButtonsTitles}>Share</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.midLine}></View>



          <View style={styles.ExtraImage}>
            <FlatList
              data={Result.additional_images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategoryItem}
              contentContainerStyle={styles.flatListContent}
            />
          </View>



          <View style={styles.detailsBlock}>
            <View style={styles.detailsTitleContainer}>
              <Text style={styles.detailsTitleText}>About</Text>
            </View>

            <Text style={styles.detailsContentText}>{Result?.about_us}</Text>
          </View>


          <View style={styles.detailsBlock}>
            <View style={styles.detailsTitleContainer}>
              <Text style={styles.detailsTitleText}>Location</Text>
            </View>

            <View style={styles.addressContainer}>
              <Text style={styles.detailsContentTextAddress}>{Result.address}</Text>
              <TouchableOpacity onPress={handleOpenMap}>
                <Ionicons style={styles.locationIconBtm} name="location" color="#000" />
              </TouchableOpacity>
            </View>

          </View>




          <TouchableOpacity style={styles.payButton}
            onPress={handleOpenPaymentModal}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>

          <View style={styles.footer}></View>
        </ScrollView>
      </ViewShot>










      {/* ======================= Image modal ========================= */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" style={styles.closeIcon} />
          </TouchableOpacity>
          <Swiper
            loop={false}
            index={selectedImageIndex}
            showsButtons
            buttonWrapperStyle={styles.swiperButtonWrapper}
          >
            {Result.additional_images.map((image, index) => (
              <View key={index} style={styles.imageSlide}>
                <Image
                  source={{ uri: image.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </Swiper>
        </View>
      </Modal>


      {/* ======================= payment modal ========================= */}



      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => {
          setPaymentModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setPaymentModalVisible(false)}>
          <View style={styles.paymentModalBackground}>
            <View style={styles.paymentModalContentOuter}>
              {isLoading ? (
                <View style={styles.paymentModalContent}>
                  <View style={styles.ModalTopLine}></View>
                  <ActivityIndicator size="large" color="#990099" style={styles.loader} />
                </View>
              ) : (
                <View style={styles.paymentModalContent}>

                  <View style={styles.ModalTopLine}></View>

                  <TouchableOpacity
                    style={styles.paymentCloseButton}
                    // onPress={() => setPaymentModalVisible(false)}
                    onPress={handleDone}
                  >
                    <Ionicons name="close" style={styles.paymentCloseIcon} />
                  </TouchableOpacity>



                  <Text style={styles.patToText}>Pay to</Text>
                  <Text style={styles.payBusinessTitle}>{Result.business_name}</Text>

                  <View style={styles.amountContainer}>
                    <Text style={styles.rupeeSymbol}>₹</Text>
                    <TextInput
                      value={String(amount)}
                      style={styles.amountInput}
                      keyboardType="number-pad"
                      placeholderTextColor="#888"
                      maxLength={6}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        handleAmountChange(numericText);
                      }}
                    />
                  </View>

                  {APiResponse ?
                    <>
                      <Text style={styles.orderID}>Order ID : {orderID}</Text>
                      <Text
                        style={[
                          styles.orderStatus,
                          { color: responseModalMessage === "Payment Success." ? "#A6222C" : "red" }
                        ]}
                      >
                        {responseModalMessage}
                      </Text>

                    </>
                    :
                    <View></View>
                  }

                  <View style={{ flex: 1 }} />

                  {APiResponse ?
                    <TouchableOpacity
                      onPress={handleDone}
                    >
                      <Text style={styles.modalPayButton}>Done</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      onPress={() => setPayConfirmVisible(true)}
                    >
                      <Text style={styles.modalPayButton}>Pay</Text>
                    </TouchableOpacity>
                  }

                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>



      {/* ======================= payment confirmation modal ========================= */}
      <Modal
        animationType="fade"
        transparent
        visible={payConfirmVisible}
        onRequestClose={() => setPayConfirmVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Confirm Payment</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to pay ₹{amount} to {Result.business_name}?
            </Text>

            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setPayConfirmVisible(false)}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmPayButton}
                disabled={isLoading}
                onPress={() => {
                  setPayConfirmVisible(false);
                  StoreDeal_FinalPayment();
                }}
              >
                <Text style={styles.confirmPayText}>Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* ================================= alert moda; */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={AlertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setAlertModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContentOuter}>
              <View
                colors={['#DC2424', '#4A569D', '#4A569D', '#DC2424']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <View style={styles.modalContent}>

                  <Text style={styles.alertText}>Alert</Text>
                  <Text style={styles.alertText}>{modalMessage}</Text>

                  <TouchableOpacity
                    style={{
                      marginRight: hp(3),
                    }}
                    onPress={() => setAlertModalVisible(false)}
                  >
                    <Text style={{
                      color: '#fff',
                      backgroundColor: '#990099',
                      paddingHorizontal: hp(2),
                      paddingVertical: hp(0.5),
                      fontSize: hp(2.2),
                      borderRadius: hp(1),
                      fontWeight: '600',
                      marginTop: hp(3),
                      marginBottom: hp(2),
                    }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal
        animationType="slide"
        transparent
        visible={ordersuccessmodal}
        onRequestClose={() => {
          setOrderSuccessmodal(!ordersuccessmodal);
        }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
            <Lottie resizeMode='cover' source={require('../../assets/json/ordersuccess.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop />
            {/* <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text> */}
            <Text style={{ fontSize: hp(2.5), color: '#000', marginTop: hp(1), textAlign: 'center', fontWeight: 'bold' }}>{successdata}</Text>
            <TouchableOpacity onPress={() => { setOrderSuccessmodal(false); navigation.navigate('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
              <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </>
  )
}
const styles = StyleSheet.create({
  // mainContainer: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  // header: {
  //   width: wp(100),
  //   alignItems: 'flex-end',
  //   padding: hp(1),
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // backContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // backIcon: {
  //   fontSize: hp(3),
  //   color: '#A6222C',
  //   fontWeight: '900'
  // },
  // headTitle: {
  //   fontSize: hp(2),
  //   fontWeight: '800',
  //   color: '#000',
  //   marginLeft: hp(1)
  // },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#A6222C',
    // backgroundColor: '#ff6000',
    height: hp(11),
    padding: hp(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    color: "#fff",
    fontSize: hp(2),
    fontWeight: "bold",
    marginTop: hp(3),
    marginLeft: wp(5),
    fontFamily: "DMSans-Medium",
  },
  scrollContainer: {
    paddingHorizontal: hp(2)
  },
  businessListContainer: {
    alignItems: 'center'
  },
  BusinessContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(1),
    borderRadius: hp(1.5),
    marginVertical: hp(1),
  },
  businessImage: {
    height: hp(13),
    width: hp(13),
    borderRadius: hp(1),
    resizeMode: "stretch",
  },
  midSection: {
    marginLeft: hp(1.5),
    width: wp(58),
  },
  businessTitle: {
    fontSize: hp(2.3),
    fontWeight: 'bold',
    color: '#3d3d3d',
    marginVertical: hp(0.2),
    width: wp(50),
    flexWrap: 'wrap',
  },
  businessDistance: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    marginVertical: hp(0.5),
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
    width: wp(50),
    flexWrap: 'wrap'
  },
  businessAddress: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    textTransform: 'capitalize',
    fontWeight: '400',
    marginRight: hp(1),
  },
  businessCity: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  businessState: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    marginLeft: hp(1),
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  rightIcon: {
    fontSize: hp(2.5),
    color: '#fff',
    backgroundColor: '#A6222C',
    marginRight: hp(-1),
    padding: hp(1),
    borderTopLeftRadius: hp(1.5),
    borderBottomLeftRadius: hp(1.5),
  },
  distenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: hp(2.2),
    color: '#A6222C',
    marginRight: hp(1)
  },
  midButtonContainer: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  midButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0c7c9',
    borderRadius: hp(1.2),
    marginHorizontal: hp(1),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  midIconContainer: {
    width: hp(5),
    height: hp(5),
    backgroundColor: '#A6222C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(1.2)
  },
  midButtonsIcons: {
    fontSize: hp(3),
    color: '#fff',
    borderRadius: hp(1.2),
  },
  midTitleContainer: {
    width: wp(25),
    alignItems: 'center'
  },
  midButtonsTitles: {
    fontSize: hp(2),
    color: '#000',
    fontWeight: '400'
  },
  midLine: {
    height: hp(0.1),
    backgroundColor: '#e3e3e3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: hp(2),
    width: '100%',
    alignSelf: 'center',
  },
  ExtraImage: {
    alignSelf: 'center',
    width: '100%',
    marginVertical: hp(2),
  },
  extraImageBox: {
    backgroundColor: '#e3e3e3',
    marginHorizontal: hp(1),
    padding: hp(0.2),
    borderRadius: hp(1.3),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  businessExtraImage: {
    height: hp(13),
    width: hp(13),
    borderRadius: hp(1),
    resizeMode: "stretch",
  },
  detailsBlock: {
    minHeight: hp(12),
  },
  detailsTitleContainer: {
    width: wp(25),
    backgroundColor: '#e0c7c9',
    alignItems: 'center',
    borderRadius: hp(3),
    paddingVertical: hp(0.5),
    marginTop:hp(1)
  },
  detailsTitleText: {
    fontSize: hp(2.3),
    color: '#000',
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'gray',
    justifyContent: 'space-between',
  },
  locationIconBtm: {
    fontSize: hp(3),
    color: '#fff',
    // marginBottom: hp(-1),
    backgroundColor: '#A6222C',
    padding: hp(1),
    borderRadius: hp(1)
  },
  detailsContentText: {
    fontSize: hp(1.9),
    color: '#000',
    fontWeight: '400',
    marginTop: hp(1.5),
    textAlign: 'justify',
  },
  detailsContentTextAddress: {
    fontSize: hp(1.9),
    color: '#000',
    fontWeight: '400',
    marginTop: hp(1.5),
    textAlign: 'justify',
    width: wp(78),
  },
  payButton: {
    backgroundColor: '#A6222C',
    alignItems: 'center',
    paddingVertical: hp(1),
    width: wp(80),
    alignSelf: 'center',
    borderRadius: hp(1.5),
    marginTop: hp(3),
  },
  payButtonText: {
    fontSize: hp(2.8),
    color: '#fff',
    fontWeight: '800',
  },
  footer: {
    height: hp(15)
  },
  ExtraImage: {
    marginVertical: 20,
  },
  extraImageBox: {
    marginRight: 10,
  },
  businessExtraImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  imageSlide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  swiperButtonWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeIcon: {
    fontSize: hp(3.5),
    color: 'red',
    backgroundColor: '#fff',
    borderRadius: hp(1),
    fontWeight: '900',
    padding: hp(0.2),
  },
  paymentModalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: wp(100),
  },
  paymentModalContentOuter: {
    borderRadius: hp(1.8),
    elevation: 2,
    maxHeight: hp(60),
  },
  paymentModalContent: {
    backgroundColor: 'rgb(244, 242, 245)',
    padding: 10,
    borderTopLeftRadius: hp(2),
    borderTopRightRadius: hp(2),
    alignItems: 'center',
    width: wp(98),
    height: hp(50),
    paddingTop: hp(1),
    color: '#000',
  },
  modalPayButton: {
    backgroundColor: '#A6222C',
    alignItems: 'center',
    paddingVertical: hp(1),
    width: wp(80),
    alignSelf: 'center',
    borderRadius: hp(1.5),
    fontSize: hp(2.8),
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  ModalTopLine: {
    backgroundColor: '#A6222C',
    height: hp(0.7),
    width: wp(20),
    marginTop: hp(1),
    borderRadius: hp(1),
  },
  paymentCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  paymentCloseIcon: {
    fontSize: hp(3),
    color: '#fff',
    backgroundColor: 'red',
    borderRadius: hp(1),
    fontWeight: '900',
    padding: hp(0.2),
  },
  patToText: {
    fontSize: hp(2.4),
    color: '#000',
    marginTop: hp(3)
  },
  payBusinessTitle: {
    fontSize: hp(3),
    color: '#000',
    marginTop: hp(1.5),
    fontWeight: '800',
  },
  amountContainer: {
    width: wp(30),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  rupeeSymbol: {
    color: '#A6222C',
    fontSize: hp(5),
    marginRight: hp(1),
    fontWeight: '600',
  },
  amountInput: {
    fontSize: hp(3),
    fontWeight: '800',
    backgroundColor: '#ebebeb',
    minWidth: wp(35),
    textAlign: 'center',
    color: '#000',
    padding: hp(1),
    height:hp(6),
    borderRadius: hp(1),
  },
  orderID: {
    fontSize: hp(2.2),
    marginTop: hp(3),
    textAlign: 'center',
    color: '#000',
  },
  orderStatus: {
    fontSize: hp(3.2),
    fontWeight: '800',
    marginTop: hp(3),
    textAlign: 'center',
  },
  loader: {
    fontSize: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(20)
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentOuter: {
    backgroundColor: 'rgb(212, 212, 212)',
    borderRadius: hp(1.8),
    elevation: 2,
    maxHeight: hp(60),
  },
  modalContent: {
    backgroundColor: 'rgb(244, 242, 245)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: wp(95),
    paddingTop: hp(1),
    color: '#000',
  },
  alertText: {
    color: '#000',
    fontSize: hp(2),
    fontWeight: '500',
    marginTop: hp(2)
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmCard: {
    width: wp(80),
    backgroundColor: '#fff',
    borderRadius: hp(2),
    padding: hp(3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdbcbc',
  },
  confirmTitle: {
    fontSize: hp(2.6),
    fontWeight: '800',
    color: '#A6222C',
    marginBottom: hp(1.5),
  },
  confirmMessage: {
    fontSize: hp(2),
    color: '#000',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  confirmButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmCancelButton: {
    width: '45%',
    paddingVertical: hp(1.3),
    borderRadius: hp(1),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A6222C',
  },
  confirmCancelText: {
    color: '#A6222C',
    fontSize: hp(2.2),
    fontWeight: '600',
  },
  confirmPayButton: {
    width: '45%',
    paddingVertical: hp(1.3),
    borderRadius: hp(1),
    alignItems: 'center',
    backgroundColor: '#A6222C',
  },
  confirmPayText: {
    color: '#fff',
    fontSize: hp(2.2),
    fontWeight: '700',
  },
})



