import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
import { FlatList } from 'react-native';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';

const CommissionList = ({ navigation, route }) => {

    const type = route.params?.type || '';
    const userId = route.params?.id || '';
    //console.log(type);

    const [commissionList, setCommissionList] = useState([]);
    const [loading, setLoading] = useState(false);


    const EncKey = encryptPiDataNew(Authentication_Key)

    const getCommissionListApi = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${BaseUrl}consolidated_report?uid=${userId}&commission=${type}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        authentication: EncKey,
                    },
                }
            );

            //console.log(res.data);

            if (res.data.Response?.Success == "1") {
                setCommissionList(res.data.Response.Result || []);
            }
            else {
                console.error(res.data.Response?.Message);
                setCommissionList([]);
            }

        } catch (error) {
            console.error('API Fetch Error1:', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [userId, type,BaseUrl,EncKey]);

    useEffect(() => {
        getCommissionListApi();
    }, [getCommissionListApi]);

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
      <StatusBar  backgroundColor='#A6222C' barStyle="light-content"/>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('EarningCommission')} style={styles.headerButton}>
                    <AntDesign onPress={() => navigation.navigate('EarningCommission')} name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text onPress={() => navigation.navigate('EarningCommission')} style={styles.headerText}>COMMISSION LIST</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                data={commissionList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {

                    let filteredData = [];

                    if (type === 'pd') filteredData = JSON.parse(item.premium_dealer || '[]');
                    else if (type === 'ed') filteredData = JSON.parse(item.executive_director || '[]');
                    else if (type === 'rd') filteredData = JSON.parse(item.regional_director || '[]');
                    else if (type === 'sr') filteredData = JSON.parse(item.shop_referral_commission || '[]');
                    else if (type === 'pc') filteredData = JSON.parse(item.pincode_partner_commission || '[]');
                    else if (type === 'dc') filteredData = JSON.parse(item.district_partner_commission || '[]');
                    else if (type === 'cc') filteredData = JSON.parse(item.channel_partner_commission || '[]');

                    return (
                        <View
                            style={[styles.card]}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={[styles.label, {}]}>{item.purchased_user_name}</Text>
                                <Text style={[styles.value, {}]}>₹ {filteredData[0].amount}</Text>
                            </View>
                            <View style={{ backgroundColor: '#A6222C', padding: hp(1), alignSelf: 'center', marginBottom: hp(-2), paddingHorizontal: wp(5), borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1) }}>
                                <Text style={{color:'#fff',fontWeight:'700',fontSize:hp(1.8)}}>{item.created_at}</Text>
                            </View>
                        </View>
                    )
                }}
                ListEmptyComponent={<Text style={styles.loadingText}>{loading ? 'Loading commission details...' : "No Records Available"}</Text>}
            />
        </View>
    );
};

export default CommissionList;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', padding: hp(1.5),height:hp(11) },
    headerButton: { flexDirection: 'row', marginTop: hp(2) },
    headerIcon: { marginTop: hp(3) },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(3), marginLeft: wp(5) },
    contentContainer: { padding: hp(2), alignSelf: 'center' },
    card: { backgroundColor: '#f8f8f8', padding: hp(2), borderRadius: 10, elevation: 3, width: wp(90), marginVertical: hp(1), },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp(0.5) },
    label: { fontSize: hp(2), fontWeight: '600', color: '#333', },
    value: { fontSize: hp(1.8), color: '#000', fontWeight: '500' },
    loadingText: { textAlign: 'center', marginTop: hp(2), fontSize: hp(2), color: '#777' },
});
