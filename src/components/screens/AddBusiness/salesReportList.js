import { BackHandler, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@react-native-vector-icons/ant-design';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { FlatList } from 'react-native-gesture-handler';

const SalesReportList = ({ navigation, route }) => {

    const salesReport = route?.params.item || [];
    //const salesReport = [];
    //console.log(salesReport);

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==


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
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#A6222C" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={handleBackButtonClick}>
                    <AntDesign name="left" size={22} color="white" style={styles.headerIcon} />
                    <Text style={styles.headerText}>SALES REPORT</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={salesReport}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#888', fontWeight: '400', marginTop: hp(5) }}>No sales report found</Text>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <View style={styles.cardContainer}>
                        {/* Transaction Details */}
                        <View style={styles.cardContent}>
                            <View style={styles.leftSection}>
                                <Text style={styles.text}>{item.created_at || 'N/A'}</Text>
                                <Text style={styles.transactionText}>{item.name || 'N/A'}</Text>
                            </View>
                            <View style={styles.rightSection}>
                                <Text style={styles.text}>PS % : {item.psa_percentage || '0'}</Text>
                                <Text style={styles.text}>PS Value : {item.psa_value || '0'}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1) }}>
                                <Text style={styles.text}>Bill Amount</Text>
                                <View style={[styles.statusBox, { backgroundColor: 'green', width: wp(40) }]}>
                                    <Text style={[styles.statusText, { fontSize: hp(2.8), fontWeight: '600' }]}>
                                        ₹ {item.net_amount || "0.00"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1) }}>
                                <Text style={styles.text}>Received Amount</Text>
                                <View style={[styles.statusBox, { backgroundColor: 'green', width: wp(40) }]}>
                                    <Text style={[styles.statusText, { fontSize: hp(2.8), fontWeight: '600' }]}>
                                        ₹ {item.payable_amount || "0.00"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />

        </View>

    )
}

export default SalesReportList

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#A6222C', padding: hp(1.5) },
    headerButton: { flexDirection: 'row', marginTop: hp(1) },
    headerIcon: { marginTop: hp(4) },
    headerText: { color: '#fff', fontSize: hp(2), fontWeight: 'bold', marginTop: hp(4), marginLeft: wp(5) },
    cardContainer: { backgroundColor: '#ececec', borderRadius: hp(1), padding: hp(2), elevation: 4, width: wp(90), alignSelf: 'center', marginVertical: hp(1) },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBox: { padding: hp(1), borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), alignSelf: 'center', width: wp(50), marginBottom: hp(-2), marginTop: hp(1) },
    statusText: { color: '#fff', textAlign: 'center', fontWeight: '500' },
})