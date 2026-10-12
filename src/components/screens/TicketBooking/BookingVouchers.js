import React, { useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image, FlatList,StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import AsyncStorage from '@react-native-async-storage/async-storage';



const BookingVouchers = ({ navigation }) => {

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);

    const EncKey = encryptPiDataNew(Authentication_Key)


    useEffect(() => {
        console.log("Component mounted or focused");
        handleAllBrands();
    }, []);



    const handleAllBrands = async () => {
        console.log("===============================================================================================================================================================");
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                let data = JSON.parse(value);
                try {
                    const response = await fetch(`${BaseUrl}voucher_purchase/get?user_id=${value}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "authentication": EncKey
                        },
                    });

                    console.log("Response Status:", response.status);  // Check status code
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const responseData = await response.json();
                    console.log("BRAND LIST:", responseData.Response.Result);

                    if (responseData?.Response?.Success == '1') {
                        setResult(responseData.Response.Result);
                    } else {
                        console.error("Nearby Brands list Error:", responseData?.Response?.Message || "Unknown error");
                    }
                } catch (error) {
                    console.error('Fetch error:', error.message);
                }
            } else {
              console.log("error");
              
            }
            // }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar  backgroundColor='#0000' />
            <View style={styles.container}>
            
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("TravelListByCategory")} style={{ flexDirection: 'row', marginTop: hp(1) }}>
                        <Icon onPress={() => navigation.navigate("TravelListByCategory")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
                        <Text onPress={() => navigation.navigate("TravelListByCategory")} style={styles.headerText}>My Vouchers</Text>
                    </TouchableOpacity>

                </View>


                {loading ? (
                    <View style={styles.loaderDiv}>
                
                        <LottieView
                            source={require('../../assets/json/loader.json')}
                            style={{
                                alignSelf: "center",
                                width: wp(100),
                                height: hp(20),
                                marginBottom: hp(-4),
                                backgroundColor: '#fff'
                            }} autoPlay loop
                        />
                    </View>
                ) : (
                    <ScrollView>
                        <FlatList
                            data={result}
                            renderItem={({ item, index }) => {

                                const date = new Date(item.card_valid_till);

                                // Format to DD /MM /YYYY using UTC to avoid local timezone shift
                                const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
                                return (
                                    <View key={index}>
                                        <View style={styles.card}>
                                        
                                            <View style={styles.imageContainer}>
                                     
                                                <Image
                                                    key={index}
                                                    source={{ uri: item.BrandImage }}
                                                    style={styles.cardImage}
                                                />
                                            </View>
                                            <View style={{ width: wp(70), height: hp(14), justifyContent: 'center' }}>
                                                <View style={{ width: wp(70), flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.brandContent}>{item.BrandName}</Text>
                                                    <Text style={[styles.brandContent, { marginRight: wp(3) }]}>₹ {item.actual_amt}</Text>
                                                </View>

                                                <Text style={styles.brandSubContent}>{item.card_number}</Text>
                                                <Text style={styles.brandSubContent}>Purchase Date: {item.created_at}</Text>
                                                <Text style={styles.brandSubContent}>Valid Till: {formattedDate}</Text>

                                            </View>



                                        </View>
                                    </View>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={
                                <View style={styles.noUpcomingYet}>
                                    <Text style={styles.noUpcomingYetTxt}>No data found</Text>
                                </View>
                            }
                        />
                    </ScrollView>
                )}
            </View>
        </>
    )
}

export default BookingVouchers

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
    loaderDiv: {
        height: hp(90),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    card: {
        width: wp(95),
        height: hp(14),
        marginVertical: hp(0.5),
        marginTop:hp(1),
        borderRadius: hp(2),
        elevation: 5,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: hp(1),
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    imageContainer: {
        position: 'relative',
        width: hp(10),
        height: hp(10),
        borderRadius: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        width: hp(10),
        height: hp(10),
        resizeMode: 'cover',
        borderRadius: hp(1),
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    brandContent: {
        fontSize: hp(2.2),
        color: '#000',
        marginLeft: hp(2),
        fontWeight: '700',
        // marginLeft: hp(3),

    },
    brandSubContent: {
        fontSize: hp(1.8),
        color: '#454545',
        marginLeft: hp(2),
        fontWeight: '700',
        // marginLeft: hp(3),
        marginTop: hp(0.5)
    },
    SubContent: {
        fontSize: hp(1.8),
        color: '#000',
        marginLeft: hp(2),
        // fontWeight: '700',
        marginLeft: hp(3),
    },

    noUpcomingYet: {
        width: wp(90),
        marginVertical: hp(1),
        borderRadius: hp(2),
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: hp(1),
        alignSelf: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(2),
        paddingHorizontal: hp(3)
    },
    noUpcomingYetTxt: {
        color: 'gray',
        alignSelf: 'center',
        textAlign: 'center',
    },
})