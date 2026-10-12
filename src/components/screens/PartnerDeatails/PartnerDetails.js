// // import React from "react";
// // import {
// //   View,
// //   Text,
// //   Image,
// //   StyleSheet,
// //   Dimensions,
// //   SafeAreaView,
// //   TouchableOpacity,
// //   StatusBar,
// // } from "react-native";
// // import Svg, { Path } from "react-native-svg";
// // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // import AntDesign from '@react-native-vector-icons/ant-design';
// // import { useNavigation, useFocusEffect } from "@react-navigation/native";



// // const { width } = Dimensions.get("window");
// // const CARD_WIDTH = Math.min(400, width - 24); // responsive width
// // const AVATAR_SIZE = 140;



// // const PartnerDetails = ({ avatarSource, logoSource, name = "Henrietta Mitchell", phone = "9875557875", pincode = "642585", district = "Salem", state = "Tamil Nadu" }) => {

// //        const navigation = useNavigation();
// //   return (

// //     <>

// //                 <StatusBar  backgroundColor="transparent" />





// //                     {/* Header */}
// //                     <View style={styles.header}>
// //                         <TouchableOpacity onPress={() => navigation.push('Footer', { screen: 'Profile' })}>
// //                             <AntDesign name="left" size={22} color="white" style={{ marginTop: hp(4) }} />
// //                         </TouchableOpacity>
// //                         <Text style={styles.headerText}>PARTNER DETAILS</Text>
// //                     </View>
// //                      <View style={styles.container}>


// //                        <View style={styles.walletcontainer}>

// //                                 <TouchableOpacity onPress={() => setCashbackmodal(true)} style={styles.walletView}>
// //                                     {/* <Text style={styles.wlletText}>{cashback_wallet}</Text> */}
// //                                     <Text style={styles.wlletText}>District Partner</Text>
// //                                 </TouchableOpacity>

// //                                 <TouchableOpacity onPress={() => setWidrawcashbackmodal(true)} style={styles.walletView}>
// //                                     {/* <Text style={styles.wlletText}>{earning_wallet}</Text> */}
// //                                     <Text style={styles.wlletText}>Channel Partner</Text>
// //                                 </TouchableOpacity>

// //                                 <View style={styles.walletView}>
// //                                     {/* <Text style={styles.wlletText}>{purchase_wallet}</Text> */}
// //                                     <Text style={styles.wlletText}>Pincode Partner</Text>
// //                                 </View>

// //                             </View>




// //       <View style={[styles.card, { width: CARD_WIDTH }]}>
// //         {/* Top decorative SVG */}
// //         <View style={styles.topSvgWrap}>
// //           <Svg
// //             width="100%"
// //             height={120}
// //             viewBox={`0 0 ${CARD_WIDTH} 120`}
// //             preserveAspectRatio="none"
// //           >
// //             {/* gold curve */}
// //             <Path
// //               d={`M0,60 C${CARD_WIDTH * 0.25},20 ${CARD_WIDTH * 0.6},10 ${CARD_WIDTH},50 L ${CARD_WIDTH},0 L 0,0 Z`}
// //               fill="#C9A23C"
// //               opacity={1}
// //             />
// //             {/* maroon curve */}
// //             <Path
// //               d={`M0,80 C${CARD_WIDTH * 0.2},40 ${CARD_WIDTH * 0.5},30 ${CARD_WIDTH},70 L ${CARD_WIDTH},0 L 0,0 Z`}
// //               fill="#8C2A2E"
// //               opacity={1}
// //             />
// //           </Svg>
// //         </View>

// //         {/* Logo */}
// //         <View style={styles.logoWrap}>
// //           <Image
// //             source={logoSource}
// //             style={styles.logo}
// //             resizeMode="contain"
// //           />
// //         </View>

// //         {/* Avatar */}
// //         <View style={styles.avatarWrap}>
// //           <View style={styles.avatarBorder}>
// //             <Image source={avatarSource} style={styles.avatar} />
// //           </View>
// //         </View>

// //         {/* Name and phone */}
// //         <Text style={styles.nameText}>{name}</Text>
// //         <Text style={styles.phoneText}>{phone}</Text>

// //         {/* Pincode partner badge */}
// //         <View style={styles.badgeWrap}>
// //           <View style={styles.badgeShadow} />
// //           <View style={styles.badge}>
// //             <Text style={styles.badgeText}>Pincode Partner</Text>
// //           </View>
// //         </View>

// //         {/* Info block */}
// //         <View style={styles.infoWrap}>
// //           <View style={styles.infoRow}>
// //             <Text style={styles.infoLabel}>Pincode:</Text>
// //             <Text style={styles.infoValue}>{pincode}</Text>
// //           </View>
// //           <View style={styles.infoRow}>
// //             <Text style={styles.infoLabel}>District:</Text>
// //             <Text style={styles.infoValue}>{district}</Text>
// //           </View>
// //           <View style={styles.infoRow}>
// //             <Text style={styles.infoLabel}>State:</Text>
// //             <Text style={styles.infoValue}>{state}</Text>
// //           </View>
// //         </View>

// //         {/* Bottom decorative SVG */}
// //         <View style={styles.bottomSvgWrap}>
// //           <Svg
// //             width="100%"
// //             height={120}
// //             viewBox={`0 0 ${CARD_WIDTH} 120`}
// //             preserveAspectRatio="none"
// //           >
// //             <Path
// //               d={`M0,40 C${CARD_WIDTH * 0.2},90 ${CARD_WIDTH * 0.5},100 ${CARD_WIDTH},60 L ${CARD_WIDTH},120 L 0,120 Z`}
// //               fill="#8C2A2E"
// //             />
// //             <Path
// //               d={`M0,30 C${CARD_WIDTH * 0.3},70 ${CARD_WIDTH * 0.6},80 ${CARD_WIDTH},50 L ${CARD_WIDTH},120 L 0,120 Z`}
// //               fill="#C9A23C"
// //             />
// //           </Svg>

// //           {/* footer label */}
// //           <View style={styles.footerLabel}>
// //             <Text style={styles.footerLabelText}>Avaxaa Online Shop (OPC) Private Limited</Text>
// //           </View>
// //         </View>
// //       </View>
// //     </View>
// //     </>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: "center",
// //     paddingVertical: 20,
// //     backgroundColor: "#f2f2f2",
// //   },
// //       header: {
// //         backgroundColor: '#A6222C',
// //         height: hp(11),
// //         padding: hp(1.5),
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     headerText: {
// //         color: "#fff",
// //         fontSize: hp(2),
// //         fontWeight: "bold",
// //         marginTop: hp(4),
// //         marginLeft: wp(5),
// //         fontFamily: "DMSans-Medium",
// //     },
// //   card: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 14,
// //     overflow: "hidden",
// //     alignItems: "center",
// //     paddingBottom: 20,
// //     // drop shadow (ios/android)
// //     shadowColor: "#000",
// //     shadowOpacity: 0.08,
// //     shadowRadius: 10,
// //     shadowOffset: { height: 6, width: 0 },
// //     elevation: 6,
// //     marginTop:hp(3)
// //   },

// //   topSvgWrap: {
// //     width: "100%",
// //     alignItems: "center",
// //     marginBottom: -20,
// //   },

// //   logoWrap: {
// //     marginTop: -18,
// //     height: 50,
// //     width: "100%",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 20,
// //   },
// //   logo: {
// //     height: 44,
// //     width: 120,
// //   },

// //   avatarWrap: {
// //     marginTop: 6,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   avatarBorder: {
// //     width: AVATAR_SIZE + 12,
// //     height: AVATAR_SIZE + 12,
// //     borderRadius: (AVATAR_SIZE + 12) / 2,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 6,
// //     borderColor: "#3FA9F5", // blue border
// //     backgroundColor: "#fff",
// //   },
// //   avatar: {
// //     width: AVATAR_SIZE,
// //     height: AVATAR_SIZE,
// //     borderRadius: AVATAR_SIZE / 2,
// //   },

// //   nameText: {
// //     marginTop: 10,
// //     fontSize: 24,
// //     fontWeight: "700",
// //     color: "#111111",
// //     textAlign: "center",
// //   },
// //   phoneText: {
// //     marginTop: 6,
// //     fontSize: 16,
// //     color: "#333333",
// //     textAlign: "center",
// //   },

// //   badgeWrap: {
// //     marginTop: 12,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     height: 48,
// //   },
// //   badgeShadow: {
// //     position: "absolute",
// //     width: 210,
// //     height: 42,
// //     borderRadius: 22,
// //     backgroundColor: "#E1B24A", // mustard shadow
// //     transform: [{ translateY: 8 }],
// //     zIndex: 0,
// //   },
// //   badge: {
// //     zIndex: 1,
// //     width: 210,
// //     height: 42,
// //     borderRadius: 22,
// //     backgroundColor: "#8C2A2E", // maroon
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 12,
// //   },
// //   badgeText: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "600",
// //   },

// //   infoWrap: {
// //     marginTop: 18,
// //     width: "84%",
// //   },
// //   infoRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingVertical: 6,
// //   },
// //   infoLabel: {
// //     color: "#111111",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// //   infoValue: {
// //     color: "#111111",
// //     fontSize: 16,
// //   },

// //   bottomSvgWrap: {
// //     width: "100%",
// //     marginTop: 12,
// //     alignItems: "center",
// //   },

// //   footerLabel: {
// //     position: "absolute",
// //     bottom: 8,
// //     left: 0,
// //     right: 0,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingVertical: 8,
// //     backgroundColor: "transparent",
// //   },
// //   footerLabelText: {
// //     color: "#FFFFFF",
// //     backgroundColor: "rgba(0,0,0,0)",
// //     fontWeight: "600",
// //     paddingHorizontal: 12,
// //   },
// //       walletcontainer: {
// //           flexDirection: 'row',
// //           alignItems: 'center',
// //           justifyContent: 'space-evenly',
// //           alignSelf: 'center',
// //           width: wp(96),
// //           height: hp(10),
// //           marginTop: hp(2),
// //           // backgroundColor: "#fff",
// //           // shadowColor: '#000',
// //           // shadowOpacity: 0.1,
// //           // shadowRadius: 5,
// //           // elevation: 8,
// //       },
// //       walletView: {
// //           width: wp(29),
// //           height: hp(8),
// //           backgroundColor: '#fff',
// //           // borderColor:'#fff',
// //           // borderWidth:1,
// //           borderRadius: hp(1),
// //           justifyContent: 'center',
// //           alignItems: 'center',
// //           shadowColor: '#A6222C',
// //           shadowOpacity: 0.1,
// //           shadowRadius: 5,
// //           elevation: 8,
// //       },
// //       wlletText: {
// //           fontSize: hp(1.7),
// //           color: '#000'
// //       },
// //       wlletName: {
// //           fontSize: hp(1.5),
// //           color: '#000'
// //       },
// //       text: {
// //           fontSize: hp(1.7),
// //           fontWeight: '400',
// //           color: '#454545',
// //           marginHorizontal: 10,
// //       },
// // });

// // export default PartnerDetails;



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   TouchableOpacity,
//   StatusBar,
//   ToastAndroid,
// } from "react-native";
// import AntDesign from "@react-native-vector-icons/ant-design";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
// import { useNavigation } from "@react-navigation/native";
// import { Authentication_Key } from "../../key/Key";
// import { BaseUrl } from "../BaseUrl/BaseUrl";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = Math.min(400, width - 24);
// const AVATAR_SIZE = 140;

// const PartnerDetails = () => {
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState("Pincode Partner");
//   const EncKey = encryptPiDataNew(Authentication_Key)


//      const All_Partener_Data = async (opr, id, qty) => {

//           const upQty = opr == 0 ? qty - 1 : qty + 1;
//           console.log(upQty);
//           const partnerData = new FormData();
//           partnerData.append('uId', "12765");

//               const response = await fetch(`${BaseUrl}partnerGet`, {
//                   method: 'POST',
//                   body: partnerData,
//                   headers: { "authentication": EncKey }
//               });
//               response.json()
//                   .then(responseData => {
//                       console.log(responseData);
//                       if (responseData.Response.Success == 1) {
//                           ToastAndroid.showWithGravityAndOffset(
//                               responseData.Response.Message,
//                               ToastAndroid.LONG,
//                               ToastAndroid.BOTTOM,
//                               25,
//                               50
//                           );
//                           getCartItems();
//                       }
//                       else {
//                           ToastAndroid.showWithGravityAndOffset(
//                               responseData.Response.Message,
//                               ToastAndroid.LONG,
//                               ToastAndroid.BOTTOM,
//                               25,
//                               50
//                           );
//                           getCartItems();
//                       }
//                   })
//                   .catch(error => {
//                       console.log(error);
//                   });

//       }

//     useEffect(() => {
//       All_Partener_Data();
//     }, [])


//   const partnerData = {
//     "District Partner": {
//       name: "David Johnson",
//       phone: "9876543210",
//       pincode: "600001",
//       district: "Chennai",
//       state: "Tamil Nadu",
//     },
//     "Channel Partner": {
//       name: "Maria Thomas",
//       phone: "9871112233",
//       pincode: "641001",
//       district: "Coimbatore",
//       state: "Tamil Nadu",
//     },
//     "Pincode Partner": {
//       name: "Henrietta Mitchell",
//       phone: "9875557875",
//       pincode: "642585",
//       district: "Salem",
//       state: "Tamil Nadu",
//     },
//   };

//   const currentData = partnerData[selectedTab];

//   return (
//     <>
//       <StatusBar  backgroundColor="transparent" />
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <AntDesign name="left" size={22} color="white" style={{ marginTop: hp(4) }} />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>PARTNER DETAILS</Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.walletcontainer}>
//         {["District Partner", "Channel Partner", "Pincode Partner"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[
//               styles.walletView,
//               selectedTab === tab && { backgroundColor: "#A6222C" },
//             ]}
//             onPress={() => setSelectedTab(tab)}
//           >
//             <Text
//               style={[
//                 styles.wlletText,
//                 selectedTab === tab && { color: "#fff", fontWeight: "600" },
//               ]}
//             >
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Card with background image */}
//       <View style={[styles.card, { width: CARD_WIDTH }]}>
//         <ImageBackground
//           source={require("../../assets/images/Profile/imageback.jpeg")} // your uploaded 2nd image
//           style={styles.cardBackground}
//           imageStyle={{ borderRadius: 10 }}
//         >
//           {/* Avatar */}
//           <View style={styles.avatarWrap}>
//             <View style={styles.avatarBorder}>
//               {/* <Image
//                 source={require("../assets/avatar_placeholder.png")} // replace with actual avatar if available
//                 style={styles.avatar}
//               /> */}
//             </View>
//           </View>

//           {/* Name and phone */}
//           <Text style={styles.nameText}>{currentData.name}</Text>
//           <Text style={styles.phoneText}>{currentData.phone}</Text>

//           {/* Partner Type Badge */}
//           <View style={styles.badgeWrap}>
//             <View style={styles.badgeShadow} />
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{selectedTab}</Text>
//             </View>
//           </View>

//           {/* Info block */}
//           <View style={styles.infoWrap}>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Pincode:</Text>
//               <Text style={styles.infoValue}>{currentData.pincode}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>District:</Text>
//               <Text style={styles.infoValue}>{currentData.district}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>State:</Text>
//               <Text style={styles.infoValue}>{currentData.state}</Text>
//             </View>
//           </View>

//           {/* Footer */}
//           {/* <Text style={styles.footerLabelText}>
//             Avaxaa Online Shop (OPC) Private Limited
//           </Text> */}
//         </ImageBackground>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: "#A6222C",
//     height: hp(11),
//     padding: hp(1.5),
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerText: {
//     color: "#fff",
//     fontSize: hp(2),
//     fontWeight: "bold",
//     marginTop: hp(4),
//     marginLeft: wp(5),
//   },
//   walletcontainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     width: wp(100),
//     marginTop: hp(2),
//   },
//   walletView: {
//     width: wp(29),
//     height: hp(6),
//     backgroundColor: "#fff",
//     borderRadius: hp(1),
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 4,
//   },
//   wlletText: {
//     fontSize: hp(1.7),
//     color: "#000",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     overflow: "hidden",
//     marginTop: hp(2),
//     elevation: 6,
//     height:hp(80),
//     justifyContent:'center',
//     alignItems:'center',
//     alignSelf:'center',
//   },
//   cardBackground: {
//     alignItems: "center",
//     justifyContent: "center",
//     // paddingVertical: 30,
//     resizeMode:'contain',
//      height:hp(80),
//      width:wp(100)
//   },
//   avatarWrap: {
//     marginTop: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarBorder: {
//     width: AVATAR_SIZE + 12,
//     height: AVATAR_SIZE + 12,
//     borderRadius: (AVATAR_SIZE + 12) / 2,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 6,
//     borderColor: "#3FA9F5",
//     backgroundColor: "#fff",
//   },
//   avatar: {
//     width: AVATAR_SIZE,
//     height: AVATAR_SIZE,
//     borderRadius: AVATAR_SIZE / 2,
//   },
//   nameText: {
//     marginTop: 10,
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111",
//   },
//   phoneText: {
//     marginTop: 6,
//     fontSize: 16,
//     color: "#333",
//   },
//   badgeWrap: {
//     marginTop: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     height: 48,
//   },
//   badgeShadow: {
//     position: "absolute",
//     width: 210,
//     height: 42,
//     borderRadius: 22,
//     backgroundColor: "#E1B24A",
//     transform: [{ translateY: 8 }],
//     zIndex: 0,
//   },
//   badge: {
//     zIndex: 1,
//     width: 210,
//     height: 42,
//     borderRadius: 22,
//     backgroundColor: "#8C2A2E",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   infoWrap: {
//     marginTop: 18,
//     width: "84%",
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 6,
//   },
//   infoLabel: {
//     color: "#111",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   infoValue: {
//     color: "#111",
//     fontSize: 16,
//   },
//   footerLabelText: {
//     marginTop: 20,
//     color: "#8C2A2E",
//     fontWeight: "700",
//     fontSize: 14,
//   },
// });

// export default PartnerDetails;



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   StatusBar,
//   ToastAndroid,
//   ActivityIndicator,
// } from "react-native";
// import AntDesign from "@react-native-vector-icons/ant-design";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useIsFocused, useNavigation } from "@react-navigation/native";
// import { BaseUrl } from "../BaseUrl/BaseUrl";
// import { encryptPiDataNew } from "../Encryption/encryption";
// import { Authentication_Key } from "../../key/Key";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = Math.min(400, width - 24);
// const AVATAR_SIZE = 140;

// const PartnerDetails = () => {
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState("District Partner");
//   const [partnerData, setPartnerData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const EncKey = encryptPiDataNew(Authentication_Key);
//   console.log(EncKey)


//   const [profileData, setProfileData] = useState("");
//   const [Uid, setUid] = useState(null);
//   console.log("Uid", Uid);

//   const isFocused = useIsFocused();



//   console.log("profileData", profileData);



//   const getUser = async () => {
//     const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
//     console.log('value------>', value)
//   }

//   useEffect(() => {
//     if (isFocused) {
//       getUser()
//       User_Details_Get();
//     }
//   }, [isFocused]);

//   const User_Details_Get = async () => {
//     try {
//       const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
//       console.log('value ', value)
//       if (value !== null) {
//         setUid(value);
//         try {
//           const response = await fetch(
//             `${BaseUrl}userGet?req_type=1&res_type=1&id=${value}&type=M`,
//             {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 authentication: EncKey,
//               },
//             }
//           );

//           if (!response.ok) {
//             throw new Error(`Network response was not ok: ${response.status}`);
//           }

//           const data = await response.json();
//           console.log("data :::>>>", data.Response);

//           if (data.Response.Success === '1') {
//             setProfileData(data.Response.Result);
//           } else {
//             console.log(data?.Response?.Message || 'Unknown error');
//             setProfileData(null);
//             setProfileId(null)

//           }
//         } catch (error) {
//           console.error('Fetch error:', error.message);
//         }
//       } else {
//         console.log('No user data found in AsyncStorage.');
//       }
//     } catch (error) {
//       console.error('Error reading AsyncStorage:', error.message);
//     }
//   };



//   const All_Partener_Data = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("uId", Uid);

//       const response = await fetch(`${BaseUrl}partnerGet`, {
//         method: "POST",
//         headers: { authentication: EncKey },
//         body: formData,
//       });

//       const json = await response.json();
//       console.log("API RESPONSE:", json);

//       if (json.Response.Success == "1") {
//         setPartnerData(json.Response.Result);
//       } else {
//         ToastAndroid.show(json.Response.Message, ToastAndroid.SHORT);
//       }
//     } catch (error) {
//       console.error("Error fetching partner data:", error);
//       ToastAndroid.show("Failed to fetch data", ToastAndroid.SHORT);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     All_Partener_Data();
//   }, []);

//   if (loading) {
//     return (
//       <>
//         <StatusBar  backgroundColor="#A6222C" />
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <AntDesign
//               name="left"
//               size={22}
//               color="white"
//               style={{ marginTop: hp(4) }}
//             />
//           </TouchableOpacity>
//           <Text style={styles.headerText}>PARTNER DETAILS</Text>
//         </View>


//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <ActivityIndicator size="large" color="#A6222C" />
//         </View>
//       </>
//     );
//   }

//   if (!partnerData) {
//     return (
//       <>
//         <StatusBar  backgroundColor="#A6222C" />
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <AntDesign
//               name="left"
//               size={22}
//               color="white"
//               style={{ marginTop: hp(0) }}
//             />
//           </TouchableOpacity>
//           <Text style={styles.headerText}>PARTNER DETAILS</Text>
//         </View>


//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <Text>No Partner Data Found</Text>
//         </View>
//       </>
//     );
//   }

//   const tabs = ["District Partner", "Channel Partner", "Pincode Partner"];

//   const getCurrentData = () => {
//     switch (selectedTab) {
//       case "District Partner":
//         return partnerData.districtPartners?.[0];
//       case "Channel Partner":
//         return partnerData.channelPartners?.[0];
//       case "Pincode Partner":
//         return partnerData.pincodePartners?.[0];
//       default:
//         return null;
//     }
//   };

//   const current = getCurrentData();

//   return (
//     <>
//       <StatusBar  backgroundColor="#A6222C" />
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <AntDesign
//             name="left"
//             size={22}
//             color="white"
//             style={{ marginTop: hp(0) }}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>PARTNER DETAILS</Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.walletcontainer}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[
//               styles.walletView,
//               selectedTab === tab && { backgroundColor: "#A6222C" },
//             ]}
//             onPress={() => setSelectedTab(tab)}
//           >
//             <Text
//               style={[
//                 styles.wlletText,
//                 selectedTab === tab && { color: "#fff", fontWeight: "600" },
//               ]}
//             >
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Card */}
//       {current ? (
//         <View style={[styles.card, { width: CARD_WIDTH }]}>
//           <ImageBackground
//             source={require("../../assets/images/Profile/imageback.jpeg")}
//             style={styles.cardBackground}
//             imageStyle={{ borderRadius: 10 }}
//           >
//             {/* Avatar */}
//             <View style={styles.avatarWrap}>
//               <View style={styles.avatarBorder}>
//                 <Image
//                   source={{ uri: current.profile_image }}
//                   style={styles.avatar}
//                 />
//               </View>
//             </View>

//             {/* Name and Phone */}
//             <Text style={styles.nameText}>{current.name}</Text>
//             <Text style={styles.phoneText}>{current.mobile}</Text>

//             {/* Badge */}
//             <View style={styles.badgeWrap}>
//               <View style={styles.badgeShadow} />
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{selectedTab}</Text>
//               </View>
//             </View>

//             {/* Info */}
//             <View style={styles.infoWrap}>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Pincode:</Text>
//                 <Text style={styles.infoValue}>{current.pincode}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>District:</Text>
//                 <Text style={styles.infoValue}>{current.district}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>State:</Text>
//                 <Text style={styles.infoValue}>{current.state}</Text>
//               </View>
//             </View>
//           </ImageBackground>
//         </View>
//       ) : (
//         <View style={{ alignItems: "center", marginTop: hp(10) }}>
//           <Text>No data available for this partner type</Text>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: "#A6222C",
//     height: hp(8),
//     padding: hp(1.5),
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerText: {
//     color: "#fff",
//     fontSize: hp(2),
//     fontWeight: "bold",
//     marginTop: hp(0),
//     marginLeft: wp(5),
//   },
//   walletcontainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     width: wp(100),
//     marginTop: hp(1.5),
//   },
//   walletView: {
//     width: wp(29),
//     height: hp(6),
//     backgroundColor: "#fff",
//     borderRadius: hp(1),
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 4,
//   },
//   wlletText: {
//     fontSize: hp(1.7),
//     color: "#000",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     overflow: "hidden",
//     marginTop: hp(2),
//     elevation: 6,
//     height: hp(79),
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//   },
//   cardBackground: {
//     alignItems: "center",
//     justifyContent: "center",
//     resizeMode: "contain",
//     height: hp(79),
//     width: wp(100),
//   },
//   avatarWrap: {
//     marginTop: 6,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarBorder: {
//     width: AVATAR_SIZE + 10,
//     height: AVATAR_SIZE + 10,
//     borderRadius: (AVATAR_SIZE + 10) / 2,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 5,
//     borderColor: "#3FA9F5",
//     backgroundColor: "#fff",
//   },
//   avatar: {
//     width: AVATAR_SIZE,
//     height: AVATAR_SIZE,
//     borderRadius: AVATAR_SIZE / 2,
//   },
//   nameText: {
//     marginTop: 10,
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111",
//   },
//   phoneText: {
//     marginTop: 6,
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "700",
//   },
//   badgeWrap: {
//     marginTop: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     height: 48,
//   },
//   badgeShadow: {
//     position: "absolute",
//     width: 210,
//     height: 42,
//     borderRadius: 22,
//     backgroundColor: "#E1B24A",
//     transform: [{ translateY: 8 }],
//     zIndex: 0,
//   },
//   badge: {
//     zIndex: 1,
//     width: 210,
//     height: 42,
//     borderRadius: 22,
//     backgroundColor: "#8C2A2E",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   infoWrap: {
//     marginTop: 18,
//     width: "80%",
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 6,
//   },
//   infoLabel: {
//     color: "#111",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   infoValue: {
//     color: "#111",
//     fontSize: 16,
//   },
// });

// export default PartnerDetails;




import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AntDesign from "@react-native-vector-icons/ant-design";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BaseUrl } from "../BaseUrl/BaseUrl";
import { encryptPiDataNew } from "../Encryption/encryption";
import { Authentication_Key } from "../../key/Key";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(400, width - 24);
const AVATAR_SIZE = 140;

const PartnerDetails = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("District Partner");
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const EncKey = encryptPiDataNew(Authentication_Key);
  console.log(EncKey)


  const [profileData, setProfileData] = useState("");
  const [Uid, setUid] = useState(null);
  console.log("Uid", Uid);

  const isFocused = useIsFocused();



  console.log("profileData", profileData);



  const getUser = async () => {
    const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
    console.log('value------>', value)
  }

  useEffect(() => {
    if (isFocused) {
      getUser()
      User_Details_Get();
    }
  }, [isFocused]);

  const [membershipDetail, setMembershipDetail] = useState(null);
  console.log('membershipDetail ', membershipDetail)

  const User_Details_Get = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item
      console.log('value ', value)
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
            const membership = data.Response.Result[0]?.position[0]?.type;
            setMembershipDetail(membership)
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



  return (
    <>
      <StatusBar  backgroundColor="#A6222C" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{marginTop: hp(3)}} onPress={() => navigation.goBack()}>
          <AntDesign
            name="left"
            size={22} 
            color="white"
            style={{ marginTop: hp(0) }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>My ID</Text>
      </View>

      {
        membershipDetail ? (
          <ScrollView>
            {/* <View style={[styles.card, { width: CARD_WIDTH }]}> */}
             <View style={[styles.card, { width: wp(90) }]}>
              <ImageBackground
                source={require("../../assets/images/Profile/imageback.jpeg")}
                style={styles.cardBackground}
                resizeMode='contain'
                imageStyle={{ borderRadius: 10 }}
              >
                {/* Avatar */}
                <View style={styles.avatarWrap}>
                  <View style={styles.avatarBorder}>
                    <Image
                      source={{ uri: profileData[0]?.profile_image }}
                      style={styles.avatar}
                    />
                  </View>
                </View>

                {/* Name and Phone */}
                <Text style={styles.nameText}>{profileData[0]?.name}</Text>
                <Text style={styles.phoneText}>{profileData[0]?.mobile}</Text>

                {/* Badge */}
                <View style={styles.badgeWrap}>
                  <View style={styles.badgeShadow} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{membershipDetail}</Text>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.infoWrap}>
                  {
                    profileData[0]?.position[0]?.pincode ? ( 
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Pincode:</Text>
                        <Text style={styles.infoValue}>{profileData[0]?.position[0]?.pincode}</Text>
                      </View>
                    ) : null
                  }
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>District:</Text>
                    <Text style={styles.infoValue}>{profileData[0]?.position[0]?.district}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>State:</Text>
                    <Text style={styles.infoValue}>{profileData[0]?.position[0]?.state}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={{ height: hp(10) }}></View>
          </ScrollView>
        ) : (
          <View style={{ height: hp(60), justifyContent: 'center', alignItems: "center", marginTop: hp(10) }}>
            <Text style={{ color: '#000', fontSize: hp(2) }}>No data available for this partner type</Text>
          </View>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#A6222C",
    height: hp(10),
    padding: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: hp(2),
    fontWeight: "bold",
    marginTop: hp(3),
    marginLeft: wp(5),
  },
  walletcontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: wp(100),
    marginTop: hp(1.5),
  },
  walletView: {
    width: wp(29),
    height: hp(6),
    backgroundColor: "#fff",
    borderRadius: hp(1),
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  wlletText: {
    fontSize: hp(1.7),
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: hp(5),
    elevation: 6,
    height: hp(67),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cardBackground: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(80),
    width: wp(90),
  },
  avatarWrap: {
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBorder: {
    width: AVATAR_SIZE + 10,
    height: AVATAR_SIZE + 10,
    borderRadius: (AVATAR_SIZE + 10) / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "#3FA9F5",
    backgroundColor: "#fff",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  nameText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  phoneText: {
    marginTop: 6,
    fontSize: 16,
    color: "#333",
    fontWeight: "700",
  },
  badgeWrap: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  badgeShadow: {
    position: "absolute",
    width: 210,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#E1B24A",
    transform: [{ translateY: 8 }],
    zIndex: 0,
  },
  badge: {
    zIndex: 1,
    width: 230,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#8C2A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  infoWrap: {
    marginTop: 18,
    width: "80%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
  infoValue: {
    color: "#111",
    fontSize: 16,
  },
});

export default PartnerDetails;

