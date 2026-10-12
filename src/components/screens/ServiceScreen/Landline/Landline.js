import { BackHandler, StatusBar, StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from '@react-native-vector-icons/ant-design';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { encryptPiDataNew } from '../../Encryption/encryption';
import { BaseUrl } from '../../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../../key/Key';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ActivityIndicator, TextInput as TxtInput } from 'react-native-paper';
import { TextInput } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';


const Landline = ({ navigation }) => {


    const EncKey = encryptPiDataNew(Authentication_Key);
    const isFocused = useIsFocused();

    let amount = 10;
    const [selectCategory, setSelectCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryid, setCategoryid] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [RegisterNumber, setRegisterNumber] = useState("");
    // const [amount, setAmount] = useState('');
    const [AlertModalVisible, setAlertModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [Uid, setUid] = useState(null);
    const [FetchData, setFetchData] = useState('');
    const [FetchCustomer, setFetchCustomer] = useState('');
    const [FetchDuedate, setFetchDuedate] = useState('');
    const [FetchBillnumber, setFetchBillnumber] = useState('');
    const [FetchDueamount, setFetchDueamount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isBillFetched, setIsBillFetched] = useState(false);
    const [successmodal, setSuccessmodal] = useState(false);
    const [successData, setSuccessData] = useState("");
    const [failuremodal, setFailureModal] = useState(false);
    const [failureData, setfailureData] = useState("");
    const [failureStatus, setfailureStatus] = useState("");
    const [OrderID, setOrderID] = useState(null);
    const [PoolRefID, setPoolRefID] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dueAmount, setDueAmount] = useState('');
    console.log("categoryid", categoryid);
    console.log("Uid", Uid);
    console.log("FetchCustomer", FetchCustomer);
    console.log("OrderID", OrderID);
    console.log("PoolRefID", PoolRefID);


    const Operator_Alert = () => {
        if (!categoryid) {
            setAlertModalVisible(true);
            setModalMessage("Please Select Operator.");
        }
    }


    // const handleAmountChange = (text) => {
    //     setAmount(text);
    // };

    useEffect(() => {
        Category_Details_Get();
    }, []);

    const Category_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                setUid(value)
                try {
                    const response = await fetch(`${BaseUrl}getBiller?serviceType=Landline`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authentication': EncKey,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();

                    if (data.Response.Success === '1') {
                        setSelectCategory(data.Response.Result);
                        setFilteredCategories(data.Response.Result);
                    } else {
                        console.log(data?.Response.Message);
                        setSelectCategory([]);
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

    const handleSelectCategory = (item) => {
        setSelectedCategory(item);
        setCategoryid(item.operator_id);
        setIsDropdownOpen(false);
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            setFilteredCategories(selectCategory.filter(item => item.operator_name.toLowerCase().includes(text.toLowerCase())));
        } else {
            setFilteredCategories(selectCategory);
        }
    };


    const FetchDetails = async () => {

        const formData = new FormData();
        formData.append("uId", Uid);
        formData.append("number", RegisterNumber);
        formData.append("opid", categoryid);
        formData.append("amount", amount);

        console.log("formData", formData);
        if (!categoryid) {
            setAlertModalVisible(true);
            setModalMessage("Please Select Operator.");
            return;
        }

        if (!RegisterNumber) {
            setAlertModalVisible(true);
            setModalMessage("Please Enter Registration Number.");
            return;
        }

        if (!amount) {
            setAlertModalVisible(true);
            setModalMessage("Enter Valid Amount");
            return;
        }
        try {
            setLoading(true); // Show loader
            const response = await fetch(`${BaseUrl}postpaid_fastag_initiate`, {
                method: "POST",
                headers: {
                    "authentication": EncKey
                },
                body: formData
            });

            const data = await response.json();
            console.log('response', data);

            if (data.Response.Success == "1") {
                setFetchData(data.Response.Result)
                setFetchCustomer(data.Response.Result.apiResponse.customer_name)
                setFetchDuedate(data.Response.Result.apiResponse.due_date)
                setFetchBillnumber(data.Response.Result.apiResponse.bill_number)
                setFetchDueamount(data.Response.Result.apiResponse.due_amount)
                setIsBillFetched(true);
                setOrderID(data.Response.Result.orderId);
                setPoolRefID(data.Response.Result.poolReferenceId);
                setDueAmount(data.Response.Result.apiResponse.due_amount)
                // console.log("Orderid=======>", Orderid);

                // Alert.alert("Success", data.Response.Message);
                // setSuccessModal(true)
                // navigation.navigate('ConfirmPage', { phoneNumber, selectedCityCode, selectedOperatorId, amount, selectedOperatorIdName, Orderid })
            } else {
                Alert.alert("Error", data.Response.Message || "Failed to Initiate Recharge.");
            }
        } catch (error) {
            // setIsLoading(false)
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };



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
                        `${BaseUrl}utility_payment?number=${RegisterNumber}&amount=${dueAmount}&opid=${categoryid}&uId=${value}&orderId=${OrderID}&pincode=${pincode}&districtId=${districtid}&poolReferenceId=${PoolRefID}`,
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
                    //     // alert(data?.Response?.Message);
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


    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <TouchableOpacity onPress={() => navigation.navigate("ServiceScreen")} style={styles.header}>
                    <Icon onPress={() => navigation.navigate("ServiceScreen")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
                    <Text onPress={() => navigation.navigate("ServiceScreen")} style={[styles.headerText,{marginTop:hp(3)}]}>Landline</Text>
                </TouchableOpacity>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)} style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {selectedCategory ? selectedCategory.operator_name : "Select Operator"}
                        </Text>
                        <MaterialCommunityIcons name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <View style={styles.dropdownMenuStyle}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search operator..."
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                            <FlatList
                                data={filteredCategories}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item) => item.operator_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.dropdownItemStyle} onPress={() => handleSelectCategory(item)}>
                                        <Text style={styles.dropdownItemTxtStyle}>{item.operator_name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}

                    {
                        categoryid ?

                            <View>
                                <TxtInput
                                    mode="outlined"
                                    label="Landline Number"
                                    // autoCapitalize="characters"
                                    outlineColor="black"
                                    placeholder="Enter Landline Number with STD Code"
                                    placeholderTextColor="gray"
                                    style={{
                                        width: wp(90),
                                        backgroundColor: "#fff",
                                        fontSize: hp(1.8),
                                        marginTop: hp(2),
                                        alignSelf: "center",
                                    }}
                                    contentStyle={{ color: "#000", height: hp(6) }}
                                    outlineStyle={{
                                        backgroundColor: "transparent",
                                        borderColor: "#A6222C",
                                        borderRadius: 5,
                                        borderWidth: 1.2,
                                    }}
                                    activeOutlineColor="#A6222C"
                                    cursorColor="#A6222C"
                                    keyboardType="ascii-capable"
                                    value={RegisterNumber}
                                    onChangeText={(value) => setRegisterNumber(value)}
                                />

                                {/* <View style={styles.amountContainer}>
                                    <Text style={styles.rupeeSymbol}>₹</Text>
                                    <TextInput
                                        value={String(amount)}
                                        style={styles.amountInput}
                                        keyboardType="number-pad"
                                        placeholder="Enter amount"
                                        placeholderTextColor="#888"
                                        maxLength={4}
                                        onChangeText={handleAmountChange}
                                    />
                                </View> */}

                                {/* <TouchableOpacity onPress={FetchDetails} style={styles.submitButton} >
                                    <Text style={{ fontSize: hp(2), fontWeight: '700', color: "#454545", }}>Bill Fetch</Text>
                                    <Ionicons name="arrow-forward" style={styles.submitIcon} />
                                </TouchableOpacity> */}

                                {!loading && !isBillFetched && (
                                    <TouchableOpacity onPress={FetchDetails} style={styles.submitButton}>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: "#454545" }}>Bill Fetch</Text>
                                        <Ionicons name="arrow-forward" style={styles.submitIcon} />
                                    </TouchableOpacity>
                                )}

                                {/* {loading && <ActivityIndicator size="large" color="#454545" />} */}
                                {loading && <Lottie resizeMode='contain' source={require('../../../assets/json/loading.json')} style={{ width: hp(20), height: hp(20), alignSelf: 'center' }} autoPlay loop />}
                            </View>
                            :
                            <></>
                    }
                    {
                        FetchData ?
                            <View>
                                <View style={{ width: wp(80), height: hp(15), backgroundColor: '#fff', elevation: 5, alignItems: 'center', justifyContent: 'flex-start', marginTop: hp(3), alignSelf: 'center', borderRadius: hp(1) }}>
                                    <Text style={styles.label}>Customer: <Text style={styles.valueBold}>{FetchCustomer}</Text></Text>
                                    <Text style={styles.label}>Due Date: <Text style={styles.valueBold}>{FetchDuedate}</Text></Text>
                                    <Text style={styles.label}>Bill Number: <Text style={styles.valueBold}>{FetchBillnumber}</Text></Text>
                                    <Text style={styles.label}>Due Amount: <Text style={styles.valueBold}>{FetchDueamount}</Text></Text>

                                </View>

                                <TouchableOpacity onPress={() => Recharges_Success_Get()} style={styles.submitButton1} >
                                    <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: "#fff", }}>Pay</Text>
                                    {/* <Ionicons name="arrow-forward" style={styles.submitIcon} /> */}
                                </TouchableOpacity>
                            </View>
                            :
                            <></>
                    }



                    {/* <View style={styles.amountContainer}>
                        <Text style={styles.rupeeSymbol}>₹</Text>
                        <TextInput
                            value={String(amount)}
                            style={styles.amountInput}
                            keyboardType="number-pad"
                            placeholder="Enter amount"
                            placeholderTextColor="#888"
                            maxLength={4}
                            onChangeText={handleAmountChange}
                        />
                    </View> */}
                    {
                        categoryid || FetchData ?
                            <></> :

                            <TouchableOpacity onPress={Operator_Alert} style={styles.submitButton1} >
                                <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: "#fff", }}>Pay</Text>
                                {/* <Ionicons name="arrow-forward" style={styles.submitIcon} /> */}
                            </TouchableOpacity>
                    }


                </View>

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

                                        <TouchableOpacity onPress={() => setAlertModalVisible(false)}
                                        >
                                            <Text style={styles.modalBtn}>
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

            </View>
        </>
    );
};

export default Landline;

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
    dropdownContainer: {
        marginTop: hp(5),
        alignSelf: 'center',
        width: wp(90),
    },
    dropdownButtonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding:hp(1.5),
        width: wp(90),
        height: hp(7),
        padding: hp(1),
        borderWidth: 1,
        borderColor: '#A6222C',
        borderRadius: hp(1),
        backgroundColor: '#fff',
    },
    dropdownButtonTxtStyle: {
        fontSize: hp(1.8),
        marginLeft: wp(2),
        color: '#000',
    },
    dropdownButtonArrowStyle: {
        fontSize: hp(3),
        color: "gray",
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: hp(1),
        marginTop: hp(1),
        height: hp(60),
        padding: hp(1),
        borderWidth: 1,
        borderColor: '#A6222C',
    },
    searchInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#A6222C',
        marginBottom: hp(1),
        padding: hp(1),
    },
    dropdownItemStyle: {
        padding: hp(1.2),
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
    dropdownItemTxtStyle: {
        fontSize: hp(1.8),
        color: '#000',
    },
    amountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        borderColor: '#A6222C',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: hp(1),
        backgroundColor: "#fff",
        width: wp(50),
        alignItems: 'center',
        marginTop: hp(3)
    },
    rupeeSymbol: {
        fontSize: hp(2.5),
        color: '#000',
        // paddingRight: wp(10),
        backgroundColor: "#fff",
        marginLeft: hp(1.5),
        // textAlign:'center',
        marginLeft: wp(5)
    },
    amountInput: {
        flex: 1,
        // width: hp(25),
        color: "#000",
        fontSize: hp(2.5),
        height: hp(8),
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        // textAlign:'center'
    },
    submitButton: {
        // position: 'absolute',
        // bottom: hp(25),
        // right: hp(5),
        width: wp(40),
        height: hp(5),
        backgroundColor: 'orange',
        // padding: hp(1),
        borderRadius: hp(2.5),
        marginTop: hp(10),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    submitButton1: {
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
        color: "#454545",
        marginLeft: wp(5)
    },
    modalBackground: {
        height: hp(100),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackgroundAlert: {
        height: hp(100),
        width: wp(100),
        // justifyContent: 'center',
        // alignItems: 'center',
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
    modalBtn: {
        color: '#fff',
        backgroundColor: '#A6222C',
        paddingHorizontal: hp(2),
        paddingVertical: hp(0.5),
        fontSize: hp(2.2),
        borderRadius: hp(1),
        fontWeight: '600',
        marginTop: hp(3),
        marginBottom: hp(2),
    },
    AddNewTitle: {
        color: '#000',
        fontSize: hp(2),
        fontWeight: '500',
        marginTop: hp(2)
    },
    label: {
        fontSize: hp(1.8),
        color: "#333",
        marginBottom: 5,
        width: wp(70),
        marginTop: hp(0.5)
    },
    valueBold: {
        fontWeight: "bold",
        color: "#222",
    },
});
