import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import  LinearGradient from 'react-native-linear-gradient';

const EarningCommission = ({ navigation }) => {

    const [commissionDetails, setCommissionDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [Uid, setUid] = useState(null);

    const EncKey = encryptPiDataNew(Authentication_Key)

    // const userId = 12763;

    const getDetailsApi = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

            if (value !== null) {
                // alert(value)
                setUid(value)
                try {
                    setLoading(true);
                    const res = await axios.get(
                        `${BaseUrl}commissionGet_single?uId=${value}`,
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                authentication: EncKey,
                            },
                        }
                    );

                    //console.log(res.data);

                    if (res.data.Response?.Success == "1") {
                        //setCommissionDetails(res.data.Response.Result || {});
                        const filteredData = Object.entries(res.data.Response.Result || {}).filter(([key]) => !['uId', 'user_name', 'user_mobile'].includes(key));
                        console.log(res.data.Response.Result);
                        console.log(filteredData);
                        setCommissionDetails(filteredData);
                    }
                    else {
                        console.error(res.data.Response?.Message);
                        setCommissionDetails({});
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
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDetailsApi();
    }, [getDetailsApi]);

    const formatKey = (key) => {
        return key
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    };

    const handleNavigation = (key) => {
        const navigationMap = {
            'premium_dealer': 'pd',
            'executive_director': 'ed',
            'regional_director': 'rd',
            'shop_referral_commission': 'sr',
            'pincode_partner_commission': 'pc',
            'district_partner_commission': 'dc',
            'channel_partner_commission': 'cc'
        };
        if (navigationMap[key]) {
            navigation.navigate('CommissionList', { type: navigationMap[key], id: Uid });
            //alert(navigationMap[key])
        }
    };


    // const getCardBackgroundColor = (index) => {
    //     const colors = [
    //         '#FF6347',  // Tomato
    //         '#32CD32',  // LimeGreen
    //         '#1E90FF',  // DodgerBlue
    //         '#FFD700',  // Gold
    //         '#8A2BE2',  // BlueViolet
    //         '#FF4500',  // OrangeRed
    //         '#00CED1',  // DarkTurquoise
    //         '#8B0000'   // DarkRed
    //     ];
    //     return colors[index % colors.length]; // Use modulo to loop colors if there are more items than colors
    // };

    // const getGradientColors = (index) => {
    //     const gradients = [
    //         ['#FFDEE9', '#B5FFFC'],  // Light Pink to Light Blue
    //         ['#D4FC79', '#96E6A1'],  // Light Green to Light Aqua
    //         ['#A1C4FD', '#C2E9FB'],  // Soft Blue to Light Blue
    //         ['#FEE140', '#FA709A'],  // Light Yellow to Pink
    //         ['#FF9A9E', '#FAD0C4'],  // Peach to Soft Pink
    //         ['#D9AFD9', '#97D9E1'],  // Soft Purple to Light Blue
    //         ['#F6D365', '#FDA085'],  // Light Orange to Peach
    //         ['#84FAB0', '#8FD3F4']   // Mint Green to Sky Blue
    //     ];
    //     return gradients[index % gradients.length]; // Cycle through colors
    // };

    // const getGradientColors = (index) => {
    //     const gradients = [
    //         ['#FFEBE9', '#C3F5FF'],  // Soft Pink to Light Aqua  
    //         ['#E4FFD9', '#D6F9DD'],  // Pastel Green to Soft Mint  
    //         ['#DCE8FF', '#F2F6FF'],  // Light Blue to Soft White  
    //         ['#FFF5C3', '#FFD1DC'],  // Pale Yellow to Light Peach  
    //         ['#FADADD', '#FFE4E1'],  // Baby Pink to Soft Coral  
    //         ['#E5CFF7', '#D4E4FA'],  // Lavender to Soft Blue  
    //         ['#FAE3D9', '#FBE7C6'],  // Warm Peach to Light Cream  
    //         ['#DAF2DC', '#D7EEFF']   // Pastel Green to Gentle Sky Blue  
    //     ];
    //     return gradients[index % gradients.length]; // Cycle through colors
    // };

    // const getGradientColors = (index) => {
    //     const gradients = [
    //         ['#FDE5EC', '#D4F4FA'],  // Light Rose Pink to Soft Aqua  
    //         ['#FFEDD8', '#D4E2FC'],  // Warm Peach to Light Blue  
    //         ['#D6F8D6', '#E0F7FA'],  // Soft Mint Green to Pale Cyan  
    //         ['#F3E7E9', '#F5EEE6'],  // Warm Mauve to Light Cream  
    //         ['#E3FDFD', '#FFE6FA'],  // Pale Turquoise to Light Pink  
    //         ['#F6E6C2', '#E4F0D0'],  // Soft Gold to Pastel Green  
    //         ['#E2C2F7', '#C2E9F7'],  // Lavender Mist to Soft Sky Blue  
    //         ['#FDF6EC', '#E0F2E9']   // Warm Beige to Fresh Mint  
    //     ];
    //     return gradients[index % gradients.length]; // Cycle through colors
    // };

    // const getGradientColors = (index) => {
    //     const gradients = [
    //         ['#FFE5F1', '#D3F8FF'],  // Soft Pink to Pastel Blue  
    //         ['#FFF9C4', '#FFECB3'],  // Light Lemon to Soft Apricot  
    //         ['#D1FADF', '#C3E2C2'],  // Mint Green to Pastel Sage  
    //         ['#E0BBE4', '#957DAD'],  // Soft Lavender to Muted Purple  
    //         ['#FFDDE4', '#FAF3DD'],  // Blush Rose to Warm Ivory  
    //         ['#B5EAD7', '#C7CEEA'],  // Soft Mint to Light Periwinkle  
    //         ['#FFDAC1', '#FF9AA2'],  // Pale Peach to Baby Pink  
    //         ['#F8E8EE', '#D5E1DF'],  // Misty Rose to Soft Greyish Green  
    //         ['#FAD0C4', '#FFD1DC'],  // Soft Coral to Pastel Pink  
    //         ['#D4A5A5', '#FAD02E'],  // Muted Rose to Warm Yellow  
    //         ['#A8E6CF', '#DCEDC1'],  // Light Aqua to Pastel Lime  
    //         ['#FFCCBC', '#FFABAB'],  // Warm Peach to Light Coral  
    //         ['#E6E6FA', '#D8BFD8'],  // Soft Lavender to Gentle Violet  
    //         ['#D7E1F3', '#F8EDEB'],  // Pastel Blue to Warm Blush  
    //         ['#FDE5EC', '#B5EAD7'],  // Baby Pink to Soft Teal  
    //     ];
    //     return gradients[index % gradients.length]; // Cycle through colors
    // };


    const getGradientColors = (index) => {
        const gradients = [
            ['#FDE2E4', '#B5EAD7'],  // Soft Blush Pink to Pastel Mint  
            ['#D7E3FC', '#FFF1E6'],  // Light Sky Blue to Soft Apricot  
            ['#F3C4FB', '#D4E2D4'],  // Pastel Lavender to Gentle Green  
            ['#FFD6E0', '#FAF3DD'],  // Baby Pink to Warm Ivory  
            ['#BEE1E6', '#F0E6EF'],  // Misty Cyan to Soft Lilac  
            ['#F8E8EE', '#C2E9F7'],  // Pale Rose to Pastel Blue  
            ['#E5F4E3', '#D3E0EA'],  // Soft Sage to Misty Blue  
            ['#F5E6E8', '#E1E4F3'],  // Blush Mauve to Gentle Periwinkle  
            ['#F9E5C5', '#C6E2E9'],  // Warm Peach to Aqua Blue  
            ['#D1E8E2', '#F9D1D1'],  // Mint Aqua to Soft Pink  
            ['#E3E3D9', '#FFC8C8'],  // Light Grey to Pastel Coral  
            ['#C6DEF1', '#E1F4CB'],  // Baby Blue to Soft Lime  
            ['#FDE5C8', '#B5D6D6'],  // Warm Sand to Gentle Teal  
            ['#E2C2F7', '#F6D6D6'],  // Lavender Cream to Light Rose  
            ['#EDE7B1', '#AEE1CD'],  // Pale Yellow to Mint Green  
        ];
        return gradients[index % gradients.length]; // Cycle through colors
    };
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==

    // const handleBackButtonClick = useCallback(() => {
    //     navigation.goBack();
    //     return true;
    // }, [navigation]);

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    //     return () => {
    //         BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    //     };
    // }, [handleBackButtonClick]);


    return (
        <View style={styles.container}>
            <StatusBar  backgroundColor='#A6222C' barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Footer', { screen: 'Profile' })}>
                    <AntDesign onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>EARNING COMMISSION</Text>
                </TouchableOpacity>
            </View>
            {/* <FlatList
                contentContainerStyle={styles.contentContainer}
                data={commissionDetails}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, item[0] === 'total' && styles.disabledCard]}
                        onPress={() => handleNavigation(item[0])}
                        disabled={item[0] === 'total'}
                    >
                        <Text style={styles.value}>{formatKey(item[0])}</Text>
                        <Text style={styles.label}>{item[1]}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.loadingText}>{loading ? 'Loading commission details...' : "No Records Available"}</Text>}
            /> */}

            {/* <FlatList
                contentContainerStyle={styles.contentContainer}
                data={commissionDetails}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            item[0] === 'total' && styles.disabledCard,
                            { backgroundColor: getCardBackgroundColor(index) } // Dynamically set background color
                        ]}
                        onPress={() => handleNavigation(item[0])}
                        disabled={item[0] === 'total'}
                    >
                        <Text style={styles.value}>{formatKey(item[0])}</Text>
                        <Text style={styles.label}>{item[1]}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.loadingText}>{loading ? 'Loading commission details...' : "No Records Available"}</Text>}
            /> */}

<FlatList
    contentContainerStyle={styles.contentContainer}
    data={commissionDetails}
    keyExtractor={(item, index) => index.toString()}
    numColumns={2}
    renderItem={({ item, index }) => (
        <LinearGradient
            colors={getGradientColors(index)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, item[0] === 'total' && styles.disabledCard]}
        >
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => handleNavigation(item[0])}
                disabled={item[0] === 'total'}
            >
                <Text style={styles.value}>{formatKey(item[0])}</Text>
                <Text style={styles.label}>{item[1]}</Text>
            </TouchableOpacity>
        </LinearGradient>
    )}
    ListEmptyComponent={<Text style={styles.loadingText}>{loading ? 'Loading commission details...' : "No Records Available"}</Text>}
/>




        </View>
    );
};

export default EarningCommission;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', padding: hp(1.5), height: hp(10) },
    headerButton: { flexDirection: 'row', marginTop: hp(3.5) },
    headerIcon: { marginTop: hp(0) },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(0), marginLeft: wp(5) },
    contentContainer: { padding: hp(2), alignSelf: 'center' },
    card: { backgroundColor: '#f8f8f8', padding: hp(2), borderRadius: 10, elevation: 3, width: wp(44), marginHorizontal: hp(1), marginVertical: hp(1) },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp(0.5) },
    label: { fontSize: hp(2), fontWeight: '700', color: '#333', marginTop: hp(1) },
    value: { fontSize: hp(1.7), color: '#454545' },
    loadingText: { textAlign: 'center', marginTop: hp(2), fontSize: hp(2), color: '#777' },
    disabledCard: { backgroundColor: '#d3d3d3' },
});
