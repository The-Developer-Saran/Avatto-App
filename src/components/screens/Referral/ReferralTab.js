// // // import React, { useState } from "react";
// // // import {
// // //     View, Text, StyleSheet, Dimensions, StatusBar,
// // //     TouchableOpacity,
// // // } from "react-native";
// // // import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// // // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // // import Icon from '@react-native-vector-icons/ant-design';
// // // import AntDesign from '@react-native-vector-icons/ant-design';
// // // import MyReferralPage from "./MyReferralPage";
// // // import VendorReferralPage from "./VendorReferralPage";

// // // const initialLayout = { width: Dimensions.get("window").width };

// // // export default function ReferralTab({ navigation }) {
// // //     const [index, setIndex] = useState(0);
// // //     const [routes] = useState([
// // //         { key: "personal", title: "MY REFERRAL", icon: "user" },
// // //         { key: "bank", title: "VENDOR REFERRAL", icon: "bank" },
// // //     ]);

// // //     const renderScene = SceneMap({
// // //         personal: () => (
// // //             <View style={{ flex: 1 }}>
// // //                 <MyReferralPage />
// // //             </View>
// // //         ),
// // //         bank: () => (
// // //             <View style={{ flex: 1 }}>
// // //                 <VendorReferralPage />
// // //             </View>
// // //         ),
// // //     });



// // //     return (

// // //         <>
// // //             <StatusBar  backgroundColor='#0000' />
// // //             <View style={styles.container}>
// // //                 <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.header}>
// // //                     <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(4) }} />
// // //                     <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>REFERRAL</Text>
// // //                 </TouchableOpacity>



// // //                 <TabView
// // //                     navigationState={{ index, routes }}
// // //                     renderScene={renderScene}
// // //                     onIndexChange={setIndex}
// // //                     initialLayout={initialLayout}
// // //                     renderTabBar={(props) => (
// // //                         <TabBar
// // //                             {...props}
// // //                             renderIcon={({ route, focused }) => (
// // //                                 <AntDesign
// // //                                     name={route.icon}
// // //                                     size={25}
// // //                                     color={focused ? "#A6222C" : "gray"}
// // //                                     style={{ marginBottom: 2 }} // Adjust spacing
// // //                                 />
// // //                             )}
// // //                             indicatorStyle={{
// // //                                 backgroundColor: "#A6222C",
// // //                                 width: wp(35),
// // //                                 alignSelf: "center",
// // //                                 marginLeft: wp(6),
// // //                                 marginRight: wp(2),
// // //                                 height: hp(0.5),
// // //                                 borderRadius: hp(1),
// // //                             }}
// // //                             style={styles.tabBar}
// // //                             labelStyle={{
// // //                                 fontSize: hp(2),
// // //                                 fontWeight: "bold",
// // //                                 color: "black", // Ensures visibility
// // //                             }}
// // //                             activeColor="#A6222C"
// // //                             inactiveColor="gray"
// // //                         />
// // //                     )}
// // //                 />
// // //             </View>
// // //         </>
// // //     );
// // // }

// // // const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //         backgroundColor: '#fff',
// // //     },
// // //     subcontainer: {
// // //         marginTop: hp(2),
// // //         paddingHorizontal: wp(5),
// // //     },
// // //     header: {
// // //         backgroundColor: '#A6222C',
// // //         height: hp(11),
// // //         padding: hp(1.5),
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //     },
// // //     headerText: {
// // //         color: "#fff",
// // //         fontSize: hp(2),
// // //         fontWeight: "bold",
// // //         marginTop: hp(4),
// // //         marginLeft: wp(5),
// // //         fontFamily: "DMSans-Medium",
// // //     },

// // //     tabBar: {
// // //         backgroundColor: "#fff",
// // //         marginTop: hp(1),
// // //         width: wp(95),
// // //         alignSelf: 'center',
// // //         elevation: 5,
// // //         borderRadius: hp(1),
// // //     },
  
// // // });


// // // import React, { useState } from "react";
// // // import {
// // //     View, Text, StyleSheet, Dimensions, StatusBar,
// // //     TouchableOpacity
// // // } from "react-native";
// // // import { TabView, TabBar } from "react-native-tab-view";
// // // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // // import AntDesign from '@react-native-vector-icons/ant-design';
// // // import MyReferralPage from "./MyReferralPage";
// // // import VendorReferralPage from "./VendorReferralPage";

// // // const initialLayout = { width: Dimensions.get("window").width };

// // // export default function ReferralTab({ navigation }) {
// // //     const [index, setIndex] = useState(0);
// // //     const [routes] = useState([
// // //         { key: "personal", title: "MY REFERRAL", icon: "user" },
// // //         { key: "bank", title: "VENDOR REFERRAL", icon: "bank" },
// // //     ]);

// // //     // Define renderScene properly
// // //     const renderScene = ({ route }) => {
// // //         switch (route.key) {
// // //             case "personal":
// // //                 return <MyReferralPage />;
// // //             case "bank":
// // //                 return <VendorReferralPage />;
// // //             default:
// // //                 return null;
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             <StatusBar  backgroundColor='#0000' />
// // //             <View style={styles.container}>
// // //                 <TouchableOpacity
// // //                     onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
// // //                     style={styles.header}
// // //                 >
// // //                     <AntDesign
// // //                         onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
// // //                         name="left"
// // //                         size={22}
// // //                         color="white"
// // //                         style={{ marginTop: hp(4) }}
// // //                     />
// // //                     <Text
// // //                         onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
// // //                         style={styles.headerText}
// // //                     >
// // //                         REFERRAL
// // //                     </Text>
// // //                 </TouchableOpacity>

// // //                 <TabView
// // //                     navigationState={{ index, routes }}
// // //                     renderScene={renderScene}
// // //                     onIndexChange={setIndex}
// // //                     initialLayout={initialLayout}
// // //                     renderTabBar={(props) => (
// // //                         <TabBar
// // //                             {...props}
// // //                             renderIcon={({ route, focused }) => (
// // //                                 <AntDesign
// // //                                     name={route.icon}
// // //                                     size={25}
// // //                                     color={focused ? "#A6222C" : "gray"}
// // //                                     style={{ marginBottom: 2 }}
// // //                                 />
// // //                             )}
// // //                             indicatorStyle={{
// // //                                 backgroundColor: "#A6222C",
// // //                                 width: wp(35),
// // //                                 alignSelf: "center",
// // //                                 marginLeft: wp(6),
// // //                                 marginRight: wp(2),
// // //                                 height: hp(0.5),
// // //                                 borderRadius: hp(1),
// // //                             }}
// // //                             style={styles.tabBar}
// // //                             labelStyle={{
// // //                                 fontSize: hp(2),
// // //                                 fontWeight: "bold",
// // //                                 color: "black",
// // //                             }}
// // //                             activeColor="#A6222C"
// // //                             inactiveColor="gray"
// // //                         />
// // //                     )}
// // //                 />
// // //             </View>
// // //         </>
// // //     );
// // // }

// // // const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //         backgroundColor: '#fff',
// // //     },
// // //     header: {
// // //         backgroundColor: '#A6222C',
// // //         height: hp(11),
// // //         padding: hp(1.5),
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //     },
// // //     headerText: {
// // //         color: "#fff",
// // //         fontSize: hp(2),
// // //         fontWeight: "bold",
// // //         marginTop: hp(4),
// // //         marginLeft: wp(5),
// // //         fontFamily: "DMSans-Medium",
// // //     },
// // //     tabBar: {
// // //         backgroundColor: "#fff",
// // //         marginTop: hp(1),
// // //         width: wp(95),
// // //         alignSelf: 'center',
// // //         elevation: 5,
// // //         borderRadius: hp(1),
// // //     },
// // // });


// // import React, { useState } from "react";
// // import {
// //     View, Text, StyleSheet, Dimensions, StatusBar,
// //     TouchableOpacity
// // } from "react-native";
// // import { TabView, TabBar } from "react-native-tab-view";
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // import AntDesign from '@react-native-vector-icons/ant-design';
// // import MyReferralPage from "./MyReferralPage";
// // import VendorReferralPage from "./VendorReferralPage";

// // const initialLayout = { width: Dimensions.get("window").width };

// // export default function ReferralTab({ navigation }) {
// //     const [index, setIndex] = useState(0);
// //     const [routes] = useState([
// //         { key: "personal", title: "MY REFERRAL", icon: "user" },
// //         { key: "bank", title: "VENDOR REFERRAL", icon: "bank" },
// //     ]);

// //     const renderScene = ({ route }) => {
// //         switch (route.key) {
// //             case "personal":
// //                 return <MyReferralPage />;
// //             case "bank":
// //                 return <VendorReferralPage />;
// //             default:
// //                 return null;
// //         }
// //     };

// //     return (
// //         <GestureHandlerRootView style={{ flex: 1 }}>
// //             <StatusBar  backgroundColor='#0000' />
// //             <View style={styles.container}>
// //                 <TouchableOpacity
// //                     onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
// //                     style={styles.header}
// //                 >
// //                     <AntDesign
// //                         onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
// //                         name="left"
// //                         size={22}
// //                         color="white"
// //                         style={{ marginTop: hp(4) }}
// //                     />
// //                     <Text
// //                         onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
// //                         style={styles.headerText}
// //                     >
// //                         REFERRAL
// //                     </Text>
// //                 </TouchableOpacity>

// //                 <TabView
// //                     navigationState={{ index, routes }}
// //                     renderScene={renderScene}
// //                     onIndexChange={setIndex}
// //                     initialLayout={initialLayout}
// //                     renderTabBar={(props) => (
// //                         <TabBar
// //                             {...props}
// //                             renderIcon={({ route, focused }) => (
// //                                 <AntDesign
// //                                     name={route.icon}
// //                                     size={25}
// //                                     color={focused ? "#A6222C" : "gray"}
// //                                     style={{ marginBottom: 2 }}
// //                                 />
// //                             )}
// //                             indicatorStyle={{
// //                                 backgroundColor: "#A6222C",
// //                                 width: wp(35),
// //                                 alignSelf: "center",
// //                                 marginLeft: wp(6),
// //                                 marginRight: wp(2),
// //                                 height: hp(0.5),
// //                                 borderRadius: hp(1),
// //                             }}
// //                             style={styles.tabBar}
// //                             labelStyle={{
// //                                 fontSize: hp(2),
// //                                 fontWeight: "bold",
// //                                 color: "black",
// //                             }}
// //                             activeColor="#A6222C"
// //                             inactiveColor="gray"
// //                         />
// //                     )}
// //                 />
// //             </View>
// //         </GestureHandlerRootView>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#fff',
// //     },
// //     header: {
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
// //     tabBar: {
// //         backgroundColor: "#fff",
// //         marginTop: hp(1),
// //         width: wp(95),
// //         alignSelf: 'center',
// //         elevation: 5,
// //         borderRadius: hp(1),
// //     },
// // });


// import React from "react";
// import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { useNavigation } from "@react-navigation/native";
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import AntDesign from '@react-native-vector-icons/ant-design';
// import MyReferralPage from "./MyReferralPage";
// import VendorReferralPage from "./VendorReferralPage";

// const Tab = createMaterialTopTabNavigator();

// export default function ReferralTab() {
//     const navigation = useNavigation();

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <StatusBar  backgroundColor='#0000' />
//             <View style={styles.container}>
//                 <TouchableOpacity
//                     onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}
//                     style={styles.header}
//                 >
//                     <AntDesign
//                         name="left"
//                         size={22}
//                         color="white"
//                         style={{ marginTop: hp(4) }}
//                     />
//                     <Text
//                         style={styles.headerText}
//                     >
//                         REFERRAL
//                     </Text>
//                 </TouchableOpacity>
                
//                 <Tab.Navigator
//                     screenOptions={({ route }) => ({
//                         tabBarIcon: ({ focused }) => (
//                             <AntDesign 
//                                 name={route.name === "MyReferral" ? "user" : "bank"} 
//                                 size={25} 
//                                 color={focused ? "#A6222C" : "gray"} 
//                             />
//                         ),
//                         tabBarIndicatorStyle: {
//                             backgroundColor: "#A6222C",
//                             height: hp(0.5),
//                             borderRadius: hp(1),
//                         },
//                         tabBarLabelStyle: {
//                             fontSize: hp(2),
//                             fontWeight: "bold",
//                             textTransform: "none",
//                         },
//                         tabBarActiveTintColor: "#A6222C",
//                         tabBarInactiveTintColor: "gray",
//                         tabBarStyle: styles.tabBar,
//                     })}
//                 >
//                     <Tab.Screen name="MyReferral" component={MyReferralPage} options={{ title: "MY REFERRAL" }} />
//                     <Tab.Screen name="VendorReferral" component={VendorReferralPage} options={{ title: "VENDOR REFERRAL" }} />
//                 </Tab.Navigator>
//             </View>
//         </GestureHandlerRootView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         backgroundColor: '#A6222C',
//         height: hp(11),
//         padding: hp(1.5),
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     headerText: {
//         color: "#fff",
//         fontSize: hp(2),
//         fontWeight: "bold",
//         marginTop: hp(4),
//         marginLeft: wp(5),
//         fontFamily: "DMSans-Medium",
//     },
//     tabBar: {
//         backgroundColor: "#fff",
//         elevation: 5,
//     },
// });




