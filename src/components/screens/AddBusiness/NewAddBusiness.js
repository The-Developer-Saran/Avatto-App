import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, FlatList, ToastAndroid, StatusBar, BackHandler, Modal, Image, LogBox, Alert, PermissionsAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import AntDesign from '@react-native-vector-icons/ant-design';
import Icon from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ALERT_TYPE, Toast, AlertNotificationRoot } from 'react-native-alert-notification';
import Toast from 'react-native-toast-message';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from '@react-native-vector-icons/feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';



// =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Personal Information Component =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
const BusinessInfo = ({ mobile, setMobile, email, setEmail, businessName, setBusinessName, latitude, setLatitude, longitude, setLongitude, address, setAddress, city, setCity, state, setState, pincode, setPincode, selectCategory, setSelectCategory, selectedCategory, setSelectedCategory, AccountName, setAccountName, AccountNumber, setAccountNumber, BankName, setBankName, IFSCCode, setIFSCCode, pan, setPan, psa, setPsa, ApprovalStatus, setApprovalStatus, Bussid, setBussid, Contact_Person, setContact_Person, handleSelectCategory, submitBusiness, UpdateBusiness }) => {
    console.log("ApprovalStatus", ApprovalStatus);
    const navigation = useNavigation();
    // alert(Bussid)

    return (
        <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>

                <View style={{ width: wp(90), height: hp(4), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Add a Business</Text>
                    <View style={{ width: wp(30), height: hp(4), borderRadius: hp(1), backgroundColor: "#fff", elevation: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: ApprovalStatus == 0 ? "orangered" : ApprovalStatus == 1 ? "#fcb713" : '#A6222C', fontSize: hp(1.5), fontWeight: "bold", textAlign: 'center' }}>{ApprovalStatus == 0 ? "Pending" : ApprovalStatus == 1 ? "Processing" : ApprovalStatus == 2 ? "Approved" : null}</Text>
                    </View>
                </View>
                <TextInput
                    mode="outlined"
                    label="Mobile"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter MobileNumber"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    keyboardType="numeric"
                    value={mobile.toString()}
                    maxLength={10}
                    onChangeText={(value) => setMobile(value)}
                />
                <TextInput
                    mode="outlined"
                    label="Email"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter EmailID"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                />

                <TextInput
                    mode="outlined"
                    label="BusinessName"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter BusinessName"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={businessName}
                    onChangeText={(value) => setBusinessName(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Contact Person"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Contact Person Name"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={Contact_Person}
                    onChangeText={(value) => setContact_Person(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Avatto Commission"
                    // autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Profit Sharing Percentage"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    keyboardType="numeric"
                    value={psa}
                    maxLength={3}
                    onChangeText={(value) => setPsa(value)}
                />


                <SelectDropdown
                    defaultValue={selectedCategory?.title}
                    data={selectCategory}
                    onSelect={(selectedItem, index) => handleSelectCategory(selectCategory[index], index)}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={[styles.dropdownButtonStyle,]}>
                                <Text style={[styles.dropdownButtonTxtStyle, { color: selectedItem ? "#000" : "#000" }]}>
                                    {(selectedItem && selectedItem.title) || selectedCategory || "Select Business Category"}
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


                <TextInput
                    mode="outlined"
                    label="Latitude"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Latitude"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={String(latitude)}
                    onChangeText={(value) => setLatitude(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Longitutde"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Longitude"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={String(longitude)}
                    onChangeText={(value) => setLongitude(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Address"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Address"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={address}
                    onChangeText={(value) => setAddress(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Pincode"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Pincode"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={pincode.toString()}
                    onChangeText={(value) => setPincode(value)}
                />

                <TextInput
                    mode="outlined"
                    label="City"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter City"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={city}
                // onChangeText={(value) => setCity(value)}
                />

                <TextInput
                    mode="outlined"
                    label="State"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter State"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={state}
                //  onChangeText={(value) => setState(value)}
                />


                <View style={{ height: hp(1.5) }}></View>
            </View>
            <View style={{ height: hp(3) }}></View>

            <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
                <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Bank Details</Text>

                <TextInput
                    mode="outlined"
                    label="Account Name"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Account Name"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={AccountName}
                    onChangeText={(value) => setAccountName(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Account Number"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Account Number"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    keyboardType="numeric"
                    value={AccountNumber.toString()}
                    onChangeText={(value) => setAccountNumber(value)}
                />

                <TextInput
                    mode="outlined"
                    label="Bank Name"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Bank Name"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={BankName}
                    onChangeText={(value) => setBankName(value)}
                />

                <TextInput
                    mode="outlined"
                    label="IFSC Code"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter IFSC Code"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={IFSCCode}
                    onChangeText={(value) => setIFSCCode(value)}
                />


                <TextInput
                    mode="outlined"
                    label="Pan Number"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Enter Pan Number"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.8),
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
                    value={pan}
                    onChangeText={(value) => setPan(value)}
                />
                <View style={{ height: hp(1.5) }}></View>
            </View>


            {/* <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
                <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Address</Text>
                <TextInput
                    mode="outlined"
                    label="Address Line 1"
                    outlineColor="black"
                    placeholder="Address"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
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
                    value={Address1}
                    onChangeText={(value) => setAddress1(value)}
                />


                <TextInput
                    mode="outlined"
                    label="Address Line 2"
                    outlineColor="black"
                    placeholder="Address"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
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
                    value={Address2}
                    onChangeText={(value) => setAddress2(value)}
                />
      


                <TextInput
                    mode="outlined"
                    label="Pincode"
                    autoCapitalize="characters"
                    outlineColor="black"
                    placeholder="Pincode"
                    placeholderTextColor="gray"
                    style={{
                        width: wp(87),
                        backgroundColor: "#fff",
                        fontSize: hp(1.5),
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
                    keyboardType="numeric"
                    value={Pincode}
                    onChangeText={(value) => setPincode(value)}
                />


                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(0.5), alignSelf: 'center', marginTop: hp(2.5) }}>
                    <Text style={{ color: '#000', fontSize: hp(1.7), marginLeft: wp(2) }}>{city ? city : "City"}</Text>
   
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: hp(5.5), width: wp(87), borderWidth: 1, borderColor: '#A6222C', borderRadius: hp(0.5), alignSelf: 'center', marginTop: hp(2.5) }}>
                    <Text style={{ color: '#000', fontSize: hp(1.7), marginLeft: wp(2) }}>{State ? State : 'State'}</Text>
                  
                </TouchableOpacity>





                <View style={{ height: hp(1.5) }}></View>
            </View> */}
            {/* {
                ApprovalStatus == 1 ?
                    <TouchableOpacity onPress={() => submitBusiness()} style={{ padding: hp(1), width: wp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', borderRadius: hp(1), marginTop: hp(2), alignSelf: 'center' }}>
                        <Text style={{ color: '#fff' }}>Submit</Text>
                    </TouchableOpacity> :
                    <></>
            } */}

            {ApprovalStatus === 0 ? (
                <TouchableOpacity
                    // onPress={() => submitBusiness()}
                    onPress={() => Bussid !== null ? UpdateBusiness() : submitBusiness()}
                    style={{
                        // padding: hp(1),
                        width: wp(50),
                        height: hp(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#A6222C',
                        borderRadius: hp(1),
                        marginTop: hp(5),
                        alignSelf: 'center',
                    }}
                >
                    {/* <Text style={{ color: '#fff' }}>Submit</Text> */}
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: hp(2) }}>{Bussid !== null ? 'Update' : 'Submit'}</Text>
                </TouchableOpacity>
            ) : ApprovalStatus === 2 ? (
                navigation.navigate('BusinessDashboard')
            ) :
                <TouchableOpacity
                    // onPress={() => submitBusiness()}
                    onPress={() => Bussid !== null ? UpdateBusiness() : submitBusiness()}
                    style={{
                        // padding: hp(1),
                        width: wp(50),
                        height: hp(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#A6222C',
                        borderRadius: hp(1),
                        marginTop: hp(5),
                        alignSelf: 'center',
                    }}
                >
                    {/* <Text style={{ color: '#fff' }}>Submit</Text> */}
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: hp(2) }}>{Bussid !== null ? 'Update' : 'Submit'}</Text>
                </TouchableOpacity>

            }

            {/* 
            {ApprovalStatus === 0 ? (
                Bussid ? (
                    // Show Update Button if bussid exists
                    <TouchableOpacity
                        onPress={() => UpdateBusiness()}
                        style={{
                            padding: hp(1),
                            width: wp(30),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'green',
                            borderRadius: hp(1),
                            marginTop: hp(2),
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff' }}>Update</Text>
                    </TouchableOpacity>
                ) : (
                    // Show Submit Button if bussid does not exist
                    <TouchableOpacity
                        onPress={() => submitBusiness()}
                        style={{
                            padding: hp(1),
                            width: wp(30),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'green',
                            borderRadius: hp(1),
                            marginTop: hp(2),
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff' }}>Submit</Text>
                    </TouchableOpacity>
                )
            ) : ApprovalStatus === 2 ? (
                navigation.navigate('BusinessDashboard')
            ) : 
            <TouchableOpacity
            onPress={() => submitBusiness()}
            style={{
                padding: hp(1),
                width: wp(30),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'green',
                borderRadius: hp(1),
                marginTop: hp(2),
                alignSelf: 'center',
            }}
        >
            <Text style={{ color: '#fff' }}>Submit</Text>
        </TouchableOpacity>
            } */}


            <View style={{ height: hp(25) }}></View>

        </ScrollView>
    );
};

// =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Bank Details Component =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
const PictureManagement = ({ proof1, setProof1, proofName, setProofName, proof1Type, setProof1Type, proof1color, setproof1color, images, setImages, imagesid, setImagesid, logo, setLogo, addImages, setAddImages, takePicFromGallery, takeMultiPicsFromGallery, submitPictureManagement }) => {
    const navigation = useNavigation();
    //  alert(addImages)
    return (
        //     <ScrollView>
        //         <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
        //             <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Upload Logo</Text>

        //             {logo ? (
        //                 <TouchableOpacity
        //                     style={{
        //                         height: hp(15),
        //                         width: hp(15),
        //                         borderColor: '#A6222C',
        //                         borderWidth: 1,
        //                         borderRadius: responsiveHeight(0.8),
        //                         marginTop: responsiveHeight(1),
        //                         justifyContent: 'center',
        //                         alignItems: 'center',

        //                         alignSelf: "center",
        //                         borderStyle: "dashed",
        //                     }}
        //                     onPress={() => takePicFromGallery()}>
        //                     {/* <Lottie source={require('../../assets/json/tick.json')} style={{ height: responsiveHeight(10), width: responsiveHeight(10), alignSelf: "center", marginTop: responsiveHeight(-1.5) }} autoPlay />
        //             <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(-3),textAlign:'center' }}>Upload Successfully</Text> */}

        //                     <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
        //                         <Image
        //                             source={logo ? { uri: logo } : null}
        //                             style={{ width: hp(16.9), height: hp(16.9), backgroundColor: '#ccc', borderRadius: hp(1) }}
        //                         />
        //                         <TouchableOpacity onPress={() => takePicFromGallery(true)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
        //                             <Image
        //                                 source={require('../../assets/images/Profile/change.png')
        //                                 }
        //                                 // style={styles.changeimg}
        //                                 style={{
        //                                     width: hp(2.5),
        //                                     height: hp(2.5),
        //                                     tintColor: '#A6222C',
        //                                     fontWeight: 'bold'
        //                                 }}
        //                                 resizeMode="cover"
        //                             />
        //                         </TouchableOpacity>
        //                     </View>
        //                 </TouchableOpacity>
        //             ) : (
        //                 <TouchableOpacity
        //                     style={{
        //                         height: hp(16.9),
        //                         width: hp(16.9),
        //                         backgroundColor: "#fff",
        //                         // borderColor: proof1color ? '#A6222C' : 'red',
        //                         // borderWidth: 1,
        //                         borderRadius: responsiveHeight(0.8),
        //                         marginTop: responsiveHeight(1),
        //                         justifyContent: 'center',
        //                         alignItems: 'center',
        //                         alignSelf: "center",
        //                         // borderStyle: "dashed",
        //                         elevation: 5
        //                     }}
        //                     onPress={() => { takePicFromGallery(); setproof1color(true) }}>
        //                     <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' style={{}} />
        //                     <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Logo</Text>
        //                 </TouchableOpacity>
        //             )}


        //             <View style={{ height: hp(1.5) }}></View>
        //         </View>

        //         <View style={{ padding: hp(1.5), width: wp(95), alignSelf: 'center', marginTop: hp(2), backgroundColor: '#fff', borderRadius: hp(1), elevation: 5 }}>
        //             <Text style={{ color: '#A6222C', fontSize: hp(1.5), fontWeight: '700' }}>Additional Images</Text>

        //             {/* <ScrollView horizontal>
        //     <View style={{  marginTop:hp(1),flexWrap: 'wrap', justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
        //       {images.map((img, index) => (
        //         <TouchableOpacity key={index} onPress={() => takeMultiPicsFromGallery(index)}>
        //           <Image
        //             source={img ? { uri: img } : null}
        //             style={{ width:hp(15), height: hp(15), margin: 5, backgroundColor: '#ccc' }}
        //           />
        //         </TouchableOpacity>
        //       ))}
        //     </View>
        //   </ScrollView> */}

        //             <View style={{ padding: hp(1), alignItems: 'center' }}>
        //                 <ScrollView>
        //                     <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', borderRadius: hp(1) }}>
        //                         {addImages.map((img, index) => (
        //                             <TouchableOpacity key={index} onPress={() => takeMultiPicsFromGallery(index)} style={{ margin: hp(1.5), borderRadius: hp(1), backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), justifyContent: 'center', alignItems: 'center' }}>
        //                                 {
        //                                     img ?
        //                                         <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
        //                                             <Image
        //                                                 source={img ? { uri: img.url } : ""}
        //                                                 style={{ width: hp(16.9), height: hp(16.9), backgroundColor: '#ccc', borderRadius: hp(1) }}
        //                                             />
        //                                             <TouchableOpacity onPress={() => setProfileEdit(true)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
        //                                                 <Image
        //                                                     source={require('../../assets/images/Profile/change.png')
        //                                                     }
        //                                                     // style={styles.changeimg}
        //                                                     style={{
        //                                                         width: hp(2.5),
        //                                                         height: hp(2.5),
        //                                                         tintColor: '#A6222C',
        //                                                         fontWeight: 'bold'
        //                                                     }}
        //                                                     resizeMode="cover"
        //                                                 />
        //                                             </TouchableOpacity>
        //                                         </View> :
        //                                         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        //                                             <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' style={{}} />
        //                                             <Text style={{ textAlign: "center", fontSize: hp(1.8), marginTop: hp(2) }}>Upload Image</Text>
        //                                         </View>
        //                                 }

        //                             </TouchableOpacity>
        //                         ))}
        //                     </View>
        //                 </ScrollView>
        //             </View>


        //             <View style={{ height: hp(1.5) }}></View>
        //         </View>

        //         <TouchableOpacity onPress={() => submitPictureManagement()} style={{ padding: hp(1), width: wp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', borderRadius: hp(1), marginTop: hp(2), alignSelf: 'center' }}>
        //             <Text style={{ color: '#fff', fontWeight: "bold" }}>Submit</Text>
        //         </TouchableOpacity>
        //         <View style={{ height: hp(3) }}></View>

        //         <View style={{ height: hp(30) }}></View>
        //     </ScrollView>

        <ScrollView style={{ padding: 20 }}>
            {/* 📌 Logo Upload */}
            <Text style={{ fontSize: hp(2), fontWeight: 'bold', marginBottom: hp(1), color: '#454545' }}>Business Logo :</Text>
            <TouchableOpacity onPress={() => takePicFromGallery()} style={{ alignItems: 'center', marginBottom: hp(3), marginTop: hp(2) }}>
                {logo ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                        <Image source={{ uri: logo }} style={{ width: hp(17), height: hp(17), borderRadius: 10 }} />
                        <TouchableOpacity onPress={() => takePicFromGallery()} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/images/Profile/change.png')
                                }
                                // style={styles.changeimg}
                                style={{
                                    width: hp(2.5),
                                    height: hp(2.5),
                                    tintColor: '#A6222C',
                                    fontWeight: 'bold'
                                }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                        <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' />
                        <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Logo</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* 📌 Multi-Image Upload */}
            <Text style={{ fontSize: hp(2), fontWeight: 'bold', marginBottom: hp(1), color: '#454545' }}>Additional Images :</Text>
            {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {addImages.map((img, index) => (
                    <TouchableOpacity key={index} onPress={() => takeMultiPicsFromGallery(index)} style={{  marginBottom:hp(3) ,marginTop:hp(2) }}>
                        {img ? (
                      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            <Image source={{ uri: images[index] ? images[index] : img.url }} style={{ width:hp(17), height:hp(17), borderRadius: 10 }} />
                            <TouchableOpacity onPress={() => takeMultiPicsFromGallery(index)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/images/Profile/change.png')
                                }
                                // style={styles.changeimg}
                                style={{
                                    width: hp(2.5),
                                    height: hp(2.5),
                                    tintColor: '#A6222C',
                                    fontWeight: 'bold'
                                }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        </View>
                        ) : (
                            <View style={{ width: 100, height: 100, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text>Upload Logo</Text>
                                <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' style={{}} />
                                <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Logo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View> */}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>

                {/* First Image */}
                <TouchableOpacity onPress={() => takeMultiPicsFromGallery(0)} style={{ marginBottom: hp(3), marginTop: hp(2) }}>
                    {addImages[0] ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            <Image source={{ uri: images[0] ? images[0] : addImages[0].url }} style={{ width: hp(17), height: hp(17), borderRadius: 10 }} />
                            <TouchableOpacity onPress={() => takeMultiPicsFromGallery(0)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/Profile/change.png')}
                                    style={{ width: hp(2.5), height: hp(2.5), tintColor: '#A6222C', fontWeight: 'bold' }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            {/* <Text>Upload Logo</Text> */}
                            <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' />
                            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Second Image */}
                <TouchableOpacity onPress={() => takeMultiPicsFromGallery(1)} style={{ marginBottom: hp(3), marginTop: hp(2) }}>
                    {addImages[1] ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            <Image source={{ uri: images[1] ? images[1] : addImages[1].url }} style={{ width: hp(17), height: hp(17), borderRadius: 10 }} />
                            <TouchableOpacity onPress={() => takeMultiPicsFromGallery(1)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/Profile/change.png')}
                                    style={{ width: hp(2.5), height: hp(2.5), tintColor: '#A6222C', fontWeight: 'bold' }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            {/* <Text>Upload Logo</Text> */}
                            <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' />
                            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Third Image */}
                <TouchableOpacity onPress={() => takeMultiPicsFromGallery(2)} style={{ marginBottom: hp(3), marginTop: hp(2) }}>
                    {addImages[2] ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            <Image source={{ uri: images[2] ? images[2] : addImages[2].url }} style={{ width: hp(17), height: hp(17), borderRadius: 10 }} />
                            <TouchableOpacity onPress={() => takeMultiPicsFromGallery(2)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/Profile/change.png')}
                                    style={{ width: hp(2.5), height: hp(2.5), tintColor: '#A6222C', fontWeight: 'bold' }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            {/* <Text>Upload Logo</Text> */}
                            <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' />
                            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => takeMultiPicsFromGallery(3)} style={{ marginBottom: hp(3), marginTop: hp(2) }}>
                    {addImages[3] ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            <Image source={{ uri: images[3] ? images[3] : addImages[2].url }} style={{ width: hp(17), height: hp(17), borderRadius: 10 }} />
                            <TouchableOpacity onPress={() => takeMultiPicsFromGallery(3)} style={{ width: hp(4), height: hp(4), backgroundColor: '#fff', borderRadius: hp(2.5), position: 'absolute', left: wp(26), bottom: hp(12.5), justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/Profile/change.png')}
                                    style={{ width: hp(2.5), height: hp(2.5), tintColor: '#A6222C', fontWeight: 'bold' }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 5, width: hp(17), height: hp(17), borderRadius: hp(1) }}>
                            {/* <Text>Upload Logo</Text> */}
                            <Feather name='file-plus' size={responsiveFontSize(2.9)} color='gray' />
                            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.7), fontWeight: "normal", fontFamily: "DMSans-Medium", marginTop: responsiveHeight(.7) }}>Upload Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

            </View>

            {/* 📌 Submit Button */}
            <TouchableOpacity onPress={submitPictureManagement} style={{ backgroundColor: '#A6222C', width: wp(50), height: hp(5), alignItems: 'center', borderRadius: hp(1), justifyContent: 'center', alignSelf: 'center', marginTop: hp(5) }}>
                <Text style={{ color: 'white', fontSize: hp(2), fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>
            <View style={{ height: hp(30) }}></View>
        </ScrollView>



    );
};

// =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Main Component =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
const NewAddBusiness = ({ navigation }) => {
    // const [menuSelect, setMenuSelect] = useState(true);
    // const [Name, setName] = useState('');
    // const [Mobile, setMobile] = useState('');
    // const [Email, setEmail] = useState('');
    // const [Pan, setPan] = useState('');
    // const [Address1, setAddress1] = useState('');
    // const [Address2, setAddress2] = useState('');
    // const [city, setCity] = useState('');
    // const [CityId, setCityId] = useState('');
    // const [State, setState] = useState('');
    // const [StateId, setStateId] = useState('');
    // const [Pincode, setPincode] = useState('');
    // const [AccountName, setAccountName] = useState('');
    // const [AccountNumber, setAccountNumber] = useState('');
    // const [IFSCCode, setIFSCCode] = useState('');
    // const [isLoaded, setIsloaded] = useState(true);
    // const [uid, setUid] = useState('');

    const [menuSelect, setMenuSelect] = useState(true);
    const [isLoaded, setIsloaded] = useState(true);
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [Contact_Person, setContact_Person] = useState("");
    // const [latitude, setLatitude] = useState("");
    // const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [AccountName, setAccountName] = useState('');
    const [AccountNumber, setAccountNumber] = useState('');
    const [BankName, setBankName] = useState('');
    const [IFSCCode, setIFSCCode] = useState('');
    const [pan, setPan] = useState('');
    const [ApprovalStatus, setApprovalStatus] = useState(0);
    const [Bussid, setBussid] = useState('');



    // const [getmobile, setGetmobile] = useState("");
    // const [getemail, setGetemail] = useState("");
    // const [getbusinessName, setGetbusinessName] = useState("");
    // const [getlatitude, setGetlatitude] = useState("");
    // const [getlongitude, setGetlongitude] = useState("");
    // const [getaddress, setGetaddress] = useState("");
    // const [getpincode, setGetpincode] = useState("");
    // const [getAccountName, setGetAccountName] = useState('');
    // const [getAccountNumber, setGetAccountNumber] = useState('');
    // const [getIFSCCode, setGetIFSCCode] = useState('');
    // const [getpan, setGetPan] = useState('');


    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [cityId, setCityId] = useState("");
    const [stateId, setStateId] = useState("");
    const [getcity, setGetcity] = useState("");
    const [getstate, setgetstate] = useState("");
    const [successModal, setSuccessModal] = useState(false);


    console.log("city", city);
    console.log("pan", pan);



    console.log("state", state);

    const [profileData, setProfileData] = useState("");
    const [businessData, setBusinessData] = useState("");
    const [profileMobile, setProfileMobile] = useState("");
    const [Uid, setUid] = useState(null);

    // const [proof1, setProof1] = useState(null);
    // const [proofName, setProofName] = useState(null);
    // const [proof1Type, setProof1Type] = useState(null);
    // const [proof1color, setproof1color] = useState(true);

    // const [images, setImages] = useState([null, null, null, null]);
    // const [imagesid, setImagesid] = useState([]);

    // const [logo, setLogo] = useState("");
    const [addImages, setAddImages] = useState([]);

    // console.log("businessData", businessData);
    // console.log("logo", logo);
    // console.log("images", addImages);

    const [psa, setPsa] = useState(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState(null);
    const [logoType, setLogoType] = useState(null);

    const [images, setImages] = useState([null, null, null, null]);
    const [imageNames, setImageNames] = useState(["", "", "", ""]);
    const [imageTypes, setImageTypes] = useState(["", "", "", ""]);
    const [imagesid, setImagesid] = useState(["1", "2", "3", "4"]); // Example image IDs


    console.log("images", addImages);


    //==============================================Location Fetch==========================================
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        getLocation();
    }, [])

    // Request location permission for Android
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
                setLocation(position.coords);
                setLatitude(position.coords?.latitude)
                setLongitude(position.coords?.longitude)
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    console.log("latitude", latitude);
    console.log("longitude", longitude);


    const [selectCategory, setSelectCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryid, setCategoryid] = useState(null);

    console.log("categoryid", categoryid);

    const handleSelectCategory = (selectedItem, index) => {
        setSelectedCategory(selectedItem);
        setCategoryid(selectedItem.id)
    };


    const EncKey = encryptPiDataNew(Authentication_Key)
    const isFocused = useIsFocused();


    // const [proof1, setProof1] = useState(null);
    // const [proofName, setProofName] = useState(null);
    // const [proof1Type, setProof1Type] = useState(null);
    // const [proof1color, setproof1color] = useState(true);


    // const takePicFromGallery = () => {
    //     ImageCropPicker.openPicker({
    //         width: 2048, // or something else depending on your use case
    //         height: 1024, // same as above
    //         compressImageQuality: 1,
    //     }).then(image => {
    //         let extension = image.path.split('.').pop().toString();
    //         if (extension == "mp4" || extension == "avi" || extension == "mov" || extension == "3gp" || extension == "mpeg" || extension == "mpg" || extension == "m4v" || extension == "pdf") {
    //             // ToastAndroid.showWithGravityAndOffset(
    //             //   'Invalid file format only images',
    //             //   ToastAndroid.LONG,
    //             //   ToastAndroid.BOTTOM,
    //             //   25,
    //             //   50
    //             // );
    //             alert('Invalid file format only images');
    //         }
    //         else {
    //             setProof1(image.path);
    //             setProofName(image.path.split('/').pop().toString())
    //             setProof1Type(image.mime);
    //             // ToastAndroid.showWithGravityAndOffset(
    //             //   'Image selected successfully! ',
    //             //   ToastAndroid.LONG,
    //             //   ToastAndroid.BOTTOM,
    //             //   25,
    //             //   50
    //             // );
    //             alert('Image selected successfully!');
    //         }
    //     }).catch(error => {
    //         // ToastAndroid.showWithGravityAndOffset(
    //         //   'Failed to upload image. ',
    //         //   ToastAndroid.LONG,
    //         //   ToastAndroid.BOTTOM,
    //         //   25,
    //         //   50
    //         // );
    //         alert('Failed to upload image');
    //     }

    //     )
    // }


    // const [images, setImages] = useState([]);

    // const takeMultiPicsFromGallery = () => {
    //   ImageCropPicker.openPicker({
    //     multiple: true,
    //     maxFiles: 4,
    //     mediaType: 'photo',
    //     compressImageQuality: 1,
    //   })
    //     .then(selectedImages => {
    //       if (selectedImages.length > 4) {
    //         Alert.alert('You can only select up to 4 images');
    //         return;
    //       }
    //       setImages(selectedImages.map(img => img.path));
    //       Alert.alert('Images selected successfully!');
    //     })
    //     .catch(error => {
    //       Alert.alert('Failed to upload image');
    //     });
    // };

    // const [images, setImages] = useState([null, null, null, null]);
    // const [imagesid, setImagesid] = useState([null, null, null, null]);

    // console.log("imagesid", imagesid);

    // const [imagesName, setImagesName] = useState([null, null, null, null]);
    // const [imagesType, setImagesType] = useState([null, null, null, null]);

    // const takeMultiPicsFromGallery = (index) => {
    //     ImageCropPicker.openPicker({
    //         mediaType: 'photo',
    //         compressImageQuality: 1,
    //     })
    //         .then(image => {
    //             const updatedImages = [...images];
    //             updatedImages[index] = image.path;
    //             setImages(updatedImages);
    //         })
    //         .catch(error => {
    //             Alert.alert('Failed to upload image');
    //         });
    // };


    // const takeMultiPicsFromGallery = (index) => {
    //     ImageCropPicker.openPicker({
    //         width: 2048,
    //         height: 1024,
    //         compressImageQuality: 1,
    //     }).then(image => {
    //         let extension = image.path.split('.').pop().toLowerCase();
    //         const invalidFormats = ["mp4", "avi", "mov", "3gp", "mpeg", "mpg", "m4v", "pdf"];

    //         if (invalidFormats.includes(extension)) {
    //             alert('Invalid file format. Only images are allowed.');
    //         } else {
    //             const updatedImages = [...images];
    //             updatedImages[index] = image.path;
    //             setImages(updatedImages);
    //             setImagesid(index +1)
    //             alert('Image selected successfully!');
    //         }
    //     }).catch(error => {
    //         alert('Failed to upload image');
    //     });
    // };



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
                        setProfileMobile(data.Response.Result[0]?.mobile || '');
                    } else {
                        console.log(data?.Response?.Message || 'Unknown error');
                        setProfileData(null);
                    }

                } catch (error) {
                    console.error('Fetch error:', error.message);
                } finally {
                    setIsloaded(false); // Ensure loading state updates in all cases
                }
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
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
        if (pincode.length === 6) {
            Loacation_Details_Get();
        }
    }, [pincode]);

    const Loacation_Details_Get = async () => {
        try {
            const response = await fetch(`${BaseUrl}cityGet?req_type=1&res_type=1&pincode=${pincode}`, {
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
                setCityId(data.Response.Result[0].id);
                setState(data.Response.Result[0].state_name);
                setStateId(data.Response.Result[0].state_id);
            } else {
                console.log(data?.Response.Message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };



    useEffect(() => {
        if (isFocused) {
            Business_Details_Get();
        }
    }, [isFocused]);

    // const Business_Details_Get = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

    //         if (value !== null) {
    //             // alert(value)
    //             setUid(value)
    //             try {
    //                 const response = await fetch(
    //                     `${BaseUrl}vendorLogin?uId=${value}`,
    //                     {
    //                         method: 'GET',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             authentication: EncKey,
    //                         },
    //                     }
    //                 );

    //                 if (!response.ok) {
    //                     throw new Error(`Network response was not ok: ${response.status}`);
    //                 }

    //                 const data = await response.json();

    //                 if (data.Response.Success === '1') {
    //                     setBusinessData(data.Response.Result);
    //                     setGetmobile(data.Response.Result[0]?.mobile || ''); 
    //                     setGetemail(data.Response.Result[0]?.email || ''); 
    //                     setGetbusinessName(data.Response.Result[0]?.business_name || ''); 
    //                     // setSelectedCategory(data.Response.Result[0]?.mobile || ''); 
    //                     setGetlatitude(data.Response.Result[0]?.latitude || ''); 
    //                     setGetlongitude(data.Response.Result[0]?.longitude || ''); 
    //                     setGetaddress(data.Response.Result[0]?.address || ''); 
    //                     setGetpincode(data.Response.Result[0]?.pincode || ''); 
    //                     // setCity(data.Response.Result[0]?.mobile || ''); 
    //                     // setState(data.Response.Result[0]?.mobile || ''); 
    //                     setGetAccountName(data.Response.Result[0]?.account_holder_name || ''); 
    //                     setGetAccountNumber(data.Response.Result[0]?.account_number || ''); 
    //                     setGetIFSCCode(data.Response.Result[0]?.account_IFSC || ''); 
    //                     setGetPan(data.Response.Result[0]?.account_pan_number || ''); 
    //                 } else {
    //                     console.log(data?.Response?.Message || 'Unknown error');
    //                     setBusinessData(null);
    //                 }

    //             } catch (error) {
    //                 console.error('Fetch error:', error.message);
    //             } finally {
    //                 setIsloaded(false); // Ensure loading state updates in all cases
    //             }
    //         } else {
    //             console.log('No user data found in AsyncStorage.');
    //         }
    //     } catch (error) {
    //         console.error('Error reading AsyncStorage:', error.message);
    //     }
    // };


    const Business_Details_Get = async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                setUid(value)
                try {
                    const response = await fetch(
                        `${BaseUrl}businessGet?uId=${value}&req_type=1&res_type=1`,
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
                        setBusinessData(data.Response.Result);
                        setBussid(data.Response.Result[0]?.id || null);
                        setMobile(data.Response.Result[0]?.mobile || '');
                        setEmail(data.Response.Result[0]?.email || '');
                        setBusinessName(data.Response.Result[0]?.business_name || '');
                        setContact_Person(data.Response.Result[0]?.contact_person || '');
                        setPsa(data.Response.Result[0]?.psa || '');
                        setSelectedCategory(data.Response.Result[0]?.category_names || '');
                        setLatitude(data.Response.Result[0]?.latitude || '');
                        setLongitude(data.Response.Result[0]?.longitude || '');
                        setAddress(data.Response.Result[0]?.address || '');
                        setPincode(data.Response.Result[0]?.pincode || '');
                        setCity(data.Response.Result[0]?.city_name || '');
                        setState(data.Response.Result[0]?.state_name || '');
                        setAccountName(data.Response.Result[0]?.account_holder_name || '');
                        setAccountNumber(data.Response.Result[0]?.account_number || '');
                        setBankName(data.Response.Result[0]?.account_bank_name || '');
                        setIFSCCode(data.Response.Result[0]?.account_IFSC || '');
                        setPan(data.Response.Result[0]?.account_pan_number || '');
                        setLogo(data.Response.Result[0]?.logo || '');
                        setAddImages(data.Response.Result[0]?.additional_images || '');
                        setApprovalStatus(data.Response.Result[0]?.approval_status || "");
                    } else {
                        console.log(data?.Response?.Message || 'Unknown error');
                        setBusinessData(null);
                        setBussid(null);
                    }

                } catch (error) {
                    console.error('Fetch error:', error.message);
                } finally {
                    setIsloaded(false); // Ensure loading state updates in all cases
                }
            } else {
                console.log('No user data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error reading AsyncStorage:', error.message);
        }
    };


    const submitBusiness = async () => {
        // const { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state } = form;

        // if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
        //     Alert.alert("Error", "Please fill in all fields.");
        //     return;
        // }

        // setLoading(true);

        const formData = new FormData();
        formData.append("user_mobile", profileMobile);
        formData.append("mobile", mobile);
        formData.append("email", email);
        formData.append("business_name", businessName);
        formData.append("category_names", Contact_Person);
        formData.append("psa", psa);
        formData.append("category_id", categoryid);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("address", address);
        formData.append("pincode", pincode);
        formData.append("city", cityId);
        formData.append("state", stateId);
        formData.append("account_holder_name", AccountName);
        formData.append("account_number", AccountNumber);
        formData.append("acc_bank_name", BankName);
        formData.append("account_IFSC", IFSCCode);
        formData.append("account_pan_number", pan);

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


    const UpdateBusiness = async () => {
        // const { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state } = form;

        // if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
        //     Alert.alert("Error", "Please fill in all fields.");
        //     return;
        // }

        // setLoading(true);

        const formData = new FormData();
        formData.append("id", Bussid);
        formData.append("user_id", Uid);
        formData.append("mobile", mobile);
        formData.append("email", email);
        formData.append("business_name", businessName);
        formData.append("category_names", Contact_Person);
        formData.append("psa", psa);
        formData.append("category_id", categoryid);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("address", address);
        formData.append("pincode", pincode);
        formData.append("city", cityId);
        formData.append("state", stateId);
        formData.append("account_holder_name", AccountName);
        formData.append("account_number", AccountNumber);
        formData.append("acc_bank_name", BankName);
        formData.append("account_IFSC", IFSCCode);
        formData.append("account_pan_number", pan);
        // if (proof1) {
        //     formData.append("logo", {
        //         uri: proof1,
        //         name: proofName,
        //         type: proof1Type
        //     });
        // }
        // formData.append("additional_imagesId", imagesid);
        // if (images) {
        //     formData.append("additional_images", {
        //         uri: images,
        //     });
        // }


        // Append logo image if available
        // if (proof1) {
        //     formData.append("logo", {
        //         uri: proof1,  // Image URI
        //         name: proofName || "logo.jpg",  // Image file name
        //         type: proof1Type || "image/jpeg" // Image MIME type
        //     });
        // }

        // // Append additional images if available (multiple images handling)
        // if (images && images.length > 0) {
        //     images.forEach((img, index) => {
        //         formData.append(`additional_images[${index}]`, {
        //             uri: img.uri,
        //             name: img.fileName || `image_${index}.jpg`,
        //             type: img.type || "image/jpeg"
        //         });
        //     });
        // }

        console.log("formData", formData);

        try {
            const response = await fetch(`${BaseUrl}businessUpdate`, {
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


    // const submitPictureManagement = async () => {
    //     // const { mobile, email, business_name, categoryid, latitude, longitude, address, pincode, city, state } = form;

    //     // if (!mobile || !email || !business_name || !categoryid || !latitude || !longitude || !address || !pincode) {
    //     //     Alert.alert("Error", "Please fill in all fields.");
    //     //     return;
    //     // }

    //     // setLoading(true);

    //     const NewformData = new FormData();
    //     NewformData.append("id", Bussid);
    //     NewformData.append("user_id", Uid);
    //     if (proof1) {
    //         NewformData.append("logo", {
    //             uri: proof1,
    //             name: proofName,
    //             type: proof1Type
    //         });
    //     }
    //     NewformData.append("additional_imagesId", imagesid);
    //     if (images) {
    //         NewformData.append("additional_images", {
    //             uri: images,
    //         });
    //     }

    //     console.log("formData", NewformData);

    //     try {
    //         const response = await fetch(`${BaseUrl}businessUpdate`, {
    //             method: "POST",
    //             headers: {
    //                 "authentication": EncKey
    //             },
    //             body: NewformData
    //         });

    //         const data = await response.json();
    //         console.log('response', data);

    //         if (data.Response.Success == "1") {
    //             // Alert.alert("Success", data.Response.Message);
    //             setSuccessModal(true)
    //         } else {
    //             Alert.alert("Error", data.Response.Message || "Failed to add businessImages.");
    //         }
    //     } catch (error) {
    //         Alert.alert("Error", "Something went wrong. Please try again.");
    //     } finally {
    //         // setLoading(false);
    //     }
    // };




    // const takePicFromGallery = () => {
    //     ImageCropPicker.openPicker({
    //         width: 2048,
    //         height: 1024,
    //         compressImageQuality: 1,
    //     }).then(image => {
    //         let extension = image.path.split('.').pop().toLowerCase();
    //         const invalidFormats = ["mp4", "avi", "mov", "3gp", "mpeg", "mpg", "m4v", "pdf"];

    //         if (invalidFormats.includes(extension)) {
    //             alert('Invalid file format. Only images are allowed.');
    //         } else {
    //             setProof1(image.path);
    //             setProofName(image.path.split('/').pop());
    //             setProof1Type(image.mime);
    //             alert('Image selected successfully!');
    //         }
    //     }).catch(() => {
    //         alert('Failed to upload image');
    //     });
    // };

    // const takeMultiPicsFromGallery = (index) => {
    //     ImageCropPicker.openPicker({
    //         width: 2048,
    //         height: 1024,
    //         compressImageQuality: 1,
    //     }).then(image => {
    //         let extension = image.path.split('.').pop().toLowerCase();
    //         const invalidFormats = ["mp4", "avi", "mov", "3gp", "mpeg", "mpg", "m4v", "pdf"];

    //         if (invalidFormats.includes(extension)) {
    //             alert('Invalid file format. Only images are allowed.');
    //         } else {
    //             let updatedImages = [...images];
    //             let updatedImagesId = [...imagesid];

    //             updatedImages[index] = image.path;
    //             updatedImagesId[index] = index + 1; // Ensure correct indexing

    //             setImages(updatedImages);
    //             setImagesid(updatedImagesId);
    //             alert('Image selected successfully!');
    //         }
    //     }).catch(() => {
    //         alert('Failed to upload image');
    //     });
    // };

    // const submitPictureManagement = async () => {
    //     const NewformData = new FormData();
    //     NewformData.append("id", Bussid);
    //     NewformData.append("user_id", Uid);

    //     if (proof1) {
    //         NewformData.append("logo", {
    //             uri: proof1,
    //             name: proofName,
    //             type: proof1Type
    //         });
    //     }

    //     imagesid.forEach((id, index) => {
    //         if (images[index]) {
    //             NewformData.append(`additional_images[${id}]`, {
    //                 uri: images[index],
    //                 name: `image_${id}.jpg`,
    //                 type: "image/jpeg"
    //             });
    //         }
    //     });

    //     console.log("FormData:", NewformData);

    //     try {
    //         const response = await fetch(`${BaseUrl}businessUpdate`, {
    //             method: "POST",
    //             headers: {
    //                 "authentication": EncKey
    //             },
    //             body: NewformData
    //         });

    //         const data = await response.json();
    //         console.log('Response:', data);

    //         if (data.Response.Success == "1") {
    //             setSuccessModal(true);
    //         } else {
    //             Alert.alert("Error", data.Response.Message || "Failed to add business images.");
    //         }
    //     } catch (error) {
    //         Alert.alert("Error", "Something went wrong. Please try again.");
    //     }
    // };



    // // 📌 Pick Logo from Gallery
    // const takePicFromGallery = () => {
    //     ImageCropPicker.openPicker({
    //         width: 2048,
    //         height: 1024,
    //         compressImageQuality: 1,
    //     }).then(image => {
    //         setLogo(image.path);
    //         setLogoName(image.path.split('/').pop());
    //         setLogoType(image.mime);
    //         Alert.alert("Success", "Logo selected successfully!");
    //     }).catch(() => {
    //         Alert.alert("Error", "Failed to upload logo");
    //     });
    // };

    // // 📌 Pick Multiple Images
    // const takeMultiPicsFromGallery = (index) => {
    //     ImageCropPicker.openPicker({
    //         width: 2048,
    //         height: 1024,
    //         compressImageQuality: 1,
    //     }).then(image => {
    //         let updatedImages = [...images];
    //         let updatedNames = [...imageNames];
    //         let updatedTypes = [...imageTypes];

    //         updatedImages[index] = image.path;
    //         updatedNames[index] = image.path.split('/').pop();
    //         updatedTypes[index] = image.mime;

    //         setImages(updatedImages);
    //         setImageNames(updatedNames);
    //         setImageTypes(updatedTypes);

    //         Alert.alert("Success", `Image ${index + 1} selected successfully!`);
    //     }).catch(() => {
    //         Alert.alert("Error", "Failed to upload image");
    //     });
    // };

    // // 📌 Submit Form Data
    // const submitPictureManagement = async () => {
    //     const NewformData = new FormData();
    //     NewformData.append("id", Bussid);
    //     NewformData.append("user_id", Uid);

    //     if (logo) {
    //         NewformData.append("logo", {
    //             uri: logo,
    //             name: logoName,
    //             type: logoType
    //         });
    //     }

    //     // Append images IDs as JSON string
    //     NewformData.append("additional_imagesId", JSON.stringify(imagesid));

    //     images.forEach((img, index) => {
    //         if (img) {
    //             NewformData.append(`additional_images`, {
    //                 uri: img,
    //                 name: imageNames[index],
    //                 type: imageTypes[index]
    //             });
    //         }
    //     });

    //     console.log("FormData:", NewformData);

    //     try {
    //         // const response = await fetch("https://your-api.com/upload", {
    //         //     method: "POST",
    //         //     headers: {
    //         //         "authentication": "your-auth-key"
    //         //     },
    //         //     body: NewformData
    //         // });
    //         const response = await fetch(`${BaseUrl}businessUpdate`, {
    //             method: "POST",
    //             headers: {
    //                 "authentication": EncKey
    //             },
    //             body: NewformData
    //         });

    //         const data = await response.json();
    //         console.log('Response:', data);

    //         if (data.Response.Success == "1") {
    //             setSuccessModal(true);
    //         } else {
    //             Alert.alert("Error", data.Response.Message || "Failed to add business images.");
    //         }
    //     } catch (error) {
    //         Alert.alert("Error", "Something went wrong. Please try again.");
    //     }
    // };


    const takePicFromGallery = () => {
        ImageCropPicker.openPicker({
            width: 2048,
            height: 1024,
            compressImageQuality: 1,
        }).then(image => {
            setLogo(image.path);
            setLogoName(image.path.split("/").pop());
            setLogoType(image.mime);
            Alert.alert("Success", "Logo selected successfully!");
        }).catch(() => {
            Alert.alert("Error", "Failed to upload logo");
        });
    };

    // 📌 Select Multiple Images for Specific ID
    const takeMultiPicsFromGallery = (index) => {
        ImageCropPicker.openPicker({
            width: 2048,
            height: 1024,
            compressImageQuality: 1,
        }).then(image => {
            let updatedImages = [...images];
            let updatedNames = [...imageNames];
            let updatedTypes = [...imageTypes];

            updatedImages[index] = image.path; // Update image path
            updatedNames[index] = image.path.split("/").pop(); // Extract file name
            updatedTypes[index] = image.mime; // Extract MIME type

            setImages(updatedImages);
            setImageNames(updatedNames);
            setImageTypes(updatedTypes);

            Alert.alert("Success", `Image ${index + 1} selected successfully!`);
        }).catch(() => {
            Alert.alert("Error", "Failed to upload image");
        });
    };

    // 📌 Submit Form Data
    const submitPictureManagement = async () => {
        const NewformData = new FormData();
        NewformData.append("id", Bussid);
        NewformData.append("user_id", Uid);

        if (logo) {
            NewformData.append("logo", {
                uri: logo,
                name: logoName,
                type: logoType,
            });
        }


        // Append image data correctly
        images.forEach((img, index) => {
            if (img) {
                NewformData.append("additional_images", {
                    uri: img,
                    name: imageNames[index],
                    type: imageTypes[index],
                });
                NewformData.append("additional_imagesId", imagesid[index]); // Link image ID
            }
        });

        console.log("FormData:", NewformData);

        try {
            const response = await fetch(`${BaseUrl}businessUpdate`, {
                method: "POST",
                headers: {
                    "authentication": EncKey,
                },
                body: NewformData,
            });

            const data = await response.json();
            console.log("Response:", data);

            if (data.Response.Success == "1") {
                setSuccessModal(true);
            } else {
                Alert.alert("Error", data.Response.Message || "Failed to update business images.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };





    // // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Get Details =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    // const getDetails = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

    //         if (value !== null) {
    //             setUid(value)
    //             const response = await fetch(`${BaseUrl}userGet?type=M&id=${value}&req_type=1&res_type=1`, {
    //                 method: 'GET',
    //                 headers: { "authentication": EncKey }
    //             });

    //             response.json()
    //                 .then(responseData => {
    //                     // console.log(responseData);
    //                     if (responseData.Response.Success == 1) {
    //                         setName(responseData.Response.Result[0].name);
    //                         setMobile(responseData.Response.Result[0].mobile ? responseData.Response.Result[0].mobile.toString() : "");
    //                         setEmail(responseData.Response.Result[0].email);
    //                         setPan(responseData.Response.Result[0].account_pan_number);
    //                         setAddress1(responseData.Response.Result[0].address1);
    //                         setAddress2(responseData.Response.Result[0].address2);
    //                         setCity(responseData.Response.Result[0].city_name);
    //                         setCityId(responseData.Response.Result[0].city);
    //                         setState(responseData.Response.Result[0].state_name);
    //                         setStateId(responseData.Response.Result[0].state);
    //                         setPincode(responseData.Response.Result[0].pincode ? responseData.Response.Result[0].pincode.toString() : "");
    //                         setAccountName(responseData.Response.Result[0].account_holder_name);
    //                         setAccountNumber(responseData.Response.Result[0].account_number ? responseData.Response.Result[0].account_number.toString() : "");
    //                         setIFSCCode(responseData.Response.Result[0].account_IFSC);
    //                     }
    //                     else {

    //                     }

    //                 })
    //                 .finally(() => {
    //                     setIsloaded(false);
    //                 })

    //                 .catch(error => {
    //                     console.error('Error parsing JSON:', error);
    //                 });
    //         } else {
    //             console.log('No user data found in AsyncStorage.');
    //         }
    //     } catch (error) {
    //         console.error('Error reading AsyncStorage:', error.message);
    //     }
    // }
    // // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Update Personal Information =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    // const UpdateUserDetails = async () => {
    //     const userDetails = new FormData();

    //     userDetails.append('uId', uid);
    //     // userDetails.append('uname', Name);
    //     userDetails.append('email', Email);
    //     userDetails.append('pan_number', Pan);
    //     userDetails.append('address1', Address1);
    //     userDetails.append('address2', Address2);
    //     // userDetails.append('state', StateId);
    //     // userDetails.append('city', CityId);
    //     userDetails.append('pincode', Pincode);

    //     console.log(userDetails);
    //     setIsloaded(true);


    //     const response = await fetch(`${BaseUrl}profile_update`, {
    //         method: 'POST',
    //         body: userDetails,
    //         headers: { "authentication": EncKey }
    //     });

    //     response.json()
    //         .then(responseData => {
    //             console.log(responseData);
    //             if (responseData.Response.Success == 1) {
    //                 // ToastAndroid.showWithGravityAndOffset(
    //                 //     `${responseData.Response.Message}`,
    //                 //     ToastAndroid.LONG,
    //                 //     ToastAndroid.BOTTOM,
    //                 //     25,
    //                 //     50
    //                 // );
    //                 // Toast.show({
    //                 //     type: ALERT_TYPE.SUCCESS,
    //                 //     title: 'SUCCESS!',
    //                 //     textBody: responseData.Response.Message,
    //                 //     button: 'Done',
    //                 //   })
    //                 Toast.show({
    //                     type: "success",
    //                     text1: "Success",
    //                     text2: responseData?.Response.Message,
    //                 });
    //                 setTimeout(() => {
    //                     navigation.navigate('Footer', { screen: 'Profile' })
    //                 }, 3000);
    //                 // navigation.navigate('Footer', { screen: 'Profile' })
    //             }
    //             else {
    //                 // ToastAndroid.showWithGravityAndOffset(
    //                 //     `${responseData.Response.Message}`,
    //                 //     ToastAndroid.LONG,
    //                 //     ToastAndroid.BOTTOM,
    //                 //     25,
    //                 //     50
    //                 // );

    //                 // Toast.show({
    //                 //     type: ALERT_TYPE.WARNING,
    //                 //     title: 'SUCCESS!',
    //                 //     textBody: responseData.Response.Message,
    //                 //     button: 'Done',
    //                 //   })

    //                 Toast.show({
    //                     type: "error",
    //                     text1: "Error",
    //                     text2: responseData?.Response.Message,
    //                 });
    //                 setTimeout(() => {
    //                     navigation.navigate('Footer', { screen: 'Profile' })
    //                 }, 3000);
    //                 // navigation.navigate('Footer', { screen: 'Profile' })
    //             }
    //         })
    //         .finally(() => {
    //             setIsloaded(false);
    //         })
    //         .catch(error => {
    //             console.error('Error parsing JSON:', error);
    //         });
    // }
    // // =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-= Update Bank Information =-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=
    // const UpdateBankDetails = async () => {
    //     const userDetails = new FormData();

    //     userDetails.append('uId', uid);
    //     userDetails.append('acc_name', AccountName);
    //     userDetails.append('acc_number', AccountNumber);
    //     userDetails.append('acc_ifsc', IFSCCode);

    //     console.log(userDetails);
    //     setIsloaded(true);

    //     const response = await fetch(`${BaseUrl}profile_update`, {
    //         method: 'POST',
    //         body: userDetails,
    //         headers: { "authentication": EncKey }
    //     });

    //     response.json()
    //         .then(responseData => {
    //             console.log(responseData);
    //             if (responseData.Response.Success == 1) {
    //                 // ToastAndroid.showWithGravityAndOffset(
    //                 //     `${responseData.Response.Message}`,
    //                 //     ToastAndroid.LONG,
    //                 //     ToastAndroid.BOTTOM,
    //                 //     25,
    //                 //     50
    //                 // );
    //                 // navigation.navigate('Footer')
    //                 Toast.show({
    //                     type: "success",
    //                     text1: "Success",
    //                     text2: responseData?.Response.Message,
    //                 });
    //                 setTimeout(() => {
    //                     navigation.navigate('Footer', { screen: 'Profile' })
    //                 }, 2000);
    //             }
    //             else {
    //                 // ToastAndroid.showWithGravityAndOffset(
    //                 //     `${responseData.Response.Message}`,
    //                 //     ToastAndroid.LONG,
    //                 //     ToastAndroid.BOTTOM,
    //                 //     25,
    //                 //     50
    //                 // );
    //                 // navigation.navigate('Footer')
    //                 Toast.show({
    //                     type: "error",
    //                     text1: "Error",
    //                     text2: responseData?.Response.Message,
    //                 });
    //                 setTimeout(() => {
    //                     navigation.navigate('Footer', { screen: 'Profile' })
    //                 }, 2000);
    //             }
    //         })
    //         .finally(() => {
    //             setIsloaded(false)
    //         })
    //         .catch(error => {
    //             console.error('Error parsing JSON:', error);
    //         });
    // }

    // useEffect(() => {
    //     getDetails();
    // }, [])



    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
        return () => {
            backhandler.remove();
        };
    }, []);



    return (
        // <AlertNotificationRoot>
        <>

            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackButtonClick} style={{ flexDirection: 'row', marginTop: hp(3.5) }}>
                        <Icon name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text style={styles.headerText}>STORE MANAGEMENT</Text>
                    </TouchableOpacity>
                </View>

                {
                    isLoaded ?
                        <View style={{ height: hp(100), width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: hp(4), width: hp(4), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: hp(0.5), elevation: 5 }}>
                                <ActivityIndicator size={'small'} color='#A6222C' />
                            </View>
                        </View>
                        :
                        <>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: hp(2), marginBottom: hp(1) }}>
                                <TouchableOpacity onPress={() => setMenuSelect(true)}
                                    style={{
                                        height: hp(6),
                                        width: wp(45),
                                        backgroundColor: menuSelect ? "#A6222C" : "#fff",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#A6222C",
                                        borderRadius: hp(1),
                                    }}
                                >
                                    <Text style={{ color: menuSelect ? "#fff" : "#A6222C", fontSize: hp(1.8), fontWeight: 'bold' }}>
                                        Business Info
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setMenuSelect(false)}
                                    style={{
                                        height: hp(6),
                                        width: wp(45),
                                        backgroundColor: !menuSelect ? "#A6222C" : "#fff",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#A6222C",
                                        borderRadius: hp(1),
                                    }}
                                >
                                    <Text style={{ color: !menuSelect ? "#fff" : "#A6222C", fontSize: hp(1.8), fontWeight: 'bold' }}>
                                        Picture Management
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                keyboardVerticalOffset={hp(8)} // Adjust this based on header height
                                style={{ height: hp(100), width: wp(100), }}
                            >
                                {menuSelect ? (
                                    <BusinessInfo

                                        mobile={mobile}
                                        setMobile={setMobile}
                                        email={email}
                                        setEmail={setEmail}
                                        businessName={businessName}
                                        setBusinessName={setBusinessName}
                                        // CategoryId={categoryid}
                                        // setCategoryId={setCategoryid}
                                        latitude={latitude}
                                        setLatitude={setLatitude}
                                        longitude={longitude}
                                        setLongitude={setLongitude}
                                        address={address}
                                        setAddress={setAddress}
                                        pincode={pincode}
                                        setPincode={setPincode}
                                        city={city}
                                        setCity={setCity}
                                        state={state}
                                        setState={setState}
                                        selectCategory={selectCategory}
                                        setSelectCategory={setSelectCategory}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        // categoryid={categoryid}
                                        // setCategoryid={setCategoryid}
                                        AccountName={AccountName}
                                        setAccountName={setAccountName}
                                        AccountNumber={AccountNumber}
                                        setAccountNumber={setAccountNumber}
                                        BankName={BankName}
                                        setBankName={setBankName}
                                        IFSCCode={IFSCCode}
                                        setIFSCCode={setIFSCCode}
                                        pan={pan}
                                        setPan={setPan}
                                        psa={psa}
                                        setPsa={setPsa}
                                        ApprovalStatus={ApprovalStatus}
                                        setApprovalStatus={setApprovalStatus}

                                        Bussid={Bussid}
                                        setBussid={setBussid}

                                        Contact_Person={Contact_Person}
                                        setContact_Person={setContact_Person}

                                        // getmobile={getmobile}
                                        // setGetmobile={setGetmobile}
                                        // getemail={getemail}
                                        // setGetemail={setGetemail}
                                        // getbusinessName={getbusinessName}
                                        // setGetbusinessName={setGetbusinessName}
                                        // getlatitude={getlatitude}
                                        // setGetlatitude={setGetlatitude}
                                        // getlongitude={getlongitude}
                                        // setGetlongitude={setGetlongitude}
                                        // getaddress={getaddress}
                                        // setGetaddress={setGetaddress}
                                        // getpincode={getpincode}
                                        // setGetpincode={setGetpincode}
                                        // getAccountName={getAccountName}
                                        // setGetAccountName={setGetAccountName}
                                        // getAccountNumber={getAccountNumber}
                                        // setGetAccountNumber={setGetAccountNumber}
                                        // getIFSCCode={getIFSCCode}
                                        // setGetIFSCCode={setGetIFSCCode}
                                        // getpan={getpan}
                                        // setGetPan={setGetPan}
                                        handleSelectCategory={handleSelectCategory}
                                        submitBusiness={submitBusiness}
                                        UpdateBusiness={UpdateBusiness}
                                    />
                                ) : (
                                    <PictureManagement
                                        // proof1={proof1}
                                        // setProof1={setProof1}
                                        // proofName={proofName}
                                        // setProofName={setProofName}
                                        // proof1Type={proof1Type}
                                        // setProof1Type={setProof1Type}
                                        // proof1color={proof1color}
                                        // setproof1color={setproof1color}
                                        images={images}
                                        setImages={setImages}
                                        imagesid={imagesid}
                                        setImagesid={setImagesid}
                                        logo={logo}
                                        setLogo={setLogo}
                                        logoName={logoName}
                                        setLogoName={setLogoName}
                                        logoType={logoType}
                                        setLogoType={setLogoType}
                                        addImages={addImages}
                                        setAddImages={setAddImages}
                                        takePicFromGallery={takePicFromGallery}
                                        takeMultiPicsFromGallery={takeMultiPicsFromGallery}
                                        submitPictureManagement={submitPictureManagement}
                                    />
                                )}
                            </KeyboardAvoidingView>
                        </>
                }
                <Toast />

                {/* =====================================================Success modal=============================================== */}
                <Modal
                    animationType="slide"
                    transparent
                    visible={successModal}
                    onRequestClose={() => {
                        setSuccessModal(!successModal);
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <View style={{ height: hp(45), width: wp(80), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: hp(0), borderRadius: hp(3), borderWidth: 1, borderColor: '#bdbcbc', alignSelf: 'center' }}>
                            {/* <Image source={require('../Images/checked.png')} style={{ height: hp(8), width: hp(8), resizeMode: 'cover', position: 'absolute', top: hp(-4) }} /> */}
                            <Lottie resizeMode='cover' source={require('../../assets/json/shopsuccess.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop />
                            <Text style={{ fontSize: hp(2.5), fontWeight: '500', color: '#000', marginTop: hp(0), textAlign: 'center' }}>Business details added successfully</Text>
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

export default NewAddBusiness;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#A6222C',
        // backgroundColor: '#ff6000',
        height: hp(10),
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
    dropdown: {
        alignSelf: "center",
        marginTop: hp(3),
        backgroundColor: '#ffe2cf'
    },
    dropdownButtonStyle: {
        width: wp(87),
        height: hp(6),
        borderRadius: hp(1),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(2),
        padding: hp(1),
        borderWidth: 1,
        borderColor: '#A6222C',
        marginBottom: hp(0),
        marginTop: hp(3),
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
    changeimg: {
        width: hp(2.5),
        height: hp(2.5),
        tintColor: '#fff',
        fontWeight: 'bold'
    },
});
