import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert, Clipboard,
    Animated, StatusBar, Dimensions, Modal,
    ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import axios from "axios";
const { width: SW } = Dimensions.get('window');
import { usePermissions, PermissionTypes } from './QRScanner/usePermissions';
import CameraScanner from './QRScanner/CameraScanner'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@react-native-vector-icons/ant-design';
import { useNavigation, useRoute } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';



/* ─── CONFIG ──────────────────────────────────────────────────── */

const AUTH = 'U2FsdGVkX1+GlwN//3zk31Sm9LK1WafujRfUtRVhbR/GA92/CCrS4ECcQr1kXNNY';
const BASE = 'https://avatto.info/admin_avatto';
const HEADERS = { authentication: AUTH };

/* ─── COLORS ──────────────────────────────────────────────────── */
const C = {
    bg: '#fff',
    card: '#FFFFFF',
    primary: '#A6222C',
    light: '#F5EFE0',
    border: '#E8DCC8',
    text: '#2A1A1A',
    sub: '#7A6A5A',
    green: '#2E7D32',
    red: '#C62828',
    gold: '#B8860B',
};

/* ─── SCREENS ENUM ────────────────────────────────────────────── */
const S = { HOME: 'home', DETAIL: 'detail', REDEEM: 'redeem', HISTORY: 'history' };

/* ══════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════ */
export default function GiftCardScreen() {

    const route = useRoute();
    const purchaseWallet = route.params?.purchaseWallet;
    const [screen, setScreen] = useState(S.HOME);
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState('');
    const [buying, setBuying] = useState(false);
    const [lastCard, setLastCard] = useState(null); // after buy → show detail
    const [detailCard, setDetailCard] = useState(null); // from history tap
    const [historyData, setHistoryData] = useState([]);
    const [histLoading, setHistLoading] = useState(false);
    const floatAnim = useRef(new Animated.Value(0)).current;




    useEffect(() => {
        fetchWallet();
        // Float animation for FAB
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -6, duration: 900, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);



    useEffect(() => {
        fetch("https://google.com")
            .then(() => console.log("INTERNET OK"))
            .catch((e) => console.log("INTERNET FAIL", e));
    }, []);
    /* ── Wallet ── */
    // const fetchWallet = async () => {
    //   try {
    //     const res = await fetch(
    //       `${BASE}/userWallet/get?uId=${USER_ID}&req_type=1&res_type=1`,
    //       {
    //         method: "GET",
    //         headers: HEADERS,
    //       }
    //     );

    //     const json = await res.json();

    //     console.log("FULL RESPONSE 👉", json); // debug

    //     const r = json?.Response?.Result?.[0];

    //     if (r) {
    //       console.log("WALLET 👉", r);
    //       setWallet(r);
    //     } else {
    //       console.log("No wallet data");
    //     }
    //   } catch (e) {
    //     console.log("wallet err", e);
    //   }
    // };


    const fetchWallet = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            if (value !== null) {
                try {
                    const res = await fetch(
                        `https://avatto.info/admin_avatto/userWallet/get?uId=${value}&req_type=1&res_type=1`,
                        {
                            method: "GET",
                            headers: {
                                authentication: AUTH,
                            },
                        }
                    );

                    const json = await res.json();
                    console.log(json);
                } catch (e) {
                    console.log("ERROR 👉", e);
                }
            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }

    };

    const [successModal, setSuccessModal] = useState(false);


    // const fetchWallet = async () => {
    //   try {
    //     const res = await axios.get(
    //       `${BASE}/userWallet/get`,
    //       {
    //         params: {
    //           uId:USER_ID,
    //           req_type: 1,
    //           res_type: 1,
    //         },
    //         headers: {
    //           authentication: AUTH,
    //         },
    //         timeout: 10000,
    //       }
    //     );

    //     console.log("DATA 👉", res.data);
    //     setWallet(res.data?.Response?.Result?.[0]);
    //   } catch (e) {
    //     console.log("AXIOS ERROR 👉", e.message);
    //   }
    // };


    /* ── Buy Gift Card ── */
    const handleBuy = async () => {
        const amt = Number(amount);
        if (!amount || isNaN(amt) || amt < 100) {
            ToastAndroid.showWithGravityAndOffset(
                `${'Minimum amount is ₹100'}`,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            return;
        }
        setBuying(true);

        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            if (value !== null) {
                try {
                    const fd = new FormData();
                    fd.append('req_type', '1');
                    fd.append('amount', amt);
                    fd.append('user_id', value);
                    const res = await fetch(`${BASE}/createGiftCard`, { method: 'POST', headers: HEADERS, body: fd });
                    const json = await res.json();
                    if (json?.Response?.Success === '1') {
                        const card = {
                            voucher_no: json.Response.voucher_no,
                            pin: String(json.Response.pin),
                            amount: amt,
                            debug: json.debug,
                        };
                        setLastCard(card);
                        setDetailCard(card);
                        setAmount('');
                        fetchWallet();
                        setScreen(S.DETAIL);
                        setSuccessModal(true);
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            `${json?.Response?.Message || 'Failed to create gift card'}`,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                } catch (e) {
                    ToastAndroid.showWithGravityAndOffset(
                        `Network error`,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
                setBuying(false);
            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }

    };

    /* ── History ── */
    const fetchHistory = async () => {
        setHistLoading(true);
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            if (value !== null) {
                try {
                    const res = await fetch(`${BASE}/giftCardHistory?user_id=${value}&req_type=1`, { headers: HEADERS });
                    const json = await res.json();
                    setHistoryData(json?.Response?.Sent_GiftCards || []);
                } catch (e) { console.log('history err', e); }
                setHistLoading(false);
            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }

    };

    const goHistory = () => { fetchHistory(); setScreen(S.HISTORY); };

    /* ── Render ── */
    return (
        <SafeAreaView style={s.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

            {screen === S.HOME && (
                <HomeScreen
                    wallet={purchaseWallet}
                    amount={amount}
                    setAmount={setAmount}
                    buying={buying}
                    onBuy={handleBuy}
                    onHistory={goHistory}
                    onRedeem={() => setScreen(S.REDEEM)}
                    floatAnim={floatAnim}
                />
            )}
            {screen === S.DETAIL && (
                <GiftCardDetailScreen
                    card={detailCard}
                    onBack={() => setScreen(S.HOME)}
                />
            )}
            {screen === S.REDEEM && (
                <RedeemScreen
                    onBack={() => setScreen(S.HOME)}
                    onSuccess={() => { fetchWallet(); setScreen(S.HOME); }}
                />
            )}
            {screen === S.HISTORY && (
                <HistoryScreen
                    data={historyData}
                    loading={histLoading}
                    onBack={() => setScreen(S.HOME)}
                    onCardPress={(card) => { setDetailCard(card); setScreen(S.DETAIL); }}
                />
            )}

            {/* =====================================================Success modal=============================================== */}
            <Modal
                animationType="slide"
                transparent
                visible={successModal}
                onRequestClose={() => {
                    setSuccessModal(!successModal);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                        <Lottie resizeMode='cover' source={require('../../assets/json/shopsuccess.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop />
                        <Text style={{ fontSize: hp(2.5), fontWeight: '500', color: '#000', marginTop: hp(3), textAlign: 'center', width: wp(60) }}>Gift Card Purchased Successfully</Text>
                        <TouchableOpacity onPress={() => { setSuccessModal(false) }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                            <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* ══════════════════════════════════════════════════════════════════
   HOME SCREEN
══════════════════════════════════════════════════════════════════ */
const HomeScreen = ({ wallet, amount, setAmount, buying, onBuy, onHistory, onRedeem, floatAnim }) => {
    const balance = wallet ? wallet : '0';
    const slideIn = useRef(new Animated.Value(30)).current;
    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideIn, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const baseAmt = Number(amount) || 0;
    const avatto = +(baseAmt * 0.05).toFixed(2);
    const service = +(baseAmt * 0.05).toFixed(2);
    const total = +(baseAmt + avatto + service).toFixed(2);
    const navigation = useNavigation();

    return (
        <ScrollView style={s.screen} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={s.header}>
                <AntDesign onPress={() => navigation.goBack()} name="left" size={18} color={'#A6222C'} />
                <Text style={s.headerTitle}>Purchase Wallet</Text>
                <TouchableOpacity style={s.histBtn} onPress={onHistory}>
                    <Text style={s.histBtnText}>History</Text>
                </TouchableOpacity>
            </View>

            {/* Wallet Card */}
            <Animated.View style={[s.walletCard, { opacity: fade, transform: [{ translateY: slideIn }] }]}>
                <View style={s.walletLeft}>
                    <Text style={s.walletLabel}>Purchase Wallet</Text>
                    <Text style={s.walletAmt}>₹{balance}</Text>
                    {/* <Text style={s.walletFee}>+ 5%  Avatto Wallet</Text>
                    <Text style={s.walletFee}>+ 5%  Service charge</Text> */}
                </View>
                <Text style={s.walletEmoji}>💳</Text>
            </Animated.View>

            {/* Buy Section */}
            <View style={s.buyCard}>
                <View style={s.buyRow}>
                    <View style={s.amtBox}>
                        <Text style={s.amtPrefix}>₹</Text>
                        <TextInput
                            style={s.amtInput}
                            placeholder="100"
                            placeholderTextColor={C.border}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <TouchableOpacity style={[s.buyBtn, buying && { opacity: 0.7 }]} onPress={onBuy} disabled={buying}>
                        {buying
                            ? <ActivityIndicator color="#FFF" size="small" />
                            : <Text style={s.buyBtnText}>Buy Gift Card</Text>
                        }
                    </TouchableOpacity>
                </View>

                {/* Live fee preview */}
                {/* {baseAmt > 0 && (
                    <View style={s.feePreview}>
                        <FeeRow label="Base Amount" value={`₹${baseAmt}`} />
                        <FeeRow label="Avatto Wallet (5%)" value={`+₹${avatto}`} />
                        <FeeRow label="Service charge (5%)" value={`+₹${service}`} />
                        <View style={s.feeDivider} />
                        <FeeRow label="Total Deducted" value={`₹${total}`} bold />
                    </View>
                )} */}
            </View>

            {/* NOTE */}
            <Text style={s.note}>NOTE: You can redeem this gift card only on Avatto website</Text>

            {/* Redeem FAB */}
            <Animated.View style={[s.redeemFab, { transform: [{ translateY: floatAnim }] }]}>
                <TouchableOpacity style={s.redeemFabBtn} onPress={onRedeem}>
                    <Text style={s.redeemFabText}>Redeem{'\n'}Gift Card</Text>
                </TouchableOpacity>
            </Animated.View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const FeeRow = ({ label, value, bold }) => (
    <View style={s.feeRow}>
        <Text style={[s.feeLabel, bold && { fontWeight: '700', color: C.text }]}>{label}</Text>
        <Text style={[s.feeVal, bold && { fontWeight: '700', color: C.primary }]}>{value}</Text>
    </View>
);

/* ══════════════════════════════════════════════════════════════════
   GIFT CARD DETAIL SCREEN
══════════════════════════════════════════════════════════════════ */
const GiftCardDetailScreen = ({ card, onBack }) => {
    const qrRef = useRef(null);

    const copyToClipboard = (val, label) => {
        Clipboard.setString(String(val));
        //Alert.alert('Copied', `${label} copied to clipboard`);
        ToastAndroid.showWithGravityAndOffset(
            `${label} copied to clipboard`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };

    const shareQRCode = async () => {
        try {
            const uri = await captureRef(qrRef, { format: 'png', quality: 1 });
            await Share.open({
                url: `file://${uri}`,
                type: 'image/png',
                title: 'Gift Card QR Code',
            });
        } catch (error) {
            if (error?.message !== 'User did not share') {
                Alert.alert('Error', 'Could not share QR code. Please try again.');
            }
        }
    };

    const qrValue = card?.voucher_no || 'N/A';

    return (
        <ScrollView style={s.screen} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Text style={s.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle}>GIFT CARD DETAIL</Text>
                <View style={{ width: 36 }} />
            </View>

            <View style={s.detailCard}>
                {/* Voucher No */}
                <View style={s.detailField}>
                    <View style={s.detailFieldHeader}>
                        <Text style={s.detailLabel}>Gift Card Number:</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(card?.voucher_no, 'Gift Card Number')}>
                            <Text style={s.copyIcon}>📋</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={s.detailValue}>{card?.voucher_no}</Text>
                </View>

                <View style={s.detailDivider} />

                {/* PIN */}
                <View style={s.detailField}>
                    <View style={s.detailFieldHeader}>
                        <Text style={s.detailLabel}>PIN:</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(card?.pin, 'PIN')}>
                            <Text style={s.copyIcon}>📋</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={s.detailValue}>{card?.pin}</Text>
                </View>

                <View style={s.detailDivider} />

                {/* Amount */}
                {card?.amount && (
                    <>
                        <View style={s.detailField}>
                            <Text style={s.detailLabel}>Amount:</Text>
                            <Text style={[s.detailValue, { color: C.primary }]}>₹{card.amount}</Text>
                        </View>
                        <View style={s.detailDivider} />
                    </>
                )}

                {/* QR Code */}
                <View style={s.qrSection}>
                    <Text style={s.detailLabel}>Redemption QR Code:</Text>
                    <View style={s.qrBox} ref={qrRef} collapsable={false}>
                        <QRCode
                            value={qrValue}
                            size={SW * 0.55}
                            color={C.primary}
                            backgroundColor={C.bg}
                        />
                    </View>
                </View>
            </View>

            {/* Share */}
            <TouchableOpacity style={s.shareBtn} onPress={shareQRCode}>
                <Text style={s.shareBtnText}>Share</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

/* ══════════════════════════════════════════════════════════════════
   REDEEM SCREEN
══════════════════════════════════════════════════════════════════ */
const RedeemScreen = ({ onBack, onSuccess }) => {
    const [voucher, setVoucher] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [validating, setValidating] = useState(false);

    const handleRedeem = async () => {
        if (!voucher || !pin) {
            //  Alert.alert('Missing fields', 'Enter voucher number and PIN'); 
            ToastAndroid.showWithGravityAndOffset(
                'Enter voucher number and PIN',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            return;
        }
        setValidating(true);
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            if (value !== null) {
                try {
                    const fd = new FormData();
                    fd.append('user_id', value);
                    fd.append('voucher_no', voucher.trim());
                    fd.append('pin', pin.trim());
                    const res = await fetch(`${BASE}/redeemGiftCard`, { method: 'POST', headers: HEADERS, body: fd });
                    const json = await res.json();
                    if (json?.Response?.Success === '1') {
                        // Alert.alert('🎉 Success', `Gift card of ₹${json.Response.amount} redeemed successfully!`, [
                        //     { text: 'OK', onPress: onSuccess }
                        // ]);

                        ToastAndroid.showWithGravityAndOffset(
                            `🎉 Gift card of ₹${json.Response.amount} redeemed successfully!`,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );

                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            `${json?.Response?.Message || 'Redemption failed'}`,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                } catch (e) {
                    ToastAndroid.showWithGravityAndOffset(
                        `${json?.Response?.Message || 'Network error'}`,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
                setValidating(false);
            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
    };

    const [isCameraShown, setIsCameraShown] = useState(false);
    const [scannedValue, setScannedValue] = useState('');
    const [loadScanner, setLoadScanner] = useState(false);
    const [loading, setIsLoading] = useState(false);

    const debounceTimeoutRef = useRef(null);
    const onReadCode = (value) => {
        setScannedValue(value);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            console.log(value);
            setVoucher(value)
            setLoadScanner(false)
        }, 300);
    };

    return (
        <ScrollView style={s.screen} contentContainerStyle={s.scrollPad} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <AntDesign name="left" size={18} color={'#A6222C'} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>SCAN & REDEEM GIFT CARD</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* QR Scanner Placeholder */}
            <TouchableOpacity onPress={()=>setLoadScanner(true)} style={s.scannerBox}>
                <View style={s.scannerCornerTL} /><View style={s.scannerCornerTR} />
                <View style={s.scannerCornerBL} /><View style={s.scannerCornerBR} />
                <Text style={s.scannerText}>Align QR/Barcode in view to scan</Text>

                <View style={s.scanLine} />
                {/* <Text style={s.scannerText}>Align QR/Barcode in view to scan</Text> */}
            </TouchableOpacity>
            {
                loadScanner && (
                    <CameraScanner setIsCameraShown={setIsCameraShown} onReadCode={onReadCode} />
                )
            }
            {/* <CameraScanner setIsCameraShown={setIsCameraShown} onReadCode={onReadCode} /> */}

            {/* Manual entry */}
            <View style={s.redeemCard}>
                {/* <Text style={s.redeemSectionLabel}>Or enter manually:</Text> */}

                <Text style={s.fieldLabel}>Gift Card Number:</Text>
                <View style={s.redeemInputRow}>
                    <TextInput
                        style={s.redeemInput}
                        placeholder="Enter voucher number"
                        placeholderTextColor={C.border}
                        value={voucher}
                        onChangeText={setVoucher}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity onPress={() => { Clipboard.getString().then(t => setVoucher(t)); }}>
                        <Text style={s.inputIcon}>📷</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[s.fieldLabel, { marginTop: 14 }]}>PIN:</Text>
                <View style={s.redeemInputRow}>
                    <TextInput
                        style={[s.redeemInput, { flex: 1 }]}
                        placeholder="Enter PIN"
                        placeholderTextColor={C.border}
                        secureTextEntry={!showPin}
                        keyboardType="numeric"
                        value={pin}
                        onChangeText={setPin}
                    />
                    <TouchableOpacity onPress={() => setShowPin(!showPin)} style={{ marginRight: 8 }}>
                        <Text style={s.inputIcon}>{showPin ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Clipboard.getString().then(t => setPin(t)); }}>
                        <Text style={s.inputIcon}>📋</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[s.validateBtn, validating && { opacity: 0.7 }]}
                    onPress={handleRedeem}
                    disabled={validating}
                >
                    {validating
                        ? <><ActivityIndicator color="#FFF" size="small" /><Text style={s.validateBtnText}>  Validating your card...</Text></>
                        : <Text style={s.validateBtnText}>VALIDATE GIFT CARD  ›</Text>
                    }
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

/* ══════════════════════════════════════════════════════════════════
   HISTORY SCREEN
══════════════════════════════════════════════════════════════════ */
const HistoryScreen = ({ data, loading, onBack, onCardPress }) => (
    <View style={s.screen}>
        <View style={s.header}>
            <TouchableOpacity onPress={onBack} style={s.backBtn}>
                <AntDesign name="left" size={18} color={'#A6222C'} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Gift Card History</Text>
            <View style={{ width: 36 }} />
        </View>

        {loading ? (
            <View style={s.center}><ActivityIndicator size="large" color={C.primary} /></View>
        ) : (
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {data.length === 0 && (
                    <Text style={{ textAlign: 'center', color: C.sub, marginTop: 40 }}>No gift cards yet</Text>
                )}
                {data.map((item, i) => (
                    <TouchableOpacity
                        key={item.id}
                        style={s.histCard}
                        onPress={() => onCardPress({ voucher_no: item.voucher_no, pin: item.pin, amount: item.amount })}
                        activeOpacity={0.85}
                    >
                        {/* Status badge */}
                        <View style={[s.statusBadge, item.status === 1 ? s.statusUsed : s.statusActive]}>
                            <Text style={s.statusText}>{item.status === 1 ? 'Redeemed' : 'Active'}</Text>
                        </View>

                        <View style={s.histCardRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.histVoucher}>{item.voucher_no}</Text>
                                <Text style={s.histDate}>{new Date(item.created_at).toLocaleDateString('en-IN')}</Text>
                                {item.receiver_name && (
                                    <Text style={s.histReceiver}>Redeemed by: {item.receiver_name}</Text>
                                )}
                            </View>
                            <View style={s.histAmtBox}>
                                <Text style={s.histAmt}>₹{item.amount}</Text>
                                <Text style={s.histViewText}>View ›</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )}
    </View>
);

/* ══════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════ */
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg },
    screen: { flex: 1, backgroundColor: C.bg },
    scrollPad: { padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    /* Header */
    header: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
        justifyContent: 'space-between', marginBottom: 20,
    },
    headerTitle: { fontSize: 18, fontWeight: '800', color: C.primary, flex: 1, textAlign: 'center' },
    backBtn: { width: 36, height: 36, justifyContent: 'center' },
    backArrow: { fontSize: 22, color: C.primary, fontWeight: '700' },
    histBtn: {
        backgroundColor: C.primary, borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 6,
    },
    histBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

    /* Wallet Card */
    walletCard: {
        backgroundColor: C.primary, borderRadius: 20, padding: 22,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, elevation: 6,
        shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12,
    },
    walletLeft: {},
    walletLabel: { color: '#FFD0D0', fontSize: 13, fontWeight: '600', marginBottom: 4 },
    walletAmt: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
    walletFee: { color: '#FFB0B0', fontSize: 12, marginTop: 4 },
    walletEmoji: { fontSize: 48 },

    /* Buy Card */
    buyCard: {
        backgroundColor: C.card, borderRadius: 20, padding: 18,
        borderWidth: 1, borderColor: C.border, marginBottom: 16,
    },
    buyRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    amtBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
        paddingHorizontal: 12,
    },
    amtPrefix: { fontSize: 18, color: C.sub, fontWeight: '600' },
    amtInput: { flex: 1, fontSize: 18, color: C.text, paddingVertical: 12 },
    buyBtn: {
        backgroundColor: C.primary, borderRadius: 12,
        paddingHorizontal: 18, paddingVertical: 14,
    },
    buyBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

    /* Fee preview */
    feePreview: { marginTop: 16, gap: 4 },
    feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    feeLabel: { fontSize: 13, color: C.sub },
    feeVal: { fontSize: 13, color: C.sub },
    feeDivider: { height: 1, backgroundColor: C.border, marginVertical: 6 },

    note: { textAlign: 'center', fontSize: 12, color: C.sub, marginBottom: 16 },

    /* Redeem FAB */
    redeemFab: {
        position: 'absolute', bottom: 20, right: 20,
    },
    redeemFabBtn: {
        backgroundColor: C.primary, width: 80, height: 80, borderRadius: 40,
        justifyContent: 'center', alignItems: 'center', elevation: 8,
        shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 8,
    },
    redeemFabText: { color: '#FFF', fontSize: 11, fontWeight: '800', textAlign: 'center' },

    /* Detail */
    detailCard: {
        backgroundColor: C.card, borderRadius: 20,
        borderWidth: 1, borderColor: C.border, marginBottom: 20,
        overflow: 'hidden',
    },
    detailField: { padding: 18 },
    detailFieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { fontSize: 15, fontWeight: '700', color: C.primary, marginBottom: 6 },
    detailValue: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: 1 },
    copyIcon: { fontSize: 20 },
    detailDivider: { height: 1, backgroundColor: C.border },
    qrSection: { padding: 18, alignItems: 'center' },
    qrBox: {
        marginTop: 16, padding: 20, backgroundColor: C.bg,
        borderRadius: 16, borderWidth: 1, borderColor: C.border,
    },

    shareBtn: {
        backgroundColor: C.primary, borderRadius: 50, padding: 16,
        alignItems: 'center', marginBottom: 16,
    },
    shareBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

    /* Scanner */
    scannerBox: {
        backgroundColor: '#1A1A1A', borderRadius: 16, height: SW * 0.65,
        marginBottom: 20, justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden', position: 'relative',
    },
    scannerCornerTL: {
        position: 'absolute', top: 20, left: 20, width: 36, height: 36,
        borderTopWidth: 3, borderLeftWidth: 3, borderColor: C.primary, borderRadius: 4,
    },
    scannerCornerTR: {
        position: 'absolute', top: 20, right: 20, width: 36, height: 36,
        borderTopWidth: 3, borderRightWidth: 3, borderColor: C.primary, borderRadius: 4,
    },
    scannerCornerBL: {
        position: 'absolute', bottom: 40, left: 20, width: 36, height: 36,
        borderBottomWidth: 3, borderLeftWidth: 3, borderColor: C.primary, borderRadius: 4,
    },
    scannerCornerBR: {
        position: 'absolute', bottom: 40, right: 20, width: 36, height: 36,
        borderBottomWidth: 3, borderRightWidth: 3, borderColor: C.primary, borderRadius: 4,
    },
    scanLine: {
        position: 'absolute', width: '72%', height: 2,
        backgroundColor: C.primary, opacity: 0.8,
    },
    scannerText: { color: '#AAA', fontSize: 13, marginTop: 160 },

    /* Redeem */
    redeemCard: {
        backgroundColor: C.card, borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: C.border,
    },
    redeemSectionLabel: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 16 },
    fieldLabel: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 8 },
    redeemInputRow: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
        paddingHorizontal: 12,
    },
    redeemInput: { flex: 1, fontSize: 15, color: C.text, paddingVertical: 12 },
    inputIcon: { fontSize: 20, marginLeft: 8 },
    validateBtn: {
        backgroundColor: C.primary, borderRadius: 12, padding: 16,
        alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
        marginTop: 20,
    },
    validateBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },

    /* History */
    histCard: {
        backgroundColor: C.card, borderRadius: 16, padding: 16,
        marginBottom: 12, borderWidth: 1, borderColor: C.border,
        elevation: 2, position: 'relative', overflow: 'hidden',
    },
    statusBadge: {
        position: 'absolute', top: 12, right: 12,
        borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
    },
    statusUsed: { backgroundColor: '#FFE5E5' },
    statusActive: { backgroundColor: '#E5FFE8' },
    statusText: { fontSize: 11, fontWeight: '700', color: C.text },
    histCardRow: { flexDirection: 'row', alignItems: 'center', paddingRight: 70 },
    histVoucher: { fontSize: 15, fontWeight: '800', color: C.primary, letterSpacing: 0.5 },
    histDate: { fontSize: 12, color: C.sub, marginTop: 4 },
    histReceiver: { fontSize: 12, color: C.green, marginTop: 2 },
    histAmtBox: { alignItems: 'flex-end' },
    histAmt: { fontSize: 20, fontWeight: '900', color: C.primary },
    histViewText: { fontSize: 11, color: C.sub, marginTop: 2 },
});