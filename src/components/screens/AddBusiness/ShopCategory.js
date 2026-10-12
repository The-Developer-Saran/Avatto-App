import { BackHandler, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import { TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import  LinearGradient  from 'react-native-linear-gradient';

const ShopCategory = ({ navigation }) => {



    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <TouchableOpacity onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.header}>
                    <Icon onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} name="left" size={22} color="white" style={{ marginTop: hp(3) }} />
                    <Text onPress={() => navigation.navigate('Footer', { screen: 'Profile' })} style={styles.headerText}>STORE MANAGEMENT</Text>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: wp(100), height: hp(80), }}>
                    <View style={{ width: wp(100), height: hp(70), justifyContent: "space-evenly", alignItems: 'center', alignSelf: 'center' }}>
                        <Pressable onPress={() => navigation.navigate('NewAddBusiness')} style={{ width: wp(85), height: hp(12), justifyContent: "space-between", alignItems: 'center', alignSelf: 'center', backgroundColor: '#fff', elevation: 5, borderRadius: hp(2),flexDirection:'row' }}>
                            <View style={{ width: hp(10), height: hp(10), backgroundColor: '#fff', elevation: 5, borderRadius: hp(6), justifyContent: 'center', alignItems: 'center', marginLeft: wp(3) }}>
                                <Image
                                    source={require('../../assets/images/Utility/shop1.png')}
                                    style={styles.icon}
                                />

                            </View>
                            <View style={{ height: hp(5), justifyContent: 'center', alignItems: 'center', marginRight: wp(3) }}>
                                <Text style={{ fontSize: hp(2), fontWeight: '700' }}>Become a Vendor</Text>
                            </View>
                            <LinearGradient
                                colors={['#F3C4FB', '#D4E2D4']} // Define your two shades
                                style={styles.gradientOverlay}
                            />
                        </Pressable>


                        <Pressable onPress={() => navigation.navigate('AddTravelPartner')} style={{ width: wp(85), height: hp(12), justifyContent: "space-between", alignItems: 'center', alignSelf: 'center', backgroundColor: '#fff', elevation: 5, borderRadius: hp(2),flexDirection:'row' }}>
                            <View style={{ width: hp(10), height: hp(10), backgroundColor: '#fff', elevation: 5, borderRadius: hp(6), justifyContent: 'center', alignItems: 'center', marginLeft: wp(3) }}>
                                <Image
                                    source={require('../../assets/images/Utility/taxi.png')}
                                    style={styles.icon}
                                />

                            </View>
                            <View style={{ height: hp(5), justifyContent: 'center', alignItems: 'center', marginRight: wp(3) }}>
                                <Text style={{ fontSize: hp(2), fontWeight: '700' }}>Become a Travel Partner</Text>
                            </View>
                            <LinearGradient
                          colors={['#A7D3F2', '#FFD6A5']}// Define your two shades
                                style={styles.gradientOverlay}
                            />
                        </Pressable>


                        <Pressable onPress={() => navigation.navigate('OthersAddBusiness')} style={{ width: wp(85), height: hp(12), justifyContent: "space-between", alignItems: 'center', alignSelf: 'center', backgroundColor: '#fff', elevation: 5, borderRadius: hp(2),flexDirection:'row' }}>
                            <View style={{ width: hp(10), height: hp(10), backgroundColor: '#fff', elevation: 5, borderRadius: hp(6), justifyContent: 'center', alignItems: 'center', marginLeft: wp(3) }}>
                                <Image
                                    source={require('../../assets/images/Utility/shopping.png')}
                                    style={styles.icon1}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ height: hp(5), justifyContent: 'center', alignItems: 'center', marginRight: wp(3) }}>
                                <Text style={{ fontSize: hp(2), fontWeight: '700' }}>Appoint a Vendorx</Text>
                            </View>
                            <LinearGradient
                                colors={['#FFC8DD', '#BDE0FE']}
                                style={styles.gradientOverlay}
                            />
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate('OthersAddTravelPartner')} style={{ width: wp(85), height: hp(12), justifyContent: "space-between", alignItems: 'center', alignSelf: 'center', backgroundColor: '#fff', elevation: 5, borderRadius: hp(2),flexDirection:'row' }}>
                            <View style={{ width: hp(10), height: hp(10), backgroundColor: '#fff', elevation: 5, borderRadius: hp(6), justifyContent: 'center', alignItems: 'center', marginLeft: wp(3) }}>
                                <Image
                                    source={require('../../assets/images/Utility/transport.png')}
                                    style={styles.icon2}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ height: hp(5), justifyContent: 'center', alignItems: 'center', marginRight: wp(3) }}>
                                <Text style={{ fontSize: hp(2), fontWeight: '700' }}>Appoint a Travel Partner</Text>
                            </View>
                            <LinearGradient
                           colors={['#FFDFBA', '#A2D2FF']}
                                style={styles.gradientOverlay}
                            />
                        </Pressable>

                    </View>
                </View>

            </View>
        </>
    )
}

export default ShopCategory

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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    headerText: {
        color: "#fff",
        fontSize: hp(2),
        fontWeight: "bold",
        marginTop: hp(3),
        marginLeft: wp(5),
        fontFamily: "DMSans-Medium",
    },
    icon: {
        width: hp(6),
        height: hp(6),
        resizeMode: 'contain',
        // tintColor: '#800000',
      
    },
    icon1: {
        width: hp(6),
        height: hp(6),
        resizeMode: 'contain',
        // tintColor: '#800000'
    },
    icon2: {
        width: hp(8),
        height: hp(8),
        resizeMode: 'contain',
        // tintColor: '#800000'
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire icon
        opacity: 0.3, // Adjust transparency for blending
        borderRadius: hp(2)
    },
    iconContainer: {
        width: hp(12),
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(6),
    },
    //   icon: {
    //     width: '70%',
    //     height: '70%',
    //     resizeMode: 'contain',
    //     tintColor: '#800000', // Set a base tint to blend with the gradient
    //     position: 'absolute',
    //   },
    gradientOverlay1: {
        ...StyleSheet.absoluteFillObject, // Covers the entire icon
        opacity: 0.3, // Adjust transparency for blending
        borderRadius: hp(2)
    },
})