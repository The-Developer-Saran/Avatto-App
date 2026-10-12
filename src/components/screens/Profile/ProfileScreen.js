import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TouchableWithoutFeedback, Pressable, ToastAndroid, Share, Keyboard, Linking, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Entypo from '@react-native-vector-icons/entypo';
import Feather from '@react-native-vector-icons/feather';
import AntDesign from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import SimpleLineIcons from '@react-native-vector-icons/ionicons';
import Lottie from 'lottie-react-native';

const ProfileScreen = ({ navigation }) => {


  const [profileEdit, setProfileEdit] = useState(false);
  const isFocused = useIsFocused();

  const EncKey = encryptPiDataNew(Authentication_Key)

  const [profileData, setProfileData] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState(null);
  const [photoType, setPhotoType] = useState(null);
  const [membership, setMembership] = useState("");
  const [referral_code, setReferral_code] = useState("");
  const [selectProfileModal, setSelectProfileModal] = useState(false);
  const [userNotFoundModal, setUserNotFoundModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [Uid, setUid] = useState(null);
  console.log("Uid", Uid);


  console.log("referral_code", referral_code);


  console.log("profileData", profileData);
  console.log("profileName", profileName);
  console.log("profileId", profileId);
  console.log("profileImage", profileImage);
  console.log("photo", photo);
  console.log("photoName", photoName);
  console.log("photo", photoType);



  useEffect(() => {
    if (isFocused) {
      User_Details_Get();
    }
  }, [isFocused]);

  const [position, setPosition] = useState(null)

  const User_Details_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
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
            }
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();
          console.log("data :::>>>", data.Response);

          if (data.Response.Success === '1') {
            setProfileData(data.Response.Result);
            setProfileName(data.Response.Result[0]?.name || ''); // Use optional chaining and fallback
            setProfileId(data.Response.Result[0]?.id || null);
            setProfileImage(data.Response.Result[0]?.profile_image || '');
            setMembership(data.Response.Result[0]?.memberships[0]?.membership_name || '');
            setReferral_code(data.Response.Result[0]?.mobile || '');
            setPosition(data.Response.Result[0]?.position[0]?.type || '')
          } else {
            console.log(data?.Response?.Message || 'Unknown error');
            setProfileData(null);
            setProfileId(null)

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



  console.log("walletData", walletData);
  console.log("cashback_wallet", cashback_wallet);
  console.log("earning_wallet", earning_wallet);
  console.log("purchase_wallet", purchase_wallet);


  useEffect(() => {
    if (isFocused) {
      User_Wallet_Get();
    }
  }, [isFocused]);

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

  const handlePhotoSelection = async (response) => {
    if (response.didCancel) {
      ToastAndroid.show('Image selection cancelled.', ToastAndroid.SHORT);
    } else if (response.errorCode) {
      ToastAndroid.show(`Error: ${response.errorMessage}`, ToastAndroid.SHORT);
    } else if (response.assets && response.assets.length > 0) {
      const image = response.assets[0];
      setPhoto(image.uri);
      setPhotoName(image.fileName);
      setPhotoType(image.type);
      await UpdateUserDetails(image.uri, image.fileName, image.type);
    }
  };

  const addPhotoFromLibrary = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, handlePhotoSelection,
      setProfileEdit(false)
    );
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, handlePhotoSelection,
      setProfileEdit(false)
    );
  };

  const UpdateUserDetails = async (uri, fileName, type) => {
    try {
      const userDetails = new FormData();
      userDetails.append('uId', profileId);
      userDetails.append('profile_img', {
        uri,
        name: fileName,
        type,
      });

      const response = await fetch(`${BaseUrl}profile_update`, {
        method: 'POST',
        body: userDetails,
        headers: { "authentication": EncKey }
      });

      const responseData = await response.json();
      if (responseData.Response.Success === '1') {
        // ToastAndroid.show(responseData.Response.message, ToastAndroid.LONG);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: responseData?.Response.Message,
        });
        setProfileImage(uri); // Update the profile image on success
      } else {
        // ToastAndroid.show(responseData.Response.message, ToastAndroid.LONG);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: responseData?.Response.Message,
        });
      }
    } catch (error) {
      console.error('Error updating profile details:', error.message);
    }
  };



  // const handleButtonPress = () => {
  //   Alert.alert(
  //     'Confirm',
  //     `Are you sure you want to Logout ?`,
  //     [
  //       {
  //         text: 'No',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         onPress: () => { User_Logout();LogOut()},
  //       },
  //     ],
  //     { cancelable: false }
  //   );

  // };
  // const LogOut = () => {
  //   AsyncStorage.removeItem('user')
  //   navigation.navigate('LoginScreen')
  // }

  const handleButtonPress = () => {
    setModalVisible(true);
  };

  const handleButtonPressDelete = () => {
    setModalVisibleDelete(true);
  };

  const LogOut = async () => {
    await AsyncStorage.removeItem("user");
    navigation.navigate("LoginScreen");
  };


  const User_Logout = async () => {
    const logout_data = new FormData();


    logout_data.append("uId", profileId);


    console.log(logout_data);

    try {
      const response = await fetch(`${BaseUrl}logOut`, {
        method: 'POST',
        headers: {
          authentication: EncKey,
        },
        body: logout_data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData?.Response?.Success === "1") {
        console.log(responseData?.Response?.Message);

      } else {
        ToastAndroid.showWithGravity(
          responseData?.Response?.Message || "An error occurred",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
        console.log(responseData?.Response?.Message || "Unknown error");
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


  // const handleButtonPressDelete = () => {
  //   Alert.alert(
  //     'Confirm',
  //     `Are you sure you want to Delete Account ?`,
  //     [
  //       {
  //         text: 'No',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         onPress: () => { handleButtonClick(); },
  //       },
  //     ],
  //     { cancelable: false }
  //   );

  // };


  const handleButtonClick = () => {
    Linking.openURL('https://avatto.info/account/aaAccountDelete/')
      .catch(err => console.error("Couldn't load page", err));
  };


  const shareOptions = {
    title: 'Share',
    message: `Download Avatto Deals App! \n\nAndroid \nhttps://play.google.com/store/apps/details?id=com.avatto&hl=en_IN&referrer=${referral_code}`,
    subject: 'Common'
  };
  const onSharePress = () => Share.share(shareOptions);

  // useEffect(() => {
  //     if (profileId === null || profileId === undefined || profileId === "") {
  //       setUserNotFoundModal(true);
  //     } else {
  //       setUserNotFoundModal(false);
  //     }
  //   }, [profileId]);
  useEffect(() => {
    setTimeout(() => {
      if (profileId === null || profileId === undefined) {
        setUserNotFoundModal(true);
      } else {
        setUserNotFoundModal(false);
      }
    }, 3000);

  }, [profileId]);

  return (

    <View style={styles.container}>
            <StatusBar backgroundColor={'#B2232D'} barStyle="light-content" />
      

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={{ width: wp(90), height: hp(0), alignItems: 'flex-end', marginTop: hp(6) }}>
          </View>
          <View style={styles.avatar}>

            {
              profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileimg}
                  resizeMode="cover"
                />
              ) : (
                // <Text style={styles.avatarText}>S</Text>
                <Text style={styles.avatarText}>{profileName?.charAt(0)}</Text>
              )
            }


          </View>
          <TouchableOpacity onPress={() => setProfileEdit(true)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(55), bottom: hp(17), justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/Profile/change.png')
              }
              style={styles.changeimg}
              resizeMode="cover"
            />
          </TouchableOpacity>


          <View style={styles.profile}>


            <Text style={styles.name}>{profileName}</Text>


            <View style={{ flexDirection: 'row' }}>
              {
                membership == "" || membership == null ?
                  <></> :
                  <Image
                    source={require('../../assets/images/Profile/crown.png')
                    }
                    style={styles.crownimg}
                    resizeMode="cover"
                  />
              }
              <Text style={styles.premiumText}>
                {
                  membership === "PINCODE PARTNER COMMISSION" ? "PINCODE PARTNER" :
                    membership === "DISTRICT PARTNER COMMISSION" ? "DISTRICT PARTNER" :
                      membership === "CHANNEL PARTNER COMMISSION" ? "CHANNEL PARTNER" :
                        !membership ? "FREE USER" :
                          membership
                }
              </Text>
            </View>
          </View>
        </View>
        {/* <TouchableOpacity style={{ width: wp(60), height: hp(5), borderColor: '#DAA520', borderWidth: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: hp(3), alignSelf: 'center', marginRight: wp(3), borderRadius: hp(1), backgroundColor: '#A6222C', elevation: 5, position: 'absolute', top: hp(28), }}>
          <Text style={{ fontSize: hp(1.8), color: '#fff', textAlign: 'center', marginTop: hp(1), fontWeight: 'bold', marginLeft: wp(0) }}>Voucher Wallet : {voucher_wallet}</Text>
        </TouchableOpacity> */}
        {/* <View style={styles.profileDetails}>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')} style={styles.walletView}>
            <Text style={styles.wlletText}>{cashback_wallet}</Text>
            <Text style={styles.wlletName}>CashBack Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('EarningCommission')} style={styles.walletView1}>
            <Text style={styles.wlletText}>{earning_wallet}</Text>
            <Text style={styles.wlletName}>Earning Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PurchaseWalletHistory')} style={styles.walletView2}>
            <Text style={styles.wlletText}>{purchase_wallet}</Text>
            <Text style={styles.wlletName}>Purchase Wallet</Text>
          </TouchableOpacity>
        </View> */}
        <ScrollView>
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => navigation.navigate('AvaxaaProfile')} style={styles.menuItem}>
              <FontAwesome name="user" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Profile</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MyActivity')} style={styles.menuItem}>
              <Feather name="activity" size={22} color="#A6222C" />
              <Text style={styles.menuText}>My Activity</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => navigation.navigate('MyNotifications')} style={styles.menuItem}>
              <Entypo  name="bell" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Notification</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="gray" />
            </TouchableOpacity> */}



            <TouchableOpacity onPress={() => navigation.navigate('AvatooOTPScreen')} style={styles.menuItem}>
              <MaterialIcons name="password" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Change M-Pin</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="edit" size={22} color="#A6222C" />
              <Text style={styles.menuText1}>Edit Profile</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="gray" />
            </TouchableOpacity> */}


            <TouchableOpacity onPress={() => navigation.navigate('ReferralTabView')} style={styles.menuItem}>
              <FontAwesome name="users" size={22} color="#A6222C" />
              <Text style={styles.menuText2}>Referral List</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>

            {
              position ? (
                <TouchableOpacity onPress={() => navigation.navigate('PartnerDetails')} style={styles.menuItem}>
                  <AntDesign name="idcard" size={22} color="#A6222C" />
                  <Text style={styles.menuText2}>My ID</Text>
                  <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
                </TouchableOpacity>
              ) : null
            }
            {/* <TouchableOpacity onPress={() => navigation.navigate('PartnerDetails')} style={styles.menuItem}>
              <Feather name="users" size={22} color="#A6222C" />
              <Text style={styles.menuText2}>Partner Details</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="gray" />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => navigation.navigate('AvaxaaOrderHistory')} style={styles.menuItem}>
              <MaterialCommunityIcons name="clipboard-list" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Order History</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('PurchaseWalletHistory')} style={styles.menuItem}>
              <MaterialCommunityIcons name="shopping" size={22} color="#A6222C" />
              <Text style={styles.menuText2}>  Purchase Wallet History</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')} style={styles.menuItem}>
              <MaterialCommunityIcons name="transfer" size={22} color="#A6222C" />
              <Text style={styles.menuText2}>Transaction History</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate('EarningCommission')} style={styles.menuItem}>
              <MaterialIcons name="savings" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Earning History</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>


            <TouchableOpacity onPress={onSharePress} style={styles.menuItem}>
              <Entypo name="link" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Referral Link</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate('ShopCategory')} style={styles.menuItem}>
              <MaterialCommunityIcons name="store-plus" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Store Management</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
            </TouchableOpacity>



            {/* <TouchableOpacity style={styles.menuItem}>
              <FontAwesome5 name="list-alt" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Store List</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="gray" />
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.menuItem}>
              <Entypo name="location-pin" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Pincode Partner</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="gray" />
            </TouchableOpacity> */}


            {/* <TouchableOpacity style={styles.menuItem}>
              <MaterialCommunityIcons name="package" size={22} color="#A6222C" />
              <Text style={styles.menuText}>Delivery Status</Text>
              <MaterialIcons name="arrow-forward-ios" size={22} color="gray" />
            </TouchableOpacity> */}

            <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
              <TouchableOpacity onPress={handleButtonPress} style={[styles.menuItem,{width:wp(43)}]}>
                <Entypo name="log-out" size={22} color="#A6222C" />
                <Text style={[styles.menuText,{fontSize:hp(1.5)}]}>Logout</Text>
                <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleButtonPressDelete} style={[styles.menuItem,{width:wp(43)}]}>
                <MaterialCommunityIcons name="delete" size={22} color="#A6222C" />
                <Text style={[styles.menuText,{fontSize:hp(1.5)}]}>Delete Account</Text>
                <MaterialIcons name="arrow-forward-ios" size={22} color="#A6222C" />
              </TouchableOpacity>
            </View>



          </View>
          <View style={{ width: wp(100), height: hp(20) }}></View>
        </ScrollView>

      </ScrollView>



      {/* ====================================================== Modal for Profile page =========================================================================================================================================================================== */}
      <Modal
        animationType="slide"
        transparent
        visible={profileEdit}
        onRequestClose={() => {
          setProfileEdit(!profileEdit);
        }}>
        <>
          <Pressable onPress={() => setProfileEdit(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <View style={{ height: hp(30), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }} onStartShouldSetResponder={(e) => e.stopPropagation()}>
              <View style={{ width: wp(10), height: hp(0.75), backgroundColor: '#4aaa5c', alignSelf: 'center', marginTop: hp(1), borderRadius: hp(0.35) }}>

              </View>

              <Text style={{ textAlign: 'center', fontSize: hp(2), color: "#000", marginTop: hp(2), fontWeight: 'bold' }}>Profile</Text>

              <View style={{ width: wp(95), height: hp(15), marginTop: hp(3), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: "center" }}>
                <View>
                  <TouchableOpacity onPress={() => setSelectProfileModal(true)} style={{ width: hp(8), height: hp(8), borderColor: "#4aaa5c", borderRadius: hp(4), borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/Profile/man.png')
                      }
                      style={styles.manimg}
                      resizeMode="cover"
                    />

                  </TouchableOpacity>

                  <Text style={{ textAlign: 'center', fontSize: hp(2), color: "#000", marginTop: hp(1), fontWeight: 'bold' }}>View</Text>
                </View>

                <View>
                  <TouchableOpacity onPress={addPhotoFromLibrary} style={{ width: hp(8), height: hp(8), borderColor: "#4aaa5c", borderRadius: hp(4), borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/Profile/image.png')
                      }
                      style={styles.manimg}
                      resizeMode="cover"
                    />

                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', fontSize: hp(2), color: "#000", marginTop: hp(1), fontWeight: 'bold' }}>Galary</Text>
                </View>



                <View>
                  <TouchableOpacity onPress={takePhoto} style={{ width: hp(8), height: hp(8), borderColor: "#4aaa5c", borderRadius: hp(4), borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/Profile/camera.png')
                      }
                      style={styles.manimg}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', fontSize: hp(2), color: "#000", marginTop: hp(1), fontWeight: 'bold' }}>Camera</Text>
                </View>

              </View>

            </View>

          </Pressable>
        </>
      </Modal>

      {/* ====================================================== Modal for Basic Details =========================================================================================================================================================================== */}
      <Modal
        animationType="fade"
        transparent
        visible={selectProfileModal}
        onRequestClose={() => {
          setSelectProfileModal(!selectProfileModal);
        }}>
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: hp(100), width: wp(100), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0), elevation: 5 }}>
              <View style={{ width: wp(100), borderTopLeftRadius: hp(10), borderTopRightRadius: hp(10), marginTop: hp(0), backgroundColor: '#fff' }}>
                <View style={{ backgroundColor: '#0000', width: wp(100), }}>
                  <TouchableOpacity onPress={() => setSelectProfileModal(false)} style={{ width: hp(4), height: hp(4), borderRadius: hp(2), elevation: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: wp(2), marginTop: hp(3) }}>
                    <SimpleLineIcons onPress={() => setSelectProfileModal(false)} name="close" size={24} color="gray" style={{}} />
                  </TouchableOpacity>

                </View>
                <View style={{ width: wp(100), height: hp(100), marginTop: hp(0), marginRight: wp(0), backgroundColor: '#0000', alignItems: 'center' }}>

                  <Image
                    source={{ uri: profileImage }}
                    style={styles.viewimg}
                    resizeMode="cover"
                  />
                </View>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </>
      </Modal>


      <Modal
        animationType="slide"
        transparent
        visible={userNotFoundModal}
        onRequestClose={() => {
          setUserNotFoundModal(!userNotFoundModal);
        }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
            <Lottie resizeMode='contain' source={require('../../assets/json/topupfailure.json')} style={{ width: hp(18), height: hp(18) }} autoPlay loop />
            {/* <Text style={{ fontSize: hp(2.3), fontWeight: '500', color: '#000' }}>Success!</Text> */}
            <Text style={{ fontSize: hp(2), color: '#000', marginTop: hp(1), textAlign: 'center', fontWeight: 'bold', flexWrap: 'wrap' }}>User not found.{'\n'}Please go to login or register.</Text>
            <TouchableOpacity onPress={() => { setUserNotFoundModal(false); navigation.navigate("LoginScreen") }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
              <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      {/* Custom Green-Themed Logout Alert Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <AntDesign name="exclamationcircle" size={50} color="#A6222C" />
            <Text style={styles.modalTitle}>Confirm</Text>
            <Text style={styles.modalMessage}>Are you sure you want to Logout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setModalVisible(false);
                  User_Logout();
                  LogOut();
                }}
              >
                <Text style={styles.confirmText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Green-Themed Logout Alert Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisibleDelete}
        onRequestClose={() => setModalVisibleDelete(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <AntDesign name="exclamation-circle" size={50} color="#A6222C" />
            <Text style={styles.modalTitle}>Confirm</Text>
            <Text style={styles.modalMessage}>Are you sure you want to Delete Account?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisibleDelete(false)}
              >
                <Text style={styles.cancelText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setModalVisibleDelete(false);
                  handleButtonClick();
                }}
              >
                <Text style={styles.confirmText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#A6222C',
    width: wp(100),
    height: hp(25),
    alignItems: 'center',
    borderBottomLeftRadius: hp(10),
    borderBottomRightRadius: hp(10)
  },
  avatar: {
    backgroundColor: '#fff',
    height: hp(12),
    width: hp(12),
    borderRadius: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginTop: hp(-1)

  },
  profileimg: {
    height: hp(11.5),
    width: hp(11.5),
    borderRadius: hp(5.75),
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 8,
  },
  friendsimg: {
    height: hp(4.2),
    width: hp(4.2),
    borderRadius: hp(2.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: hp(5),
    color: '#B71C1C',
    fontWeight: 'bold',

  },
  name: {
    fontSize: hp(2.2),
    color: '#FFF',
    fontWeight: 'bold',
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1)

  },
  profileDetails: {
    backgroundColor: '#FFF',
    borderRadius: hp(1),
    width: wp(92),
    height: hp(10),
    alignSelf: 'center',
    position: 'absolute',
    top: hp(37),
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#A6222C',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  premiumText: {
    fontSize: hp(1.9),
    color: '#E5993D',
    fontWeight: 'bold',
    // marginLeft: wp(2)
  },
  friedslist: {
    width: wp(38),
    height: hp(6),
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: hp(3)
  },
  subfriedslist: {
    width: wp(25),
    height: hp(6),
    flexDirection: 'row'
  },
  friedsText: {
    fontSize: hp(2.5),
    color: '#B71C1C',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  friendsview: {
    width: hp(4.5),
    height: hp(4.5),
    backgroundColor: '#fff',
    borderRadius: hp(2.25),
    marginRight: wp(-3.5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  subfriendsview: {
    width: hp(4.5),
    height: hp(4.5),
    backgroundColor: '#fff',
    borderRadius: hp(2.25),
    justifyContent: 'center',
    alignItems: 'center'
  },
  email: {
    fontSize: 14,
    color: '#000',
    marginVertical: 5,
  },
  phone: {
    fontSize: 14,
    color: '#000',
  },
  menu: {
    marginHorizontal: 20,
    marginTop: hp(5)
  },
  menuItem: {
    backgroundColor: '#FFF',
    height: hp(6),
    padding: hp(1),
    borderRadius: hp(1),
    marginBottom: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderWidth: 0,
    borderColor: '#dfdbdb',
    elevation: 2,

  },
  menuText: {
    fontSize: hp(1.8),
    color: '#000',
    flex: 1,
    marginLeft: wp(4)
  },
  menuText1: {
    fontSize: hp(1.8),
    color: '#000',
    flex: 1,
    marginLeft: wp(3)
  },
  menuText2: {
    fontSize: hp(1.8),
    color: '#000',
    flex: 1,
    marginLeft: wp(2)
  },
  walletView: {
    width: wp(30.66),
    height: hp(8),
    borderRightWidth: 1,
    borderColor: "#d3d3d3",
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletView1: {
    width: wp(30.66),
    height: hp(8),
    borderRightWidth: 1,
    borderColor: "#d3d3d3",
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletView2: {
    width: wp(30.66),
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  wlletText: {
    fontSize: hp(2.5),
    color: '#000',
  },
  wlletName: {
    fontSize: hp(1.5),
    color: '#000',
    marginTop: hp(1)
  },
  crownimg: {
    width: hp(2.5),
    height: hp(2.5)
  },

  editimg: {
    width: hp(2.5),
    height: hp(2.5),
    tintColor: '#fff'
  },

  manimg: {
    width: hp(5),
    height: hp(5),
    // tintColor: '#4aaa5c'
  },
  changeimg: {
    width: hp(2.5),
    height: hp(2.5),
    tintColor: '#4aaa5c',
    fontWeight: 'bold'
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(1)
  },
  dot: {
    width: hp(0.5),
    height: hp(0.5),
    borderRadius: hp(0.25),
    backgroundColor: '#fff',
    marginHorizontal: wp(0.5),
  },
  viewimg: {
    height: hp(80),
    width: wp(100),
    borderRadius: hp(0),
    marginTop: hp(3),
    // alignItems: 'center',
    // justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalBox: {
    width: wp(80),
    backgroundColor: "#fff",
    padding: hp(3),
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#A6222C",
    marginTop: hp(1),
  },
  modalMessage: {
    fontSize: hp(2),
    textAlign: "center",
    color: "#333",
    marginTop: hp(1),
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: hp(3),
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    width: "45%",
    paddingVertical: hp(1.5),
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#A6222C",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;


