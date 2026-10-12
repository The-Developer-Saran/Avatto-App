import { BackHandler, Platform, Pressable, Image, StyleSheet, TouchableWithoutFeedback, Text, Modal, TouchableOpacity, View, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { BaseUrl3, BaseUrl6, BaseUrl7, Env, MId, Salt } from '../BaseUrl';
import { useSelector } from 'react-redux';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import { sha256 } from 'react-native-sha256';
import { encode, decode } from 'base-64';
import LottieView from 'lottie-react-native';
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decryptPiDataNew, encryptPiDataNew } from '../EmployeeLogin/encryption';
import ApiAndroidToast from '../androidToast/androidToast';
import { CDeviceId } from '../DeviceId/DeviceId';
import { ActivityIndicator } from 'react-native-paper';

const TopupRecharge = ({ navigation }) => {


    const route = useRoute();
    const user = useSelector(state => state.user.value);

    const merchantTransactionId = route.params?.merchantTransactionId;
    const TopUpAmount = route.params?.TopUpAmount;
    const vId = route.params?.vId;
    const bId = route.params?.bId;
    const bType = route.params?.bType;
    const bAmt = route.params?.bAmt;
    const given_bill_amt = route.params?.bAmt;
    const bNumber = route.params?.bNumber;
    const pType = route.params?.pType;
    const crc = route.params?.crc;
    const cashbackType = route.params?.cashbackType;
    const uniOrderId = route.params?.uniOrderId;
    const mobileNo = route.params?.mobile;
    const opId = route.params?.opId;
    const dId = route.params?.dId;
    const rToken = route.params?.rToken;
    const dceoId = route.params?.dceoId;
    const stCode = route.params?.stCode;
    const CWRadio = route.params?.CWRadio;

    const environmentDropDownValue = Env;
    const [appId, setAppId] = useState(null);
    const merchantId = MId;
    let packageName = 'com.sparkredeem';
    let appSchema = null;
    let apiEndPoint = "/pg/v1/pay";
    let salt = Salt;
    let saltIndex = 1;

    const [modalMessage, setModalMessage] = useState('');
    const [AlertModalVisible, setAlertModalVisible] = useState(false);
    const [SuccessModalVisible, setSuccessModalVisible] = useState(false);

    // console.log('<-------------------------------------------------->');
    // console.log('vId ', vId);
    // console.log('bId ', bId);
    // console.log('bType ', bType);
    // console.log('bAmt ', bAmt);
    // console.log('bNumber ', bNumber);
    // console.log('pType ', pType);
    // console.log('crc ', crc);
    // console.log('cashbackType ', cashbackType);
    // console.log('uniOrderId ', uniOrderId);
    // console.log('mobileNo ', mobileNo);
    // console.log('opId ', opId);
    // console.log('dId ', dId);
    // console.log('rToken ', rToken);
    // console.log('dceoId ', dceoId);
    // console.log('stCode ', stCode);


    const Payment = async ({ neededCw, redeemAmt, spCoins }, { availableRedeemPoints, CashDeopositWallet, SparkCoins }) => {
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
                            cId: user.userid,
                            bType: bType,
                            bAmt: bAmt,
                            bNumber: bNumber.toString(),
                            wType: wallet_type,
                            pType: "RCH",
                            crc: crc,
                            cashbackType: cashbackType,
                            cashWalletAmt: bAmt.toString(),
                            redeemAmt: '0',
                            availPoints: availableRedeemPoints.toString(),
                            spCoins: '0',
                            uniOrderId: uniOrderId.toString(),
                            mobile: mobileNo,
                            opId: opId,
                            dId: dId,
                            rToken: rToken,
                            dceoId: dceoId,
                            stCode: stCode,
                        }
                    }
                    console.log(obj)
                    let EPaymentdata = encryptPiDataNew(obj);
                    console.log("obj :::", EPaymentdata);
                    try {
                        const formData = new FormData();
                        formData.append('payload', EPaymentdata);
                        const response = await fetch(`${BaseUrl7}/core/api/costflow/new/recharge/kwik`, {
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
                    }
                }
                else if (!CWRadio) {
                    console.log('All wallet');
                    let obj = {
                        obj: {
                            vId: vId,
                            bId: bId,
                            cId: user.userid,
                            bType: bType,
                            bAmt: bAmt,
                            bNumber: bNumber.toString(),
                            wType: wallet_type,
                            pType: "RCH",
                            crc: crc,
                            cashbackType: cashbackType,
                            cashWalletAmt: neededCw.toString(),
                            redeemAmt: redeemAmt.toString(),
                            availPoints: availableRedeemPoints.toString(),
                            spCoins: spCoins.toString(),
                            uniOrderId: uniOrderId.toString(),
                            mobile: mobileNo,
                            opId: opId,
                            dId: dId,
                            rToken: rToken,
                            dceoId: dceoId,
                            stCode: stCode,
                        }
                    }
                    console.log(obj);
                    try {
                        const formData = new FormData();
                        let EPaymentdata = encryptPiDataNew(obj);
                        formData.append('payload', EPaymentdata);
                        const response = await fetch(`${BaseUrl7}/core/api/costflow/new/recharge/kwik`, {
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
                    }
                }
                else {
                    navigation.navigate('PayTM')
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    //=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=- getRedeemAmtValidation func  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    const getRedeemAmtValidation = (given_bill_amt, availableRedeemPoints, CashDeopositWallet, SparkCoins) => {
        let calcPercentage = (percent, total) => {
            return ((percent / 100) * total).toFixed(2);
        };
        const spPercentage = 5;
        const rwPercentage = 50;
        let {
            neededSP,
            neededRw,
            neededCw,
            spCoins,
            redeemAmt,
        } = 0;
        let billAmt = parseFloat(String(given_bill_amt));
        let actualRedeemPoints = parseFloat(String(availableRedeemPoints));
        let actualCashAmt = parseFloat(String(CashDeopositWallet));
        let actualSparkCoins = parseFloat(String(SparkCoins));
        neededSP = calcPercentage(spPercentage, billAmt);
        neededRw = calcPercentage(rwPercentage, billAmt);

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
            //console.log("costflow api calling");
        } else {
            //console.log("Add Money to Continue")
        }

        return calc;
    }
    //=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=- Wallet Api  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const WalletData = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                let data = JSON.parse(value);
                const walletdata = new FormData();
                walletdata.append("uId", data.id);
                const response = await fetch(`${BaseUrl7}/core/api/user/wallet/points`, {
                    method: 'POST',
                    body: walletdata,
                });
                return response.json()
                    .then(responseData => {
                        console.log(responseData)
                        if (responseData.Response.Success == 1) {
                            let walletobj = {
                                availableRedeemPoints: parseFloat(responseData?.Response.Result.wallet.availRedeemAmt),
                                CashDeopositWallet: parseFloat(responseData?.Response.Result.CashDeopositWallet),
                                AvailablePoints: parseFloat(responseData?.Response.Result.wallet.availRedeemAmt),
                                SparkCoins: parseFloat(responseData?.Response.Result.wallet.availExtraPoints)
                            }
                            return walletobj;
                        }
                        else {
                            console.log("Status unavailable");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        throw error;
                    });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const Func = async () => {
        let walletDetails;
        await WalletData().then((cashDeposit) => {
            walletDetails = cashDeposit;
        })
            .catch((error) => {
                console.log(error)
            });
        console.log(walletDetails);
        const topUp = getRedeemAmtValidation(bAmt, walletDetails.availableRedeemPoints, walletDetails.CashDeopositWallet, walletDetails.SparkCoins);
        console.log(topUp);
        if (walletDetails.CashDeopositWallet >= topUp.neededCw) {
            Payment(topUp, walletDetails);
        }
        else {
            alert('Insufficient Amount');
        }
    }


    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  Get App Id  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const getPackageSignatureForAndroid = async () => {
        if (Platform.OS === 'android') {
            try {
                const packageSignature = await PhonePePaymentSDK.getPackageSignatureForAndroid();
                console.log(packageSignature);
                return JSON.stringify(packageSignature);
            } catch (error) {
                console.log("error:", error.message);
                return null; // Return null or handle the error as needed
            }
        }
        return null;
    };
    //=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=- phonePay/redirect Api  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const FinalApi = async (ctype) => {
        console.log('merchantTransactionId ', merchantTransactionId);
        const response = await fetch(`${BaseUrl7}/phonePay/redirect?mTransId=${merchantTransactionId}&mTransUid=${user.userid}&mTransType=${ctype}`, {
            method: 'GET',
        });
        response.json()
            .then(responseData => {
                console.log('Redirect api response  ------->');
                console.log(responseData);
                if (responseData?.Response.Success == 1) {
                    Func();
                }
                else {
                }
            })
            .catch(error => {
                console.log('Error parsing JSON:', error);
            });
    }
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- startTransaction =-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const handleStartTransaction = (mobile, charges, ctype, amtt) => {
        const bodyobj = {
            "merchantId": merchantId,
            "merchantTransactionId": `${merchantTransactionId}`,
            "merchantUserId": `${user.userid}`,
            "amount": amtt,
            "callbackUrl": `${BaseUrl7}/phonePay/callback/response`,
            "mobileNumber": mobile,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            },
            "deviceContext": { "deviceOS": "ANDROID" }
        }
        const jsonstr = JSON.stringify(bodyobj);
        const base64data = encode(jsonstr);
        sha256(base64data + apiEndPoint + salt).then((hash) => {
            PhonePePaymentSDK.startTransaction(
                base64data,
                hash.toString() + '###' + saltIndex,
                packageName,
                appSchema,
            ).then(a => {
                console.log(JSON.stringify(a))
                if (a.status == "SUCCESS") {
                    FinalApi(ctype)
                }
                else {
                    setUsercancelled(true)
                }
            }).catch(error => {
                console.log(error)
            })
        });
    };
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- initPhonePeSDK  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const initPhonePeSDK = async (mobile, charges, ctype, amtt) => {

        let appId = await getPackageSignatureForAndroid();
        console.log('appId ', appId);

        PhonePePaymentSDK.init(
            environmentDropDownValue,
            merchantId,
            appId,
            true
        ).then(result => {
            console.log("Message: SDK Initialisation ->" + JSON.stringify(result));
            handleStartTransaction(mobile, charges, ctype, amtt);
        }).catch(error => {

            // setMessage("error:" + error.message);
            console.log(error)
        })
    };
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Initite payment //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const initiatePayment = async (mobile, charges, ctype) => {

        let TransactionAmtwithTax = (charges * Number(TopUpAmount)) / 100;
        let TransactionAmtrupee = parseFloat(TopUpAmount * 100);
        let TransactionAmtpaise = parseFloat(TransactionAmtwithTax * 100);
        let amtt = TransactionAmtrupee + TransactionAmtpaise;
        console.log('initiatePayment amtt ', amtt);

        const inputdata = new FormData;
        inputdata.append('mTransId', merchantTransactionId);
        inputdata.append('mTransUid', user.userid);
        inputdata.append('mTransType', ctype);
        inputdata.append('mTransAmt', amtt);

        const response = await fetch(`${BaseUrl7}/phonePay/payment/initiate`, {
            method: 'POST',
            body: inputdata
        });
        response.json()
            .then(responseData => {
                console.log('Initiate Payment response =========>>');
                console.log(responseData);
                if (responseData?.Response.Success == 1) {
                    initPhonePeSDK(mobile, charges, ctype, amtt);
                }
            })
            .catch(error => {
                console.log('Error parsing JSON:', error);
            });
    }

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  Get Mobile number  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const [mobile, setMobile] = useState(null);
    const getMobile = async (charges, ctype) => {
        const response = await fetch(`${BaseUrl3}/profile_data/${user.userid}`, {
            method: 'GET',
        });
        response.json()
            .then(responseData => {
                if (responseData?.Response.Success == 1) {
                    setMobile(responseData?.Response.Result[0].mobile);
                    initiatePayment(responseData?.Response.Result[0].mobile, charges, ctype);
                }
            })
            .catch(error => {
                console.log('Error parsing JSON:', error);
            });
    }
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-  Get Card charges  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-
    const [charges, setCharges] = useState(null);
    const getCharges = async () => {
        const response = await fetch(`${BaseUrl7}/phonePay/payment/charges`, {
            method: 'GET',
        });
        response.json()
            .then(responseData => {
                if (responseData?.Response.Success == 1) {
                    setCharges(parseFloat(responseData?.Response.Result[2].payCharge));
                    getMobile(parseFloat(responseData?.Response.Result[2].payCharge), responseData.Response.Result[2].payType);
                }
            })
            .catch(error => {
                console.log('Error parsing JSON:', error);
            });
    }

    useEffect(() => {
        getCharges();
    }, [])


    return (
        <View style={{ height: hp(100), width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: hp(4), width: hp(4), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, borderRadius: hp(2) }}>
                <ActivityIndicator color='#fcb713' size={'small'} />
            </View>
            <Text style={{ marginTop: hp(2), fontSize: hp(2) }}>Processing Payment ... </Text>

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
                        <Image source={require('../../Images/checked.png')} style={{ height: hp(8), width: hp(8) }} />
                        <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '700', marginTop: hp(2) }}>Recharge Success!</Text>
                        <TouchableOpacity onPress={() => { setSuccessModalVisible(false); navigation.navigate('Home') }} style={{ padding: hp(0.5), width: wp(20), backgroundColor: '#fcb713', borderRadius: hp(1), position: 'absolute', bottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp(2), color: '#000', fontWeight: '600' }}>Done</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </View>
    )
}

export default TopupRecharge

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