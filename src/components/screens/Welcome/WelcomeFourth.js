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

const WelcomeFourth = ({ navigation }) => {
  return (
    <>
      <StatusBar backgroundColor="#0000" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          {/* Replace the source with the appropriate image asset */}
          <Image
            source={require('../../assets/images/Welcome/welcomescreen44.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>MANAGED EXPENSES</Text>
        <Text style={styles.description}>
          We provide an Expense Manager where you can manage all your payments
          of every type in single place and control them easily.
        </Text>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
             <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
       
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Footer')}
          style={styles.nextButton}
        >
          <Text style={styles.getStart}>Get Start</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#65c5fd',
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
  nextButton: {
    position: 'absolute',
    bottom: hp(3),
    right:0,
    width: hp(20),
    height: hp(5),
    borderTopLeftRadius:hp(1),
    borderBottomLeftRadius:hp(1),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  getStart: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: hp(0.05),
  },
});

export default WelcomeFourth;
