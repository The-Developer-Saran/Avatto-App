import { FlatList, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from '@react-native-vector-icons/ant-design';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Lottie from 'lottie-react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { useIsFocused } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';





const AvatooOTPScreen = ({navigation}) => {

    const EncKey = encryptPiDataNew(Authentication_Key)
    const isFocused = useIsFocused();

    // let phone_num = 8056310027;

    const [otp_id, setOtp_id] = useState(null);
    const [otp, setOtp] = useState(null);
    const [mpin, setMpin] = useState(null);
    const [Uid, setUid] = useState(null);

    const [profileData, setProfileData] = useState("");
    const [Mobileno, setMobileno] = useState("");

    console.log("profileData", profileData);
    console.log("Mobileno", Mobileno);




    useEffect(() => {
        // if (isFocused) {
            User_Details_Get();
        // }
    }, []);

    // const User_Details_Get = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

    //         if (value !== null) {
    //             // alert(value)
    //             setUid(value)
    //             try {
    //                 const response = await fetch(
    //                     `${BaseUrl}userGet?req_type=1&res_type=1&id=${value}&type=M`,
    //                     {
    //                         method: 'GET',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             authentication: EncKey,
    //                         },
    //                     }
    //                 );

    //                 if (!response.ok) {
    //                     throw new Error(`Network response was not ok: ${response.status}`);
    //                 }

    //                 const data = await response.json();
    //                 console.log("data :::>>>", data.Response);

    //                 if (data.Response.Success === '1') {
    //                     setProfileData(data.Response.Result);
    //                     setMobileno(data.Response.Result[0]?.mobile || "");
    //                 } else {
    //                     console.log(data?.Response?.Message || 'Unknown error');
    //                     setProfileData(null);
    //                     setMobileno(null)
    //                 }
    //             } catch (error) {
    //                 console.error('Fetch error:', error.message);
    //             }
    //         } else {
    //             console.log('No user data found in AsyncStorage.');
    //         }
    //     } catch (error) {
    //         console.error('Error reading AsyncStorage:', error.message);
    //     }
    // };

    const User_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
    
            if (value) {
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
    
                    if (data.Response?.Success === '1') {
                        setProfileData(data.Response.Result);
                        setMobileno(data.Response.Result[0]?.mobile || "");
                    } else {
                        console.log(data?.Response?.Message || 'Unknown error');
                        setProfileData(null);
                        setMobileno("");
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

    const sendOTP = async () => {
        const inputData = new FormData();
        inputData.append('phone_num', Mobileno);
        const response = await fetch(`${BaseUrl}otp_generate`, {
            method: 'POST',
            headers: { "authentication": EncKey },
            body: inputData
        });
        response.json()
            .then(responseData => {
                console.log(responseData);
                if (responseData.Response.Success == 1) {
                    setOtp_id(responseData.Response.Result.otp_id);
                    ToastAndroid.showWithGravityAndOffset(
                        responseData.Response.Message,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        responseData.Response.Message,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
            })
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });

    }

    const setMPIN = async () => {

        if (!otp) {
            ToastAndroid.showWithGravityAndOffset(
                'Invalid OTP',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }

        else if (!mpin) {
            ToastAndroid.showWithGravityAndOffset(
                'Invalid MPIN',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } else {
            const inputData = new FormData();
            inputData.append('phone_num', Mobileno);
            inputData.append('otp', otp);
            inputData.append('mpin', mpin);
            const response = await fetch(`${BaseUrl}updateMpin`, {
                method: 'POST',
                headers: { "authentication": EncKey },
                body: inputData
            });
            response.json()
                .then(responseData => {
                    console.log(responseData);
                    if (responseData.Response.Success == 1) {
                        ToastAndroid.showWithGravityAndOffset(
                            responseData.Response.Message,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                        setOtp_id(null)
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            responseData.Response.Message,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                })
                .catch(error => {
                    console.error('Error parsing JSON:', error);
                });
        }
    }
    return (
     <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(3) }}>
                        <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>PIN CHANGE</Text>
                    </TouchableOpacity>
                </View>

            {
                otp_id ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ backgroundColor: '#fff', elevation: 5, borderRadius: hp(1), padding: hp(1), height: hp(40), width: wp(80), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: '#000', marginBottom: hp(2), fontSize: hp(2) }}>Enter OTP</Text>
                                <OTPInputView
                                    style={{ width: wp(60), height: hp(4), fontFamily: "DMSans-Medium" }}
                                    pinCount={4}
                                    autoFocusOnLoad={false}
                                    codeInputFieldStyle={styles.underlineStyleBase}
                                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                    keyboardAppearance={'default'}
                                    placeholderTextColor={"#fff"}
                                    editable
                                    onCodeFilled={(code => {
                                        setOtp(code)
                                    })}
                                />
                            </View>

                            <View style={{ alignItems: 'center', marginTop: hp(5) }}>
                                <Text style={{ color: '#000', marginBottom: hp(2), fontSize: hp(2) }}>Enter New MPIN</Text>
                                <OTPInputView
                                    style={{ width: wp(60), height: hp(4), fontFamily: "DMSans-Medium" }}
                                    pinCount={4}
                                    autoFocusOnLoad={false}
                                    codeInputFieldStyle={styles.underlineStyleBase}
                                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                    keyboardAppearance={'default'}
                                    placeholderTextColor={"#fff"}
                                    editable
                                    onCodeFilled={(code => {
                                        setMpin(code)
                                    })}
                                />
                            </View>

                            <TouchableOpacity onPress={() => setMPIN()} style={{ padding: hp(1), width: wp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1), marginTop: hp(5), alignSelf: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: hp(2) }}>Set MPIN</Text>
                            </TouchableOpacity>

                            <View style={{ marginTop: hp(2), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                                <Text>Didn't receive the OTP? </Text>
                                <TouchableOpacity onPress={() => setOtp_id(null)}>
                                    <Text style={{ color: '#A6222C' }}>REDEND OTP</Text>
                                </TouchableOpacity>
                            </View>


                        </View>


                    </View>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: hp(2), }}>Verify your OTP to change MPIN </Text>
                        {/* <Lottie source={require('../../assets/json/otp.json')} style={{ justifyContent: "center", alignContent: "center", width: hp(25), alignSelf: "center", marginTop: 25 }} autoPlay loop /> */}
                          <Lottie resizeMode='contain' source={require('../../assets/json/otp.json')} style={{ width: hp(25), height: hp(25) }} autoPlay loop />
                        <TouchableOpacity onPress={() => sendOTP()} style={{ padding: hp(1), width: wp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1), marginTop: hp(5) }}>
                            <Text style={{ color: '#fff', fontSize: hp(2) }}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                )

            }

        </View>
        </>
    )
}

export default AvatooOTPScreen

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
    borderStyleBase: {
        width: wp(5),
        height: hp(4),
    },
    borderStyleHighLighted: {
        borderColor: "#17202A",
    },
    underlineStyleBase: {
        width: wp(10),
        height: hp(5),
        borderWidth: 0,
        borderBottomWidth: 1,
        color: '#000',
        fontSize: hp(2),
    },
    underlineStyleHighLighted: {
        borderColor: "#A6222C",
    },
})