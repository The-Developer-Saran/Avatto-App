// // import React, { useState } from 'react';
// // import {
// //     View,
// //     TextInput,
// //     TouchableOpacity,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     StatusBar,
// //     Alert,
// //     KeyboardAvoidingView,
// //     Platform,
// // } from 'react-native';
// // import * as Animatable from 'react-native-animatable';
// // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // import Icon from '@react-native-vector-icons/ant-design';
// // import { BaseUrl } from '../BaseUrl/BaseUrl';
// // import { Authentication_Key } from '../../key/Key';
// // import { encryptPiDataNew } from '../Encryption/encryption';
// // import { Modal } from 'react-native';

// // export default function EducationForm({ navigation }) {

// //     const EncKey = encryptPiDataNew(Authentication_Key);
// //     const Uid = 12763;
// //     const [formData, setFormData] = useState({
// //         name: '',
// //         mobile: '',
// //         title: '',
// //         description: '',
// //         remarks: '',
// //     });
// //       const [successmodal, setSuccessmodal] = useState(false);

// //     const handleChange = (key, value) => {
// //         setFormData(prev => ({ ...prev, [key]: value }));
// //     };

// //     const validateForm = () => {
// //         const { name, mobile, title } = formData;

// //         if (!name || !mobile || !title) {
// //             Alert.alert('Error', 'Please fill all required fields: Name, Mobile No, Title');
// //             return false;
// //         }

// //         const phoneRegex = /^[0-9]{10}$/;
// //         if (!phoneRegex.test(mobile)) {
// //             Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
// //             return false;
// //         }

// //         return true;
// //     };

// //     const submitEducationForm = async () => {
// //         if (!validateForm()) return;

// //         const { name, mobile, title, description, remarks } = formData;

// //         const eduFormData = new FormData();
// //         eduFormData.append("user_id", Uid); // You can replace this with dynamic user_id if needed
// //         eduFormData.append("type", "I");
// //         eduFormData.append("name", name);
// //         eduFormData.append("mobile", mobile);
// //         eduFormData.append("title", title);
// //         eduFormData.append("description", description);
// //         eduFormData.append("remarks", remarks);

// //         try {
// //             const response = await fetch(`${BaseUrl}addcontact`, {
// //                 method: "POST",
// //                 headers: {
// //                     "authentication": EncKey,
// //                 },
// //                 body: eduFormData,
// //             });

// //             const data = await response.json();
// //             console.log('Server Response:', data);

// //             if (data?.Success === "1") {
// //                 // Alert.alert("Success", data.Message || "Form submitted successfully!");

// //                 setFormData({
// //                     name: '',
// //                     mobile: '',
// //                     title: '',
// //                     description: '',
// //                     remarks: '',
// //                 });
// //                 setSuccessmodal(true)
// //             } else {
// //                 Alert.alert("Error", data?.Response?.Message || "Failed to add Details.");
// //             }
// //         } catch (error) {
// //             console.log("Error:", error);
// //             Alert.alert("Error", "Something went wrong. Please try again.");
// //         }
// //     };


// //     return (
// //         <>
// //             {/* // <KeyboardAvoidingView
// //         //     style={{ flex: 1 }}
// //         //     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //         // > */}
// //             <StatusBar  backgroundColor='#0000' />
// //             <View style={styles.container}>


// //                 <View style={styles.header}>
// //                     <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
// //                         <Icon onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
// //                         <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>EDUCATION HUB</Text>
// //                     </TouchableOpacity>
// //                     <TouchableOpacity style={{ padding: hp(1), marginTop: hp(3) }}>
// //                     </TouchableOpacity>
// //                 </View>

// //                 <View style={{ marginTop: hp(3) }}>

// //                     <Animatable.View animation="fadeInDown" duration={600} style={styles.inputBox}>
// //                         <TextInput
// //                             placeholder="Name"
// //                             value={formData.name}
// //                             onChangeText={text => handleChange('name', text)}
// //                             style={styles.input}
// //                             placeholderTextColor="#3d6b47"
// //                         />
// //                     </Animatable.View>

// //                     <Animatable.View animation="fadeInDown" duration={700} style={styles.inputBox}>
// //                         <TextInput
// //                             placeholder="Mobile No"
// //                             keyboardType="phone-pad"
// //                             value={formData.mobile}
// //                             onChangeText={text => handleChange('mobile', text)}
// //                             style={styles.input}
// //                             placeholderTextColor="#3d6b47"
// //                             maxLength={10}
// //                         />
// //                     </Animatable.View>

// //                     <Animatable.View animation="fadeInDown" duration={800} style={styles.inputBox}>
// //                         <TextInput
// //                             placeholder="Title"
// //                             value={formData.title}
// //                             onChangeText={text => handleChange('title', text)}
// //                             style={styles.input}
// //                             placeholderTextColor="#3d6b47"
// //                         />
// //                     </Animatable.View>

// //                     <Animatable.View animation="fadeInDown" duration={900} style={styles.textArea}>
// //                         <TextInput
// //                             placeholder="Description"
// //                             value={formData.description}
// //                             onChangeText={text => handleChange('description', text)}
// //                             style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
// //                             multiline
// //                             placeholderTextColor="#3d6b47"
// //                         />
// //                     </Animatable.View>

// //                     <Animatable.View animation="fadeInDown" duration={1000} style={styles.textArea}>
// //                         <TextInput
// //                             placeholder="Remarks"
// //                             value={formData.remarks}
// //                             onChangeText={text => handleChange('remarks', text)}
// //                             style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
// //                             multiline
// //                             placeholderTextColor="#3d6b47"
// //                         />
// //                     </Animatable.View>

// //                     <Animatable.View animation="zoomIn" duration={1100}>
// //                         <TouchableOpacity style={styles.submitButton} onPress={()=>submitEducationForm()}>
// //                             <Text style={styles.submitText}>Submit</Text>
// //                         </TouchableOpacity>
// //                     </Animatable.View>
// //                 </View>



// //       {/* <Modal
// //         animationType="slide"
// //         transparent
// //         visible={successmodal}
// //         onRequestClose={() => {
// //           setSuccessmodal(!successmodal);
// //         }}>
// //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
// //           <View style={{ height: hp(40), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>

// //             <TouchableOpacity onPress={() => { setSuccessmodal(false); navigation.navigate('Footer') }} style={{ padding: hp(1), width: wp(25), backgroundColor: '#A6222C', borderRadius: hp(1), justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
// //               <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal> */}

// // <Modal
// //             isVisible={successmodal}
// //             animationIn="slideInUp"
// //             animationOut="slideOutDown"
// //             backdropColor="#000"
// //             backdropOpacity={0.7}
// //             onBackdropPress={() => setSuccessmodal(false)}
// //             useNativeDriver
// //         >
// //           <Animatable.View
// //                     animation="bounceIn"
// //                     duration={800}
// //                     style={{
// //                         backgroundColor: '#e8f8f0',
// //                         borderRadius: 20,
// //                         padding: 25,
// //                         width:wp(90),
// //                         marginTop:hp(30),
// //                         alignSelf:'center',
// //                         alignItems: 'center',
// //                         justifyContent:'center',
// //                         shadowColor: '#A6222C',
// //                         shadowOffset: { width: 0, height: 5 },
// //                         shadowOpacity: 0.25,
// //                         shadowRadius: 10,
// //                         elevation: 10,
// //                     }}
// //                 >
// //                               <Icon name="checkcircle" size={60} color="#A6222C" />
// //                     <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A6222C', marginTop: 15 }}>
// //                         Submitted Successfully!
// //                     </Text>
// //                     <Text style={{ fontSize: 14, color: '#1f3c2e', textAlign: 'center', marginTop: 10 }}>
// //                         Your education hub form has been sent. We will get back to you shortly.
// //                     </Text>

// //                 <TouchableOpacity
// //                     onPress={() => {
// //                         setSuccessmodal(false);
// //                         navigation.navigate('Footer');
// //                     }}
// //                     style={{
// //                         paddingVertical: hp(1),
// //                         paddingHorizontal: wp(8),
// //                         backgroundColor: '#A6222C',
// //                         borderRadius: hp(1),
// //                         justifyContent: 'center',
// //                         alignItems: 'center',
// //                         marginTop: hp(3),
// //                     }}
// //                 >

// //                     <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
// //                 </TouchableOpacity>
// //             </Animatable.View>
// //         </Modal>

// //             </View>
// //             {/* // </KeyboardAvoidingView> */}
// //         </>
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
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //     },

// //     headerText: {
// //         color: "#fff",
// //         fontSize: hp(2),
// //         fontWeight: "bold",
// //         marginTop: hp(3),
// //         marginLeft: wp(5),
// //         fontFamily: "DMSans-Medium",
// //     },
// //     inputBox: {
// //         width: wp(90),
// //         height: hp(6),
// //         alignSelf: "center",
// //         borderWidth: 1,
// //         borderColor: '#3d6b47',
// //         borderRadius: 10,
// //         justifyContent: 'center',
// //         marginBottom: 15,
// //         paddingHorizontal: 10,
// //         backgroundColor: '#f6fff9',
// //     },
// //     textArea: {
// //         width: wp(90),
// //         height: "auto",
// //         alignSelf: "center",
// //         borderWidth: 1,
// //         borderColor: '#3d6b47',
// //         borderRadius: 10,
// //         marginBottom: 15,
// //         paddingHorizontal: 10,
// //         backgroundColor: '#f6fff9',
// //     },
// //     input: {
// //         fontSize: 16,
// //         color: '#1f3c2e',
// //         paddingVertical: 10,
// //     },
// //     submitButton: {
// //         backgroundColor: '#A6222C',
// //         width: wp(60),
// //         height: hp(5),
// //         justifyContent: 'center',
// //         alignSelf: 'center',
// //         borderRadius: 8,
// //         alignItems: 'center',
// //         marginTop: hp(3),
// //         shadowColor: '#3d6b47',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.3,
// //         shadowRadius: 4,
// //         elevation: 5,
// //     },
// //     submitText: {
// //         color: '#fff',
// //         fontWeight: 'bold',
// //         fontSize: 16,
// //     },
// // });



// // // import React, { useState } from 'react';
// // // import {
// // //     View,
// // //     TextInput,
// // //     TouchableOpacity,
// // //     Text,
// // //     StyleSheet,
// // //     StatusBar,
// // //     Alert,
// // // } from 'react-native';
// // // import * as Animatable from 'react-native-animatable';
// // // import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// // // import Icon from '@react-native-vector-icons/ant-design';
// // // import { BaseUrl } from '../BaseUrl/BaseUrl';
// // // import { Authentication_Key } from '../../key/Key';
// // // import { encryptPiDataNew } from '../Encryption/encryption';

// // // export default function EducationForm({ navigation }) {
// // //     const EncKey = encryptPiDataNew(Authentication_Key);
// // //     const Uid = 12763;

// // //     const [name, setName] = useState('');
// // //     const [mobile, setMobile] = useState('');
// // //     const [title, setTitle] = useState('');
// // //     const [description, setDescription] = useState('');
// // //     const [remarks, setRemarks] = useState('');

// // //     const validateForm = () => {
// // //         if (!name || !mobile || !title) {
// // //             Alert.alert('Error', 'Please fill all required fields: Name, Mobile No, Title');
// // //             return false;
// // //         }

// // //         const phoneRegex = /^[0-9]{10}$/;
// // //         if (!phoneRegex.test(mobile)) {
// // //             Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
// // //             return false;
// // //         }

// // //         return true;
// // //     };

// // //     const submitEducationForm = async () => {
// // //         if (!validateForm()) return;

// // //         const eduFormData = new FormData();
// // //         eduFormData.append("user_id", Uid);
// // //         eduFormData.append("type", "I");
// // //         eduFormData.append("name", name);
// // //         eduFormData.append("mobile", mobile);
// // //         eduFormData.append("title", title);
// // //         eduFormData.append("description", description);
// // //         eduFormData.append("remarks", remarks);

// // //         console.log("eduFormData",eduFormData);


// // //         try {
// // //             const response = await fetch(`${BaseUrl}addcontact`, {
// // //                 method: "POST",
// // //                 headers: {
// // //                     "authentication": EncKey,
// // //                 },
// // //                 body: eduFormData,
// // //             });

// // //             const data = await response.json();
// // //             console.log('Server Response:', data);

// // //             if (data?.Success === "1") {
// // //                 Alert.alert("Success", data.Message || "Form submitted successfully!");
// // //                 setName('');
// // //                 setMobile('');
// // //                 setTitle('');
// // //                 setDescription('');
// // //                 setRemarks('');
// // //             } else {
// // //                 Alert.alert("Error", data?.Response?.Message || "Failed to add Details.");
// // //             }
// // //         } catch (error) {
// // //             console.log("Error:", error);
// // //             Alert.alert("Error", "Something went wrong. Please try again.");
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             <StatusBar  backgroundColor='#0000' />
// // //             <View style={styles.container}>
// // //                 <View style={styles.header}>
// // //                     <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
// // //                         <Icon name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
// // //                         <Text style={styles.headerText}>EDUCATION HUB</Text>
// // //                     </TouchableOpacity>
// // //                 </View>

// // //                 <View style={{ marginTop: hp(3) }}>
// // //                     <Animatable.View animation="fadeInDown" duration={600} style={styles.inputBox}>
// // //                         <TextInput
// // //                             placeholder="Name"
// // //                             value={name}
// // //                             onChangeText={setName}
// // //                             style={styles.input}
// // //                             placeholderTextColor="#3d6b47"
// // //                         />
// // //                     </Animatable.View>

// // //                     <Animatable.View animation="fadeInDown" duration={700} style={styles.inputBox}>
// // //                         <TextInput
// // //                             placeholder="Mobile No"
// // //                             keyboardType="phone-pad"
// // //                             value={mobile}
// // //                             onChangeText={setMobile}
// // //                             style={styles.input}
// // //                             placeholderTextColor="#3d6b47"
// // //                             maxLength={10}
// // //                         />
// // //                     </Animatable.View>

// // //                     <Animatable.View animation="fadeInDown" duration={800} style={styles.inputBox}>
// // //                         <TextInput
// // //                             placeholder="Title"
// // //                             value={title}
// // //                             onChangeText={setTitle}
// // //                             style={styles.input}
// // //                             placeholderTextColor="#3d6b47"
// // //                         />
// // //                     </Animatable.View>

// // //                     <Animatable.View animation="fadeInDown" duration={900} style={styles.textArea}>
// // //                         <TextInput
// // //                             placeholder="Description"
// // //                             value={description}
// // //                             onChangeText={setDescription}
// // //                             style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
// // //                             multiline
// // //                             placeholderTextColor="#3d6b47"
// // //                         />
// // //                     </Animatable.View>

// // //                     <Animatable.View animation="fadeInDown" duration={1000} style={styles.textArea}>
// // //                         <TextInput
// // //                             placeholder="Remarks"
// // //                             value={remarks}
// // //                             onChangeText={setRemarks}
// // //                             style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
// // //                             multiline
// // //                             placeholderTextColor="#3d6b47"
// // //                         />
// // //                     </Animatable.View>

// // //                     <Animatable.View animation="zoomIn" duration={1100}>
// // //                         <TouchableOpacity style={styles.submitButton} onPress={submitEducationForm}>
// // //                             <Text style={styles.submitText}>Submit</Text>
// // //                         </TouchableOpacity>
// // //                     </Animatable.View>
// // //                 </View>
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
// // //     inputBox: {
// // //         width: wp(90),
// // //         height: hp(6),
// // //         alignSelf: "center",
// // //         borderWidth: 1,
// // //         borderColor: '#3d6b47',
// // //         borderRadius: 10,
// // //         justifyContent: 'center',
// // //         marginBottom: 15,
// // //         paddingHorizontal: 10,
// // //         backgroundColor: '#f6fff9',
// // //     },
// // //     textArea: {
// // //         width: wp(90),
// // //         alignSelf: "center",
// // //         borderWidth: 1,
// // //         borderColor: '#3d6b47',
// // //         borderRadius: 10,
// // //         marginBottom: 15,
// // //         paddingHorizontal: 10,
// // //         backgroundColor: '#f6fff9',
// // //     },
// // //     input: {
// // //         fontSize: 16,
// // //         color: '#1f3c2e',
// // //         paddingVertical: 10,
// // //     },
// // //     submitButton: {
// // //         backgroundColor: '#A6222C',
// // //         width: wp(60),
// // //         height: hp(5),
// // //         justifyContent: 'center',
// // //         alignSelf: 'center',
// // //         borderRadius: 8,
// // //         alignItems: 'center',
// // //         marginTop: hp(3),
// // //         shadowColor: '#3d6b47',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.3,
// // //         shadowRadius: 4,
// // //         elevation: 5,
// // //     },
// // //     submitText: {
// // //         color: '#fff',
// // //         fontWeight: 'bold',
// // //         fontSize: 16,
// // //     },
// // // });


// import React, { useState } from 'react';
// import {
//     View,
//     TextInput,
//     TouchableOpacity,
//     Text,
//     StyleSheet,
//     ScrollView,
//     StatusBar,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     Image,
// } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Icon from '@react-native-vector-icons/ant-design';
// import { BaseUrl } from '../BaseUrl/BaseUrl';
// import { Authentication_Key } from '../../key/Key';
// import { encryptPiDataNew } from '../Encryption/encryption';
// import Modal from 'react-native-modal'; // ✅ Correct modal import

// export default function EducationForm({ navigation }) {

//     const EncKey = encryptPiDataNew(Authentication_Key);
//     const Uid = 12763;
//     const [formData, setFormData] = useState({
//         name: '',
//         mobile: '',
//         title: '',
//         description: '',
//         remarks: '',
//     });
//     const [successmodal, setSuccessmodal] = useState(false);
//     const [inputHeight, setInputHeight] = useState(120);

//     const handleChange = (key, value) => {
//         setFormData(prev => ({ ...prev, [key]: value }));
//     };

//     const validateForm = () => {
//         const { name, mobile, title } = formData;

//         if (!name || !mobile) {
//             Alert.alert('Error', 'Please fill all required fields: Name, Mobile No, Title');
//             return false;
//         }

//         const phoneRegex = /^[0-9]{10}$/;
//         if (!phoneRegex.test(mobile)) {
//             Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
//             return false;
//         }

//         return true;
//     };

//     const submitEducationForm = async () => {
//         if (!validateForm()) return;

//         const { name, mobile, description, } = formData;

//         const eduFormData = new FormData();
//         eduFormData.append("user_id", Uid);
//         eduFormData.append("type", "I");
//         eduFormData.append("name", name);
//         eduFormData.append("mobile", mobile);
//         eduFormData.append("title", "test");
//         eduFormData.append("description", description);
//         // eduFormData.append("remarks", remarks);

//         try {
//             const response = await fetch(`${BaseUrl}addcontact`, {
//                 method: "POST",
//                 headers: {
//                     "authentication": EncKey,
//                 },
//                 body: eduFormData,
//             });

//             const data = await response.json();
//             console.log('Server Response:', data);

//             if (data?.Success === "1") {
//                 setFormData({
//                     name: '',
//                     mobile: '',
//                     title: '',
//                     description: '',
//                     remarks: '',
//                 });
//                 setSuccessmodal(true);
//             } else {
//                 Alert.alert("Error", data?.Response?.Message || "Failed to add details.");
//             }
//         } catch (error) {
//             console.log("Error:", error);
//             Alert.alert("Error", "Something went wrong. Please try again.");
//         }
//     };

//     // const updateEducationForm = async () => {
//     //     if (!validateForm()) return;

//     //     const { name, mobile, title, description, remarks } = formData;

//     //     const eduFormData = new FormData();
//     //     eduFormData.append("user_id", Uid);
//     //     eduFormData.append("type", "I");
//     //     eduFormData.append("name", name);
//     //     eduFormData.append("mobile", mobile);
//     //     eduFormData.append("title", title);
//     //     eduFormData.append("description", description);
//     //     eduFormData.append("remarks", remarks);
//     //     eduFormData.append("status", 1);

//     //     try {
//     //         const response = await fetch(`${BaseUrl}updatecontact`, {
//     //             method: "POST",
//     //             headers: {
//     //                 "authentication": EncKey,
//     //             },
//     //             body: eduFormData,
//     //         });

//     //         const data = await response.json();
//     //         console.log('Server Response:', data);

//     //         if (data?.Success === "1") {
//     //             setFormData({
//     //                 name: '',
//     //                 mobile: '',
//     //                 title: '',
//     //                 description: '',
//     //                 remarks: '',
//     //             });
//     //             setSuccessmodal(true);
//     //         } else {
//     //             Alert.alert("Error", data?.Response?.Message || "Failed to add details.");
//     //         }
//     //     } catch (error) {
//     //         console.log("Error:", error);
//     //         Alert.alert("Error", "Something went wrong. Please try again.");
//     //     }
//     // };

//     return (
//         <>
//             <StatusBar  backgroundColor='#0000' />
//             <View style={styles.container}>
//                 <View style={styles.header}>
//                     <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(2) }}>
//                         <Icon name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
//                         <Text style={styles.headerText}>EDUCATION HUB</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: hp(1) }}>
//                     <Text style={styles.subheader}>Welcome to Avatto Education</Text>

//                     <View style={{ width: wp(100), height: hp(72), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
//                         {/* <Lottie resizeMode='contain' source={require('../assets/json/commingSoon.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop /> */}
//                         <Image
//                             source={require('../../assets/images/EducationHub/education.jpg')}
//                             style={styles.education}
//                             resizeMode="contain"
//                         />
//                     </View>


//                     <Text style={styles.subheader}>Contact Form</Text>
//                     <Animatable.View animation="fadeInDown" duration={600} style={styles.inputBox}>
//                         <TextInput
//                             placeholder="Name"
//                             value={formData.name}
//                             onChangeText={text => handleChange('name', text)}
//                             style={styles.input}
//                             placeholderTextColor="#3d6b47"
//                         />
//                     </Animatable.View>

//                     <Animatable.View animation="fadeInDown" duration={700} style={styles.inputBox}>
//                         <TextInput
//                             placeholder="Mobile No"
//                             keyboardType="phone-pad"
//                             value={formData.mobile}
//                             onChangeText={text => handleChange('mobile', text)}
//                             style={styles.input}
//                             placeholderTextColor="#3d6b47"
//                             maxLength={10}
//                         />
//                     </Animatable.View>

//                     {/* <Animatable.View animation="fadeInDown" duration={800} style={styles.inputBox}>
//                         <TextInput
//                             placeholder="Title"
//                             value={formData.title}
//                             onChangeText={text => handleChange('title', text)}
//                             style={styles.input}
//                             placeholderTextColor="#3d6b47"
//                         />
//                     </Animatable.View> */}

//                     {/* <Animatable.View animation="fadeInDown" duration={900} style={styles.textArea}>
//                         <TextInput
//                             placeholder="Description"
//                             value={formData.description}
//                             onChangeText={text => handleChange('description', text)}
//                             style={[styles.input, { height: "auto", textAlignVertical: 'top' }]}
//                             multiline
//                             placeholderTextColor="#3d6b47"
//                         />
//                     </Animatable.View> */}

//                     <Animatable.View animation="fadeInDown" duration={900} style={styles.textArea}>
//                         <TextInput
//                             placeholder="Description"
//                             value={formData.description}
//                             onChangeText={text => handleChange('description', text)}
//                             style={[styles.input, { height: Math.max(120, inputHeight), textAlignVertical: 'top' }]}
//                             multiline
//                             placeholderTextColor="#3d6b47"
//                             onContentSizeChange={(e) =>
//                                 setInputHeight(e.nativeEvent.contentSize.height)
//                             }
//                         />
//                     </Animatable.View>

//                     {/* <Animatable.View animation="fadeInDown" duration={1000} style={styles.textArea}>
//                         <TextInput
//                             placeholder="Remarks"
//                             value={formData.remarks}
//                             onChangeText={text => handleChange('remarks', text)}
//                             style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
//                             multiline
//                             placeholderTextColor="#3d6b47"
//                         />
//                     </Animatable.View> */}

//                     <Animatable.View animation="zoomIn" duration={1100}>
//                         <TouchableOpacity style={styles.submitButton} onPress={submitEducationForm}>
//                             <Text style={styles.submitText}>Submit</Text>
//                         </TouchableOpacity>
//                     </Animatable.View>
//                     <View style={{ height: hp(5) }}></View>
//                 </ScrollView>


//                 {/* ✅ Success Modal using react-native-modal */}
//                 <Modal
//                     isVisible={successmodal}
//                     animationIn="slideInUp"
//                     animationOut="slideOutDown"
//                     backdropColor="#000"
//                     backdropOpacity={0.7}
//                     onBackdropPress={() => setSuccessmodal(false)}
//                     useNativeDriver
//                 >
//                     <Animatable.View
//                         animation="bounceIn"
//                         duration={800}
//                         style={{
//                             backgroundColor: '#e8f8f0',
//                             borderRadius: 20,
//                             padding: 25,
//                             width: wp(90),
//                             alignSelf: 'center',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             shadowColor: '#A6222C',
//                             shadowOffset: { width: 0, height: 5 },
//                             shadowOpacity: 0.25,
//                             shadowRadius: 10,
//                             elevation: 10,
//                         }}
//                     >
//                         <Icon name="checkcircle" size={60} color="#A6222C" />
//                         <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A6222C', marginTop: 15 }}>
//                             Submitted Successfully!
//                         </Text>
//                         <Text style={{ fontSize: 14, color: '#1f3c2e', textAlign: 'center', marginTop: 10 }}>
//                             Your details form has been sent. We will get back to you shortly.
//                         </Text>

//                         <TouchableOpacity
//                             onPress={() => {
//                                 setSuccessmodal(false);
//                                 navigation.navigate('Footer');
//                             }}
//                             style={{
//                                 paddingVertical: hp(1),
//                                 paddingHorizontal: wp(8),
//                                 backgroundColor: '#A6222C',
//                                 borderRadius: hp(1),
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 marginTop: hp(3),
//                             }}
//                         >
//                             <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
//                         </TouchableOpacity>
//                     </Animatable.View>
//                 </Modal>
//             </View>
//         </>
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
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     headerText: {
//         color: "#fff",
//         fontSize: hp(2),
//         fontWeight: "bold",
//         marginTop: hp(3),
//         marginLeft: wp(5),
//         fontFamily: "DMSans-Medium",
//     },
//     inputBox: {
//         width: wp(90),
//         height: hp(6),
//         alignSelf: "center",
//         borderWidth: 1,
//         borderColor: '#3d6b47',
//         borderRadius: 10,
//         justifyContent: 'center',
//         marginBottom: 15,
//         paddingHorizontal: 10,
//         backgroundColor: '#f6fff9',
//     },
//     textArea: {
//         width: wp(90),
//         alignSelf: "center",
//         borderWidth: 1,
//         borderColor: '#3d6b47',
//         borderRadius: 10,
//         marginBottom: 15,
//         paddingHorizontal: 10,
//         backgroundColor: '#f6fff9',
//     },
//     input: {
//         fontSize: 16,
//         color: '#1f3c2e',
//         paddingVertical: 10,
//     },
//     submitButton: {
//         backgroundColor: '#A6222C',
//         width: wp(60),
//         height: hp(5),
//         justifyContent: 'center',
//         alignSelf: 'center',
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: hp(3),
//         shadowColor: '#3d6b47',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     submitText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: hp(2),
//     },
//     education: {
//         height: hp(75),
//         width: wp(100),
//     },
//     subheader: {
//         fontSize: hp(2.3),
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginVertical: hp(0),
//         color: '#A6222C'
//     },
// });


import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function EducationForm({ navigation }) {

    const EncKey = encryptPiDataNew(Authentication_Key);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        title: '',
        description: '',
        remarks: '',
    });
    const [successmodal, setSuccessmodal] = useState(false);
    const [validationModal, setValidationModal] = useState({
        visible: false,
        message: '',
    });
    const [inputHeight, setInputHeight] = useState(120);
      const isFocused = useIsFocused();



    const [profileData, setProfileData] = useState("");
    const [Uid, setUid] = useState(null);
    console.log("Uid", Uid);

    useEffect(() => {
        if (isFocused) {
            User_Details_Get();
        }
    }, [isFocused]);

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

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        const { name, mobile, title } = formData;

        if (!name || !mobile) {
            setValidationModal({
                visible: true,
                message: 'Please fill all required fields: Name, Mobile Number',
            });
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(mobile)) {
            setValidationModal({
                visible: true,
                message: 'Please enter a valid 10-digit mobile number',
            });
            return false;
        }

        return true;
    };

    const submitEducationForm = async () => {
        if (!validateForm()) return;

        const { name, mobile, description } = formData;

        const eduFormData = new FormData();
        eduFormData.append("user_id", Uid);
        eduFormData.append("type", "I");
        eduFormData.append("name", name);
        eduFormData.append("mobile", mobile);
        eduFormData.append("title", "test");
        eduFormData.append("description", description);

        try {
            const response = await fetch(`${BaseUrl}addcontact`, {
                method: "POST",
                headers: {
                    "authentication": EncKey,
                },
                body: eduFormData,
            });

            const data = await response.json();
            console.log('Server Response:', data);

            if (data?.Success === "1") {
                setFormData({
                    name: '',
                    mobile: '',
                    title: '',
                    description: '',
                    remarks: '',
                });
                setSuccessmodal(true);
            } else {
                setValidationModal({
                    visible: true,
                    message: data?.Response?.Message || "Failed to add details.",
                });
            }
        } catch (error) {
            console.log("Error:", error);
            setValidationModal({
                visible: true,
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(0) }}>
                        <Icon name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text style={styles.headerText}>EDUCATION HUB</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: hp(1) }}>
                    <Text style={styles.subheader}>Welcome to Avatto Education</Text>

                    <View style={{ width: wp(100), height: hp(72), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                        <Image
                            source={require('../../assets/images/EducationHub/education.jpg')}
                            style={styles.education}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.subheader}>Contact Form</Text>

                    <Animatable.View animation="fadeInDown" duration={600} style={styles.inputBox}>
                        <TextInput
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={text => handleChange('name', text)}
                            style={styles.input}
                            placeholderTextColor="#3d6b47"
                        />
                    </Animatable.View>

                    <Animatable.View animation="fadeInDown" duration={700} style={styles.inputBox}>
                        <TextInput
                            placeholder="Mobile No"
                            keyboardType="phone-pad"
                            value={formData.mobile}
                            onChangeText={text => handleChange('mobile', text)}
                            style={styles.input}
                            placeholderTextColor="#3d6b47"
                            maxLength={10}
                        />
                    </Animatable.View>

                    <Animatable.View animation="fadeInDown" duration={900} style={styles.textArea}>
                        <TextInput
                            placeholder="Description"
                            value={formData.description}
                            onChangeText={text => handleChange('description', text)}
                            style={[styles.input, { height: Math.max(120, inputHeight), textAlignVertical: 'top' }]}
                            multiline
                            placeholderTextColor="#3d6b47"
                            onContentSizeChange={(e) =>
                                setInputHeight(e.nativeEvent.contentSize.height)
                            }
                        />
                    </Animatable.View>

                    <Animatable.View animation="zoomIn" duration={1100}>
                        <TouchableOpacity style={styles.submitButton} onPress={submitEducationForm}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <View style={{ height: hp(5) }}></View>
                </ScrollView>

                {/* ✅ Success Modal */}
                <Modal
                    isVisible={successmodal}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    backdropColor="#000"
                    backdropOpacity={0.7}
                    onBackdropPress={() => setSuccessmodal(false)}
                    useNativeDriver
                >
                    <Animatable.View
                        animation="bounceIn"
                        duration={800}
                        style={{
                            backgroundColor: '#e8f8f0',
                            borderRadius: 20,
                            padding: 25,
                            width: wp(90),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#A6222C',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            elevation: 10,
                        }}
                    >
                        <Icon name="checkcircle" size={60} color="#A6222C" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A6222C', marginTop: 15 }}>
                            Submitted Successfully!
                        </Text>
                        <Text style={{ fontSize: 14, color: '#1f3c2e', textAlign: 'center', marginTop: 10 }}>
                            Your details form has been sent. We will get back to you shortly.
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setSuccessmodal(false);
                                navigation.navigate('Footer');
                            }}
                            style={{
                                paddingVertical: hp(1),
                                paddingHorizontal: wp(8),
                                backgroundColor: '#A6222C',
                                borderRadius: hp(1),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: hp(3),
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: hp(2), fontWeight: '600' }}>Done</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </Modal>

                {/* ✅ Custom Green-Themed Validation Alert Modal */}
                <Modal
                    isVisible={validationModal.visible}
                    animationIn="fadeInDown"
                    animationOut="fadeOutUp"
                    backdropColor="#000"
                    backdropOpacity={0.6}
                    onBackdropPress={() => setValidationModal({ visible: false, message: '' })}
                    useNativeDriver
                >
                    <Animatable.View
                        animation="zoomIn"
                        duration={500}
                        style={{
                            backgroundColor: '#e8f8f0',
                            borderRadius: 15,
                            padding: 20,
                            width: wp(85),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#A6222C',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            elevation: 8,
                        }}
                    >
                        <Icon name="exclamationcircle" size={50} color="red" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginTop: 10 }}>
                            Alert
                        </Text>
                        <Text style={{ fontSize: 15, color: '#1f3c2e', textAlign: 'center', marginTop: 10 }}>
                            {validationModal.message}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setValidationModal({ visible: false, message: '' })}
                            style={{
                                marginTop: 20,
                                paddingVertical: 8,
                                paddingHorizontal: 25,
                                backgroundColor: '#A6222C',
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>OK</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </Modal>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#A6222C',
        height: hp(8),
        padding: hp(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: "#fff",
        fontSize: hp(2),
        fontWeight: "bold",
        marginTop: hp(0),
        marginLeft: wp(5),
        fontFamily: "DMSans-Medium",
    },
    inputBox: {
        width: wp(90),
        height: hp(6),
        alignSelf: "center",
        borderWidth: 1,
        borderColor: '#3d6b47',
        borderRadius: 10,
        justifyContent: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f6fff9',
    },
    textArea: {
        width: wp(90),
        alignSelf: "center",
        borderWidth: 1,
        borderColor: '#3d6b47',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f6fff9',
    },
    input: {
        fontSize: 16,
        color: '#1f3c2e',
        paddingVertical: 10,
    },
    submitButton: {
        backgroundColor: '#A6222C',
        width: wp(60),
        height: hp(5),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: hp(3),
        shadowColor: '#3d6b47',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: hp(2),
    },
    education: {
        height: hp(75),
        width: wp(100),
    },
    subheader: {
        fontSize: hp(2.3),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: hp(0),
        color: '#A6222C'
    },
});



