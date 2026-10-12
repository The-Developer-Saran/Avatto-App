import { BackHandler, Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from '@react-native-vector-icons/ant-design';
import { TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

const EducationHub = ({ navigation }) => {

    function handleBackButtonClick() {
        navigation.navigate('Footer');
        return true;
    }

    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
        return () => {
            backhandler.remove();
        };
    }, []);

    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>

                <TouchableOpacity onPress={handleBackButtonClick} style={styles.header}>
                    <Icon onPress={handleBackButtonClick} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                    <Text onPress={handleBackButtonClick} style={styles.headerText}>EDUCATION HUB</Text>
                </TouchableOpacity>

                <Text style={styles.subheader}>Welcome to Avatto Education</Text>

                <View style={{ width: wp(100), height: hp(75), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    {/* <Lottie resizeMode='contain' source={require('../assets/json/commingSoon.json')} style={{ width: hp(20), height: hp(20) }} autoPlay loop /> */}
                    <Image
                        source={require('../../components/assets/images/EducationHub/education.jpg')}
                        style={styles.education}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </>
    )
}

export default EducationHub

const styles = StyleSheet.create({
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
        justifyContent: 'flex-start',
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
    education: {
        height: hp(90),
        width: wp(100),
    },
    subheader: {
        fontSize: hp(2.3),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: hp(3),
        color: '#A6222C'
    },
})