// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const UtlityHistory = () => {
//   return (
//     <View>
//       <Text>UtlityHistory</Text>
//     </View>
//   )
// }

// export default UtlityHistory

// const styles = StyleSheet.create({})

import { BackHandler, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import { TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../../key/Key';
import { encryptPiDataNew } from '../../Encryption/encryption';
import { ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';


const UtlityHistory = ({ navigation }) => {

    const EncKey = encryptPiDataNew(Authentication_Key)


    const [UtilityHistory, setUtilityHistory] = useState(null);

    console.log("UtilityHistory", UtilityHistory);



    useEffect(() => {
        User_Referral_Get();

    }, []);

    const User_Referral_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                try {
                    const response = await fetch(
                        `${BaseUrl}rechargeGet?uid=${value}`,
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
                        setUtilityHistory(data.Response.Result);
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



    const renderItem = (item, index) => {
        // const details = describeData[item.id] || [];

        return (
            <Animatable.View
                animation="zoomIn"
                duration={1000}
                delay={index * 100}
                useNativeDriver
            >

                <View style={styles.card}>

                    <View style={{ width: wp(90), marginLeft: wp(0) }}>
                        <View style={{ width: wp(30), height: hp(3), backgroundColor: '#A6222C', alignSelf: 'center', marginVertical: hp(-1), borderBottomStartRadius: hp(1), borderBottomEndRadius: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp(1.8), color: "#fff", textAlign: 'center' }}>{item.Created_On ? item.Created_On : ""}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: wp(85), marginTop: hp(2) }}>
                            {/* <Text style={styles.name}>{item.name}</Text> */}
                            <View style={{ width: wp(60) }}>
                                <Text style={styles.value}>Number  :    <Text style={{ fontWeight: 'bold' }}>{item.mobile_number ? item.mobile_number : ""}</Text></Text>
                            </View>
                            <View style={{ marginTop: hp(0) }}>
                                <Text style={{ fontSize: hp(1.7), color: item.status === "SUCCESS" ? "#A6222C" : item.status === "FAILED" ? "red" : "orange", fontWeight: 'bold' }}>{item.status ? item.status : ""}</Text>
                            </View>
                        </View>
                        {/* <Text style={styles.id}>{item.memberships && item.memberships.length > 0 ? item.memberships[0].membership_name : 'No Membership'}</Text> */}


                        <Text style={styles.value}>Order ID  :    <Text style={{ fontWeight: 'bold' }}>{item.order_id ? item.order_id : ""}</Text></Text>

                        <Text style={styles.value}>Amount   :    <Text style={{ fontWeight: 'bold' }}> ₹ {item.amount ? item.amount : "0"}</Text></Text>

                        <Text style={styles.value}>Type         :    <Text style={{ fontWeight: 'bold', color: '#454545' }}>{item.provider_type ? item.provider_type : ""}</Text></Text>

                    </View>



                    {/* <View> */}

                    {/* <View style={styles.profilecontainer}>
    
                                <Image
                                    source={
                                        !item.profile_image
                                            ? require('../../assets/images/Login/avatto_logo.png')
                                            : { uri: item.profile_image }
                                    }
                                    style={styles.profileImage}
                                    resizeMode="cover"
                                />
                            </View> */}
                    {/* </View> */}

                </View>
            </Animatable.View>
        );
    };

    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <TouchableOpacity onPress={() => navigation.navigate("ServiceScreen")} style={styles.header}>
                    <Icon onPress={() => navigation.navigate("ServiceScreen")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
                    <Text onPress={() => navigation.navigate("ServiceScreen")} style={[styles.headerText,{marginTop: hp(3)}]}>UTILITY HISTORY</Text>
                </TouchableOpacity>
                {UtilityHistory == null ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: hp(100), marginTop: hp(0) }}>
                        <ActivityIndicator size="small" color="#A6222C" />
                        <Text style={{ marginTop: hp(10), fontSize: 16, color: '#A6222C' }}>Please Wait Loading...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={UtilityHistory}
                        keyExtractor={(item) => item.id.toString()}
                        //renderItem={renderItem}
                        renderItem={({ item, index }) => renderItem(item, index)}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </>
    )
}

export default UtlityHistory

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
        justifyContent: 'flex-start',
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
    card: {
        // backgroundColor: '#98fb9888',
        backgroundColor: '#fff',
        marginTop: hp(2),
        borderRadius: hp(1),
        padding: hp(1),
        width: wp(94),
        height: hp(18),
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
        marginVertical: hp(0.5),
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center'
    },
    profilecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: hp(8.5),
        height: hp(8.5),
        borderRadius: hp(5.25),
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 8,
        backgroundColor: '#fff',
        marginRight: wp(30)
    },

    profileImage: {
        width: hp(8),
        height: hp(8),
        borderRadius: hp(5),
    },
    name: {
        fontSize: hp(2),
        fontWeight: 'bold'

    },
    id: {
        fontSize: hp(1.8),
        marginTop: hp(1),
        marginLeft: wp(1),
    },
    premiumText: {
        fontSize: hp(1.6),
        // marginTop:hp(1)
        marginLeft: wp(0),
        // fontWeight:'bold'
    },
    crownimg: {
        width: hp(2),
        height: hp(2),
        marginLeft: wp(-0.5)
    },
    value: {
        fontSize: hp(1.8),
        width: wp(100),
        marginTop: hp(0.75),
        marginLeft: wp(4)

    },
    callimg: {
        width: hp(1.5),
        height: hp(1.5),
        marginTop: hp(1)
    },
})