// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     Alert,
//     ScrollView,
//     StatusBar,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Authentication_Key } from "../../key/Key";
// import { encryptPiDataNew } from "../Encryption/encryption";
// import { BaseUrl } from "../BaseUrl/BaseUrl";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Icon from '@react-native-vector-icons/ant-design';

// const AddBusinessScreen = ({ navigation }) => {

//     const EncKey = encryptPiDataNew(Authentication_Key)

//     const [form, setForm] = useState({
//         mobile: "",
//         email: "",
//         business_name: "",
//         latitude: "",
//         longitude: "",
//         address: "",
//         pincode: "",
//     });

//     console.log("pincode", form.pincode);

//     const [loading, setLoading] = useState(false);
//     const [city, setCity] = useState("");
//     const [state, setState] = useState("");


//     useEffect(() => {
//         if (form.pincode && form.pincode.length === 6) { // Added check for pincode being non-null
//             Loacation_Details_Get();
//         }
//     }, [form.pincode]);

//     const Loacation_Details_Get = async () => {
//         try {
//             const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${form.pincode}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'authentication': EncKey
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();

//             if (data.Response.Success === '1') {
//                 setCity(data.Response.Result[0].city_name);
//                 setState(data.Response.Result[0].state_name);
//             } else {
//                 console.log(data?.Response.Message);
//             }
//         } catch (error) {
//             console.error('Fetch error:', error);
//         }
//     };

//     const handleInputChange = (key, value) => {
//         setForm({ ...form, [key]: value });
//     };

//     const submitBusiness = async () => {
//         const {
//             mobile,
//             email,
//             business_name,
//             latitude,
//             longitude,
//             address,
//             pincode,
//             city,
//             state,
//         } = form;

//         if (
//             !mobile ||
//             !email ||
//             !business_name ||
//             !latitude ||
//             !longitude ||
//             !address ||
//             !pincode
//         ) {
//             Alert.alert("Error", "Please fill in all fields.");
//             return;
//         }
//         const user_mobile = mobile;
//         setLoading(true);
//         try {
//             const response = await axios.post(
//                 `${BaseUrl}businessAdd`,
//                 {
//                     user_mobile,
//                     mobile,
//                     email,
//                     business_name,
//                     latitude,
//                     longitude,
//                     address,
//                     pincode,
//                     city,
//                     state,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         authentication: EncKey,
//                     },
//                 }
//             );
//             console.log(response);
//             if (response.data.Success == "1") {
//                 Alert.alert("Success", response.data.message);
//                 // setForm({
//                 //     mobile: "",
//                 //     email: "",
//                 //     business_name: "",
//                 //     latitude: "",
//                 //     longitude: "",
//                 //     address: "",
//                 //     pincode: "",
//                 //     city: "",
//                 //     state: "",
//                 // });
//             } else {
//                 Alert.alert("Error", response.data.message || "Failed to add business.");
//             }
//         } catch (error) {
//             Alert.alert(
//                 "Error",
//                 error.response?.data?.message || "Something went wrong. Please try again."
//             );
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     return (
//         // <SafeAreaView style={{ flex: 1 }}>
//         //     <StatusBar backgroundColor={'#fff'}  barStyle={'dark-content'} />
//         <>
//             <StatusBar  backgroundColor='#0000' />
//             <View style={styles.container}>

//                 <View style={styles.header}>
//                     <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(1) }}>
//                         <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(2) }} />
//                         <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>APPOINT STORE</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <ScrollView showsVerticalScrollIndicator={false}>
//                     <View style={{ padding: hp(1), backgroundColor: '#fff' }}>
//                         <Text style={styles.subheader}>Add a Business</Text>
//                     </View>
//                     <View style={styles.subcontainer}>
//                         {[
//                             { label: "Mobile", key: "mobile", keyboardType: "phone-pad", maxLength: 10 },
//                             { label: "Email", key: "email", keyboardType: "email-address" },
//                             { label: "Business Name", key: "business_name", keyboardType: "default" },
//                             { label: "Latitude", key: "latitude", keyboardType: "numeric" },
//                             { label: "Longitude", key: "longitude", keyboardType: "numeric" },
//                             { label: "Address", key: "address", keyboardType: "default" },
//                             { label: "Pincode", key: "pincode", keyboardType: "numeric", maxLength: 6 },
//                             // { label: "City", key: "city", keyboardType: "default" },
//                             // { label: "State", key: "state", keyboardType: "default" },
//                         ].map((field) => (
//                             <View key={field.key} style={styles.inputContainer}>
//                                 <Text style={styles.label}>{field.label}</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={form[field.key]}
//                                     onChangeText={(value) => handleInputChange(field.key, value)}
//                                     placeholder={`Enter ${field.label}:`}
//                                     keyboardType={field.keyboardType}
//                                     maxLength={field.maxLength}
//                                 />
//                             </View>
//                         ))}

//                         <View style={styles.inputContainer}>
//                             <Text style={styles.label}>City</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 value={city}
//                                 // onChangeText={(value) => handleInputChange(field.key, value)}
//                                 placeholder={`Enter City:`}
//                                 keyboardType="default"
//                             />
//                         </View>

//                         <View style={styles.inputContainer}>
//                             <Text style={styles.label}>State</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 value={state}
//                                 // onChangeText={(value) => handleInputChange(field.key, value)}
//                                 placeholder={`Enter City:`}
//                                 keyboardType="default"
//                             />
//                         </View>
//                         <TouchableOpacity style={[styles.button, { backgroundColor: loading ? 'grey' : '#A6222C' }]} onPress={submitBusiness}>
//                             <Text style={styles.buttonText}>{loading ? "Loading" : "Submit"}</Text>
//                         </TouchableOpacity>
//                         <View style={{ height: hp(5) }}></View>
//                     </View>
//                 </ScrollView>
//             </View>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         backgroundColor: '#A6222C',
//         // backgroundColor: '#ff6000',
//         height: hp(12),
//         padding: hp(1.5),
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },

//     headerText: {
//         color: "#fff",
//         fontSize: hp(2),
//         fontWeight: "bold",
//         marginTop: hp(2),
//         marginLeft: wp(5),
//         fontFamily: "DMSans-Medium",
//     },

//     subcontainer: {
//         padding: hp(2),
//         backgroundColor: "#fff",
//     },
//     subheader: {
//         fontSize: hp(2.5),
//         fontWeight: "bold",
//         textAlign: "center",
//         color: "#A6222C",
//         marginTop: hp(1)
//     },
//     inputContainer: {
//         marginBottom: hp(2),
//     },
//     label: {
//         fontSize: hp(1.8),
//         color: "#555",
//         marginBottom: hp(0.5),
//     },
//     input: {
//         height: hp(6),
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: hp(1),
//         paddingHorizontal: hp(1.5),
//         backgroundColor: "#fff",
//     },
//     button: {
//         height: hp(5),
//         width: wp(50),
//         backgroundColor: '#A6222C',
//         borderRadius: hp(1),
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: hp(3),
//         alignSelf: 'center'
//     },
//     buttonText: {
//         color: "#fff",
//         fontSize: hp(2),
//         fontWeight: "bold",
//     },
// });

// export default AddBusinessScreen;


import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    StatusBar,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authentication_Key } from "../../key/Key";
import { encryptPiDataNew } from "../Encryption/encryption";
import { BaseUrl } from "../BaseUrl/BaseUrl";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from 'lottie-react-native';

const AddBusinessScreen = ({ navigation }) => {
    const EncKey = encryptPiDataNew(Authentication_Key);

    const isFocused = useIsFocused();

    const [form, setForm] = useState({
        mobile: "",
        email: "",
        business_name: "",
        latitude: "",
        longitude: "",
        address: "",
        pincode: "",
    });
    // const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [successModal, setSuccessModal] = useState(false);



    const [selectCategory, setSelectCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryid, setCategoryid] = useState(null);

    console.log("selectedCategory", selectedCategory);
    console.log("categoryid", categoryid);


    const [profileData, setProfileData] = useState("");
    const [profileMobile, setProfileMobile] = useState("");
    const [Uid, setUid] = useState(null);

    console.log("profileData", profileData);
    console.log("profileMobile", profileMobile);



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
                setUid(value)
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

                    if (data.Response.Success === '1') {
                        setProfileData(data.Response.Result);
                        setProfileMobile(data.Response.Result[0]?.mobile || ''); // Use optional chaining and fallback
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



    // const handleSelectCategory = (selectedItem, index) => {
    //     setSelectedCategory(selectedItem);
    //     setCategoryid(selectedItem.id)
    // };

    const handleSelectCategory = (selectedItem) => {
        setSelectedCategory(selectedItem);
        setCategoryid(selectedItem.id);

        // Update form state
        setForm(prevForm => ({
            ...prevForm,
            categoryid: selectedItem.id
        }));
    };



    useEffect(() => {
        Category_Detsils_Get();
    }, []);

    const Category_Detsils_Get = async () => {

        try {
            const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
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
                setSelectCategory(data.Response.Result);

            } else {
                console.log(data?.Response.Message);
                setSelectCategory(null);
            }
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    useEffect(() => {
        if (form.pincode && form.pincode.length === 6) { // Added check for pincode being non-null
            Loacation_Details_Get();
        }
    }, [form.pincode]);

    // const Loacation_Details_Get = async () => {
    //     try {
    //         const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${form.pincode}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authentication': EncKey
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         if (data.Response.Success === '1') {
    //             setCity(data.Response.Result[0].city_name);
    //             setState(data.Response.Result[0].state_name);
    //         } else {
    //             console.log(data?.Response.Message);
    //         }
    //     } catch (error) {
    //         console.error('Fetch error:', error);
    //     }
    // };

    const handleInputChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };


    const Loacation_Details_Get = async () => {
        try {
            const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${form.pincode}`, {
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
                const city_name = data.Response.Result[0].city_name;
                const state_name = data.Response.Result[0].state_name;

                // Update both form state and city/state variables
                setCity(city_name);
                setState(state_name);
                setForm(prevForm => ({
                    ...prevForm,
                    city: city_name,
                    state: state_name
                }));
            } else {
                console.log(data?.Response.Message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // const submitBusiness = async () => {
    //     const { mobile, email, business_name,categoryid, latitude, longitude, address, pincode, city, state } = form;

    //     if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
    //         Alert.alert("Error", "Please fill in all fields.");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await axios.post(
    //             `${BaseUrl}businessAdd`,
    //             { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state },
    //             { headers: { "Content-Type": "application/json", authentication: EncKey } }
    //         );

    //         if (response.data.Success == "1") {
    //             Alert.alert("Success", response.data.message);
    //         } else {
    //             Alert.alert("Error", response.data.message || "Failed to add business.");
    //         }
    //     } catch (error) {
    //         Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // const submitBusiness = async () => {
    //     const { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state } = form;

    //     // if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
    //     //     Alert.alert("Error", "Please fill in all fields.");
    //     //     return;
    //     // }

    //     // setLoading(true);

    //     const formData = new FormData();
    //     formData.append("user_mobile", profileMobile);
    //     formData.append("mobile", mobile);
    //     formData.append("email", email);
    //     formData.append("business_name", business_name);
    //     formData.append("category_id", categoryid);
    //     formData.append("latitude", latitude);
    //     formData.append("longitude", longitude);
    //     formData.append("address", address);
    //     formData.append("pincode", pincode);
    //     formData.append("city", city);
    //     formData.append("state", state);

    //     console.log("formData",formData);

    //     try {
    //         const response = await axios.post(
    //             `${BaseUrl}businessAdd`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                     authentication: EncKey
    //                 }
    //             }
    //         );

    //         console.log('response',response)

    //         if (response.data.Success == "1") {
    //             Alert.alert("Success", response.data.Message);
    //         } else {
    //             Alert.alert("Error", response.data.Message || "Failed to add business.");
    //         }
    //     } catch (error) {
    //         Alert.alert("Error", error.response?.data?.Message || "Something went wrong. Please try again.");
    //     } finally {
    //         // setLoading(false);
    //     }
    // };


    const submitBusiness = async () => {
        const { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state } = form;

        // if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
        //     Alert.alert("Error", "Please fill in all fields.");
        //     return;
        // }

        // setLoading(true);

        const formData = new FormData();
        formData.append("user_mobile", profileMobile);
        formData.append("mobile", mobile);
        formData.append("email", email);
        formData.append("business_name", business_name);
        formData.append("category_id", categoryid);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("address", address);
        formData.append("pincode", pincode);
        formData.append("city", city);
        formData.append("state", state);

        console.log("formData", formData);

        try {
            const response = await fetch(`${BaseUrl}businessAdd`, {
                method: "POST",
                headers: {
                    "authentication": EncKey
                },
                body: formData
            });

            const data = await response.json();
            console.log('response', data);

            if (data.Response.Success == "1") {
                // Alert.alert("Success", data.Response.Message);
                setSuccessModal(true)
            } else {
                Alert.alert("Error", data.Response.Message || "Failed to add business.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            // setLoading(false);
        }
    };


    return (
        <>
            <StatusBar  backgroundColor='#0000' />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={{ flexDirection: 'row', marginTop: hp(1) }}>
                        <Icon name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
                        <Text style={styles.headerText}>APPOINT STORE</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: hp(1), backgroundColor: '#fff' }}>
                        <Text style={styles.subheader}>Add a Business</Text>
                    </View>
                    <View style={styles.subcontainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Mobile</Text>
                            <TextInput style={styles.input} value={form.mobile} placeholder="Enter Mobile Number" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("mobile", value)} keyboardType="phone-pad" maxLength={10} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput style={styles.input} value={form.email} placeholder="Enter Email Address" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("email", value)} keyboardType="email-address" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Business Name</Text>
                            <TextInput style={styles.input} value={form.business_name} placeholder="Enter Business Name" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("business_name", value)} />
                        </View>
                        <Text style={styles.label}>Business Category</Text>
                        <SelectDropdown
                            defaultValue={selectedCategory?.title}
                            data={selectCategory}
                            onSelect={(selectedItem, index) => handleSelectCategory(selectCategory[index], index)}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View style={[styles.dropdownButtonStyle,]}>
                                        <Text style={[styles.dropdownButtonTxtStyle, { color: selectedItem ? "#000" : "gray" }]}>
                                            {(selectedItem && selectedItem.title) || "Select Business Category"}
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
                        />


                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Latitude</Text>
                            <TextInput style={styles.input} value={form.latitude} placeholder="Enter Latitude" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("latitude", value)} keyboardType="numeric" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Longitude</Text>
                            <TextInput style={styles.input} value={form.longitude} placeholder="Enter Longitude" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("longitude", value)} keyboardType="numeric" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput style={styles.input} value={form.address} placeholder="Enter Address" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("address", value)} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pincode</Text>
                            <TextInput style={styles.input} value={form.pincode} placeholder="Enter Pincode" placeholderTextColor="gray" onChangeText={(value) => handleInputChange("pincode", value)} keyboardType="numeric" maxLength={6} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>City</Text>
                            <TextInput style={styles.input} value={city} onChangeText={(value) => handleInputChange("city", value)} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>State</Text>
                            <TextInput style={styles.input} value={state} onChangeText={(value) => handleInputChange("state", value)} />
                        </View>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#A6222C' }]} onPress={() => submitBusiness()}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* =====================================================Success modal=============================================== */}
                <Modal
                    animationType="slide"
                    transparent
                    visible={successModal}
                    onRequestClose={() => {
                        setSuccessModal(!successModal);
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
                            <Lottie resizeMode='cover' source={require('../../assets/json/shopsuccess.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop />
                            <Text style={{ fontSize: hp(2.5), fontWeight: '500', color: '#000', marginTop: hp(3),textAlign:'center' }}>Business details added successfully</Text>
                            <TouchableOpacity onPress={() => { setSuccessModal(false), navigation.navigate('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
                                <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', height: hp(11), padding: hp(1.5), flexDirection: 'row', alignItems: 'center' },
    headerText: { color: "#fff", fontSize: hp(2), fontWeight: "bold", marginLeft: wp(5), marginTop: hp(3) },
    subcontainer: { padding: hp(2), backgroundColor: "#fff" },
    subheader: { fontSize: hp(2.5), fontWeight: "bold", textAlign: "center", color: "#A6222C", marginTop: hp(1) },
    inputContainer: { marginBottom: hp(2) },
    label: { fontSize: hp(1.8), color: "#555", marginBottom: hp(0.5) },
    input: { height: hp(6), borderWidth: 1, borderColor: "#ccc", borderRadius: hp(1), paddingHorizontal: hp(1.5), backgroundColor: "#fff" },
    button: { height: hp(5), width: wp(50), borderRadius: hp(1), justifyContent: "center", alignItems: "center", marginTop: hp(3), alignSelf: 'center' },
    buttonText: { color: "#fff", fontSize: hp(2), fontWeight: "bold" },
    dropdown: {
        alignSelf: "center",
        marginTop: hp(3),
        backgroundColor: '#ffe2cf'
    },
    dropdownButtonStyle: {
        width: wp(92),
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
        marginTop: hp(0),
        marginBottom: hp(2),
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
});

export default AddBusinessScreen;
