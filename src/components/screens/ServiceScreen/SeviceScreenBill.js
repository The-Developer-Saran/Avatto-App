import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';

const services = [
    //   { name: 'Add Money', icon: require('./assets/upi.png') },
    // { name: 'Prepaid', icon: require('../../assets/images/Utility/prepaid.png'), screen: 'MobileNumberScreen' },
    // { name: 'DTH', icon: require('../../assets/images/Utility/antenna.png'), screen: 'DTHScreen' },
    // { name: 'Postpaid', icon: require('../../assets/images/Utility/postpaid.png'), screen: 'Postpaid' },
    { name: 'FASTag', icon: require('../../assets/images/Utility/fastag.png'), screen: 'Fastag' },
    { name: 'Electricity', icon: require('../../assets/images/Utility/electrical.png'), screen: 'Electricity' },
    { name: 'GAS', icon: require('../../assets/images/Utility/gas.png'), screen: 'GasScreen' },
    { name: 'Water', icon: require('../../assets/images/Utility/pipe.png'), screen: 'Water' },
    { name: 'Insurance', icon: require('../../assets/images/Utility/hands.png'), screen: 'Insurance' },
    // { name: 'Landline', icon: require('../../assets/images/Utility/landline.png'), screen: 'Landline' },
    // { name: 'Broadband', icon: require('../../assets/images/Utility/router.png'), screen: 'Broadband' },
];
const numColumns = 3; // Set number of columns

const ServiceScreenBill = ({ navigation }) => {
    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(0) }}>
                        <Icon onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                        <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>BILLING</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("BillingHistory")} style={{ width: hp(6), height: hp(6), backgroundColor: '#fff', marginTop: hp(0), borderRadius: hp(3), justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/Utility/history.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subheader}>Welcome to Avatto Billing</Text>
                <View style={styles.gridContainer}>
                    {services.map((item, index) => (
                        <Pressable onPress={() => navigation.navigate(item.screen)} key={item.name + index} style={styles.item}>
                            <View style={{ width: hp(12), height: hp(12), backgroundColor: '#fff', elevation: 5, borderRadius: hp(6), justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={item.icon} style={styles.icon} />
                            </View>
                            <View style={{ width: hp(12), height: hp(5), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
                <Text style={{ fontSize: hp(1.6), marginLeft: wp(0), marginTop: hp(60), color: 'red', textAlign: 'center' }}>Note: Other utility services are coming soon.</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    //   container: { flex: 1, backgroundColor: '#fff', padding:hp(1) },
    //   header: { fontSize:hp(2), fontWeight: 'bold', textAlign: 'center', marginVertical: hp(2) },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#A6222C',
        // backgroundColor: '#ff6000',
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
    subheader: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: hp(3),
        color: '#A6222C'
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: wp(100),
    },
    item: {
        width: wp(30),
        marginHorizontal: wp(1.6),
        marginTop: hp(1),
        marginVertical: hp(1),
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: hp(7),
        height: hp(7),
        resizeMode: 'contain'
    },
    text: {
        fontSize: hp(1.7),
        textAlign: 'center',
        fontWeight: '500'
    },
    logo: {
        height: hp(5),
        width: hp(5),
        // tintColor: '#fcb713',
    },
});

export default ServiceScreenBill;
