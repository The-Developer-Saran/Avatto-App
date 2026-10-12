import {
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ToastAndroid,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from '@react-native-vector-icons/ant-design';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Lottie from 'lottie-react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { useIsFocused } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';

const ForgotPin = ({ navigation }) => {
  const EncKey = encryptPiDataNew(Authentication_Key);
  const isFocused = useIsFocused();

  // let phone_num = 8056310027;

  const [otp_id, setOtp_id] = useState(null);
  const [otp, setOtp] = useState(null);
  const [mpin, setMpin] = useState(null);
  const [Uid, setUid] = useState(null);
  const [number, setNumber] = useState('');

  const sendOTP = async () => {
    const inputData = new FormData();
    inputData.append('phone_num', number);
    const response = await fetch(`${BaseUrl}otp_generate`, {
      method: 'POST',
      headers: { authentication: EncKey },
      body: inputData,
    });
    response
      .json()
      .then(responseData => {
        console.log(responseData);
        if (responseData.Response.Success == 1) {
          setOtp_id(responseData.Response.Result.otp_id);
          ToastAndroid.showWithGravityAndOffset(
            responseData.Response.Message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          ToastAndroid.showWithGravityAndOffset(
            responseData.Response.Message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      })
      .catch(error => {
        console.error('Error parsing JSON:', error);
      });
  };

  const setMPIN = async () => {
    if (!otp) {
      ToastAndroid.showWithGravityAndOffset(
        'Invalid OTP',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else if (!mpin) {
      ToastAndroid.showWithGravityAndOffset(
        'Invalid MPIN',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      const inputData = new FormData();
      inputData.append('phone_num', number);
      inputData.append('otp', otp);
      inputData.append('mpin', mpin);
      const response = await fetch(`${BaseUrl}updateMpin`, {
        method: 'POST',
        headers: { authentication: EncKey },
        body: inputData,
      });
      response
        .json()
        .then(responseData => {
          console.log(responseData);
          if (responseData.Response.Success == 1) {
            ToastAndroid.showWithGravityAndOffset(
              responseData.Response.Message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            setOtp_id(null);
            navigation.navigate('LoginScreen');
          } else {
            ToastAndroid.showWithGravityAndOffset(
              responseData.Response.Message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
        })
        .catch(error => {
          console.error('Error parsing JSON:', error);
        });
    }
  };
  return (
    <>
      <StatusBar backgroundColor="#0000" />
      <View style={styles.container}>
        <ScrollView>
          <View
            style={[
              styles.illustrationContainer,
              { height: !otp_id ? hp(52) : hp(48) },
            ]}
          >
            <Image
              source={require('../../assets/images/Login/bg.png')}
              style={{
                height: hp(50),
                width: wp(100),
                resizeMode: 'contain',
              }}
            />
            {!otp_id && (
              <Image
                source={require('../../assets/images/Login/avatto_logo.png')}
                style={styles.titleimg}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.contentContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
              >
                <Text
                  style={{ color: '#000', fontSize: hp(2), fontWeight: '600' }}
                >
                  {'< Forget or Reset MPIN'}
                </Text>
              </TouchableOpacity>

            {otp_id ? (
              <>
                <Text>We are sent the OTP to {number}</Text>
                <Text style={{ marginVertical: hp(2) }}>Enter OTP</Text>
                <OTPInputView
                  style={{
                    width: wp(60),
                    height: hp(4),
                    fontFamily: 'DMSans-Medium',
                  }}
                  pinCount={4}
                  autoFocusOnLoad={false}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  keyboardAppearance={'default'}
                  placeholderTextColor={'#fff'}
                  editable
                  onCodeFilled={code => {
                    setOtp(code);
                  }}
                />
                <Text style={{ marginVertical: hp(2) }}>Enter MPIN</Text>
                <OTPInputView
                  style={{
                    width: wp(60),
                    height: hp(4),
                    fontFamily: 'DMSans-Medium',
                  }}
                  pinCount={4}
                  autoFocusOnLoad={false}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  keyboardAppearance={'default'}
                  placeholderTextColor={'#fff'}
                  editable
                  onCodeFilled={code => {
                    setMpin(code);
                  }}
                />
                <View
                  style={{
                    marginVertical: hp(2),
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <Text>Didn't receive the OTP? </Text>
                  <TouchableOpacity onPress={() => setMPIN()}>
                    <Text style={{ color: '#A6222C' }}>RESEND OTP</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
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
            )}

            {/* -=-=-=-=-=--=-=-=-=-=- Send OTP Button =-=-=-=-=--=-=-=-=-=- */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: hp(10),
                width: wp(100),
                marginTop: hp(-2),
              }}
            >
              {otp_id ? (
                <TouchableOpacity
                  onPress={() => setMPIN()}
                  style={[styles.button, {}]}
                >
                  <Text style={styles.buttonText}>Set MPIN</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => sendOTP()}
                  style={[styles.button, {}]}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
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
        </ScrollView>
      </View>
    </>
  );
};

export default ForgotPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#A6222C',
    height: hp(11),
    padding: hp(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
    marginTop: hp(3),
    marginLeft: wp(5),
    fontFamily: 'DMSans-Medium',
  },
  borderStyleBase: {
    width: wp(5),
    height: hp(4),
  },
  borderStyleHighLighted: {
    borderColor: '#17202A',
  },
  underlineStyleBase: {
    width: wp(13),
    height: hp(6),
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#bdbcbc',
    color: '#000',
    fontSize: hp(2),
    borderRadius: 10,
    marginBottom: 5,
    borderBottomColor: '#bdbcbc',
  },
  underlineStyleHighLighted: {
    borderColor: '#A6222C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: hp(1),
    width: wp(60),
    height: hp(6),
    marginTop: hp(3),
  },

  input: {
    flex: 1,
    fontSize: hp(2),
    // textAlign:'center',
    letterSpacing: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(8),
  },
  inputContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryCodeContainer: {
    padding: 2,
    width: hp(9),
    height: hp(6.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  countryCodeText: {
    color: '#000',
    fontWeight: '400',
    fontSize: hp(1.8),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: wp(60),
  },

  illustrationContainer: {
    width: wp(100),
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
