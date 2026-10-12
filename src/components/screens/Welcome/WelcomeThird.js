import AntDesign from '@react-native-vector-icons/ant-design';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeThird = ({ navigation }) => {
  return (
    <>
      <StatusBar backgroundColor="#0000" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Footer')}
          style={{
            width: wp(18),
            backgroundColor: 'rgba(0,0,0,0.5)',
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginRight: hp(0),
            alignSelf: 'flex-end',
            padding: 5,
            alignItems: 'center',
            borderRadius: hp(5),
            marginTop: hp(2),
          }}
        >
          <Text style={styles.skipText}>Skip</Text>
          <AntDesign style={styles.icon} name="right" color="#fff" />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/Welcome/welcomescreen33.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>WIDE RANGE OF PAYMENTS</Text>
        <Text style={styles.description}>
          Now you are not confined to limited types of payment, be it your local
          chaiwala or your nearby restraunts, chemist shop to your gym, we got
          you covered everywhere.
        </Text>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Footer')}
          style={styles.nextButton}
        >
          <Text style={styles.getStart}>Get Start</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('WelcomeFourth')}
          style={styles.nextButton}
        >
          <AntDesign style={styles.iconNext} name="right" color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7b401',
    padding: 20,
  },
  imageContainer: {
    marginBottom: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  skipText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: 'bold',
  },
  iconNext: {
    color: '#fff',
    fontSize: hp(3),
    fontWeight: 'bold',
  },
  image: {
    width: wp(80),
    height: hp(50),
  },
  title: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: hp(-10),
    textAlign: 'left',
  },
  description: {
    width: wp(75),
    fontSize: hp(2),
    color: '#fff',
    textAlign: 'left',
    marginTop: hp(2),
    lineHeight: hp(2.2),
  },
  pagination: {
    flexDirection: 'row',
    marginTop: hp(15),
    alignItems: 'center',
  },
  dot: {
    width: hp(1),
    height: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: '#D3D3D3',
    marginHorizontal: wp(1),
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  // nextButton: {
  //   position: 'absolute',
  //   bottom: hp(3),
  //   width: hp(20),
  //   height: hp(5),
  //   borderRadius: hp(1.5),
  //   backgroundColor: '#A6222C',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   alignSelf: 'center',
  // },
  nextButton: {
    position: 'absolute',
    bottom: hp(3),
    right: wp(0),
    width: hp(8),
    height: hp(6),
    borderTopLeftRadius: hp(2),
    borderBottomLeftRadius: hp(2),
    backgroundColor: '#65c5fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStart: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: hp(0.05),
  },
});

export default WelcomeThird;
