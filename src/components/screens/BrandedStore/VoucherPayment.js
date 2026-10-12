import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { Modal } from 'react-native';
import Lottie from 'lottie-react-native';


const VoucherPayment = ({ navigation, route }) => {
    const brandId = route?.params?.brandId || '';
    const brandDetails = route?.params?.BrandDetails
    const denomination = route?.params?.denomination


       const EncKey = encryptPiDataNew(Authentication_Key)

    const [uid, setUid] = useState(null);
    const [CurrentCityId, setCurrentCityId] = useState(null);
    const [CurrentPincode, setCurrentPincode] = useState(null);
     const [ordersuccessmodal, setOrderSuccessmodal] = useState(false);
         const [successdata, setSuccessdata] = useState(false);

    useEffect(() => {
        User_Details_Get();

    }, []);

    const User_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                setUid(value)
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
                        setCurrentCityId(data.Response.Result[0]?.city || '');
                        setCurrentPincode(data.Response.Result[0]?.pincode || '');
                    } else {
                        console.log(data?.Response?.Message || 'Unknown error');
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


    const Final_Voucher_Purchase = async () => {

        const purchase_add_data = new FormData();


        purchase_add_data.append("uId", uid);
        purchase_add_data.append("amount", denomination);
        purchase_add_data.append("brandId", brandId);
        purchase_add_data.append("pincode", CurrentPincode);
        purchase_add_data.append("districtId", CurrentCityId);

        console.log(purchase_add_data);
        try {
            //const response = await fetch(`${BaseUrl}purchase_add`, {
            const response = await fetch(`${BaseUrl}branded_voucher_payment`, {
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
                setOrderSuccessmodal(true)
                setSuccessdata(responseData?.Response?.Message)
                // ToastAndroid.showWithGravity(
                //     responseData?.Response?.Message || "Success",
                //     ToastAndroid.LONG,
                //     ToastAndroid.BOTTOM
                // );
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
            //  Order_Add(); 
        }
    }


    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar  backgroundColor='#A6222C' barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <AntDesign onPress={() => navigation.goBack()} name="left" size={22} color="white" />
                    <Text onPress={() => navigation.goBack()} style={styles.headerText}>BRANDED STORES</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.brandImageContainer}>
                <Image
                    source={brandDetails?.BrandImage ? { uri: brandDetails.BrandImage } : require('../../assets/images/Login/avatto_logo.png')}
                    style={styles.brandImage}
                />
            </View>

            {/* <Text style={{fontSize:hp(3),fontWeight:"700",textAlign:'center',marginTop:hp(3)}}> <Text style={{fontSize:hp(3),textAlign:'center',marginTop:hp(3)}}>Payable Amount : </Text>₹ {denomination}</Text> */}
            <Text style={{ fontSize: hp(3), textAlign: 'center', marginTop: hp(3) }}>
                Payable Amount :
                <Text style={{ fontWeight: '700' }}> ₹ {denomination} </Text>
            </Text>

            <TouchableOpacity style={styles.buyButton} onPress={() => { Final_Voucher_Purchase() }}>
                <Text style={styles.buyButtonText}>Pay</Text>
            </TouchableOpacity>


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
                                            <Lottie resizeMode='cover' source={require('../../assets/json/giftvoucher.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
                                            {/* <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text> */}
                                            <Text style={{ fontSize: hp(2.2), color: '#000', marginTop: hp(1), textAlign: 'center', fontWeight: 'bold',marginTop:hp(3) }}>{successdata}</Text>
                                            <TouchableOpacity onPress={() => { setOrderSuccessmodal(false); navigation.navigate('StoresListByCategory') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                                                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>

        </SafeAreaView>
    )
}

export default VoucherPayment

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff'
    },

    header: {
        backgroundColor: '#A6222C',
        padding: hp(1.5),
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        color: '#fff',
        fontSize: hp(2),
        fontWeight: 'bold',
        marginLeft: wp(5)
    },
    brandImageContainer: {
        backgroundColor: "#fff",
        height: hp(22),
        width: wp(90),
        alignSelf: "center",
        borderRadius: hp(0.5),
        borderWidth: 1,
        borderColor: "#bdbcbc",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp(2),
        elevation: 5
    },
    brandImage: {
        height: hp(22),
        width: wp(85),
        alignSelf: "center",
        borderRadius: hp(2),
        resizeMode: 'contain'
    },

    buyButton: {
        padding: hp(1),
        width: wp(30),
        backgroundColor: '#A6222C',
        alignSelf: 'center',
        borderRadius: hp(0.5),
        marginTop: hp(5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyButtonText: {
        color: "#fff",
        fontSize: hp(2),
        fontWeight: '700'
    },

})