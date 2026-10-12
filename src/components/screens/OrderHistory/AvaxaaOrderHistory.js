import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ToastAndroid, StatusBar, ScrollView, Modal, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from "@react-native-vector-icons/fontisto";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from "@react-native-vector-icons/ant-design";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@react-native-vector-icons/ant-design';
import SimpleLineIcons from '@react-native-vector-icons/ionicons';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';

const AvaxaaOrderHistory = ({ navigation }) => {

    const EncKey = encryptPiDataNew(Authentication_Key)

    const [storechoosed, setStorechoosed] = useState(true);
    const [dispatchModal, setDispatchModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dispatchModal1, setDispatchModal1] = useState(false);
    const [selectedItem1, setSelectedItem1] = useState(null);



    const AvaxaaDeals = ({ Details }) => {
        return (
            <View style={{ marginTop: hp(2) }}>
                <FlatList
                    data={Details}
                    nestedScrollEnabled={true}
                    keyExtractor={(item, index) => index + 1}
                    renderItem={({ item }) => {
                        const timestamp = item.order_created_at;
                        const date = new Date(timestamp);
                        const formattedDate = date
                            .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            .replace(/-/g, " / ");
                        return (
                            // <TouchableOpacity onPress={() => navigation.navigate('AvaxaaOrderDetails', { item: item.cart_details })} style={{ padding: hp(1), height: hp(12), width: wp(95), borderWidth: 1, borderColor: 'green', borderRadius: hp(2), alignSelf: 'center', marginVertical: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                            //     <View style={{ padding: hp(0.5), width: wp(35), justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', borderBottomLeftRadius: hp(1), borderBottomRightRadius: hp(1), alignSelf: 'center', position: 'absolute', top: 0 }}>
                            //         <Text style={{ color: '#fff' }}>Date: {formattedDate}</Text>
                            //     </View>
                            //     <Text style={{ color: '#000', fontSize: hp(2) }}>Order Id: {item.id}</Text>
                            //     <View style={{ padding: hp(0.2), width: wp(35), backgroundColor: 'green', borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), alignSelf: 'center', position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            //         <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '700' }}>₹ {item.bill_amount}</Text>
                            //     </View>
                            // </TouchableOpacity>

                            <TouchableOpacity onPress={() => { setSelectedItem(item); setDispatchModal(true) }} style={{ padding: hp(1), width: wp(95), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(1), alignSelf: 'center', marginVertical: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ padding: hp(0.5), width: wp(35), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderBottomLeftRadius: hp(0), borderBottomRightRadius: hp(1), borderTopLeftRadius: hp(1), position: 'absolute', top: 0, left: -1 }}>
                                    <Text style={{ color: '#fff' }}>{formattedDate}</Text>
                                </View>
                                <View style={{ padding: hp(0.5), width: wp(35), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderBottomLeftRadius: hp(1), borderBottomRightRadius: hp(0), borderTopRightRadius: hp(1), position: 'absolute', top: 0, right: -1 }}>
                                    <Text style={{ color: '#fff' }}>CashBack: <Text style={{ color: '#fff', fontWeight: '700', fontSize: hp(2) }}>₹ {item?.total_cashback_earned}</Text></Text>
                                </View>
                                <View style={{ width: wp(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: hp(3), }}>
                                    <Text style={{ color: '#000', fontSize: hp(2), padding: hp(1), marginTop: hp(0), fontWeight: '700' }}>Order Id: AV{item.id}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), padding: hp(1), marginTop: hp(0), fontWeight: '700' }}>{item.order_status_name}</Text>
                                </View>
                                {/* <Text style={{ color: '#000', fontSize: hp(2), padding: hp(1), width: wp(80), marginTop: hp(3), alignSelf: 'flex-start', fontWeight: '700' }}>Order Id: AV{item.id}</Text> */}

                                {
                                    item?.item_common_details == null ?
                                        <View style={{ padding: hp(1), marginBottom: hp(2) }}>
                                            <FlatList
                                                data={item?.cart_details}
                                                keyExtractor={(a, b) => b + 1}
                                                nestedScrollEnabled={true}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <View style={{ padding: hp(1), width: wp(90), borderRadius: hp(1), borderWidth: 1, borderColor: '#A6222C', marginVertical: hp(1), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                                            <Image source={{ uri: item?.item_common_details?.cover_img }} style={{ height: hp(10), width: hp(10), borderRadius: hp(1), resizeMode: 'contain' }} />
                                                            <View style={{ width: wp(60), }}>
                                                                <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '700' }}>{item?.item_common_details?.item_name}</Text>
                                                                <Text style={{ color: '#000', fontSize: hp(2) }}>Qty: {item?.no_of_units}</Text>
                                                                <View style={{ padding: hp(0.5), width: wp(20), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1), marginVertical: hp(1), elevation: 5 }}>
                                                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '700', }}>₹ {item.cost_per_unit}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </View>
                                        :
                                        <View style={{ height: hp(5) }}>
                                        </View>
                                }


                                <View style={{ padding: hp(0.2), width: wp(35), backgroundColor: '#A6222C', borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), alignSelf: 'center', position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '700' }}>₹ {item.bill_amount}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    }
                />
                {/* <Modal
                    animationType="slide"
                    transparent
                    visible={dispatchModal}
                    onRequestClose={() => {
                        setDispatchModal(!dispatchModal);
                    }}>
                    <>
                        <Pressable onPress={() => setDispatchModal(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(65), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }} onStartShouldSetResponder={(e) => e.stopPropagation()}>

                                <View style={{ width: wp(10), height: hp(0.75), backgroundColor: '#4aaa5c', alignSelf: 'center', marginTop: hp(1), borderRadius: hp(0.35) }}>

                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => setDispatchModal(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(3), marginTop: hp(2) }}>
                                        <SimpleLineIcons onPress={() => setDispatchModal(false)} name="close" size={24} color="gray" style={{}} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center' }}>SHIPPED ADDRESS</Text>

                                <View style={{ width: wp(85), height: hp(22), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>


                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.shipping_name : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.shipping_mobile : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.address1 : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.address2 : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.city_name : selectedItem}, {selectedItem ? selectedItem.state_name : selectedItem} - {selectedItem ? selectedItem.pincode : selectedItem}</Text>

                                </View>

                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center', marginTop: hp(5) }}>DISPATCH DETAILS</Text>

                                <View style={{ width: wp(85), height: hp(15), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>

                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Package Type :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem ? selectedItem.package_type : selectedItem}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Tracking ID  :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem ? selectedItem.tracking_id : selectedItem}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Remarks :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem ? selectedItem.remarks : selectedItem}</Text>
                                    </View>
                                 


                                </View>
                            </View>

                        </Pressable>
                    </>
                </Modal> */}

            </View >
        )
    }

    const PremiumDeals = ({ Details }) => {
        return (
            <View style={{ marginTop: hp(2) }}>
                <FlatList
                    data={Details}
                    nestedScrollEnabled={true}
                    keyExtractor={(item, index) => index + 1}
                    renderItem={({ item }) => {
                        const timestamp = item.order_created_at;
                        const date = new Date(timestamp);
                        const formattedDate = date
                            .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            .replace(/-/g, " / ");
                        return (
                            // <TouchableOpacity onPress={() => navigation.navigate('AvaxaaOrderDetails', { item: item.cart_details })} style={{ padding: hp(1), height: hp(12), width: wp(95), borderWidth: 1, borderColor: 'green', borderRadius: hp(2), alignSelf: 'center', marginVertical: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                            //     <View style={{ padding: hp(0.5), width: wp(35), justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', borderBottomLeftRadius: hp(1), borderBottomRightRadius: hp(1), alignSelf: 'center', position: 'absolute', top: 0 }}>
                            //         <Text style={{ color: '#fff' }}>Date: {formattedDate}</Text>
                            //     </View>
                            //     <Text style={{ color: '#000', fontSize: hp(2) }}>Order Id: {item.id}</Text>
                            //     <View style={{ padding: hp(0.2), width: wp(35), backgroundColor: 'green', borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), alignSelf: 'center', position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            //         <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '700' }}>₹ {item.bill_amount}</Text>
                            //     </View>
                            // </TouchableOpacity>

                            <TouchableOpacity onPress={() => { setSelectedItem1(item); setDispatchModal1(true) }} style={{ padding: hp(1), width: wp(95), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(1), alignSelf: 'center', marginVertical: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ padding: hp(0.5), width: wp(35), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderBottomLeftRadius: hp(0), borderBottomRightRadius: hp(1), borderTopLeftRadius: hp(1), position: 'absolute', top: 0, left: -1 }}>
                                    <Text style={{ color: '#fff' }}>{formattedDate}</Text>
                                </View>
                                <View style={{ padding: hp(0.5), width: wp(35), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderBottomLeftRadius: hp(1), borderBottomRightRadius: hp(0), borderTopRightRadius: hp(1), position: 'absolute', top: 0, right: -1 }}>
                                    <Text style={{ color: '#fff' }}>CashBack: <Text style={{ color: '#fff', fontWeight: '700', fontSize: hp(2) }}>₹ {item.total_cashback_earned}</Text></Text>
                                </View>

                                <View style={{ width: wp(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: hp(3), }}>
                                    <Text style={{ color: '#000', fontSize: hp(2), padding: hp(1), marginTop: hp(0), fontWeight: '700' }}>Order Id: PD{item.id}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), padding: hp(1), marginTop: hp(0), fontWeight: '700' }}>{item.order_status_name}</Text>
                                </View>

                                {/* <Text style={{ color: '#000', fontSize: hp(2), padding: hp(1), width: wp(80), marginTop: hp(3), alignSelf: 'flex-start', fontWeight: '700' }}>Order Id:PD{item.id}</Text> */}

                                <View style={{ padding: hp(1), marginBottom: hp(2) }}>
                                    <FlatList
                                        data={item?.cart_details}
                                        keyExtractor={(a, b) => b + 1}
                                        nestedScrollEnabled={true}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={{ padding: hp(1), width: wp(90), borderRadius: hp(1), borderWidth: 1, borderColor: '#A6222C', marginVertical: hp(1), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                                    <Image source={{ uri: item?.item_common_details?.cover_img }} style={{ height: hp(10), width: hp(10), borderRadius: hp(1), resizeMode: 'contain' }} />
                                                    <View style={{ width: wp(60), }}>
                                                        <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '700' }}>{item?.item_common_details?.item_name}</Text>
                                                        <Text style={{ color: '#000', fontSize: hp(2) }}>Qty: {item?.no_of_units}</Text>
                                                        <View style={{ padding: hp(0.5), width: wp(20), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1), marginVertical: hp(1), elevation: 5 }}>
                                                            <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '700', }}>₹ {item?.cost_per_unit}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </View>

                                <View style={{ padding: hp(0.2), width: wp(35), backgroundColor: '#A6222C', borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), alignSelf: 'center', position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '700' }}>₹ {item.bill_amount}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    }
                />
                {/* <Modal
                    animationType="slide"
                    transparent
                    visible={dispatchModal1}
                    onRequestClose={() => {
                        setDispatchModal1(!dispatchModal1);
                    }}>
                    <>
                        <Pressable onPress={() => setDispatchModal1(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(65), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }} onStartShouldSetResponder={(e) => e.stopPropagation()}>

                                <View style={{ width: wp(10), height: hp(0.75), backgroundColor: '#4aaa5c', alignSelf: 'center', marginTop: hp(1), borderRadius: hp(0.35) }}>

                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => setDispatchModal1(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(3), marginTop: hp(2) }}>
                                        <SimpleLineIcons onPress={() => setDispatchModal1(false)} name="close" size={24} color="gray" style={{}} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center' }}>SHIPPED ADDRESS</Text>

                                <View style={{ width: wp(85), height: hp(22), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>


                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.shipping_name : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.shipping_mobile : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.address1 : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.address2 : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.city_name : selectedItem1}, {selectedItem1 ? selectedItem1.state_name : selectedItem1} - {selectedItem1 ? selectedItem1.pincode : selectedItem1}</Text>

                                </View>

                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center', marginTop: hp(5) }}>DISPATCH DETAILS</Text>

                                <View style={{ width: wp(85), height: hp(15), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>

                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Package Type :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem1 ? selectedItem1.package_type : selectedItem1}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Tracking ID  :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem1 ? selectedItem1.tracking_id : selectedItem1}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Remarks :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem1 ? selectedItem1.remarks : selectedItem1}</Text>
                                    </View>
                            


                                </View>
                            </View>

                        </Pressable>
                    </>
                </Modal> */}
            </View>
        )
    }

    const [Details, setDetails] = useState(null);

    const getDetails = async (type) => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                try {
                    const response = await fetch(`${BaseUrl}orderGet?uId=${value}&type=${type ? type : 'A'}`, {
                        method: 'GET',
                        headers: { "authentication": EncKey }
                    });
                    response.json()
                        .then(responseData => {
                            //console.log(responseData);
                            if (responseData.Response.Success == 1) {
                                setDetails(responseData.Response.Result);
                            }
                            else {
                                setDetails(null);
                            }
                        })
                } catch (error) {
                    console.error('Fetch error:', error.message);
                }
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
    }

    useEffect(() => {
        getDetails();
    }, [])


    return (
        // <SafeAreaView style={{ height: hp(100), width: wp(100) }} >
        //     <View style={{ height: hp(6), width: wp(100), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: 'green' }}>
        //         <TouchableOpacity onPress={() => navigation.navigate('AvaxaaItemget')} style={{ width: wp(50), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        //             <Fontisto name="angle-left" size={hp(2)} color="#fff" style={{}} />
        //             <Text style={{ color: '#fff', fontSize: hp(2) }}>    AVAXAA Order History</Text>
        //         </TouchableOpacity>
        //     </View>

        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(3) }}>
                        <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>ORDER HISTORY</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: hp(2), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { setStorechoosed(true); getDetails('A') }} style={{ padding: hp(1), width: wp(45), backgroundColor: storechoosed ? '#A6222C' : '#fff', borderRadius: hp(1), borderWidth: 1, borderColor: '#A6222C', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: storechoosed ? '#fff' : '#A6222C', fontSize: hp(2) }}>Avaxaa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setStorechoosed(false); getDetails('P') }} style={{ padding: hp(1), width: wp(45), backgroundColor: !storechoosed ? '#A6222C' : '#fff', borderRadius: hp(1), borderWidth: 1, borderColor: '#A6222C', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: !storechoosed ? '#fff' : '#A6222C', fontSize: hp(2) }}>Premium Deals</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        storechoosed ? (
                            <AvaxaaDeals
                                Details={Details}
                            />
                        ) : (
                            <PremiumDeals
                                Details={Details}
                            />
                        )
                    }

                    <View style={{ width: wp(100), height: hp(5) }}></View>
                </ScrollView>

                {/* ====================================================== Modal for Basic Details =========================================================================================================================================================================== */}
                {/* <Modal
                    animationType="slide"
                    transparent
                    visible={dispatchModal}
                    onRequestClose={() => {
                        setDispatchModal(!dispatchModal);
                    }}>
                    <>
                        <Pressable onPress={() => setDispatchModal(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(75), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }} onStartShouldSetResponder={(e) => e.stopPropagation()}>

                                <View style={{ width: wp(10), height: hp(0.75), backgroundColor: '#4aaa5c', alignSelf: 'center', marginTop: hp(1), borderRadius: hp(0.35) }}>

                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => setDispatchModal(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(3), marginTop: hp(2) }}>
                                        <SimpleLineIcons onPress={() => setDispatchModal(false)} name="close" size={24} color="gray" style={{}} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center' }}>SHIPPED ADDRESS</Text>



                            </View>

                        </Pressable>
                    </>
                </Modal> */}


                <Modal
                    animationType="fade"
                    transparent
                    visible={dispatchModal}
                    onRequestClose={() => {
                        setDispatchModal(!dispatchModal);
                    }}>
                    <>
                        <Pressable onPress={() => setDispatchModal(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(65), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }} onStartShouldSetResponder={(e) => e.stopPropagation()}>

                                <View style={{ width: wp(10), height: hp(0.75), backgroundColor: '#4aaa5c', alignSelf: 'center', marginTop: hp(1), borderRadius: hp(0.35) }}>

                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => setDispatchModal(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(3), marginTop: hp(2) }}>
                                        <SimpleLineIcons onPress={() => setDispatchModal(false)} name="close" size={24} color="gray" style={{}} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center' }}>SHIPPED ADDRESS</Text>

                                <View style={{ width: wp(85), height: hp(22), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>


                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.shipping_name : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.shipping_mobile : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.address1 : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.address2 : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem ? selectedItem.city_name : selectedItem}, {selectedItem ? selectedItem.state_name : selectedItem} - {selectedItem ? selectedItem.pincode : selectedItem}</Text>

                                </View>

                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center', marginTop: hp(5) }}>DISPATCH DETAILS</Text>

                                <View style={{ width: wp(85), height: hp(15), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>

                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Package Type :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem ? selectedItem.package_type : selectedItem}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Tracking ID  :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem ? selectedItem.tracking_id : selectedItem}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Remarks :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem ? selectedItem.remarks : selectedItem}</Text>
                                    </View>
                                    {/* <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Package Type : {selectedItem ? selectedItem.package_type : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Tracking ID : {selectedItem ? selectedItem.tracking_id : selectedItem}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Remarks : {selectedItem ? selectedItem.remarks : selectedItem}</Text> */}


                                </View>
                            </View>

                        </Pressable>
                    </>
                </Modal>


                <Modal
                    animationType="fade"
                    transparent
                    visible={dispatchModal1}
                    onRequestClose={() => {
                        setDispatchModal1(!dispatchModal1);
                    }}>
                    <>
                        <Pressable onPress={() => setDispatchModal1(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(65), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }} onStartShouldSetResponder={(e) => e.stopPropagation()}>

                                <View style={{ width: wp(10), height: hp(0.75), backgroundColor: '#4aaa5c', alignSelf: 'center', marginTop: hp(1), borderRadius: hp(0.35) }}>

                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => setDispatchModal1(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(3), marginTop: hp(2) }}>
                                        <SimpleLineIcons onPress={() => setDispatchModal1(false)} name="close" size={24} color="gray" style={{}} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center' }}>SHIPPED ADDRESS</Text>

                                <View style={{ width: wp(85), height: hp(22), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>


                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.shipping_name : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.shipping_mobile : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.address1 : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.address2 : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> {selectedItem1 ? selectedItem1.city_name : selectedItem1}, {selectedItem1 ? selectedItem1.state_name : selectedItem1} - {selectedItem1 ? selectedItem1.pincode : selectedItem1}</Text>

                                </View>

                                <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center', marginTop: hp(5) }}>DISPATCH DETAILS</Text>

                                <View style={{ width: wp(85), height: hp(15), borderRadius: hp(2), justifyContent: 'center', alignItems: 'flex-start', shadowColor: '#A6222C', shadowOpacity: 0.1, shadowRadius: 5, elevation: 8, backgroundColor: '#fff', alignSelf: 'center', marginTop: hp(2) }}>

                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Package Type :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem1 ? selectedItem1.package_type : selectedItem1}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Tracking ID  :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem1 ? selectedItem1.tracking_id : selectedItem1}</Text>
                                    </View>
                                    <View style={{ width: wp(80), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Remarks :</Text>
                                        <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}>{selectedItem1 ? selectedItem1.remarks : selectedItem1}</Text>
                                    </View>
                                    {/* <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Package Type : {selectedItem1 ? selectedItem.package_type : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Tracking ID : {selectedItem1 ? selectedItem.tracking_id : selectedItem1}</Text>
                                    <Text style={{ color: '#000', fontSize: hp(2), marginTop: hp(1), marginLeft: wp(3) }}> Remarks : {selectedItem1 ? selectedItem.remarks : selectedItem1}</Text> */}


                                </View>
                            </View>

                        </Pressable>
                    </>
                </Modal>



            </View>
        </>
    )
}

export default AvaxaaOrderHistory



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

})