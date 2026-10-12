import { Animated, BackHandler, Easing, FlatList, Image, Linking, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Share from 'react-native-share';
import Swiper from 'react-native-swiper';
import ViewShot from 'react-native-view-shot';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { useNavigation, useRoute } from '@react-navigation/native';
// import AndroidToast from '../utils/toast/androidToast';


const PropertyDetailsScreen = ({navigation,route}) => {
// const route =useRoute();
    const item = route?.params.item || {};
    const userId = route?.params.UserId|| "";
    console.log("userId====>",userId);
    const EncKey = encryptPiDataNew(Authentication_Key)
        // const navigation = useNavigation();
    // const userId = 12765;
    const viewShotRef = useRef();
    const scaleValue = useRef(new Animated.Value(1)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [interested, setInterested] = useState(false);

    useEffect(() => {
        if (item.interested_customer && Array.isArray(item.interested_customer)) {
            setInterested(item.interested_customer.some(customer => customer.user_id == userId));
        }
    }, [item.interested_customer]);

    const handleShare = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await Share.open({
                url: uri,
                title: 'Check out this store',
            });
        } catch (error) {
            console.error('Failed to share:', error);
        }
    };

    const renderCategoryItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.extraImageBox}
            onPress={() => openImageModal(index)}
        >
            <Image source={{ uri: item.image }} style={styles.businessExtraImage} />
        </TouchableOpacity>
    );

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setImageModalVisible(true);
    };

    const interestedApi = useCallback(async () => {

        try {

            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 1.3,
                    duration: 150,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Reset scale back to normal
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            });

            const res = await axios.post(
                `${BaseUrl}updateCustomer`,
                {
                    id: item.id,
                    user_id: userId
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        authentication: EncKey,
                    },
                },
            );
console.log(userId);
            const response = res.data;
            if (response.Response.Success == "1") {
                setInterested(true);
            }
            else {
                alert(response.Response.Message);
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [item.id, userId, scaleValue, opacityValue, BaseUrl, EncKey]);

   //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==

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

    return (
        <View style={styles.container}>
          <StatusBar  backgroundColor='#0000' barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity  onPress={() => navigation.navigate("RealEstateListScreen")}  style={styles.headerButton} >
                    <AntDesign onPress={() => navigation.navigate("RealEstateListScreen")}  name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text onPress={() => navigation.navigate("RealEstateListScreen")} style={styles.headerText}>REAL ESTATE</Text>
                </TouchableOpacity>
            </View>
            <ViewShot ref={viewShotRef} style={styles.container}>
                <ScrollView>
                    <View style={{ width: wp(90), backgroundColor: '#0000', borderRadius: hp(1), padding: hp(1), marginVertical: hp(1), alignSelf: 'center', elevation: 0, shadowColor: '#000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Image source={{ uri: item.cover_image }} style={{ width: hp(15), height: hp(15), borderRadius: hp(1), resizeMode: 'contain', backgroundColor: '#888' }} />
                            <View style={{ marginLeft: hp(4), width: wp(45), }}>
                                <Text style={{ color: '#000', fontWeight: '600', fontSize: hp(1.8) }}>{item.title}</Text>
                                <Text style={{ color: '#000', fontWeight: '400', marginVertical: hp(0.5) }}>₹ {item.price}</Text>
                                <Text style={{ color: '#000', fontWeight: '400', }}>{item.address}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.midButtonContainer}>

                        <TouchableOpacity style={styles.midButtons}
                            onPress={handleShare}>
                            <View style={styles.midIconContainer}>
                                <FontAwesome style={styles.midButtonsIcons} name="share-alt" />
                            </View>

                            <View style={styles.midTitleContainer}>
                                <Text style={styles.midButtonsTitles}>Share</Text>
                            </View>
                        </TouchableOpacity>

                        <Pressable onPress={interestedApi} disabled={interested ? true : false}>
                            <Animated.View style={[styles.midButtons, { transform: [{ scale: scaleValue }] }]}>
                                <View style={styles.midIconContainer}>
                                    <FontAwesome style={styles.midButtonsIcons} name={interested ? "thumbs-up" : "thumbs-o-up"} />
                                </View>

                                <View style={styles.midTitleContainer}>
                                    <Text style={[styles.midButtonsTitles, { fontWeight: interested ? '600' : '400' }]}>{interested ? 'Interested' : 'Interest'}</Text>
                                </View>
                            </Animated.View >
                        </Pressable>
                    </View>
                    <View style={styles.midLine} />
                    <View style={styles.ExtraImage}>
                        <FlatList
                            data={item.extra_image}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderCategoryItem}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                    <View style={styles.detailsBlock}>
                        <View style={styles.detailsTitleContainer}>
                            <Text style={styles.detailsTitleText}>About</Text>
                        </View>

                        <Text style={styles.detailsContentText}>{item.description}</Text>
                    </View>


                    <View style={styles.detailsBlock}>
                        <View style={styles.detailsTitleContainer}>
                            <Text style={styles.detailsTitleText}>Location</Text>
                        </View>

                        <View style={styles.addressContainer}>
                            <Text style={styles.detailsContentTextAddress}>{item.address}</Text>
                            {/* <TouchableOpacity>
                                <Ionicons style={styles.locationIconBtm} name="location" color="#000" />
                            </TouchableOpacity> */}
                        </View>

                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={imageModalVisible}
                        onRequestClose={() => setImageModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setImageModalVisible(false)}
                            >
                                <Ionicons name="close" style={styles.closeIcon} />
                            </TouchableOpacity>
                            <Swiper
                                loop={false}
                                index={selectedImageIndex}
                                showsButtons
                                buttonWrapperStyle={styles.swiperButtonWrapper}
                            >
                                {item.extra_image.map((image, index) => (
                                    <View key={index} style={styles.imageSlide}>
                                        <Image
                                            source={{ uri: image.image }}
                                            style={styles.modalImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ))}
                            </Swiper>
                        </View>
                    </Modal>
                </ScrollView>
            </ViewShot>
        </View>
    );
};

export default PropertyDetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', padding: hp(1.5),height:hp(11) },
    headerButton: { flexDirection: 'row', marginTop: hp(1) },
    headerIcon: { marginTop: hp(4) },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(4), marginLeft: wp(5) },
    midButtonContainer: {
        flexDirection: 'row',
        marginTop: hp(1),
        alignSelf: 'center'
    },
    midButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0c7c9',
        borderRadius: hp(1.2),
        marginHorizontal: hp(1),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    midIconContainer: {
        width: hp(5),
        height: hp(5),
        backgroundColor: '#A6222C',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hp(1.2)
    },
    midButtonsIcons: {
        fontSize: hp(3),
        color: '#fff',
        borderRadius: hp(1.2),
    },
    midTitleContainer: {
        width: wp(25),
        alignItems: 'center'
    },
    midButtonsTitles: {
        fontSize: hp(2),
        color: '#000',
        fontWeight: '400'
    },
    midLine: {
        height: hp(0.1),
        backgroundColor: '#e3e3e3',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginTop: hp(2),
        width: wp(90),
        alignSelf: 'center',
    },
    ExtraImage: {
        alignSelf: 'center',
        width: '100%',
        marginVertical: hp(2),
    },
    flatListContent: {
        paddingHorizontal: 10,
    },
    extraImageBox: {
        backgroundColor: '#e3e3e3',
        marginHorizontal: hp(1),
        padding: hp(0.2),
        borderRadius: hp(1.3),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    businessExtraImage: {
        height: hp(13),
        width: hp(13),
        borderRadius: hp(1),
        resizeMode: "stretch",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeIcon: {
        fontSize: hp(3.5),
        color: 'red',
        backgroundColor: '#fff',
        borderRadius: hp(1),
        fontWeight: '900',
        padding: hp(0.2),
    },
    imageSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '80%',
    },
    swiperButtonWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    detailsBlock: {
        minHeight: hp(12),
        width: wp(90),
        alignSelf: 'center',
    },
    detailsTitleContainer: {
        width: wp(25),
        backgroundColor: '#e0c7c9',
        alignItems: 'center',
        borderRadius: hp(3),
        paddingVertical: hp(0.5),
        marginTop: hp(1),
        elevation: 4,
        shadowColor: '#000'
    },
    detailsTitleText: {
        fontSize: hp(2.3),
        color: '#000',
        fontWeight: '600',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'gray',
        justifyContent: 'space-between',
    },
    locationIconBtm: {
        fontSize: hp(3),
        color: '#fff',
        // marginBottom: hp(-1),
        backgroundColor: '#A6222C',
        padding: hp(1),
        borderRadius: hp(1)
    },
    detailsContentText: {
        fontSize: hp(1.9),
        color: '#000',
        fontWeight: '400',
        marginTop: hp(1.5),
        textAlign: 'justify',
        paddingLeft: hp(1)
    },
    detailsContentTextAddress: {
        fontSize: hp(1.9),
        color: '#000',
        fontWeight: '400',
        marginTop: hp(1.5),
        textAlign: 'justify',
        //width: wp(78),
        paddingLeft: hp(1)
    },
});
