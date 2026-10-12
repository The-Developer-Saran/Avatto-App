import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import Icon from '@react-native-vector-icons/ant-design';

const BusinessDashboard = ({ navigation }) => {

    const EncKey = encryptPiDataNew(Authentication_Key)

    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [businessDetails, setBusinessDetails] = useState('');
    const [withdrawalList, setWithdrawalList] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [totalSalesList, setTotalSalesList] = useState([]);
    const [totalWithdrawHistoryList, setTotalWithdrawHistoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eligiblewithdrawAmount, setEligibleWithdrawAmount] = useState('');


    console.log('====================================', eligiblewithdrawAmount);


    // const userId = 12765;

    // const getDetailsApi = useCallback(async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

    //         if (value !== null) {
    //             // alert(value)
    //             try {
    //                 const res = await axios.get(
    //                     `${BaseUrl}vendorLogin?uId=${value}`,
    //                     {
    //                         headers: {
    //                             'Content-Type': 'application/x-www-form-urlencoded',
    //                             authentication: EncKey,
    //                         },
    //                     }
    //                 );

    //                 //console.log(res.data);
    //                 if (res.data.Response?.Success == "1") {
    //                     setBusinessDetails(res.data.Response.Result[0] || {});
    //                     getWithdrawalDetailsApi(res.data.Response.Result[0].id);
    //                     getSalesDetailsApi(res.data.Response.Result[0].id);
    //                 } else {
    //                     console.warn('API Error:', res.data.Response.Message);
    //                     setBusinessDetails({});
    //                 }
    //             } catch (error) {
    //                 console.error('Fetch error:', error.message);
    //             }
    //         } else {
    //             console.log('No user data found in AsyncStorage.');
    //         }
    //     } catch (error) {
    //         console.error('Error reading AsyncStorage:', error.message);
    //     }
    // }, []);

    // useEffect(() => {
    //     getDetailsApi();
    // }, [getDetailsApi])

    const All_Wallet_Data = async (id) => {
        try {
            const walletData = new FormData();
            walletData.append("bId", id);
            // console.log('bid---> ',businessDetails.id)

            const response = await fetch(`${BaseUrl}getBusinessWallet`, {
                method: "POST",
                headers: { authentication: EncKey },
                body: walletData,
            });

            const json = await response.json();
            console.log("API RESPONSE:", json);

            if (json.Response.Success == "1") {
                setEligibleWithdrawAmount(json.Response.Result.eligibleForWithdrawal);
            } else {
                ToastAndroid.show(json.Response.Message, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Error fetching wallet data:", error);
            ToastAndroid.show("Failed to fetch data", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };


    const [busId,setBusid] = useState(null);

      const getDetailsApi = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                try {
                    const res = await axios.get(
                        `${BaseUrl}vendorLogin?uId=${value}`,
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                authentication: EncKey,
                            },
                        }
                    );

                    console.log('dataaaaa----->',res.data);
                    if (res.data.Response?.Success == "1") {
                        setBusid(res.data.Response.Result[0].id);
                        setBusinessDetails(res.data.Response.Result[0] || {});
                        getWithdrawalDetailsApi(res.data.Response.Result[0].id);
                        getSalesDetailsApi(res.data.Response.Result[0].id);
                        All_Wallet_Data(res.data.Response.Result[0].id)
                    } else {
                        console.warn('API Error:', res.data.Response.Message);
                        setBusinessDetails({});
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
    }

    useEffect(() => {
        getDetailsApi();
    }, [])

    const getWithdrawalDetailsApi = useCallback(async (id) => {

        try {
            const res = await axios.get(
                `${BaseUrl}withdrawalGet_business?bid=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        authentication: EncKey,
                    },
                },
            );
            //console.log(res.data);
            if (res.data.Response?.Success === "1") {
                setWithdrawalList(res.data.Response.Result[0] || {});
                setTotalWithdrawHistoryList(res.data.Response.Result || []);
            }
            else {
                console.warn(res.data.Response.Message);
                setWithdrawalList('');
                setTotalWithdrawHistoryList([]);
            }
        } catch (error) {
            console.error('API Fetch Error2:', error.message);
        }
    }, []);

    const getSalesDetailsApi = useCallback(async (id) => {

        try {
            const res = await axios.get(
                `${BaseUrl}salesReport?bId=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        authentication: EncKey,
                    },
                },
            );
            //console.log(res.data);
            if (res.data.Response?.Success === "1") {
                setSalesList(res.data.Response.Result[0] || {});
                setTotalSalesList(res.data.Response.Result || []);
            }
            else {
                console.warn(res.data.Response.Message);
                setSalesList('');
                setTotalSalesList([]);
            }
        } catch (error) {
            console.error('API Fetch Error2:', error.message);
        }
    }, []);


    
    // useEffect(() => {
    //     All_Wallet_Data();
    // }, []);





    const handleWithdraw = useCallback(async () => {
        const amount = parseFloat(withdrawAmount.trim()); // Trim whitespace and convert to number
        const availableBalance = Number((businessDetails.business_wallet_avaliable || "0").replace(/,/g, ''));

        // Validation Checks
        if (!withdrawAmount.trim()) {
            setErrorMessage('Please enter an amount to withdraw.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            setErrorMessage('Invalid amount. Please enter a valid numeric value greater than 0.');
            return;
        }

        if (amount > availableBalance) {
            setErrorMessage(`Insufficient balance. Available: ₹${availableBalance.toLocaleString()}`);
            return;
        }

        const formData = new FormData();
        formData.append('bId', businessDetails.id);
        formData.append('amount', amount);

        try {
            setLoading(true);
            const res = await axios.post(
                `${BaseUrl}withdraw_request_business`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authentication: EncKey,
                    },
                },
            );
            //console.log(res);

            if (res.data.Response?.Success === "1") {
                alert(res.data.Response?.Message);
                setWithdrawAmount('');
                setErrorMessage('');
            }
            else {
                alert(res.data.Response?.Message);
                setErrorMessage(res.data.Response?.Message);
            }
        } catch (error) {
            console.error('Withdrawal Error:', error);
            alert('Something went wrong! Please try again.');
        }
        finally {
            setLoading(false);
            getDetailsApi();
        }
    }, [withdrawAmount, businessDetails, getDetailsApi]);

    const gotoSalesReport = useCallback(() => {
        if (totalSalesList.length == 0) {
            alert('No sales found');
            return
        }
        navigation.navigate('SalesReportList', { item: totalSalesList });
    }, [navigation, totalSalesList]);


    const gotoWithdrawalHistory = useCallback(() => {
        if (totalWithdrawHistoryList.length == 0) {
            alert('No withdrawal history found');
            return
        }
        navigation.navigate('WithdrawalHistoryList', { item: totalWithdrawHistoryList });
    }, [navigation, totalWithdrawHistoryList]);

    return (
        <View style={styles.container}>
            <StatusBar  backgroundColor='#A6222C' barStyle="light-content" />

            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerButton}>
                    <AntDesign onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>BUSINESS DASHBOARD</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("UtlityHistory")} style={{ width: hp(6), height: hp(6), backgroundColor: '#fff', marginTop: hp(5), borderRadius: hp(3), justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/Utility/history.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View> */}

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(0) }}>
                    <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                    <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>BUSINESS DASHBOARD</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("NewUpdateBusiness")} style={{ width: hp(6), height: hp(6), backgroundColor: '#fff', marginTop: hp(0), borderRadius: hp(3), justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/Utility/bisedit.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>


            <ScrollView>
                {/* Available Balance */}
                <View style={styles.balanceContainer}>
                    <Text style={styles.label}>Available</Text>
                    <Text style={styles.amount}>₹ {businessDetails?.business_wallet_avaliable ?? '0'}</Text>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.label}>Total Sales</Text>
                        <Text style={styles.amount}>₹ {businessDetails.business_wallet_credit ?? '0'}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.label}>Withdrawn</Text>
                        <Text style={styles.amount}>₹ {businessDetails.business_wallet_used ?? '0'}</Text>
                    </View>
                </View>
                <Text style={{ fontSize: hp(1.9), textAlign: 'center', marginTop: hp(-2) }}>
                    <Text style={{ color: 'red' }}>Note: Maximum withdrawal limit: </Text> {" "}
                    <Text style={{ color: 'black' }}>{eligiblewithdrawAmount}</Text>
                </Text>
                {/* Withdraw Input */}
                {/* <TextInput
                    style={styles.input}
                    maxLength={5}
                    keyboardType="numeric"
                    placeholder="Enter withdraw amount"
                    placeholderTextColor="#888"
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                />
                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>} */}

                {/* Withdraw Input */}
                <TextInput
                    style={styles.input}
                    maxLength={5}
                    keyboardType="numeric"
                    placeholder="Enter withdraw amount"
                    placeholderTextColor="#888"
                    value={withdrawAmount}
                    onChangeText={(value) => {
                        const numericValue = value.replace(/[^0-9]/g, ''); // allow only numbers
                        if (Number(numericValue) <= Number(eligiblewithdrawAmount)) {
                            setWithdrawAmount(numericValue);
                            setErrorMessage('');
                        } else {
                            setErrorMessage(`You cannot enter more than ${eligiblewithdrawAmount}`);
                        }
                    }}
                />

                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}


                {/* Withdraw Button */}
                <TouchableOpacity onPress={handleWithdraw} style={[styles.button, { marginTop: hp(2), backgroundColor: loading ? '#888' : '#A6222C' }]} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Withdraw'}</Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.button} onPress={gotoSalesReport}><Text style={styles.buttonText}>Sales Report</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={gotoWithdrawalHistory}><Text style={styles.buttonText}>Withdraw History</Text></TouchableOpacity>
                </View>

                {/* Last Sale */}

                <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>Last Sale:</Text></View>
                {salesList ? (
                    // withdrawalList.map((withdrawal, index) => (
                    <View style={styles.cardContainer}>
                        {/* Transaction Details */}
                        <View style={styles.cardContent}>
                            <View style={styles.leftSection}>
                                <Text style={styles.text}>{salesList.created_at || 'N/A'}</Text>
                                <Text style={styles.transactionText}>{salesList.name || 'N/A'}</Text>
                            </View>
                            <View style={styles.rightSection}>
                                <Text style={styles.text}>PS % : {salesList.psa_percentage || '0'}</Text>
                                <Text style={styles.text}>PS Value : {salesList.psa_value || '0'}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1) }}>
                                <Text style={styles.text}>Bill Amount</Text>
                                <View style={[styles.statusBox, { backgroundColor: 'green', width: wp(40) }]}>
                                    <Text style={[styles.statusText, { fontSize: hp(2.8), fontWeight: '600' }]}>
                                        ₹ {salesList.net_amount || "0.00"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1) }}>
                                <Text style={styles.text}>Received Amount</Text>
                                <View style={[styles.statusBox, { backgroundColor: 'green', width: wp(40) }]}>
                                    <Text style={[styles.statusText, { fontSize: hp(2.8), fontWeight: '600' }]}>
                                        ₹ {salesList.payable_amount || "0.00"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    // ))
                ) : (
                    <Text style={styles.noDataText}>No sales history available.</Text>
                )}

                {/* Previous Withdrawal */}
                <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>Previous Withdrawal:</Text></View>
                {withdrawalList ? (
                    // withdrawalList.map((withdrawal, index) => (
                    <View style={styles.cardContainer}>
                        {/* Transaction Details */}
                        <View style={styles.cardContent}>
                            <View style={styles.leftSection}>
                                <Text style={styles.text}>{withdrawalList.updated_at || 'N/A'}</Text>
                                <Text style={styles.transactionText}>{withdrawalList.transaction_id || 'N/A'}</Text>
                            </View>
                            <View style={styles.rightSection}>
                                <Text style={styles.amount}>₹ {withdrawalList.ca_req_amt || '0.00'}</Text>
                            </View>
                        </View>

                        {/* Status */}
                        <View style={[styles.statusBox, { backgroundColor: withdrawalList.ca_transaction_status == "1" ? 'green' : 'orange' }]}>
                            <Text style={styles.statusText}>
                                {withdrawalList.ca_transaction_status == "1" ? "Paid" : "Pending"}
                            </Text>
                        </View>
                    </View>
                    // ))
                ) : (
                    <Text style={styles.noDataText}>No withdrawal history available.</Text>
                )}
                <View style={{ height: hp(10) }} />
            </ScrollView>
        </View>
    );
};

export default BusinessDashboard;

const styles = StyleSheet.create({
    // container: { flex: 1, backgroundColor: '#fff' },
    // header: { backgroundColor: '#A6222C', padding: hp(1.5), height: hp(12) },
    // headerButton: { flexDirection: 'row', marginTop: hp(1) },
    // headerIcon: { marginTop: hp(4) },
    // headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(4), marginLeft: wp(5) },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#A6222C',
        // backgroundColor: '#ff6000',
        height: hp(8),
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
    //  headerIcon: { marginTop: hp(4) },
    balanceContainer: { alignItems: 'center', backgroundColor: '#ececec', padding: hp(1), borderRadius: hp(1), elevation: 4, alignSelf: 'center', marginTop: hp(3), width: wp(44), },
    label: { fontSize: hp(2), fontWeight: '400', color: '#000' },
    amount: { fontSize: hp(2.8), fontWeight: '600', color: '#000', marginTop: hp(0.5) },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: wp(95), alignSelf: 'center', marginVertical: hp(5) },
    statBox: { backgroundColor: '#ececec', padding: hp(2), borderRadius: hp(1), elevation: 4, width: wp(44), alignItems: 'center' },
    input: { height: hp(7), borderColor: '#888', borderWidth: 1, width: wp(90), paddingHorizontal: hp(2), borderRadius: hp(1), alignSelf: 'center', fontSize: hp(2), marginTop: hp(1) },
    errorText: { color: 'red', fontSize: hp(2), textAlign: 'center', marginTop: hp(1) },
    button: { backgroundColor: '#A6222C', padding: hp(1.5), borderRadius: hp(1), elevation: 4, width: wp(44), alignItems: 'center', alignSelf: 'center' },
    buttonText: { color: '#fff', fontSize: hp(2), fontWeight: '500' },
    actionContainer: { flexDirection: 'row', justifyContent: 'space-between', width: wp(95), alignSelf: 'center', marginTop: hp(2) },
    sectionHeader: { padding: hp(1) },
    sectionHeaderText: { fontSize: hp(2), fontWeight: '500', color: '#000' },
    cardContainer: { backgroundColor: '#ececec', borderRadius: hp(1), padding: hp(2), elevation: 4, width: wp(90), alignSelf: 'center' },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBox: { padding: hp(1), borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), alignSelf: 'center', width: wp(50), marginBottom: hp(-2), marginTop: hp(1) },
    statusText: { color: '#fff', textAlign: 'center', fontWeight: '500' },
    noDataText: { fontSize: hp(2), fontWeight: '400', color: '#888', textAlign: 'center', width: wp(90), alignSelf: 'center', marginTop: hp(1) },
    logo: {
        height: hp(4),
        width: hp(4),
        // tintColor: '#fcb713',
    },
});
