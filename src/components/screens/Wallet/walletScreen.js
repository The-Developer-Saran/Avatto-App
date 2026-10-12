import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ToastAndroid,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@react-native-vector-icons/ant-design';
import { useFocusEffect } from '@react-navigation/native';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Modal, TextInput } from 'react-native-paper';
import Lottie from 'lottie-react-native';


const WALLET_CARDS = [
  {
    key: 'cashback',
    title: 'Cashback Wallet',
    image: require('../../assets/images/Wallet/cashback_wallet.png'),
    accent: '#7E3AF2',
    actionLabel: 'Transfer',
    actionRoute: 'TransactionHistory',
  },
  {
    key: 'earning',
    title: 'Earning Wallet',
    image: require('../../assets/images/Wallet/earning_wallet.png'),
    accent: '#2DA56A',
    actionLabel: 'Transfer',
    actionRoute: 'EarningCommission',
    secondaryActionLabel: 'Withdraw',
    secondaryActionRoute: 'TransactionHistory',
  },
  {
    key: 'purchase',
    title: 'Purchase Wallet',
    image: require('../../assets/images/Wallet/purchase.png'),
    accent: '#8C52FF',
    actionLabel: 'Gift Card',
    actionRoute: 'PurchaseWalletHistory',
  },
  {
    key: 'voucher',
    title: 'Avatto  Wallet',
    image: require('../../assets/images/Wallet/voucher_wallet.png'),
    accent: '#6B7CFF',
    actionLabel: 'Utilize Now',
    actionRoute: 'MyVouchers',
  },
];

const WalletScreen = ({ navigation }) => {
  const encKey = encryptPiDataNew(Authentication_Key);
  const hasLoadedOnceRef = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [wallets, setWallets] = useState({
    cashback: 0,
    earning: 0,
    purchase: 0,
    voucher: 0,
    coins: 0,
  });

  const parseWalletValue = value => {
    const numericValue = Number.parseFloat(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const formatCurrency = value => {
    const amount = parseWalletValue(value);
    return amount.toFixed(2);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const refreshWalletData = async () => {
        const isFirstLoad = !hasLoadedOnceRef.current;

        if (!isActive) {
          return;
        }

        if (isFirstLoad) {
          setInitialLoading(true);
        } else {
          setIsRefreshing(false);
        }

        try {
          const userId = await AsyncStorage.getItem('user');
          const emptyWallets = {
            cashback: 0,
            earning: 0,
            purchase: 0,
            voucher: 0,
          };

          if (!isActive) {
            return;
          }

          if (!userId) {
            setWallets(emptyWallets);
            hasLoadedOnceRef.current = true;
            return;
          }

          const response = await fetch(
            `${BaseUrl}userWallet/get?req_type=1&res_type=1&uId=${userId}&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: encKey,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();
          const walletData = data?.Response?.Result?.[0];

          if (!isActive) {
            return;
          }

          if (data?.Response?.Success === '1' && walletData) {
            setWallets({
              cashback: parseWalletValue(walletData.cashback_wallet_available),
              earning: parseWalletValue(walletData.earning_wallet_available),
              purchase: parseWalletValue(walletData.purchase_wallet_available),
              voucher: parseWalletValue(walletData.voucher_wallet_available),
              coins: parseWalletValue(walletData.coins_available),
            });
          } else {
            setWallets(emptyWallets);
          }

          hasLoadedOnceRef.current = true;
        } catch (error) {
          if (isActive) {
            console.log('Wallet fetch error:', error.message);
          }
        } finally {
          if (!isActive) {
            return;
          }

          if (isFirstLoad) {
            setInitialLoading(false);
          } else {
            setIsRefreshing(false);
          }
        }
      };

      refreshWalletData();

      return () => {
        isActive = false;
      };
    }, [encKey])
  );

  const totalAvailableBalance =
    wallets.cashback + wallets.earning + wallets.purchase + wallets.voucher;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Footer', { screen: 'Home' });
  };

  const handleTopUp = () => {
    navigation.navigate('Footer', { screen: 'Topup' });
  };

  const [cashbackmodal, setCashbackmodal] = useState(false);
  const [Widrawcashbackmodal, setWidrawcashbackmodal] = useState(false);
  const [coinsTransferModal, setCoinTransferModal] = useState(false);

  const [cash, setCash] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);


  const [Uid, setUid] = useState(null);

  const [successModal, setSuccessModal] = useState(false);


  const cashback_wallet = wallets.cashback;
  const earning_wallet = wallets.earning


  const User_Details_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        // alert(value)
        setUid(value);
      } else {
        console.log('No user data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }
  };

  useEffect(() => {
    User_Details_Get();
  }, [])

  const CashBack_PurchaseWallet_Tranfer = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        const CashBack_wallet_Data = new FormData();

        CashBack_wallet_Data.append('uId', value);
        CashBack_wallet_Data.append('amount', cash);
        CashBack_wallet_Data.append('walletType', 'CW');

        console.log(CashBack_wallet_Data);

        if (cash == null || cash == '') {
          // alert("Please Enter Amount");
          ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
        } else {
          try {
            const response = await fetch(`${BaseUrl}walletTransfer`, {
              method: 'POST',
              headers: {
                authentication: encKey,
              },
              body: CashBack_wallet_Data,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === '1') {
              setSuccessModal(true);
            } else {
              ToastAndroid.showWithGravity(
                responseData?.Response?.Message || 'An error occurred',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
              console.log(responseData?.Response?.Message || 'Unknown error');
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            ToastAndroid.showWithGravity(
              'No Server Response',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        }

      }
    }
    catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }



  };

  const CashBack_EearningWallet_Tranfer = async () => {

    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {

        const CashBack_Earningwallet_Data = new FormData();

        CashBack_Earningwallet_Data.append('uId', value);
        CashBack_Earningwallet_Data.append('amount', cash);

        console.log(CashBack_Earningwallet_Data);

        if (cash == null || cash == '') {
          // alert("Please Enter Amount");
          ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
        } else {
          try {
            const response = await fetch(`${BaseUrl}walletTransfer/CWtoEW`, {
              method: 'POST',
              headers: {
                authentication: encKey,
              },
              body: CashBack_Earningwallet_Data,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === '1') {
              setSuccessModal(true);
            } else {
              ToastAndroid.showWithGravity(
                responseData?.Response?.Message || 'An error occurred',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
              console.log(responseData?.Response?.Message || 'Unknown error');
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            ToastAndroid.showWithGravity(
              'No Server Response',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        }

      }
    }
    catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }

  };

  const Eearning_PurchaseWallet_Tranfer = async () => {

    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        const CashBack_Earningwallet_Data = new FormData();

        CashBack_Earningwallet_Data.append('uId', value);
        CashBack_Earningwallet_Data.append('amount', cash);
        CashBack_Earningwallet_Data.append('walletType', 'EW');

        console.log(CashBack_Earningwallet_Data);

        if (cash == null || cash == '') {
          ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
        } else {
          try {
            const response = await fetch(`${BaseUrl}walletTransfer`, {
              method: 'POST',
              headers: {
                authentication: encKey,
              },
              body: CashBack_Earningwallet_Data,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === '1') {
              setSuccessModal(true);
            } else {
              ToastAndroid.showWithGravity(
                responseData?.Response?.Message || 'An error occurred',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
              console.log(responseData?.Response?.Message || 'Unknown error');
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            ToastAndroid.showWithGravity(
              'No Server Response',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        }
      }
    }
    catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }

  };

  const Widhdraw_Tranfer = async () => {

    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        const Withdraw_Data = new FormData();

        Withdraw_Data.append('uId', value);
        Withdraw_Data.append('amount', cash);

        console.log(Withdraw_Data);

        if (cash == null || cash == '') {
          ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
        } else {
          try {
            const response = await fetch(`${BaseUrl}withdrawalRequest`, {
              method: 'POST',
              headers: {
                authentication: encKey,
              },
              body: Withdraw_Data,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === '1') {
              setSuccessModal(true);
            } else {
              ToastAndroid.showWithGravity(
                responseData?.Response?.Message || 'An error occurred',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
              console.log(responseData?.Response?.Message || 'Unknown error');
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            ToastAndroid.showWithGravity(
              'No Server Response',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        }

      }
    }
    catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }

  };



  const transferCoins = async () => {
    setCoinTransferModal(false)
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        const coinsData = new FormData();

        coinsData.append('req_type', 1);
        coinsData.append('user_id', value);
        coinsData.append('coins', cash);

        if (cash == null || cash == '') {
          ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
        } else {
          try {
            const response = await fetch(`https://avatto.info/admin_avatto/convertCoins`, {
              method: 'POST',
              headers: {
                authentication: encKey,
              },
              body: coinsData,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData?.Response?.Success === '1') {
              setSuccessModal(true);
            } else {
              ToastAndroid.showWithGravity(
                responseData?.Response?.Message || 'An error occurred',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
              console.log(responseData?.Response?.Message || 'Unknown error');
              setCoinTransferModal(false)
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            ToastAndroid.showWithGravity(
              'No Server Response',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        }

      }
    }
    catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }

  };






  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.container}>
        {initialLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#B5232E" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroContent}>
                <Text style={styles.heroLabel}>Available Balance</Text>
                <Text style={styles.heroAmount}>₹ {formatCurrency(totalAvailableBalance)}</Text>
                <TouchableOpacity
                  style={styles.topUpButton}
                  activeOpacity={0.9}
                  onPress={handleTopUp}
                >
                  <Text style={styles.topUpText}>Top Up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.heroArtwork}>
                <Image source={require('../../assets/images/Wallet/empty-wallet.png')} style={{ height: hp(15), width: hp(15), tintColor: '#fff' }} />
              </View>
            </View>

            <View style={styles.grid}>
              {WALLET_CARDS.map(card => (
                <View key={card.key} style={styles.walletCard}>
                  <Image
                    source={card.image}
                    style={styles.walletIllustration}
                    resizeMode="contain"
                  />

                  <Text style={styles.walletTitle}>{card.title}</Text>
                  <Text style={styles.walletAmount}>₹ {formatCurrency(wallets[card.key])}</Text>

                  {
                    card.actionLabel != 'Utilize Now' && (
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={[
                            styles.primaryAction,
                            card.secondaryActionLabel ? styles.splitPrimaryAction : styles.fullAction,
                          ]}
                          activeOpacity={0.9}
                          // onPress={() => card.title == 'Cashback Wallet' ? setCashbackmodal(true) : card.title == 'purchase' ? navigation.navigate('GiftCard') : setWidrawcashbackmodal(true)}
                          onPress={() => card.title == 'Cashback Wallet' ? setCashbackmodal(true) : card.title == 'Purchase Wallet' ? navigation.navigate('GiftCard',{purchaseWallet:formatCurrency(wallets[card.key])}) : setWidrawcashbackmodal(true)}
                        >
                          <Text style={styles.primaryActionText}>{card.actionLabel}</Text>
                        </TouchableOpacity>

                        {card.secondaryActionLabel ? (
                          <TouchableOpacity
                            style={styles.secondaryAction}
                            activeOpacity={0.9}
                            // onPress={() => navigation.navigate(card.secondaryActionRoute)}  
                            onPress={() => card.title == 'Earning Wallet' ? setWidrawcashbackmodal(true) : ''}

                          >
                            <Text style={styles.secondaryActionText}>{card.secondaryActionLabel}</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    )
                  }
                </View>
              ))}
            </View>

            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 12, elevation: 2, backgroundColor: '#fff' }}>
              <Image source={require('../../assets/images/Wallet/coin.png')} style={{ height: hp(8), width: hp(8), }} />
              <View style={{ paddingLeft: 15 }}>
                <Text style={{ color: '#000', fontSize: 16, fontWeight: '700' }}>Coins</Text>
                <Text style={{ color: '#000', fontSize: 20, fontWeight: '700' }}>₹ {wallets.coins}.00</Text>
                <TouchableOpacity onPress={() => setCoinTransferModal(true)} style={{ marginTop: 5, backgroundColor: '#A6222C', padding: 8, width: wp(60), justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Transfer</Text>
                </TouchableOpacity>

              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ==================== Modal for Cashwallet transfer =============== */}
      <Modal
        animationType="slide"
        transparent
        visible={cashbackmodal}
        onRequestClose={() => {
          setCashbackmodal(!cashbackmodal);
        }}
      >
        <>
          <Pressable
            onPress={() => setCashbackmodal(false)}
            style={{
              height: hp(100),
              width: wp(100),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <View
              style={{
                height: hp(58),
                width: wp(100),
                borderRadius: hp(5),
                marginTop: 'auto',
                backgroundColor: '#fff',
                padding: hp(0),
                marginBottom: 0
              }}
              onStartShouldSetResponder={e => e.stopPropagation()}
            >
              <View
                style={{
                  width: wp(10),
                  height: hp(0.75),
                  backgroundColor: '#A6222C',
                  alignSelf: 'center',
                  marginTop: hp(1),
                  borderRadius: hp(0.35),
                }}
              ></View>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: hp(2),
                  color: '#000',
                  marginTop: hp(2),
                  fontWeight: 'bold',
                }}
              >
                CashBack Wallet Transfer
              </Text>

              <TouchableOpacity onPress={() => setCashbackmodal(false)} style={{ position: 'absolute', top: 20, right: 20, height: 25, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: '#A6222C' }}>
                <Text style={{ color: '#fff' }}>X</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: wp(50),
                  height: hp(8),
                  backgroundColor: '#a6222d49',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                  borderRadius: hp(2),
                }}
              >
                <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#000' }}>
                  Available
                </Text>
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: 'bold',
                    marginTop: hp(1),
                    color: '#000'
                  }}
                >
                  ₹ {cashback_wallet}
                </Text>
              </View>

              <TextInput
                mode="outlined"
                outlineColor="black"
                placeholder="Enter the Transfer Amount"
                placeholderTextColor="gray"
                style={{
                  width: wp(60),
                  backgroundColor: '#fff',
                  fontSize: hp(2),
                  marginTop: hp(2),
                  alignSelf: 'center',
                }}
                contentStyle={{ color: '#000', height: hp(5.5) }}
                outlineStyle={{
                  backgroundColor: 'transparent',
                  borderColor: '#A6222C',
                  borderRadius: 5,
                  borderWidth: 1.2,
                }}
                activeOutlineColor="#A6222C"
                cursorColor="#A6222C"
                keyboardType='decimal-pad'
                maxLength={6}
                value={cash}
                onChangeText={value => setCash(value)}
              />

              <TouchableOpacity
                onPress={() => {
                  setSelectedAction('earning');
                  setConfirmModal(true);
                }}
                style={{
                  width: wp(60),
                  height: hp(6),
                  backgroundColor: '#A6222C',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                  borderRadius: hp(5),
                }}
              >
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  Transfer to Earning Wallet
                </Text>
                <Text style={{ fontSize: hp(1.5), color: '#fff' }}>
                  (Minimum amount : 300)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedAction('purchase');
                  setConfirmModal(true);
                }}
                style={{
                  width: wp(60),
                  height: hp(6),
                  backgroundColor: '#A6222C',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                  borderRadius: hp(5),
                }}
              >
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  Transfer to Purchase Wallet
                </Text>



                <Text style={{ fontSize: hp(1.5), color: '#fff' }}>
                  (Minimum amount : 100)
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </>
      </Modal>

      {/* ==================== Modal for earning  withdraw & transfer =============== */}
      <Modal
        animationType="slide"
        transparent
        visible={Widrawcashbackmodal}
        onRequestClose={() => {
          setWidrawcashbackmodal(!Widrawcashbackmodal);
        }}
      >
        <>
          <Pressable
            onPress={() => setWidrawcashbackmodal(false)}
            style={{
              height: hp(100),
              width: wp(100),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              marginBottom: 80
            }}
          >
            <View
              style={{
                height: hp(50),
                width: wp(100),
                borderRadius: hp(5),
                marginTop: 'auto',
                backgroundColor: '#fff',
                padding: hp(0),
              }}
              onStartShouldSetResponder={e => e.stopPropagation()}
            >
              <View
                style={{
                  width: wp(10),
                  height: hp(0.75),
                  backgroundColor: '#A6222C',
                  alignSelf: 'center',
                  marginTop: hp(1),
                  borderRadius: hp(0.35),
                }}
              ></View>

              <TouchableOpacity onPress={() => setWidrawcashbackmodal(false)} style={{ position: 'absolute', top: 20, right: 20, height: 25, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: '#A6222C' }}>
                <Text style={{ color: '#fff' }}>X</Text>
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: hp(2),
                  color: '#000',
                  marginTop: hp(2),
                  fontWeight: 'bold',
                }}
              >
                Earning Wallet Transfer
              </Text>
              <View
                style={{
                  width: wp(50),
                  height: hp(8),
                  backgroundColor: '#a6222d50',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                  borderRadius: hp(2),
                }}
              >
                <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }}>
                  Available
                </Text>
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: 'bold',
                    marginTop: hp(1),
                  }}
                >
                  ₹ {earning_wallet}
                </Text>
              </View>

              <TextInput
                mode="outlined"
                outlineColor="black"
                placeholder="Enter the Transfer Amount"
                placeholderTextColor="gray"
                style={{
                  width: wp(60),
                  backgroundColor: '#fff',
                  fontSize: hp(2),
                  marginTop: hp(2),
                  alignSelf: 'center',
                }}
                contentStyle={{ color: '#000', height: hp(5.5) }}
                outlineStyle={{
                  backgroundColor: 'transparent',
                  borderColor: '#A6222C',
                  borderRadius: 5,
                  borderWidth: 1.2,
                }}
                activeOutlineColor="#A6222C"
                cursorColor="#A6222C"
                keyboardType='decimal-pad'
                maxLength={6}
                value={cash}
                onChangeText={value => setCash(value)}

              />

              <TouchableOpacity
                onPress={() => {
                  setConfirmAction('transferPurchase');
                  setConfirmVisible(true);
                }}
                style={{
                  width: wp(70),
                  height: hp(6),
                  backgroundColor: '#A6222C',
                  borderRadius: hp(5),
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                }}
              >
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  Transfer to Purchase Wallet
                </Text>
                <Text style={{color:'#bdbcbc', fontSize:10}}>(5% Avatto wallet - 5% Service Charge)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setConfirmAction('withdraw');
                  setConfirmVisible(true);
                }}
                style={{
                  width: wp(70),
                  height: hp(6),
                  backgroundColor: '#A6222C',
                  borderRadius: hp(5),
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                }}
              >
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  Withdraw
                </Text>
                <Text style={{color:'#bdbcbc', fontSize:10}}>(5% Avatto wallet - 5% Service Charge - 5% TDS) </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </>
      </Modal>

      {/* ==================== Modal for Cashwallet confirm =============== */}
      <Modal transparent visible={confirmModal} animationType="fade">
        <View
          style={{
            height: hp(100),
            width: wp(100),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              width: wp(80),
              backgroundColor: '#b88b8e',
              borderRadius: hp(2),
              padding: hp(3),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: hp(2.5),
                fontWeight: '700',
                color: '#A6222C',
                marginBottom: hp(2),
              }}
            >
              Confirm Transfer
            </Text>

            <Text
              style={{
                fontSize: hp(2),
                color: '#000',
                textAlign: 'center',
                marginBottom: hp(3),
              }}
            >
              Are you sure you want to proceed?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              {/* NO BUTTON */}
              <TouchableOpacity
                onPress={() => setConfirmModal(false)}
                style={{
                  width: '45%',
                  backgroundColor: '#bb7579',
                  paddingVertical: hp(1.5),
                  borderRadius: hp(1),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontSize: hp(2),
                    fontWeight: '600',
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>

              {/* YES BUTTON */}
              <TouchableOpacity
                onPress={() => {
                  setConfirmModal(false);

                  if (selectedAction === 'earning') {
                    CashBack_EearningWallet_Tranfer();
                  } else if (selectedAction === 'purchase') {
                    CashBack_PurchaseWallet_Tranfer();
                  }

                  setCashbackmodal(false);
                }}
                style={{
                  width: '45%',
                  backgroundColor: '#A6222C',
                  paddingVertical: hp(1.5),
                  borderRadius: hp(1),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: hp(2),
                    fontWeight: '600',
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== Modal for earning confirm =============== */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View
          style={{
            height: hp(100),
            width: wp(100),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              width: wp(80),
              backgroundColor: '#c5afb1',
              borderRadius: hp(2),
              padding: hp(3),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: hp(2.5),
                fontWeight: '700',
                color: '#A6222C',
                marginBottom: hp(2),
              }}
            >
              Confirm Transfer
            </Text>

            <Text
              style={{
                fontSize: hp(2),
                color: '#000',
                marginBottom: hp(3),
                textAlign: 'center',
              }}
            >
              Are you sure you want to proceed?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              {/* NO */}
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                style={{
                  width: '45%',
                  backgroundColor: '#ac6c72',
                  paddingVertical: hp(1.5),
                  borderRadius: hp(1),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: '600',
                    color: '#000',
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>

              {/* YES */}
              <TouchableOpacity
                onPress={() => {
                  setConfirmVisible(false);

                  if (confirmAction === 'transferPurchase') {
                    Eearning_PurchaseWallet_Tranfer();
                  } else if (confirmAction === 'withdraw') {
                    Widhdraw_Tranfer();
                  }

                  setWidrawcashbackmodal(false);
                }}
                style={{
                  width: '45%',
                  backgroundColor: '#A6222C',
                  paddingVertical: hp(1.5),
                  borderRadius: hp(1),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* ==================== Modal for success =============== */}
      <Modal
        animationType="slide"
        transparent
        visible={successModal}
        onRequestClose={() => {
          setSuccessModal(!successModal);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        >
          <View
            style={{
              height: hp(40),
              width: wp(80),
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp(0),
              borderRadius: hp(3),
              borderWidth: 1,
              borderColor: '#bdbcbc',
              alignSelf: 'center',
            }}
          >
            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
            <Lottie
              resizeMode="cover"
              source={require('../../assets/json/transfer.json')}
              style={{ width: hp(20), height: hp(20) }}
              autoPlay
              loop
            />
            <Text
              style={{
                fontSize: hp(2.3),
                fontWeight: '500',
                color: '#000',
                marginTop: hp(3),
              }}
            >
              Amount Transfered Succesfully
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSuccessModal(false)
              }}
              style={{
                padding: hp(1),
                width: wp(25),
                backgroundColor: '#A6222C',
                borderRadius: hp(1),
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp(4),
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ==================== Modal for coins transfer =============== */}
      <Modal
        animationType="slide"
        transparent
        visible={coinsTransferModal}
        onRequestClose={() => {
          setCoinTransferModal(!cashbackmodal);
        }}
      >
        <>
          <Pressable
            onPress={() => setCoinTransferModal(false)}
            style={{
              height: hp(100),
              width: wp(100),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <View
              style={{
                height: hp(48),
                width: wp(100),
                borderRadius: hp(5),
                marginTop: 'auto',
                backgroundColor: '#fff',
                padding: hp(0),
                marginBottom: 0
              }}
              onStartShouldSetResponder={e => e.stopPropagation()}
            >
              <View
                style={{
                  width: wp(10),
                  height: hp(0.75),
                  backgroundColor: '#A6222C',
                  alignSelf: 'center',
                  marginTop: hp(1),
                  borderRadius: hp(0.35),
                }}
              ></View>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: hp(2),
                  color: '#000',
                  marginTop: hp(2),
                  fontWeight: 'bold',
                }}
              >
                Coins Transfer
              </Text>

              <TouchableOpacity onPress={() => setCoinTransferModal(false)} style={{ position: 'absolute', top: 20, right: 20, height: 25, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: '#A6222C' }}>
                <Text style={{ color: '#fff' }}>X</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: wp(50),
                  height: hp(8),
                  backgroundColor: '#a6222d49',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                  borderRadius: hp(2),
                }}
              >
                <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#000' }}>
                  Available
                </Text>
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: 'bold',
                    marginTop: hp(1),
                    color: '#000'
                  }}
                >
                  ₹ {wallets.coins}
                </Text>
              </View>

              <TextInput
                mode="outlined"
                outlineColor="black"
                placeholder="Enter the Transfer Amount"
                placeholderTextColor="gray"
                style={{
                  width: wp(60),
                  backgroundColor: '#fff',
                  fontSize: hp(2),
                  marginTop: hp(2),
                  alignSelf: 'center',
                }}
                contentStyle={{ color: '#000', height: hp(5.5) }}
                outlineStyle={{
                  backgroundColor: 'transparent',
                  borderColor: '#A6222C',
                  borderRadius: 12,
                  borderWidth: 1.2,
                }}
                activeOutlineColor="#A6222C"
                cursorColor="#A6222C"
                keyboardType='decimal-pad'
                maxLength={6}
                value={cash}
                onChangeText={value => setCash(value)}
              />

              <TouchableOpacity
                onPress={() => {
                  transferCoins()
                }}
                style={{
                  width: wp(60),
                  height: hp(6),
                  backgroundColor: '#A6222C',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                  borderRadius: hp(5),
                }}
              >
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  Transfer Coins
                </Text>
                {/* <Text style={{ fontSize: hp(1.5), color: '#fff' }}>
                  (Minimum amount : 300)
                </Text> */}
              </TouchableOpacity>
            </View>
          </Pressable>
        </>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: hp(2),
    paddingHorizontal: wp(6),
    paddingBottom: hp(1.4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backText: {
    marginLeft: wp(2.2),
    fontSize: hp(2.05),
    color: '#3A3F52',
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(14),
    marginTop: hp(3)
  },
  heroCard: {
    backgroundColor: '#B5232E',
    borderRadius: hp(2.3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.2),
    minHeight: hp(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#B5232E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },
  heroContent: {
    flex: 1,
    paddingRight: wp(3),
  },
  heroLabel: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '600',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: hp(4.15),
    fontWeight: 'bold',
    marginTop: hp(1),
  },
  topUpButton: {
    marginTop: hp(2.2),
    backgroundColor: '#F0A433',
    width: wp(34),
    height: hp(5.4),
    borderRadius: hp(2.7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '600',
  },
  heroArtwork: {
    width: wp(26),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardOutlineBack: {
    position: 'absolute',
    width: wp(18),
    height: hp(6.6),
    borderRadius: hp(1.6),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    transform: [{ rotate: '-42deg' }, { translateX: -8 }, { translateY: -12 }],
  },
  cardOutlineFront: {
    width: wp(18),
    height: hp(6.8),
    borderRadius: hp(1.6),
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-28deg' }],
    justifyContent: 'center',
    paddingHorizontal: wp(2.2),
  },
  cardChip: {
    width: wp(3.8),
    height: hp(1.2),
    borderRadius: hp(0.4),
    backgroundColor: '#FFFFFF',
    marginBottom: hp(1),
  },
  cardLine: {
    width: wp(7.2),
    height: hp(0.35),
    borderRadius: hp(1),
    backgroundColor: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: hp(2.8),
  },
  walletCard: {
    width: wp(42.5),
    minHeight: hp(24),
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.2),
    borderWidth: 1,
    borderColor: '#E8E8EC',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.1),
    marginBottom: hp(1.8),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  walletIllustration: {
    width: wp(24),
    height: hp(11),
    alignSelf: 'flex-end',
    marginBottom: hp(1.5),
  },
  walletTitle: {
    fontSize: hp(2.1),
    color: '#30323C',
    fontWeight: '600',
    lineHeight: hp(2.7),
    minHeight: hp(5.6),
  },
  walletAmount: {
    fontSize: hp(3.05),
    color: '#181A22',
    fontWeight: 'bold',
    marginTop: hp(0.4),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: hp(2.1),
  },
  fullAction: {
    width: '100%',
  },
  primaryAction: {
    minHeight: hp(4.2),
    backgroundColor: '#B5232E',
    borderRadius: hp(2.1),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2.2),
  },
  splitPrimaryAction: {
    width: '47%',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: hp(1.35),
    fontWeight: '700',
  },
  secondaryAction: {
    width: '47%',
    minHeight: hp(4.2),
    backgroundColor: '#F0A433',
    borderRadius: hp(2.1),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2.2),
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontSize: hp(1.2),
    fontWeight: '700',
  },
});

export default WalletScreen;
