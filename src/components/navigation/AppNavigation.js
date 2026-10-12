import { PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import NetInfo from '@react-native-community/netinfo';
import LoginScreen from '../screens/Login/LoginScreen';
import LoadingScreen from '../screens/Login/LoadingScreen'
import RegisterScreen from '../screens/Register/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import AvaxaaCartItems from '../screens/AvaxaaStore/AvaxaaCartItems';
import AvaxaaItemget from '../screens/AvaxaaStore/AvaxaaItemget';
import NearByStores from '../screens/StoreDeals/NearByStores';
import StoreDetailes from '../screens/StoreDeals/StoreDetailes';
import PremiumItemget from '../screens/PremiumDeals/PremiumItemget';
import PremiumCartItems from '../screens/PremiumDeals/PremiumCartItems';
import ConditionCheck from '../screens/CondionalCheck/CondtionalCheck';
import CommingSoon from '../screens/CommingSoon';
import Footer from '../screens/Footer/Footer';
import WelcomeFirst from '../screens/Welcome/WelcomeFirst';
import WelcomeSecond from '../screens/Welcome/WelcomeSecond';
import WelcomeThird from '../screens/Welcome/WelcomeThird';
import WelcomeFourth from '../screens/Welcome/WelcomeFourth';
import AvaxaaProfile from '../screens/Profile/AvaxaaProfile';
import Razorpay from '../screens/Razorpay/Razorpay';
import NearByTravels from '../screens/TravelDesk/NearByTravels';
import TravelDesk from '../screens/TravelDesk/TravelDesk';
import EducationHub from '../screens/EducationHub';
import PurchaseWalletHistory from '../screens/PurchaseWalletHistory/PurchaseWalletHistory';
import TransactionHistory from '../screens/Transaction/TransactionHistory';
import Eshopping from '../screens/Eshopping/Eshopping';
import AvaxaaOrderHistory from '../screens/OrderHistory/AvaxaaOrderHistory';
import ReferralList from '../screens/Referral/ReferralList';
import MobileNumberScreen from '../screens/KwikPayModule/MobileNumberScreen';
import SelectPlan from '../screens/KwikPayModule/SelectPlan';
import ConfirmPage from '../screens/KwikPayModule/ConfirmPage';
import Payment from '../screens/KwikPayModule/Payment';
import AddBusinessScreen from '../screens/AddBusiness/addBusinessScreen';
import NewAddBusiness from '../screens/AddBusiness/NewAddBusiness';

import SalesReportList from '../screens/AddBusiness/salesReportList';
import WithdrawalHistoryList from '../screens/AddBusiness/withdrawalHistoryList';
import BusinessDashboard from '../screens/AddBusiness/businessDashboard';
import EarningCommission from '../screens/Earning/earningComission';
import CommissionList from '../screens/Earning/comminssionList';
import ServiceScreen from '../screens/ServiceScreen/SeviceScreen';
import DTHScreen from '../screens/ServiceScreen/DTH/DTHScreen';
import DTHPayment from '../screens/ServiceScreen/DTH/DTHPayment';
import UtlityHistory from '../screens/ServiceScreen/UtilityHistory/UtlityHistory';
import AvatooOTPScreen from '../screens/PinChange/AvatooOTPScreen';
import NewUpdateBusiness from '../screens/AddBusiness/NewUpdateBusiness';
import Postpaid from '../screens/ServiceScreen/PostPaid/Postpaid';
import Fastag from '../screens/ServiceScreen/Fastag/Fastag';
import Electricity from '../screens/ServiceScreen/Electricity/Electricity';
import Water from '../screens/ServiceScreen/Water/Water';
import GasScreen from '../screens/ServiceScreen/GAS/GasScreen';
import Insurance from '../screens/ServiceScreen/Insurance/Insurance';
import Broadband from '../screens/ServiceScreen/Broadband/Broadband';
import Landline from '../screens/ServiceScreen/Landline/Landline';
import ShopCategory from '../screens/AddBusiness/ShopCategory';
import OthersAddBusiness from '../screens/AddBusiness/OthersAddBusiness';
import { useState } from 'react';
import NoInternet from '../screens/NoIntenet/NoInternet';
import ReferralTab from '../screens/Referral/ReferralTab';
import RealEstateListScreen from '../screens/RealEstate/realEstateListScreen';
import PropertyDetailsScreen from '../screens/RealEstate/propertyDetailsScreen';
import ServiceScreenBill from '../screens/ServiceScreen/SeviceScreenBill';
import AddTravelPartner from '../screens/AddBusiness/AddTravelPartner';
import OthersAddTravelPartner from '../screens/AddBusiness/OthersAddTravelPartner';
import StoresListByCategory from '../screens/BrandedStore/StoresListByCategory';
import BrandDetailsScreen from '../screens/BrandedStore/brandDetailsScreen';
import ReferralTabView from '../screens/ReferralTab/ReferralTabView';
import BillingHistory from '../screens/ServiceScreen/UtilityHistory/BillingHistory';
import StoreDealsHome from '../screens/StoreDeals/StoreDealsHome';
import InsuranceForm from '../screens/InsuranceForm/InsuranceForm';
import EducationForm from '../screens/InsuranceForm/InsuranceForm';
import ForgotPin from '../screens/Otp/ForgotPin';
import VoucherPayment from '../screens/BrandedStore/VoucherPayment';
import MyVouchers from '../screens/BrandedStore/MyVouchers';
import TravelListByCategory from '../screens/TicketBooking/TravelListByCategory';
import TravelDetailsScreen from '../screens/TicketBooking/TravelDetailsScreen';
import VoucherBookingPayment from '../screens/TicketBooking/VoucherBookingPayment';
import BookingVouchers from '../screens/TicketBooking/BookingVouchers';
import PartnerDetails from '../screens/PartnerDeatails/PartnerDetails';
import MyActivity from '../screens/Notification/myActivity';
import notifee, { AndroidImportance, AndroidVisibility, AndroidBadgeIconType } from '@notifee/react-native';
import { getMessaging, onMessage, onTokenRefresh, getToken, deleteToken, requestPermission, setBackgroundMessageHandler, getInitialNotification, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import MyNotifications from '../screens/Notification/myNotifications';
import MillionareClub from '../screens/MillionareClub/millonareClub';
import ProductList from '../screens/MillionareClub/productList';
import ProductDescription from '../screens/MillionareClub/productDescription';
import BillUploadScreen from '../screens/BillUpload/BillUpload';
import TeamView from '../screens/MillionareClub/teamView'
import GiftCardScreen from '../screens/GiftCard/GiftCardScreen';

const messaging = getMessaging(getApp());

const AppNavigation = () => {

    const Stack = createNativeStackNavigator();

    const [isConnected, setIsConnected] = useState(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            //   setConnectionType(state.type);
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const updateTokenAndIP = async (ip, fcmToken) => {
            const inputData = new FormData();
            inputData.append('userId', 1);
            inputData.append('deviceId', fcmToken);
            inputData.append('ipAddress', ip);

        try{
            const response  = await fetch(`https://avatto.info/admin_avatto/updateDeviceAndIPAddress`,{
                method:'POST',
                headers:{
                    authentication:'U2FsdGVkX1+GlwN//3zk31Sm9LK1WafujRfUtRVhbR/GA92/CCrS4ECcQr1kXNNY'
                },
                body:inputData
            })
            const responseData = await response.json();
            console.log(responseData)
        }
        catch(err){
            console.log('Error while updating device id ',err)
        }

    }

    // const generateToken = async () => {
    //     try {
    //         const ipRes = await fetch('https://api.ipify.org?format=json');
    //         const ip = (await ipRes.json()).ip;

    //         const fcmToken = await getToken(messaging);
    //         if (fcmToken) {
    //             console.log('📱 FCM Token:', fcmToken);
    //             console.log('🌐 Public IP:', ip);
    //              //await updateTokenAndIP(ip, fcmToken);
    //         }
    //     } catch (err) {
    //         console.error('❌ Token/IP generation error:', err);
    //     }
    // };

    // const refreshToken = async () => {
    //     try {
    //         await deleteToken(messaging);
    //         console.log('🔁 Token deleted');
    //         return generateToken();
    //     } catch (err) {
    //         console.error('❌ Token delete error:', err);
    //     }
    // };

    // const displayNotification = async (remoteMessage) => {
    //     // const channelId = await notifee.createChannel({
    //     //     id: 'default',
    //     //     name: 'Default Channel',
    //     //     importance: AndroidImportance.HIGH,
    //     //     visibility: AndroidVisibility.PUBLIC,
    //     // });

    //     const channelId = await notifee.createChannel({
    //         id: 'default',
    //         name: 'Default',
    //         sound: 'custom_tone',
    //         importance: AndroidImportance.HIGH,
    //         visibility: AndroidVisibility.PUBLIC,
    //     });


    //     await notifee.displayNotification({
    //         title: `<p style="color: #4caf50;"><b>${remoteMessage.notification?.title}</b></p>`,
    //         body: `<p style="color: #000000;"><i>${remoteMessage.notification?.body}</i></p>`,
    //         android: {
    //             channelId,
    //             smallIcon: '@drawable/ic_launcher_round',
    //             color: '#4caf50',
    //             pressAction: { id: 'default' },
    //             badgeIconType: AndroidBadgeIconType.SMALL,
    //             actions: [
    //                 { title: '<b>Dance</b> 💃', pressAction: { id: 'dance' } },
    //                 { title: '<b>Cry</b> 😢', pressAction: { id: 'cry' } },
    //             ],
    //         },
    //     });
    // };

    // useEffect(() => {
    //     const setup = async () => {

    //         if (Platform.OS === 'android' && Platform.Version >= 33) {
    //             try {
    //                 const result = await PermissionsAndroid.request(
    //                     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    //                 );
    //                 if (result !== PermissionsAndroid.RESULTS.GRANTED) {
    //                     console.warn('🚫 Notification permission denied.');
    //                     return;
    //                 }
    //                 console.log('🔓 Android Notification permission granted.');
    //             } catch (err) {
    //                 console.error('❌ Permission error:', err);
    //                 return;
    //             }
    //         }


    //         const permissionStatus = await requestPermission(messaging);
    //         const enabled =
    //             permissionStatus === 1 || permissionStatus === 2;

    //         if (enabled) {
    //             console.log('🔓 Notification permission granted.');
    //             await refreshToken();
    //         }

    //         // Foreground notification
    //         const unsubscribeOnMessage = onMessage(messaging, async (remoteMessage) => {
    //             console.log('📩 Foreground Message:', remoteMessage);
    //             await displayNotification(remoteMessage);
    //         });

    //         // Token refresh
    //         const unsubscribeTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
    //             console.log('🔁 Token refreshed:', newToken);
    //             await generateToken();
    //         });

    //         // Background handler (this must also be placed in index.js)
    //         setBackgroundMessageHandler(async (remoteMessage) => {
    //             console.log('📩 Background Message:', remoteMessage);
    //             await displayNotification(remoteMessage);
    //         });

    //         // App opened from background
    //         onNotificationOpenedApp(async (remoteMessage) => {
    //             console.log('📲 Opened from background:', remoteMessage);
    //             await displayNotification(remoteMessage);
    //         });

    //         // App opened from quit state
    //         const initialMessage = await getInitialNotification(messaging);
    //         if (initialMessage) {
    //             console.log('📲 Opened from quit state:', initialMessage);
    //             await displayNotification(initialMessage);
    //         }

    //         return () => {
    //             unsubscribeOnMessage();
    //             unsubscribeTokenRefresh();
    //         };
    //     };

    //     setup();
    // }, []);

    return (
        <>

            {
                isConnected ?

                    <NavigationContainer>
                        <Provider store={store}>
                            <Stack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                    gestureEnabled: true,
                                    gestureDirection: 'horizontal',
                                }}
                                initialRouteName="ConditionCheck" headerMode='float'>

                                <Stack.Screen name="ConditionCheck" component={ConditionCheck} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Footer" component={Footer} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="AvaxaaItemget" component={AvaxaaItemget} options={{ presentation: 'card', animation: 'slide_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="AvaxaaCartItems" component={AvaxaaCartItems} options={{ presentation: 'card', animation: 'slide_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                {/* <Stack.Screen name="NearByStores" component={NearByStores} options={{ presentation: 'card', animation: 'fade_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }}  /> */}
                                <Stack.Screen name="StoreDealsHome" component={StoreDealsHome} options={{ presentation: 'card', animation: 'fade_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="StoreDetailes" component={StoreDetailes} options={{ presentation: 'card', animation: 'fade_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="PremiumItemget" component={PremiumItemget} options={{ presentation: 'card', animation: 'slide_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="PremiumCartItems" component={PremiumCartItems} options={{ presentation: 'card', animation: 'slide_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="CommingSoon" component={CommingSoon} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="WelcomeFirst" component={WelcomeFirst} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="WelcomeSecond" component={WelcomeSecond} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="WelcomeThird" component={WelcomeThird} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="WelcomeFourth" component={WelcomeFourth} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="AvaxaaProfile" component={AvaxaaProfile} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Razorpay" component={Razorpay} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="NearByTravels" component={NearByTravels} options={{ presentation: 'card', animation: 'fade_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="TravelDesk" component={TravelDesk} options={{ presentation: 'card', animation: 'fade_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="EducationHub" component={EducationHub} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="PurchaseWalletHistory" component={PurchaseWalletHistory} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="TransactionHistory" component={TransactionHistory} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Eshopping" component={Eshopping} options={{ presentation: 'card', animation: 'slide_from_bottom', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="AvaxaaOrderHistory" component={AvaxaaOrderHistory} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="MobileNumberScreen" component={MobileNumberScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="SelectPlan" component={SelectPlan} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ConfirmPage" component={ConfirmPage} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Payment" component={Payment} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="NewAddBusiness" component={NewAddBusiness} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="NewUpdateBusiness" component={NewUpdateBusiness} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="BusinessDashboard" component={BusinessDashboard} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="SalesReportList" component={SalesReportList} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="WithdrawalHistoryList" component={WithdrawalHistoryList} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="EarningCommission" component={EarningCommission} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="CommissionList" component={CommissionList} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ServiceScreen" component={ServiceScreen} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="DTHScreen" component={DTHScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="DTHPayment" component={DTHPayment} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="UtlityHistory" component={UtlityHistory} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="AvatooOTPScreen" component={AvatooOTPScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Postpaid" component={Postpaid} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Fastag" component={Fastag} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Electricity" component={Electricity} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Water" component={Water} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="GasScreen" component={GasScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Insurance" component={Insurance} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Broadband" component={Broadband} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="Landline" component={Landline} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ShopCategory" component={ShopCategory} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="OthersAddBusiness" component={OthersAddBusiness} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="RealEstateListScreen" component={RealEstateListScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="PropertyDetailsScreen" component={PropertyDetailsScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ServiceScreenBill" component={ServiceScreenBill} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="AddTravelPartner" component={AddTravelPartner} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="OthersAddTravelPartner" component={OthersAddTravelPartner} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="StoresListByCategory" component={StoresListByCategory} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="BrandDetailsScreen" component={BrandDetailsScreen} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="ReferralTabView" component={ReferralTabView} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="BillingHistory" component={BillingHistory} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="EducationForm" component={EducationForm} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ForgotPin" component={ForgotPin} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="VoucherPayment" component={VoucherPayment} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="MyVouchers" component={MyVouchers} options={{ gestureEnabled: false }} />

                                <Stack.Screen name="TravelListByCategory" component={TravelListByCategory} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="TravelDetailsScreen" component={TravelDetailsScreen} options={{ presentation: 'card', animation: 'slide_from_right', gestureDirection: 'horizontal', headerShown: false, gestureEnabled: true }} />
                                <Stack.Screen name="VoucherBookingPayment" component={VoucherBookingPayment} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="BookingVouchers" component={BookingVouchers} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="PartnerDetails" component={PartnerDetails} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="MyActivity" component={MyActivity} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="MyNotifications" component={MyNotifications} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="MillionareClub" component={MillionareClub} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ProductList" component={ProductList} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="ProductDescription" component={ProductDescription} options={{ gestureEnabled: false }} />


                                <Stack.Screen name="BillUploadScreen" component={BillUploadScreen} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="TeamView" component={TeamView} options={{ gestureEnabled: false }} />
                                <Stack.Screen name="GiftCard" component={GiftCardScreen} options={{ gestureEnabled: false }} />





                                {/* <Stack.Screen name="StoreDealsHome" component={StoreDealsHome} options={{ gestureEnabled: false }} /> */}


                                {/* <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ gestureEnabled: false }} /> */}

                                {/* <Stack.Screen name="ReferralTab" component={ReferralTab} options={{ gestureEnabled: false }} /> */}
                                {/* <Stack.Screen name="MyReferralPage" component={MyReferralPage} options={{ gestureEnabled: false }} /> */}



                                {/* <Stack.Screen name="EducationForm" component={EducationForm} options={{ gestureEnabled: false }} /> */}

                                {/* <Stack.Screen name="ForgotPin" component={ForgotPin} options={{ gestureEnabled: false }} /> */}

                                {/* <Stack.Screen name="MyVouchers" component={MyVouchers} options={{ gestureEnabled: false }} /> */}

                            </Stack.Navigator>
                        </Provider>
                    </NavigationContainer> :


                    <NavigationContainer>
                        <Provider store={store}>
                            <Stack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                    gestureEnabled: true,
                                    gestureDirection: 'horizontal',
                                }}
                                initialRouteName="NoInternet" headerMode='float'>

                                <Stack.Screen name="NoInternet" component={NoInternet} options={{ gestureEnabled: false }} />




                            </Stack.Navigator>
                        </Provider>
                    </NavigationContainer>
            }
        </>
    )
}

export default AppNavigation

const styles = StyleSheet.create({})