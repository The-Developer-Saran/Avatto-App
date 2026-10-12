import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from '@react-native-vector-icons/ant-design';
import { TouchableOpacity } from 'react-native';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ReferralTabView from './ReferralTabView';

const ReferralHome = ({navigation}) => {
    return (
        <>
            <StatusBar  backgroundColor='#A6222C' />
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.push('Footer', { screen: 'Profile' })}
                    style={styles.header}
                >
                    <AntDesign
                    onPress={() => navigation.push('Footer', { screen: 'Profile' })}
                        name="left"
                        size={22}
                        color="white"
                        style={{ marginTop: hp(4) }}
                    />
                    <Text
                    onPress={() => navigation.push('Footer', { screen: 'Profile' })}
                        style={styles.headerText}
                    >
                        REFERRAL
                    </Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
    {/* <ReferralTabView /> */}
</View>

            </View>
        </>
    )
}

export default ReferralHome

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        header: {
            backgroundColor: '#A6222C',
            height: hp(11),
            padding: hp(1.5),
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerText: {
            color: "#fff",
            fontSize: hp(2),
            fontWeight: "bold",
            marginTop: hp(4),
            marginLeft: wp(5),
            fontFamily: "DMSans-Medium",
        },
})