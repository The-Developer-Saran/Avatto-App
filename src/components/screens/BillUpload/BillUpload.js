import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Image, ActivityIndicator, Alert, Animated,
    Dimensions, PanResponder, Modal, StatusBar, Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');


const AUTH_KEY = 'U2FsdGVkX1+GlwN//3zk31Sm9LK1WafujRfUtRVhbR/GA92/CCrS4ECcQr1kXNNY';
const BASE = 'https://avatto.info/admin_avatto';
const HEADERS = { authentication: AUTH_KEY };

const C = {
    bg: '#FAFAF7',
    card: '#FFFFFF',
    gold: '#C8860A',
    goldLight: '#F5C842',
    goldBg: '#FFF8E7',
    cream: '#F5F0E8',
    red: '#B91C1C',
    green: '#15803D',
    text: '#1A1A1A',
    sub: '#6B6B6B',
    border: '#E8E2D9',
    scratch: '#D4A017',
};

// ─── SCRATCH CARD ─────────────────────────────────────────────────
const ScratchCard = ({ coins, onScratched }) => {
    const canvasRef = useRef(null);
    const [revealed, setRevealed] = useState(false);
    const scratchAmt = useRef(0);

    // Simple overlay approach using Animated opacity
    const overlayOpacity = useRef(new Animated.Value(1)).current;
    const [scratching, setScratching] = useState(false);
    const [scratchPct, setScratchPct] = useState(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gs) => {
                if (revealed) return;
                setScratching(true);
                scratchAmt.current += Math.abs(gs.dx) + Math.abs(gs.dy);
                const pct = Math.min(100, (scratchAmt.current / 2000) * 100);
                setScratchPct(pct);
                overlayOpacity.setValue(1 - pct / 100);
                if (pct >= 70 && !revealed) {
                    setRevealed(true);
                    Animated.timing(overlayOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
                    onScratched && onScratched();
                }
            },
        })
    ).current;

    return (
        <View style={sc.wrapper}>
            {/* Revealed layer */}
            <View style={sc.revealedLayer}>
                <View style={sc.giftCircle}>
                    <Text style={sc.giftEmoji}>🎁</Text>
                </View>
                <Text style={sc.coinsText}>You earned</Text>
                <Text style={sc.coinsNum}>{coins}</Text>
                <Text style={sc.coinsLabel}>gift coins</Text>
            </View>

            {/* Scratch overlay */}
            <Animated.View
                style={[sc.overlay, { opacity: overlayOpacity }]}
                {...panResponder.panHandlers}
            >
                <Text style={sc.scratchHint}>
                    {scratchPct > 0 ? `${Math.round(scratchPct)}% scratched` : 'Scratch here!'}
                </Text>
                <View style={sc.scratchLines}>
                    {[...Array(5)].map((_, i) => (
                        <View key={i} style={[sc.scratchLine, { opacity: 0.3 + i * 0.1 }]} />
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

const sc = StyleSheet.create({
    wrapper: {
        width: SW * 0.7,
        height: SW * 0.7,
        borderRadius: 24,
        overflow: 'hidden',
        alignSelf: 'center',
        marginVertical: 24,
        elevation: 8,
        shadowColor: C.gold,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    revealedLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: C.goldBg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: C.goldLight,
        borderRadius: 24,
    },
    giftCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: C.gold,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    giftEmoji: { fontSize: 36 },
    coinsText: { fontSize: 14, color: C.sub, fontWeight: '500' },
    coinsNum: { fontSize: 52, color: C.gold, fontWeight: '800', lineHeight: 58 },
    coinsLabel: { fontSize: 16, color: C.gold, fontWeight: '600' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: C.scratch,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    scratchHint: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    scratchLines: { width: '70%', gap: 8 },
    scratchLine: { height: 3, backgroundColor: '#FFF', borderRadius: 2 },
});

// ─── BILL UPLOAD SCREEN ───────────────────────────────────────────
const BillUploadScreen = ({ onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [billNum, setBillNum] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);


    const pickImage = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8 },
            (res) => {
                if (!res.didCancel && res.assets?.[0]) {
                    setImage(res.assets[0]);
                }
            }
        );
    };

    const handleUpload = async () => {
        if (!amount || !billNum || !image) {
            Alert.alert('Missing fields', 'Please fill all fields and select an image.');
            return;
        }


        setUploading(true);
        setProgress(0);

        // Fake progress
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 90) { clearInterval(interval); return 90; }
                return p + 10;
            });
        }, 200);

        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            console.log(value)
            if (value !== null) {
                try {
                    const fd = new FormData();
                    fd.append('user_id', value);
                    fd.append('bill_amount', amount);
                    fd.append('bill_number', billNum);
                    fd.append('req_type', '1');
                    fd.append('res_type', '1');
                    fd.append('bill_image', {
                        uri: image.uri,
                        type: image.type || 'image/jpeg',
                        name: image.fileName || 'bill.jpg',
                    });

                    const res = await fetch(`${BASE}/billUpload`, {
                        method: 'POST',
                        headers: HEADERS,
                        body: fd,
                    });
                    const json = await res.json();
                    clearInterval(interval);
                    setProgress(100);


                    if (json?.Response?.Success === '1') {
                        setTimeout(() => {
                            onSuccess({
                                amount,
                                billNum,
                                pin: json.Response.pin,
                            });
                        }, 400);
                    } else {
                        Alert.alert('Error', json?.Response?.Message || 'Upload failed');
                        setUploading(false);
                        setProgress(0);
                    }
                } catch (e) {
                    clearInterval(interval);
                    Alert.alert('Error', 'Network error. Please try again.');
                    setUploading(false);
                    setProgress(0);
                }

            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }


    };



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={s.screen}
                contentContainerStyle={s.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={s.pageHeader}>
                    <Text style={s.pageTitle}>Upload Bill</Text>
                    <Text style={s.pageSub}>Earn gift coins for every bill</Text>
                </View>

                {/* Form Card */}
                <View style={s.formCard}>

                    {/* Amount */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Bill Amount</Text>
                        <View style={s.inputRow}>
                            <Text style={s.rupee}>₹</Text>
                            <TextInput
                                style={s.input}
                                placeholder="0.00"
                                placeholderTextColor={C.border}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </View>

                    {/* Bill Number */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Bill Number</Text>
                        <TextInput
                            style={[s.input, s.inputFull]}
                            placeholder="Enter bill number"
                            placeholderTextColor={C.border}
                            value={billNum}
                            onChangeText={setBillNum}
                        />
                    </View>

                    {/* Image Picker */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Bill Image</Text>
                        <TouchableOpacity style={s.imagePicker} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image.uri }} style={s.previewImage} resizeMode="cover" />
                            ) : (
                                <View style={s.imagePickerInner}>
                                    <Text style={s.imagePickerIcon}>📷</Text>
                                    <Text style={s.imagePickerText}>Tap to choose image</Text>
                                    <Text style={s.imagePickerSub}>JPG, PNG — Max 20MB</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Progress bar */}
                        {uploading && (
                            <View style={s.progressWrap}>
                                <View style={s.progressBg}>
                                    <Animated.View style={[s.progressFill, { width: `${progress}%` }]} />
                                </View>
                                <Text style={s.progressText}>{progress}%  Uploading...</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Upload Button */}
                <TouchableOpacity
                    style={[s.uploadBtn, uploading && { opacity: 0.7 }]}
                    onPress={handleUpload}
                    disabled={uploading}
                    activeOpacity={0.85}
                >
                    {uploading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={s.uploadBtnText}>Upload Bill</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};







// ─── SUCCESS SCREEN ───────────────────────────────────────────────
const SuccessScreen = ({ data, onBack }) => {
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }).start();
    }, []);

    return (
        <ScrollView style={s.screen} contentContainerStyle={[s.scrollContent, { alignItems: 'center' }]}>
            {/* Check animation */}
            <Animated.View style={[s.checkCircle, { transform: [{ scale }] }]}>
                <Text style={{ fontSize: 40 }}>✓</Text>
            </Animated.View>

            <Text style={s.successTitle}>Success!</Text>
            <Text style={s.successSub}>Your bill has been successfully uploaded</Text>

            {/* Receipt card */}
            <View style={s.receiptCard}>
                <View style={s.receiptHeader}>
                    <Text style={s.receiptHeaderText}>Bill Details</Text>
                </View>
                <View style={s.receiptCutTop} />

                <View style={s.receiptBody}>
                    <View style={s.receiptRow}>
                        <Text style={s.receiptLabel}>Bill Amount</Text>
                        <Text style={s.receiptValue}>₹ {Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={s.receiptDivider} />
                    <View style={s.receiptRow}>
                        <Text style={s.receiptLabel}>Bill Number</Text>
                        <Text style={s.receiptValue}>{data.billNum}</Text>
                    </View>
                    {/* <View style={s.receiptDivider} /> */}
                    {/* <View style={s.receiptRow}>
                        <Text style={s.receiptLabel}>Reference PIN</Text>
                        <Text style={[s.receiptValue, { color: C.gold }]}>{data.pin}</Text>
                    </View> */}
                </View>
                <View style={s.receiptCutBottom} />
            </View>

            <TouchableOpacity style={s.backBtn} onPress={onBack}>
                <Text style={s.backBtnText}>Back to Rewards Page</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// ─── REWARDS LIST SCREEN ──────────────────────────────────────────
const RewardsScreen = ({ onScratch }) => {


    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {

        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            console.log(value)
            if (value !== null) {

                try {
                    const res = await fetch(`${BASE}/billHistory?res_type=1&id=${value}`, {
                        headers: HEADERS,
                    });
                    const json = await res.json();
                    console.log('Rewards', json);
                    if (json?.Response?.Success === '1') {
                        const list = json.Response.Result || [];
                        setBills(list);
                        setTotal(list.reduce((sum, b) => sum + (b.open === 1 ? b.reward_coins : 0), 0));
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color={C.gold} />
            </View>
        );
    }

    return (
        <ScrollView style={s.screen} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={s.pageHeader}>
                <Text style={s.pageTitle}>Rewards</Text>
                <View style={s.totalBadge}>
                    <Text style={s.totalBadgeText}>Total: {total} coins</Text>
                </View>
            </View>

            {/* Grid */}
            <View style={s.rewardsGrid}>
                {bills.map((bill, i) => (
                    <RewardCard key={bill.id} bill={bill} index={i} onScratch={onScratch} />
                ))}
            </View>
        </ScrollView>
    );
};

// ─── REWARD CARD ──────────────────────────────────────────────────
const RewardCard = ({ bill, index, onScratch }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const isOpen = bill.open === 1;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '48%' }}>
            <TouchableOpacity
                style={[s.rewardCard, isOpen && s.rewardCardOpen]}
                onPress={() => !isOpen && onScratch(bill)}
                activeOpacity={isOpen ? 1 : 0.85}
            >
                {/* Ticket notches */}
                <View style={s.notchLeft} />
                <View style={s.notchRight} />

                {/* Gift icon */}
                <View style={[s.rewardIconCircle, isOpen && s.rewardIconCircleOpen]}>
                    <Text style={s.rewardIcon}>🎁</Text>
                </View>

                {isOpen ? (
                    <>
                        <Text style={s.rewardCoins}>{bill.reward_coins}</Text>
                        <Text style={s.rewardCoinsLabel}>gift coins</Text>
                    </>
                ) : (
                    <>
                        <Text style={s.rewardClosedText}>Scratch to</Text>
                        <Text style={s.rewardClosedText}>reveal!</Text>
                    </>
                )}

                {/* Date */}
                <Text style={s.rewardDate}>{bill.created_at}</Text>

                {/* Closed badge */}
                {!isOpen && (
                    <View style={s.closedBadge}>
                        <Text style={s.closedBadgeText}>NEW</Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const ScratchModal = ({ visible, bill, onClose, onDone }) => {
    const [loading, setLoading] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const slideAnim = useRef(new Animated.Value(400)).current;

    useEffect(() => {
        if (visible) {
            setLoading(false);
            setRevealed(false);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 60
            }).start();
        } else {
            slideAnim.setValue(400);
        }
    }, [visible]);

    const handleOpen = async () => {
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
            console.log(value)
            if (value !== null) {
                try {
                    const fd = new FormData();
                    fd.append('user_id', value);
                    fd.append('bill_id', bill.id);
                    fd.append('pin', bill.pin); // ✅ DIRECT PIN USE
                    fd.append('req_type', '1');
                    fd.append('res_type', '1');
                    fd.append('open', '1');

                    const res = await fetch(`${BASE}/billPinOpen`, {
                        method: 'POST',
                        headers: HEADERS,
                        body: fd
                    });

                    const json = await res.json();
                    console.log('claim reward', json);

                    if (json?.Response?.Success === '1') {
                        setRevealed(true);
                    } else {
                        Alert.alert('Error', json?.Response?.Message || 'Failed to open');
                    }
                } catch (e) {
                    Alert.alert('Error', 'Network error');
                }
            }
        }
        catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }

        setLoading(false);
    };

    if (!bill) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={m.backdrop}>
                <Animated.View style={[m.sheet, { transform: [{ translateY: slideAnim }] }]}>

                    {/* Close */}
                    <TouchableOpacity style={m.closeBtn} onPress={onClose}>
                        <Text style={m.closeBtnText}>✕</Text>
                    </TouchableOpacity>

                    {!revealed ? (
                        <>
                            <Text style={m.title}>Congrats! 🎉</Text>
                            <Text style={m.sub}>You earned a surprise gift coin</Text>

                            {/* Scratch card */}
                            <ScratchCard coins={bill.reward_coins} onScratched={() => { }} />

                            <Text style={m.scratchHintText}>
                                Scratch the card to reveal your reward
                            </Text>

                            {/* CLAIM BUTTON ONLY */}
                            <TouchableOpacity
                                style={[m.claimBtn, loading && { opacity: 0.7 }]}
                                onPress={handleOpen}
                                disabled={loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="#FFF" />
                                    : <Text style={m.claimBtnText}>Claim Reward</Text>
                                }
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={m.title}>🎊 Claimed!</Text>
                            <Text style={m.sub}>Your gift coin added in wallet</Text>

                            <View style={m.claimedCoinsBox}>
                                <Text style={m.claimedCoinsNum}>{bill.reward_coins}</Text>
                                <Text style={m.claimedCoinsLabel}>gift coins added</Text>
                            </View>

                            <TouchableOpacity
                                style={m.claimBtn}
                                onPress={() => { onDone(); onClose(); }}
                            >
                                <Text style={m.claimBtnText}>Back to Homepage</Text>
                            </TouchableOpacity>
                        </>
                    )}

                </Animated.View>
            </View>
        </Modal>
    );
};

const m = StyleSheet.create({
    backdrop: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 28, paddingBottom: 48, alignItems: 'center',
    },
    closeBtn: {
        alignSelf: 'flex-end', width: 36, height: 36, borderRadius: 18,
        backgroundColor: C.cream, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    },
    closeBtnText: { fontSize: 16, color: C.sub },
    title: { fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 4 },
    sub: { fontSize: 14, color: C.sub, marginBottom: 8, textAlign: 'center' },
    scratchHintText: { fontSize: 15, color: C.gold, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
    pinSection: { width: '100%', gap: 12 },
    pinLabel: { fontSize: 13, color: C.sub, textAlign: 'center' },
    pinInput: {
        borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14,
        fontSize: 16, color: C.text, textAlign: 'center', letterSpacing: 4,
    },
    claimBtn: {
        backgroundColor: C.red, borderRadius: 50, padding: 16,
        alignItems: 'center', width: '100%',
    },
    claimBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    claimedCoinsBox: {
        alignItems: 'center', marginVertical: 32,
        backgroundColor: C.goldBg, borderRadius: 20, padding: 32, width: '80%',
    },
    claimedCoinsNum: { fontSize: 64, fontWeight: '900', color: C.gold },
    claimedCoinsLabel: { fontSize: 16, color: C.sub, marginTop: 4 },
});

// ─── MAIN APP ──────────────────────────────────────────────────────
const SCREENS = { UPLOAD: 'upload', SUCCESS: 'success', REWARDS: 'rewards' };

export default function App() {
    const [screen, setScreen] = useState(SCREENS.UPLOAD);
    const [successData, setSuccessData] = useState(null);
    const [scratchBill, setScratchBill] = useState(null);
    const [scratchModal, setScratchModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = (data) => {
        setSuccessData(data);
        setScreen(SCREENS.SUCCESS);
    };

    const handleScratch = (bill) => {
        setScratchBill(bill);
        setScratchModal(true);
    };

    const handleScratchDone = () => {
        setRefreshKey(k => k + 1);
        setScreen(SCREENS.REWARDS);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={s.root}>
                <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

                {/* Tab Bar */}
                <View style={s.tabs}>
                    <TouchableOpacity
                        style={[s.tab, screen === SCREENS.UPLOAD && s.tabActive]}
                        onPress={() => setScreen(SCREENS.UPLOAD)}
                    >
                        <Text style={[s.tabText, screen === SCREENS.UPLOAD && s.tabTextActive]}>Upload Bill</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[s.tab, screen === SCREENS.REWARDS && s.tabActive]}
                        onPress={() => setScreen(SCREENS.REWARDS)}
                    >
                        <Text style={[s.tabText, screen === SCREENS.REWARDS && s.tabTextActive]}>My Rewards</Text>
                    </TouchableOpacity>
                </View>

                {/* Screens */}
                {screen === SCREENS.UPLOAD && <BillUploadScreen onSuccess={handleUploadSuccess} />}
                {screen === SCREENS.SUCCESS && <SuccessScreen data={successData} onBack={() => setScreen(SCREENS.REWARDS)} />}
                {screen === SCREENS.REWARDS && <RewardsScreen key={refreshKey} onScratch={handleScratch} />}

                {/* Scratch Modal */}
                <ScratchModal
                    visible={scratchModal}
                    bill={scratchBill}
                    onClose={() => setScratchModal(false)}
                    onDone={handleScratchDone}
                />
            </View>
        </SafeAreaView>
    );
}

// ─── STYLES ────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    screen: { flex: 1, backgroundColor: C.bg, },
    scrollContent: { padding: 20, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Tabs
    tabs: {
        flexDirection: 'row', backgroundColor: C.card,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    tab: {
        flex: 1, paddingVertical: 14, alignItems: 'center',
        borderBottomWidth: 3, borderBottomColor: 'transparent',
    },
    tabActive: { borderBottomColor: C.red },
    tabText: { fontSize: 14, fontWeight: '600', color: C.sub },
    tabTextActive: { color: C.red },

    // Page header
    pageHeader: { marginBottom: 20 },
    pageTitle: { fontSize: 26, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
    pageSub: { fontSize: 14, color: C.sub, marginTop: 4 },

    // Form
    formCard: {
        backgroundColor: C.card, borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: C.border, gap: 20, marginBottom: 24,
    },
    fieldGroup: { gap: 8 },
    fieldLabel: { fontSize: 14, fontWeight: '700', color: C.text },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: C.border, borderRadius: 14,
        paddingHorizontal: 14, gap: 8,
    },
    rupee: { fontSize: 18, color: C.sub, fontWeight: '600' },
    input: { flex: 1, fontSize: 16, color: C.text, paddingVertical: 14 },
    inputFull: {
        borderWidth: 1.5, borderColor: C.border, borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 14, fontSize: 16, color: C.text,
    },
    imagePicker: {
        borderWidth: 1.5, borderColor: C.border, borderRadius: 14,
        borderStyle: 'dashed', overflow: 'hidden', minHeight: 120,
        justifyContent: 'center', alignItems: 'center',
    },
    imagePickerInner: { alignItems: 'center', padding: 24, gap: 8 },
    imagePickerIcon: { fontSize: 32 },
    imagePickerText: { fontSize: 15, fontWeight: '600', color: C.gold },
    imagePickerSub: { fontSize: 12, color: C.sub },
    previewImage: { width: '100%', height: 180 },

    progressWrap: { gap: 6, marginTop: 8 },
    progressBg: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: C.gold, borderRadius: 3 },
    progressText: { fontSize: 12, color: C.sub },

    uploadBtn: {
        backgroundColor: C.red, borderRadius: 50, padding: 18,
        alignItems: 'center', elevation: 4,
        shadowColor: C.red, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8,
    },
    uploadBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },

    // Success
    checkCircle: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: C.green, justifyContent: 'center', alignItems: 'center',
        marginTop: 20, marginBottom: 16, elevation: 8,
        shadowColor: C.green, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 12,
    },
    successTitle: { fontSize: 28, fontWeight: '800', color: C.text },
    successSub: { fontSize: 14, color: C.sub, marginTop: 4, marginBottom: 24, textAlign: 'center' },

    receiptCard: {
        width: '100%', backgroundColor: C.card,
        borderRadius: 20, overflow: 'hidden',
        borderWidth: 1, borderColor: C.border, marginBottom: 32,
    },
    receiptHeader: {
        backgroundColor: C.goldBg, padding: 16, alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    receiptHeaderText: { fontSize: 15, fontWeight: '700', color: C.gold },
    receiptCutTop: {
        height: 20, backgroundColor: C.bg,
        borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
        marginHorizontal: -1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1,
        borderColor: C.border,
    },
    receiptBody: { padding: 20, gap: 4 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    receiptLabel: { fontSize: 14, color: C.sub },
    receiptValue: { fontSize: 14, fontWeight: '700', color: C.text },
    receiptDivider: { height: 1, backgroundColor: C.border },
    receiptCutBottom: {
        height: 20, backgroundColor: C.bg,
        borderTopLeftRadius: 10, borderTopRightRadius: 10,
        marginHorizontal: -1, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1,
        borderColor: C.border,
    },
    backBtn: {
        backgroundColor: C.red, borderRadius: 50, padding: 18,
        alignItems: 'center', width: '100%',
    },
    backBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

    // Rewards
    totalBadge: {
        backgroundColor: C.goldBg, borderRadius: 20, paddingHorizontal: 14,
        paddingVertical: 6, alignSelf: 'flex-start', marginTop: 8,
        borderWidth: 1, borderColor: C.goldLight,
    },
    totalBadgeText: { color: C.gold, fontWeight: '700', fontSize: 13 },
    rewardsGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between', gap: 12,
    },
    rewardCard: {
        backgroundColor: C.cream, borderRadius: 16, padding: 16,
        alignItems: 'center', gap: 6, overflow: 'visible',
        borderWidth: 1, borderColor: C.border, position: 'relative',
    },
    rewardCardOpen: { backgroundColor: C.goldBg, borderColor: C.goldLight },
    notchLeft: {
        position: 'absolute', left: -8, top: '45%',
        width: 16, height: 16, borderRadius: 8, backgroundColor: C.bg,
        borderWidth: 1, borderColor: C.border,
    },
    notchRight: {
        position: 'absolute', right: -8, top: '45%',
        width: 16, height: 16, borderRadius: 8, backgroundColor: C.bg,
        borderWidth: 1, borderColor: C.border,
    },
    rewardIconCircle: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: C.gold, justifyContent: 'center', alignItems: 'center',
        marginBottom: 4,
    },
    rewardIconCircleOpen: { backgroundColor: C.goldLight },
    rewardIcon: { fontSize: 28 },
    rewardCoins: { fontSize: 28, fontWeight: '900', color: C.gold },
    rewardCoinsLabel: { fontSize: 12, color: C.sub, fontWeight: '600' },
    rewardClosedText: { fontSize: 13, color: C.sub, fontWeight: '600', textAlign: 'center' },
    rewardDate: { fontSize: 10, color: C.sub, marginTop: 4 },
    closedBadge: {
        position: 'absolute', top: 8, right: 8,
        backgroundColor: C.red, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
    },
    closedBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
});