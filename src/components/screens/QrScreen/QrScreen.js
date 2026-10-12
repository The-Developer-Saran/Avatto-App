import { Alert, Image, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from "react-native-razorpay";
import { encode, decode } from 'base-64';
import { ActivityIndicator } from 'react-native-paper';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Modal } from 'react-native';
import Lottie from 'lottie-react-native';

const QrScreen = ({ navigation }) => {

  const EncKey = encryptPiDataNew(Authentication_Key)

  const [value, setValue] = useState("");
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [phoneNum, setPhoneNum] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setUserId(user);
        } else {
          console.log('No user ID found in AsyncStorage');
        }
      } catch (error) {
        console.log('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setValue(numericValue);
  };

  // const handleTopUp = () => {
  //   if (!value || !userId) {
  //     Alert.alert("Error", "Please enter an amount and ensure the user ID exists");
  //   } else {
  //     const amount = value;
  //     navigation.navigate('Razorpay', { amount, userId });
  //   }
  // };



  //==================================================sandbox======================================================
  // const razorpayKeyId = 'rzp_test_7REOPPxZkkNRrL';
  // let razorpayKeySecret = '4uH4n5kMzLrfJ2CrP15rXBOh';

  //==================================================production======================================================
  const razorpayKeyId = 'rzp_live_CabZry2NwQQ2oG';
  let razorpayKeySecret = 'SgRMqGYs9HdxruEIpEWqBiVB';

  const currency = 'INR';

  const userMobile = phoneNum;
  const userName = profileName;






  console.log("profileData", profileData);
  console.log("profileName", profileName);
  console.log("profileId", profileId);
  console.log("phoneNum", phoneNum);




  useEffect(() => {
    User_Details_Get();

  }, []);

  const User_Details_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        // alert(value)
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

          if (data.Response.Success === '1') {
            setProfileData(data.Response.Result);
            setProfileName(data.Response.Result[0]?.name || ''); // Use optional chaining and fallback
            setProfileId(data.Response.Result[0]?.id || '');
            setPhoneNum(data.Response.Result[0]?.mobile || '');
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





  const handlePay = async () => {
    const amount = parseFloat(value);

    if (!amount || isNaN(amount) || amount <= 0) {
      ToastAndroid.show('Invalid amount provided.', ToastAndroid.SHORT);
      return;
    }

    // if (amount < 100) {
    //   ToastAndroid.show('Minimum top-up amount is ₹100.', ToastAndroid.SHORT);
    //   return;
    // }

    if (!userId || !userMobile || !userName) {
      ToastAndroid.show('Missing user details.', ToastAndroid.SHORT);
      return;
    }

    setIsPaymentProcessing(true);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + encode(razorpayKeyId + ':' + razorpayKeySecret),
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: "INR",
          receipt: `Receipt#${Math.floor(Math.random() * 90000) + 100000}`,
          notes: {
            user_Id: userId,
          }
        })
      });

      const orderData = await orderResponse.json();
      console.log("Order Data:", orderData);

      if (!orderResponse.ok || !orderData.id) {
        throw new Error('Failed to create Razorpay order.');
      }

      //     // Step 2: Send orderData to your backend
      //     try {
      //       const backendResponse = await fetch('https://sparkredeem.com/chettiyarconnect/rayzorpay_initiate', {
      //         method: 'POST',
      //         // headers: {
      //         //   'Content-Type': 'application/json',
      //         // },
      //         body:{ initialData: orderData }
      //       });
      // console.log("backendResponse================>",backendResponse);

      //       const backendResult = await backendResponse.json();
      //       console.log("Backend initiation response:", backendResult);

      //       if (!backendResponse.ok) {
      //         throw new Error(backendResult.message || 'Failed to initiate Razorpay request on backend');
      //       }
      //     } catch (error) {
      //       console.error("Backend call failed:", error.message);
      //     }


      try {
        const backendResponse = await fetch(`${BaseUrl}rayzorpay_initiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initialData: JSON.stringify(orderData) }), // FIXED
        });

        const backendResult = await backendResponse.json();
        console.log("Backend initiation response:", backendResult);

        if (!backendResponse.ok || backendResult.Response?.Success !== "1") {
          throw new Error(backendResult.Response?.Message || 'Failed to initiate Razorpay request on backend');
        }
      } catch (error) {
        console.error("Backend call failed:", error.message);
      }

      // Step 3: Open Razorpay checkout
      const options = {
        description: 'Wallet Topup',
        currency: 'INR',
        key: razorpayKeyId,
        amount: Math.round(amount * 100),
        name: 'Avatto Deals',
        order_id: orderData.id,
        prefill: {
          contact: userMobile,
          name: userName
        },
        theme: { color: '#A6222C' },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentResult) => {
          console.log("Payment Success:", paymentResult);

          // Step 4: Verify payment status
          const verifyResponse = await fetch(`https://api.razorpay.com/v1/orders/${orderData.id}/payments`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + encode(razorpayKeyId + ':' + razorpayKeySecret),
            },
          });

          const paymentData = await verifyResponse.json();
          const capturedPayments = paymentData.items.filter(item => item.status === "captured");

          if (capturedPayments.length === 0) {
            ToastAndroid.show('Payment not captured yet.', ToastAndroid.LONG);
            setIsPaymentProcessing(false);
            setFailureModal(true);
            return;
          }

          const paymentRefId = capturedPayments[0].id;

          console.log("Payment captured. Ref ID:", paymentRefId);
          setIsPaymentProcessing(false);
          setSuccessModal(true); // Success modal
        })
        .catch((err) => {
          console.log("Payment Failed or Cancelled:", err);
          ToastAndroid.show('Payment Cancelled or Failed', ToastAndroid.LONG);
          setIsPaymentProcessing(false);
          setFailureModal(true);
        });

    } catch (error) {
      console.error("Payment error:", error.message);
      ToastAndroid.show('Something went wrong.', ToastAndroid.LONG);
      setIsPaymentProcessing(false);
    }
  };




  return (
    <>
      <StatusBar backgroundColor='#A6222C' />
      <View style={styles.container}>



        {isPaymentProcessing && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="small" color="#A6222C" />
            <Text style={styles.loaderText}>Please wait. Payment in progress...</Text>
          </View>
        )}

        <Text style={styles.title}>TopUp your Wallet</Text>
        <View style={{ width: wp(100), height: hp(30), marginTop: hp(5), justifyContent: "center", alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/Topup/topup.png')
            }
            style={styles.badge}
            resizeMode="cover"
          />
        </View>


        <View style={styles.card}>
          {/* <Image
            source={require('../../assets/images/Topup/razorpay.png')}
            style={styles.paymentLogo}
            resizeMode="contain"
          /> */}

          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={value}
              onChangeText={handleChange}
              maxLength={6}
            />
          </View>

          <TouchableOpacity onPress={handlePay} style={styles.topUpButton}>
            <Text style={styles.topUpButtonText}>TopUp</Text>
          </TouchableOpacity>

          <Text style={{color:'#A6222C', fontSize:hp(1.8), marginTop:hp(3)}}>Payment Gateway Partner</Text>

          <Image
            source={require('../../assets/images/Topup/razorpay1.png')}
            style={styles.paymentLogo}
            resizeMode="contain"
          />

        </View>

        {/* =====================================================Success modal=============================================== */}
        <Modal
          animationType="slide"
          transparent
          visible={successModal}
          onRequestClose={() => {
            setSuccessModal(!successModal);
          }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
              {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
              <Lottie resizeMode='contain' source={require('../../assets/json/topup.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
              <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000', marginTop: hp(3) }}>Payment Added Succesfully</Text>
              <TouchableOpacity onPress={() => { setSuccessModal(false), navigation.replace('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent
          visible={failureModal}
          onRequestClose={() => {
            setFailureModal(!failureModal);
          }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
              {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
              <Lottie resizeMode='contain' source={require('../../assets/json/topupfailure.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
              <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000', marginTop: hp(3) }}>Payment Failed</Text>
              <TouchableOpacity onPress={() => { setFailureModal(false), navigation.replace('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default QrScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#A6222C',
    // backgroundColor: '#ff6000',
    height: hp(8),
    padding: hp(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    color: "#fff",
    fontSize: hp(2),
    fontWeight: "bold",
    marginTop: hp(2),
    marginLeft: wp(5),
    fontFamily: "DMSans-Medium",
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    marginTop: hp(5),
    color: '#A6222C',
    alignSelf: 'center'
  },

  card: {
    width: wp(90),
    backgroundColor: '#fff',
    borderRadius: hp(2),
    padding: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 0,
    alignItems: 'center',
    alignSelf: 'center'
  },
  paymentLogo: {
    width: wp(50),
    height: hp(8),
    marginTop: hp(3),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: hp(2),
    padding: 10,
    width: wp(85),
    marginBottom: hp(2),
    textAlign: 'center'
  },
  currencySymbol: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginRight: wp(2),
    color: '#A6222C'
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    color: '#000',
  },
  topUpButton: {
    backgroundColor: '#A6222C',
    borderRadius: hp(3),
    paddingVertical: hp(1.5),
    width: wp(85),
    alignItems: 'center',
    marginTop:hp(3)
  },
  topUpButtonText: {
    color: '#fff',
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  badge: {
    width: hp(15),
    height: hp(28),
    marginRight: wp(5)
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  loaderText: {
    color: '#000',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
