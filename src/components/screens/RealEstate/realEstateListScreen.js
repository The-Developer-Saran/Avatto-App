import { BackHandler, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RealEstateListScreen = ({ navigation }) => {

    const [propertiesList, setPropertiesList] = useState([]);
    const isFocused = useIsFocused();
    const [Uid, setUid] = useState(null);
    const [imageSource, setImageSource] = useState(require('../../assets/images/Login/avatto_logo.png'));
console.log("Uid=====>",Uid);

    const EncKey = encryptPiDataNew(Authentication_Key)

    const getPropertiesListApi = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                setUid(value)
                try {
                    const res = await axios.get(
                        `${BaseUrl}getrealestate?screen_type=M`,
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                authentication: EncKey,
                            },
                        }
                    );
                    console.log(res.data);
                    if (res.data.Response?.Success === "1") {
                        setPropertiesList(res.data.Response.Result);
                    } else {
                        console.log("No data found");
                        setPropertiesList([]);
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
    }, [BaseUrl, EncKey]);

    useEffect(() => {
        if (isFocused) {
            getPropertiesListApi();
        }
    }, [isFocused]);

    // const gotoNextScreen = useCallback((item) => {
    //     navigation.navigate('PropertyDetailsScreen', { item: item , UserId : Uid});
    // }, [navigation]);

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==

    // const handleBackButtonClick = useCallback(() => {
    //     navigation.goBack();
    //     return true;
    // }, [navigation]);

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    //     return () => {
    //         BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    //     };
    // }, [handleBackButtonClick]);

    return (
        <View style={styles.container}>
           <StatusBar  backgroundColor='#A6222C' barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Footer")}>
                    <AntDesign onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>REAL ESTATE</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={propertiesList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#888', fontWeight: '400', marginTop: hp(5) }}>No records found</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() =>  navigation.navigate('PropertyDetailsScreen', { item: item , UserId : Uid})} style={styles.propertyCard}>
                        <View style={styles.propertyContent}>
                            <Image source={item.cover_image ? { uri: item.cover_image } : require('../../assets/images/Login/avatto_logo.png')} style={styles.propertyImage} />
   
                            <View style={styles.propertyInfo}>
                                <Text style={styles.propertyTitle}>{item.title}</Text>
                                <Text style={styles.propertyPrice}>₹ {item.price}</Text>
                                <Text style={styles.propertyAddress}>{item.address}</Text>
                            </View>
                        </View>
                        <View style={styles.arrowButton}>
                            <AntDesign name="right" size={22} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default RealEstateListScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', padding: hp(1.5), height: hp(10) },
    headerButton: { flexDirection: 'row', marginTop: hp(3.5) },
    headerIcon: { marginTop: hp(0) },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(0), marginLeft: wp(5) },
    propertyCard: {
        width: wp(90),
        backgroundColor: '#e0c7c9',
        borderRadius: hp(1),
        padding: hp(1),
        marginVertical: hp(1),
        alignSelf: 'center',
        elevation: 3,
        shadowColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    propertyContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    propertyImage: {
        width: hp(13),
        height: hp(13),
        borderRadius: hp(1),
        resizeMode: 'contain',
        backgroundColor: '#888'
    },
    propertyInfo: {
        marginLeft: hp(1),
        width: wp(45)
    },
    propertyTitle: {
        color: '#000',
        fontWeight: '600',
        fontSize: hp(1.8)
    },
    propertyPrice: {
        color: '#000',
        fontWeight: '400',
        marginVertical: hp(0.5)
    },
    propertyAddress: {
        color: '#000',
        fontWeight: '400'
    },
    arrowButton: {
        padding: hp(2),
        backgroundColor: '#A6222C',
        marginRight: wp(-2),
        borderTopLeftRadius: hp(2),
        borderBottomLeftRadius: hp(2)
    }
});
