import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, FlatList, ActivityIndicator, ScrollView, StatusBar, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
// import { Modal } from "react-native-paper";
import { useSelector } from "react-redux";
import { decryptPiDataNew, encryptPiDataNew } from "../Encryption/encryption";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../BaseUrl/BaseUrl";
import { Authentication_Key } from "../../key/Key";

export default function MobileNumberScreen() {

    const EncKey = encryptPiDataNew(Authentication_Key)
    const isFocused = useIsFocused();

    const navigation = useNavigation();
    const textInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [AlertModalVisible, setAlertModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCity, setSelectedCity] = useState("")
    const [selectedCityCode, setSelectedCityCode] = useState("")
    const [circleListModalVisible, setCircleListModalVisible] = useState(false);
    const [circleList, setCircleList] = useState([]);

    const [NewAlertModalVisible, setNewAlertModalVisible] = useState(false);
    const [OperatorModalVisible, setOperatorModalVisible] = useState(false);
    const [planModalVisible, setPlanModalVisible] = useState(false);
    const [NewmodalMessage, setNewModalMessage] = useState('');
    const [operatoeList, setOperatoeList] = useState([]);
    const [selectedOperatorId, setSelectedOperatorId] = useState("");
    const [selectedOperatorIdName, setSelectedOperatorName] = useState("");
    const [amount, setAmount] = useState('');
    const [planList, setPlanList] = useState({});
    const [Uid, setUid] = useState(null);

    // console.log("Uid", Uid);
    //   alert(amount)

    // const user = useSelector(state => state.user.value);

    // console.log("selectedOperatorId", selectedOperatorId);




    const handleOpenPlans = () => {
        setPlanModalVisible(true)
    }



    const closePlanModal = () => {
        setPlanModalVisible(false);
    };



    const [getcircle_name, setGetcircle_name] = useState("");
const [getprovider, setGetprovider] = useState("");
const [getcircle_code, setGetcircle_code] = useState("");
const [getopid, setGetopid] = useState("");

    console.log("phoneNumber", phoneNumber);
    console.log("getcircle_name", getcircle_name);
    console.log("getprovider", getprovider);
    console.log("getcircle_code", getcircle_code);
    console.log("getopid", getopid);

useEffect(() => {
    if (isFocused) {
        User_Operator_Details_Get();
    }
}, [isFocused, phoneNumber,getcircle_name,getprovider,getcircle_code,getopid]);

const User_Operator_Details_Get = async () => {
    try {
        const value = await AsyncStorage.getItem('user');

        if (value !== null) {
            setUid(value);
            try {
                const response = await fetch(
                    `${BaseUrl}operator_fetch?mobile=${phoneNumber}`,
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

                if (data.Response.Success === '1' && data.Response.Result?.details) {
                    const { circle_name = '', provider = '', circle_code = '', opid = '' } = data.Response.Result.details;

                    setGetcircle_name(circle_name);
                    setGetprovider(provider);
                    setGetcircle_code(circle_code);
                    setGetopid(opid);
                } else {
                    console.log(data?.Response?.Message || 'Unknown error');
                }
            } catch (error) {
                console.error('Fetch error:', error.Message);
            }
        } else {
            console.log('No user data found in AsyncStorage.');
        }
    } catch (error) {
        console.error('Error reading AsyncStorage:', error.Message);
    }
};



    // const [getcircle_name, setGetcircle_name] = useState("");
    // const [getprovider, setGetprovider] = useState("");
    // const [getcircle_code, setGetcircle_code] = useState("");
    // const [getopid, setGetopid] = useState("");


    // console.log("phoneNumber", phoneNumber);
    // console.log("getcircle_name", getcircle_name);
    // console.log("getprovider", getprovider);
    // console.log("getcircle_code", getcircle_code);
    // console.log("getopid", getopid);



    // useEffect(() => {
    //     if (isFocused) {
    //         User_Operator_Details_Get();
    //     }
    // }, [isFocused, phoneNumber]);

    // const User_Operator_Details_Get = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

    //         if (value !== null) {
    //             // alert(value)
    //             setUid(value)
    //             try {
    //                 const response = await fetch(
    //                     `${BaseUrl}operator_fetch?mobile=${phoneNumber}`,
    //                     {
    //                         method: 'GET',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             authentication: EncKey,
    //                         },
    //                     }
    //                 );
    //                 // console.log("response",response);

    //                 if (!response.ok) {
    //                     throw new Error(`Network response was not ok: ${response.status}`);
    //                 }

    //                 const data = await response.json();
    //                 console.log("data :::>>>", data.Response);

    //                 if (data.Response.Success === '1') {
    //                     setGetcircle_name(data.Response.Result.details.circle_name || '');
    //                     setGetprovider(data.Response.Result.details.provider || '');
    //                     setGetcircle_code(data.Response.Result.details.circle_code || '');
    //                     setGetopid(data.Response.Result.details.opid || '');
    //                 } else {
    //                     console.log(data?.Response?.Message || 'Unknown error');
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
    // };


    // const NewhandleSelectOperator = async (operator) => {
    //     const name = operator.operator_name;
    //     setSelectedOperatorId(operator.operator_id);
    //     setSelectedOperatorName(name);
    //     setOperatorModalVisible(false);

    //     // const enc_city_code = encryptPiDataNew(selectedCityCode);
    //     // const enc_opId = encryptPiDataNew(operator.operator_id);

    //     // const url = `https://sparkredeem.in/sparky/plansget?statecode=${enc_city_code}&opid=${enc_opId}`;

    //     const url = `https://sparkredeem.com/avatto/getPlan?statecode=${selectedCityCode}&opid=${operator.operator_id}`;

    //     try {
    //         setIsLoading(true)
    //         if (!selectedCityCode) {
    //             setAlertModalVisible(true);
    //             setNewModalMessage("Error fetching your state.");
    //             return;
    //         }

    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json"
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();
    //         // const finalResult = decryptPiDataNew(data.Response.Result);
    //         const finalResult = data.Response.Result;
    //         console.log("PLANS ::::", finalResult);


    //         if (finalResult.success == true) {
    //             const plans = finalResult.plans;
    //             setPlanList(plans);
    //             console.log("FINAL DATA 22222 ::::", data.Response.Result.success);
    //         } else {
    //             setPlanList({})
    //             setAlertModalVisible(true);
    //             setNewModalMessage("At the moment, there are no plans available for this network.");
    //             console.log(data?.Response.Message);
    //         }
    //     } catch (error) {
    //         console.error('Fetch error:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    const ChoosePlanData = async () => {
        try {

            setIsLoading(true);
            const url = `${BaseUrl}getPlan?statecode=${getcircle_code}&opid=${getopid}`;
            setIsLoading(true);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authentication": EncKey
                }
            });
            console.log("response", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const finalResult = data.Response?.Result;

            if (finalResult?.success) {
                setPlanModalVisible(true);
                setPlanList(finalResult.plans || {});
                console.log("PLANS:", finalResult);
            } else {
                setPlanList({});
                setAlertModalVisible(true);
                setNewModalMessage("At the moment, there are no plans available for this network.");
                console.log(data?.Response?.Message || "No plans available");
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setAlertModalVisible(true);
            setNewModalMessage("An error occurred while fetching plans. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    const NewhandleSelectOperator = async (operator) => {
        try {
            if (!selectedCityCode) {
                setAlertModalVisible(true);
                setNewModalMessage("Error fetching your state.");
                return;
            }

            const name = operator.operator_name;
            setSelectedOperatorId(operator.operator_id);
            setSelectedOperatorName(name);
            setOperatorModalVisible(false);

            const url = `${BaseUrl}getPlan?statecode=${selectedCityCode ? selectedCityCode : getcircle_code}&opid=${operator.operator_id ? operator.operator_id : getopid}`;
            setIsLoading(true);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authentication": EncKey
                }
            });
            console.log("response", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const finalResult = data.Response?.Result;

            if (finalResult?.success) {
                setPlanList(finalResult.plans || {});
                console.log("PLANS:", finalResult);
            } else {
                setPlanList({});
                setAlertModalVisible(true);
                setNewModalMessage("At the moment, there are no plans available for this network.");
                console.log(data?.Response?.Message || "No plans available");
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setAlertModalVisible(true);
            setNewModalMessage("An error occurred while fetching plans. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleSelectPlan = (item) => {
        console.log("Selected Item price :::", item.rs);
        setAmount(String(item.rs));
        setPlanModalVisible(false);
    };



    const handleAmountChange = (text) => {
        setAmount(text);
    };



    const fetchData = async () => {
        setIsLoading(true);
        // const url = `https://sparkredeem.in/sparky/circle_code`;
        const url = `${BaseUrl}getCircle`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authentication": EncKey
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data?.Response.Success == '1') {
                // setCircleList(decryptPiDataNew(data?.Response.Result))
                setCircleList(data?.Response.Result);
            } else {
                console.log(data?.Response.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const NewfetchData = async () => {
        setIsLoading(true);
        // const url = `https://sparkredeem.in/sparky/operator_codes`;
        const url = `${BaseUrl}getBiller?serviceType=Prepaid`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authentication": EncKey
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data?.Response.Success == '1') {
                // const decrypt_Data = decryptPiDataNew(data?.Response.Result);
                const decrypt_Data = data?.Response.Result;
                const filterData = decrypt_Data.filter(item => item.service_type == 'Prepaid');
                setOperatoeList(filterData)
                // console.log("operatoe lists :::", filterData);

            } else {
                console.log(data?.Response.Message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };





    useEffect(() => {
        NewfetchData();
    }, []);




    const [History, setHistory] = useState(null);

    const getHistory = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                setUid(value)

                try {
                    const response = await fetch(`https://sparkredeem.in/sparky/recent/recharge/get?user_id=${value}`, {
                        method: 'GET',
                    });
                    response.json()
                        .then(responseData => {
                            console.log(responseData);
                            if (responseData.Response.Success == 1) {
                                setHistory(responseData.Response.Result);
                            }
                            else {
                                console.log(responseData.Response.Message);
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
        getHistory()
    }, [])






    const handlePhoneNumberChange = (text) => {
        const cleanedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        const firstDigit = cleanedText.charAt(0);
        const restOfNumber = cleanedText.slice(1);
        if (cleanedText.length <= 10 && (!firstDigit || (firstDigit >= '6' && firstDigit <= '9'))) {
            setPhoneNumber(cleanedText);
        }
    };

    // const submitButton = async () => {
    //     if (!phoneNumber) {
    //         setAlertModalVisible(true);
    //         setModalMessage("Please enter mobile number.");
    //         return;
    //     }
    //     if (phoneNumber.length !== 10) {
    //         setAlertModalVisible(true);
    //         setModalMessage("Please enter a valid mobile number.");
    //         return;
    //     }
    //     if (!selectedCity) {
    //         setAlertModalVisible(true);
    //         setModalMessage("Please select your state.");
    //         return;
    //     }
    //     if (!selectedOperatorId) {
    //         setAlertModalVisible(true);
    //         setModalMessage("Please select your network to select plan.");
    //         return;
    //     }
    //     if (!amount) {
    //         setAlertModalVisible(true);
    //         setModalMessage("Please enter a amount or select any plan before payment process.");
    //         return;
    //     }
    //     const enc_phoneNumber = encryptPiDataNew(phoneNumber)

    //     const url = `https://sparkredeem.in/sparky/operator_fetch?number=${enc_phoneNumber}`;
    //     try {
    //         setIsLoading(true)
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json"
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();
    //         console.log("data of the mobile number :::", data);

    //         if (data?.Response.Success == '1') {
    //             const dataInit = decryptPiDataNew(data?.Response.Result);
    //             const network = dataInit.details;
    //             console.log("final details :::", network);

    //             // navigation.navigate('SelectPlan', { phoneNumber, network, selectedCityCode });
    //             navigation.navigate('ConfirmPage', { phoneNumber, selectedCityCode, selectedOperatorId, amount, selectedOperatorIdName })
    //         } else {
    //             console.log(data?.Response.Message);
    //         }
    //     } catch (error) {
    //         setIsLoading(false)
    //         console.error('Fetch error:', error);
    //     } finally {
    //         setIsLoading(false)
    //     }
    // };




    const submitButton = async () => {

        const formData = new FormData();
        formData.append("uId", Uid);
        formData.append("number", phoneNumber);
        formData.append("state_code", selectedCityCode ? selectedCityCode : getcircle_code);
        formData.append("opid", selectedOperatorId ? selectedOperatorId : getopid);
        formData.append("amount", amount);
        // formData.append("uId", Uid);
        // formData.append("number", phoneNumber);
        // formData.append("state_code", getcircle_code ? getcircle_code : selectedCityCode);
        // formData.append("opid", getopid ? getopid : selectedOperatorId);
        // formData.append("amount", amount);

        console.log("formData", formData);


        if (!phoneNumber) {
            setAlertModalVisible(true);
            setModalMessage("Please enter mobile number.");
            return;
        }
        if (phoneNumber.length !== 10) {
            setAlertModalVisible(true);
            setModalMessage("Please enter a valid mobile number.");
            return;
        }
        // if (!selectedCity || ! getcircle_name) {
        //     setAlertModalVisible(true);
        //     setModalMessage("Please select your state.");
        //     return;
        // }
        // if (!selectedOperatorId || !getopid) {
        //     setAlertModalVisible(true);
        //     setModalMessage("Please select your network to select plan.");
        //     return;
        // }
        if (!selectedCity && !getcircle_name) {
            setAlertModalVisible(true);
            setModalMessage("Please select your state.");
            return;
        }

        if (!selectedOperatorId && !getopid) {
            setAlertModalVisible(true);
            setModalMessage("Please select your network to select plan.");
            return;
        }
        if (!amount) {
            setAlertModalVisible(true);
            setModalMessage("Please enter a amount or select any plan before payment process.");
            return;
        }
        try {
            const response = await fetch(`${BaseUrl}recharge_initiate`, {
                method: "POST",
                headers: {
                    "authentication": EncKey
                },
                body: formData
            });
console.log("formData",formData);

            const data = await response.json();
            console.log('response', data);

            if (data.Response.Success == "1") {
                const Orderid = data.Response.Result.order_id
                console.log("Orderid=======>", Orderid);

                // Alert.alert("Success", data.Response.Message);
                // setSuccessModal(true)
                navigation.navigate('ConfirmPage', { phoneNumber, selectedCityCode, selectedOperatorId, amount, selectedOperatorIdName, Orderid,getcircle_code,getopid })
            } else {
                Alert.alert("Error", data.Response.Message || "Failed to Initiate Recharge.");
            }
        } catch (error) {
            setIsLoading(false)
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false)
        }
    };


    const handleOpenCircleList = () => {
        setCircleListModalVisible(true)
    }


    const handleSelectOperator = (operator) => {
        setSelectedCity(operator);
        setSelectedCityCode(operator.circle_code)
        setCircleListModalVisible(false);
        // console.log("selected city :", operator.circle_code);
    };

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('MobileNumberScreen')
        }
    }

    const handleOpenOperator = () => {
        setOperatorModalVisible(true)
    }







    // const Initiate_Recharge = async () => {
    //     // const { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state } = form;

    //     // if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
    //     //     Alert.alert("Error", "Please fill in all fields.");
    //     //     return;
    //     // }

    //     // setLoading(true);

    //     const formData = new FormData();
    //     formData.append("uId", Uid);
    //     formData.append("number", mobile);
    //     formData.append("state_code", email);
    //     formData.append("opid", businessName);
    //     formData.append("amount", categoryid);

    //     console.log("formData", formData);

    //     try {
    //         const response = await fetch(`${BaseUrl}recharge_initiate`, {
    //             method: "POST",
    //             headers: {
    //                 "authentication": EncKey
    //             },
    //             body: formData
    //         });

    //         const data = await response.json();
    //         console.log('response', data);

    //         if (data.Response.Success == "1") {
    //              Alert.alert("Success", data.Response.Message);
    //             // setSuccessModal(true)
    //         } else {
    //             Alert.alert("Error", data.Response.Message || "Failed to Initiate Recharge.");
    //         }
    //     } catch (error) {
    //         Alert.alert("Error", "Something went wrong. Please try again.");
    //     } finally {
    //         // setLoading(false);
    //     }
    // };


    return (
        // <SafeAreaView style={styles.container}>
        //     <TouchableOpacity onPress={() => handleBack()} style={styles.header}>
        //         <Icon name="left" style={styles.headerIcon} />
        //         <Text style={styles.headerTitle}>Mobile Recharge</Text>
        //     </TouchableOpacity>

        <>
            <StatusBar  backgroundColor='#0000' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("ServiceScreen")} style={{ flexDirection: 'row', marginTop: hp(1) }}>
                        <Icon onPress={() => navigation.navigate("ServiceScreen")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
                        <Text onPress={() => navigation.navigate("ServiceScreen")} style={styles.headerText}>PREPAID RECHARGE</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#A6222C" style={styles.loader} />
                    ) : (
                        <ScrollView>
                            <View style={styles.phoneContainer}>
                                <Text style={styles.label}>Enter mobile number</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={textInputRef}
                                        value={phoneNumber}
                                        onChangeText={handlePhoneNumberChange}
                                        style={styles.phoneInput}
                                        keyboardType="number-pad"
                                        placeholder="Enter your mobile number"
                                        placeholderTextColor="#888"
                                        maxLength={10}
                                    />
                                </View>

                                <Text style={styles.helperText}>Check the mobile number twice</Text>
                            </View>


                            <View style={{ width: wp(90), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', marginTop: hp(3) }}>
                                <TouchableOpacity style={styles.operatorBtn}
                                    onPress={handleOpenCircleList}>
                                    {
                                        selectedCity?.circle_name || getcircle_name ?
                                            <Text style={styles.operatorTxt}>{selectedCity?.circle_name ? selectedCity?.circle_name : getcircle_name}</Text> :
                                            <Text style={styles.operatorTxt}>{selectedCity?.circle_name ? selectedCity?.circle_name : "Select State"}</Text>
                                    }

                                    {/* <Feather name="arrow-down" style={styles.arrowIcon} /> */}
                                </TouchableOpacity>


                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.operatorBtn}
                                        onPress={handleOpenOperator}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                                selectedOperatorIdName || getprovider ?
                                                    <Text style={styles.operatorTxt}>{selectedOperatorIdName ? selectedOperatorIdName : getprovider}</Text> :
                                                    <Text style={styles.operatorTxt}>{selectedOperatorIdName ? selectedOperatorIdName : "Select network"}</Text>
                                            }
                                            {/* <Feather name="arrow-down" style={styles.arrowIcon} /> */}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>



                            <View style={styles.planDiv}>
                                {
                                    getcircle_code ?
                                        <TouchableOpacity style={styles.operatorBtn1}
                                            onPress={ChoosePlanData}>
                                            <Text style={styles.operatorTxt1}>Choose a plan</Text>
                                            {/* <Feather name="arrow-down" style={styles.arrowIcon} /> */}
                                        </TouchableOpacity> :
                                        <TouchableOpacity style={styles.operatorBtn1}
                                            onPress={handleOpenPlans}>
                                            <Text style={styles.operatorTxt1}>Choose a plan</Text>
                                            {/* <Feather name="arrow-down" style={styles.arrowIcon} /> */}
                                        </TouchableOpacity>
                                }
                                {/* <TouchableOpacity style={styles.operatorBtn1}
                                    onPress={handleOpenPlans}>
                                    <Text style={styles.operatorTxt1}>Choose a plan</Text>
                          
                                </TouchableOpacity> */}

                                <Text style={styles.orText}>OR</Text>

                                <View style={styles.amountContainer}>
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
                                </View>

                                {/* <Text style={styles.orText}>or</Text> */}



                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={submitButton}>
                                <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: "#fff", }}>Proceed</Text>
                                <Ionicons name="arrow-forward" style={styles.submitIcon} />
                            </TouchableOpacity>
                            <View style={{ height: hp(50), marginTop: hp(1) }}>
                                {/* <View style={{ width: wp(95), borderBottomWidth: 1, borderColor: '#D4AF37', marginBottom: hp(1) }}></View>
                        <Text>Recent Recharge</Text> */}

                                {/* <View style={styles.textContainer}>
                                    <View style={styles.line} />
                                    <Text style={styles.text}>Recent Recharge</Text>
                                    <View style={styles.line} />
                                </View> */}



                                <FlatList
                                    data={History}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: hp(1), width: wp(90), backgroundColor: '#fff', elevation: 5, borderRadius: hp(1), marginTop: hp(1), alignSelf: 'center' }}>
                                                <View>
                                                    <Text style={{ color: '#000', fontSize: hp(2), }}>{item.mobile_number}</Text>
                                                    <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '800' }}>₹{item.amount}</Text>
                                                    <Text style={{ color: '#000' }}>{item.Created_On}</Text>
                                                </View>
                                                <View>
                                                    <View style={{ height: hp(4) }}></View>
                                                    <View style={{ padding: hp(1), borderWidth: 1, borderColor: '#fcb713', borderRadius: hp(1) }}>
                                                        <Text style={{ color: '#000', textAlign: 'center', width: wp(35) }}>{item.message}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />

                            </View>
                        </ScrollView>
                    )}




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



                    {/* -=-=-=-=--=-=-=-=-=-=--==-=-=-=-=-=-=-=-==-=-=-= operatoe modal */}


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={circleListModalVisible}
                        onRequestClose={() => {
                            setCircleListModalVisible(false);
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => setCircleListModalVisible(false)}>
                            <View style={styles.modalBackground}>
                                <View style={styles.modalContentOuter}>
                                    <View style={styles.modalContent}>
                                        {circleList?.length > 0 ?
                                            <View>
                                                <Text style={styles.AddNewTitle}>Choose an operator</Text>
                                                <FlatList
                                                    data={circleList}
                                                    keyExtractor={(item) => item.circle_code}
                                                    showsVerticalScrollIndicator={false}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            style={styles.operatorItem}
                                                            onPress={() => handleSelectOperator(item)}
                                                        >
                                                            <Text style={styles.operatorItemText}>{item.circle_name}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                            :
                                            <Text style={styles.errorText}>Something went wrong</Text>
                                        }



                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>





                    {/* <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={NewAlertModalVisible}
                                    onRequestClose={() => {
                                        setNewAlertModalVisible(false);
                                    }}
                                >
                                    <TouchableWithoutFeedback onPress={() => setNewAlertModalVisible(false)}>
                                        <View style={styles.modalBackground}>
                                            <View style={styles.modalContentOuter}>
                                                <View
                                                    style={styles.gradient}
                                                >
                                                    <View style={styles.modalContent}>
                    
                                                        <Text style={styles.AddNewTitle}>Alert</Text>
                                                        <Text style={styles.AddNewTitle}>{modalMessage}</Text>
                    
                                                        <TouchableOpacity
                                                            style={{
                                                                marginRight: hp(3),
                                                            }}
                                                            onPress={() => setNewAlertModalVisible(false)}
                                                        >
                                                            <Text style={{
                                                                color: '#fff',
                                                                backgroundColor: '#A6222C',
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
                                </Modal> */}


                    {/* -=-=-=-=--=-=-=-=-=-=--==-=-=-=-=-=-=-=-==-=-=-= operatoe modal */}


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={OperatorModalVisible}
                        onRequestClose={() => {
                            setOperatorModalVisible(false);
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => setOperatorModalVisible(false)}>
                            <View style={styles.modalBackground1}>
                                <View style={styles.modalContentOuter1}>
                                    <View style={styles.modalContent1}>
                                        <Text style={styles.AddNewTitle1} >Choose an operator</Text>
                                        <FlatList
                                            data={operatoeList}
                                            keyExtractor={(item) => item.operator_id}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.operatorItem1}
                                                    onPress={() => NewhandleSelectOperator(item)}
                                                >
                                                    <Text style={styles.operatorItemText1}>{item.operator_name}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                        <TouchableOpacity onPress={() => setOperatorModalVisible(false)}>
                                            <Text style={styles.modalDoneBtn1}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* -=-=-=-=--=-=-=-=-=-=--==-=-=-=-=-=-=-=-==-=-=-= plan modal */}


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={planModalVisible}
                        onRequestClose={closePlanModal}
                    >
                        <View style={styles.modalBackdrop}>
                            <View style={styles.modalContentPlan}>
                                {isLoading ? (
                                    <ActivityIndicator size="large" color="#A6222C" style={styles.modaloader} /> // Loader displayed when data is loading
                                ) : (
                                    <ScrollView>
                                        {Object.keys(planList).length > 0 ? (
                                            <>
                                                <Text style={[styles.chosePlanTitle, { fontWeight: '900' }]}>Select your plan</Text>
                                                <View style={styles.content}>
                                                    {Object.keys(planList).map((key) => (
                                                        <View key={key} style={styles.section}>
                                                            <Text style={styles.sectionTitle}>{key}</Text>
                                                            {Array.isArray(planList[key]) && planList[key].map((item, index) => (
                                                                <TouchableOpacity key={index} style={styles.card}
                                                                    onPress={() => handleSelectPlan(item)}>
                                                                    <Text style={styles.validity}>{item.Type}</Text>
                                                                    <Text style={styles.price}>Plan Price: ₹ {item.rs}</Text>
                                                                    <Text style={styles.validity}>Validity : {item.validity}</Text>
                                                                    <Text style={styles.desc}>Deatails: {item.desc}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                            <View style={styles.underline} />
                                                        </View>
                                                    ))}
                                                </View>
                                            </>
                                        ) : (
                                            <View style={styles.modalRow}>
                                                <Text style={styles.AddNewTitle}>Alert</Text>
                                                <Text style={[styles.chosePlanTitle, { fontWeight: '400' }]}>
                                                    At the moment, there are no plans available for this network. You can manually enter your amount.
                                                </Text>
                                            </View>
                                        )}
                                    </ScrollView>
                                )}
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={closePlanModal}
                                >
                                    <Text style={styles.modalButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>




                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({

    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     padding: hp(2),
    // },
    // header: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // headerIcon: {
    //     fontSize: hp(2.5),
    //     color: "#000"
    // },
    // headerTitle: {
    //     fontSize: hp(2.5),
    //     fontWeight: '700',
    //     marginLeft: hp(1),
    //     color: "#000"
    // },
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
    phoneContainer: {
        marginTop: hp(5),
        width: wp(90),
        alignSelf: 'center'
    },
    label: {
        color: "#000",
        fontSize: hp(2),
        marginBottom: hp(1),
        marginLeft: wp(1),
        fontWeight: 'bold'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: hp(1),
        backgroundColor: 'lightgray'
    },
    phoneInput: {
        flex: 1,
        height: hp(6),
        color: "#000",
        fontSize: hp(2),

    },
    helperText: {
        color: "#888",
        marginTop: hp(1),
        fontSize: hp(1.8),
        marginLeft: wp(1),
    },
    submitButton: {
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
        color: "#fff",
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
    AddNewTitle: {
        color: '#000',
        fontSize: hp(2),
        fontWeight: '500',
        marginTop: hp(2)
    },
    operatorBtn: {
        backgroundColor: '#A6222C',
        // paddingHorizontal: hp(2),
        // paddingVertical: hp(1),
        width: wp(40),
        height: hp(5),
        borderRadius: hp(1),
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        alignSelf: "flex-start",
        marginTop: hp(2),
        // alignItems:'center'
    },
    operatorTxt: {
        fontSize: hp(1.8),
        color: '#fff',
        fontWeight: '800',
    },
    operatorTxt1: {
        fontSize: hp(2),
        color: '#fff',
        fontWeight: '800',
    },
    arrowIcon: {
        fontSize: hp(2),
        color: '#fff',
        fontWeight: '800',
        marginLeft: hp(1)
    },
    operatorItem: {
        padding: hp(1),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: wp(100),
        alignItems: 'center',
        justifyContent: 'center'
    },
    operatorItemText: {
        fontSize: hp(2),
        color: "#000",
        // textAlign: 'center'
    },
    operatorItem1: {
        padding: hp(1),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: wp(100),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: wp(-3)
    },
    operatorItemText1: {
        fontSize: hp(2),
        color: "#000"
    },
    loader: {
        fontSize: hp(3),
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: hp(2),
        fontWeight: '700',
        color: '#000',
        marginVertical: hp(2)
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
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(4),
    },
    text: {
        fontSize: hp(1.5),
        fontWeight: '400',
        color: '#454545',
        marginHorizontal: 10,
    },
    line: {
        flex: 1,
        height: 0.75,
        backgroundColor: '#D4AF37',
        marginLeft: wp(4),
        marginRight: wp(4),
    },
    modalBackground1: {
        height: hp(100),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentOuter1: {
        backgroundColor: 'rgb(212, 212, 212)',
        // padding: 2,
        borderRadius: hp(1.8),
        elevation: 2,
        maxHeight: hp(60),
    },
    modalContent1: {
        backgroundColor: 'rgb(244, 242, 245)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: wp(95),
        paddingTop: hp(1),
        color: '#000',
    },
    AddNewTitle1: {
        color: '#000',
        fontSize: hp(2.2),
        fontWeight: '500',
        marginVertical: hp(2)
    },
    modalDoneBtn1: {
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

    operatorItemText: {
        fontSize: hp(2),
        color: "#000"
    },
    noteText: {
        fontSize: hp(1.7),
        color: "#888",
        marginTop: hp(2),
    },
    amountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        borderColor: '#777',
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
    planDiv: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: hp(5),
    },
    operatorBtn1: {
        backgroundColor: '#A6222C',
        paddingHorizontal: hp(2),
        paddingVertical: hp(1),
        borderRadius: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        alignSelf: 'center'
    },
    orText: {
        fontSize: hp(2),
        color: "#000",
        // marginVertical: hp(0)
        marginTop: hp(3)
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginTop: hp(2),
    },
    modalButtonText: {
        color: '#fff',
        backgroundColor: '#A6222C',
        paddingHorizontal: hp(2),
        paddingVertical: hp(0.5),
        fontSize: hp(2.2),
        borderRadius: hp(1),
        fontWeight: '600',
        marginVertical: hp(1)
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    tabBar: {
        backgroundColor: '#f5f5f5'
    },
    tabBarIndicator: {
        backgroundColor: '#000'
    },
    tabBarLabel: {
        fontWeight: 'bold'
    },
    scene: {
        padding: 10,
        backgroundColor: '#fff'
    },
    modalTitle: {
        fontSize: hp(2),
        color: '#000'
    },
    content: {
        padding: hp(0.1),
        width: wp(80)
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: hp(2),
        color: '#A6222C',
        textAlign: 'center'
    },
    card: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    validity: {
        fontSize: 14,
        color: '#666',
    },
    desc: {
        fontSize: 12,
        color: '#333',
    },
    modalContentPlan: {
        backgroundColor: 'rgb(244, 242, 245)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: wp(95),
        paddingTop: hp(1),
        color: '#000',
        width: wp(90),
        marginVertical: hp(4)
    },
    chosePlanTitle: {
        fontSize: hp(2.5),
        color: "#000",
        textAlign: 'center',
        marginVertical: hp(2)
    },
    underline: {
        height: hp(0.5),
        backgroundColor: '#000',
        marginTop: 10,
    },
    loader: {
        fontSize: hp(3),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(35)
    },
    modaloader: {
        fontSize: hp(3),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: hp(5)
    },
    modalRow: {
        flexDirection: 'column',
        alignItems: 'center'
    },

});
