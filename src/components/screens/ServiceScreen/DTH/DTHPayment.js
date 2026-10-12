// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const DTHPayment = () => {
//   return (
//     <View>
//       <Text>DTHPayment</Text>
//     </View>
//   )
// }

// export default DTHPayment

// const styles = StyleSheet.create({})


import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, FlatList, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ant-design';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Feather from '@react-native-vector-icons/feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationContainer, useIsFocused, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Modal } from "react-native-paper";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Lottie from 'lottie-react-native';
import { Authentication_Key } from "../../../key/Key";
import { encryptPiDataNew } from "../../Encryption/encryption";
import { BaseUrl } from "../../BaseUrl/BaseUrl";


export default function DTHPayment() {
    // const user = useSelector(state => state.user.value);

    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber, amount,dth_id, dth_operator, Orderid } = route.params || {};
    const isFocused = useIsFocused();

    const EncKey = encryptPiDataNew(Authentication_Key)




    console.log("phoneNumber :", phoneNumber);
    // console.log("selectedCityCode :", selectedCityCode);
    // console.log("selectedOperatorId :", selectedOperatorId);
    console.log("amount :", amount);
    // console.log("selectedOperatorIdName :", selectedOperatorIdName);
    console.log("Orderid :", Orderid);

    const [modalMessage, setModalMessage] = useState('');
    const [AlertModalVisible, setAlertModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [DCEO_Id, setDCEO_Id] = useState("");
    const [Uid, setUid] = useState("");
    const [successmodal, setSuccessmodal] = useState(false);
    const [successData, setSuccessData] = useState("");
    const [failuremodal, setFailureModal] = useState(false);
    const [failureData, setfailureData] = useState("");
    const [failureStatus, setfailureStatus] = useState("");



    const [profileData, setProfileData] = useState("");
    const [pincode, setPincode] = useState("");
    const [districtid, setDistrictid] = useState("");

    // console.log("profileData", profileData);
    console.log("pincode", pincode);
    console.log("districtid", districtid);



    useEffect(() => {
        if (isFocused) {
            User_Details_Get();
        }
    }, [isFocused]);

    const User_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
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
                    console.log("data :::>>>", data.Response);

                    if (data.Response.Success === '1') {
                        setProfileData(data.Response.Result);
                        setDistrictid(data.Response.Result[0]?.city || '');
                        setPincode(data.Response.Result[0]?.pincode || '');
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




    const Recharges_Success_Get = async () => {
        try {
            setIsLoading(true)
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                setUid(value)
                try {
                    const response = await fetch(
                        `${BaseUrl}recharge?number=${phoneNumber}&amount=${amount}&opid=${dth_id}&uId=${value}&orderId=${Orderid}&pincode=${pincode}&districtId=${districtid}`,
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

                    // if (data.Response.Success === '1') {
                    //     // alert("success");
                    //     //  alert(data?.Response?.Message);
                    //     setSuccessmodal(true)

                    // } else {
                    //     console.log(data?.Response?.Message || 'Unknown error');

                    // }

                    if (data.Response.Success === '1') {
                        setSuccessmodal(true);
                        setSuccessData(data?.Response?.Message)
                    } else if (data.Response.Success === '0') {
                        // Handle failure case
                        setFailureModal(true); // Assuming you have a state for failure modal
                        setfailureData(data?.Response?.Message)
                        setfailureStatus(data?.Response?.Result.message)
                        console.log(data?.Response?.Message || 'Unknown error');
                    } else {
                        console.log('Unexpected response:', data);
                    }

                } catch (error) {
                    console.error('Fetch error:', error.message);
                } finally {
                    setIsLoading(false); // Ensure loading state updates in all cases
                }
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
    };


    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('SelectPlan')
        }
    }

    const handleConfirm = () => {
        if (!isChecked) {
            setAlertModalVisible(true);
            setModalMessage("Please check the box to confirm and proceed with the payment process.");
            return;
        } else {
            Recharges_Success_Get();
        }
    }




    return (

        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={{ flexDirection: 'row', marginTop: hp(3) }}>
                        <Icon onPress={handleBack} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text onPress={handleBack} style={styles.headerText}>DTH RECHARGE</Text>
                    </TouchableOpacity>
                </View>
                {/* // <SafeAreaView style={styles.container}>
        //     <TouchableOpacity style={styles.header}
        //         onPress={handleBack}>
        //         <Icon name="left" style={styles.headerIcon} />
        //         <Text style={styles.headerTitle}>Payment Confirmation</Text>
        //     </TouchableOpacity> */}
                {/* <ScrollView> */}
                <View style={styles.contentDiv}>
                    <View style={styles.inputContainerTop}>
                        <MaterialIcons name="cell-tower" style={styles.secureIcon} />
                        <Text style={styles.payTo}>{dth_operator}</Text>
                    </View>
                    <View style={styles.inputContainerTop}>
                        <MaterialIcons name="mobile-friendly" style={styles.secureIcon} />
                        <Text style={styles.mobileNumber}>{phoneNumber}</Text>
                    </View>
                    <View style={styles.inputContainerTop}>
                        {/* <MaterialIcons name="currency-rupee" style={styles.moneyIcon} /> */}
                        <Text style={styles.amount}>₹</Text>
                        <Text style={styles.amount}> {amount}</Text>
                    </View>
                </View>
                <View style={styles.bottomChechRow}>
                    {/* <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        tintColors={{ true: 'Green', false: 'gray' }}
                    /> */}

                    <Checkbox.Item
                        // label={isChecked ? 'You have confirmed the payment process.' : 'Please confirm the payment process.'}
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => setIsChecked(!isChecked)}
                        color="green"
                    />
                    {isChecked ?
                        <Text style={[styles.bottomChechText, { color: "green" }]}>You have confirmed the payment process.</Text>
                        :
                        <Text style={[styles.bottomChechText, { color: 'gray' }]}>Please confirm the payment process.</Text>
                    }
                </View>
                {/* </ScrollView> */}

                {/* <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
                <Ionicons name="arrow-forward" style={styles.submitIcon} />
            </TouchableOpacity> */}

                <TouchableOpacity style={styles.submitButton} onPress={() => handleConfirm()} >
                    <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: "#fff", }}>Submit</Text>
                    <Ionicons name="arrow-forward" style={styles.submitIcon} />
                </TouchableOpacity>
                {/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- modal for alert */}
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
                                    style={styles.gradient}
                                >
                                    <View style={styles.modalContent}>

                                        <Text style={styles.AddNewTitle}>Alert</Text>
                                        <Text style={styles.AddNewTitle}>{modalMessage}</Text>

                                        <TouchableOpacity
                                            style={{
                                                marginRight: hp(3),
                                            }}
                                            onPress={() => setAlertModalVisible(false)}
                                        >
                                            <Text style={{
                                                color: '#fff',
                                                backgroundColor: '#A6222C',
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
                    visible={successmodal}
                    onRequestClose={() => {
                        setSuccessmodal(!successmodal);
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
                            <Lottie resizeMode='contain' source={require('../../../assets/json/recharge.json')} style={{ width: hp(25), height: hp(25) }} autoPlay loop />
                            {/* <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>{successData}</Text> */}
                            <TouchableOpacity onPress={() => { setSuccessmodal(false); navigation.navigate('ServiceScreen') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(0) }}>
                                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <Modal
                    animationType="slide"
                    transparent
                    visible={failuremodal}
                    onRequestClose={() => {
                        setFailureModal(!failuremodal);
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
                            <Lottie resizeMode='contain' source={require('../../../assets/json/topupfailure.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
                            <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000', marginTop: hp(3) }}>{failureData}!</Text>
                            <Text style={{ fontSize: hp(1.8), fontWeight: '500', color: '#000', marginTop: hp(1) }}>({failureStatus})</Text>
                            <TouchableOpacity onPress={() => { setFailureModal(false); navigation.navigate('ServiceScreen') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(3) }}>
                                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <Modal visible={isLoading} transparent>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <ActivityIndicator size="large" color="#A6222C" />
                    </View>
                </Modal>
                {/* </SafeAreaView> */}
                {/* </ScrollView> */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     padding: hp(2),
    // },
    // header: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // headerIcon: {
    //     fontSize: hp(2.5),
    //     color: "#000"
    // },

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
    editIcon: {
        fontSize: hp(2.8),
        color: "#f542bf",
        marginRight: hp(1)
    },
    secureIcon: {
        fontSize: hp(3),
        color: "green",
        marginHorizontal: hp(1)
    },
    moneyIcon: {
        fontSize: hp(3),
        color: "green",
        marginHorizontal: hp(1)
    },
    headerTitle: {
        fontSize: hp(2.5),
        fontWeight: '700',
        marginLeft: hp(1),
        color: "#000"
    },
    contentDiv: {
        flexDirection: 'column',
        alignItems: 'center',
        // paddingTop: hp(4),
        backgroundColor: '#fff',
        borderRadius: hp(2),
        elevation: 5,
        height: hp(20),
        width: wp(80),
        alignSelf: 'center',
        marginTop: hp(5)
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    payTo: {
        fontSize: hp(2.5),
        color: "#000",
        fontWeight: '500'
    },
    mobileNumber: {
        fontSize: hp(2.5),
        color: "#000",
        fontWeight: '900',
        // marginLeft: hp(2)
    },
    amount: {
        fontSize: hp(2.5),
        color: "#000",
        fontWeight: '500'
    },
    helperText: {
        color: "#888",
        marginTop: hp(2),
        fontSize: hp(1.8),
    },
    phoneInput: {
        flex: 1,
        height: hp(6),
        color: "#000",
        fontSize: hp(2.3),
    },
    rowContentTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(2.5)
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: hp(1),
        backgroundColor: 'lightgray',
        width: wp(65)
    },
    inputContainerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#666',
        // borderWidth: 1,
        // borderRadius: 8,
        // paddingHorizontal: hp(1),
        // height: hp(6),
        // backgroundColor: 'lightgray',
        width: wp(80),
        marginVertical: hp(1.5)
    },
    searchBtn: {
        color: '#fff',
        backgroundColor: '#990099',
        paddingHorizontal: hp(2),
        paddingVertical: hp(0.5),
        fontSize: hp(2),
        borderRadius: hp(1),
        fontWeight: '600',
        marginVertical: hp(1),
        alignSelf: "center",
        marginTop: hp(8)
    },
    bottomChechRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(2),
        alignSelf: 'center',
        width: wp(100)
    },
    bottomChechText: {
        fontSize: hp(1.8),
        fontWeight: '500',
        // marginHorizontal: hp(1),

    },
    // submitButton: {
    //     // position: 'absolute',
    //     // bottom: hp(3),
    //     // right: hp(3),
    //     backgroundColor: '#6B9EFF',
    //     padding: hp(1.5),
    //     borderRadius: hp(5),
    // },
    submitIcon: {
        fontSize: hp(3),
        color: "#fff"
    },
    modalBackground: {
        height: hp(100),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalContentOuter: {
        backgroundColor: 'rgb(212, 212, 212)',
        // padding: 2,
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
    AddNewTitle: {
        color: '#000',
        fontSize: hp(2.2),
        fontWeight: '500',
        marginVertical: hp(2)
    },
    submitButton: {
        // position: 'absolute',
        // bottom: hp(25),
        // right: hp(5),
        width: wp(40),
        height: hp(5),
        backgroundColor: '#A6222C',
        // padding: hp(1),
        borderRadius: hp(2.5),
        marginTop: hp(5),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    submitIcon: {
        fontSize: hp(2.5),
        color: "#fff",
        marginLeft: wp(5)
    },
});