import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ToastAndroid, StatusBar, Modal, ScrollView, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from "@react-native-vector-icons/ant-design";
import { useIsFocused } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import Lottie from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { format } from 'date-fns';
import SimpleLineIcons from '@react-native-vector-icons/ionicons';
import { BaseUrl } from '../BaseUrl/BaseUrl';

const PremiumCartItems = ({ navigation }) => {

    const EncKey = encryptPiDataNew(Authentication_Key)
    const CurrentDate = format(new Date(), 'yyyy/MM/dd');

    const [cartItems, setcartItems] = useState(null);
    const [InitialUnit, setInitialUnit] = useState(null);
    const [UpdatedQuantity, setUpdatedQuantity] = useState(null);
    const [modifyQuantity, setModifyQuantity] = useState(false);
    const [activeAccordionId, setActiveAccordionId] = useState(false);
    const [successmodal, setSuccessmodal] = useState(false);
    const [successdata, setSuccessdata] = useState(false);
    const [ordersuccessmodal, setOrderSuccessmodal] = useState(false);
    const [addressModal, setAddressModal] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const [finalAmount, setFinalAmount] = useState(null);
    const [total_psa_value, setTotal_psa_value] = useState(null);
    const [total_vocher_value, setTotal_vocher_value] = useState(null);
    const [uid, setUid] = useState(null);
    const [Address1, setAddress1] = useState(null);
    const [RadioBtn, setRadioBtn] = useState('CA');
    const [Address2, setAddress2] = useState('');
    const [Name, setName] = useState('');
    const [MobileNo, setMobileNo] = useState('');

    const isFocused = useIsFocused();
    const maxquantity = 3;

    useEffect(() => {
        if (isFocused) {
            setModifyQuantity(false)
        }
    }, [])

    const getCartItems = async () => {
        if (isFocused) {
            try {
                const value = await AsyncStorage.getItem('user');

                if (value !== null) {
                    setUid(value);
                    const response = await fetch(`${BaseUrl}cartGet?uId=${value}&type=P`, {
                        method: 'GET',
                        headers: { authentication: EncKey }
                    });
                    response.json()
                        .then(responseData => {
                            if (responseData.Response.Success == 1) {
                                setcartItems(responseData.Response.Result);
                                const totalPsaValue = responseData.Response.Result.reduce((sum, item) => {
                                    return sum + parseFloat(item.psa_value);
                                }, 0);
                                setTotal_psa_value(totalPsaValue)
                                const totalVoucherValue = responseData.Response.Result.reduce((sum, item) => {
                                    return sum + parseFloat(item.voucher_amount);
                                }, 0);
                                setTotal_vocher_value(totalVoucherValue)
                                setInitialUnit(`${responseData.Response.Result[0].item_price_details.quantity} ${responseData.Response.Result[0].item_price_details.units}`);
                                setFinalAmount(responseData.Response.finalAmount);
                            }
                            else {
                                setcartItems(null);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    console.log('No user data found in AsyncStorage.');
                }
            } catch (error) {
                console.error('Error reading AsyncStorage:', error.message);
            }
        }
    }

    const updateCartItems = async (opr, id, qty) => {
        const upQty = opr == 0 ? qty - 1 : qty + 1;
        const cartData = new FormData();
        cartData.append('qty', upQty);
        cartData.append('type', 'P');
        cartData.append('cart_id', id);

        if (upQty == 0) {
            return;
        }

        const response = await fetch(`${BaseUrl}cart_quantiy_update`, {
            method: 'POST',
            body: cartData,
            headers: { authentication: EncKey }
        });
        response.json()
            .then(responseData => {
                ToastAndroid.showWithGravityAndOffset(
                    responseData.Response.Message,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                getCartItems();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const removeCartItems = async (id) => {
        const cartData = new FormData();
        cartData.append('cart_id', id);

        const response = await fetch(`${BaseUrl}cartRemove`, {
            method: 'POST',
            body: cartData,
            headers: { authentication: EncKey }
        });
        response.json()
            .then(responseData => {
                ToastAndroid.showWithGravityAndOffset(
                    responseData.Response.Message,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                getCartItems();
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getCartItems();
    }, [isFocused])

    const [profileData, setProfileData] = useState("");
    const [profileId, setProfileId] = useState("");
    const [state, setState] = useState("");
    const [stateId, setStateId] = useState(null);
    const [city, setCity] = useState("");
    const [cityId, setCityId] = useState(null);
    const [pincode, setPincode] = useState("");
    const [profileName, setProfileName] = useState(null);
    const [profileMobile, setProfileMobile] = useState(null);
    const [CurrentAddress1, setCurrentAddress1] = useState(null);
    const [CurrentAddress2, setCurrentAddress2] = useState(null);
    const [CurrentCity, setCurrentCity] = useState(null);
    const [CurrentCityId, setCurrentCityId] = useState(null);
    const [CurrentState, setCurrentState] = useState(null);
    const [CurrentStateId, setCurrentStateId] = useState(null);
    const [CurrentPincode, setCurrentPincode] = useState(null);

    const isFormValid = Name && MobileNo && Address1 && Address2 && pincode

    useEffect(() => {
        if (pincode && pincode.length === 6) {
            Loacation_Details_Get();
        }
    }, [pincode]);

    const Loacation_Details_Get = async () => {
        try {
            const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${pincode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authentication: EncKey
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.Response.Success === '1') {
                setCity(data.Response.Result[0].city_name);
                setCityId(data.Response.Result[0].id);
                setState(data.Response.Result[0].state_name);
                setStateId(data.Response.Result[0].state_id);
            } else {
                console.log(data?.Response.Message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        User_Details_Get();
    }, []);

    const User_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user');

            if (value !== null) {
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

                if (data.Response.Success === '1') {
                    setProfileData(data.Response.Result);
                    setProfileId(data.Response.Result[0]?.id || '');
                    setProfileName(data.Response.Result[0]?.name || '');
                    setProfileMobile(data.Response.Result[0]?.mobile || '');
                    setCurrentState(data.Response.Result[0]?.state_name || '');
                    setCurrentStateId(data.Response.Result[0]?.state || '');
                    setCurrentCity(data.Response.Result[0]?.city_name || '');
                    setCurrentCityId(data.Response.Result[0]?.city || '');
                    setCurrentPincode(data.Response.Result[0]?.pincode || '');
                    setCurrentAddress1(data.Response.Result[0]?.address1 || '');
                    setCurrentAddress2(data.Response.Result[0]?.address2 || '');
                } else {
                    console.log(data?.Response?.Message || 'Unknown error');
                    setProfileData(null);
                }
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    const [walletData, setWalletData] = useState(null);
    const [cashback_wallet, setCashback_wallet] = useState(null);
    const [earning_wallet, setEarning_wallet] = useState(null);
    const [purchase_wallet, setPurchase_wallet] = useState(null);
    const [voucher_wallet, setVoucher_wallet] = useState(null);
    const [purchase_id, setPurchase_id] = useState(null);
    const [cashbackEarned, setCashbackEarned] = useState(null);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        User_Wallet_Get();
    }, []);

    const User_Wallet_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user');

            if (value !== null) {
                const response = await fetch(
                    `${BaseUrl}userWallet/get?req_type=1&res_type=1&uId=${value}&type=M`,
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

                if (data.Response.Success === '1') {
                    setWalletData(data.Response.Result);
                    setCashback_wallet(data.Response.Result[0]?.cashback_wallet_available || '');
                    setEarning_wallet(data.Response.Result[0]?.earning_wallet_available || '');
                    setPurchase_wallet(data.Response.Result[0]?.purchase_wallet_available || '');
                    setVoucher_wallet(data.Response.Result[0]?.voucher_wallet_available || '');
                } else {
                    console.log(data?.Response?.Message || 'Unknown error');
                    setProfileData(null);
                }
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
    };

    const Order_Add = async (purchaseIdParam, cashbackEarnedParam) => {
        const order_add_data = new FormData();

        order_add_data.append("uId", uid);
        order_add_data.append("shippingName", Name ? Name : profileName);
        order_add_data.append("shippingMobile", MobileNo ? MobileNo : profileMobile);
        order_add_data.append("address1", Address1 ? Address1 : CurrentAddress1);
        order_add_data.append("address2", Address2 ? Address2 : CurrentAddress2);
        order_add_data.append("city", cityId ? cityId : CurrentCityId);
        order_add_data.append("state", stateId ? stateId : CurrentStateId);
        order_add_data.append("pincode", pincode ? pincode : CurrentPincode);
        order_add_data.append("payment_id", purchaseIdParam);
        order_add_data.append("bill_amount", finalAmount);
        order_add_data.append("final_paid_amount", finalAmount);
        order_add_data.append("deliveryCharges", 0);
        order_add_data.append("total_cashback_earned", cashbackEarnedParam);
        order_add_data.append("billdate", CurrentDate);
        order_add_data.append("type", "P");

        if (!(Address1 || CurrentAddress1)) {
            alert("please enter address");
            return;
        }

        try {
            const response = await fetch(`${BaseUrl}orderAdd`, {
                method: 'POST',
                headers: {
                    authentication: EncKey,
                },
                body: order_add_data,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === "1") {
                setSuccessdata(responseData?.Response?.Message)
                setOrderSuccessmodal(true);
            } else {
                ToastAndroid.showWithGravity(
                    responseData?.Response?.Message || "An error occurred",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            ToastAndroid.showWithGravity(
                "No Server Response",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        }
    };

    const apiFn = async () => {
        setLoader(true)
        const purchase_add_data = new FormData();

        purchase_add_data.append("uId", uid);
        purchase_add_data.append("type", "PD");
        purchase_add_data.append("billAmt", finalAmount);
        purchase_add_data.append("pincode", pincode ? pincode : CurrentPincode);
        purchase_add_data.append("districtId", cityId ? cityId : CurrentCityId);
        purchase_add_data.append("totalPsa", total_psa_value);
        purchase_add_data.append("voucher_amt", total_vocher_value);
        purchase_add_data.append("dealType", 1);

        try {
            const response = await fetch(`${BaseUrl}purchase_add_new`, {
                method: 'POST',
                headers: {
                    authentication: EncKey,
                },
                body: purchase_add_data,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === "1") {
                const purchaseIdValue = responseData?.Response?.Result.purchaseId;
                const cashbackValue = responseData?.Response?.Result.total_cashback_earned;
                setPurchase_id(purchaseIdValue);
                setCashbackEarned(cashbackValue);
                setSuccessdata(responseData?.Response?.Message);
                Order_Add(purchaseIdValue, cashbackValue);
            } else {
                ToastAndroid.showWithGravity(
                    responseData?.Response?.Message || "An error occurred",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            ToastAndroid.showWithGravity(
                "No Server Response",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        } finally {
            setLoader(false)
        }
    }

    const Final_Purchase = async () => {
        if (parseFloat(finalAmount) > parseFloat(purchase_wallet)) {
            alert("Insufficient funds in your Purchase Wallet. Please top up.");
            navigation.navigate('Footer', { screen: 'Topup' });
        }

        else if (!CurrentState || !CurrentCity || !CurrentPincode) {
            alert("Please update Your profile state,city and pincode")
            navigation.navigate('AvaxaaProfile');

        }
        else if (RadioBtn == 'CA') {
            if (!CurrentAddress1) {
                alert("Please Enter Default Address");
            }
            else {
                apiFn()
            }
        }
        else if (RadioBtn == 'DA') {
            if (!Address1) {
                alert("Please Enter Different Address");
            } else {
                apiFn()
            }
        }
        else {
            apiFn()
        }
    };

    const formatCurrency = (value) => {
        const amount = Number(value || 0);
        return `\u20B9 ${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'}`;
    };

    const formatReceiptAmount = (value) => {
        const amount = Number(value || 0);

        if (!Number.isFinite(amount)) {
            return '\u20B9 0';
        }

        return `\u20B9 ${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
    };

    const receiptDate = format(new Date(CurrentDate.replace(/\//g, '-')), 'dd MMMM yyyy');

    const receiptMrpTotal = (cartItems || []).reduce((sum, item) => {
        const mrp = Number(item?.item_price_details?.mrp || 0);
        const qty = Number(item?.no_of_units || 0) || 1;

        if (!Number.isFinite(mrp) || mrp <= 0) {
            return sum;
        }

        return sum + (mrp * qty);
    }, 0);

    const receiptSavings = Math.max(
        receiptMrpTotal > 0
            ? receiptMrpTotal - Number(finalAmount || 0)
            : Number(total_vocher_value || 0),
        0
    );

    const renderAddressPreview = () => {
        if (RadioBtn === 'CA') {
            return (
                <View style={[styles.addressPreviewCard, !CurrentAddress1 && styles.addressPreviewCardMuted]}>
                    <Text style={styles.addressPreviewTitle}>Default Address</Text>
                    <Text style={styles.addressPreviewName}>
                        {profileName || 'Add the address in your profile, for now you can enter a different shipping address'}
                    </Text>
                    {!!profileMobile && <Text style={styles.addressPreviewLine}>{profileMobile}</Text>}
                    {!!CurrentAddress1 && <Text style={styles.addressPreviewLine}>{CurrentAddress1}</Text>}
                    {!!CurrentAddress2 && <Text style={styles.addressPreviewLine}>{CurrentAddress2}</Text>}
                    {!!(CurrentCity || CurrentState || CurrentPincode) && (
                        <Text style={styles.addressPreviewLine}>
                            {[CurrentCity, CurrentState].filter(Boolean).join(', ')}{CurrentPincode ? ` - ${CurrentPincode}` : ''}
                        </Text>
                    )}
                </View>
            );
        }

        return (
            <View style={[styles.addressPreviewCard, !(Address1 || Name) && styles.addressPreviewCardMuted]}>
                <Text style={styles.addressPreviewTitle}>Different Shipping Address</Text>
                {!!Name && <Text style={styles.addressPreviewName}>{Name}</Text>}
                {!!MobileNo && <Text style={styles.addressPreviewLine}>{MobileNo}</Text>}
                {!!Address1 && <Text style={styles.addressPreviewLine}>{Address1}</Text>}
                {!!Address2 && <Text style={styles.addressPreviewLine}>{Address2}</Text>}
                {!!(city || state || pincode) && (
                    <Text style={styles.addressPreviewLine}>
                        {[city, state].filter(Boolean).join(', ')}{pincode ? ` - ${pincode}` : ''}
                    </Text>
                )}
                {!(Address1 || Name || MobileNo) && (
                    <Text style={styles.addressPreviewHint}>Tap this option to add a different shipping address.</Text>
                )}
            </View>
        );
    };

    const radioButtons = [
        {
            id: 'CA',
            label: 'Default Address',
            value: 'CA',
            color: '#B3202E',
            labelStyle: {
                fontSize: hp(2),
                color: '#A5242F',
                marginLeft: wp(3),
                fontWeight: '600',
            },
            borderColor: '#B3202E',
        },
        {
            id: 'DA',
            label: 'Different Shipping Address',
            value: 'DA',
            color: '#B3202E',
            labelStyle: {
                fontSize: hp(2),
                color: '#A5242F',
                marginLeft: wp(3),
                fontWeight: '600',
            },
            borderColor: '#B3202E',
        },
    ];

    return (
        <>
            <StatusBar backgroundColor='#A5242F' barStyle='light-content' />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate("PremiumItemget")} style={styles.headerBackButton}>
                            <Icon onPress={() => navigation.navigate("PremiumItemget")} name="left" size={20} color="white" />
                            <Text onPress={() => navigation.navigate("PremiumItemget")} style={styles.headerBackText}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.pageTitle}>Your Cart</Text>

                    <View style={styles.cartListWrap}>
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item, index) => index + 1}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.cartListContent}
                            ListEmptyComponent={<View style={styles.emptyCartWrap}><Text style={styles.emptyCartTitle}>No cart items yet</Text><Text style={styles.emptyCartText}>Add products from the store to see them here.</Text></View>}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.cartCard}>
                                        <Image source={{ uri: item.item_common_details.cover_img }} style={styles.cartCardImage} />
                                        <View style={styles.cartCardContent}>
                                            <Text style={styles.cartItemTitle} numberOfLines={2}>{item.item_common_details.item_name}</Text>
                                            {item.item_price_details?.mrp ? (
                                                <Text style={styles.cartItemMrp}>MRP: {formatCurrency(item.item_price_details.mrp)}</Text>
                                            ) : null}
                                            <Text style={styles.cartItemPrice}>{formatCurrency(item.total_cost)}</Text>
                                            <Text style={styles.cartItemUnit}>{`${item.item_price_details.quantity}${item.item_price_details.units}`}</Text>
                                            <View style={styles.cartActionRow}>
                                                <View style={styles.quantityControlWrap}>
                                                    <TouchableOpacity
                                                        onPress={() => updateCartItems(0, item.id, item.no_of_units)}
                                                        disabled={item.no_of_units <= 1}
                                                        style={styles.quantityActionButton}>
                                                        <AntDesign name="minus" size={hp(1.9)} color="#fff" />
                                                    </TouchableOpacity>
                                                    <View style={styles.quantityValuePill}>
                                                        <Text style={styles.quantityValueText}>{item.no_of_units}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => updateCartItems(1, item.id, item.no_of_units)}
                                                        disabled={item.no_of_units >= maxquantity}
                                                        style={styles.quantityActionButton}>
                                                        <Text style={styles.quantityActionLabel}>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={() => removeCartItems(item.id)} style={styles.deleteButtonInline}>
                                                <AntDesign name="delete" size={hp(1.8)} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                    <View style={styles.noteChip}>
                        <Text style={styles.noteChipText}>Note : Courier charges is applicable for order below Rs 700</Text>
                    </View>

                    <View style={styles.addressSectionWrap}>
                        <RadioGroup
                            radioButtons={radioButtons}
                            selectedId={RadioBtn}
                            onPress={(id) => {
                                setRadioBtn(id);
                                if (id === 'DA') {
                                    setAddressModal(true);
                                }
                            }}
                            containerStyle={styles.radioGroupWrap}
                        />
                        {renderAddressPreview()}
                    </View>

                    <View style={styles.walletRow}>
                        <View style={styles.walletCard}>
                            <Text style={styles.walletCardTitle}>Purchase Wallet</Text>
                            <Text style={styles.walletCardAmount}>{formatCurrency(purchase_wallet)}</Text>
                        </View>
                        <View style={styles.walletCard}>
                            <Text style={styles.walletCardTitle}>Avatto Wallet</Text>
                            <Text style={styles.walletCardAmount}>{formatCurrency(voucher_wallet)}</Text>
                        </View>
                    </View>

                    <View style={styles.summaryBar}>
                        <Text style={styles.summaryAmount}>{formatCurrency(cartItems ? finalAmount : 0)}</Text>
                        <TouchableOpacity
                            disabled={loader ? true : false}
                            onPress={() => setConfirmVisible(true)}
                            style={[styles.summaryBuyButton, loader && styles.summaryBuyButtonDisabled]}>
                            <Text style={styles.summaryBuyText}>Buy</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomSpacer}></View>

                    <Modal
                        animationType="slide"
                        transparent
                        visible={successmodal}
                        onRequestClose={() => {
                            setSuccessmodal(!successmodal);
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                                <Lottie resizeMode='contain' source={require('../../assets/json/success.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
                                <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text>
                                <Text style={{ fontSize: hp(1.8), color: '#000', marginTop: hp(1), textAlign: 'center', fontWeight: 'bold' }}>{successdata}</Text>
                                <TouchableOpacity onPress={() => { setSuccessmodal(false); Order_Add(purchase_id, cashbackEarned) }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent
                        visible={ordersuccessmodal}
                        onRequestClose={() => {
                            setOrderSuccessmodal(!ordersuccessmodal);
                        }}>
                        <View style={styles.receiptOverlay}>
                            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
                            <View style={styles.receiptScreen}>
                                <Text style={styles.receiptTitle}>
                                    Your order has been{'\n'}Successfully Placed
                                </Text>
                                <ImageBackground source={require('../../assets/images/Receipt.png')} style={styles.receiptCardShell}>
                                    <View style={styles.receiptBadgeRing}>
                                        <View style={styles.receiptBadge}>
                                            <AntDesign name="check" size={hp(4.5)} color="#FFFFFF" />
                                        </View>
                                    </View>
                                    <View style={styles.receiptCard}>
                                        <Text style={styles.receiptPaidLabel}>Paid Amount</Text>
                                        <Text style={styles.receiptPaidValue}>{formatReceiptAmount(finalAmount)}</Text>
                                        <Text style={styles.receiptSectionTitle}>Payment Details</Text>
                                        <View style={styles.receiptInfoRow}>
                                            <Text style={styles.receiptInfoLabel}>Date</Text>
                                            <Text style={styles.receiptInfoValue}>{receiptDate}</Text>
                                        </View>
                                        <View style={styles.receiptDivider} />
                                        <View style={styles.receiptInfoRow}>
                                            <Text style={styles.receiptInfoLabel}>MRP Value</Text>
                                            <Text style={styles.receiptInfoValue}>{formatReceiptAmount(receiptMrpTotal)}</Text>
                                        </View>
                                        <View style={styles.receiptInfoRow}>
                                            <Text style={styles.receiptInfoLabel}>Item Value</Text>
                                            <Text style={styles.receiptInfoValue}>{formatReceiptAmount(finalAmount)}</Text>
                                        </View>
                                        <View style={styles.receiptInfoRow}>
                                            <Text style={styles.receiptInfoLabel}>Service Charge</Text>
                                            <Text style={styles.receiptSavingValue}>-{formatReceiptAmount(0)}</Text>
                                        </View>
                                        <View style={styles.receiptInfoRow}>
                                            <Text style={styles.receiptInfoLabel}>Savings</Text>
                                            <Text style={styles.receiptSavingValue}>-{formatReceiptAmount(receiptSavings)}</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                                <TouchableOpacity
                                    onPress={() => {
                                        setOrderSuccessmodal(false);
                                        navigation.navigate('Footer');
                                    }}
                                    style={styles.receiptHomeButton}
                                >
                                    <Text style={styles.receiptHomeButtonText}>Back to Home</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent
                        visible={addressModal}
                        onRequestClose={() => {
                            setAddressModal(!addressModal);
                        }}>
                        <>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={{ height: hp(100), width: wp(100), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0), elevation: 5 }}>
                                    <View style={{ height: hp(6), width: wp(100), flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: hp(10), borderTopRightRadius: hp(10), marginTop: hp(1) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity onPress={() => setAddressModal(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(2) }}>
                                                <SimpleLineIcons onPress={() => navigation.navigate("PremiumCartItems")} name="close" size={24} color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: wp(100), height: hp(100), justifyContent: 'center', alignItems: 'center', marginTop: hp(-10), alignSelf: 'center' }}>
                                        <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 0 }}>
                                            <Text style={{ color: '#A6222C', fontSize: hp(2), fontWeight: '700', textAlign: 'center' }}>SHIPPING ADDRESS</Text>

                                            <TextInput
                                                mode="outlined"
                                                label="Name"
                                                outlineColor="black"
                                                placeholder="Name"
                                                placeholderTextColor="gray"
                                                style={{ width: wp(87), backgroundColor: "#fff", fontSize: hp(1.7), marginTop: hp(2), alignSelf: "center" }}
                                                contentStyle={{ color: "#000", height: hp(5.5) }}
                                                outlineStyle={{ backgroundColor: "transparent", borderColor: "#A6222C", borderRadius: 12, borderWidth: 1 }}
                                                activeOutlineColor="#A6222C"
                                                cursorColor="#A6222C"
                                                keyboardType="ascii-capable"
                                                value={Name}
                                                onChangeText={(value) => setName(value)}
                                            />

                                            <TextInput
                                                mode="outlined"
                                                label="Mobile Number"
                                                outlineColor="black"
                                                placeholder="Mobile Number"
                                                placeholderTextColor="gray"
                                                style={{ width: wp(87), backgroundColor: "#fff", fontSize: hp(1.7), marginTop: hp(2), alignSelf: "center" }}
                                                contentStyle={{ color: "#000", height: hp(5.5) }}
                                                outlineStyle={{ backgroundColor: "transparent", borderColor: "#A6222C", borderRadius: 12, borderWidth: 1 }}
                                                maxLength={10}
                                                activeOutlineColor="#A6222C"
                                                cursorColor="#A6222C"
                                                keyboardType="ascii-capable"
                                                value={MobileNo}
                                                onChangeText={(value) => setMobileNo(value)}
                                            />

                                            <TextInput
                                                mode="outlined"
                                                label="Address"
                                                outlineColor="black"
                                                placeholder="Address"
                                                placeholderTextColor="gray"
                                                style={{ width: wp(87), backgroundColor: "#fff", fontSize: hp(1.7), marginTop: hp(2), alignSelf: "center" }}
                                                contentStyle={{ color: "#000", height: hp(5.5) }}
                                                outlineStyle={{ backgroundColor: "transparent", borderColor: "#A6222C", borderRadius: 12, borderWidth: 1 }}
                                                activeOutlineColor="#A6222C"
                                                cursorColor="#A6222C"
                                                keyboardType="ascii-capable"
                                                value={Address1}
                                                onChangeText={(value) => setAddress1(value)}
                                            />

                                            <TextInput
                                                mode="outlined"
                                                label="Address"
                                                outlineColor="black"
                                                placeholder="Address"
                                                placeholderTextColor="gray"
                                                style={{ width: wp(87), backgroundColor: "#fff", fontSize: hp(1.7), marginTop: hp(2), alignSelf: "center" }}
                                                contentStyle={{ color: "#000", height: hp(5.5) }}
                                                outlineStyle={{ backgroundColor: "transparent", borderColor: "#A6222C", borderRadius: 12, borderWidth: 1 }}
                                                activeOutlineColor="#A6222C"
                                                cursorColor="#A6222C"
                                                keyboardType="ascii-capable"
                                                value={Address2}
                                                onChangeText={(value) => setAddress2(value)}
                                            />

                                            <TextInput
                                                mode="outlined"
                                                label="Pincode"
                                                autoCapitalize="characters"
                                                outlineColor="black"
                                                placeholder="Pincode"
                                                placeholderTextColor="gray"
                                                style={{ width: wp(87), backgroundColor: "#fff", fontSize: hp(1.7), marginTop: hp(2), alignSelf: "center" }}
                                                contentStyle={{ color: "#000", height: hp(5.5) }}
                                                outlineStyle={{ backgroundColor: "transparent", borderColor: "#A6222C", borderRadius: 12, borderWidth: 1 }}
                                                activeOutlineColor="#A6222C"
                                                cursorColor="#A6222C"
                                                keyboardType="numeric"
                                                value={pincode || ""}
                                                maxLength={6}
                                                onChangeText={(value) => setPincode(value)}
                                            />

                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: 12, alignSelf: 'center', marginTop: hp(2.5) }}>
                                                <Text style={{ color: state ? '#000' : '#454545', fontSize: hp(1.7), marginLeft: wp(3) }}>{state ? state : 'State'}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: 12, alignSelf: 'center', marginTop: hp(2.5) }}>
                                                <Text style={{ color: city ? '#000' : '#454545', fontSize: hp(1.7), marginLeft: wp(3) }}>{city ? city : 'City'}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => setAddressModal(false)}
                                                disabled={!isFormValid}
                                                style={{
                                                    padding: hp(1),
                                                    width: wp(30),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: isFormValid ? '#A6222C' : 'gray',
                                                    borderRadius: hp(1),
                                                    marginTop: hp(10),
                                                    alignSelf: 'center',
                                                }}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
                                            </TouchableOpacity>

                                            <View style={{ height: hp(1.5) }}></View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </>
                    </Modal>

                    <Modal
                        transparent
                        visible={confirmVisible}
                        animationType="fade"
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                width: wp(80),
                                backgroundColor: '#f3abb1',
                                borderRadius: hp(2),
                                padding: hp(3),
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: hp(2.5), fontWeight: '700', color: '#A6222C', marginBottom: hp(2) }}>
                                    Are you sure?
                                </Text>
                                <Text style={{ fontSize: hp(2), color: '#000', textAlign: 'center', marginBottom: hp(3) }}>
                                    Do you want to complete this purchase now?
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <TouchableOpacity
                                        onPress={() => setConfirmVisible(false)}
                                        style={{
                                            width: '45%',
                                            backgroundColor: '#f3abb1',
                                            paddingVertical: hp(1.5),
                                            borderRadius: hp(1),
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: '#A6222C'
                                        }}>
                                        <Text style={{ color: '#000', fontSize: hp(2), fontWeight: '600' }}>No</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setConfirmVisible(false);
                                            Final_Purchase();
                                        }}
                                        style={{
                                            width: '45%',
                                            backgroundColor: '#A6222C',
                                            paddingVertical: hp(1.5),
                                            borderRadius: hp(1),
                                            alignItems: 'center'
                                        }}>
                                        <Text style={{ color: '#FFF', fontSize: hp(2), fontWeight: '600' }}>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        </>
    )
}

export default PremiumCartItems

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F4F4',
    },
    scrollContent: {
        paddingBottom: hp(4),
    },
    header: {
        backgroundColor: '#A5242F',
        height: hp(8),
        paddingHorizontal: wp(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    headerBackText: {
        color: '#FDE9EA',
        fontSize: hp(1.8),
        marginLeft: wp(2),
        fontWeight: '500',
    },
    pageTitle: {
        color: '#A5242F',
        fontSize: hp(2.8),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: hp(3.2),
        marginBottom: hp(1.5),
    },
    cartListWrap: {
        width: wp(100),
    },
    cartListContent: {
        paddingBottom: hp(1.5),
    },
    cartCard: {
        width: wp(92),
        minHeight: hp(17),
        backgroundColor: '#FFFFFF',
        borderRadius: hp(2.5),
        alignSelf: 'center',
        marginVertical: hp(1.1),
        padding: hp(1.35),
        flexDirection: 'row',
        shadowColor: '#632028',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    cartCardImage: {
        width: wp(32),
        height: hp(14),
        borderRadius: hp(2.2),
        resizeMode: 'cover',
        backgroundColor: '#F3ECEC',
    },
    cartCardContent: {
        flex: 1,
        marginLeft: wp(4),
        justifyContent: 'flex-start',
        paddingBottom: hp(0.2),
    },
    cartItemTitle: {
        color: '#B3202E',
        fontSize: hp(2.05),
        fontWeight: '600',
        lineHeight: hp(2.8),
        marginTop: hp(0.2),
    },
    cartItemMrp: {
        color: '#9292A0',
        fontSize: hp(1.55),
        textDecorationLine: 'line-through',
        marginTop: hp(0.5),
    },
    cartItemPrice: {
        color: '#B3202E',
        fontSize: hp(2.1),
        fontWeight: '700',
        marginTop: hp(0.45),
    },
    cartItemUnit: {
        color: '#8E93A3',
        fontSize: hp(1.65),
        marginTop: hp(0.4),
    },
    cartActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1.1),
    },
    quantityControlWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#A6222C33',
        borderRadius: 10,
    },
    quantityActionButton: {
        width: hp(4.1),
        height: hp(4.1),
        borderRadius: hp(1.2),
        backgroundColor: '#B3202E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityActionLabel: {
        color: '#FFFFFF',
        fontSize: hp(2.5),
        fontWeight: '700',
        lineHeight: hp(2.8),
    },
    quantityValuePill: {
        minWidth: wp(10),
        height: hp(4.1),
        borderRadius: hp(1.2),
        backgroundColor: '#F2D8DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: wp(2),
        paddingHorizontal: wp(2),
    },
    quantityValueText: {
        color: '#B3202E',
        fontSize: hp(2),
        fontWeight: '700',
    },
    deleteButtonInline: {
        width: hp(4.1),
        height: hp(4.1),
        borderRadius: hp(1.2),
        backgroundColor: '#FF1730',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    emptyCartWrap: {
        minHeight: hp(26),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(10),
    },
    emptyCartTitle: {
        color: '#A5242F',
        fontSize: hp(2.4),
        fontWeight: '700',
    },
    emptyCartText: {
        color: '#8E8690',
        fontSize: hp(1.7),
        textAlign: 'center',
        marginTop: hp(0.8),
        lineHeight: hp(2.4),
    },
    sectionTitle: {
        color: '#A5242F',
        fontSize: hp(2.9),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: hp(2.4),
        marginBottom: hp(1.2),
    },
    noteChip: {
        alignSelf: 'center',
        backgroundColor: '#FBE4E6',
        borderRadius: hp(1.5),
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(0.95),
        marginTop: hp(0.5),
        marginBottom: hp(1.7),
    },
    noteChipText: {
        color: '#FF1F24',
        fontSize: hp(1.55),
        textAlign: 'center',
    },
    addressSectionWrap: {
        width: wp(92),
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: hp(2.5),
        paddingHorizontal: wp(4.5),
        paddingTop: hp(1.5),
        paddingBottom: hp(2),
        shadowColor: '#632028',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    radioGroupWrap: {
        alignItems: 'flex-start',
        width: '100%',
    },
    addressPreviewCard: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#F0D8DB',
        borderRadius: hp(1.8),
        padding: hp(1.5),
        marginTop: hp(1),
        marginBottom: hp(0.5),
        backgroundColor: '#FFFDFD',
    },
    addressPreviewCardMuted: {
        borderStyle: 'dashed',
    },
    addressPreviewTitle: {
        color: '#A5242F',
        fontSize: hp(1.7),
        fontWeight: '700',
        marginBottom: hp(0.8),
    },
    addressPreviewName: {
        color: '#7C1A22',
        fontSize: hp(1.8),
        fontWeight: '600',
        lineHeight: hp(2.6),
    },
    addressPreviewLine: {
        color: '#7C1A22',
        fontSize: hp(1.7),
        marginTop: hp(0.45),
        lineHeight: hp(2.5),
    },
    addressPreviewHint: {
        color: '#9B7F84',
        fontSize: hp(1.55),
        lineHeight: hp(2.2),
    },
    walletRow: {
        width: wp(90),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(1.4),
    },
    walletCard: {
        width: wp(43),
        minHeight: hp(9),
        borderRadius: hp(2.2),
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8E8EC',
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1.4),
        justifyContent: 'center',
        shadowColor: '#632028',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    walletCardTitle: {
        color: '#8E93A3',
        fontSize: hp(1.7),
        fontWeight: '600',
    },
    walletCardAmount: {
        color: '#B3202E',
        fontSize: hp(2.4),
        fontWeight: '700',
        marginTop: hp(0.6),
    },
    summaryBar: {
        width: wp(90),
        minHeight: hp(7.3),
        borderRadius: hp(2.2),
        backgroundColor: '#A6222C33',
        alignSelf: 'center',
        marginTop: hp(1.4),
        marginBottom: hp(2),
        paddingHorizontal: wp(3.8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    summaryBuyButton: {
        width: wp(34),
        height: hp(5.2),
        borderRadius: hp(2.6),
        backgroundColor: '#B3202E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryBuyButtonDisabled: {
        backgroundColor: '#A7A1A4',
    },
    summaryAmount: {
        color: '#B3202E',
        fontSize: hp(2.7),
        fontWeight: '700',
    },
    summaryBuyText: {
        color: '#FFFFFF',
        fontSize: hp(2),
        fontWeight: '700',
    },
    bottomSpacer: {
        width: wp(100),
        height: hp(3),
    },
    receiptOverlay: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    receiptScreen: {
        flex: 1,
        alignItems: 'center',
        paddingTop: hp(2),
        paddingBottom: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: '#FFFFFF',
    },
    receiptTitle: {
        color: '#B12630',
        fontSize: hp(3.2),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: hp(2),
    },
    receiptCardShell: {
        width: wp(86),
        marginTop: hp(8),
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 5,
        paddingBottom: 20,
        borderRadius: 10,
    },
    receiptBadgeRing: {
        position: 'absolute',
        top: hp(-7.2),
        width: hp(14),
        height: hp(14),
        borderRadius: hp(7),
        backgroundColor: '#F4E7E8',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    receiptBadge: {
        width: hp(11.5),
        height: hp(11.5),
        borderRadius: hp(5.75),
        backgroundColor: '#B12630',
        justifyContent: 'center',
        alignItems: 'center',
    },
    receiptCard: {
        width: '100%',
        borderRadius: hp(2.5),
        paddingTop: hp(8),
        paddingBottom: hp(0),
        paddingHorizontal: wp(5.5),
        shadowColor: '#4F3A3D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
    },
    receiptPaidLabel: {
        color: '#8F97A8',
        fontSize: hp(2.6),
        fontWeight: '600',
        textAlign: 'center',
    },
    receiptPaidValue: {
        color: '#B12630',
        fontSize: hp(6),
        fontWeight: '800',
        textAlign: 'center',
        marginTop: hp(1.8),
    },
    receiptSectionTitle: {
        color: '#0E0E12',
        fontSize: hp(2.5),
        fontWeight: '500',
        textAlign: 'center',
        marginTop: hp(2),
        marginBottom: hp(4),
    },
    receiptInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(1.6),
    },
    receiptInfoLabel: {
        color: '#9AA0AE',
        fontSize: hp(2.05),
        fontWeight: '500',
    },
    receiptInfoValue: {
        color: '#1E1E28',
        fontSize: hp(2.1),
        fontWeight: '500',
    },
    receiptSavingValue: {
        color: '#6DBA24',
        fontSize: hp(2.1),
        fontWeight: '500',
    },
    receiptDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEF',
        borderStyle: 'dashed',
        marginVertical: hp(2),
    },
    receiptHomeButton: {
        width: wp(82),
        height: hp(6),
        borderRadius: hp(4),
        backgroundColor: '#B12630',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(3),
        shadowColor: '#7D232C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 6,
    },
    receiptHomeButtonText: {
        color: '#FFFFFF',
        fontSize: hp(2),
        fontWeight: '700',
    },
})
