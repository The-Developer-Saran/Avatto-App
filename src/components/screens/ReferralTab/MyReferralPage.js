import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ToastAndroid,
    Modal,
    Alert,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "@react-native-vector-icons/ionicons";
import { Authentication_Key } from "../../key/Key";
import { encryptPiDataNew } from "../Encryption/encryption";
import { BaseUr2, BaseUrl } from "../BaseUrl/BaseUrl";

const PRIMARY_COLOR = "#B3242E";
const MIN_PURCHASE_WALLET = 3000;
const FILTERS = [
    "All",
    "Premium Dealer",
    "Executive",
    "Regional",
    "Zonal",
    "Vice President",
    "CHANNEL PARTNER",
];

// UI label -> API filter query value. "All" intentionally absent (no filter param).
const FILTER_QUERY_MAP = {
    "Premium Dealer": "pd",
    "Executive": "ed",
    "Regional": "rd",
    "Zonal": "zd",
    "Vice President": "vp",
    "CHANNEL PARTNER": "cd",
};

const normalizeMembership = (membershipName) => {
    if (!membershipName) return "Free User";
    return membershipName.replace(" COMMISSION", "");
};

const getRelativeTime = (value) => {
    if (!value) return "Recently";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";

    const diffMs = Date.now() - date.getTime();
    if (diffMs < 0) return "Recently";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 month ago";
    if (diffMonths < 12) return `${diffMonths} months ago`;

    const diffYears = Math.floor(diffMonths / 12);
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
};

const MyReferralPage = () => {
    const EncKey = encryptPiDataNew(Authentication_Key);
    const navigation = useNavigation();
    const [referralData, setReferralData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [totalReferral, setTotalReferral] = useState("0");
    const [premiumCount, setPremiumCount] = useState("0");
    const [executiveCount, setExecutiveCount] = useState("0");
    const [regionalCount, setRegionalCount] = useState("0");
    const [purchaseWallet, setPurchaseWallet] = useState("0");
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingTree, setPendingTree] = useState(null); // { id, sponserid, leg }
    const [submitting, setSubmitting] = useState(false);
    console.log('filterType--->', filterType)

    useEffect(() => {
        const User_Wallet_Get = async () => {
            try {
                const value = await AsyncStorage.getItem("user");
                if (!value) return;

                const response = await fetch(
                    `${BaseUrl}userWallet/get?req_type=1&res_type=1&uId=${value}&type=M`,
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
                    setPurchaseWallet(String(data?.Response?.Result?.[0]?.purchase_wallet_available || "0"));
                }
            } catch (error) {
                console.error("Wallet fetch error:", error.message);
            }
        };

        User_Wallet_Get();
    }, []);
    useEffect(() => {
        const getReferrals = async (activeFilter) => {
            try {
                const value = await AsyncStorage.getItem("user");
                if (!value) {
                    setReferralData([]);
                    return;
                }

                let url = `${BaseUrl}getReferralByMobile?user_id=${value}`;
                const mappedFilter = FILTER_QUERY_MAP[activeFilter]; // undefined for "All"
                if (mappedFilter) {
                    url += `&filter=${mappedFilter}`;
                }
                console.log(EncKey)
                console.log(value)
                console.log('url--->', url)
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authentication: EncKey,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();
                console.log('data--->', data);
                if (data?.Response?.Success === "1") {
                    setReferralData(data?.Response?.Data || []);
                    setTotalReferral(String(data?.Response?.TotalReferrals || "0"));
                    setPremiumCount(String(data?.Response?.PremiumDealerCount || "0"));
                    setExecutiveCount(String(data?.Response?.ExecutiveCount || "0"));
                    setRegionalCount(String(data?.Response?.RegionalCount || "0"));
                } else {
                    setReferralData([]);
                }
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        };

        getReferrals(filterType);
    }, [filterType]);

    const handleTotalReferralsPress = () => {
        setFilterType("All");
        setSearchText("");
    };

    const filteredData = referralData.filter((item) =>
        String(item?.mobile || "").includes(searchText)
    );

    const renderFilterButton = (label) => {
        const isActive = filterType === label;

        return (
            <TouchableOpacity
                key={label}
                activeOpacity={0.9}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilterType(label)}
            >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    const setTreeApi = async (id, sponserid, leg) => {
        if (submitting) return;
        setSubmitting(true);

        const inputData = new FormData();
        inputData.append('apiType', 'Tree');
        inputData.append('avattoId', id);
        inputData.append('sponsorId', sponserid);
        inputData.append('newLeg', leg);

        console.log(inputData)

        try {
            const response = await fetch(`${BaseUr2}binary/settree.php`, {
                method: 'POST',
                body: inputData,
            });

            const text = await response.text();
            console.log("RAW RESPONSE:", text);

            if (!text) {
                throw new Error("Empty response from server");
            }

            const responseData = JSON.parse(text);

            ToastAndroid.showWithGravityAndOffset(
                `${responseData.msg}`,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );

        } catch (err) {
            console.log('Error while setting tree', err);
        } finally {
            setSubmitting(false);
            setPendingTree(null);
        }
    };

    // Validate Purchase Wallet balance, then open the MCL/MCR confirmation popup.
    const handleMcPress = (id, sponserid, leg) => {
        const balance = parseFloat(purchaseWallet) || 0;
        if (balance < MIN_PURCHASE_WALLET) {
            Alert.alert(
                "Insufficient Balance",
                "Insufficient amount in Purchase Wallet. Minimum ₹3,000 is required.",
                [{ text: "OK", onPress: () => navigation.navigate('Footer', { screen: 'Topup' }) }]
            );
            return;
        }
        setPendingTree({ id, sponserid, leg });
        setConfirmVisible(true);
    };

    const confirmSetTree = () => {
        if (!pendingTree || submitting) return;
        const { id, sponserid, leg } = pendingTree;
        setConfirmVisible(false);
        setTreeApi(id, sponserid, leg);
    };

    const renderItem = ({ item, index }) => {
        const membershipName = normalizeMembership(item?.memberships?.[0]?.membership_name);
        const hasMembership = !!item?.memberships?.length;
        const initial = (item?.name || "U").charAt(0).toUpperCase();
        const timeLabel = getRelativeTime(
            item?.created_at || item?.createdAt || item?.date || item?.updated_at
        );

        return (
            <Animatable.View
                animation="fadeInUp"
                duration={500}
                delay={index * 50}
                useNativeDriver
            >
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor:
                                item.diamond_status == 1
                                    ? 'rgb(253, 251, 228)' // Mild Yellow
                                    : item.millenium_status == 1
                                        ? 'rgb(237, 253, 228)' // Mild Green
                                        : '#fff',
                        },
                    ]}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            borderTopRightRadius: 10,
                            borderBottomLeftRadius: 10,
                            padding: 4,
                            backgroundColor:
                                item.diamond_status == 1
                                    ? '#E6B800' // Yellow
                                    : item.millenium_status == 1
                                        ? 'green'
                                        : '#fff',
                        }}>
                        <Text
                            style={{
                                fontSize: 10,
                                color: item.diamond_status == 1 ? '#fff' : '#fff',
                            }}>
                            {item.diamond_status == 1
                                ? 'Diamond'
                                : item.millenium_status == 1
                                    ? 'Millenium'
                                    : ''}
                        </Text>
                    </View>

                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initial}</Text>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.cardTopRow}>
                            <Text numberOfLines={1} style={styles.name}>
                                {item?.name || "Unknown User"}
                            </Text>
                            {/* <Text style={styles.timeText}>{timeLabel}</Text> */}
                        </View>

                        <Text style={styles.mobileText}>{item?.mobile || "-"}</Text>

                        <View style={styles.metaRow}>
                            {hasMembership ? (
                                <Image
                                    source={require("../../assets/images/Profile/crown.png")}
                                    style={styles.crownimg}
                                    resizeMode="contain"
                                />
                            ) : null}
                            <Text numberOfLines={1} style={styles.membershipText}>
                                {membershipName}
                            </Text>
                        </View>
                        {
                            item.binary_placed == 0 && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                    <TouchableOpacity disabled={submitting} onPress={() => handleMcPress(item.id, item.referred_by, 'L')} style={{ padding: 6, width: wp(33), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1) }}>
                                        <Text style={{ color: '#fff', fontSize: 12 }}>MCL</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={submitting} onPress={() => handleMcPress(item.id, item.referred_by, 'R')} style={{ padding: 6, width: wp(33), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: hp(1) }}>
                                        <Text style={{ color: '#fff', fontSize: 12 }}>MCR</Text>
                                    </TouchableOpacity>
                                </View>
                            )

                        }

                    </View>
                </View>
            </Animatable.View>
        );
    };

    const showEmptyState = filteredData.length === 0;

    return (
        <View style={styles.container}>
            <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                    <Image
                        source={require("../../assets/images/Referral/team.png")}
                        style={styles.summaryImage}
                        resizeMode="contain"
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.summaryRight}
                    onPress={handleTotalReferralsPress}
                >
                    <Text style={styles.summaryLabel}>Total Referrals</Text>
                    <Text style={styles.summaryCount}>{totalReferral}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
                {FILTERS.map((label) => renderFilterButton(label))}
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={19} color="#9C9C9C" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search by Mobile Number"
                    placeholderTextColor="#A5A5A5"
                    keyboardType="numeric"
                    value={searchText}
                    maxLength={10}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        setSearchText(numericText);
                    }}
                />
            </View>

            {showEmptyState ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No Record found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => `${item?.id || item?.mobile || "ref"}-${index}`}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <Modal
                transparent
                visible={confirmVisible}
                animationType="fade"
                onRequestClose={() => setConfirmVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            {`Confirm ${pendingTree?.leg === 'L' ? 'MCL' : 'MCR'}`}
                        </Text>

                        <Text style={styles.modalMessage}>
                            {`Do you want to place this member in ${pendingTree?.leg === 'L' ? 'MCL (Left)' : 'MCR (Right)'}?`}
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                onPress={() => {
                                    setConfirmVisible(false);
                                    setPendingTree(null);
                                }}
                                style={styles.modalCancelButton}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={submitting}
                                onPress={confirmSetTree}
                                style={styles.modalConfirmButton}
                            >
                                <Text style={styles.modalConfirmText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        backgroundColor: "#F8F5F1",
    },
    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: hp(1.8),
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.6),
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: hp(1.4),
    },
    summaryLeft: {
        width: wp(24),
        alignItems: "center",
        justifyContent: "center",
    },
    summaryImage: {
        width: wp(16),
        height: hp(6),
    },
    summaryRight: {
        flex: 1,
        alignItems: "flex-end",
    },
    summaryLabel: {
        color: "#252525",
        fontSize: hp(1.7),
        fontWeight: "600",
        fontFamily: "DMSans-Medium",
    },
    summaryCount: {
        color: PRIMARY_COLOR,
        fontSize: hp(3.6),
        fontWeight: "700",
        fontFamily: "DMSans-Medium",
        marginTop: hp(0.2),
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        backgroundColor: "#FFFFFF",
        borderRadius: hp(1.8),
        padding: hp(0.7),
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: hp(1.2),
    },
    filterChip: {
        minHeight: hp(4.1),
        borderRadius: hp(1.3),
        backgroundColor: "#FFF1F2",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: wp(3),
        marginHorizontal: wp(0.5),
        marginBottom: hp(0.7),
    },
    filterChipActive: {
        backgroundColor: PRIMARY_COLOR,
    },
    filterChipText: {
        color: PRIMARY_COLOR,
        fontSize: hp(1.33),
        fontWeight: "600",
        textAlign: "center",
        fontFamily: "DMSans-Medium",
        paddingHorizontal: wp(1),
    },
    filterChipTextActive: {
        color: "#FFFFFF",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E3DDD8",
        borderRadius: hp(2),
        paddingHorizontal: wp(3),
        height: hp(6),
        backgroundColor: "#FFFFFF",
        marginBottom: hp(1.2),
    },
    searchIcon: {
        marginRight: wp(2),
    },
    input: {
        flex: 1,
        color: "#202020",
        fontSize: hp(1.8),
        paddingVertical: 0,
    },
    listContent: {
        paddingBottom: hp(10),
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: hp(2),
        paddingHorizontal: wp(3.2),
        paddingVertical: hp(1.2),
        marginBottom: hp(1.1),
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    avatarCircle: {
        width: hp(5.6),
        height: hp(5.6),
        borderRadius: hp(2.8),
        backgroundColor: "#E8CDD0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp(3),
    },
    avatarText: {
        color: PRIMARY_COLOR,
        fontSize: hp(2.1),
        fontWeight: "700",
    },
    cardBody: {
        flex: 1,
    },
    cardTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        flex: 1,
        color: PRIMARY_COLOR,
        fontSize: hp(1.8),
        fontWeight: "700",
        fontFamily: "DMSans-Medium",
        marginRight: wp(2),
    },
    timeText: {
        color: "#B2B2B2",
        fontSize: hp(1.2),
        fontFamily: "DMSans-Medium",
    },
    mobileText: {
        color: "#CC6670",
        fontSize: hp(1.7),
        marginTop: hp(0.35),
        fontFamily: "DMSans-Medium",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(0.45),
    },
    crownimg: {
        width: hp(1.7),
        height: hp(1.7),
        marginRight: wp(1.2),
    },
    membershipText: {
        color: "#6E6E6E",
        fontSize: hp(1.35),
        fontFamily: "DMSans-Medium",
        flex: 1,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyStateText: {
        color: PRIMARY_COLOR,
        fontSize: hp(2),
        fontWeight: "600",
        fontFamily: "DMSans-Medium",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalCard: {
        width: wp(80),
        backgroundColor: "#f3abb1",
        borderRadius: hp(2),
        padding: hp(3),
        alignItems: "center",
    },
    modalTitle: {
        fontSize: hp(2.5),
        fontWeight: "700",
        color: "#A6222C",
        marginBottom: hp(2),
    },
    modalMessage: {
        fontSize: hp(2),
        color: "#000",
        textAlign: "center",
        marginBottom: hp(3),
    },
    modalButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalCancelButton: {
        width: "45%",
        backgroundColor: "#f3abb1",
        paddingVertical: hp(1.5),
        borderRadius: hp(1),
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#A6222C",
    },
    modalCancelText: {
        color: "#000",
        fontSize: hp(2),
        fontWeight: "600",
    },
    modalConfirmButton: {
        width: "45%",
        backgroundColor: "#A6222C",
        paddingVertical: hp(1.5),
        borderRadius: hp(1),
        alignItems: "center",
    },
    modalConfirmText: {
        color: "#FFF",
        fontSize: hp(2),
        fontWeight: "600",
    },
});

export default MyReferralPage;
