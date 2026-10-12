import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    BackHandler,
    Modal,
    Image,
    Share,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AntDesign from "@react-native-vector-icons/ant-design";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Authentication_Key } from "../../key/Key";
import { encryptPiDataNew } from "../Encryption/encryption";
import { BaseUrl } from "../BaseUrl/BaseUrl";
import MyReferralPage from "./MyReferralPage";
import VendorReferralPage from "./VendorReferralPage";
import FontAwesome from "@react-native-vector-icons/fontawesome";

const Tab = createMaterialTopTabNavigator();
const HERO_COLOR = "#B3242E";

function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.tabShell}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const { options } = descriptors[route.key];
                const label = options.title || route.name;

                return (
                    <TouchableOpacity
                        key={route.key}
                        activeOpacity={0.9}
                        style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <Text style={[styles.tabButtonText, isFocused && styles.tabButtonTextActive]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function ReferralTabView() {
    const navigation = useNavigation();
    const EncKey = encryptPiDataNew(Authentication_Key);
    const [modalVisible, setModalVisible] = useState(false);
    const [referralCode, setReferralCode] = useState("");

    useEffect(() => {
        const getReferralCode = async () => {
            try {
                const value = await AsyncStorage.getItem("user");

                if (!value) {
                    setReferralCode("");
                    return;
                }

                const response = await fetch(
                    `${BaseUrl}userGet?req_type=1&res_type=1&id=${value}&type=M`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authentication: EncKey,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();
                if (data?.Response?.Success === "1") {
                    setReferralCode(data?.Response?.Result?.[0]?.mobile || "");
                }
            } catch (error) {
                console.error("Referral code fetch error:", error.message);
            }
        };

        getReferralCode();
    }, [EncKey]);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                setModalVisible(true);
                return true;
            };

            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => backHandler.remove();
        }, [navigation])
    );

    const [referral_code, setReferral_code] = useState("");

    const User_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
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
                        setReferral_code(data.Response.Result[0]?.mobile || '');
                    } else {
                        console.log(data?.Response?.Message || 'Unknown error');

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

    useEffect(() => {
        User_Details_Get()
    }, [])

    const shareOptions = {
        title: 'Share',
        message: `Download Avatto Deals App! \n\nAndroid \nhttps://play.google.com/store/apps/details?id=com.avatto&hl=en_IN&referrer=${referral_code}`,
        subject: 'Common'
    };
    const onSharePress = () => Share.share(shareOptions);

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar backgroundColor={HERO_COLOR} barStyle="light-content" />

            <View style={styles.heroWrapper}>
                <View style={styles.hero}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("Footer", { screen: "Profile" })}
                    >
                        <AntDesign name="left" size={18} color="#FFFFFF" />
                        <Text style={[styles.backText, { fontSize: 18 }]}>Refer a Friend</Text>

                        <TouchableOpacity style={styles.codePill} onPress={() => {
                            // Handle code press action
                            onSharePress()
                        }}>
                            <Text style={styles.codeText}>
                                {referralCode || "9600336645"} |{" "}
                            </Text>
                            <FontAwesome name="share" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/* <Image
                        source={require("../../assets/images/Referral/refer.png")}
                        style={styles.heroImage}
                        resizeMode="contain"
                    /> */}

                    {/* <Text style={styles.heroTitle}>Refer a Friend</Text> */}

                    {/* <TouchableOpacity style={styles.codePill} onPress={() => {
                        // Handle code press action
                        onSharePress()
                    }}>
                        <Text style={styles.codeText}>
                            {referralCode || "9600336645"} |{" "}
                        </Text>
                        <FontAwesome name="share" size={12} color="#FFFFFF" />
                    </TouchableOpacity> */}
                </View>
            </View>

            <View style={styles.tabContainer}>
                <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
                    <Tab.Screen
                        name="MyReferral"
                        component={MyReferralPage}
                        options={{ title: "My Referral" }}
                    />
                    <Tab.Screen
                        name="VendorReferral"
                        component={VendorReferralPage}
                        options={{ title: "Vendor Referral" }}
                    />
                </Tab.Navigator>
            </View>

            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <FontAwesome name="exclamation-circle" size={50} color={HERO_COLOR} />
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
                                    navigation.navigate("Footer", { screen: "Profile" });
                                }}
                            >
                                <Text style={styles.confirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F5F1",
    },
    heroWrapper: {
        backgroundColor: HERO_COLOR,
        borderBottomLeftRadius: hp(6),
        borderBottomRightRadius: hp(6),
    },
    hero: {
        backgroundColor: HERO_COLOR,
        paddingTop: hp(6),
        paddingHorizontal: wp(6),
        paddingBottom: hp(0),
        alignItems: "center",
        borderBottomLeftRadius: hp(1),
        borderBottomRightRadius: hp(1),
    },
    backButton: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(1.2),
    },
    backText: {
        color: "#FFFFFF",
        marginLeft: wp(2),
        fontSize: hp(1.7),
        fontFamily: "DMSans-Medium",
    },
    heroImage: {
        width: wp(38),
        height: hp(12),
        marginTop: hp(0.4),
        marginBottom: hp(0.6),
    },
    heroTitle: {
        color: "#FFFFFF",
        fontSize: hp(3),
        fontWeight: "700",
        fontFamily: "DMSans-Medium",
    },
    codePill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#9A1D26",
        borderRadius: hp(1.2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.55),
        marginTop: hp(0.9),
        marginLeft:90
    },
    codeText: {
        color: "#FFFFFF",
        fontSize: hp(1.4),
        fontFamily: "DMSans-Medium",
    },
    tabContainer: {
        flex: 1,
        marginTop: hp(2),
    },
    tabShell: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: hp(1.8),
        padding: hp(0.6),
        marginHorizontal: wp(5),
        marginBottom: hp(1.4),
        shadowColor: "#000000",
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 4,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: hp(1.4),
        minHeight: hp(4.7),
        backgroundColor: "#FFF3F4",
    },
    tabButtonActive: {
        backgroundColor: HERO_COLOR,
    },
    tabButtonText: {
        color: HERO_COLOR,
        fontSize: hp(1.65),
        fontWeight: "600",
        fontFamily: "DMSans-Medium",
    },
    tabButtonTextActive: {
        color: "#FFFFFF",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalBox: {
        width: wp(80),
        backgroundColor: "#FFFFFF",
        padding: hp(3),
        borderRadius: 15,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        color: HERO_COLOR,
        marginTop: hp(1),
    },
    modalMessage: {
        fontSize: hp(2),
        textAlign: "center",
        color: "#333333",
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
        backgroundColor: "#CCCCCC",
    },
    cancelText: {
        color: "#333333",
        fontWeight: "bold",
    },
    confirmButton: {
        backgroundColor: HERO_COLOR,
    },
    confirmText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});
