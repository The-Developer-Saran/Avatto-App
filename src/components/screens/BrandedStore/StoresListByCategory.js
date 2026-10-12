import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, StatusBar, Modal, Pressable, BackHandler } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SearchBar } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import FontAwesome from '@react-native-vector-icons/fontawesome';


const Tab = createMaterialTopTabNavigator();

export default function StoresListByCategory({ navigation }) {

    const EncKey = encryptPiDataNew(Authentication_Key)

    const [modalForSearch, setModalForSearch] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [VData, setVData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [masterData, setMasterData] = useState([]);


    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                setModalVisible(true);
                return true;
            };

            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

            return () => backHandler.remove();
        }, [])
    );


    const storesList = useCallback(async () => {
        try {
            const res = await axios.get(
                `${BaseUrl}brand_getcategory`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        authentication: EncKey,
                    },
                },
            );
            const response = res.data;
            console.log(response);
            if (response.Response.Success == "1") {
                const decryptedData = response.Response.Result;
                setVData(decryptedData);
                setMasterData(decryptedData[0]?.brandlist || []);
            }
            else {
                console.log(response.Response.Message);
                setVData([]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [BaseUrl, EncKey]);

    useEffect(() => {
        storesList();
    }, []);

    const gotoBrandDetails = (brandId) => {
        setModalForSearch(false);
        navigation.navigate('BrandDetailsScreen', { brandId });
    };

    const searchFilterFunction = (text) => {
        if (!text) {
            setFilteredData(masterData);
            setSearch('');
            return;
        }
        const filtered = masterData.filter(item =>
            item.BrandName?.toUpperCase().includes(text.toUpperCase())
        );
        setFilteredData(filtered);
        setSearch(text);
    };

    const YourScreenComponent = ({ route }) => {
        const voucher = route.params.item || [];
        //console.log(voucher);
        return (
            <FlatList
                numColumns={2}
                keyExtractor={(item, index) => item.voucher_brands_id.toString() || index.toString()}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>No records found</Text>
                </View>}
                showsVerticalScrollIndicator={false}
                data={voucher}
                contentContainerStyle={{ flexGrow: 1, alignSelf: 'center' }}
                renderItem={({ item, index }) => (
                    <View style={styles.voucherContainer}>
                        <TouchableOpacity onPress={() => gotoBrandDetails(item.voucher_brands_id)}>
                            {item.BrandImage ? (
                                <Image
                                    source={{ uri: item.BrandImage }}
                                    resizeMode='contain'
                                    style={styles.voucherImage}
                                    onError={() => console.log(`Error loading image: ${item.BrandImage}`)}
                                />
                            ) : (
                                <ActivityIndicator size="large" color="#A6222C" style={{ flex: 1 }} />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: "#fff" }]}>
            <StatusBar  backgroundColor='#A6222C' barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={styles.headerButton}>
                    <AntDesign onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>BRANDED STORES</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('MyVouchers')} style={{width:wp(15),height:hp(4),borderRadius:hp(3),backgroundColor:"#fff",justifyContent:'center',alignItems:'center'}}>
       <Image
                                source={require('../../assets/images/Referral/coupon.png')}
                                style={{width:hp(5),height:hp(5)}}
                                resizeMode="cover"
                            />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalForSearch(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: hp(0.5), borderRadius: hp(1), paddingHorizontal: hp(2) }}>
                    <AntDesign name="search" size={hp(2)} color="#000" style={{}} />
                    <Text style={{ color: '#000', fontSize: hp(2), marginLeft: hp(1) }}>Search</Text>
                </TouchableOpacity>
            </View>
            {/* <NavigationContainer independent={true}> */}
            {VData.length === 0 ? (
                <ActivityIndicator size="large" color="#A6222C" style={{ flex: 1 }} />
            ) : (
                <Tab.Navigator
                    screenOptions={{
                        tabBarScrollEnabled: true,
                        tabBarBounces: true,
                        tabBarActiveTintColor: "#fff",
                        tabBarInactiveTintColor: "#fff",
                        tabBarIndicatorStyle: styles.tabIndicator,
                        tabBarStyle: { backgroundColor: '#A6222C' },
                        tabBarLabelStyle: { fontWeight: '700' },
                    }}
                >
                    {VData.map((item, index) => (
                        <Tab.Screen
                            name={item.Category_name}
                            component={YourScreenComponent}
                            key={index}
                            initialParams={{ item: item.brandlist }}
                        />
                    ))}
                </Tab.Navigator>
            )}
            {/* </NavigationContainer> */}
            <Modal
                animationType="slide"
                transparent
                visible={modalForSearch}
                onRequestClose={() => {
                    setModalForSearch(false);
                }}>
                <Pressable onPress={() => setModalForSearch(false)} style={{ flex: 1, }}>
                    <TouchableWithoutFeedback onPress={() => setModalForSearch(true)}>
                        <View style={{ backgroundColor: "#ececec", flex: 1, }}>
                            <SearchBar
                                searchIcon={{ size: hp(3), }}
                                onChangeText={(text) => searchFilterFunction(text)}
                                onClear={() => searchFilterFunction('')}
                                placeholder="Search your favourite brand"
                                value={search}
                                autoCapitalize={'characters'}
                                keyboardType='default'
                                containerStyle={{ justifyContent: 'center', alignItems: 'center', borderRadius: hp(1), width: wp(95), alignSelf: 'center', height: hp(6), marginTop: hp(2), marginBottom: hp(1) }}
                                inputContainerStyle={{ backgroundColor: '#fff' }}
                                inputStyle={{ color: '#000' }}
                            />
                            <FlatList
                                data={filteredData.length == 0 ? masterData : filteredData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index + 1}
                                contentContainerStyle={{ flexGrow: 1, alignSelf: 'center', }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => gotoBrandDetails(item.voucher_brands_id)} style={{ borderWidth: 1, borderColor: '#444', marginVertical: hp(0.5), backgroundColor: "#fff", width: wp(90), alignSelf: 'center', borderRadius: hp(0.5), flexDirection: 'row', alignItems: 'center', shadowColor: '#000', elevation: 4 }}>
                                        <View style={{ height: hp(6), width: hp(8), justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: hp(0.5), borderBottomLeftRadius: hp(0.5), backgroundColor: '#fff' }}>
                                            <Image source={{ uri: item.BrandImage }} style={{ resizeMode: 'contain', height: hp(5), width: hp(8), }} />
                                        </View>
                                        <Text style={{ color: "#000", fontSize: hp(2), fontWeight: '400', marginLeft: wp(5) }}>{item.BrandName}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </Pressable>
            </Modal>


            {/* Custom Green-Themed Alert Modal */}
            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <FontAwesome name="exclamation-circle" size={50} color="#A6222C" />
                        <Text style={styles.modalTitle}>Hold on!</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to go back?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('Footer');
                                }}
                            >
                                <Text style={styles.confirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', padding: hp(1.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerButton: { flexDirection: 'row', marginTop: hp(0) },
    headerIcon: { marginTop: hp(0) },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(0), marginLeft: wp(5) },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    clockIcon: { height: rh(4), width: rh(4), marginRight: rw(2) },
    tabIndicator: { backgroundColor: "#fff", height: 4, borderRadius: 2, shadowColor: "#000", elevation: 5 },
    voucherContainer: { backgroundColor: '#fff', borderRadius: rh(1), margin: rh(1), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    discountTag: { height: rh(3), width: rw(15), position: "absolute", top: -rh(0.25), left: -rw(1) },
    discountText: { color: "#fff", fontWeight: "600", fontSize: rh(1.2) },
    voucherImage: { height: rh(12), width: rw(43), borderRadius: 10 },
    modalContainer: { backgroundColor: '#0d0d0d', flex: 0.8, marginTop: 'auto' },
    modalHeader: { height: rh(8), flexDirection: 'row', alignItems: 'center' },
    modalTitle: { color: 'grey', marginLeft: rw(2), fontSize: rf(2.5) },
    searchContainer: { width: rw(90), alignSelf: 'center' },
    searchBar: { backgroundColor: '#fcb713', borderRadius: rh(1) },
    searchInput: { backgroundColor: '#fff' },
    searchResult: { padding: rh(2), backgroundColor: '#000', width: rw(90), alignSelf: 'center', borderRadius: rh(1) },
    searchResultText: { color: 'grey', fontSize: rf(2) },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalBox: {
        width: wp(80),
        backgroundColor: "#fff",
        padding: hp(3),
        borderRadius: 15,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        color: "#A6222C",
        marginTop: hp(1),
    },
    modalMessage: {
        fontSize: hp(2),
        textAlign: "center",
        color: "#333",
        marginTop: hp(1),
    },
    modalButtonContainer: {
        flexDirection: "row",
        marginTop: hp(3),
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        width: "45%",
        paddingVertical: hp(1.5),
        borderRadius: 10,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    cancelText: {
        color: "#333",
        fontWeight: "bold",
    },
    confirmButton: {
        backgroundColor: "#A6222C",
    },
    confirmText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
