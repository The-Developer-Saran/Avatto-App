import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, FlatList, ToastAndroid, StatusBar, BackHandler } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import AntDesign from '@react-native-vector-icons/ant-design';
import Icon from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ALERT_TYPE, Toast, AlertNotificationRoot } from 'react-native-alert-notification';
import Toast from 'react-native-toast-message';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';



// =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Personal Information Component =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
const PersonalInformation = ({ Name, setName, Mobile, setMobile, Email, setEmail, Pan, setPan, Address1, setAddress1, Address2, setAddress2, city, setCity, CityId, setCityId, District, setDistrict, State, setState, StateId, setStateId, Pincode, setPincode, UpdateUserDetails }) => {

    const [stateAccordian, setStateAccordian] = useState(false);
    const [cityAccordian, setCityAccordian] = useState(false);
    const [stateArr, setStateArr] = useState(null);
    const [cityArr, setCityArr] = useState(null);

    const EncKey = encryptPiDataNew(Authentication_Key)


    // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= get State =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    const getState = async () => {
        const response = await fetch(`${BaseUrl}stateGet?type=M&req_type=1&res_type=1`, {
            method: 'GET',
            headers: { "authentication": EncKey }
        });

        response.json()
            .then(responseData => {
                // console.log(responseData);
                if (responseData.Response.Success == 1) {
                    setStateArr(responseData.Response.Result);
                }
                else {

                }
            })
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });
    }
    // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= get City =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    const getCity = async (id) => {
        const response = await fetch(`${BaseUrl}cityGet?stateId=${id}&type=M&req_type=1&res_type=1`, {
            method: 'GET',
            headers: { "authentication": EncKey }
        });

        response.json()
            .then(responseData => {
                // console.log(responseData);
                if (responseData.Response.Success == 1) {
                    setCityArr(responseData.Response.Result);
                }
                else {

                }
            })
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });
    }

    useEffect(() => {
        getState();
    }, [])




    return (
        <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
                <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Personal Information</Text>
                <TextInput
                    mode="outlined"
                    label="Name"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Your name"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={Name}
                    onChangeText={(value) => setName(value)}
                />
                <TextInput
                    mode="outlined"
                    label="Mobile"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Mobile Number"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="numeric"
                    value={Mobile}
                    onChangeText={(value) => setMobile(value)}
                    editable={false}
                />
                <TextInput
                    mode="outlined"
                    label="Email"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Email ID"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="email-address"
                    value={Email}
                    onChangeText={(value) => setEmail(value)}
                />
                <TextInput
                    mode="outlined"
                    label="PAN"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="PAN"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={Pan}
                    onChangeText={(value) => setPan(value)}
                />
                <View style={{ height: hp(1.5) }}></View>
            </View>
            <View style={{ height: hp(3) }}></View>


            <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
                <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Address</Text>
                <TextInput
                    mode="outlined"
                    label="Address Line 1"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Address"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={Address1}
                    onChangeText={(value) => setAddress1(value)}
                />


                <TextInput
                    mode="outlined"
                    label="Address Line 2"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Address"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={Address2}
                    onChangeText={(value) => setAddress2(value)}
                />
                {/* <TouchableOpacity onPress={() => setStateAccordian(!stateAccordian)} style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(0.5), alignSelf: 'center', marginTop: hp(2.5) }}>
                    <Text style={{ color: '#000', fontSize: hp(1.7) }}>{State ? State : 'Select State'}</Text>
                    <AntDesign name={stateAccordian ? 'caretright' : 'caretdown'} size={hp(2.5)} color={'#A6222C'} style={{}} />
                </TouchableOpacity>
                {
                    stateAccordian && stateArr ?
                        <View style={{ height: hp(23), padding: hp(1), width: wp(90), marginTop: hp(2), backgroundColor: '#f7f9f9', elevation: 5 }}>
                            <FlatList
                                data={stateArr}
                                nestedScrollEnabled
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index + 1}
                                renderItem={({ item }) => {
                                    console.log(item);

                                    return (
                                        <TouchableOpacity onPress={() => { setState(item.title); setStateId(item.id); getCity(item.id); setStateAccordian(false) }} style={{ padding: hp(1), width: wp(80), alignSelf: 'center', borderWidth: 0, marginTop: hp(1), borderRadius: hp(1), backgroundColor: '#fff', elevation: 5 }}>
                                            <Text>{item.title}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                        :
                        <></>

                } */}


                <TextInput
                    mode="outlined"
                    label="Pincode"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Pincode"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="numeric"
                    value={Pincode}
                    onChangeText={(value) => setPincode(value)}
                    editable={false}
                />


                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(0.5), alignSelf: 'center', marginTop: hp(2.5) }}>
                    <Text style={{ color: '#000', fontSize: hp(1.7), marginLeft: wp(2) }}>{city ? city : "City"}</Text>
                    {/* <AntDesign name={cityAccordian ? 'caretright' : 'caretdown'} size={hp(2.5)} color={'#A6222C'} style={{}} /> */}
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(0.5), alignSelf: 'center', marginTop: hp(2.5) }}>
                    <Text style={{ color: '#000', fontSize: hp(1.7), marginLeft: wp(2) }}>{State ? State : 'State'}</Text>
                    {/* <AntDesign name={stateAccordian ? 'caretright' : 'caretdown'} size={hp(2.5)} color={'#A6222C'} style={{}} /> */}
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => setCityAccordian(!cityAccordian)} style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(0.5), alignSelf: 'center', marginTop: hp(2.5) }}>
                    <Text style={{ color: '#000', fontSize: hp(1.7) }}>{city ? city : 'Select city'}</Text>
                    <AntDesign name={cityAccordian ? 'caretright' : 'caretdown'} size={hp(2.5)} color={'#A6222C'} style={{}} />
                </TouchableOpacity>
                {
                    cityAccordian && cityArr ?
                        <View style={{ height: hp(23), padding: hp(1), width: wp(90), marginTop: hp(2), backgroundColor: '#f7f9f9', elevation: 5 }}>
                            <FlatList
                                data={cityArr}
                                nestedScrollEnabled
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index + 1}
                                renderItem={({ item }) => {
                                    console.log(item);

                                    return (
                                        <TouchableOpacity onPress={() => { setCity(item.city_name); setCityId(item.id); setCityAccordian(false) }} style={{ padding: hp(1), width: wp(80), alignSelf: 'center', borderWidth: 0, marginTop: hp(1), borderRadius: hp(1), backgroundColor: '#fff', elevation: 5 }}>
                                            <Text>{item.city_name}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                        :
                        <></>

                } */}




                <View style={{ height: hp(1.5) }}></View>
            </View>
            <TouchableOpacity onPress={() => UpdateUserDetails()} style={{ padding: hp(1), width: wp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1), marginTop: hp(2), alignSelf: 'center' }}>
                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: 'bold' }}>Update</Text>
            </TouchableOpacity>
            <View style={{ height: hp(30) }}></View>

        </ScrollView>
    );
};

// =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Bank Details Component =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
const BankDetails = ({ AccountName, setAccountName, AccountNumber, setAccountNumber, BankName, setBankName, Branch, setBranch, IFSCCode, setIFSCCode, UpdateBankDetails }) => {

    return (
        <ScrollView>
            <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
                <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Bank Details</Text>

                <TextInput
                    mode="outlined"
                    label="Account Name"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Account Name"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={AccountName}
                    onChangeText={(value) => setAccountName(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Account Number"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Account Number"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="numeric"
                    value={AccountNumber}
                    onChangeText={(value) => setAccountNumber(value)}
                />


                <TextInput
                    mode="outlined"
                    label="Bank Name"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Bank Name"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={BankName}
                    onChangeText={(value) => setBankName(value)}
                />

                <TextInput
                    mode="outlined"
                    label="IFSC Code"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="IFSC Code"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
                        marginTop: hp(2),
                        alignSelf: "center",
                    }}
                    contentStyle={{ color: "#000", height: hp(5.5) }}
                    outlineStyle={{
                        backgroundColor: "transparent",
                        borderColor: "#A6222C",
                        borderRadius: 5,
                        borderWidth: 1.2,
                    }}
                    activeOutlineColor="#A6222C"
                    cursorColor="#A6222C"
                    keyboardType="ascii-capable"
                    value={IFSCCode}
                    onChangeText={(value) => setIFSCCode(value)}
                    maxLength={11}
                />
                <View style={{ height: hp(1.5) }}></View>
            </View>

            <TouchableOpacity onPress={() => UpdateBankDetails()} style={{ padding: hp(1), width: wp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1), marginTop: hp(2), alignSelf: 'center' }}>
                <Text style={{ color: '#fff' }}>Update</Text>
            </TouchableOpacity>
            <View style={{ height: hp(3) }}></View>

            <View style={{ height: hp(30) }}></View>
        </ScrollView>
    );
};

// =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Main Component =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
const AvaxaaProfile = ({ navigation }) => {
    const [menuSelect, setMenuSelect] = useState(true);
    const [Name, setName] = useState('');
    const [Mobile, setMobile] = useState('');
    const [Email, setEmail] = useState('');
    const [Pan, setPan] = useState('');
    const [Address1, setAddress1] = useState('');
    const [Address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [CityId, setCityId] = useState('');
    const [State, setState] = useState('');
    const [StateId, setStateId] = useState('');
    const [Pincode, setPincode] = useState('');
    const [AccountName, setAccountName] = useState('');
    const [AccountNumber, setAccountNumber] = useState('');
    const [BankName, setBankName] = useState('');
    const [IFSCCode, setIFSCCode] = useState('');
    const [isLoaded, setIsloaded] = useState(true);
    const [uid, setUid] = useState('');


    const EncKey = encryptPiDataNew(Authentication_Key)

    useEffect(() => {
        if (Pincode.length === 6) {
            Loacation_Details_Get();
        }
    }, [Pincode]);

    const Loacation_Details_Get = async () => {
        try {
            const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${Pincode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': EncKey
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.Response.Success === '1') {
                setCity(data.Response.Result[0].city_name);
                setState(data.Response.Result[0].state_name);
            } else {
                console.log(data?.Response.Message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Get Details =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    const getDetails = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                setUid(value)
                const response = await fetch(`${BaseUrl}userGet?type=M&id=${value}&req_type=1&res_type=1`, {
                    method: 'GET',
                    headers: { "authentication": EncKey }
                });

                response.json()
                    .then(responseData => {
                        console.log('responseData-->', responseData);
                        if (responseData.Response.Success == 1) {
                            setName(responseData.Response.Result[0].name);
                            setMobile(responseData.Response.Result[0].mobile ? responseData.Response.Result[0].mobile.toString() : "");
                            setEmail(responseData.Response.Result[0].email);
                            setPan(responseData.Response.Result[0].account_pan_number);
                            setAddress1(responseData.Response.Result[0].address1);
                            setAddress2(responseData.Response.Result[0].address2);
                            setCity(responseData.Response.Result[0].city_name);
                            setCityId(responseData.Response.Result[0].city);
                            setState(responseData.Response.Result[0].state_name);
                            setStateId(responseData.Response.Result[0].state);
                            setPincode(responseData.Response.Result[0].pincode ? responseData.Response.Result[0].pincode.toString() : "");
                            setAccountName(responseData.Response.Result[0].account_holder_name);
                            setAccountNumber(responseData.Response.Result[0].account_number ? responseData.Response.Result[0].account_number.toString() : "");
                            setBankName(responseData.Response.Result[0].account_bank_name);
                            setIFSCCode(responseData.Response.Result[0].account_IFSC);
                        }
                        else {

                        }

                    })
                    .finally(() => {
                        setIsloaded(false);
                    })

                    .catch(error => {
                        console.error('Error parsing JSON:', error);
                    });
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
    }
    // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Update Personal Information =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    const UpdateUserDetails = async () => {
        const userDetails = new FormData();

        userDetails.append('uId', uid);
        // userDetails.append('uname', Name);
        userDetails.append('email', Email);
        userDetails.append('pan_number', Pan);
        userDetails.append('address1', Address1);
        userDetails.append('address2', Address2);
        // userDetails.append('state', StateId);
        // userDetails.append('city', CityId);
        userDetails.append('pincode', Pincode);

        console.log(userDetails);
        setIsloaded(true);


        const response = await fetch(`${BaseUrl}profile_update`, {
            method: 'POST',
            body: userDetails,
            headers: { "authentication": EncKey }
        });

        response.json()
            .then(responseData => {
                console.log(responseData);
                if (responseData.Response.Success == 1) {
                    // ToastAndroid.showWithGravityAndOffset(
                    //     `${responseData.Response.Message}`,
                    //     ToastAndroid.LONG,
                    //     ToastAndroid.BOTTOM,
                    //     25,
                    //     50
                    // );
                    // Toast.show({
                    //     type: ALERT_TYPE.SUCCESS,
                    //     title: 'SUCCESS!',
                    //     textBody: responseData.Response.Message,
                    //     button: 'Done',
                    //   })
                    Toast.show({
                        type: "success",
                        text1: "Success",
                        text2: responseData?.Response.Message,
                    });
                    setTimeout(() => {
                        navigation.navigate('Footer', { screen: 'Profile' })
                    }, 3000);
                    // navigation.navigate('Footer', { screen: 'Profile' })
                }
                else {
                    // ToastAndroid.showWithGravityAndOffset(
                    //     `${responseData.Response.Message}`,
                    //     ToastAndroid.LONG,
                    //     ToastAndroid.BOTTOM,
                    //     25,
                    //     50
                    // );

                    // Toast.show({
                    //     type: ALERT_TYPE.WARNING,
                    //     title: 'SUCCESS!',
                    //     textBody: responseData.Response.Message,
                    //     button: 'Done',
                    //   })

                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: responseData?.Response.Message,
                    });
                    setTimeout(() => {
                        navigation.navigate('Footer', { screen: 'Profile' })
                    }, 3000);
                    // navigation.navigate('Footer', { screen: 'Profile' })
                }
            })
            .finally(() => {
                setIsloaded(false);
            })
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });
    }
    // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Update Bank Information =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    const UpdateBankDetails = async () => {
        const userDetails = new FormData();

        userDetails.append('uId', uid);
        userDetails.append('acc_name', AccountName);
        userDetails.append('acc_number', AccountNumber);
        userDetails.append('acc_bank_name', BankName);
        userDetails.append('acc_ifsc', IFSCCode);

        console.log(userDetails);
        setIsloaded(true);

        const response = await fetch(`${BaseUrl}profile_update`, {
            method: 'POST',
            body: userDetails,
            headers: { "authentication": EncKey }
        });

        response.json()
            .then(responseData => {
                console.log(responseData);
                if (responseData.Response.Success == 1) {
                    // ToastAndroid.showWithGravityAndOffset(
                    //     `${responseData.Response.Message}`,
                    //     ToastAndroid.LONG,
                    //     ToastAndroid.BOTTOM,
                    //     25,
                    //     50
                    // );
                    // navigation.navigate('Footer')
                    Toast.show({
                        type: "success",
                        text1: "Success",
                        text2: responseData?.Response.Message,
                    });
                    setTimeout(() => {
                        navigation.navigate('Footer', { screen: 'Profile' })
                    }, 2000);
                }
                else {
                    // ToastAndroid.showWithGravityAndOffset(
                    //     `${responseData.Response.Message}`,
                    //     ToastAndroid.LONG,
                    //     ToastAndroid.BOTTOM,
                    //     25,
                    //     50
                    // );
                    // navigation.navigate('Footer')
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: responseData?.Response.Message,
                    });
                    setTimeout(() => {
                        navigation.navigate('Footer', { screen: 'Profile' })
                    }, 2000);
                }
            })
            .finally(() => {
                setIsloaded(false)
            })
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });
    }

    useEffect(() => {
        getDetails();
    }, [])



    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
        return () => {
            backhandler.remove();
        };
    }, []);


    return (
        // <AlertNotificationRoot>
        <>

            <StatusBar backgroundColor='#A6222C' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackButtonClick} style={{ flexDirection: 'row', marginTop: hp(3) }}>
                        <Icon name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text style={styles.headerText}>PROFILE</Text>
                    </TouchableOpacity>
                </View>

                {
                    isLoaded ?
                        <View style={{ height: hp(100), width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: hp(4), width: hp(4), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: hp(0.5), elevation: 5 }}>
                                <ActivityIndicator size={'small'} color='#A6222C' />
                            </View>
                        </View>
                        :
                        <>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: hp(2), marginBottom: hp(1) }}>
                                <TouchableOpacity onPress={() => setMenuSelect(true)}
                                    style={{
                                        height: hp(6),
                                        width: wp(40),
                                        backgroundColor: menuSelect ? "#A6222C" : "#fff",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#A6222C",
                                        borderRadius: hp(1),
                                    }}
                                >
                                    <Text style={{ color: menuSelect ? "#fff" : "#A6222C", fontSize: hp(1.7), fontWeight: 'bold' }}>
                                        Personal Information
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setMenuSelect(false)}
                                    style={{
                                        height: hp(6),
                                        width: wp(40),
                                        backgroundColor: !menuSelect ? "#A6222C" : "#fff",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#A6222C",
                                        borderRadius: hp(1),
                                    }}
                                >
                                    <Text style={{ color: !menuSelect ? "#fff" : "#A6222C", fontSize: hp(1.7), fontWeight: 'bold' }}>
                                        Bank Details
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                keyboardVerticalOffset={hp(8)} // Adjust this based on header height
                                style={{ height: hp(100), width: wp(100), }}
                            >
                                {menuSelect ? (
                                    <PersonalInformation
                                        Name={Name}
                                        setName={setName}
                                        Mobile={Mobile}
                                        setMobile={setMobile}
                                        Email={Email}
                                        setEmail={setEmail}
                                        Pan={Pan}
                                        setPan={setPan}
                                        Address1={Address1}
                                        setAddress1={setAddress1}
                                        Address2={Address2}
                                        setAddress2={setAddress2}
                                        city={city}
                                        setCity={setCity}
                                        CityId={CityId}
                                        setCityId={setCityId}
                                        State={State}
                                        setState={setState}
                                        StateId={StateId}
                                        setStateId={setStateId}
                                        Pincode={Pincode}
                                        setPincode={setPincode}
                                        UpdateUserDetails={UpdateUserDetails}
                                    />
                                ) : (
                                    <BankDetails
                                        AccountName={AccountName}
                                        setAccountName={setAccountName}
                                        AccountNumber={AccountNumber}
                                        setAccountNumber={setAccountNumber}
                                        BankName={BankName}
                                        setBankName={setBankName}
                                        IFSCCode={IFSCCode}
                                        setIFSCCode={setIFSCCode}
                                        UpdateBankDetails={UpdateBankDetails}
                                    />
                                )}
                            </KeyboardAvoidingView>
                        </>
                }

                <Toast />
            </View>

        </>

    );
};

export default AvaxaaProfile;

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
});
