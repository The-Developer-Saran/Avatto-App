import { BackHandler, Dimensions, StyleSheet, Text, View, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useRoute } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { Modal } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native';
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from 'react-native'
import RazorpayCheckout from "react-native-razorpay";
import { encode, decode } from 'base-64';
import { Authentication_Key } from '../../key/Key'
import { encryptPiDataNew } from '../Encryption/encryption'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Lottie from 'lottie-react-native';
import { BaseUrl } from '../BaseUrl/BaseUrl'





const Razorpay = ({ route, navigation }) => {



  const EncKey = encryptPiDataNew(Authentication_Key)

  const [profileData, setProfileData] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [phoneNum, setPhoneNum] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);



  const { amount, userId } = route.params;

  console.log("amount", amount);

  // let commission = 2.3;

  // // Calculate the commission percentage of the amount
  // let amountValue = (commission / amount) * 100;

  // console.log("Commission percentage:", amountValue);
  // let finalAmount = amount + amountValue;
  // console.log("finalAmount", finalAmount);

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
      const value = await AsyncStorage.getItem('user');

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


  // const [usercancelled, setUsercancelled] = useState(false);

  // // CreateOrder ---> handlePayment ---> fetchPaymentsForOrder ---> 

  // //=-=-=-=-=-=-=-=- SandBox =-=-=-=-=-=-=-=-=-=-=-
  // let razorpayKeyId = 'rzp_test_EMSYjxhRjHRESv';
  // let razorpayKeySecret = 'Uu0ssLCygKeXJclbX61TEJph'

  // //=-=-=-=-=-=-=-=- Live =-=-=-=-=-=-=-=-=-=-=-
  // // let razorpayKeyId = 'rzp_live_ZogPGCbLQ1kM2Y';
  // // let razorpayKeySecret = 'VBdhXRKi4TLgud8fpliCuc1e'

  // const route = useRoute();
  // const amount = 20;
  // const currency = "INR";
  // const mobile = 7200327576;
  // const Referral = 'Rajaguru';

  // //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Checking OrderStatus  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // const fetchPaymentsForOrder = async (orderId) => {
  //   try {
  //     const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
  //       // const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Basic ' + encode(razorpayKeyId + ':' + razorpayKeySecret)
  //       }
  //     });

  //     const responseData = await response.json();
  //     console.log(responseData);
  //   } catch (error) {
  //     console.error("Error fetching payments:", error);
  //   }
  // };



  // //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Handling Payment =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // const handlePayment = (orderid) => {

  //   var options = {
  //     description: 'wallet Topup',
  //     // image: 'https://i.imgur.com/3g7nmJC.png',
  //     currency: currency,
  //     key: razorpayKeyId,
  //     amount: parseInt(amount) * 100,
  //     name: 'Spark Dial Online Services Private LTD',
  //     order_id: orderid, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
  //     prefill: {
  //       //email: 'xyz@gmail.com',
  //       contact: mobile,
  //       name: Referral
  //     },
  //     theme: { color: '#fcb713' },
  //     method: {
  //       netbanking: true,
  //       card: true,
  //       wallet: true,
  //       // upi: false, // Exclude UPI
  //     }
  //   }

  //   RazorpayCheckout.open(options).then((data) => {
  //     console.log(data);
  //     console.log(`Success: ${data.razorpay_payment_id}`);
  //     fetchPaymentsForOrder(data.razorpay_order_id)
  //   })
  //     .catch((error) => {
  //       console.log(error)
  //       alert('Payment Cancelled')
  //       // navigation.navigate('Home');
  //     })
  // }

  // //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Creating Order Id  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // const createOrder = async () => {
  //   alert('createOrder')
  //   try {
  //     const response = await fetch('https://api.razorpay.com/v1/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Basic ' + encode(razorpayKeyId + ':' + razorpayKeySecret)
  //       },
  //       body: JSON.stringify({
  //         amount: parseFloat(amount.toFixed(2)) * 100,
  //         currency: "INR",
  //         receipt: `Receipt#${Math.floor(Math.random() * 90000) + 100000}`,
  //         // notes: {
  //         //   key1: "Recharges",
  //         //   key2: "Billss"
  //         // }
  //       })
  //     });
  //     const responseData = await response.json();
  //     console.log(responseData);
  //     handlePayment(responseData.id);
  //   } catch (error) {
  //     ToastAndroid.showWithGravityAndOffset(
  //       'Payment Failed',
  //       ToastAndroid.LONG,
  //       ToastAndroid.BOTTOM,
  //       25,
  //       50
  //     );
  //     console.log("Error creating order:", error);
  //   }
  // };






  // const Width = Dimensions.get('screen').width;
  // const Height = Dimensions.get('screen').height;

  // //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Back Button -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


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







  useEffect(() => {
    TriggerPayment()
  }, [amount])






  const TriggerPayment = () => {

    if (amount === 0) {
      return ToastAndroid.showWithGravityAndOffset(
        'Enter or select a valid amount.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    if (!amount || isNaN(amount)) {
      return ToastAndroid.showWithGravityAndOffset(
        'Enter or select a valid amount.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    console.log("Triggering payment with amount:", amount);
    createOrder(amount);
  };






  const createOrder = async (amount) => {
    try {
      const validAmount = parseFloat(amount);
      if (isNaN(validAmount)) {
        return ToastAndroid.showWithGravityAndOffset(
          'Amount is not a valid number.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + encode(razorpayKeyId + ':' + razorpayKeySecret)
        },
        body: JSON.stringify({
          amount: (validAmount.toFixed(2) * 100),
          currency: "INR",
          receipt: `Receipt#${Math.floor(Math.random() * 90000) + 100000}`,
        })
      });
      const responseData = await response.json();
      // console.log('Create Order Response ')
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj :", responseData);
      console.log("New order id ::::::::>>>>>>>.", responseData.id);
      if (responseData.id) {
        await handleInsertTransaction(responseData.id, validAmount)
      }
    } catch (error) {
      // ToastAndroid.showWithGravityAndOffset(
      //   'Payment Failed',
      //   ToastAndroid.LONG,
      //   ToastAndroid.BOTTOM,
      //   25,
      //   50
      // );
      setFailureModal(true)
      console.log("Error creating order:", error);
    }
  };






  // ========================








  const handleInsertTransaction = async (orderid, validAmount) => {
    // console.log('userId :', userId);
    // console.log('busId :', Bid);
    // console.log('orderid :', orderid);
    // console.log('amount :', validAmount);

    if (!userId || !orderid || !validAmount) {
      setModalVisible(true);
      setModalMessage("please provide all data.");
      return;
    }
    try {
      // const response = await fetch(`${BASEURL_Admin}postTransaction`, {
      const response = await fetch(`${BaseUrl}postTransaction`, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   userId: userId,
        //   busId: Bid,
        //   orderid: orderid,
        //   amount: validAmount
        // }),

        body: JSON.stringify({
          userId: userId,
          orderid: orderid,
          amount: validAmount
        }),
      });

      const responseData = await response.json();

      if (responseData.Response.Success == '1') {
        // console.log("responseData :::>>>>", responseData);
        await handlePayment(orderid, validAmount)
      } else {
        setModalVisible(true);
        setModalMessage(responseData.Response.Message || "please provide all data.");
        return;
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  }












  const handlePayment = (orderid, validAmount) => {
    console.log('orderid new:', orderid);
    console.log('amount new:', validAmount);

    var options = {
      description: 'wallet Topup',
      currency: currency,
      key: razorpayKeyId,
      amount: validAmount * 100,
      name: 'Avatto Deals',
      order_id: orderid,
      prefill: {
        contact: userMobile,
        name: userName
      },
      theme: { color: '#fcb713' },
    }
    console.log('options------->');
    console.log(options);
    RazorpayCheckout.open(options).then((data) => {
      console.log('handlePayment response');
      console.log(data);
      console.log(`Success: ${data.razorpay_payment_id}`);
      fetchPaymentsForOrder(orderid, validAmount)
    })
      .catch((error) => {
        console.log(error);
      })
  };




  const fetchPaymentsForOrder = async (orderId, validAmount) => {
    console.log("enccccccccccc::::::::::", encode(razorpayKeyId + ':' + razorpayKeySecret));

    try {
      const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + encode(razorpayKeyId + ':' + razorpayKeySecret),
          // 'Authorization': 'Basic ' + encode(razorpayKeyId),
        },
      });

      const responseData = await response.json();

      console.log("itemmmmmmmmm::::::::::::::<<<<<<<", responseData.items);

      if (responseData.items.length > 0) {
        const payLoad = responseData.items;

        // const webhookResponse = await fetch(`${BASEURL_Admin}transactionWebHook`, {
        const webhookResponse = await fetch(`${BaseUrl}transactionWebHook`, {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({
          //   userId: userId,
          //   busId: Bid,
          //   orderid: orderId,
          //   amount: validAmount,
          //   payLoad: payLoad
          // }),

          body: JSON.stringify({
            userId: userId,
            orderid: orderId,
            amount: validAmount,
            payLoad: payLoad
          }),
        });

        if (webhookResponse.ok) {
          console.log('Payment details successfully sent to the webhook.');
        } else {
          console.error('Failed to send payment details to the webhook.');
        }

        const capturedPayments = responseData.items.filter((item) => item.status === "captured");
        if (capturedPayments.length === 0) {
          // ToastAndroid.showWithGravityAndOffset(
          //   'Payment Failed',
          //   ToastAndroid.LONG,
          //   ToastAndroid.BOTTOM,
          //   25,
          //   50
          // );
          setFailureModal(true)
        } else {
          // alert('success.')
          // ToastAndroid.showWithGravityAndOffset(
          //   'Payment Added Successfully',
          //   ToastAndroid.LONG,
          //   ToastAndroid.BOTTOM,
          //   25,
          //   50
          // );
          setSuccessModal(true)
          // navigation.navigate('Footer')
        }
      } else {
        // ToastAndroid.showWithGravityAndOffset(
        //   'Payment Failed',
        //   ToastAndroid.LONG,
        //   ToastAndroid.BOTTOM,
        //   25,
        //   50
        // );
        setFailureModal(true)
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };




  // ==================================================================













  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', borderRadius: hp(2), justifyContent: 'center', alignItems: 'center', }}>
        <ActivityIndicator color='#fcb713' size={'large'} />
        <TouchableOpacity onPress={createOrder}>
          <Text style={{ color: '#000', fontSize: hp(3), marginTop: hp(3) }}>Processing ...</Text>
        </TouchableOpacity>
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
            <Lottie resizeMode='contain' source={require('../../assets/json/topup.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
            <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000', marginTop: hp(3) }}>Payment Failed</Text>
            <TouchableOpacity onPress={() => { setFailureModal(false), navigation.replace('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
              <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Razorpay

const styles = StyleSheet.create({

  modalBackground: {
    height: hp(100),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: wp(85),
    paddingTop: hp(1.5),
    fontFamily: "DMSans-Medium"
  },
  payButton: {
    backgroundColor: '#fcb713',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 2
  },
  playButtonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: hp(2),
    fontFamily: "DMSans-Medium"
  },
  modalText: {
    fontSize: hp(2),
    marginBottom: 20,
    color: '#000',
    fontFamily: "DMSans-Medium"
  },
})