import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import AntDesign from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';

const PRIMARY = '#B2232D';
const BACKGROUND = '#F8F5F1';
const CARD = '#FFFFFF';
const PILL = '#F0A33A';
const BORDER = '#EFE7E0';
const MUTED = '#8B817B';

const CLUBS = ['Millionaire Club', 'Diamond Club'];

const GROUPS = [
  {
    title: ' M L P',
    stats: [
      { label: 'Total Sales', value: '10' },
      { label: 'Current Sales', value: '0' },
      //   { label: 'Close Sales Points', value: '0' },
    ],
  },
  {
    title: ' M R P',
    stats: [
      { label: 'Total Sales', value: '10' },
      { label: 'Current Sales', value: '0' },
      //   { label: 'Close Sales Points', value: '0' },
    ],
  },
];

const GROUPS2 = [
  {
    title: ' D L P',
    stats: [
      { label: 'Total Sales', value: '0' },
      { label: 'Current Sales', value: '0' },
      //   { label: 'Close Sales Points', value: '0' },
    ],
  },
  {
    title: ' D R P',
    stats: [
      { label: 'Total Sales', value: '00' },
      { label: 'Current Sales', value: '0' },
      //   { label: 'Close Sales Points', value: '0' },
    ],
  },
];

const INITIAL_SCREEN_DATA = {
  userId: '',
  club: null,
  purchaseWalletAvailable: 0,
  binaryPlaced: 0,
};

const MillionareClub = ({ navigation }) => {
  const encKey = useMemo(() => encryptPiDataNew(Authentication_Key), []);
  const [activeClub, setActiveClub] = useState('Millionaire Club');
  const [screenData, setScreenData] = useState(INITIAL_SCREEN_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const showMessage = useCallback((message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }

    console.log(message);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadClubData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user');

        if (!isActive) {
          return;
        }

        if (!storedUserId) {
          setErrorMessage('User not found');
          setScreenData(INITIAL_SCREEN_DATA);
          setIsLoading(false);
          return;
        }

        const inputData = new FormData();
        inputData.append('apiType', 'Club');
        inputData.append('avattoId', storedUserId);

        const [clubResponse, walletResponse, profileResponse] = await Promise.all([
          fetch('https://avatto.info/binary/getClub', {
            method: 'POST',
            body: inputData,
          }),
          fetch(
            `${BaseUrl}userWallet/get?req_type=1&res_type=1&uId=${storedUserId}&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: encKey,
              },
            }
          ),
          fetch(
            `${BaseUrl}userGet?req_type=1&res_type=1&id=${storedUserId}&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: encKey,
              },
            }
          ),
        ]);

        const clubResponseData = await clubResponse.json();

       
        const walletResponseData = await walletResponse.json();
        const profileResponseData = await profileResponse.json();

        if (!clubResponse.ok || clubResponseData?.status !== 'success') {
          throw new Error(clubResponseData?.message || 'Failed to fetch club details');
        }

        if (!walletResponse.ok || walletResponseData?.Response?.Success !== '1') {
          throw new Error(walletResponseData?.Response?.Message || 'Failed to fetch wallet details');
        }

        if (!profileResponse.ok || profileResponseData?.Response?.Success !== '1') {
          throw new Error(profileResponseData?.Response?.Message || 'Failed to fetch profile details');
        }

        const walletInfo = walletResponseData?.Response?.Result?.[0];
        const profileInfo = profileResponseData?.Response?.Result?.[0];
        const parsedPurchaseWallet = Number.parseFloat(walletInfo?.purchase_wallet_available);
        const parsedBinaryPlaced = Number(profileInfo?.binary_placed);

        if (!isActive) {
          return;
        }

        setScreenData({
          userId: storedUserId,
          club: clubResponseData,
          purchaseWalletAvailable: Number.isFinite(parsedPurchaseWallet) ? parsedPurchaseWallet : 0,
          binaryPlaced: Number.isFinite(parsedBinaryPlaced) ? parsedBinaryPlaced : 0,
        });
        setErrorMessage('');
      } catch (error) {
        if (!isActive) {
          return;
        }

        setScreenData(INITIAL_SCREEN_DATA);
        setErrorMessage(error.message || 'Unable to load club details');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadClubData();

    return () => {
      isActive = false;
    };
  }, [encKey]);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.('Footer', { screen: 'Home' });
  }, [navigation]);

  const { userId, club, purchaseWalletAvailable, binaryPlaced } = screenData;
  const isDiamondClubActive = activeClub !== 'Millionaire Club' && club?.dclub !== 'Inactive' && club?.dclub !== null;

  console.log('binaryPlaced-->', binaryPlaced)
  console.log(club);
  

  const mappedGroups = useMemo(() => {
    const millionareGroups = [
      {
        ...GROUPS[0],
        stats: [
          { label: 'Total Sales', value: String(club?.mlp ?? 0) },
          { label: 'Current Redeem Points', value: String(club?.mcl ?? 0) },
        ],
      },
      {
        ...GROUPS[1],
        stats: [
          { label: 'Total Sales', value: String(club?.mrp ?? 0) },
          { label: 'Current Redeem Points', value: String(club?.mcr ?? 0) },
        ],
      },
    ];

    const diamondGroups = [
      {
        ...GROUPS2[0],
        stats: [
          { label: 'Total Sales', value: String(club?.dlp ?? 0) },
          { label: 'Carry Over Sales', value: String(club?.dcl ?? 0) },
          { label: 'Current Sales Points', value: String(club?.dnl ?? 0) },
        ],
      },
      {
        ...GROUPS2[1],
        stats: [
          { label: 'Total Sales', value: String(club?.drp ?? 0) },
          { label: 'Carry Over Sales', value: String(club?.dcr ?? 0) },
          { label: 'Current Sales Points', value: String(club?.dnr ?? 0) },
        ],
      },
    ];

    return {
      'Millionaire Club': millionareGroups,
      'Diamond Club': diamondGroups,
    };
  }, [club]);

  const totalEarnedPoints = useMemo(
    () =>
      activeClub === 'Millionaire Club'
        ? String(club?.mlnAmt ?? 0)
        : String(club?.dmnAmt ?? 0),
    [activeClub, club]
  );

  const activeGroups = useMemo(() => mappedGroups[activeClub] || GROUPS, [activeClub, mappedGroups]);

  const handlePurchase = useCallback(async () => {
    //  navigation.navigate('ProductList')
    if (!userId) {
      showMessage('User not found');
      return;
    }

    if (binaryPlaced === 0) {
      showMessage('Contact your upline for id placement');
      return;
    }

    if (parseFloat(purchaseWalletAvailable) < 3000) {
      navigation.navigate('Footer', { screen: 'Topup' });
      return;
    }

    if (isPurchasing) {
      return;
    }

    navigation.navigate('ProductList')

    // navigation.navigate('ProductList')
    // setIsPurchasing(true);

    // const membershipType =
    //   activeClub === 'Millionaire Club'
    //     ? 'millennium_membership'
    //     : 'diamond_membership';

    // try {
    //   const inputData = new FormData();
    //   inputData.append('req_type', '1');
    //   inputData.append('user_id', userId);
    //   inputData.append('membership_type', membershipType);

    //   const response = await fetch('https://avatto.info/admin_avatto/activateMembership', {
    //     method: 'POST',
    //     body: inputData,
    //     headers:{
    //         authentication:`A6iWq]M}Z3bHtnn{kyBT`,
    //     }
    //   });

    //   const responseData = await response.json();
    //   const result = responseData?.Response;

    //   if (!response.ok || result?.Success !== '1') {
    //     throw new Error(result?.Message || 'Membership activation failed');
    //   }

    //   showMessage(result?.Message || 'Membership activated successfully');
    // } catch (error) {
    //   showMessage(error.message || 'Unable to activate membership');
    // } finally {
    //   setIsPurchasing(false);
    // }
  }, [activeClub, binaryPlaced, isPurchasing, navigation, purchaseWalletAvailable, showMessage, userId]);

  const handlePlaceholderPress = useCallback((label) => {
    showMessage(`${label} coming soon`);
  }, [showMessage]);

  const purchaseButtonLabel = useMemo(
    () => (binaryPlaced === 1 ? 'Purchase Now' : 'Contact your upline for id placement'),
    [binaryPlaced]
  );

  function handleBackButtonClick() {
    navigation.navigate('Footer', { screen: 'Home' });
    return true;
  }

  useEffect(() => {
    const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
    return () => {
      backhandler.remove();
    };
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.hero}>
            <View style={styles.heroBubble} />

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.backRow}
              onPress={handleBackButtonClick}
            >
              <AntDesign name="left" size={16} color="#FFFFFF" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.heroBody}>
              <Text style={styles.heroTitle}>MILLIONAIRE CLUB</Text>

              <Image
                source={require('../../assets/images/Home/CardImages/MiClub.png')}
                resizeMode="contain"
                style={styles.heroImage}
              />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.clubSwitcher}>
              {CLUBS.map((club) => {
                const isActive = activeClub === club;

                return (
                  <TouchableOpacity
                    key={club}
                    activeOpacity={0.9}
                    style={[styles.clubButton, isActive && styles.clubButtonActive]}
                    onPress={() => setActiveClub(club)}
                  >
                    <Text style={[styles.clubButtonText, isActive && styles.clubButtonTextActive]}>
                      {club}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.teamListButton}
              // onPress={() => handlePlaceholderPress('Team List')}TeamView
              onPress={() => navigation.navigate('TeamView')}
            >
              <Text style={styles.teamListText}>Team View</Text>
              <MaterialCommunityIcons name="arrow-top-right" color="#fff" size={24} />

            </TouchableOpacity>



            <View style={styles.pointsCard}>
              <Text style={styles.pointsLabel}>Total Redeem Points</Text>
              <Text style={styles.pointsValue}>{totalEarnedPoints}</Text>
            </View>

            {
              isDiamondClubActive && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'center' }}>
                  <View style={{ height: 10, width: 10, backgroundColor: 'green', borderRadius: 100 }}></View>
                  <Text style={{ color: 'green', marginLeft: 10 }}>Active</Text>
                </View>
              )
            }



            {isLoading ? (
              <View style={styles.statusWrap}>
                <ActivityIndicator size="small" color={PRIMARY} />
                <Text style={styles.statusText}>Loading club details...</Text>
              </View>
            ) : errorMessage ? (
              <View style={styles.statusWrap}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.groupRow}>
              {activeGroups.map((group) => (
                <View key={group.title} style={styles.groupCard}>
                  <View style={styles.groupPill}>
                    <Text style={styles.groupPillText}>{group.title}</Text>
                  </View>

                  {group.stats.map((stat, index) => (
                    <View key={`${group.title}-${stat.label}`} style={styles.statBlock}>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      {index !== group.stats.length - 1 ? <View style={styles.separator} /> : null}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {activeClub === 'Millionaire Club' ? (
          <View style={styles.footerCtaWrap}>
            <TouchableOpacity
              activeOpacity={0.92}
              style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
              onPress={handlePurchase}
              // onPressOut={()=>navigation.navigate('ProductList')}
              disabled={isPurchasing}
            >
              <Text style={styles.purchaseButtonText}>
                {isPurchasing ? 'Processing...' : purchaseButtonLabel}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingBottom: hp(16),
  },
  hero: {
    backgroundColor: PRIMARY,
    minHeight: hp(23),
    paddingHorizontal: wp(6),
    paddingTop: hp(1),
    paddingBottom: hp(3.2),
    borderBottomRightRadius: hp(20),
    // overflow: 'hidden',
  },
  heroBubble: {
    position: 'absolute',
    right: -wp(24),
    bottom: -hp(9),
    width: wp(84),
    height: hp(26),
    borderRadius: hp(20),
    backgroundColor: '#FFFFFF12',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: hp(1.8),
    marginLeft: wp(2),
    fontFamily: 'DMSans-Medium',
  },
  heroBody: {
    marginTop: hp(5.5),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: hp(3),
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'DMSans-Medium',
    marginRight: wp(2),
  },
  heroImage: {
    width: wp(30),
    height: hp(8.5),
    marginTop: hp(0.5),
  },
  content: {
    marginTop: hp(2.2),
    paddingHorizontal: wp(5.5),
  },
  clubSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FBF0F0',
    borderRadius: hp(2.2),
    padding: hp(0.65),
    borderWidth: 1,
    borderColor: '#F3E7E7',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  clubButton: {
    flex: 1,
    minHeight: hp(4.7),
    borderRadius: hp(1.7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubButtonActive: {
    backgroundColor: PRIMARY,
  },
  clubButtonText: {
    color: '#B25C5F',
    fontSize: hp(1.75),
    fontWeight: '600',
    fontFamily: 'DMSans-Medium',
  },
  clubButtonTextActive: {
    color: '#FFFFFF',
  },
  teamListButton: {
    marginTop: hp(2.2),
    backgroundColor: PRIMARY,
    borderRadius: hp(1.8),
    minHeight: hp(5.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  teamListText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '700',
    fontFamily: 'DMSans-Medium',
  },
  teamListIcon: {
    marginLeft: wp(2),
    transform: [{ rotate: '45deg' }],
  },
  pointsCard: {
    marginTop: hp(2.5),
    backgroundColor: CARD,
    borderRadius: hp(2.2),
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  pointsLabel: {
    color: '#2A2A2A',
    fontSize: hp(2),
    fontWeight: '600',
    fontFamily: 'DMSans-Medium',
  },
  pointsValue: {
    color: PRIMARY,
    fontSize: hp(4),
    fontWeight: '700',
    fontFamily: 'DMSans-Medium',
  },
  groupRow: {
    marginTop: hp(2.4),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusWrap: {
    marginTop: hp(1.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: MUTED,
    fontSize: hp(1.7),
    marginTop: hp(0.8),
    fontFamily: 'DMSans-Medium',
  },
  errorText: {
    color: PRIMARY,
    fontSize: hp(1.8),
    textAlign: 'center',
    fontFamily: 'DMSans-Medium',
  },
  groupCard: {
    width: wp(42),
    backgroundColor: CARD,
    borderRadius: hp(2.2),
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: wp(4),
    paddingTop: hp(1.3),
    paddingBottom: hp(1.8),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  groupPill: {
    backgroundColor: PILL,
    minHeight: hp(4.1),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.6),
  },
  groupPillText: {
    color: '#FFFFFF',
    fontSize: hp(1.8),
    fontWeight: '700',
    fontFamily: 'DMSans-Medium',
  },
  statBlock: {
    paddingTop: hp(0.1),
    paddingBottom: hp(1.35),
  },
  statLabel: {
    color: MUTED,
    fontSize: hp(1.75),
    fontFamily: 'DMSans-Medium',
  },
  statValue: {
    color: '#111111',
    fontSize: hp(3.9),
    fontWeight: '700',
    fontFamily: 'DMSans-Medium',
    marginTop: hp(0.2),
  },
  separator: {
    height: 1,
    backgroundColor: '#E7DED7',
    marginTop: hp(1.1),
  },
  footerCtaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp(5),
    paddingHorizontal: wp(6),
  },
  purchaseButton: {
    minHeight: hp(6.1),
    borderRadius: hp(3.1),
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '700',
    fontFamily: 'DMSans-Medium',
  },
});

export default MillionareClub;
