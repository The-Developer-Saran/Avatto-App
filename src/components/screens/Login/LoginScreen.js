import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView,
  Linking,
  BackHandler,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Lottie from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { ActivityIndicator } from 'react-native-paper';
import SwiperFlatList from 'react-native-swiper-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Eye, EyeOff } from 'lucide-react-native';
import DeviceInfo from 'react-native-device-info';
import AntDesign from '@react-native-vector-icons/ant-design';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const LoginScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const viewHeight = height * 0.45;

  const [number, setNumber] = useState('');
  const [mpin, setMpin] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [otpType, setOtpType] = useState('');
  const [ReferralName, setReferralName] = useState(null);
  const isFocused = useIsFocused();
  const [secureText, setSecureText] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [RegistermobileNo, setRegistermobileNo] = useState('');

  const dialCall = () => {
    let num = 4623560085;
    let phoneNumberString = `tel:${num}`;
    Linking.openURL(phoneNumberString);
  };

  const [RememberToken, setRememberToken] = useState('');
  useEffect(() => {
    remTkn();
  }, []);

  const remTkn = () => {
    DeviceInfo.getUniqueId().then(rememberToken => {
      setRememberToken(rememberToken);
      // RemTkncheck(rememberToken);
    });
  };

  console.log('ReferralName', ReferralName);
  console.log('RememberToken', RememberToken);
  console.log('RegistermobileNo', RegistermobileNo);

  useEffect(() => {
    getDeviceData();
  }, [RememberToken]);

  const getDeviceData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(
        `${BaseUrl}userGet_deviceId?deviceId=${RememberToken}`,
        {
          // const response = await fetch(`https://sparkredeem.com/avatto/userGet_deviceId?deviceId=f879f60314d360d5`, {
          method: 'GET',
          headers: { authentication: EncKey },
        },
      );
      const responseData = await response.json();
      if (responseData.Response.Success == 1) {
        setRegistermobileNo(responseData.Response.Result[0].mobile);
      } else {
        setRegistermobileNo(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  console.log('otpId', otpId);
  console.log('otpType', otpType);

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const enterOtp = otp.join('');

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);

    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }

    if (text && index === otp.length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp.every(value => value === '')) {
        clearAllFields();
      } else if (index > 0 && otp[index] === '') {
        inputs.current[index - 1].focus();
      }
    }
  };

  const clearAllFields = () => {
    setOtp(['', '', '', '']);
    inputs.current.forEach(input => {
      if (input) input.clear();
    });
    inputs.current[0]?.focus();
  };

  const EncKey = encryptPiDataNew(Authentication_Key);

  var login_data = new FormData();

  // login_data.append("req_type", 1);
  login_data.append('phone_num', number);
  login_data.append('mpin', mpin);
  login_data.append('token', RememberToken);

  // const Login = async () => {

  //   if (number == null || number.length < 10) {
  //     alert('Enter Valid Mobile Number');
  //   }
  //   else {
  //     const response = await fetch(`${BaseUrl}mpin_login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'authentication': EncKey
  //       },
  //       body: login_data
  //     });
  //     response.json()
  //       .then(responseData => {
  //         if (responseData?.Response.Success == 1) {
  //           if (isFocused) {
  //             // Login_Otp_Screen(responseData?.Response.Result.type)
  //             setOtpId(responseData?.Response.Result.otp_id)
  //             setOtpType(responseData?.Response.Result.type)
  //             // setCountdown(30)
  //             Toast.show({
  //               type: "success",
  //               text1: "Success",
  //               text2: responseData?.Response.Message,
  //             });

  //             let userId = responseData.Response.Result.user_id;
  //             try {
  //               AsyncStorage.setItem('user', userId.toString());
  //             } catch (error) {
  //               console.log('Async error')
  //               console.log(error)
  //             }

  //             if(responseData?.Response.Result.type === "R"){
  //               navigation.navigate('RegisterScreen', { phoneNo: number, otptype: type });
  //             }
  //             else{
  //               navigation.navigate('WelcomeFirst')
  //             }

  //           }

  //           else {
  //             Toast.show({
  //               type: "error",
  //               text1: "Error",
  //               text2: responseData?.Response.Message,
  //             });
  //             console.log(responseData?.Response.Message);
  //           }
  //         }
  //       })

  //       .catch(error => {
  //         console.error('Error parsing JSON:', error);
  //         // alert('No Server Response');
  //       });
  //   }
  // }

  const Login = async () => {
    if (!number || number.length < 10) {
      alert('Enter Valid Mobile Number');
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}mpin_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          authentication: EncKey,
        },
        body: login_data,
      });

      const responseData = await response.json();

      if (responseData?.Response?.Success == '1') {
        if (isFocused) {
          const result = responseData?.Response?.Result;
          if (!result) {
            throw new Error("Invalid response format: Missing 'Result' object");
          }

          setOtpId(result.otp_id);
          setOtpType(result.type);

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: responseData?.Response?.Message,
          });

          // Store user_id if available
          if (result.user_id) {
            try {
              await AsyncStorage.setItem('user', result.user_id.toString());
            } catch (error) {
              console.error('AsyncStorage error:', error);
            }
          }

          // Navigate based on OTP type
          if (result.type === 'R') {
            navigation.navigate('RegisterScreen', {
              phoneNo: number,
              otptype: result.type,
              otpid: result.otp_id,
            });
          } else {
            navigation.navigate('WelcomeFirst');
          }
        }
      } else if (responseData?.Response?.Success == '0') {
        // Show error toast when Success is "0"
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: responseData?.Response?.Message || 'Something went wrong',
        });
        console.log('Login Failed:', responseData?.Response?.Message);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: responseData?.Response?.Message || 'Something went wrong',
        });
        console.log('Error:', responseData?.Response?.Message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('No Server Response');
    }
  };

  var otpVerify_data = new FormData();
  console.log(' enc key :', EncKey);

  otpVerify_data.append('req_type', 1);
  otpVerify_data.append('phone_num', number);
  otpVerify_data.append('otp', enterOtp);
  otpVerify_data.append('type', otpType);
  otpVerify_data.append('device_type', 1);

  const Verify_Otp = async () => {
    console.log('otpVerify_data');
    console.log(otpVerify_data);

    const response = await fetch(`${BaseUrl}Verify_Otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        authentication: EncKey,
      },
      body: otpVerify_data,
    });
    response
      .json()
      .then(responseData => {
        if (responseData?.Response.Success == 1) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: responseData?.Response.Message,
          });

          let userId = responseData.Response.Result.user_id;

          try {
            AsyncStorage.setItem('user', userId.toString());
          } catch (error) {
            console.log('Async error');
            console.log(error);
          }

          // navigation.navigate('WelcomeFirst')
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: responseData?.Response.Message,
          });
          console.log(responseData?.Response.Message);
        }
      })
      .catch(error => {
        console.error('Error parsing JSON:', error);
        alert('No Server Response');
      });
  };

  useEffect(() => {
    if (isFocused) {
      setCountdown(30);
    }
  }, [isFocused]);

  const resendOTP = async () => {
    setCountdown(30);
    Login();
  };

  const [visibility, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const [countdown, setCountdown] = useState('');

  console.log('countdown', countdown);
  console.log('enterOtp', enterOtp);
  console.log('number', number);
  console.log('number', number);
  const timer = () => {
    setCountdown(30);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    if (countdown <= 0) {
      clearInterval(interval);
      toggleVisibility();
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // const Login_Otp_Screen = (type) => {
  //   if (type === "L") {
  //     setOtpModal(true)
  //   }
  //   else if (type === "R") {
  //     navigation.navigate('RegisterScreen', { phoneNo: number, otptype: type })
  //   }

  // }

  // const Login_Otp_Screen = (type, ) => {
  //   if (type === "R") {
  //     // if (showOtp) {
  //     //   setOtpModal(true);
  //     // } else {
  //     //   console.log("OTP modal skipped after login");
  //     // }
  //     navigation.navigate('RegisterScreen', { phoneNo: number, otptype: type });

  //   } else  {
  //     navigation.replace('LoginScreen')
  //   }
  // };

  useEffect(() => {
    if (number.length === 10) {
      User_Detsils_Get();
    }
  }, [number]);
  const User_Detsils_Get = async () => {
    try {
      const response = await fetch(
        `${BaseUrl}userGet_filter?unique_id=${number}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authentication: EncKey,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Response.Success === '1') {
        setReferralName(
          data.Response.Result[0].name || 'Referral Not Available',
        );
      } else {
        console.log(data?.Response.Message);
        setReferralName(null);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setReferralName(null);
    }
  };

  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Banner =-=-=-=--==-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=

  const [isBannerLoaded, setisBannerLoaded] = useState(true);
  let newImage = [];
  const [bannerData, setBannerData] = useState(null);

  const getBanner = useCallback(() => {
    fetch(
      `${BaseUrl}appScreenGet?screen_type=MS&type=M&req_type=1&res_type=1`,
      {
        method: 'GET',
        headers: { authentication: EncKey },
      },
    )
      .then(response => response.json())
      .then(responseData => {
        if (responseData?.Response.Success === '1') {
          //  let result = decryptPiDataNew(responseData.Response.Result);
          setBannerData(responseData.Response.Result);
        } else {
          console.log(responseData?.Response.Message);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setisBannerLoaded(false);
      });
  }, []);

  useEffect(() => {
    getBanner();
  }, [getBanner]);

  let Banner = useMemo(() => bannerData, [bannerData]);
  Banner?.map(e => {
    newImage.push(e.image);
  });

  const Banners = () => {
    return (
      <View>
        {!isBannerLoaded ? (
          <View style={{ height: hp(46), width: responsiveWidth(102) }}>
            <SwiperFlatList
              autoplay
              autoplayDelay={5}
              autoplayLoop
              showPagination
              paginationDefaultColor={'gray'}
              paginationActiveColor={'white'}
              paginationStyle
              index={0}
              data={newImage}
              pagingEnabled
              horizontal
              paginationStyleItem={{
                marginTop: hp(-4),
                height: hp(0.8),
                width: hp(0.8),
              }}
              renderItem={({ item, index }) => {
                return (
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: responsiveWidth(102),
                      height: hp(45),
                      resizeMode: 'contain',
                    }}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View
            style={{
              height: hp(55),
              width: responsiveWidth(102),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color="#fcb713" />
          </View>
        )}
      </View>
    );
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert("Hold on!", "Are you sure you want to exit?", [
  //       { text: "EXIT", onPress: () => BackHandler.exitApp() },
  //       {
  //         text: "Cancel",
  //         onPress: () => null,
  //         style: "cancel",
  //       },
  //       {
  //         text: "Login",
  //         onPress: () =>   navigation.navigate('LoginScreen'),
  //         style: "default",
  //       },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () => backHandler.remove();
  // }, []);

  // useFocusEffect(
  //     useCallback(() => {
  //       const backAction = () => {
  //         Alert.alert("Hold on!", "Are you sure you want to exit?", [
  //           { text: "EXIT", onPress: () => BackHandler.exitApp() },
  //           {
  //             text: "Cancel",
  //             onPress: () => null,
  //             style: "cancel",
  //           },
  //           // {
  //           //   text: "Go Home",
  //           //   onPress: () => navigation.navigate('Footer', { screen: 'HomeScreen' }),
  //           //   style: "default",
  //           // },
  //         ]);
  //         return true;
  //       };

  //       const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

  //       return () => backHandler.remove();
  //     }, [navigation])
  //   );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setModalVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  const handleExit = () => {
    setModalVisible(false);
    BackHandler.exitApp();
  };

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <KeyboardAvoidingView style={{ backgroundColor: '#fff' }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.illustrationContainer}>
              {/* <Banners /> */}
              <Image
                source={require('../../assets/images/Login/bg.png')}
                style={{ height: hp(50), width: wp(100), resizeMode: 'contain' }}
              />
              <Image
                source={require('../../assets/images/Login/avatto_logo.png')}
                style={styles.titleimg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.contentContainer}>
              {/* <View style={styles.textContainer}>
                <View style={styles.line} />
                <Text style={styles.text}>Log in or Register</Text>
                <View style={styles.line} />
              </View> */}
              <Text
                style={{ color: '#000', fontSize: hp(2), fontWeight: '600' }}
              >
                Login or Registration
              </Text>

              {number.length === 10 && RegistermobileNo !== null ? (
                <View>
                  <Text
                    style={{
                      fontSize: hp(1.7),
                      fontWeight: '500',
                      color: 'red',
                      alignSelf: 'center',
                      height: hp(3),
                    }}
                  >
                    Already registered with mobile: {RegistermobileNo}
                  </Text>
                </View>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: wp(90),
                }}
              >
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputContainer2}>
                    <View style={styles.inputRow}>
                      <TextInput
                        placeholder="Enter Phone Number"
                        placeholderTextColor={'gray'}
                        style={styles.input}
                        keyboardType="phone-pad"
                        onChangeText={text => {
                          const numericText = text.replace(/[^0-9]/g, '');
                          setNumber(numericText);

                          if (numericText.length === 10) {
                            Keyboard.dismiss();
                          }
                        }}
                        value={number}
                        maxLength={10}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <Text
                onPress={() => navigation.navigate('ForgotPin')}
                style={{
                  fontSize: hp(1.5),
                  fontWeight: '500',
                  textDecorationLine: 'underline',
                  color: '#A6222C',
                  alignSelf: 'flex-end',
                  marginRight: hp(4),
                  marginTop:ReferralName ? hp(0) : hp(-2)
                }}
              >
                Forgot or Reset MPIN?
              </Text>
{/* -=-=-=-=-=--=-=-=-=-=- Welcome Text =-=-=-=-=--=-=-=-=-=- */}
              {number.length === 10 &&
                (ReferralName ? (
                  <View
                    style={{
                      width: wp(78),
                      height: hp(4),
                      justifyContent: 'flex-start',
                      marginTop: hp(0),
                    }}
                  >
                    <Text>
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: hp(1.8),
                        }}
                      >
                        Welcome
                      </Text>{' '}
                      <Text style={styles.referralNameText}>
                        {ReferralName}
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <></>
                ))}
{/* -=-=-=-=-=--=-=-=-=-=- MPIN Input =-=-=-=-=--=-=-=-=-=- */}
              {ReferralName ? (
                <View style={styles.inputContainer1}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 0,
                      borderColor: 'gray',
                      width: wp(45),
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      placeholder="Enter Mpin"
                      placeholderTextColor={'gray'}
                      style={{
                        flex: 1,
                        paddingVertical: hp(1),
                        fontSize: hp(2.2),
                        letterSpacing: 2,
                        textAlign: 'center',
                        color: '#000',
                      }}
                      keyboardType="numeric"
                      secureTextEntry={secureText}
                      onChangeText={text => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        setMpin(numericText);

                        if (numericText.length === 4) {
                          Keyboard.dismiss();
                        }
                      }}
                      value={mpin}
                      maxLength={4}
                    />
                    <TouchableOpacity
                      onPress={() => setSecureText(!secureText)}
                      style={{ padding: 10, marginRight: wp(2) }}
                    >
                      {secureText ? (
                        <EyeOff size={24} color="gray" />
                      ) : (
                        <Eye size={24} color="gray" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <></>
              )}
{/* -=-=-=-=-=--=-=-=-=-=- Login/Register Button =-=-=-=-=--=-=-=-=-=- */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  height: hp(10),
                  width: wp(100),
                  marginTop:hp(-2)
                }}
              >
                {number || ReferralName ? (
                  // If a phone number or referral name exists, show either Login or Register
                  ReferralName ? (
                    <TouchableOpacity
                      onPress={() => {
                        Login();
                      }}
                      style={[styles.button,{marginTop:ReferralName ? hp(2):0}]}
                    >
                      <Text style={styles.buttonText}>Login / Register</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        Login();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Login / Register</Text>
                    </TouchableOpacity>
                  )
                ) : (
                  // Default: Show both Login and Register buttons
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        Login();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Login / Register</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      onPress={() => {
                        Login();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Login / Register</Text>
                    </TouchableOpacity> */}
                  </>
                )}
              </View>

              <View style={styles.footerContainer}>
                <Text style={styles.footer}>
                  By Continuing, you agree to your{' '}
                </Text>
                <View
                  style={{
                    width: wp(100),
                    alignItems: 'center',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: hp(1),
                  }}
                >
                  <Text style={styles.link}>Terms of Service</Text>
                  <Text style={styles.link}>Privacy Policy</Text>
                  <Text style={styles.link}>Content Policy</Text>
                </View>
              </View>
            </View>

            {/* ====================================================== Modal for otp page =========================================================================================================================================================================== */}
            <Modal
              animationType="slide"
              transparent
              visible={otpModal}
              onRequestClose={() => {
                setOtpModal(!otpModal);
              }}
            >
              <>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View
                    style={{
                      height: hp(70),
                      width: wp(100),
                      borderTopLeftRadius: hp(5),
                      borderTopRightRadius: hp(5),
                      marginTop: 'auto',
                      backgroundColor: '#fff',
                      padding: hp(0),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setOtpModal(false)}
                      style={{
                        width: wp(25),
                        padding: hp(3),
                        flexDirection: 'row',
                      }}
                    >
                      <Image
                        source={require('../../assets/images/Login/remove.png')}
                        style={styles.closeimg}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: wp(100),
                        marginTop: hp(-2),
                      }}
                    >
                      <Text style={styles.modalheader}>Enter OTP</Text>
                      <Lottie
                        resizeMode="contain"
                        source={require('../../assets/json/otp.json')}
                        style={{ width: hp(20), height: hp(20) }}
                        autoPlay
                        loop
                      />
                    </View>
                    <Text style={styles.instruction}>
                      Please enter the 4-digit code sent to +91 {number}
                    </Text>

                    <View style={styles.otpContainer}>
                      {otp.map((value, index) => (
                        <TextInput
                          key={index}
                          style={styles.otpInput}
                          keyboardType="numeric"
                          maxLength={1}
                          value={value}
                          onChangeText={text => handleChange(text, index)}
                          onKeyPress={e => handleKeyPress(e, index)}
                          ref={ref => (inputs.current[index] = ref)}
                        />
                      ))}
                    </View>
                    {countdown >= 0 ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: hp(0),
                          marginTop: hp(2),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: hp(3),
                            color:
                              countdown >= 10
                                ? '#0097fa'
                                : countdown == 0
                                ? '#0097fa'
                                : 'red',
                          }}
                        >
                          {countdown}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}

                    <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                      {countdown == 0 ? (
                        <>
                          <Text style={styles.resendText}>
                            Didn't receive the OTP?
                          </Text>
                          <TouchableOpacity
                            style={{}}
                            onPress={() => resendOTP()}
                          >
                            <Text style={[styles.resendLink]}>RESEND OTP</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <></>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        Verify_Otp();
                        setOtpModal(false);
                      }}
                      style={styles.submitButton}
                    >
                      <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>

                    <Text style={styles.helpText}>
                      Facing any difficulty in verifying mobile number?{'\n'}
                      Please call our customer service{' '}
                      <Text
                        onPress={() => dialCall()}
                        style={styles.customerNumber}
                      >
                        +91 4623560085
                      </Text>
                    </Text>
                  </View>

                  {/* </View> */}
                </TouchableWithoutFeedback>
              </>
            </Modal>

            <Modal
              animationType="fade"
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                  <FontAwesome
                    name="exclamation-circle"
                    size={50}
                    color="#A6222C"
                  />
                  <Text style={styles.modalTitle}>Hold On!</Text>
                  <Text style={styles.modalMessage}>
                    Are you sure you want to exit?
                  </Text>
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.cancelText}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.exitButton]}
                      onPress={handleExit}
                    >
                      <Text style={styles.exitText}>Exit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Toast />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    width: wp(100),
    height: hp(54),
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contentContainer: {
    width: wp(100),
    height: hp(46),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: hp(5),
  },
  titleimg: {
    height: hp(8),
    width: wp(70),
    marginTop: hp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdbcbc',
    borderRadius: hp(1),
    width: wp(65),
    height: hp(6),
  },
  inputContainer1: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'green',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: hp(1),
    width: wp(45),
    height: hp(6.5),
  },

  input: {
    flex: 1,
    fontSize: hp(1.8),
  },
  input1: {
    flex: 1,
    fontSize: hp(2),
    // letterSpacing: hp(1),
    // marginLeft:wp(3),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A6222C',
    height: hp(6),
    borderRadius: hp(3),
    width: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: 'bold',
    fontFamily: 'DMSans-Medium',
  },
  footer: {
    textAlign: 'center',
    fontSize: hp(1.5),
    color: 'gray',
    width: wp(80),
    fontFamily: 'DMSans-Medium',
  },
  link: {
    color: '#A6222C',
    textDecorationLine: 'underline',
    fontFamily: 'DMSans-Medium',
    fontSize: hp(1.5),
    marginLeft: wp(2),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
  },
  text: {
    fontSize: hp(1.5),
    fontWeight: '400',
    color: '#454545',
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 0.75,
    backgroundColor: '#4B2D73',
    marginLeft: wp(4),
    marginRight: wp(4),
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
  },
  inputContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryCodeContainer: {
    padding: 2,
    width: hp(9),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdbcbc',
  },
  countryCodeText: {
    color: '#000',
    fontWeight: '400',
    fontSize: hp(1.8),
  },
  lockIconContainer: {
    padding: 2,
    width: hp(9),
    height: hp(6.7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: wp(60),
  },
  inputRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: wp(60),
  },

  backText: {
    color: '#000',
    fontSize: hp(1.8),
  },
  modalheader: {
    fontSize: hp(2),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  instruction: {
    fontSize: hp(1.8),
    textAlign: 'center',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: hp(2),
  },
  otpInput: {
    width: hp(5),
    height: hp(5),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: hp(1),
    textAlign: 'center',
    fontSize: hp(2),
    backgroundColor: '#F9F9F9',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: hp(1.5),
    color: '#000',
    marginTop: hp(1),
  },
  resendLink: {
    fontSize: hp(1.5),
    color: '#0097fa',
    fontWeight: 'bold',
    marginLeft: wp(2),
    marginTop: hp(1),
  },
  timerText: {
    fontSize: hp(1.5),
    color: '#888',
  },
  submitButton: {
    backgroundColor: '#A6222C',
    width: wp(50),
    height: hp(5),
    marginTop: hp(4),
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
  helpText: {
    textAlign: 'center',
    fontSize: hp(1.5),
    color: '#000',
    marginTop: hp(3),
  },
  customerNumber: {
    color: '#A6222C',
    fontWeight: 'bold',
  },
  closeimg: {
    height: hp(3),
    width: hp(3),
  },
  referralNameText: {
    marginTop: hp(0),
    fontSize: hp(1.8),
    color: '#A6222C',
    marginLeft: wp(2),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6222C',
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#f8b400',
  },
  homeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#A6222C',
  },
  exitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
