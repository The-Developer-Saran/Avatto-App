import {
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from '@react-native-vector-icons/feather';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import { ActivityIndicator, Modal } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import RenderHTML from 'react-native-render-html';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { encryptPiDataNew } from '../Encryption/encryption';
import { Authentication_Key } from '../../key/Key';


const { width } = Dimensions.get('window');
const ScreenWidth = Dimensions.get('window').width;

const ProductDescription = ({ navigation }) => {
    const route = useRoute();
    const { product } = route.params;
    console.log('Product Description Route Params:', product);

    const encKey = useMemo(() => encryptPiDataNew(Authentication_Key), []);


    const [address, setAddress] = useState('');

    const purchaseProduct = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('user');
            const inputData = new FormData();
            inputData.append('req_type', '1');
            inputData.append('user_id', storedUserId);
            inputData.append('product_id', product?.id);
            inputData.append('product_address', address);

            const response = await fetch('https://avatto.info/admin_avatto/activateMembershipWeb', {
                method: 'POST',
                body: inputData,
                headers: {
                    authentication: encKey,
                }
            });

            const responseData = await response.json();
            const result = responseData?.Response;

            console.log(result)

            if (!response.ok || result?.Success !== '1') {
                throw new Error(result?.Message || 'Membership activation failed');
            }

            ToastAndroid.show(result?.Message, ToastAndroid.SHORT);
            setTimeout(() => {
                navigation.navigate('MillionareClub')
            }, 1500);

        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);

        }
    }

    function handleBackButtonClick() {
        navigation.navigate('ProductList');
        return true;
    }

    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
        return () => {
            backhandler.remove();
        };
    }, []);


    return (
        <SafeAreaView style={styles.productModalOverlay}>
            <StatusBar backgroundColor="#A5242F" barStyle="light-content" />

            <View style={{ height: hp(100), backgroundColor: '#fff', }}>
                <View style={styles.productModalTopBar}>
                    <TouchableOpacity onPress={handleBackButtonClick} style={styles.productModalBack}>
                        <Icon name="left" size={20} color="#FFFFFF" />
                        <Text style={styles.productModalBackText}>Back</Text>
                    </TouchableOpacity>

                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productModalContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.productGalleryCard}>
                        <Swiper
                            style={styles.wrapper}
                            autoplay
                            autoplayTimeout={3}
                            loop
                            dotStyle={styles.modalDot}
                            activeDotStyle={styles.modalActiveDot}
                            paginationStyle={styles.modalPagination}
                        >
                            {(product?.extra_image?.length
                                ? product.extra_image
                                : [product?.product_image]
                            ).map((item, index) => (
                                <View key={index} style={styles.slide}>
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.modalProductImage}
                                        resizeMode="cover"
                                    />
                                </View>
                            ))}
                        </Swiper>
                    </View>

                    <View style={styles.productMetaWrap}>
                        <Text style={styles.modalProductName}>{product?.Item_name}</Text>
                        {/* <Text style={styles.modalProductMrp}>MRP : ₹ {product?.product_price || '0.00'}</Text> */}
                        <Text style={styles.modalProductPrice}>₹ {product?.product_price || '0.00'}</Text>
                    </View>



                    <View style={styles.modalDescriptionBlock}>
                        <Text style={styles.modalDescriptionTitle}>Description</Text>
                        {product?.Description ? (
                            <RenderHTML source={{ html: product.Description }} contentWidth={ScreenWidth * 0.88} />
                        ) : (
                            <Text style={styles.modalFallbackText}>No description available</Text>
                        )}
                    </View>
                    <Text style={{ marginTop: 18, fontSize: 12, fontWeight: 'bold', color: '#B2232D', marginBottom: 12, }}>Address</Text>
                    <TextInput
                        style={styles.addressInput}
                        placeholder="Enter your address"
                        value={address}
                        onChangeText={setAddress}
                        multiline={true}
                        numberOfLines={4}
                    />
                </ScrollView>

                <View style={styles.modalBottomBar}>
                    <Text style={styles.modalBottomPrice}>₹ {product?.product_price}</Text>
                    <TouchableOpacity onPress={purchaseProduct} style={styles.modalAddToCartButton}>
                        <Text style={styles.modalAddToCartText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
    )
}

export default ProductDescription

const styles = StyleSheet.create({
    productModalOverlay: {
        flex: 1,
        backgroundColor: '#B12A33',
    },
    addressInput: {
        padding: 10,
        maxHeight: hp(15),
        borderColor: '#E3DDE0',
        borderWidth: 1,
        borderRadius: hp(1.1),
    },
    productModalTopBar: {
        backgroundColor: '#B12A33',
        paddingTop: hp(1.4),
        paddingBottom: hp(1.4),
        paddingHorizontal: wp(4.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productModalBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productModalBackText: {
        color: '#FFFFFF',
        fontSize: hp(1.7),
        marginLeft: wp(1.5),
        fontWeight: '500',
    },
    productModalCart: {
        padding: hp(0.4),
    },
    productModalCartBadge: {
        minWidth: hp(1.8),
        height: hp(1.8),
        borderRadius: hp(0.9),
        backgroundColor: '#F5E2A6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: -2,
        top: -2,
        paddingHorizontal: wp(0.4),
    },
    productModalCartBadgeText: {
        color: '#8E2029',
        fontSize: hp(0.95),
        fontWeight: '700',
    },
    productModalContent: {
        paddingHorizontal: wp(4),
        paddingTop: hp(1.6),
        paddingBottom: hp(13),
    },
    productGalleryCard: {
        width: '100%',
        height: hp(21),
        borderRadius: hp(2),
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
    },
    modalProductImage: {
        width: '100%',
        height: '100%',
    },
    modalDot: {
        backgroundColor: 'rgba(255,255,255,0.75)',
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 3,
    },
    modalActiveDot: {
        backgroundColor: '#B12A33',
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 3,
    },
    modalPagination: {
        bottom: 8,
    },
    productMetaWrap: {
        marginTop: hp(1.1),
    },
    modalProductName: {
        color: '#A5242F',
        fontSize: hp(1.95),
        fontWeight: '500',
    },
    modalProductMrp: {
        color: '#C17F88',
        fontSize: hp(1.3),
        marginTop: hp(0.35),
        textDecorationLine: 'line-through',
    },
    modalProductPrice: {
        color: '#B12A33',
        fontSize: hp(2.2),
        marginTop: hp(0.35),
        fontWeight: '700',
    },
    modalControlsRow: {
        marginTop: hp(1.4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalVariantButton: {
        minWidth: wp(28),
        height: hp(4.6),
        borderWidth: 1,
        borderColor: '#E3DDE0',
        borderRadius: hp(1.1),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalVariantButtonText: {
        color: '#8D93A5',
        fontSize: hp(1.55),
    },
    modalQtyStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8D7DA',
        borderRadius: hp(1.2),
        borderWidth: 1,
        borderColor: '#E8D7DA',
        paddingHorizontal: wp(0),
        marginRight: 10

    },
    modalQtyAction: {
        width: hp(3),
        height: hp(3),
        borderRadius: hp(0.8),
        backgroundColor: '#A6222C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalQtyText: {
        color: '#B12A33',
        fontSize: hp(1.8),
        fontWeight: '700',
        marginHorizontal: wp(2.5),
    },
    modalVariantList: {
        marginTop: hp(1),
        backgroundColor: '#FFFFFF',
        borderRadius: hp(1.2),
        borderWidth: 1,
        borderColor: '#EAE3E5',
        overflow: 'hidden',
    },
    modalVariantOption: {
        paddingHorizontal: wp(3.2),
        paddingVertical: hp(1.2),
        borderBottomWidth: 1,
        borderBottomColor: '#F0EAEB',
    },
    modalVariantOptionText: {
        color: '#5E6371',
        fontSize: hp(1.55),
    },
    modalDescriptionBlock: {
        marginTop: hp(1.8),
    },
    modalDescriptionTitle: {
        color: '#B12A33',
        fontSize: hp(1.7),
        fontWeight: '700',
        marginBottom: hp(0.7),
    },
    modalFallbackText: {
        color: '#8D93A5',
        fontSize: hp(1.45),
    },
    modalBottomBar: {
        position: 'absolute',
        bottom: 20,
        width: wp(90),
        borderRadius: hp(2),
        alignSelf: 'center',
        backgroundColor: '#A6222C33',
        borderTopWidth: 1,
        borderTopColor: '#EEDBDD',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalBottomPrice: {
        color: '#B12A33',
        fontSize: hp(2.5),
        fontWeight: '700',
    },
    modalAddToCartButton: {
        width: wp(38),
        height: hp(4.8),
        borderRadius: hp(2.4),
        backgroundColor: '#B12A33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalAddToCartText: {
        color: '#FFFFFF',
        fontSize: hp(1.65),
        fontWeight: '700',
    },
    carouselsection: {
        width: '100%',
        height: width / 1.5,
        marginTop: hp(1),
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: hp(1.5),
    },
    dot: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    activeDot: {
        backgroundColor: '#000',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    pagination: {
        bottom: 10,
    },
})