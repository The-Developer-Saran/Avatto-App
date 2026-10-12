import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Dimensions, Modal, TouchableWithoutFeedback, Keyboard, Image, TouchableHighlight, Linking, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Authentication_Key } from "../../key/Key";
import Svg, { Image as SvgImage, Defs } from 'react-native-svg';
import { useRoute } from "@react-navigation/native";
import { encryptPiDataNew } from "../Encryption/encryption";
import Lottie from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { ActivityIndicator } from "react-native-paper";
import SwiperFlatList from 'react-native-swiper-flatlist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { PlayInstallReferrer } from 'react-native-play-install-referrer';
import { BaseUrl } from "../BaseUrl/BaseUrl";
import DeviceInfo from "react-native-device-info";



const RegisterScreen = ({ navigation }) => {

  const route = useRoute();
  const phoneNo = route.params?.phoneNo;
  const logotpType = route.params?.otptype;
  const logotpId = route.params?.otpid;


  const [reffcode, setreff] = useState(null);
  const [referral, setReferral] = useState("");


  const [RememberToken, setRememberToken] = useState('');
  useEffect(() => {
    remTkn();
  }, [])

  const remTkn = () => {
    DeviceInfo.getUniqueId().then((rememberToken) => {
      setRememberToken(rememberToken);
      RemTkncheck(rememberToken)
    });
  }

  // lo("reffcode",reffcode)
  console.log("reffcode", reffcode);
  console.log("phoneNo", phoneNo);
  console.log("logotpType", logotpType);
  console.log("logotpId", logotpId);
  console.log("RememberToken", RememberToken);





  function _onPress_getInstallReferrerInfo() {
    if (Platform.OS === 'android') {
      PlayInstallReferrer.getInstallReferrerInfo((installReferrerInfo, error) => {
        if (!error) {
          var msg = installReferrerInfo.installReferrer;
          setreff(msg)
          setReferral(msg.length >= 15 ? '' : msg)
          //console.log("Install referrer = " + installReferrerInfo.installReferrer);
          msg += "\n\nReferrer click timestamp seconds = " + installReferrerInfo.referrerClickTimestampSeconds;
          //console.log("Referrer click timestamp seconds = " + installReferrerInfo.referrerClickTimestampSeconds);
          msg += "\n\nInstall begin timestamp seconds = " + installReferrerInfo.installBeginTimestampSeconds;
          //console.log("Install begin timestamp seconds = " + installReferrerInfo.installBeginTimestampSeconds);
          msg += "\n\nReferrer click timestamp server seconds = " + installReferrerInfo.referrerClickTimestampServerSeconds;
          //console.log("Referrer click timestamp server seconds = " + installReferrerInfo.referrerClickTimestampServerSeconds);
          msg += "\n\nInstall begin timestamp seconds = " + installReferrerInfo.installBeginTimestampServerSeconds;
          // console.log("Install begin timestamp seconds = " + installReferrerInfo.installBeginTimestampServerSeconds);
          msg += "\n\nInstall version = " + installReferrerInfo.installVersion;
          //console.log("Install version = " + installReferrerInfo.installVersion);
          msg += "\n\nGoogle Play instant = " + installReferrerInfo.googlePlayInstant;
          //console.log("Google Play instant = " + installReferrerInfo.googlePlayInstant);
          //   ToastAndroid.show(msg, ToastAndroid.LONG);
          // alert(msg);
        } else {
          var msg = "Failed to get install referrer info!";
          setreff(msg)
          setReferral(msg.length >= 15 ? '' : msg)
          //console.log("Failed to get install referrer info!");
          msg += "\n\nResponse code: " + error.responseCode;
          //console.log("Response code: " + error.responseCode);
          msg += "\n\nMessage: " + error.message;
          //console.log("Message: " + error.message);
          //   ToastAndroid.show(msg, ToastAndroid.LONG);
          //alert(msg);
        }
      });
    }
  }


  useEffect(() => {
    _onPress_getInstallReferrerInfo();
  }, [])





  const dialCall = () => {
    let num = 4623560085;
    let phoneNumberString = `tel:${num}`;
    Linking.openURL(phoneNumberString);
  }

  const { width, height } = Dimensions.get('window');
  const viewHeight = height * 0.45;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [m_pin, setM_pin] = useState("");
  const [verifyotp, setVerifyOtp] = useState("");
  // const [referral, setReferral] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [otpType, setOtpType] = useState('');
  const [Pincode, setPincode] = useState("");


  console.log("City", City);
  console.log("State", State);



  const [selectState, setSelectState] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateid, setStateid] = useState(null);

  // console.log("selectState",selectState);
  // console.log("selectedState",selectedState);
  // console.log("stateid",stateid);


  const [selectDistrict, setSelectDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtid, setDistrictid] = useState(null);

  const [ReferralName, setReferralName] = useState(null);
  const [State, setState] = useState("");
  const [City, setCity] = useState("");

  console.log("ReferralName", ReferralName);
  console.log("Pincode", Pincode);

  // console.log("selectDistrict",selectDistrict);
  // console.log("selectedDistrict",selectedDistrict);
  // console.log("districtid",districtid);


  const handleSelectState = (selectedItem, index) => {
    setSelectedState(selectedItem);
    setStateid(selectedItem.id)
  };

  const handleSelectDistrict = (selectedItem, index) => {
    setSelectedDistrict(selectedItem);
    setDistrictid(selectedItem.id)
  };


  useEffect(() => {
    State_Detsils_Get();
    // Loacation_Details_Get();
  }, []);

  useEffect(() => {
    if (stateid) {
      District_Detsils_Get();
    } else {
      setSelectDistrict([]);
    }
  }, [stateid]);

  const State_Detsils_Get = async () => {
    try {
      const response = await fetch(`${BaseUrl}stateGet?type=M&req_type=1&res_type=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authentication': EncKey
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Response.Success === '1') {
        setSelectState(data.Response.Result || []);
      } else {
        console.log(data?.Response.Message);
        setSelectState([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSelectState([]);
    }
  };

  const District_Detsils_Get = async () => {
    try {
      const response = await fetch(`${BaseUrl}cityGet?stateId=${stateid}&type=M&req_type=1&res_type=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authentication': EncKey
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Response.Success === '1') {
        setSelectDistrict(data.Response.Result || []);
      } else {
        console.log(data?.Response.Message);
        setSelectDistrict([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSelectDistrict([]);
    }
  };

  useEffect(() => {
    if (referral.length === 10) {
      User_Detsils_Get();
    }
  }, [referral]);
  const User_Detsils_Get = async () => {
    try {
      const response = await fetch(`${BaseUrl}userGet_filter?unique_id=${referral}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authentication': EncKey
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Response.Success === '1') {
        setReferralName(data.Response.Result[0].name || "Referral Not Available");
      } else {
        console.log(data?.Response.Message);
        setReferralName(null);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setReferralName(null);
    }
  };


  useEffect(() => {
    if (Pincode.length === 6) {
      Loacation_Details_Get();
    }
  }, [Pincode]);

  const Loacation_Details_Get = async () => {
    try {
      const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${Pincode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authentication': EncKey
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Response.Success === '1') {
        setCity(data.Response.Result[0].city_name);
        setState(data.Response.Result[0].state_name);
      } else {
        console.log(data?.Response.Message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };




  // const [otp, setOtp] = useState(["", "", "", ""]);
  // const inputs = useRef([]);

  // const enterOtp = otp.join('');

  // const handleChange = (text, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = text.length > 0 ? text[text.length - 1] : "";

  //   setOtp(newOtp);

  //   if (text && index < otp.length - 1) {
  //     inputs.current[index + 1].focus();
  //   }
  // };

  // const handleKeyPress = (e, index) => {
  //   if (e.nativeEvent.key === "Backspace") {
  //     if (otp.every((value) => value === "")) {
  //       clearAllFields();
  //     } else if (index > 0 && otp[index] === "") {
  //       inputs.current[index - 1].focus();
  //     }
  //   }
  // };

  // const clearAllFields = () => {
  //   setOtp(["", "", "", ""]);
  //   inputs.current.forEach((input) => input && input.clear());
  //   inputs.current[0].focus();
  // };


  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const enterOtp = otp.join("");

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);

    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }


    if (text && index === otp.length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp.every((value) => value === "")) {
        clearAllFields();
      } else if (index > 0 && otp[index] === "") {
        inputs.current[index - 1].focus();
      }
    }
  };

  const clearAllFields = () => {
    setOtp(["", "", "", ""]);
    inputs.current.forEach((input) => {
      if (input) input.clear();
    });
    inputs.current[0]?.focus();
  };

  const EncKey = encryptPiDataNew(Authentication_Key)

  var login_data = new FormData();


  login_data.append("req_type", 1);
  login_data.append("phone_num", phoneNo);


  const Login = async () => {



    if (phoneNo == null || phoneNo.length < 10) {
      alert('Enter Valid Mobile Number');
    }
    else {
      const response = await fetch(`${BaseUrl}Login_Otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'authentication': EncKey
        },
        body: login_data
      });
      response.json()
        .then(responseData => {
          if (responseData?.Response.Success == 1) {
            setOtpId(responseData?.Response.Result.otp_id)
            setOtpType(responseData?.Response.Result.type)
            // Login_Otp_Screen()
            // setCountdown(30)
            // alert(responseData?.Response.Message);
            Toast.show({
              type: "success",
              text1: "Success",
              text2: responseData?.Response.Message,
            });


          }
          else {
            // alert(responseData?.Response.Message);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: responseData?.Response.Message,
            });
            console.log(responseData?.Response.Message);
          }
        })
        .catch(error => {
          console.error('Error parsing JSON:', error);
          alert('No Server Response');
        });
    }
  }




  const validate = () => {
    if (name == null || name == "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: 'Please Enter the Name',
      });
    }
    // else if (email == null || email == "") {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: 'Please Enter the Email',
    //   });
    // }

    // else if (selectedState == null || selectedState == "") {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: 'Please Select the State',
    //   });
    // }

    // else if (selectedDistrict == null || selectedDistrict == "") {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: 'Please Select District',
    //   });
    // }

    else if (Pincode == null || Pincode == "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: 'Enter Valid Pincode',
      });
    }
    else if (phoneNo == null || phoneNo.length < 10) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: 'Enter Valid Mobile Number',
      });
    }

    else if (referral == null || referral == "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: 'Enter Valid Referral Number',
      });

    }

    else if (m_pin == null || m_pin == "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: 'Enter Valid Referral Number',
      });
      
    }
    else {
      // Login();
      // setOtpModal(true)
      Verify_Otp();
    }
  };



  const Verify_Otp = async () => {


    var otpVerify_data = new FormData();


    // otpVerify_data.append("req_type", 1);
    otpVerify_data.append("phone_num", phoneNo);
    otpVerify_data.append("otp", verifyotp);
    otpVerify_data.append("type", logotpType);
    otpVerify_data.append("name", name);
    // otpVerify_data.append("email", email);
    otpVerify_data.append("pincode", Pincode);
    otpVerify_data.append("deviceType", 1);
    otpVerify_data.append("referredBy", referral);
    otpVerify_data.append("mpin", m_pin);
    otpVerify_data.append("token", RememberToken);
    // otpVerify_data.append("state", selectState);
    // otpVerify_data.append("city", selectDistrict);
    console.log("otpVerify_data");
    console.log(otpVerify_data);

    const response = await fetch(`${BaseUrl}mpin_register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'authentication': EncKey
      },
      body: otpVerify_data
    });
    response.json()
      .then(responseData => {
        if (responseData?.Response.Success == 1) {
          // alert(responseData?.Response.Message);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: responseData?.Response.Message,
          });
          let userId = responseData.Response.Result.user_id;

          try {
            AsyncStorage.setItem('user', userId.toString());
          } catch (error) {
            console.log('Async error')
            console.log(error)
          }
          // navigation.navigate('Footer')
          navigation.navigate('WelcomeFirst')

        }
        else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: responseData?.Response.Message,
          });
          // alert(responseData?.Response.Message);
          console.log(responseData?.Response.Message);
        }
      })
      // .finally(() => {
      //     setLoader(false)
      // })
      .catch(error => {
        console.error('Error parsing JSON:', error);
        alert('No Server Response');
      });

  }

  // useEffect(() => {
  //   setCountdown(30)
  // }, [])

  const resendOTP = async () => {
    setCountdown(30);
    Login();

  }

  const [visibility, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const [countdown, setCountdown] = useState('');


  console.log("countdown", countdown);
  console.log("enterOtp", enterOtp);
  const timer = () => {
    setCountdown(30)
  }


  useEffect(() => {
    //const timer=()=>{

    const interval = setInterval(() => {
      setCountdown(countdown - 1);

    }, 1000);

    if (countdown <= 0) {
      clearInterval(interval);
      toggleVisibility();
    }
    return () => clearInterval(interval);

    //}
  }, [countdown]);


  // const Login_Otp_Screen = (type) => {
  //   setOtpModal(true)
  // }


  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Banner =-=-=-=--==-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=

  const [isBannerLoaded, setisBannerLoaded] = useState(true);
  let newImage = [];
  const [bannerData, setBannerData] = useState(null);

  const getBanner = useCallback(() => {
    fetch(`${BaseUrl}appScreenGet?screen_type=MS&type=M&req_type=1&res_type=1`, {
      method: 'GET',
      headers: { "authentication": EncKey }
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData?.Response.Success === '1') {
          //  let result = decryptPiDataNew(responseData.Response.Result);
          setBannerData(responseData.Response.Result);
        } else {
          console.log(responseData?.Response.Message);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setisBannerLoaded(false);
      });
  }, []);

  useEffect(() => {
    getBanner()
  }, [getBanner])

  let Banner = useMemo(() => bannerData, [bannerData]);
  Banner?.map(e => {
    newImage.push(e.image)
  })


  const Banners = () => {
    return (
      <View>
        {
          !isBannerLoaded ?
            <View style={{ height: hp(45), width: responsiveWidth(102) }}>
              <SwiperFlatList
                autoplay
                autoplayDelay={5}
                autoplayLoop
                showPagination
                paginationDefaultColor={"gray"}
                paginationActiveColor={'white'}
                paginationStyle
                index={0}
                data={newImage}
                pagingEnabled
                horizontal
                paginationStyleItem={{ marginTop: hp(-5), height: hp(.8), width: hp(.8) }}
                renderItem={({ item, index }) => {
                  return (
                    <Image source={{ uri: item }} style={{ width: responsiveWidth(102), height: hp(45), resizeMode: 'cover' }} />
                  )
                }}
              />
            </View>
            :
            <View style={{ height: hp(55), width: responsiveWidth(102), justifyContent: 'center', alignItems: 'center' }}>
              {/* <SkeletonPlaceholder borderRadius={2} backgroundColor='#000' highlightColor='#bdbcbc' >
               <SkeletonPlaceholder.Item alignItems='center' height={'auto'}>
                 <SkeletonPlaceholder.Item width={wp(90)} height={hp(45)} borderRadius={hp(2)} />
               </SkeletonPlaceholder.Item>
             </SkeletonPlaceholder> */}
              <ActivityIndicator size="large" color="#fcb713" />
            </View>
        }
      </View>
    )
  }

  return (
    <>
      <StatusBar  backgroundColor='#0000' />
      <View style={styles.container}>



        <ScrollView>

          <View style={styles.illustrationContainer}>

            {/* <Svg height={viewHeight} width={width}>
                            <Defs>
                            </Defs>
                            <SvgImage
                                x="0"
                                y="0"
                                width={width}
                                height={viewHeight}
                                preserveAspectRatio="xMidYMid slice"
                                href={require('../../assets/images/Login/avatto_logoin_image.jpg')}
                                clipPath="url(#clip)"
                            />
                        </Svg> */}

            {/* <Banners /> */}
            <Image
              source={require('../../assets/images/Login/avatto_logo.png')}
              style={styles.titleimg}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <View style={styles.line} />
            <Text style={styles.text}>Register</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.inputContainer}>


            <View style={styles.mobileContainer}>
              <Text style={styles.codeText}>+91</Text>
              <TextInput
                style={styles.mobileInput}
                placeholder="Mobile Number"
                placeholderTextColor="gray"
                keyboardType="number-pad"
                editable={false}
                value={mobile ? mobile : phoneNo}
                // onChangeText={setMobile}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setMobile(numericText);

                }}
              />
            </View>

            <TextInput
              style={styles.input0}
              placeholder="Name"
              placeholderTextColor="gray"
              value={name}
              // onChangeText={setName}
              onChangeText={(text) => {
                const filteredText = text.replace(/[^a-zA-Z .]/g, '');
                setName(filteredText);
              }}
            />

            {/* <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            /> */}


            {/* <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor="gray"
              value={Pincode}
              keyboardType="number-pad"
              // onChangeText={setReferral}
              maxLength={6}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setPincode(numericText);
                if (numericText.length === 10) {
                  Keyboard.dismiss();
                }
              }}
            /> */}

            {/* 
            <SelectDropdown
              defaultValue={selectedState?.title}
              data={selectState}
              onSelect={(selectedItem, index) => handleSelectState(selectState[index], index)}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={[styles.dropdownButtonStyle,]}>
                    <Text style={[styles.dropdownButtonTxtStyle, { color: selectedItem ? "#000" : "gray" }]}>
                      {(selectedItem && selectedItem.title) || "Select State"}
                    </Text>
                    <MaterialCommunityIcons name={isOpened ? 'chevron-down' : 'chevron-right'} style={styles.dropdownButtonArrowStyle} />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#A6222C', borderRadius: hp(0.5) }), borderWidth: 0.19, borderColor: '#bdbcbc' }}>
                    <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? "#fff" : "#000", textAlign: 'center' }]}>{item.title}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            /> */}


            {/* 
            <SelectDropdown
              defaultValue={selectedDistrict?.city_name}
              data={selectDistrict}
              onSelect={(selectedItem, index) => handleSelectDistrict(selectDistrict[index], index)}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={[styles.dropdownButtonStyle,]}>
                    <Text style={[styles.dropdownButtonTxtStyle, { color: selectedItem ? "#000" : "gray" }]}>
                      {(selectedItem && selectedItem.city_name) || "Select District"}
                    </Text>
                    <MaterialCommunityIcons name={isOpened ? 'chevron-down' : 'chevron-right'} style={styles.dropdownButtonArrowStyle} />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#A6222C', borderRadius: hp(0.5) }), borderWidth: 0.19, borderColor: '#bdbcbc' }}>
                    <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? "#fff" : "#000", textAlign: 'center' }]}>{item.city_name}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            /> */}


            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor="gray"
              value={Pincode}
              keyboardType="number-pad"
              // onChangeText={setReferral}
              maxLength={6}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setPincode(numericText);

                if (numericText.length === 6) {
                  Keyboard.dismiss();
                }
              }}
            />
            {Pincode.length === 6 && (
              City && State ? (
                <View style={{ flexDirection: 'row', width: wp(100), height: hp(4) }}>
                  <Text style={styles.referralNameText}>{City},</Text>
                  <Text style={styles.referralNameText}>{State}</Text>
                </View>
              ) : (
                <Text style={styles.referralNameText}>City and State Not Available</Text>
              )
            )}


            {/* <View style={styles.mobileContainer}>
              <Text style={styles.codeText}>+91</Text>
              <TextInput
                style={styles.mobileInput}
                placeholder="Mobile Number"
                placeholderTextColor="gray"
                keyboardType="number-pad"
                editable={false}
                value={mobile ? mobile : phoneNo}
                // onChangeText={setMobile}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setMobile(numericText);

                }}
              />
            </View> */}

            <TextInput
              style={styles.input}
              placeholder="Set M-Pin"
              placeholderTextColor="gray"
              value={m_pin}
              keyboardType="number-pad"
              // onChangeText={setReferral}
              maxLength={4}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setM_pin(numericText);

                if (numericText.length === 4) {
                  Keyboard.dismiss();
                }
              }}
            />


            <TextInput
              style={styles.input}
              placeholder="Referral ID"
              placeholderTextColor="gray"
              value={referral}
              keyboardType="number-pad"
              // onChangeText={setReferral}
              maxLength={10}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setReferral(numericText);
                if (numericText.length === 10) {
                  Keyboard.dismiss();
                }
              }}
            />
            {referral.length === 10 && (
              ReferralName ? (
                <Text style={styles.referralNameText}>{ReferralName}</Text>
              ) : (
                <Text style={styles.referralNameText}>Referral Not Available</Text>
              )
            )}


            <TextInput
              style={styles.inputotp}
              placeholder="Enter OTP"
              placeholderTextColor="gray"
              value={verifyotp}
              keyboardType="number-pad"
              // onChangeText={setReferral}
              maxLength={4}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setVerifyOtp(numericText);

                if (numericText.length === 4) {
                  Keyboard.dismiss();
                }
              }}
            />





            <TouchableOpacity onPress={() => { validate() }} style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Submit</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footer}>By Continuing, you agree to your{' '}</Text>
              <View style={{ width: wp(100), alignItems: 'center', alignSelf: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.link}>Terms of Service</Text>
                <Text style={styles.link}>Privacy Policy</Text>
                <Text style={styles.link}>Content Policy</Text>

              </View>

            </View>
            <View style={{ width: wp(100), height: hp(5) }}></View>
          </View>
        </ScrollView>

        {/* ====================================================== Modal for otp page =========================================================================================================================================================================== */}
        <Modal
          animationType="slide"
          transparent
          visible={otpModal}
          onRequestClose={() => {
            setOtpModal(!otpModal);
          }}>
          <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ height: hp(70), width: wp(100), borderTopLeftRadius: hp(5), borderTopRightRadius: hp(5), marginTop: 'auto', backgroundColor: '#fff', padding: hp(0) }}>
                <TouchableOpacity onPress={() => setOtpModal(false)} style={{ width: wp(25), padding: hp(3), flexDirection: 'row' }}>
                  <Image
                    source={require('../../assets/images/Login/remove.png')}
                    style={styles.closeimg}
                    resizeMode="contain"
                  />
                </TouchableOpacity>


                <View style={{ justifyContent: 'center', alignItems: 'center', width: wp(100), marginTop: hp(-2) }}>
                  <Text style={styles.modalheader}>Enter OTP</Text>
                  <Lottie resizeMode='contain' source={require('../../assets/json/otp.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop />
                </View>
                <Text style={styles.instruction}>
                  Please enter the 4-digit code sent to +91 {phoneNo}
                </Text>

                <View style={styles.otpContainer}>
                  {otp.map((value, index) => (
                    <TextInput
                      key={index}
                      style={styles.otpInput}
                      keyboardType="numeric"
                      maxLength={1}
                      value={value}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      ref={(ref) => (inputs.current[index] = ref)}
                    />
                  ))}
                </View>
                {
                  countdown >= 0 ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: hp(0), marginTop: hp(2) }}>

                      <Text style={{ fontSize: hp(3), color: countdown >= 10 ? "#0097fa" : countdown == 0 ? "#0097fa" : "red" }}>{countdown}</Text>

                    </View>
                    :
                    <></>
                }


                <View style={{ alignSelf: "center", flexDirection: 'row' }}>

                  {
                    countdown == 0 ?
                      <>
                        <Text style={styles.resendText}>Didn't receive the OTP?</Text>
                        <TouchableOpacity style={{}} onPress={() => resendOTP()} ><Text style={[styles.resendLink]}>RESEND OTP</Text></TouchableOpacity>
                      </>
                      :
                      <></>
                  }
                </View>

                <TouchableOpacity onPress={() => Verify_Otp()} style={styles.submitButton}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>

                <Text style={styles.helpText}>
                  Facing any difficulty in verifying mobile number?{'\n'}
                  Please call our customer service{' '}
                  <Text onPress={() => dialCall()} style={styles.customerNumber}>+91 4623560085</Text>
                </Text>
              </View>


              {/* </View> */}
            </TouchableWithoutFeedback>
          </>
        </Modal>
        <Toast />
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    justifyContent: 'center',
    //  alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
    marginTop: hp(2)
  },
  input: {
    width: wp(90),
    height: hp(6),
    borderWidth: 1,
    borderColor: "#CCC",
    padding: hp(1.5),
    borderRadius: hp(1),
    alignSelf: 'center',
    marginTop: hp(2),
    fontSize: hp(1.8),
    // fontFamily: "DMSans-Medium",
  },
  input0: {
    width: wp(90),
    height: hp(6),
    borderWidth: 1,
    borderColor: "#CCC",
    padding: hp(1.5),
    borderRadius: hp(1),
    alignSelf: 'center',
    marginTop: hp(2),
    fontSize: hp(1.8),
    // fontFamily: "DMSans-Medium",
  },

  // inputotp: {
  //   width: wp(50),
  //   height: hp(7),
  //   borderWidth: 1,
  //   borderColor: "#CCC",
  //   padding: hp(1.5),
  //   borderRadius: hp(1),
  //   alignSelf: 'center',
  //   marginTop: hp(3),
  //   fontSize: hp(2.5),
  //   textAlign:'center'
  //   // fontFamily: "DMSans-Medium",
  // },
  inputotp: {
    width: wp(50),
    height: hp(7),
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 0,
    borderRadius: hp(1),
    alignSelf: 'center',
    marginTop: hp(3),
    fontSize: hp(2.5),
    textAlign: 'center',
    letterSpacing: wp(1), // Adds spacing between OTP digits
    includeFontPadding: false,
  },

  mobileContainer: {
    height: hp(6),
    width: wp(90),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: hp(1),
    marginTop: hp(2),

  },
  codeText: {
    paddingHorizontal: wp(4),
    color: "#000",
    borderRightWidth: 1,
    borderColor: "#CCC",
    fontSize: hp(1.8),
    // fontFamily: "DMSans-Medium",
  },
  mobileInput: {
    flex: 1,
    padding: hp(1),
    fontSize: hp(1.8),
    // fontFamily: "DMSans-Medium",
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    marginTop: hp(2),

  },
  text: {
    fontSize: hp(1.8),
    fontWeight: '400',
    color: '#000',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'red',
    marginLeft: wp(6),
    marginRight: wp(6),
  },

  continueButton: {
    backgroundColor: '#A6222C',
    width: wp(50),
    height: hp(5),
    marginTop: hp(5),
    borderRadius: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  continueButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp(2),
    // fontFamily: "DMSans-Medium",
  },

  illustrationContainer: {
    // width: wp(100),
    // height: hp(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(5)
    // backgroundColor:'red'
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
    // backgroundColor:'red'

  },
  footer: {
    textAlign: 'center',
    fontSize: hp(1.5),
    color: 'gray',
    width: wp(80),
    fontFamily: "DMSans-Medium",
  },
  link: {
    color: '#A6222C',
    textDecorationLine: 'underline',
    fontFamily: "DMSans-Medium",
    fontSize: hp(1.5),
    marginLeft: wp(2)
  },
  modalheader: {
    fontSize: hp(2),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  instruction: {
    fontSize: hp(1.8),
    textAlign: 'center',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: hp(2)

  },
  otpInput: {
    width: hp(5),
    height: hp(5),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: hp(1),
    textAlign: 'center',
    fontSize: hp(2),
    backgroundColor: '#F9F9F9',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: hp(1.5),
    color: '#000',
    marginTop: hp(1)
  },
  resendLink: {
    fontSize: hp(1.5),
    color: '#0097fa',
    fontWeight: 'bold',
    marginLeft: wp(2),
    marginTop: hp(1)
  },
  timerText: {
    fontSize: hp(1.5),
    color: '#888',
  },
  submitButton: {
    backgroundColor: '#A6222C',
    width: wp(50),
    height: hp(5),
    marginTop: hp(4),
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  submitText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
  helpText: {
    textAlign: 'center',
    fontSize: hp(1.5),
    color: '#000',
    marginTop: hp(3)
  },
  customerNumber: {
    color: '#A6222C',
    fontWeight: 'bold',
  },
  closeimg: {
    height: hp(3),
    width: hp(3),
  },
  dropdown: {
    alignSelf: "center",
    marginTop: hp(3),
    backgroundColor: '#ffe2cf'
  },
  dropdownButtonStyle: {
    width: wp(90),
    height: hp(6),
    borderRadius: hp(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    padding: hp(1),
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: hp(0),
    marginTop: hp(2),
    alignSelf: 'center',
    // fontFamily: "DMSans-Medium",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: hp(1.8),
    // color: 'gray',
    padding: hp(0.5)
    // fontFamily: "DMSans-Medium",
  },
  dropdownButtonArrowStyle: {
    fontSize: hp(3.5),
    color: "gray"
  },
  dropdownButtonIconStyle: {
    fontSize: hp(3.5),
    marginRight: wp(1),
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: hp(0.5),
    marginTop: hp(-5)
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1),
    borderBottomWidth: 0.20,
    borderBottomColor: 'grey'
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: hp(1.9),
    fontWeight: '500',
    color: '#151E26',
    // fontFamily: "DMSans-Medium",
  },
  dropdownItemIconStyle: {
    fontSize: hp(2),
    marginRight: wp(1),
  },
  referralNameText: {
    marginTop: hp(1),
    fontSize: hp(1.8),
    color: '#A6222C',
    marginLeft: wp(2),
    fontWeight: "bold"
  },
  titleimg: {
    height: hp(14),
    width: wp(70),
    marginTop: hp(2)
  },

});

export default RegisterScreen;
