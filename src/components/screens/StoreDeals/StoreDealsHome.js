// // // import React, { useEffect, useState } from 'react';
// // // import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, StatusBar, PermissionsAndroid, Platform, } from 'react-native';
// // // import AntDesign from '@react-native-vector-icons/ant-design';
// // // import Ionicons from '@react-native-vector-icons/ionicons';
// // // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // // import { useNavigation } from '@react-navigation/native';
// // // import { Authentication_Key } from '../../key/Key';
// // // import { encryptPiDataNew } from '../Encryption/encryption';
// // // import Icon from '@react-native-vector-icons/ant-design';
// // // import { BaseUrl } from '../BaseUrl/BaseUrl';
// // // import Geolocation from 'react-native-geolocation-service';
// // // import SelectDropdown from 'react-native-select-dropdown';
// // // import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
// // // import { ActivityIndicator } from 'react-native-paper';



// // // export default function StoreDealsHome() {
// // //     const navigation = useNavigation();
// // //     const EncKey = encryptPiDataNew(Authentication_Key);

// // //     const [selectCategory, setSelectCategory] = useState([]);
// // //     const [selectedCategory, setSelectedCategory] = useState(null);
// // //     const [categoryid, setCategoryid] = useState(null);
// // //     const [businessList, setBusinessList] = useState([]);
// // //     const [loading, setLoading] = useState(false);

// // //     console.log("categoryid", categoryid);
// // //     console.log("businessList", businessList);

// // //     const handleSelectCategory = (selectedItem, index) => {
// // //         setSelectedCategory(selectedItem);
// // //         setCategoryid(selectedItem.id)
// // //     };


// // //     //==============================================Location Fetch==========================================
// // //     const [location, setLocation] = useState(null);
// // //     const [latitude, setLatitude] = useState(null);
// // //     const [longitude, setLongitude] = useState(null);

// // //     useEffect(() => {
// // //         getLocation();
// // //     }, [])

// // //     // Request location permission for Android
// // //     const requestLocationPermission = async () => {
// // //         if (Platform.OS === 'android') {
// // //             const granted = await PermissionsAndroid.request(
// // //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // //                 {
// // //                     title: 'Location Permission',
// // //                     message: 'App needs access to your location',
// // //                     buttonNeutral: 'Ask Me Later',
// // //                     buttonNegative: 'Cancel',
// // //                     buttonPositive: 'OK',
// // //                 }
// // //             );
// // //             return granted === PermissionsAndroid.RESULTS.GRANTED;
// // //         }
// // //         return true;
// // //     };

// // //     const getLocation = async () => {
// // //         const hasPermission = await requestLocationPermission();
// // //         if (!hasPermission) {
// // //             console.log('Location permission denied');
// // //             return;
// // //         }

// // //         Geolocation.getCurrentPosition(
// // //             (position) => {
// // //                 setLocation(position.coords);
// // //                 setLatitude(position.coords?.latitude)
// // //                 setLongitude(position.coords?.longitude)
// // //             },
// // //             (error) => {
// // //                 console.log(error.code, error.message);
// // //             },
// // //             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
// // //         );
// // //     };

// // //     console.log("latitude", latitude);
// // //     console.log("longitude", longitude);


// // //     useEffect(() => {
// // //         Category_Detsils_Get();
// // //     }, []);

// // //     const Category_Detsils_Get = async () => {

// // //         try {
// // //             const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
// // //                 method: 'GET',
// // //                 headers: {
// // //                     'Content-Type': 'application/json',
// // //                     'authentication': EncKey
// // //                 }
// // //             });

// // //             if (!response.ok) {
// // //                 throw new Error('Network response was not ok');
// // //             }

// // //             const data = await response.json();

// // //             if (data.Response.Success === '1') {
// // //                 setSelectCategory(data.Response.Result);

// // //             } else {
// // //                 console.log(data?.Response.Message);
// // //                 setSelectCategory(null);
// // //             }
// // //         } catch (error) {
// // //             console.error('Fetch error:', error.message);
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         if (latitude && longitude && categoryid) {
// // //             handleFetchNearByBus();
// // //         }
// // //     }, [latitude, longitude, categoryid]);

// // //     const handleFetchNearByBus = async () => {
// // //         setLoading(true);
// // //         try {
// // //             const response = await fetch(
// // //                 `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}&catId=${categoryid}`,
// // //                 {
// // //                     method: 'GET',
// // //                     headers: {
// // //                         authentication: EncKey,
// // //                         'Content-Type': 'application/json',
// // //                     },
// // //                 }
// // //             );

// // //             const data = await response.json();

// // //             if (data?.Response?.Success === '1') {
// // //                 setBusinessList(data?.Response?.Result || []);
// // //             } else {
// // //                 setBusinessList([]);
// // //                 console.warn('No data found or unsuccessful response');
// // //             }
// // //         } catch (error) {
// // //             console.error('Error fetching businesses:', error.message);
// // //             setBusinessList([]);
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };


// // //     const handleSelectBusiness = (Result) => {
// // //         navigation.navigate('StoreDetailes', { Result });
// // //     }


// // //     const renderBusinessItem = ({ item }) => (
// // //         <TouchableOpacity
// // //             style={[
// // //                 styles.BusinessContainer,
// // //             ]}
// // //             onPress={() => handleSelectBusiness(item)}>
// // //             <Image source={
// // //                 item.logo ?
// // //                     { uri: item.logo } :
// // //                     require('../../assets/images/Home/avaxaa.png')}
// // //                 style={styles.businessImage} />



// // //             <View style={styles.midSection}>
// // //                 <Text style={styles.businessTitle}>{item.business_name}</Text>

// // //                 <View style={styles.locationContainer}>
// // //                     <Text style={styles.businessAddress}>{item.address}</Text>
// // //                     <Text style={styles.businessCity}>{item.city_name}</Text>
// // //                 </View>

// // //                 <View style={styles.distenceContainer}>
// // //                     <Ionicons style={styles.locationIcon} name="location" color="#000" />
// // //                     <Text style={styles.businessDistance}>{item.distance.toFixed(2)} km</Text>
// // //                 </View>
// // //             </View>

// // //             <View style={styles.btnContainer}>
// // //                 <AntDesign style={styles.rightIcon} name="right" color="#000" />
// // //             </View>
// // //         </TouchableOpacity>
// // //     );


// // //     return (

// // //         <>
// // //             <StatusBar  backgroundColor='#0000' />
// // //             <View style={styles.container}>

// // //                 <View style={styles.header}>
// // //                     <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
// // //                         <Icon onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
// // //                         <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>STORE DEALS</Text>
// // //                     </TouchableOpacity>
// // //                     <TouchableOpacity style={{ padding: hp(1), marginTop: hp(3) }}>


// // //                     </TouchableOpacity>
// // //                 </View>


// // //                 <SelectDropdown
// // //                     defaultValue={selectedCategory?.title}
// // //                     data={selectCategory}
// // //                     onSelect={(selectedItem, index) => handleSelectCategory(selectCategory[index], index)}
// // //                     renderButton={(selectedItem, isOpened) => {
// // //                         return (
// // //                             <View style={[styles.dropdownButtonStyle,]}>
// // //                                 <Text style={[styles.dropdownButtonTxtStyle, { color: selectedItem ? "#000" : "#000" }]}>
// // //                                     {(selectedItem && selectedItem.title) || selectedCategory || "Select Business Category"}
// // //                                 </Text>
// // //                                 <MaterialCommunityIcons name={isOpened ? 'chevron-down' : 'chevron-right'} style={styles.dropdownButtonArrowStyle} />
// // //                             </View>
// // //                         );
// // //                     }}
// // //                     renderItem={(item, index, isSelected) => {
// // //                         return (
// // //                             <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#A6222C', borderRadius: hp(0.5) }), borderWidth: 0.19, borderColor: '#bdbcbc' }}>
// // //                                 <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? "#fff" : "#000", textAlign: 'center' }]}>{item.title}</Text>
// // //                             </View>
// // //                         );
// // //                     }}
// // //                     showsVerticalScrollIndicator={false}
// // //                     dropdownStyle={styles.dropdownMenuStyle}
// // //                 />

// // //                 <View style={styles.businessListContainer}>
// // //                     {/* <Text style={styles.title}>Nearby Businesses</Text> */}

// // //                     {loading ? (
// // //                         <ActivityIndicator size="large" color="#0000ff" />
// // //                     ) : businessList.length === 0 ? (
// // //                         <Text style={styles.noData}>No businesses found.</Text>
// // //                     ) : (
// // //                         <FlatList
// // //                             data={businessList}
// // //                             keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // //                             renderItem={renderBusinessItem}
// // //                             contentContainerStyle={styles.list}
// // //                         />
// // //                     )}
// // //                 </View>


// // //             </View>
// // //         </>
// // //     );
// // // };


// // // const styles = StyleSheet.create({


// // //     container: {
// // //         flex: 1,
// // //         backgroundColor: '#fff',
// // //     },
// // //     header: {
// // //         backgroundColor: '#A6222C',
// // //         // backgroundColor: '#ff6000',
// // //         height: hp(11),
// // //         padding: hp(1.5),
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //     },

// // //     headerText: {
// // //         color: "#fff",
// // //         fontSize: hp(2),
// // //         fontWeight: "bold",
// // //         marginTop: hp(3),
// // //         marginLeft: wp(5),
// // //         fontFamily: "DMSans-Medium",
// // //     },

// // //     selectedCategory: {
// // //         borderBottomColor: '#A6222C',
// // //         borderBottomWidth: hp(0.5),
// // //     },
// // //     categoryTitle: {
// // //         fontSize: hp(2),
// // //         fontWeight: 'bold',
// // //         color: '#3d3d3d'
// // //     },

// // //     businessImage: {
// // //         height: hp(13),
// // //         width: hp(13),
// // //         borderRadius: hp(1),
// // //         resizeMode: "stretch"
// // //     },
// // //     BusinessContainer: {
// // //         backgroundColor: '#e0c7c9',
// // //         width: wp(90),
// // //         flexDirection: 'row',
// // //         // alignItems: 'center',
// // //         justifyContent: 'space-between',
// // //         padding: hp(1),
// // //         borderRadius: hp(1.5),
// // //         marginVertical: hp(1.5)
// // //     },
// // //     businessListContainer: {
// // //         alignItems: 'center'
// // //     },

// // //     midSection: {
// // //         marginLeft: hp(1),
// // //         width: wp(49),
// // //     },
// // //     businessTitle: {
// // //         fontSize: hp(1.9),
// // //         fontWeight: 'bold',
// // //         color: '#3d3d3d',
// // //         marginVertical: hp(0.2),
// // //         width: wp(50),
// // //         flexWrap: 'wrap',
// // //     },
// // //     businessDistance: {
// // //         fontSize: hp(1.8),
// // //         color: '#3d3d3d',
// // //         marginVertical: hp(0.5),
// // //         fontWeight: '500',
// // //     },
// // //     locationContainer: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         marginVertical: hp(0.5),
// // //         width: wp(50),
// // //         flexWrap: 'wrap'
// // //     },
// // //     businessAddress: {
// // //         fontSize: hp(1.8),
// // //         color: '#3d3d3d',
// // //         textTransform: 'capitalize',
// // //         fontWeight: '400',
// // //         marginRight: hp(1),
// // //     },
// // //     businessCity: {
// // //         fontSize: hp(1.8),
// // //         color: '#3d3d3d',
// // //         textTransform: 'capitalize',
// // //         fontWeight: '400',
// // //     },
// // //     businessState: {
// // //         fontSize: hp(1.8),
// // //         color: '#3d3d3d',
// // //         marginLeft: hp(1),
// // //         textTransform: 'capitalize',
// // //         fontWeight: '400',
// // //     },
// // //     rightIcon: {
// // //         fontSize: hp(2.5),
// // //         color: '#fff',
// // //         backgroundColor: '#A6222C',
// // //         // marginRight: hp(-1),
// // //         padding: hp(1),
// // //         borderTopLeftRadius: hp(1.5),
// // //         borderBottomLeftRadius: hp(1.5),
// // //     },
// // //     distenceContainer: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //     },
// // //     locationIcon: {
// // //         fontSize: hp(2.2),
// // //         color: '#A6222C',
// // //         marginRight: hp(1)
// // //     },
// // //     btnContainer: {
// // //         alignSelf: 'center',
// // //     },
// // //     noDataText: {
// // //         marginTop: hp(40),
// // //         color: '#000',
// // //         fontSize: hp(2)
// // //     },
// // //     dropdown: {
// // //         alignSelf: "center",
// // //         marginTop: hp(3),
// // //         backgroundColor: '#ffe2cf'
// // //     },
// // //     dropdownButtonStyle: {
// // //         width: wp(87),
// // //         height: hp(6),
// // //         borderRadius: hp(1),
// // //         flexDirection: 'row',
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         paddingHorizontal: wp(2),
// // //         padding: hp(1),
// // //         borderWidth: 1,
// // //         borderColor: '#A6222C',
// // //         marginBottom: hp(0),
// // //         marginTop: hp(3),
// // //         alignSelf: 'center',
// // //         // fontFamily: "DMSans-Medium",
// // //     },
// // //     dropdownButtonTxtStyle: {
// // //         flex: 1,
// // //         fontSize: hp(1.8),
// // //         // color: 'gray',
// // //         padding: hp(0.5)
// // //         // fontFamily: "DMSans-Medium",
// // //     },
// // //     dropdownButtonArrowStyle: {
// // //         fontSize: hp(3.5),
// // //         color: "gray"
// // //     },
// // //     dropdownButtonIconStyle: {
// // //         fontSize: hp(3.5),
// // //         marginRight: wp(1),
// // //     },
// // //     dropdownMenuStyle: {
// // //         backgroundColor: '#E9ECEF',
// // //         borderRadius: hp(0.5),
// // //         marginTop: hp(-5)
// // //     },
// // //     dropdownItemStyle: {
// // //         width: '100%',
// // //         flexDirection: 'row',
// // //         paddingHorizontal: wp(1),
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         paddingVertical: hp(1),
// // //         borderBottomWidth: 0.20,
// // //         borderBottomColor: 'grey'
// // //     },
// // //     dropdownItemTxtStyle: {
// // //         flex: 1,
// // //         fontSize: hp(1.9),
// // //         fontWeight: '500',
// // //         color: '#151E26',
// // //         // fontFamily: "DMSans-Medium",
// // //     },
// // //     dropdownItemIconStyle: {
// // //         fontSize: hp(2),
// // //         marginRight: wp(1),
// // //     },
// // // });



// // import React, { useEffect, useState } from 'react';
// // import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, StatusBar, PermissionsAndroid, Platform } from 'react-native';
// // import AntDesign from '@react-native-vector-icons/ant-design';
// // import Ionicons from '@react-native-vector-icons/ionicons';
// // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // import { useNavigation } from '@react-navigation/native';
// // import { Authentication_Key } from '../../key/Key';
// // import { encryptPiDataNew } from '../Encryption/encryption';
// // import Icon from '@react-native-vector-icons/ant-design';
// // import { BaseUrl } from '../BaseUrl/BaseUrl';
// // import Geolocation from 'react-native-geolocation-service';
// // import SelectDropdown from 'react-native-select-dropdown';
// // import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
// // import { ActivityIndicator } from 'react-native-paper';

// // export default function StoreDealsHome() {
// //     const navigation = useNavigation();
// //     const EncKey = encryptPiDataNew(Authentication_Key);

// //     const [selectCategory, setSelectCategory] = useState([]);
// //     const [selectedCategory, setSelectedCategory] = useState(null);
// //     const [categoryid, setCategoryid] = useState(null);
// //     const [businessList, setBusinessList] = useState([]);
// //     const [loading, setLoading] = useState(false);

// //     const [latitude, setLatitude] = useState(null);
// //     const [longitude, setLongitude] = useState(null);

// //     useEffect(() => {
// //         getLocation();
// //         Category_Detsils_Get();
// //     }, []);

// //     const requestLocationPermission = async () => {
// //         if (Platform.OS === 'android') {
// //             const granted = await PermissionsAndroid.request(
// //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //                 {
// //                     title: 'Location Permission',
// //                     message: 'App needs access to your location',
// //                     buttonNeutral: 'Ask Me Later',
// //                     buttonNegative: 'Cancel',
// //                     buttonPositive: 'OK',
// //                 }
// //             );
// //             return granted === PermissionsAndroid.RESULTS.GRANTED;
// //         }
// //         return true;
// //     };

// //     const getLocation = async () => {
// //         const hasPermission = await requestLocationPermission();
// //         if (!hasPermission) {
// //             console.log('Location permission denied');
// //             return;
// //         }

// //         Geolocation.getCurrentPosition(
// //             (position) => {
// //                 setLatitude(position.coords?.latitude);
// //                 setLongitude(position.coords?.longitude);
// //             },
// //             (error) => {
// //                 console.log(error.code, error.message);
// //             },
// //             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
// //         );
// //     };

// //     const Category_Detsils_Get = async () => {
// //         try {
// //             const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
// //                 method: 'GET',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                     'authentication': EncKey
// //                 }
// //             });

// //             const data = await response.json();

// //             if (data.Response.Success === '1') {
// //                 const categories = data.Response.Result || [];
// //                 const allCategory = { id: null, title: 'All Categories' };
// //                 setSelectCategory([allCategory, ...categories]);
// //                 setSelectedCategory(allCategory);
// //                 setCategoryid(null);
// //             } else {
// //                 console.log(data?.Response.Message);
// //                 setSelectCategory([]);
// //             }
// //         } catch (error) {
// //             console.error('Fetch error:', error.message);
// //         }
// //     };

// //     useEffect(() => {
// //         if (latitude && longitude) {
// //             handleFetchNearByBus();
// //         }
// //     }, [latitude, longitude, categoryid]);

// //     const handleSelectCategory = (selectedItem) => {
// //         setSelectedCategory(selectedItem);
// //         setCategoryid(selectedItem?.id || null); // Set to null if All Categories
// //     };

// //     const handleFetchNearByBus = async () => {
// //         if (!latitude || !longitude) return;

// //         setLoading(true);
// //         try {
// //             const url = categoryid
// //                 ? `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}&catId=${categoryid}`
// //                 : `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}`;

// //             const response = await fetch(url, {
// //                 method: 'GET',
// //                 headers: {
// //                     authentication: EncKey,
// //                     'Content-Type': 'application/json',
// //                 },
// //             });

// //             const data = await response.json();

// //             if (data?.Response?.Success === '1') {
// //                 setBusinessList(data?.Response?.Result || []);
// //             } else {
// //                 setBusinessList([]);
// //                 console.warn('No data found or unsuccessful response');
// //             }
// //         } catch (error) {
// //             console.error('Error fetching businesses:', error.message);
// //             setBusinessList([]);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleSelectBusiness = (Result) => {
// //         navigation.navigate('StoreDetailes', { Result });
// //     };

// //     const renderBusinessItem = ({ item }) => (
// //         <TouchableOpacity
// //             style={styles.BusinessContainer}
// //             onPress={() => handleSelectBusiness(item)}>
// //             <Image
// //                 source={item.logo ? { uri: item.logo } : require('../../assets/images/Home/avaxaa.png')}
// //                 style={styles.businessImage}
// //             />
// //             <View style={styles.midSection}>
// //                 <Text style={styles.businessTitle}>{item.business_name}</Text>
// //                 <View style={styles.locationContainer}>
// //                     <Text style={styles.businessAddress}>{item.address}</Text>
// //                     <Text style={styles.businessCity}>{item.city_name}</Text>
// //                 </View>
// //                 <View style={styles.distenceContainer}>
// //                     <Ionicons style={styles.locationIcon} name="location" color="#000" />
// //                     <Text style={styles.businessDistance}>{item.distance?.toFixed(2)} km</Text>
// //                 </View>
// //             </View>
// //             <View style={styles.btnContainer}>
// //                 <AntDesign style={styles.rightIcon} name="right" color="#000" />
// //             </View>
// //         </TouchableOpacity>
// //     );

// //     return (
// //         <>
// //             <StatusBar  backgroundColor="#0000" />
// //             <View style={styles.container}>
// //                 <View style={styles.header}>
// //                     <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
// //                         <Icon name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
// //                         <Text style={styles.headerText}>STORE DEALS</Text>
// //                     </TouchableOpacity>
// //                 </View>

// //                 <SelectDropdown
// //                     data={selectCategory}
// //                     defaultValue={selectCategory[0]}
// //                     onSelect={(selectedItem) => handleSelectCategory(selectedItem)}
// //                     renderButton={(selectedItem, isOpened) => (
// //                         <View style={styles.dropdownButtonStyle}>
// //                             <Text style={styles.dropdownButtonTxtStyle}>
// //                                 {(selectedItem && selectedItem.title) || 'Select Business Category'}
// //                             </Text>
// //                             <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
// //                         </View>
// //                     )}
// //                     renderItem={(item, index, isSelected) => (
// //                         <View
// //                             style={{
// //                                 ...styles.dropdownItemStyle,
// //                                 ...(isSelected && { backgroundColor: '#A6222C', borderRadius: hp(0.5) }),
// //                                 borderWidth: 0.19,
// //                                 borderColor: '#bdbcbc',
// //                             }}>
// //                             <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? '#fff' : '#000', textAlign: 'center' }]}>
// //                                 {item.title}
// //                             </Text>
// //                         </View>
// //                     )}
// //                     showsVerticalScrollIndicator={false}
// //                     dropdownStyle={styles.dropdownMenuStyle}
// //                 />

// //                 <View style={styles.businessListContainer}>
// //                     {loading ? (
// //                         <ActivityIndicator size="large" color="#0000ff" />
// //                     ) : businessList.length === 0 ? (
// //                         <Text style={styles.noDataText}>No businesses found.</Text>
// //                     ) : (
// //                         <FlatList
// //                             data={businessList}
// //                             keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// //                             renderItem={renderBusinessItem}
// //                             contentContainerStyle={styles.list}
// //                         />
// //                     )}
// //                 </View>
// //             </View>
// //         </>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: { flex: 1, backgroundColor: '#fff' },
// //     header: {
// //         backgroundColor: '#A6222C',
// //         height: hp(11),
// //         padding: hp(1.5),
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //     },
// //     headerText: {
// //         color: '#fff',
// //         fontSize: hp(2),
// //         fontWeight: 'bold',
// //         marginTop: hp(3),
// //         marginLeft: wp(5),
// //     },
// //     dropdownButtonStyle: {
// //         width: wp(87),
// //         height: hp(6),
// //         borderRadius: hp(1),
// //         flexDirection: 'row',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         paddingHorizontal: wp(2),
// //         padding: hp(1),
// //         borderWidth: 1,
// //         borderColor: '#A6222C',
// //         marginTop: hp(3),
// //         alignSelf: 'center',
// //     },
// //     dropdownButtonTxtStyle: {
// //         flex: 1,
// //         fontSize: hp(1.8),
// //         padding: hp(0.5),
// //     },
// //     dropdownButtonArrowStyle: {
// //         fontSize: hp(3.5),
// //         color: 'gray',
// //     },
// //     dropdownMenuStyle: {
// //         backgroundColor: '#E9ECEF',
// //         borderRadius: hp(0.5),
// //         marginTop: hp(-5),
// //     },
// //     dropdownItemStyle: {
// //         width: '100%',
// //         flexDirection: 'row',
// //         paddingHorizontal: wp(1),
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         paddingVertical: hp(1),
// //         borderBottomWidth: 0.2,
// //         borderBottomColor: 'grey',
// //     },
// //     dropdownItemTxtStyle: {
// //         flex: 1,
// //         fontSize: hp(1.9),
// //         fontWeight: '500',
// //         color: '#151E26',
// //     },
// //     businessListContainer: { alignItems: 'center' },
// //     BusinessContainer: {
// //         backgroundColor: '#e0c7c9',
// //         width: wp(90),
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         padding: hp(1),
// //         borderRadius: hp(1.5),
// //         marginVertical: hp(1.5),
// //     },
// //     businessImage: {
// //         height: hp(13),
// //         width: hp(13),
// //         borderRadius: hp(1),
// //         resizeMode: 'stretch',
// //     },
// //     midSection: {
// //         marginLeft: hp(1),
// //         width: wp(49),
// //     },
// //     businessTitle: {
// //         fontSize: hp(1.9),
// //         fontWeight: 'bold',
// //         color: '#3d3d3d',
// //         marginVertical: hp(0.2),
// //         width: wp(50),
// //         flexWrap: 'wrap',
// //     },
// //     locationContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginVertical: hp(0.5),
// //         width: wp(50),
// //         flexWrap: 'wrap',
// //     },
// //     businessAddress: {
// //         fontSize: hp(1.8),
// //         color: '#3d3d3d',
// //         textTransform: 'capitalize',
// //         fontWeight: '400',
// //         marginRight: hp(1),
// //     },
// //     businessCity: {
// //         fontSize: hp(1.8),
// //         color: '#3d3d3d',
// //         textTransform: 'capitalize',
// //         fontWeight: '400',
// //     },
// //     businessDistance: {
// //         fontSize: hp(1.8),
// //         color: '#3d3d3d',
// //         marginVertical: hp(0.5),
// //         fontWeight: '500',
// //     },
// //     distenceContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     locationIcon: {
// //         fontSize: hp(2.2),
// //         color: '#A6222C',
// //         marginRight: hp(1),
// //     },
// //     btnContainer: {
// //         alignSelf: 'center',
// //     },
// //     rightIcon: {
// //         fontSize: hp(2.5),
// //         color: '#fff',
// //         backgroundColor: '#A6222C',
// //         padding: hp(1),
// //         borderTopLeftRadius: hp(1.5),
// //         borderBottomLeftRadius: hp(1.5),
// //     },
// //     noDataText: {
// //         marginTop: hp(10),
// //         color: '#000',
// //         fontSize: hp(2),
// //     },
// // });



// import React, { useEffect, useState } from 'react';
// import {
//     StyleSheet, Text, View, TouchableOpacity, FlatList, Image, StatusBar,
//     PermissionsAndroid, Platform
// } from 'react-native';
// import AntDesign from '@react-native-vector-icons/ant-design';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { useNavigation } from '@react-navigation/native';
// import { Authentication_Key } from '../../key/Key';
// import { encryptPiDataNew } from '../Encryption/encryption';
// import Icon from '@react-native-vector-icons/ant-design';
// import { BaseUrl } from '../BaseUrl/BaseUrl';
// import Geolocation from 'react-native-geolocation-service';
// import SelectDropdown from 'react-native-select-dropdown';
// import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
// import { ActivityIndicator } from 'react-native-paper';

// export default function StoreDealsHome() {
//     const navigation = useNavigation();
//     const EncKey = encryptPiDataNew(Authentication_Key);

//     const [selectCategory, setSelectCategory] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [categoryid, setCategoryid] = useState(null);
//     const [businessList, setBusinessList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [latitude, setLatitude] = useState(null);
//     const [longitude, setLongitude] = useState(null);

//     useEffect(() => {
//         getLocation();
//         Category_Detsils_Get();
//     }, []);

//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 {
//                     title: 'Location Permission',
//                     message: 'App needs access to your location',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 }
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true;
//     };

//     const getLocation = async () => {
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             console.log('Location permission denied');
//             return;
//         }

//         Geolocation.getCurrentPosition(
//             (position) => {
//                 setLatitude(position.coords?.latitude);
//                 setLongitude(position.coords?.longitude);
//             },
//             (error) => {
//                 console.log(error.code, error.message);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };

//     const Category_Detsils_Get = async () => {
//         try {
//             const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'authentication': EncKey
//                 }
//             });

//             const data = await response.json();

//             if (data.Response.Success === '1') {
//                 const categories = data.Response.Result || [];
//                 const allCategory = { id: null, title: 'All Categories' };
//                 setSelectCategory([allCategory, ...categories]);
//                 setSelectedCategory(allCategory);
//                 setCategoryid(null);
//             } else {
//                 console.log(data?.Response.Message);
//                 setSelectCategory([]);
//             }
//         } catch (error) {
//             console.error('Fetch error:', error.message);
//         }
//     };

//     useEffect(() => {
//         if (latitude && longitude) {
//             handleFetchNearByBus();
//         }
//     }, [latitude, longitude, categoryid]);

//     const handleSelectCategory = (selectedItem) => {
//         setSelectedCategory(selectedItem);
//         setCategoryid(selectedItem?.id || null);
//     };

//     const handleFetchNearByBus = async () => {
//         if (!latitude || !longitude) return;

//         setLoading(true);
//         try {
//             const url = categoryid
//                 ? `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}&catId=${categoryid}`
//                 : `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}`;

//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     authentication: EncKey,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             const data = await response.json();

//             if (data?.Response?.Success === '1') {
//                 setBusinessList(data?.Response?.Result || []);
//             } else {
//                 setBusinessList([]);
//                 console.warn('No data found or unsuccessful response');
//             }
//         } catch (error) {
//             console.error('Error fetching businesses:', error.message);
//             setBusinessList([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectBusiness = (Result) => {
//         navigation.navigate('StoreDetailes', { Result });
//     };

//     const renderBusinessItem = ({ item }) => (
//         <TouchableOpacity style={styles.BusinessContainer} onPress={() => handleSelectBusiness(item)}>
//             <Image
//                 source={item.logo ? { uri: item.logo } : require('../../assets/images/Home/avaxaa.png')}
//                 style={styles.businessImage}
//             />
//             <View style={styles.midSection}>
//                 <Text style={styles.businessTitle}>{item.business_name}</Text>
//                 <View style={styles.locationContainer}>
//                     <Text style={styles.businessAddress}>{item.address}</Text>
//                     <Text style={styles.businessCity}>{item.city_name}</Text>
//                 </View>
//                 <View style={styles.distenceContainer}>
//                     <Ionicons style={styles.locationIcon} name="location" color="#000" />
//                     <Text style={styles.businessDistance}>{item.distance?.toFixed(2)} km</Text>
//                 </View>
//             </View>
//             <View style={styles.btnContainer}>
//                 <AntDesign style={styles.rightIcon} name="right" color="#000" />
//             </View>
//         </TouchableOpacity>
//     );

//     return (
//         <>
//             <StatusBar  backgroundColor="#0000" />
//             <View style={styles.container}>
//                 <View style={styles.header}>
//                     <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
//                         <Icon name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
//                         <Text style={styles.headerText}>STORE DEALS</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <SelectDropdown
//                     data={selectCategory}
//                     defaultValue={selectCategory[0]}
//                     onSelect={handleSelectCategory}
//                     renderButton={(selectedItem, isOpened) => (
//                         <View style={styles.dropdownButtonStyle}>
//                             <Text style={styles.dropdownButtonTxtStyle}>
//                                 {(selectedItem && selectedItem.title) || 'Select Business Category'}
//                             </Text>
//                             <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
//                         </View>
//                     )}
//                     renderItem={(item, index, isSelected) => (
//                         <View
//                             style={{
//                                 ...styles.dropdownItemStyle,
//                                 backgroundColor: isSelected ? '#A6222C' : '#fff',
//                                 borderBottomColor: '#ccc',
//                             }}>
//                             <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? '#fff' : '#000' }]}>
//                                 {item.title}
//                             </Text>
//                         </View>
//                     )}
//                     dropdownStyle={styles.dropdownMenuStyle}
//                     showsVerticalScrollIndicator={false}
//                 />

//                 <View style={styles.businessListContainer}>
//                     {loading ? (
//                         <ActivityIndicator size="large" color="#A6222C" />
//                     ) : businessList.length === 0 ? (
//                         <Text style={styles.noDataText}>No businesses found.</Text>
//                     ) : (
//                         <FlatList
//                             data={businessList}
//                             keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                             renderItem={renderBusinessItem}
//                             contentContainerStyle={styles.list}
//                         />
//                     )}
//                 </View>
//             </View>
//         </>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff' },
//     header: {
//         backgroundColor: '#A6222C',
//         height: hp(11),
//         padding: hp(1.5),
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     headerText: {
//         color: '#fff',
//         fontSize: hp(2),
//         fontWeight: 'bold',
//         marginTop: hp(3),
//         marginLeft: wp(5),
//     },
//     dropdownButtonStyle: {
//         width: wp(90),
//         height: hp(6),
//         borderRadius: hp(1),
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: wp(2),
//         padding: hp(1),
//         borderWidth: 1,
//         borderColor: '#A6222C',
//         marginTop: hp(3),
//         alignSelf: 'center',
//         backgroundColor: '#e6f4ea',
//     },
//     dropdownButtonTxtStyle: {
//         flex: 1,
//         fontSize: hp(1.8),
//         padding: hp(0.5),
//         color: '#A6222C',
//         fontWeight: '600',
//     },
//     dropdownButtonArrowStyle: {
//         fontSize: hp(3.5),
//         color: '#A6222C',
//     },
//     dropdownMenuStyle: {
//         backgroundColor: '#fff',
//         borderRadius: hp(1),
//         borderWidth: 1,
//         borderColor: '#A6222C',
//         marginTop: hp(-6),
//     },
//     dropdownItemStyle: {
//         width: '100%',
//         paddingVertical: hp(1.3),
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//     },
//     dropdownItemTxtStyle: {
//         fontSize: hp(1.9),
//         fontWeight: '500',
//     },
//     businessListContainer: { alignItems: 'center' },
//     BusinessContainer: {
//         backgroundColor: '#e0c7c9',
//         width: wp(90),
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: hp(1),
//         borderRadius: hp(1.5),
//         marginVertical: hp(2),
//         marginBottom:hp(-0)
//     },
//     businessImage: {
//         height: hp(13),
//         width: hp(13),
//         borderRadius: hp(1),
//         resizeMode: 'stretch',
//     },
//     midSection: {
//         marginLeft: hp(1),
//         width: wp(49),
//     },
//     businessTitle: {
//         fontSize: hp(1.9),
//         fontWeight: 'bold',
//         color: '#3d3d3d',
//         marginVertical: hp(0.2),
//         width: wp(50),
//         flexWrap: 'wrap',
//     },
//     locationContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: hp(0.5),
//         width: wp(50),
//         flexWrap: 'wrap',
//     },
//     businessAddress: {
//         fontSize: hp(1.8),
//         color: '#3d3d3d',
//         textTransform: 'capitalize',
//         fontWeight: '400',
//         marginRight: hp(1),
//     },
//     businessCity: {
//         fontSize: hp(1.8),
//         color: '#3d3d3d',
//         textTransform: 'capitalize',
//         fontWeight: '400',
//     },
//     businessDistance: {
//         fontSize: hp(1.8),
//         color: '#3d3d3d',
//         marginVertical: hp(0.5),
//         fontWeight: '500',
//     },
//     distenceContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     locationIcon: {
//         fontSize: hp(2.2),
//         color: '#A6222C',
//         marginRight: hp(1),
//     },
//     btnContainer: {
//         alignSelf: 'center',
//     },
//     rightIcon: {
//         fontSize: hp(2.5),
//         color: '#fff',
//         backgroundColor: '#A6222C',
//         padding: hp(1),
//         borderTopLeftRadius: hp(1.5),
//         borderBottomLeftRadius: hp(1.5),
//     },
//     noDataText: {
//         marginTop: hp(30),
//         color: '#000',
//         fontSize: hp(2),
//     },
// });


import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, FlatList, Image, StatusBar,
    PermissionsAndroid, Platform
} from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import Icon from '@react-native-vector-icons/ant-design';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import Geolocation from 'react-native-geolocation-service';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function StoreDealsHome() {
    const navigation = useNavigation();
    const EncKey = encryptPiDataNew(Authentication_Key);

    const [selectCategory, setSelectCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryid, setCategoryid] = useState(null);
    const [businessList, setBusinessList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        getLocation();
        Category_Detsils_Get();
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.log('Location permission denied');
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords?.latitude);
                setLongitude(position.coords?.longitude);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const Category_Detsils_Get = async () => {
        try {
            const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': EncKey
                }
            });

            const data = await response.json();

            if (data.Response.Success === '1') {
                const categories = data.Response.Result || [];
                const allCategory = { id: null, title: 'All Categories' };
                setSelectCategory([allCategory, ...categories]);
                setSelectedCategory(allCategory);
                setCategoryid(null);
            } else {
                console.log(data?.Response.Message);
                setSelectCategory([]);
            }
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    useEffect(() => {
        if (latitude && longitude) {
            handleFetchNearByBus();
        }
    }, [latitude, longitude, categoryid]);

    const handleSelectCategory = (selectedItem) => {
        setSelectedCategory(selectedItem);
        setCategoryid(selectedItem?.id || null);
    };

    const handleFetchNearByBus = async () => {
        if (!latitude || !longitude) return;
    console.log('latitude ',latitude)

        setLoading(true);
        try {
            const url = categoryid
                ? `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}&catId=${categoryid}`
                : `${BaseUrl}businessGet/nearby?latitude=${latitude}&longitude=${longitude}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    authentication: EncKey,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data?.Response?.Success === '1') {
                setBusinessList(data?.Response?.Result || []);
            } else {
                setBusinessList([]);
                console.warn('No data found or unsuccessful response');
            }
        } catch (error) {
            console.error('Error fetching businesses:', error.message);
            setBusinessList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBusiness = (Result) => {
        navigation.navigate('StoreDetailes', { Result });
    };

    const renderBusinessItem = ({ item, index }) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} duration={600}>
            <TouchableOpacity style={styles.BusinessContainer} onPress={() => handleSelectBusiness(item)}>
                <Image
                    source={item.logo ? { uri: item.logo } : require('../../assets/images/Home/avaxaa.png')}
                    style={styles.businessImage}
                />
                <View style={styles.midSection}>
                    <Text style={styles.businessTitle}>{item.business_name}</Text>
                    <View style={styles.locationContainer}>
                        <Text style={styles.businessAddress}>{item.address}</Text>
                        <Text style={styles.businessCity}>{item.city_name}</Text>
                    </View>
                    <View style={styles.distenceContainer}>
                        <Ionicons style={styles.locationIcon} name="location" color="#A6222C" />
                        <Text style={styles.businessDistance}>{item.distance?.toFixed(2)} km</Text>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <AntDesign style={styles.rightIcon} name="right" color="#fff" />
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <>
            <StatusBar  backgroundColor="#A6222C" />
            <View style={styles.container}>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(0) }}>
                        <Icon name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text style={styles.headerText}>STORE DEALS</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeInDown" duration={1000} delay={300}>
                    <SelectDropdown
                        data={selectCategory}
                        defaultValue={selectCategory[0]}
                        onSelect={handleSelectCategory}
                        renderButton={(selectedItem, isOpened) => (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {(selectedItem && selectedItem.title) || 'Select Business Category'}
                                </Text>
                                <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View
                                style={{
                                    ...styles.dropdownItemStyle,
                                    backgroundColor: isSelected ? '#A6222C' : '#fff',
                                    borderBottomColor: '#ccc',
                                }}>
                                <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? '#fff' : '#000' }]}>
                                    {item.title}
                                </Text>
                            </View>
                        )}
                        dropdownStyle={styles.dropdownMenuStyle}
                        showsVerticalScrollIndicator={false}
                    />
                </Animatable.View>

                <View style={styles.businessListContainer}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#A6222C" style={styles.loaderView} />
                    ) : (
                        <FlatList
                            data={businessList}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={renderBusinessItem}
                            ListEmptyComponent={<Animatable.Text animation="fadeIn" duration={500} style={styles.noDataText}>No businesses found.</Animatable.Text>}
                            contentContainerStyle={styles.list}
                        />
                    ) }
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        backgroundColor: '#A6222C',
        height: hp(12),
        padding: hp(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop:hp(5)
    },
    headerText: {
        color: '#fff',
        fontSize: hp(2),
        fontWeight: 'bold',
        marginTop: hp(0),
        marginLeft: wp(5),
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
        borderColor: '#A6222C',
        marginTop: hp(3),
        alignSelf: 'center',
        backgroundColor: '#a6222d44',
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: hp(1.8),
        padding: hp(0.5),
        color: '#A6222C',
        fontWeight: '600',
    },
    dropdownButtonArrowStyle: {
        fontSize: hp(3.5),
        color: '#A6222C',
    },
    dropdownMenuStyle: {
        backgroundColor: '#fff',
        borderRadius: hp(1),
        borderWidth: 1,
        borderColor: '#A6222C',
        marginTop: hp(-6),
    },
    dropdownItemStyle: {
        width: '100%',
        paddingVertical: hp(1.3),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    dropdownItemTxtStyle: {
        fontSize: hp(1.9),
        fontWeight: '500',
    },
    businessListContainer: { alignItems: 'center' },
    BusinessContainer: {
        backgroundColor: '#a6222d1f',
        width: wp(90),
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: hp(1),
        borderRadius: hp(1.5),
        marginVertical: hp(2),
        marginBottom: hp(-0)
    },
    businessImage: {
        height: hp(13),
        width: hp(13),
        borderRadius: hp(1),
        resizeMode: 'stretch',
    },
    midSection: {
        marginLeft: hp(1),
        width: wp(49),
    },
    businessTitle: {
        fontSize: hp(1.9),
        fontWeight: 'bold',
        color: '#3d3d3d',
        marginVertical: hp(0.2),
        width: wp(50),
        flexWrap: 'wrap',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(0.5),
        width: wp(50),
        flexWrap: 'wrap',
    },
    businessAddress: {
        fontSize: hp(1.8),
        color: '#3d3d3d',
        textTransform: 'capitalize',
        fontWeight: '400',
        marginRight: hp(1),
    },
    businessCity: {
        fontSize: hp(1.8),
        color: '#3d3d3d',
        textTransform: 'capitalize',
        fontWeight: '400',
    },
    businessDistance: {
        fontSize: hp(1.8),
        color: '#3d3d3d',
        marginVertical: hp(0.5),
        fontWeight: '500',
    },
    distenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        fontSize: hp(2.2),
        color: '#A6222C',
        marginRight: hp(1),
    },
    btnContainer: {
        alignSelf: 'center',
    },
    rightIcon: {
        fontSize: hp(2.5),
        color: '#fff',
        backgroundColor: '#A6222C',
        padding: hp(1),
        borderTopLeftRadius: hp(1.5),
        borderBottomLeftRadius: hp(1.5),
    },
    noDataText: {
        marginTop: hp(30),
        color: '#000',
        fontSize: hp(2),
    },
    loaderView: {
        width: wp(100),
        height: hp(80),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center'
    },
});



