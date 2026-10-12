import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
  Linking,
  Pressable,
  ToastAndroid,
  BackHandler,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import { AppCode, BaseUrl } from '../BaseUrl/BaseUrl';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import AntDesign from '@react-native-vector-icons/ant-design';
import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Entypo from '@react-native-vector-icons/entypo';
import notifee, { AndroidImportance, AndroidVisibility, AndroidBadgeIconType } from '@notifee/react-native';
import { getMessaging, onMessage, onTokenRefresh, getToken, deleteToken, requestPermission, setBackgroundMessageHandler, getInitialNotification, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import Feather from '@react-native-vector-icons/feather';

const gradientColors = [
  ['#56ab2f', '#a8e063'],
  ['#43cea2', '#185a9d'],
  ['#ff9966', '#ff5e62'],
  ['#8e2de2', '#4a00e0'],
  ['#00b09b', '#96c93d'],
  ['#f7971e', '#ffd200'],
];

const { width } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [searchQuery, setSearchQuery] = useState('');
  const [AppUpdate, setAppUpdate] = useState(false);
  const [cashbackmodal, setCashbackmodal] = useState(false);
  const [Widrawcashbackmodal, setWidrawcashbackmodal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [CW_EWmodal, setCW_EWmodal] = useState(false);
  const [EW_PWmodal, setEW_PWmodal] = useState(false);
  const [Widrawmodal, setWidrawmodal] = useState(false);
  const [updateLink, setUpdateLink] = useState(null);
  const [cash, setCash] = useState(null);
  const [Uid, setUid] = useState(null);
  const [userNotFoundModal, setUserNotFoundModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [voucherwalletmodal, setVoucherwalletmodal] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  //const message = "Only Prepaid & DTH will work, Other utility bill payments coming soon   ";

  // useEffect(() => {
  //     if (textWidth === 0) return;

  //     const animate = () => {
  //         scrollAnim.setValue(screenWidth);
  //         Animated.timing(scrollAnim, {
  //             toValue: -textWidth,
  //             duration: (screenWidth + textWidth) * 10, // adjust for speed
  //             useNativeDriver: true,
  //         }).start(() => animate()); // loop
  //     };

  //     animate();
  // }, [textWidth]);

  console.log('updateLink', updateLink);

  const handleButtonClick = () => {
    Linking.openURL(updateLink).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  const TechPartener_Link = () => {
    Linking.openURL('https://avatto.netlify.app/').catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  const EncKey = encryptPiDataNew(Authentication_Key);

  const handleNavigation = screen => {
    if (screen === 'TechPartener_Link') {
      TechPartener_Link(); // your external link function
    } 
    else if (screen === 'ServiceScreen') {
      ToastAndroid.show('Coming Soon', ToastAndroid.SHORT);
    }
    
    else {
      navigation.navigate(screen);
    }
  };

  const data = [
    {
      id: '1',
      // name: 'AVAXAA STORE',
      name: 'AVATTO STORE',
      screen: 'AvaxaaItemget',
      image: require('../../assets/images/Home/CardImages/avaxaastore.png'),
    },
    {
      id: '2',
      name: 'OFFER DEALS',
      screen: 'PremiumItemget',
      image: require('../../assets/images/Home/CardImages/premiumdeals.png'),
    },
    {
      id: '3',
      name: 'STORE DEALS',
      screen: 'StoreDealsHome',
      image: require('../../assets/images/Home/CardImages/discountstore.png'),
    },
     {
      id: '13',
      name: 'MILLIONARE CLUB',
      screen: 'MillionareClub',
      image: require('../../assets/images/Home/CardImages/MiClub.png'),
    },
    // {
    //   id: '4',
    //   name: 'TRAVEL DESK',
    //   screen: 'NearByTravels',
    //   image: require('../../assets/images/Home/CardImages/traveldesk.png'),
    // },
    { id: '5', name: 'RECHARGES', screen: 'ServiceScreen', image: require('../../assets/images/Home/CardImages/recharge.png') },
    // { id: '6', name: 'BILL PAYMENTS', screen: 'ServiceScreenBill', image: require('../../assets/images/Home/CardImages/billpayment.png') },
    {
      id: '7',
      name: 'TICKET BOOKINGS',
      screen: 'TravelListByCategory',
      image: require('../../assets/images/Home/CardImages/ticketbookings.png'),
    },
    {
      id: '8',
      name: 'E-SHOPPING',
      screen: 'Eshopping',
      image: require('../../assets/images/Home/CardImages/e-shopping.png'),
    },
    {
      id: '9',
      name: 'DISCOUNT VOUCHER',
      screen: 'StoresListByCategory',
      image: require('../../assets/images/Home/CardImages/discountvoucher.png'),
    },
    {
      id: '10',
      name: 'REAL ESTATE',
      screen: 'RealEstateListScreen',
      image: require('../../assets/images/Home/CardImages/realestate.png'),
    },
    // {
    //   id: '11',
    //   name: 'EDUCATION HUB',
    //   screen: 'EducationForm',
    //   image: require('../../assets/images/Home/CardImages/insurance.png'),
    // },
    {
      id: '12',
      name: 'TECH PARTNER',
      screen: 'TechPartener_Link',
      image: require('../../assets/images/Home/CardImages/techpartner.png'),
    },
  ];

  // const data = [
  //     { id: '1', name: 'AVAXAA STORE', image: require('../../assets/images/Home/CardImages/avaxaastore.png') },
  //     { id: '2', name: 'OFFER DEALS', image: require('../../assets/images/Home/CardImages/premiumdeals.png') },
  //     { id: '3', name: 'STORE DEALS', image: require('../../assets/images/Home/CardImages/discountstore.png') },
  //     { id: '4', name: 'TRAVEL DESK', image: require('../../assets/images/Home/CardImages/traveldesk.png') },
  //     { id: '5', name: 'RECHARGES', image: require('../../assets/images/Home/CardImages/recharge.png') },
  //     { id: '6', name: 'BILL PAYMENTS', image: require('../../assets/images/Home/CardImages/billpayment.png') },
  //     { id: '7', name: 'TICKET BOOKINGS', image: require('../../assets/images/Home/CardImages/ticketbookings.png') },
  //     { id: '8', name: 'E-SHOPPING', image: require('../../assets/images/Home/CardImages/e-shopping.png') },
  //     { id: '9', name: 'DISCOUNT VOUCHER', image: require('../../assets/images/Home/CardImages/discountvoucher.png') },
  //     { id: '10', name: 'REAL ESTATE', image: require('../../assets/images/Home/CardImages/realestate.png') },
  //     { id: '11', name: 'EDUCATION HUB', image: require('../../assets/images/Home/CardImages/insurance.png') },
  //     { id: '12', name: 'TECH PARTNER', image: require('../../assets/images/Home/CardImages/techpartner.png') },

  // ];

  // const bannerImg = [
  //     { name: 'Skin', price: 249, oldPrice: 405, image: require('../../assets/images/Home/Banner/bannerImg1.jpg') },
  //     { name: 'Nail', price: 249, oldPrice: 405, image: require('../../assets/images/Home/Banner/bannerImg3.jpg') },
  //     { name: 'Eye', price: 249, oldPrice: 405, image: require('../../assets/images/Home/Banner/bannerImg4.jpg') },
  // ];

  const [bannerImg, setBannerImg] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //     getBanner();
  // }, [])

  // const getBanner = async () => {
  //     const response = await fetch(`${BaseUrl}bannerGet?req_type=1&res_type=1&id=&type=M&banner_type=MAIN`, {
  //         method: 'GET',
  //         headers: { "authentication": EncKey }
  //     });
  //     response.json()
  //         .then(responseData => {
  //             if (responseData.Response.Success == 1) {
  //                 setBannerImg(responseData.Response.Result);
  //             }
  //             else {
  //                 setBannerImg([]);
  //             }
  //         })
  //         .catch(error => {
  //             console.log(error);
  //         });
  // }

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BaseUrl}bannerGet?req_type=1&res_type=1&id=&type=M&banner_type=MAIN`,
        {
          method: 'GET',
          headers: { authentication: EncKey },
        },
      );
      const responseData = await response.json();
      if (responseData.Response.Success == 1) {
        setBannerImg(responseData.Response.Result);
      } else {
        setBannerImg([]);
      }
    } catch (error) {
      console.log(error);
      setBannerImg([]);
    } finally {
      setLoading(false);
    }
  };

  const [msgData, setMsgData] = useState(null);

  console.log('msgData', msgData);

  useEffect(() => {
    User_Alert_Msg();
  }, []);

  const User_Alert_Msg = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        // alert(value)
        try {
          const response = await fetch(
            `${BaseUrl}appScreenGet?req_type=1&res_type=1&id=16&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: EncKey,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();

          if (data.Response.Success === '1') {
            setMsgData(data.Response.Result[0].app_screen_control_title);
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

  const tokenLogout = () => {
    AsyncStorage.removeItem('user');
  };

  const handleButtonPress = () => {
    Alert.alert(
      'Confirm',
      `Are you sure you want to Logout ?`,
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            LogOut();
          },
        },
      ],
      { cancelable: false },
    );
  };

  useEffect(() => {
    // Check status and appStatus on component mount or whenever they update
    if (status == '0' && appStatus == '0') {
      LogOut();
    }
  }, [status, appStatus]);

  const LogOut = () => {
    AsyncStorage.removeItem('user');
    navigation.navigate('LoginScreen');
  };

  const [profileData, setProfileData] = useState('');
  const [profileName, setProfileName] = useState('');

  const [profileId, setProfileId] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [membership, setMembership] = useState('');
  const [status, setStatus] = useState('');
  const [appStatus, setAppStatus] = useState('');

  console.log('profileData', profileData);
  console.log('profileName', profileName);
  console.log('profileId', profileId);
  console.log('profileImage', profileImage);
  console.log('membership', membership);
  console.log('status', status);
  console.log('appStatus', appStatus);

  useEffect(() => {
    if (isFocused) {
      User_Details_Get();
    }
  }, [isFocused]);

  const User_Details_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        // alert(value)
        setUid(value);
        try {
          const response = await fetch(
            `${BaseUrl}userGet?req_type=1&res_type=1&id=${value}&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: EncKey,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();
          console.log('data :::>>>', data.Response);

          if (data.Response.Success === '1') {
            setProfileData(data.Response.Result);
            setProfileName(data.Response.Result[0]?.name || ''); // Use optional chaining and fallback
            setProfileId(data.Response.Result[0]?.id || null);
            setProfileImage(data.Response.Result[0]?.profile_image || '');
            setMembership(
              data.Response.Result[0]?.memberships[0]?.membership_name || '',
            );
            setStatus(data.Response.Result[0]?.status || '');
            setAppStatus(data.Response.Result[0]?.app_status || '');
          } else {
            console.log(data?.Response?.Message || 'Unknown error');
            setProfileData(null);
            setProfileId(null);
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

  const [walletData, setWalletData] = useState(null);
  const [cashback_wallet, setCashback_wallet] = useState(0);
  const [earning_wallet, setEarning_wallet] = useState(0);
  const [purchase_wallet, setPurchase_wallet] = useState(0);
  const [voucher_wallet, setVoucher_wallet] = useState(0);

  console.log('walletData', walletData);
  console.log('cashback_wallet', cashback_wallet);
  console.log('earning_wallet', earning_wallet);
  console.log('purchase_wallet', purchase_wallet);

  useEffect(() => {
    User_Wallet_Get();
    VersionUpdate();
  }, []);

  useFocusEffect(
    useCallback(() => {
      User_Wallet_Get();
      return () => {
        console.log('Screen is unfocused, cleanup if needed.');
      };
    }, []),
  );

  const User_Wallet_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        // alert(value)
        try {
          const response = await fetch(
            `${BaseUrl}userWallet/get?req_type=1&res_type=1&uId=${value}&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: EncKey,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();

          if (data.Response.Success === '1') {
            setWalletData(data.Response.Result);
            setCashback_wallet(
              data.Response.Result[0]?.cashback_wallet_available || '',
            );
            setEarning_wallet(
              data.Response.Result[0]?.earning_wallet_available || '',
            );
            setPurchase_wallet(
              data.Response.Result[0]?.purchase_wallet_available || '',
            );
            setVoucher_wallet(
              data.Response.Result[0]?.voucher_wallet_available || '',
            );
          } else {
            console.log(data?.Response?.Message || 'Unknown error');
            setProfileData(null);
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

  //=========================================== Check app Update ================================================
  // const VersionUpdate = async () => {

  //     try {
  //         const value = await AsyncStorage.getItem('user');
  //         if (value !== null) {
  //             let data = (JSON.parse(value));
  //             if (data.mobile !== '8899882222') {
  //                 axios.post(`https://sparkredeem.com/avatto/menuGet?menuType=VER&type=M`)
  //                     .then((res) => {
  //                         if (res?.data.Response.Success == "1") {
  //                             let data = res?.data;
  //                             let version = res?.data.Response.Result[0].ios_version;
  //                             if (version !== AppCode) {
  //                                 setAppUpdate(true)
  //                             }
  //                             else {
  //                                 setAppUpdate(false)
  //                             }
  //                         }
  //                         else {
  //                             console.log(res?.data)
  //                         }
  //                     })
  //                     .catch((error) => {
  //                         console.log(error)
  //                     })
  //             }
  //             else {
  //                 setAppUpdate(false)
  //             }
  //         }
  //     }
  //     catch (error) {
  //         console.log(error);

  //     }
  // }

  const VersionUpdate = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        let data = JSON.parse(value); // Parse the user data

        // if (data.mobile !== '7200327576') {
        try {
          const response = await fetch(
            `${BaseUrl}menuGet?menuType=VER&type=M`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authentication: EncKey,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const res = await response.json();

          if (res?.Response?.Success === '1') {
            const version = res?.Response?.Result[0]?.title;
            setUpdateLink(res?.Response?.Result[0]?.description);
            console.log('version', version);

            if (version !== AppCode) {
              setAppUpdate(true); // Set app update flag to true if versions do not match
            } else {
              setAppUpdate(false); // No update needed if versions match
            }
          } else {
            console.log(res?.Response?.Message || 'Unknown error');
          }
        } catch (error) {
          console.error('Fetch error:', error.message);
        }
      } else {
        setAppUpdate(false); // No update for this mobile number
      }
      // }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }
  };

  const CashBack_PurchaseWallet_Tranfer = async () => {
    const CashBack_wallet_Data = new FormData();

    CashBack_wallet_Data.append('uId', Uid);
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
            authentication: EncKey,
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
  };

  const CashBack_EearningWallet_Tranfer = async () => {
    const CashBack_Earningwallet_Data = new FormData();

    CashBack_Earningwallet_Data.append('uId', Uid);
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
            authentication: EncKey,
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
  };

  const Eearning_PurchaseWallet_Tranfer = async () => {
    const CashBack_Earningwallet_Data = new FormData();

    CashBack_Earningwallet_Data.append('uId', Uid);
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
            authentication: EncKey,
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
  };

  const Widhdraw_Tranfer = async () => {
    const Withdraw_Data = new FormData();

    Withdraw_Data.append('uId', Uid);
    Withdraw_Data.append('amount', cash);

    console.log(Withdraw_Data);

    if (cash == null || cash == '') {
      ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
    } else {
      try {
        const response = await fetch(`${BaseUrl}withdrawalRequest`, {
          method: 'POST',
          headers: {
            authentication: EncKey,
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
  };

  const Voucherto_PurchaseWallet_Tranfer = async () => {
    const Voucher_wallet_Data = new FormData();

    Voucher_wallet_Data.append('uId', Uid);
    Voucher_wallet_Data.append('amount', cash);

    console.log(Voucher_wallet_Data);

    if (cash == null || cash == '') {
      ToastAndroid.show('"Please Enter Amount".', ToastAndroid.LONG);
    } else {
      try {
        const response = await fetch(`${BaseUrl}/walletTransfer/VWtoCW`, {
          method: 'POST',
          headers: {
            authentication: EncKey,
          },
          body: Voucher_wallet_Data,
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
  };

  useEffect(() => {
    setTimeout(() => {
      if (profileId === null || profileId === undefined) {
        // setUserNotFoundModal(true);
      } else {
        setUserNotFoundModal(false);
      }
    }, 3000);
  }, [profileId]);

  // useFocusEffect(
  //     useCallback(() => {
  //         const backAction = () => {
  //             Alert.alert("Hold on!", "Are you sure you want to exit?", [
  //                 { text: "EXIT", onPress: () => BackHandler.exitApp() },
  //                 {
  //                     text: "Cancel",
  //                     onPress: () => null,
  //                     style: "cancel",
  //                 },
  //                 {
  //                     text: "Go Home",
  //                     onPress: () => navigation.navigate('Footer', { screen: 'HomeScreen' }),
  //                     style: "default",
  //                 },
  //             ]);
  //             return true;
  //         };

  //         const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

  //         return () => backHandler.remove();
  //     }, [navigation])
  // );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setModalVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  const handleExit = () => {
    setModalVisible(false);
    BackHandler.exitApp();
  };

  const handleGoHome = () => {
    setModalVisible(false);
    navigation.navigate('Footer', { screen: 'HomeScreen' });
  };

  const speed = 150;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -1000, // big enough for very long text
        duration: speed * 100,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const scrollRef = useRef(null);

  useEffect(() => {
    let scrollX = 0;
    const speed = 1;
    const interval = setInterval(() => {
      scrollX += speed;
      if (scrollX >= 1000) {
        scrollX = 0;
      }
      scrollRef.current?.scrollTo({
        x: scrollX,
        animated: false,
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const messaging = getMessaging(getApp());

  const updateTokenAndIP = async (ip, fcmToken) => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        const inputData = new FormData();
        inputData.append('userId', value);
        inputData.append('deviceId', fcmToken);
        inputData.append('ipAddress', ip);
        console.log(inputData)
        const response = await fetch(
          `https://avatto.info/admin_avatto/updateDeviceAndIPAddress`,
          //  `https://sparkredeem.com/avatto/updateDeviceAndIPAddress`,
          {
            method: 'POST',
            headers: {
              // authentication:
              //   'U2FsdGVkX1+GlwN//3zk31Sm9LK1WafujRfUtRVhbR/GA92/CCrS4ECcQr1kXNNY',
              authentication: 'A6iWq]M}Z3bHtnn{kyBP'
            },
            body: inputData,
          },
        );
        const responseData = await response.json();
        console.log(
          'responseData------------------------------------------------->',
          responseData,
        );
      }
    } catch (err) {
      console.log('Error while updating device id ', err);
    }
  };


  //=-=-=-=-=-=-=-=-=-=-=- notification =-=-=-=-=-=-=-=-=-=-=-
  const generateToken = async () => {
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ip = (await ipRes.json()).ip;

      const fcmToken = await getToken(messaging);
      if (fcmToken) {
        console.log('📱 FCM Token:', fcmToken);
        console.log('🌐 Public IP:', ip);
        await updateTokenAndIP(ip, fcmToken);
      }
    } catch (err) {
      console.error('❌ Token/IP generation error:', err);
    }
  };

  const refreshToken = async () => {
    try {
      await deleteToken(messaging);
      console.log('🔁 Token deleted');
      return generateToken();
    } catch (err) {
      console.error('❌ Token delete error:', err);
    }
  };

  const displayNotification = async (remoteMessage) => {
    // const channelId = await notifee.createChannel({
    //     id: 'default',
    //     name: 'Default Channel',
    //     importance: AndroidImportance.HIGH,
    //     visibility: AndroidVisibility.PUBLIC,
    // });

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default',
      sound: 'custom_tone',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });


    await notifee.displayNotification({
      title: `<p style="color: #4caf50;"><b>${remoteMessage.notification?.title}</b></p>`,
      body: `<p style="color: #000000;"><i>${remoteMessage.notification?.body}</i></p>`,
      android: {
        channelId,
        smallIcon: '@drawable/ic_launcher_round',
        color: '#4caf50',
        pressAction: { id: 'default' },
        badgeIconType: AndroidBadgeIconType.SMALL,
        actions: [
          { title: '<b>Dance</b> 💃', pressAction: { id: 'dance' } },
          { title: '<b>Cry</b> 😢', pressAction: { id: 'cry' } },
        ],
      },
    });
  };

  useEffect(() => {
    const setup = async () => {

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('🚫 Notification permission denied.');
            return;
          }
          console.log('🔓 Android Notification permission granted.');
        } catch (err) {
          console.error('❌ Permission error:', err);
          return;
        }
      }


      const permissionStatus = await requestPermission(messaging);
      const enabled =
        permissionStatus === 1 || permissionStatus === 2;

      if (enabled) {
        console.log('🔓 Notification permission granted.');
        await refreshToken();
      }

      // Foreground notification
      const unsubscribeOnMessage = onMessage(messaging, async (remoteMessage) => {
        console.log('📩 Foreground Message:', remoteMessage);
        await displayNotification(remoteMessage);
      });

      // Token refresh
      const unsubscribeTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
        console.log('🔁 Token refreshed:', newToken);
        await generateToken();
      });

      // Background handler (this must also be placed in index.js)
      setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('📩 Background Message:', remoteMessage);
        await displayNotification(remoteMessage);
      });

      // App opened from background
      onNotificationOpenedApp(async (remoteMessage) => {
        console.log('📲 Opened from background:', remoteMessage);
        await displayNotification(remoteMessage);
      });

      // App opened from quit state
      const initialMessage = await getInitialNotification(messaging);
      if (initialMessage) {
        console.log('📲 Opened from quit state:', initialMessage);
        await displayNotification(initialMessage);
      }

      return () => {
        unsubscribeOnMessage();
        unsubscribeTokenRefresh();
      };
    };

    setup();
  }, []);





  return (
    <>

      <View style={styles.container}>
        <StatusBar
          translucent={Platform.OS === 'android'}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {/* <View style={styles.header}>
          <View style={{ flexDirection: 'row', marginTop: hp(0) }}>
            <View style={styles.logoview}>
              <Image
                source={require('../../assets/images/Login/avatto_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.textview}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userText}>{profileName}</Text>
              <View style={{ flexDirection: 'row' }}>
                {membership == '' || membership == null ? (
                  <></>
                ) : (
                  <Image
                    source={require('../../assets/images/Profile/crown.png')}
                    style={styles.crownimg}
                    resizeMode="cover"
                  />
                )}

                <Text style={styles.premiumText}>
                  {membership === 'PINCODE PARTNER COMMISSION'
                    ? 'PINCODE PARTNER'
                    : membership === 'DISTRICT PARTNER COMMISSION'
                    ? 'DISTRICT PARTNER'
                    : membership === 'CHANNEL PARTNER COMMISSION'
                    ? 'CHANNEL PARTNER'
                    : !membership
                    ? 'FREE USER'
                    : membership}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('MyNotifications')} style={{ position: 'absolute', top: 28, right: hp(-12) }}>
              <Entypo name="bell" size={hp(3.8)} color="#ffd207" />
            </TouchableOpacity>
          </View>
         
        </View> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.carouselsection}>

            <View style={[styles.header, { top: statusBarHeight + hp(1.5) }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={styles.logoview}>
                  <Image
                    source={require('../../assets/images/Login/avatto_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={{color:'#000', fontSize:18, fontWeight:'600'}}>Welcome to Avatto        </Text>

                {/* <View style={styles.textview}>
                  <Text style={styles.userText}>{profileName}</Text>
                  <View style={{ flexDirection: 'row', }}>
                    {membership == '' || membership == null ? (
                      <></>
                    ) : (
                      <Image
                        source={require('../../assets/images/Profile/crown.png')}
                        style={styles.crownimg}
                        resizeMode="cover"
                      />
                    )}

                    <Text style={styles.premiumText}>
                      {membership === 'PINCODE PARTNER COMMISSION'
                        ? 'PINCODE PARTNER'
                        : membership === 'DISTRICT PARTNER COMMISSION'
                          ? 'DISTRICT PARTNER'
                          : membership === 'CHANNEL PARTNER COMMISSION'
                            ? 'CHANNEL PARTNER'
                            : !membership
                              ? 'FREE USER'
                              : membership}
                    </Text>
                  </View>
                </View> */}
               
                <TouchableOpacity onPress={() => navigation.navigate('MyNotifications')} style={{ height: hp(7), width: hp(6), justifyContent: 'center', alignItems: 'center', backgroundColor: '#A6222C', borderRadius: 10, position: 'absolute', top: -8, right: -82 }}>
                  <Entypo name="bell" size={hp(3)} color="#fcd913" />
                </TouchableOpacity>
              </View>

            </View>
            {loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp(12),
                }}
              >
                <ActivityIndicator size="small" color="#A6222C" />
              </View>
            ) : bannerImg.length > 0 ? (
              <Swiper
                style={styles.wrapper}
                autoplay
                autoplayTimeout={3}
                loop
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                paginationStyle={styles.pagination}
              >
                {bannerImg.map((item, index) => (
                  <View key={index} style={styles.slide}>
                    <Image
                      source={{ uri: item.banner_img }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </Swiper>
            ) : null}
          </View>

<View style={{flexDirection:'row', alignItems:'center', marginTop:hp(2), width:wp(95), alignSelf:'center',  backgroundColor:'#A6222C', padding:10, borderRadius:hp(5),}}>
  <Image source={{uri: profileImage}} style={{height:hp(6), width: hp(6), borderRadius: hp(3), borderWidth:1, borderColor:'#fcb713'}}/>
  <View style={{marginLeft: wp(3)}}>
    <Text style={{color:'#fff', fontWeight:'bold', fontSize: hp(2)}}>{profileName}</Text>
       <Text style={[styles.premiumText,{color:'#fff',}]}>
                      {membership === 'PINCODE PARTNER COMMISSION'
                        ? 'PINCODE PARTNER'
                        : membership === 'DISTRICT PARTNER COMMISSION'
                          ? 'DISTRICT PARTNER'
                          : membership === 'CHANNEL PARTNER COMMISSION'
                            ? 'CHANNEL PARTNER'
                            : !membership
                              ? 'FREE USER'
                              : membership}
                    </Text>
    </View>
</View>

          <View style={styles.txtcontainer}>
            <View
              style={{ width: wp(95), alignSelf: 'center', overflow: 'hidden' }}
            >
              <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false} // prevent user scroll
              >
                <Text numberOfLines={1} style={{ fontSize: 15 }}>
                  {`         ${msgData}               `}{' '}
                </Text>
              </ScrollView>
            </View>
          </View>

          {/* <View style={styles.walletcontainer}>
            <TouchableOpacity
              onPress={() => setCashbackmodal(true)}
              style={styles.walletView}
            >
              <Text style={styles.wlletText}>{cashback_wallet}</Text>
              <Text style={styles.wlletName}>CashBack Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setWidrawcashbackmodal(true)}
              style={styles.walletView}
            >
              <Text style={styles.wlletText}>{earning_wallet}</Text>
              <Text style={styles.wlletName}>Earning Wallet</Text>
            </TouchableOpacity>

            <View style={styles.walletView}>
              <Text style={styles.wlletText}>{purchase_wallet}</Text>
              <Text style={styles.wlletName}>Purchase Wallet</Text>
            </View>
          </View> */}

          {/* <TouchableOpacity
            style={{
              width: wp(60),
              height: hp(5),
              borderColor: '#DAA520',
              borderWidth: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: hp(2),
              alignSelf: 'center',
              marginRight: wp(3),
              borderRadius: hp(1),
              backgroundColor: '#A6222C',
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: hp(1.8),
                color: '#fff',
                textAlign: 'center',
                marginTop: hp(1),
                fontWeight: 'bold',
                marginLeft: wp(0),
              }}
            >
              Voucher Wallet : {voucher_wallet}
            </Text>
          </TouchableOpacity> */}

          <View style={styles.grid}>
            {data.map((item, index) => {
              const randomGradient =
                gradientColors[index % gradientColors.length];
              return (
                // <LinearGradient
                //   key={item.id}
                //   colors={randomGradient}
                //   style={styles.storeCard}
                // >
                //   <TouchableOpacity
                //     onPress={() => handleNavigation(item.screen)}
                //     style={{
                //       flex: 1,
                //       alignItems: 'center',
                //       justifyContent: 'space-between',
                //     }}
                //   >
                //     <Image source={item.image} style={styles.storeImage} />
                //     <Text style={styles.storeTitle}>{item.name}</Text>
                //     <View style={styles.exploreButton}>
                //       <Text style={styles.exploreText}>Explore</Text>
                //     </View>
                //   </TouchableOpacity>
                // </LinearGradient>

              
              
                <TouchableOpacity   onPress={() => handleNavigation(item.screen)} style={styles.storeCard}>
                  <Text style={{fontSize:18, fontWeight:'600', marginTop:5 }}>{item.name}</Text>
                  <Image source={item.image} style={styles.storeImage}/>
                  <View style={{padding:8, backgroundColor:'#A6222C', position:'absolute', bottom:0,left:0, borderBottomLeftRadius:10, width:wp(32), justifyContent:'center', alignItems:'center', borderTopRightRadius:20}}>
                    <Text style={{color:'#EECD45', fontSize:16}}>Explore</Text>
                    </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ width: wp(100), height: hp(15) }}></View>
        </ScrollView>

         <TouchableOpacity onPress={()=>navigation.navigate('BillUploadScreen')} style={{padding:13, width:wp(45), justifyContent:'center', alignItems:'center', backgroundColor:'#3FB876', borderRadius:hp(10), flexDirection:'row', alignSelf:'center', position:'absolute', bottom:130}}>
            <Feather name="file-text" color="#fff" size={22} />
            <Text style={{color:'#fff', fontWeight:'600', fontSize:15, marginLeft:10}}>Upload Bill</Text>
          </TouchableOpacity>

        {/* //==================================================== Modal for App Update ============================================================ */}
        <Modal
          animationType="fade"
          transparent
          visible={AppUpdate}
          onRequestClose={() => {
            setAppUpdate(true);
          }}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                height: hp(48),
                backgroundColor: '#fff',
                opacity: 1,
                width: wp(90),
                borderRadius: hp(2),
                marginTop: hp(25),
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
              }}
            >
              <Lottie
                resizeMode="contain"
                source={require('../../assets/json/appUpdate.json')}
                style={{ width: hp(30), height: hp(20) }}
                autoPlay
                loop
              />
              <Text
                style={{
                  width: wp(80),
                  textAlign: 'center',
                  fontSize: hp(1.8),
                  marginTop: hp(2),
                }}
              >
                To enjoy the best experience, update our app.
              </Text>
              <TouchableOpacity
                onPress={() => handleButtonClick()}
                style={{
                  backgroundColor: '#A6222C',
                  paddingHorizontal: hp(2),
                  borderRadius: hp(1),
                  marginTop: hp(3),
                  paddingVertical: hp(1),
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: hp(1.8),
                    fontWeight: 'bold',
                  }}
                >
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ====================================================== Modal for Profile page =========================================================================================================================================================================== */}
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
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <View
                style={{
                  height: hp(50),
                  width: wp(100),
                  borderTopLeftRadius: hp(5),
                  borderTopRightRadius: hp(5),
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
                    backgroundColor: '#4aaa5c',
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
                <View
                  style={{
                    width: wp(50),
                    height: hp(8),
                    backgroundColor: '#98fb9888',
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
                  keyboardType="ascii-capable"
                  maxLength={6}
                  value={cash}
                  onChangeText={value => setCash(value)}
                />

                {/* <TouchableOpacity onPress={() => { CashBack_EearningWallet_Tranfer(); setCashbackmodal(false) }} style={{ width: wp(60), height: hp(6), backgroundColor: '#A6222C', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: hp(3), borderRadius: hp(5) }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#fff' }}>Transfer to Earning Wallet</Text>
                                    <Text style={{ fontSize: hp(1.5), color: '#fff' }}>(Minimum amount : 300)</Text>
                                </TouchableOpacity>


                                <TouchableOpacity onPress={() => { CashBack_PurchaseWallet_Tranfer(); setCashbackmodal(false) }} style={{ width: wp(60), height: hp(6), backgroundColor: '#A6222C', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: hp(3), borderRadius: hp(5) }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#fff' }}>Transfer to Purchase Wallet</Text>
                                    <Text style={{ fontSize: hp(1.5), color: '#fff' }}>(Minimum amount : 100)</Text>
                                </TouchableOpacity> */}

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
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <View
                style={{
                  height: hp(50),
                  width: wp(100),
                  borderTopLeftRadius: hp(5),
                  borderTopRightRadius: hp(5),
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
                    backgroundColor: '#4aaa5c',
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
                  Earning Wallet Transfer
                </Text>
                <View
                  style={{
                    width: wp(50),
                    height: hp(8),
                    backgroundColor: '#98fb9888',
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
                  keyboardType="ascii-capable"
                  maxLength={6}
                  value={cash}
                  onChangeText={value => setCash(value)}
                />

                {/* <TouchableOpacity onPress={() => { Eearning_PurchaseWallet_Tranfer(); setWidrawcashbackmodal(false) }} style={{ width: wp(60), height: hp(6), backgroundColor: '#A6222C', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: hp(3), borderRadius: hp(5) }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#fff' }}>Transfer to Purchase Wallet</Text>
                                  
                                </TouchableOpacity>


                                <TouchableOpacity onPress={() => { Widhdraw_Tranfer(); setWidrawcashbackmodal(false) }} style={{ width: wp(60), height: hp(6), backgroundColor: '#A6222C', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: hp(3), borderRadius: hp(5) }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#fff' }}>Withdraw</Text>
                              
                                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => {
                    setConfirmAction('transferPurchase');
                    setConfirmVisible(true);
                  }}
                  style={{
                    width: wp(60),
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
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setConfirmAction('withdraw');
                    setConfirmVisible(true);
                  }}
                  style={{
                    width: wp(60),
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
                </TouchableOpacity>
              </View>
            </Pressable>
          </>
        </Modal>

        {/* <Modal
                    animationType="slide"
                    transparent
                    visible={cashbackmodal}
                    onRequestClose={() => {
                        setCashbackmodal(false);
                    }}>
                    <>
                        <Pressable
                            onPress={() => setCashbackmodal(false)}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            }}>
                            <View
                                style={{
                                    height: hp(50),
                                    width: wp(100),
                                    borderTopLeftRadius: hp(5),
                                    borderTopRightRadius: hp(5),
                                    marginTop: 'auto',
                                    backgroundColor: '#fff',
                                    padding: hp(0),
                                }}
                                // Prevent clicks from propagating to the Pressable outside
                                onStartShouldSetResponder={(e) => e.stopPropagation()}>

                                <View
                                    style={{
                                        width: wp(10),
                                        height: hp(0.75),
                                        backgroundColor: '#4aaa5c',
                                        alignSelf: 'center',
                                        marginTop: hp(1),
                                        borderRadius: hp(0.35),
                                    }}></View>

                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: hp(2),
                                        color: "#000",
                                        marginTop: hp(2),
                                        fontWeight: 'bold',
                                    }}>
                                    CashBack Wallet Transfer
                                </Text>

                                <View
                                    style={{
                                        width: wp(50),
                                        height: hp(8),
                                        backgroundColor: '#98fb9888',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginTop: hp(3),
                                        borderRadius: hp(2),
                                    }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }}>Available</Text>
                                    <Text style={{ fontSize: hp(2.5), fontWeight: 'bold', marginTop: hp(1) }}>₹ {cashback_wallet}</Text>
                                </View>

                                <TextInput
                                    mode="outlined"
                                    outlineColor="black"
                                    placeholder="Enter the Transfer Amount"
                                    placeholderTextColor="gray"
                                    style={{
                                        width: wp(60),
                                        backgroundColor: "#fff",
                                        fontSize: hp(2),
                                        marginTop: hp(2),
                                        alignSelf: "center",
                                    }}
                                    contentStyle={{ color: "#000", height: hp(5.5) }}
                                    outlineStyle={{
                                        backgroundColor: "transparent",
                                        borderColor: "#A6222C",
                                        borderRadius: 5,
                                        borderWidth: 1.2,
                                    }}
                                    activeOutlineColor="#A6222C"
                                    cursorColor="#A6222C"
                                    keyboardType="ascii-capable"
                                    maxLength={6}
                                    value={cash}
                                    onChangeText={(value) => setCash(value)}
                                />

                                <TouchableOpacity onPress={() => CashBack_EearningWallet_Tranfer()}
                                    style={{
                                        width: wp(60),
                                        height: hp(6),
                                        backgroundColor: '#A6222C',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginTop: hp(3),
                                        borderRadius: hp(5),
                                    }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#fff' }}>Transfer to Earning Wallet</Text>
                                    <Text style={{ fontSize: hp(1.5), color: '#fff' }}>(Minimum amount : 300)</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => CashBack_PurchaseWallet_Tranfer()}
                                    style={{
                                        width: wp(60),
                                        height: hp(6),
                                        backgroundColor: '#A6222C',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginTop: hp(3),
                                        borderRadius: hp(5),
                                    }}>
                                    <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#fff' }}>Transfer to Purchase Wallet</Text>
                                    <Text style={{ fontSize: hp(1.5), color: '#fff' }}>(Minimum amount : 100)</Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </>
                </Modal> */}

        <Modal
          animationType="slide"
          transparent
          visible={voucherwalletmodal}
          onRequestClose={() => {
            setVoucherwalletmodal(!voucherwalletmodal);
          }}
        >
          <>
            <Pressable
              onPress={() => setVoucherwalletmodal(false)}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <View
                style={{
                  height: hp(50),
                  width: wp(100),
                  borderTopLeftRadius: hp(5),
                  borderTopRightRadius: hp(5),
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
                    backgroundColor: '#4aaa5c',
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
                  Voucher Wallet Transfer
                </Text>
                <View
                  style={{
                    width: wp(50),
                    height: hp(8),
                    backgroundColor: '#98fb9888',
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
                    ₹ {voucher_wallet}
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
                  keyboardType="ascii-capable"
                  maxLength={6}
                  value={cash}
                  onChangeText={value => setCash(value)}
                />

                <TouchableOpacity
                  onPress={() => {
                    Voucherto_PurchaseWallet_Tranfer();
                    setVoucherwalletmodal(false);
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
                    (Minimum amount : 300)
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </>
        </Modal>

        {/* =====================================================Success modal=============================================== */}
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
                  setSuccessModal(false),
                    navigation.push('Footer', { screen: 'HomeScreen' });
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

        {/* <Modal
                        animationType="slide"
                        transparent
                        visible={EW_PWmodal}
                        onRequestClose={() => {
                            setEW_PWmodal(!EW_PWmodal);
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                                <Lottie resizeMode='contain' source={require('../../assets/json/success.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
                                <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text>
                                <TouchableOpacity onPress={() => { setEW_PWmodal(false); navigation.replace('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        animationType="slide"
                        transparent
                        visible={CW_EWmodal}
                        onRequestClose={() => {
                            setCW_EWmodal(!CW_EWmodal);
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                                <Lottie resizeMode='contain' source={require('../../assets/json/success.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
                                <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text>
                                <TouchableOpacity onPress={() => { setCW_EWmodal(false); navigation.replace('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent
                        visible={Widrawmodal}
                        onRequestClose={() => {
                            setWidrawmodal(!Widrawmodal);
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                                <Lottie resizeMode='contain' source={require('../../assets/json/success.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
                                <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text>
                                <TouchableOpacity onPress={() => { setWidrawmodal(false); navigation.replace('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal> */}

        <Modal
          animationType="slide"
          transparent
          visible={userNotFoundModal}
          onRequestClose={() => {
            setUserNotFoundModal(!userNotFoundModal);
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
                resizeMode="contain"
                source={require('../../assets/json/topupfailure.json')}
                style={{ width: hp(18), height: hp(18) }}
                autoPlay
                loop
              />
              {/* <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text> */}
              <Text
                style={{
                  fontSize: hp(2),
                  color: '#000',
                  marginTop: hp(1),
                  textAlign: 'center',
                  fontWeight: 'bold',
                  flexWrap: 'wrap',
                }}
              >
                User not found.{'\n'}Please go to login or register.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setUserNotFoundModal(false);
                  navigation.navigate('LoginScreen');
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

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <FontAwesome
                name="exclamation-circle"
                size={50}
                color="#A6222C"
              />
              <Text style={styles.modalTitle}>Hold On!</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to exit?
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>No</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                                style={[styles.modalButton, styles.homeButton]}
                                onPress={handleGoHome}
                            >
                                <Text style={styles.homeText}>Go Home</Text>
                            </TouchableOpacity> */}
                <TouchableOpacity
                  style={[styles.modalButton, styles.exitButton]}
                  onPress={handleExit}
                >
                  <Text style={styles.exitText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={confirmModal} animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                width: wp(80),
                backgroundColor: '#C1E4D3',
                borderRadius: hp(2),
                padding: hp(3),
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: '700',
                  color: '#0A6F45',
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
                    backgroundColor: '#A5C9B8',
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
                    backgroundColor: '#0A6F45',
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

        <Modal transparent visible={confirmVisible} animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                width: wp(80),
                backgroundColor: '#C1E4D3',
                borderRadius: hp(2),
                padding: hp(3),
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: '700',
                  color: '#0A6F45',
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
                    backgroundColor: '#A5C9B8',
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
                    backgroundColor: '#0A6F45',
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //     flex: 1,
  //     backgroundColor: '#f8f8f8',
  //     paddingHorizontal: wp(1),
  // },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 10,
    width: wp(75),
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 10,
    elevation: 3
  },
  logoview: {
    width: hp(5),
    height: hp(5),
    backgroundColor: '#fff',
    borderRadius: hp(10),
    marginTop: hp(0),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginRight: hp(3)

  },
  textview: {
    width: wp(50),
    padding: 0,
    marginLeft: wp(0),
  },
  welcomeText: {
    fontSize: hp(1.5),
    color: '#000',
  },
  userText: {
    fontSize: hp(2),
    color: '#000',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginVertical: hp(1),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    width: wp(90),
    height: hp(6),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    letterSpacing: wp(0.2),
    marginLeft: wp(2),
  },
  iconButton: {
    padding: hp(0.5),
    marginLeft: wp(0.5),
    marginHorizontal: wp(1),
  },
  iconButton1: {
    padding: hp(0.5),
    marginLeft: wp(0.5),
    marginRight: wp(2),
    borderLeftWidth: 2,
    borderColor: 'gray',
    paddingHorizontal: wp(2),
  },
  bellimg: {
    height: hp(2.5),
    width: hp(2.5),
    tintColor: '#fcb713',
  },
  logo: {
    height: hp(5),
    width: hp(5),
  },
  // textContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     height: hp(4),
  //     marginTop: hp(2),
  // },
  walletcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width: wp(96),
    height: hp(10),
    marginTop: hp(2),
    // backgroundColor: "#fff",
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 8,
  },
  walletView: {
    width: wp(28),
    height: hp(10),
    backgroundColor: '#fff',
    // borderColor:'#fff',
    // borderWidth:1,
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A6222C',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  wlletText: {
    fontSize: hp(2.5),
    color: '#000',
  },
  wlletName: {
    fontSize: hp(1.5),
    color: '#000',
  },
  text: {
    fontSize: hp(1.8),
    fontWeight: '400',
    color: '#454545',
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#A6222C',
    marginLeft: wp(4),
    marginRight: wp(4),
  },
  carouselsection: {
    width: '100%',
    height: hp(60),
  },
  wrapper: {
    height: hp(60)
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp(100),
    height: '100%',
    borderBottomLeftRadius: hp(3),
    borderBottomRightRadius: hp(3),
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
  // grid: {
  //     flexDirection: 'row',
  //     flexWrap: 'wrap',
  //     // justifyContent: 'space-between',
  // },
  // storeCard: {
  //     backgroundColor: '#fff',
  //     width: wp(42),
  //     height: hp(22),
  //     marginLeft: wp(5),
  //     borderRadius: hp(2),
  //     marginTop: hp(2),
  //     alignItems: 'center',
  //     justifyContent: 'space-between',
  //     shadowColor: '#000',
  //     shadowOpacity: 0.1,
  //     shadowRadius: 5,
  //     elevation: 8,
  // },
  // storeImage: {
  //     width: hp(11),
  //     height: hp(11),
  //     marginTop: hp(1),
  // },
  // storeTitle: {
  //     fontSize: hp(1.8),
  //     fontWeight: 'bold',
  //     textAlign: 'center',
  // },
  // exploreButton: {
  //     backgroundColor: '#A6222C',
  //     borderBottomRightRadius: hp(2),
  //     borderBottomLeftRadius: hp(2),
  //     width: wp(42),
  //     height: hp(4),
  //     justifyContent: 'center',
  //     alignItems: 'center',
  // },
  // exploreText: {
  //     color: '#fff',
  //     fontWeight: 'bold',
  //     fontSize: hp(1.6),
  //     textAlign: 'center',
  // },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: hp(2),
  },
  storeCard: {
    width: wp(42),
    height: hp(24),
    marginLeft: wp(5),
    borderRadius: hp(2),
    marginTop: hp(2),
    overflow: 'hidden', // ensure rounded corners work
    elevation: 8,
    padding:10,
    backgroundColor:'#fff'
  },
  storeImage: {
    width: hp(15),
    height: hp(11),
    marginTop: hp(1),
    alignSelf:'center',
    resizeMode:'contain'
  },
  storeTitle: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  exploreButton: {
    backgroundColor: '#00000033',
    width: wp(42),
    height: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: hp(2),
    borderBottomLeftRadius: hp(2),
  },
  exploreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp(1.6),
    textAlign: 'center',
  },
  crownimg: {
    width: hp(2),
    height: hp(2),
    marginLeft: wp(-2),
  },
  premiumText: {
    fontSize: hp(1.5),
    color: '#000',
    fontWeight: 'bold',
    // marginLeft: wp(2)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6222C',
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#f8b400',
  },
  homeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#A6222C',
  },
  exitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  txtcontainer: {
    height: hp(8),
    overflow: 'hidden',
    backgroundColor: '#A6222C33',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  msgtext: {
    fontSize: hp(1.8),
    fontWeight: '600'
    // whiteSpace: 'nowrap', // works only in web, ignored in mobile
  },
});

export default HomeScreen;
