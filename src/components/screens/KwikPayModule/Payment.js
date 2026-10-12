import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, FlatList, ScrollView, ActivityIndicator, Image, ToastAndroid, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ant-design';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Feather from '@react-native-vector-icons/feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationContainer, useIsFocused, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import successLottie from './success.json'
import LottieView from 'lottie-react-native';
import { Modal, TextInput as Tinput } from "react-native-paper";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { encryptPiDataNew } from "../Encryption/encryption";
import DeviceInfo from "react-native-device-info";


export default function Payment() {
    const navigation = useNavigation();
    const user = useSelector(state => state.user.value);
    const route = useRoute();
    const { phoneNumber, selectedCityCode, selectedOperatorId, amount, selectedOperatorIdName, DCEO_Id } = route.params || {};
    const orderId = Math.floor(1000000000 + Math.random() * 9000000000);
    const vId = '23813';
    const bId = '737';
    const userId = user.userid.toString();
    const bType = 'I';
    const bNumber = Date.now();
    const pType = 'Test';
    const crc = '3';
    const dId ="EDGGFDXFDGHB456644fGGhyyy";
    const [rToken, setRememberToken] = useState(null);
    const dceoId = DCEO_Id;
    const stCode = selectedCityCode;

    const UID = () => {
        DeviceInfo.getAndroidId().then((rememberToken) => {
            setRememberToken(rememberToken);
        });
    }

    useEffect(() => {
        UID()
    }, [])

    const [modalMessage, setModalMessage] = useState('');
    const [AlertModalVisible, setAlertModalVisible] = useState(false);
    const [SuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [cashBackMethod, setCashBackMethod] = useState(null);
    const [InsuffModal, setInsuffModal] = useState(false);
    const [pin, setPin] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const [isChecked1, setIsChecked1] = useState(false);
    const [walletType, setWalletType] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({ neededCw: 0, redeemAmt: 0, spCoins: 0 });
    const [TopUpModal, setTopUpModal] = useState(false);
    const [InsuffFundAmt, setInsuffFundAmt] = useState(0);

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('ConfirmPage');
        }
    };

    const handlePress = (value) => {
        switch (value) {
            case '1000':
                setCashBackMethod('TU');
                console.log('TU');
                break;
            case '2000':
                setCashBackMethod('U');
                console.log('U');
                break;
            case 'Instant':
                setCashBackMethod('I');
                console.log('I');
                break;
            default:
                break;
        }
    };

    const getButtonStyle = (value) => ({
        ...styles.bottomBtn,
        backgroundColor: cashBackMethod === value ? '#d3d3d3' : 'white',
    });

    useEffect(() => {
        if (amount != null && CashDeopositWallet != null && (isChecked1 || !isChecked1)) {
            const result = NewPayment(amount, availableRedeemPoints, CashDeopositWallet, SparkCoins);
            setPaymentDetails(result);
        }
    }, [amount, availableRedeemPoints, CashDeopositWallet, SparkCoins, isChecked1]);

    const NewPayment = (amount, availableRedeemPoints, CashDeopositWallet, SparkCoins) => {
        const calcPercentage = (percent, total) => ((percent / 100) * total).toFixed(2);
        const spPercentage = 5;
        const rwPercentage = 50;
        let spCoins = 0, redeemAmt = 0, neededSP = 0, neededRw = 0, neededCw = 0;
        const billAmt = parseFloat(amount);
        const actualRedeemPoints = parseFloat(availableRedeemPoints);
        const actualCashAmt = parseFloat(CashDeopositWallet);
        const actualSparkCoins = parseFloat(SparkCoins);
        neededSP = calcPercentage(spPercentage, billAmt);
        neededRw = calcPercentage(rwPercentage, billAmt);
        if (isChecked1) {
            if (actualSparkCoins >= neededSP) {
                neededRw -= neededSP;
                spCoins = neededSP;
            }
            if (actualRedeemPoints >= neededRw) {
                redeemAmt = neededRw;
                neededCw = billAmt - (redeemAmt + spCoins);
            } else {
                redeemAmt = actualRedeemPoints;
                neededCw = billAmt - (redeemAmt + spCoins);
            }
        } else {
            neededCw = billAmt - actualSparkCoins;
        }
        if (actualCashAmt < neededCw) {
            console.log("Add Money to Continue");
        } else {
            console.log("Costflow API calling");
        }

        let types = [];
        if (neededCw > 0) types.push("CW");
        if (redeemAmt > 0) types.push("RW");
        if (spCoins > 0) types.push("SP");
        setWalletType(types);
        return { neededCw, redeemAmt, spCoins };
    };


    let isFocused = useIsFocused();
    let [given_bill_amt, setBillAmt] = useState(amount);
    let [availableRedeemPoints, setavailableRedeemPoints] = useState('0');
    let [CashDeopositWallet, setCashDeopositWallet] = useState('0');
    let [AvailablePoints, setAvailablePoints] = useState(0);
    let [SparkCoins, setSparkCoins] = useState('0');
    const [CWRadio, setCWRadio] = useState(true); // radio button value
    const [isLoading, setisLoading] = useState(true);
    let [brp_amt, setbill_brp_amt] = useState(0);
    let [bcp_amt, setbill_bcp_amt] = useState(0);
    const [upass, setUpass] = useState(false);
    const [MemberShipId, setMemberShipId] = useState(null);

    const WalletData = async () => {
        if (isFocused) {
            try {
                const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
          
                if (value !== null) {
                    const walletdata = new FormData();
                    walletdata.append("uId", value);
                    const response = await fetch(`https://sparkredeem.in/redy/core/api/user/wallet/points`, {
                        method: 'POST',
                        body: walletdata,
                    });
                    response.json()
                        .then(responseData => {
                            if (responseData.Response.Success == 1) {
                                setavailableRedeemPoints(parseFloat(responseData?.Response.Result.wallet.availRedeemAmt));
                                setCashDeopositWallet(parseFloat(responseData?.Response.Result.CashDeopositWallet));
                                setAvailablePoints(parseFloat(responseData?.Response.Result.wallet.availRedeemAmt));
                                setSparkCoins(parseFloat(responseData?.Response.Result.wallet.availExtraPoints));
                                setisLoading(false);
                            }
                            else {
                                console.log("Status unavailable");
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getbrpbcp = () => {
        axios.get(`https://sparkredeem.in/gig_workstation/CostFlow/upass_settings.php`)
            .then((res) => {
                if (res?.data.Response.Success == "1") {
                    let data = res?.data;
                    let a = (data.Response.Result.filter(f => f.set_type == 'BRP'));
                    let b = (data.Response.Result.filter(f => f.set_type == 'BCP'));
                    setbill_brp_amt(a[0].set_value);
                    setbill_bcp_amt(b[0].set_value);
                }
                else {
                    console.log("Status unavailable");
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const CheckingUpasshistory = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
      
            if (value !== null) {
                axios.post(`https://sparkredeem.in/gig_workstation/CostFlow/upass_program.php?customer_id=${value}`)
                    .then((res) => {
                        //console.log(res.data)
                        if (res?.data.Response.Success == "1") {
                            setUpass(true);
                        }
                        else if (res?.data.Response.Success == "0") {
                            setUpass(false);
                        }
                    })
                    .finally(() => {
                    })
                    .catch(err => console.log(err))
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const getProfile = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
      
            if (value !== null) {
                axios.get(`https://sparkredeem.in/sparky/laravel/api/profile_data/${value}`)
                    .then((res) => {
                        if (res?.data.Response.Success == "1") {
                            let data = res?.data;
                            setMemberShipId(data.Response.Result[0].spark_membership);
                        }
                        else {

                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        WalletData();
        getbrpbcp();
        CheckingUpasshistory();
        getProfile();
    }, [])

    const NewPaymentt = (given_bill_amt, availableRedeemPoints, CashDeopositWallet, SparkCoins) => {
        let calcPercentage = (percent, total) => {
            return ((percent / 100) * total).toFixed(2);
        };
        const spPercentage = 5;
        const rwPercentage = 50;
        let {
            spCoins,
            redeemAmt,
            neededSP,
            neededRw,
            neededCw,
        } = 0;
        let billAmt = parseFloat(String(given_bill_amt));
        let actualRedeemPoints = parseFloat(String(availableRedeemPoints));
        let actualCashAmt = parseFloat(String(CashDeopositWallet));
        let actualSparkCoins = parseFloat(String(SparkCoins));
        neededSP = calcPercentage(spPercentage, billAmt); //5% of given_bill_amt  --> b   5
        neededRw = calcPercentage(rwPercentage, billAmt); //50% of given_bill_amt  --> a  45
        var calc = new Object();
        if (actualSparkCoins >= neededSP) {
            neededRw = neededRw - neededSP;
            spCoins = neededSP;
            calc.spCoins = neededSP;
        } else {
            neededSP = 0;
            spCoins = 0;
            calc.spCoins = 0;
        }
        if (actualRedeemPoints >= neededRw) {
            neededCw = parseFloat(billAmt) - (parseFloat(neededRw) + parseFloat(neededSP));
            redeemAmt = neededRw;
            calc.neededCw = parseFloat(billAmt) - (parseFloat(neededRw) + parseFloat(neededSP));
            calc.redeemAmt = neededRw;
        } else {
            neededCw = parseFloat(billAmt) - (parseFloat(actualRedeemPoints) + parseFloat(neededSP));
            redeemAmt = actualRedeemPoints;
            calc.neededCw = parseFloat(billAmt) - (parseFloat(actualRedeemPoints) + parseFloat(neededSP));
            calc.redeemAmt = actualRedeemPoints;
        }
        if (actualCashAmt >= neededCw) {
            // console.log("costflow api calling");
        } else {
            // console.log("Add Money to Continue");
        }
        return calc;
    }
    const output = NewPaymentt(given_bill_amt, availableRedeemPoints, CashDeopositWallet, SparkCoins);

    const InsuffFundincw = (a) => {
        Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Warning!',
            textBody: `Insufficient balance in cash wallet ₹ ${a ? Math.round(Number(a)) : ''}`,
            button: 'Top up',
            //onHide: () => setTopUpModal(true)
            onHide: () => navigation.navigate('PayTM', { backhandlerControl: 1 })
        })
    }
    const checkk = () => {
        if (availableRedeemPoints < 1 && SparkCoins <= (given_bill_amt / 100) * 5) {
            ToastAndroid.showWithGravityAndOffset(
                "Not enough cash in your Redeem Wallet and Spark coins",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            setCWRadio(true)
        }
        else {
            setCWRadio(!CWRadio)
        }
    }

    const Pay = async () => {
        if (!cashBackMethod) {
            setAlertModalVisible(true);
            setModalMessage("Please select any one of the payback option.");
            return;
        }
        else {
            try {
                const value = await AsyncStorage.getItem('user');
                if (value !== null) {
                    let data = (JSON.parse(value));
                    let wallet_type = CWRadio ? '["CW"]' : parseFloat(SparkCoins) < parseFloat((given_bill_amt / 100) * 5) ? '["CW", "RW"]' : availableRedeemPoints < 1 ? '["CW","SP"]' : '["CW", "RW", "SP"]';
                    if (CWRadio && given_bill_amt <= CashDeopositWallet) {
                        console.log('Cashwallet');
                        let obj = {
                            obj: {
                                vId: vId,
                                bId: bId,
                                cId: userId,
                                bType: bType,
                                bAmt: amount,
                                bNumber: bNumber.toString(),
                                wType: wallet_type,
                                pType: "RCH",
                                crc: crc,
                                cashbackType: cashBackMethod,
                                cashWalletAmt: amount.toString(),
                                redeemAmt: '0',
                                availPoints: availableRedeemPoints.toString(),
                                spCoins: '0',
                                uniOrderId: orderId.toString(),
                                mobile: phoneNumber,
                                opId: selectedOperatorId,
                                dId: dId,
                                rToken: rToken,
                                dceoId: dceoId,
                                stCode: stCode,
                            }
                        }
                        console.log(obj)
                        let EPaymentdata = encryptPiDataNew(obj);
                        console.log("obj :::", EPaymentdata);
                        setisLoading(true);
                        try {
                            const formData = new FormData();
                            formData.append('payload', EPaymentdata);
                            const response = await fetch(`https://sparkredeem.in/redy/core/api/costflow/new/recharge/kwik`, {
                                method: "POST",
                                body: formData,
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }

                            const data = await response.json();
                            console.log("API Response:", data);

                            if (data.Response?.Success == "1") {
                                let result = data.Response.Result;
                                setSuccessModalVisible(true);
                                setModalMessage("Payment has been successfully done.");
                                return;
                            } else if (data.Response?.Message == "Duplicate Order Found!") {
                                setAlertModalVisible(true);
                                setModalMessage("Duplicate Order Found! Please try again with a different order.");
                                return;
                            } else {
                                console.log("API Response Message:", data.Response.Message);
                                setAlertModalVisible(true);
                                setModalMessage(data.Response.Message);
                                return;
                            }
                        } catch (error) {
                            console.log('Fetch error:', error);
                            setAlertModalVisible(true);
                            setModalMessage("Something went wrong. Please try again.");
                        } finally {
                            setisLoading(false);
                        }
                    }
                    else if (!CWRadio) {
                        if (CashDeopositWallet >= output.neededCw) {
                            console.log('All wallet');
                            let obj = {
                                obj: {
                                    vId: vId,
                                    bId: bId,
                                    cId: userId,
                                    bType: bType,
                                    bAmt: amount,
                                    bNumber: bNumber.toString(),
                                    wType: wallet_type,
                                    pType: "RCH",
                                    crc: crc,
                                    cashbackType: cashBackMethod,
                                    cashWalletAmt: output.neededCw.toString(),
                                    redeemAmt: output.redeemAmt.toString(),
                                    availPoints: availableRedeemPoints.toString(),
                                    spCoins: output.spCoins.toString(),
                                    uniOrderId: orderId.toString(),
                                    mobile: phoneNumber,
                                    opId: selectedOperatorId,
                                    dId: dId,
                                    rToken: rToken,
                                    dceoId: dceoId,
                                    stCode: stCode,
                                }
                            }
                            console.log(obj);
                            setisLoading(true);
                            try {
                                const formData = new FormData();
                                let EPaymentdata = encryptPiDataNew(obj);
                                formData.append('payload', EPaymentdata);
                                const response = await fetch(`https://sparkredeem.in/redy/core/api/costflow/new/recharge/kwik`, {
                                    method: "POST",
                                    body: formData,
                                });
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                const data = await response.json();
                                console.log("API Response:", data);

                                if (data.Response?.Success == "1") {
                                    let result = data.Response.Result;
                                    setSuccessModalVisible(true);
                                    setModalMessage("Payment has been successfully done.");
                                    return;
                                } else if (data.Response?.Message == "Duplicate Order Found!") {
                                    setAlertModalVisible(true);
                                    setModalMessage("Duplicate Order Found! Please try again with a different order.");
                                    return;
                                } else {
                                    console.log("API Response Message:", data.Response.Message);
                                    setAlertModalVisible(true);
                                    setModalMessage(data.Response.Message);
                                    return;
                                }
                            } catch (error) {
                                console.error('Fetch error:', error);
                                setAlertModalVisible(true);
                                setModalMessage("Something went wrong. Please try again.");
                            } finally {
                                setisLoading(false);
                            }
                        }
                        else {
                            setInsuffModal(true);
                            setInsuffFundAmt(Math.ceil(output.neededCw - CashDeopositWallet));
                        }
                    }
                    else {
                        setInsuffModal(true);
                        setInsuffFundAmt(given_bill_amt - CashDeopositWallet);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const Toastss = (a) => {
        Toast.show({
            type: ALERT_TYPE.WARNING,
            title: a == 1 ? 'Choose Upass Type' : a == 2 ? 'Enter Bill Amount' : '',
            textBody: a == 1 ? `Kindly choose Upass type before proceed !` : a == 2 ? 'Please enter bill amount to pay' : a == 3 ? 'Mimimum amount should be ₹100' : a == 4 ? `Amount should be greater than ₹ ${InsuffFundAmt}` : '',
            button: 'close',
            autoClose: 3000,
        })
    }

    const [TopUpAmount, setTopUpAmount] = useState(null);

    const TransferRegex = (text) => {
        const regex = /^[a-zA-Z0-9]*$/;
        const filteredText = text.replace(/[^a-zA-Z0-9]/g, '');
        setTopUpAmount(filteredText);
    };

    const toTopupPage = () => {
        console.log('InsuffFundAmt ', InsuffFundAmt);
        console.log('TopUpAmount ', TopUpAmount);
        if (TopUpAmount < 100) {
            Toastss(3);
        }
        else if (InsuffFundAmt >= Number(TopUpAmount)) {
            Toastss(4);
        }
        else {
            navigation.navigate('TopupRecharge', {
                TopUpAmount: TopUpAmount,
                vId: vId,
                bId: bId,
                bType: bType,
                bAmt: amount,
                bNumber: bNumber.toString(),
                pType: "RCH",
                crc: crc,
                cashbackType: cashBackMethod,
                uniOrderId: orderId.toString(),
                mobile: phoneNumber,
                opId: selectedOperatorId,
                dId: dId,
                rToken: rToken,
                dceoId: dceoId,
                stCode: stCode,
                merchantTransactionId: Math.floor(Math.random() * 111111) + 1,
                CWRadio: CWRadio,
            })
        }
    }


    return (
        <AlertNotificationRoot>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.header}
                    onPress={handleBack}>
                    <Icon name="left" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Payment</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#990099" style={styles.loader} />
                ) : (
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View >
                            <Image
                                source={require('./logo.jpg')}
                                style={styles.logo}
                            />
                            <View style={styles.rowDiv}>
                                <Text style={styles.keyText}>Order Id  :</Text>
                                <Text style={styles.valueText}>{orderId}</Text>
                            </View>
                            <View style={styles.rowDiv1}>
                                <Text style={styles.AmtKeyText}>₹</Text>
                                <Text style={styles.AmtValueText}>{amount ? amount : "0"}</Text>
                            </View>
                        </View>
                        <View style={styles.offerDiv}>
                            <Text style={styles.offerTxt}>You'll get 9% reward on every recharge</Text>
                        </View>
                        <View style={styles.walletContainer}>
                            <Text style={styles.walletContainerHead}>Wallet selection</Text>
                            <View style={styles.walletContainerRow}>
                                <View style={styles.walletKeyDivLeft}>
                                    <Text style={styles.walletKeyText}>Cash wallet</Text>
                                </View>
                                <View style={styles.walletKeyDivMid}>
                                    <Text style={styles.walletText}>₹ {CashDeopositWallet != null ? CashDeopositWallet : "NA"}</Text>
                                </View>
                                <View style={{ height: hp(2.5), width: hp(2.5), borderWidth: 1, borderColor: 'blue', borderRadius: hp(0), justifyContent: 'center', alignItems: 'center', marginLeft: hp(1.5), backgroundColor: '#85c1e9', borderRadius: hp(0.5) }}>
                                    <Image source={require('../../assets/images/Recharge/check-mark.png')} style={{ height: hp(3), width: hp(3), borderRadius: hp(0), tintColor: '#fff', marginTop: hp(-1) }} />
                                </View>
                            </View>
                            <View style={styles.walletContainerRow}>
                                <View style={styles.walletKeyDivLeft}>
                                    <Text style={styles.walletKeyText}>Redeem wallet (Utilize 50%)</Text>
                                </View>
                                <View style={styles.walletKeyDivMid}>
                                    <Text style={styles.walletText}>₹ {availableRedeemPoints != null ? availableRedeemPoints : "NA"}</Text>
                                </View>
                                <TouchableOpacity onPress={() => checkk()} style={{ height: hp(2.5), width: hp(2.5), borderWidth: 1, borderColor: 'blue', borderRadius: hp(0), justifyContent: 'center', alignItems: 'center', marginLeft: hp(1.5), backgroundColor: '#85c1e9', borderRadius: hp(0.5) }}>
                                    {
                                        !CWRadio ?
                                            <Image source={require('../../assets/images/Recharge/check-mark.png')} style={{ height: hp(3), width: hp(3), borderRadius: hp(0), tintColor: '#fff', marginTop: hp(-1) }} />
                                            :
                                            <></>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.walletContainerRow}>
                                <View style={styles.walletKeyDivLeft}>
                                    <Text style={styles.walletKeyText}>Spark coins (Utilize 5%)</Text>
                                </View>
                                <View style={styles.walletKeyDivMid}>
                                    <Text style={styles.walletText}>₹ {SparkCoins != null ? SparkCoins : "NA"}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.bottomBtnDiv}>
                            <TouchableOpacity style={getButtonStyle('TU')} onPress={() => handlePress('1000')}>
                                <Text style={styles.bottomBtnText1}>1000</Text>
                                <Text style={styles.bottomBtnText1}>U-Pass</Text>
                                <Text style={styles.bottomBtnText2}>(Reward Program)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={getButtonStyle('I')} onPress={() => handlePress('Instant')}>
                                <Text style={styles.bottomBtnText1}>Instant</Text>
                                <Text style={styles.bottomBtnText1}>Cashback</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.payBtn} onPress={Pay}>
                            <Text style={styles.bottomBtnText1}>Pay</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp(10) }}></View>
                    </ScrollView>
                )}

                {/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=- modal for api response =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/}
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
                                <View style={styles.gradient}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.AddNewTitle}>Alert</Text>
                                        <Text style={styles.AddNewTitle}>{modalMessage}</Text>
                                        <TouchableOpacity style={{ marginRight: hp(3), }} onPress={() => setAlertModalVisible(false)}>
                                            <Text style={{
                                                color: '#fff',
                                                backgroundColor: '#990099',
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

                {/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=- modal for Success =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={SuccessModalVisible}
                    onRequestClose={() => {
                        setSuccessModalVisible(false);
                    }}
                >
                    <View style={{ height: hp(100), width: wp(100), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ height: hp(30), width: wp(70), backgroundColor: '#fff', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/Recharge/checked.png')} style={{ height: hp(8), width: hp(8) }} />
                            <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '700', marginTop: hp(2) }}>Recharge Success!</Text>
                            <TouchableOpacity onPress={() => { setSuccessModalVisible(false); navigation.navigate('Home') }} style={{ padding: hp(0.5), width: wp(20), backgroundColor: '#fcb713', borderRadius: hp(1), position: 'absolute', bottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp(2), color: '#000', fontWeight: '600' }}>Done</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

                {/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=- Insufficient fund =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={InsuffModal}
                    onRequestClose={() => {
                        setInsuffModal(false);
                    }}
                >
                    <View style={{ height: hp(100), width: wp(100), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ height: hp(30), width: wp(70), backgroundColor: '#fff', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/Recharge/warning-sign.png')} style={{ height: hp(8), width: hp(8) }} />
                            <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '700', marginTop: hp(2) }}>Insufficient Balance</Text>
                            <TouchableOpacity onPress={() => { setInsuffModal(false); setTopUpModal(true) }} style={{ padding: hp(0.5), width: wp(25), backgroundColor: '#fcb713', borderRadius: hp(1), position: 'absolute', bottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp(2), color: '#000', fontWeight: '600' }}>Top up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* ====================================================== Modal for TopUp  =========================================================================================================================================================================== */}
                <Modal
                    animationType="slide"
                    transparent
                    visible={TopUpModal}
                    onRequestClose={() => {
                        setTopUpModal(!TopUpModal);
                    }}>
                    <Pressable onPress={() => setTopUpModal(false)} style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <Pressable onPress={() => setTopUpModal(true)} style={{ height: hp(35), width: wp(90), backgroundColor: '#fff', borderRadius: hp(2), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp(3), color: "#000", fontFamily: 'DMSans-Medium' }}> Top up & Pay</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1) }}>
                                <Text style={{ fontSize: hp(1.8), color: "#000", fontFamily: 'DMSans-Medium' }}>Enter the Amount</Text>
                                <Tinput
                                    mode='outlined'
                                    label={"Enter the amount"}
                                    autoCapitalize="characters"
                                    textColor="red"
                                    style={{ width: wp(80), backgroundColor: "#fff", fontSize: hp(1.8), fontFamily: 'DMSans-Medium' }}
                                    contentStyle={{ color: "#000", height: hp(6), }}
                                    outlineStyle={{ backgroundColor: "transparent", borderColor: "#bdbcbc", borderRadius: hp(1), borderWidth: 1, }}
                                    fontFamily={styles.font}
                                    keyboardType='number-pad'
                                    maxLength={10}
                                    editable={true}
                                    value={TopUpAmount}
                                    onChangeText={(text) => TransferRegex(text)}
                                />
                            </View>
                            <View style={{ height: hp(5), justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: hp(2), color: '#000' }}>Min ₹100</Text></View>
                            <View style={{ justifyContent: 'center', height: hp(10), alignItems: 'center', padding: hp(2), marginTop: hp(0) }}>
                                <TouchableOpacity onPress={() => { toTopupPage() }} style={{ height: hp(4), width: wp(25), backgroundColor: '#fcb713', alignItems: 'center', justifyContent: 'center', borderRadius: hp(1) }}><Text style={{ color: 'black', fontSize: hp(2), fontWeight: 'bold', fontFamily: 'DMSans-Medium' }}>Top Up</Text></TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => setTopUpModal(false)} style={{ height: hp(3), width: hp(3), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: hp(10), position: 'absolute', top: -5, right: -5 }}>
                                <Text style={{ color: '#fff', fontSize: hp(2) }}>X</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>
            </SafeAreaView>
        </AlertNotificationRoot>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp(100),
        backgroundColor: '#fff',
        padding: hp(2),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        fontSize: hp(2.5),
        color: "#000"
    },
    loader: {
        fontSize: hp(3),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(35)
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
    body: {
        marginTop: hp(2)
    },
    logo: {
        height: hp(16),
        width: hp(16),
        borderRadius: hp(8),
        alignSelf: 'center',
        marginTop: hp(3),
    },
    input: {
        width: wp(50),
        height: hp(6),
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: 'center',
        fontSize: hp(2.5),
        alignSelf: 'center',
        backgroundColor: '#ededed'
    },
    rowDiv: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: hp(5),
    },
    rowDiv1: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: hp(2),
    },
    keyText: {
        fontSize: hp(2),
        color: '#000',
        fontWeight: '700',
    },
    valueText: {
        fontSize: hp(2),
        color: '#545454',
        fontWeight: '700',
        marginLeft: hp(1)
    },
    AmtKeyText: {
        fontSize: hp(3.2),
        color: '#fcb713',
        fontWeight: '700',
    },
    AmtValueText: {
        fontSize: hp(3),
        color: '#545454',
        fontWeight: '700',
        marginLeft: hp(1)
    },
    offerTxt: {
        color: "#fff",
        alignSelf: 'center',
        textAlign: 'center',
        paddingVertical: hp(1),
        paddingHorizontal: hp(3),
        fontSize: hp(2),
        color: "#000",
        fontWeight: '500'
    },
    offerDiv: {
        backgroundColor: 'rgba(130, 0, 166, 0.3)',
        marginTop: hp(1),
        alignSelf: 'center',
        borderRadius: hp(1),
        borderColor: '#9d02c9',
        borderStyle: 'solid',
        borderWidth: hp(0.15)
    },
    walletContainer: {
        backgroundColor: 'rgba(0, 161, 11, 0.4)',
        padding: hp(2),
        marginTop: hp(2.5),
        borderRadius: hp(1.5),
        borderStyle: 'solid',
        borderWidth: hp(0.1),
        borderColor: '#026909',
    },
    walletContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(0.3)
    },
    walletKeyDivLeft: {
        // backgroundColor: 'red',
        width: wp(55),
    },
    walletKeyDivMid: {
        // backgroundColor: '#fcb713',
        width: wp(22),
    },
    walletKeyDivRight: {
        // backgroundColor: 'green',
        width: wp(10),
    },
    walletKeyText: {
        fontSize: hp(1.9),
        color: '#000',
    },
    walletText: {
        fontSize: hp(1.9),
        color: '#000',
    },
    bottomBtn: {
        borderStyle: 'solid',
        borderColor: 'gray',
        borderWidth: hp(0.2),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: hp(1),
        borderRadius: hp(1),
        height: hp(11),
        width: wp(44),
    },
    bottomBtnText1: {
        fontSize: hp(2),
        color: '#000',
        fontWeight: '600',
    },
    bottomBtnText2: {
        fontSize: hp(1.3),
        color: 'gray',
    },
    bottomBtnDiv: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-around',
        marginTop: hp(2),
    },
    walletContainerHead: {
        fontSize: hp(1.8),
        color: '#000',
        backgroundColor: '#fcb713',
        alignSelf: "flex-start",
        paddingHorizontal: hp(2),
        paddingVertical: hp(0.5),
        borderRadius: hp(1),
        borderStyle: 'solid',
        borderColor: 'gray',
        borderWidth: hp(0.2),
    },
    payBtn: {
        backgroundColor: '#fcb713',
        alignSelf: 'center',
        paddingHorizontal: hp(8),
        paddingVertical: hp(1),
        marginTop: hp(2.5),
        borderRadius: hp(1),
        borderStyle: 'solid',
        borderColor: 'cc9d02',
        // borderWidth: hp(0.1),
        elevation: 5,
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
        marginVertical: hp(2),
        textAlign: 'center'
    },
    lottieIcon: {
        height: hp(10),
        width: hp(10),
        marginTop: hp(4)
    },
})