import { ActivityIndicator, BackHandler, FlatList, StatusBar, StyleSheet, Text, View, Image, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import Feather from '@react-native-vector-icons/feather';

const TravelDetailsScreen = ({ navigation, route }) => {

    const EncKey = encryptPiDataNew(Authentication_Key)

    const brandId = route?.params?.brandId || '';
    const [brandDetails, setBrandDetails] = useState(null);
    const [denominationList, setDenominationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [importantInstructions, setImportantInstructions] = useState('');
    const [howToRedeem, sethowToRedeem] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
     const [AlertModalVisible, setAlertModalVisible] = useState(false);
         const [modalMessage, setModalMessage] = useState('');
      

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
        setModalMessage("Comming Soon")
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const getContent = () => {
        switch (modalType) {
            case 'terms':
                return termsAndConditions;
            case 'privacy':
                return importantInstructions;
            case 'redeem':
                return howToRedeem;
            default:
                return '';
        }
    };

    const fetchBrandDetails = useCallback(async () => {
        try {
            const res = await axios.get(`${BaseUrl}getBrand?brandid=${brandId}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    authentication: EncKey,
                },
            });

            const response = res.data;
            //console.log(response);
            if (response?.Response?.Success === "1") {
                const brand = response.Response.Result[0];
                //console.log(brand);
                setBrandDetails(brand);
                const denominations = brand?.denominationList ? brand.denominationList.split(',').map(Number) : [];
                setDenominationList(denominations);
                setTermsAndConditions(cleanAndFormatTerms(brand?.tnc));
                setImportantInstructions(cleanAndFormatTerms(brand?.importantInstruction));
                sethowToRedeem(processHowToRedeem(brand?.redeemSteps));
            } else {
                console.warn(response?.Response?.Message || "Failed to fetch brand details");
                setBrandDetails(null);
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    }, [brandId,BaseUrl,EncKey]);

    useEffect(() => {
        fetchBrandDetails();
    }, []);

    function cleanAndFormatTerms(apiResponse) {
        // Remove HTML tags and split by line breaks
        let cleanedText = apiResponse.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?[^>]+(>|$)/g, "");

        // Split the text into an array based on numbers at the beginning of each line
        let termsArray = cleanedText.split(/\d+\./).filter(term => term.trim() !== "");

        // Format the terms back with numbers
        let formattedTerms = termsArray.map((term, index) => `${index + 1}. ${term.trim()}`).join("\n");

        return formattedTerms;
    }

    function processHowToRedeem(apiResponse) {
        try {
            let data = JSON.parse(apiResponse); // Parse JSON response
            let steps = Object.keys(data).map(key => {
                let step = data[key];
                return {
                    stepNumber: key,
                    text: step.text.trim(), // Trim any unnecessary whitespace
                    image: step.image
                };
            });

            return steps; // Returns an array of formatted steps
        } catch (error) {
            console.error("Error parsing API response:", error);
            return [];
        }
    }

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

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

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A6222C" />
            </View>
        );
    }


        const gotoPaymentDetails = (selectedItem) => {
        navigation.navigate('VoucherBookingPayment', { brandId : brandId , BrandDetails : brandDetails , denomination: selectedItem });
    };

    return (
        <SafeAreaView style={styles.screen}>
          <StatusBar  backgroundColor='#A6222C' barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity  onPress={() => navigation.navigate("TravelListByCategory")} style={styles.headerButton}>
                    <AntDesign onPress={() => navigation.navigate("TravelListByCategory")} name="left" size={22} color="white" />
                    <Text onPress={() => navigation.navigate("TravelListByCategory")} style={styles.headerText}>TICKET BOOKING</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                numColumns={2}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                contentContainerStyle={styles.flatListContainer}
                ListHeaderComponent={
                    <View style={styles.brandInfoContainer}>
                        <View style={styles.brandImageContainer}>
                            <Image
                                source={brandDetails?.BrandImage ? { uri: brandDetails.BrandImage } : require('../../assets/images/Login/avatto_logo.png')}
                                style={styles.brandImage}
                            />
                        </View>
                        <View style={styles.brandTextContainer}>
                            <Text style={styles.brandName}>{brandDetails?.BrandName || 'N/A'}</Text>
                            <Text style={styles.brandDescription}>{brandDetails?.Descriptions || 'No description available.'}</Text>
                        </View>
                    </View>
                }
                ListFooterComponent={<View style={styles.footerSpacing} />}
                data={denominationList}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=> gotoPaymentDetails(item)} style={styles.card}>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardAmount}>₹ {item}</Text>
                        </View>
                        <TouchableOpacity style={styles.buyButton} onPress={() => {gotoPaymentDetails(item)}}>
                            <Text style={styles.buyButtonText}>Go</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.footerButtonsContainer}>
                <TouchableOpacity style={styles.footerButton} onPress={() => openModal('terms')}>
                    <Feather name="file" color="#fff" size={20} />
                    <Text style={styles.footerButtonText}>Terms & Conditions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerButton} onPress={() => openModal('privacy')}>
                    <AntDesign name="lock" size={20} color="white" />
                    <Text style={styles.footerButtonText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerButton} onPress={() => openModal('redeem')}>
                    <AntDesign name="gift" size={20} color="white" />
                    <Text style={styles.footerButtonText}>How to Redeem?</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                <View style={styles.modalOverlay}>
                <Animatable.View
                            animation="zoomIn"
                            duration={500}
                        >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{modalType === 'terms' ? 'Terms & Conditions' : modalType === 'privacy' ? 'Privacy Policy' : 'How to Redeem'}</Text>
                        <ScrollView style={styles.modalContent}>
                            {modalType === 'redeem' && howToRedeem.length > 0 ? (
                                howToRedeem.map((step, index) => (
                                    <View key={index} style={styles.stepContainer}>
                                        <Image source={{ uri: step.image }} style={styles.stepImage} />
                                        <Text style={styles.stepText}>{`Step ${step.stepNumber}: ${step.text}` || 'No records'}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.modalText}>{getContent() 
                                || "No records"}</Text>
                            )}
                        </ScrollView>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    </Animatable.View>
                </View>
            </Modal>


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
                                                    <View style={styles.modalContent1}>
            
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
        </SafeAreaView>
    );
};

export default TravelDetailsScreen;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },

    // Header styles
    header: { backgroundColor: '#A6222C', padding: hp(1.5), flexDirection: 'row', alignItems: 'center' },
    headerButton: { flexDirection: 'row', alignItems: 'center' },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginLeft: wp(5) },

    // Loading screen
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // FlatList styles
    flatListContainer: { flexGrow: 1, alignSelf: 'center', alignItems: 'center' },

    // Brand Info
    brandInfoContainer: { alignSelf: "center", width: wp(95) },
    brandImageContainer: {
        height: hp(20),
        width: wp(95),
        backgroundColor:'#fff',
        alignSelf: "center",
        borderRadius: hp(0.5),
        borderWidth: 1,
        borderColor: "#bdbcbc",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp(2),
        elevation:5
    },
    brandImage: {
        height: hp(20.5),
        width: wp(85.5),
        alignSelf: "center",
        borderRadius: hp(2),
        resizeMode: 'contain'
    },
    brandTextContainer: { alignSelf: "center", marginVertical: hp(2) },
    brandName: { color: "#A6222C", fontSize: hp(2), fontWeight: "600" },
    brandDescription: { color: "grey", fontSize: hp(1.5), marginTop: hp(0.3) },

    // Cards
    card: {
        padding: hp(1),
        width: wp(40),
        backgroundColor: "#ececec",
        borderRadius: hp(0.5),
        shadowColor: '#000',
        elevation: 5,
        margin: hp(1),
        alignItems: 'center'
    },
    cardTextContainer: { padding: hp(1), justifyContent: 'center', alignItems: 'center' },
    cardAmount: { color: "#000", fontSize: hp(3), fontWeight: '600' },

    // Buy Button
    buyButton: {
        padding: hp(1),
        width: wp(20),
        backgroundColor: '#A6222C',
        alignSelf: 'center',
        borderRadius: hp(0.5),
        marginTop: hp(2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyButtonText: { color: "#fff", fontSize: hp(1.5), fontWeight: '700' },

    // Footer
    footerSpacing: { height: hp(2) },

    // Footer Buttons
    footerButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp(1), width: wp(98), alignSelf: 'center', alignItems: 'center' },
    footerButton: { flexDirection: 'row', backgroundColor: '#A6222C', padding: hp(1), borderRadius: hp(0.8), alignItems: 'center', width: wp(31), justifyContent: 'center' },
    footerButtonText: { color: "white", fontSize: hp(1.1), fontWeight: 'bold', marginLeft: wp(1) },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { backgroundColor: 'white', width: wp(90), borderRadius: hp(1), padding: hp(2), alignItems: 'center' },
    modalTitle: { fontSize: hp(2.2), fontWeight: 'bold', color: '#A6222C', marginBottom: hp(1) },
    modalContent: { maxHeight: hp(50), marginBottom: hp(2) },
    modalText: { fontSize: hp(1.8), textAlign: 'justify', color: 'black' },
    modalCloseButton: { backgroundColor: '#A6222C', paddingVertical: hp(1), paddingHorizontal: wp(5), borderRadius: hp(0.5) },
    modalCloseButtonText: { color: 'white', fontSize: hp(1.8), fontWeight: 'bold' },

    stepContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    stepImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    stepText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
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
        modalContent1: {
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
});



