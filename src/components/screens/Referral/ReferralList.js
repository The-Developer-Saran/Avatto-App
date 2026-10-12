import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptPiDataNew } from '../Encryption/encryption';
import { Authentication_Key } from '../../key/Key';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { ActivityIndicator } from 'react-native-paper';


const ReferralList = ({ navigation }) => {




    const EncKey = encryptPiDataNew(Authentication_Key)


    const [ReferralData, setReferralData] = useState(null);
    const [membership, setMembership] = useState("");




    console.log("membership", membership);
    console.log("ReferralData", ReferralData);



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
                        `${BaseUrl}referredBy/get?referred_by=${value}`,
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
                        setReferralData(data.Response.Result);
                        setMembership(data.Response.Result[0]?.memberships.membership_name || '');
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


    




    const renderItem = (item, index) => {
        // const details = describeData[item.id] || [];

        return (
            <Animatable.View
                animation="zoomIn"
                duration={1000}
                delay={index * 100}
                useNativeDriver
            >
                {/* <View style={styles.card}>
                    <View style={{ width: wp(60), marginLeft: wp(4) }}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: wp(80) }}>
                            <Text style={styles.name}>{item.name}</Text>
                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', }}>
                                <Image
                                    source={require('../../assets/images/Referral/call.png')
                                    }
                                    style={styles.callimg}
                                    resizeMode="cover"
                                />
                                <Text style={styles.id}>{item.mobile}</Text>
                            </View>
                        </View>
        

                   
                        <Text style={styles.value}>Total Purchase Value :    <Text style={{ fontWeight: 'bold' }}>                 ₹ {item.total_purchase_value ? item.total_purchase_value : "0"}</Text></Text>

                        <View style={{ flexDirection: 'row' ,marginTop:hp(1)}}>
                            {
                                item.memberships == "" || item.memberships == null ?
                                    <></> :
                                    <Image
                                        source={require('../../assets/images/Profile/crown.png')
                                        }
                                        style={styles.crownimg}
                                        resizeMode="cover"
                                    />
                            }

          

                            <Text
                                style={[
                                    styles.premiumText,
                                    {
                                        color: item.memberships && item.memberships.length > 0 ? "#E2BE1D" : "#000",
                                        fontWeight:
                                            item.memberships && item.memberships.length > 0 && item.memberships[0].membership_name !== "FREE USER"
                                                ? "bold"
                                                : "normal",
                                    },
                                ]}
                            >
                                {
                                    item.memberships && item.memberships.length > 0
                                        ? item.memberships[0].membership_name === "PINCODE PARTNER COMMISSION"
                                            ? "PINCODE PARTNER"
                                            : item.memberships[0].membership_name === "DISTRICT PARTNER COMMISSION"
                                                ? "DISTRICT PARTNER"
                                                : item.memberships[0].membership_name === "CHANNEL PARTNER COMMISSION"
                                                    ? "CHANNEL PARTNER"
                                                    : item.memberships[0].membership_name
                                        : "FREE USER"
                                }
                            </Text>
                        </View>

                    </View>


                </View> */}




                <View style={styles.card}>
                    <View style={{ width: wp(60), marginLeft: wp(4) }}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: wp(80) }}>
                            <Text style={styles.name}>{item.name}</Text>

                            <View style={{ flexDirection: 'row' ,marginTop:hp(0)}}>
                            {
                                item.memberships == "" || item.memberships == null ?
                                    <></> :
                                    <Image
                                        source={require('../../assets/images/Profile/crown.png')
                                        }
                                        style={styles.crownimg}
                                        resizeMode="cover"
                                    />
                            }

                            {/* <Text style={[styles.premiumText, { color: item.memberships && item.memberships.length > 0 ? "#E2BE1D" : "#000" }]}> */}

                            <Text
                                style={[
                                    styles.premiumText,
                                    {
                                        color: item.memberships && item.memberships.length > 0 ? "#E2BE1D" : "#000",
                                        fontWeight:
                                            item.memberships && item.memberships.length > 0 && item.memberships[0].membership_name !== "FREE USER"
                                                ? "bold"
                                                : "normal",
                                    },
                                ]}
                            >
                                {
                                    item.memberships && item.memberships.length > 0
                                        ? item.memberships[0].membership_name === "PINCODE PARTNER COMMISSION"
                                            ? "PINCODE PARTNER"
                                            : item.memberships[0].membership_name === "DISTRICT PARTNER COMMISSION"
                                                ? "DISTRICT PARTNER"
                                                : item.memberships[0].membership_name === "CHANNEL PARTNER COMMISSION"
                                                    ? "CHANNEL PARTNER"
                                                    : item.memberships[0].membership_name
                                        : "FREE USER"
                                }
                            </Text>
                        </View>

                   
                        </View>
                        {/* <Text style={styles.id}>{item.memberships && item.memberships.length > 0 ? item.memberships[0].membership_name : 'No Membership'}</Text> */}

                   
                        <Text style={styles.value}>Total Purchase Value :    <Text style={{ fontWeight: 'bold' }}>                 ₹ {item.total_purchase_value ? item.total_purchase_value : "0"}</Text></Text>

             

                        {/* <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                <Image
                                    source={require('../../assets/images/Referral/call.png')
                                    }
                                    style={styles.callimg}
                                    resizeMode="cover"
                                />
                                <Text style={styles.id}>{item.mobile}</Text>
                            </View> */}

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

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(0) }}>
                        <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>REFERRAL</Text>
                    </TouchableOpacity>
                </View>
                {ReferralData == null ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center',height:hp(100),marginTop:hp(0) }}>
                        <ActivityIndicator size="small" color="#A6222C" />
                        <Text style={{ marginTop:hp(10), fontSize: 16, color: '#A6222C' }}>Please Wait Loading...</Text>
                    </View>
                ) : (
                <FlatList
                    data={ReferralData}
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

export default ReferralList

const styles = StyleSheet.create({
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
    card: {
        // backgroundColor: '#98fb9888',
        backgroundColor: '#fff',
        marginTop: hp(1),
        borderRadius: hp(1),
        padding: hp(1),
        width: wp(94),
        height: hp(9),
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
        marginTop: hp(0.5),

    },
    callimg: {
        width: hp(1.5),
        height: hp(1.5),
        marginTop: hp(1)
    },
})