import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, FlatList, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { decryptPiDataNew, encryptPiDataNew } from "../Encryption/encryption";




export default function SelectPlan() {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber, network, selectedCityCode } = route.params || {};

    // console.log("=-=-=-=-=---=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=---=-=-=-=-=");
    // console.log("phone :", phoneNumber);
    // console.log("network :", network);
    console.log("circleList :", selectedCityCode);
    // console.log("=-=-=-=-=---=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=---=-=-=-=-=");


    const [isLoading, setIsLoading] = useState(false);
    const [AlertModalVisible, setAlertModalVisible] = useState(false);
    const [OperatorModalVisible, setOperatorModalVisible] = useState(false);
    const [planModalVisible, setPlanModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [operatoeList, setOperatoeList] = useState([]);
    const [selectedOperatorId, setSelectedOperatorId] = useState(null);
    const [selectedOperatorIdName, setSelectedOperatorName] = useState(null);
    const [amount, setAmount] = useState('');
    const [planList, setPlanList] = useState({});



    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('MobileNumberScreen')
        }
    }








    const fetchData = async () => {
        setIsLoading(true);
        const url = `https://sparkredeem.in/sparky/operator_codes`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data?.Response.Success == '1') {
                const decrypt_Data = decryptPiDataNew(data?.Response.Result);
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
        fetchData();
    }, []);





    const handleOpenOperator = () => {
        setOperatorModalVisible(true)
    }


    const handleOpenPlans = () => {
        if (!selectedOperatorId) {
            setAlertModalVisible(true);
            setModalMessage("Please select your network to select plan.");
            return;
        }
        setPlanModalVisible(true)
    }



    const closePlanModal = () => {
        setPlanModalVisible(false);
    };



    const handleSelectOperator = async (operator) => {
        const name = operator.operator_name;
        setSelectedOperatorId(operator.operator_id);
        setSelectedOperatorName(name);
        setOperatorModalVisible(false);

        const enc_city_code = encryptPiDataNew(selectedCityCode);
        const enc_opId = encryptPiDataNew(operator.operator_id);

        const url = `https://sparkredeem.in/sparky/plansget?statecode=${enc_city_code}&opid=${enc_opId}`;

        try {
            setIsLoading(true)
            if (!selectedCityCode) {
                setAlertModalVisible(true);
                setModalMessage("Error fetching your state.");
                return;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const finalResult = decryptPiDataNew(data.Response.Result);
            console.log("PLANS ::::", finalResult);


            if (finalResult.success == true) {
                const plans = finalResult.plans;
                setPlanList(plans);
                console.log("FINAL DATA 22222 ::::", data.Response.Result.success);
            } else {
                setPlanList({})
                setAlertModalVisible(true);
                setModalMessage("At the moment, there are no plans available for this network.");
                console.log(data?.Response.Message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
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



    const handleDecoSelection = () => {
        if (!selectedOperatorId) {
            setAlertModalVisible(true);
            setModalMessage("Please select your network before payment process.");
            return;
        }


        if (!amount) {
            setAlertModalVisible(true);
            setModalMessage("Please enter a amount or select any plan before payment process.");
            return;
        }


        console.log("phoneNumber :", phoneNumber);
        console.log("selectedCityCode :", selectedCityCode);
        console.log("selectedOperatorId :", selectedOperatorId);
        console.log("amount :", amount);

        navigation.navigate('ConfirmPage', { phoneNumber, selectedCityCode, selectedOperatorId, amount, selectedOperatorIdName })
    }





    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.header}
                onPress={handleBack}>
                <Icon name="left" style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Select plan</Text>
            </TouchableOpacity>

            <View style={styles.phoneContainer}>
                <Text style={styles.label}>Ensure your mobile number is correct.</Text>
                <View style={styles.inputContainer}>

                    <TextInput
                        value={phoneNumber}
                        style={styles.phoneInput}
                        keyboardType="number-pad"
                        placeholder="Enter your mobile number"
                        placeholderTextColor="#888"
                        maxLength={10}
                        editable={false}
                    />

                    <TouchableOpacity onPress={handleBack}>
                        <Feather name="edit-2" style={styles.editIcon} />
                    </TouchableOpacity>

                </View>



            </View>


            {isLoading ? (
                <ActivityIndicator size="large" color="#990099" style={styles.loader} />
            ) : (
                <ScrollView>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.operatorBtn}
                            onPress={handleOpenOperator}>
                            <Text style={styles.operatorTxt}>{selectedOperatorIdName ? selectedOperatorIdName : "Select network"}</Text>
                            <Feather name="arrow-down" style={styles.arrowIcon} />
                        </TouchableOpacity>
                    </View>


                    {selectedOperatorIdName == null ?
                        <Text style={styles.noteText}>Note : Please select your network operator.</Text>
                        :
                        <>
                            <Text style={styles.noteText}>Note : You have selected the {selectedOperatorIdName} as your network.</Text>
                        </>
                    }



                    <View style={styles.planDiv}>
                        <View style={styles.amountContainer}>
                            <Text style={styles.rupeeSymbol}>₹</Text>
                            <TextInput
                                value={String(amount)}
                                style={styles.amountInput}
                                keyboardType="number-pad"
                                placeholder="Enter amount"
                                placeholderTextColor="#888"
                                maxLength={5}
                                onChangeText={handleAmountChange}
                            />
                        </View>

                        <Text style={styles.orText}>or</Text>


                        <TouchableOpacity style={styles.operatorBtn}
                            onPress={handleOpenPlans}>
                            <Text style={styles.operatorTxt}>Choose a plan</Text>
                            <Feather name="arrow-down" style={styles.arrowIcon} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* --------------------------------------- Submit Button */}
            <TouchableOpacity style={styles.submitButton}
                onPress={handleDecoSelection}
            >
                <Ionicons name="arrow-forward" style={styles.submitIcon} />
            </TouchableOpacity>




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

                                    <TouchableOpacity
                                        style={{
                                            marginRight: hp(3),
                                        }}
                                        onPress={() => setAlertModalVisible(false)}
                                    >
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
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContentOuter}>
                            <View style={styles.modalContent}>
                                <Text style={styles.AddNewTitle} >Choose an operator</Text>
                                <FlatList
                                    data={operatoeList}
                                    keyExtractor={(item) => item.operator_id}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.operatorItem}
                                            onPress={() => handleSelectOperator(item)}
                                        >
                                            <Text style={styles.operatorItemText}>{item.operator_name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity onPress={() => setOperatorModalVisible(false)}>
                                    <Text style={styles.modalDoneBtn}>Done</Text>
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
                            <ActivityIndicator size="large" color="#0000ff" style={styles.modaloader} /> // Loader displayed when data is loading
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
                                                            <Text style={styles.price}>₹ {item.rs}</Text>
                                                            <Text style={styles.validity}>{item.validity}</Text>
                                                            <Text style={styles.desc}>{item.desc}</Text>
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
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    editIcon: {
        fontSize: hp(2.8),
        color: "#b82f02",
        marginRight: hp(1)
    },
    headerTitle: {
        fontSize: hp(2.5),
        fontWeight: '700',
        marginLeft: hp(1),
        color: "#000"
    },
    phoneContainer: {
        marginTop: hp(3),
    },
    label: {
        color: "gray",
        fontSize: hp(2),
        marginBottom: hp(1),
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
        fontSize: hp(2.3),
    },
    helperText: {
        color: "#888",
        marginTop: hp(1),
        fontSize: hp(1.8),
    },
    submitButton: {
        position: 'absolute',
        bottom: hp(3),
        right: hp(3),
        backgroundColor: '#6B9EFF',
        padding: hp(1.5),
        borderRadius: hp(5),
    },
    submitIcon: {
        fontSize: hp(3),
        color: "#fff"
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
        marginVertical: hp(2)
    },
    operatorBtn: {
        backgroundColor: '#0295ab',
        paddingHorizontal: hp(2),
        paddingVertical: hp(1),
        borderRadius: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        alignSelf: 'center'
    },
    operatorTxt: {
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
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(2),
    },
    modalDoneBtn: {
        color: '#fff',
        backgroundColor: '#6B9EFF',
        paddingHorizontal: hp(2),
        paddingVertical: hp(0.5),
        fontSize: hp(2.2),
        borderRadius: hp(1),
        fontWeight: '600',
        marginTop: hp(3),
        marginBottom: hp(2),
    },
    operatorItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: wp(100),
        alignItems: 'center'
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
    },
    rupeeSymbol: {
        fontSize: hp(2.5),
        color: '#000',
        paddingRight: wp(2),
        backgroundColor: "#fff",
        marginLeft: hp(1.5)
    },
    amountInput: {
        flex: 1,
        height: hp(6),
        color: "#000",
        fontSize: hp(2.3),
        height: hp(8),
        backgroundColor: "#fff"
    },
    planDiv: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: hp(5),
    },
    orText: {
        fontSize: hp(2),
        color: "#000",
        marginVertical: hp(2)
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
    modalButtonText: {
        color: '#fff',
        backgroundColor: '#990099',
        paddingHorizontal: hp(2),
        paddingVertical: hp(0.5),
        fontSize: hp(2.2),
        borderRadius: hp(1),
        fontWeight: '600',
        marginVertical: hp(1)
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
        color: '#990099',
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
