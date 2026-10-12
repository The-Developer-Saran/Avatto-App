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
import Icon from '@react-native-vector-icons/fontawesome5';
import IconN from '@react-native-vector-icons/fontawesome6';
import AntDesign from '@react-native-vector-icons/ant-design';

// onPress={()=> navigation.navigate('Footer')}

const WelcomeFirst = ({ navigation }) => {
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
            marginRight: hp(2),
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
            source={require('../../assets/images/Welcome/welcomescreen11.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={{ padding: 20 }}>
          <Text style={styles.title}>PAY LESS</Text>
          <Text style={styles.title}>SAVE MORE</Text>
          <Text style={styles.description}>
            Get a chance to pay less on each and every transaction you make at
            our Providers.
          </Text>
        </View>

        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('WelcomeSecond')}
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
    backgroundColor: '#00a474',
    padding: 10,
  },
  skipButton: {
    position: 'absolute',
    top: hp(10),
    right: wp(5),
    width: wp(20),
    height: hp(3),
    backgroundColor: '#d3d3d3',
    borderRadius: hp(2),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  skipText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: hp(5),
  },
  icon: {
    color: '#fff',
    fontSize: hp(2),
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
    color: '#fff', // Green color
    textAlign: 'left',
  },
  description: {
    width: wp(75),
    fontSize: hp(2),
    color: '#fff',
    textAlign: 'left',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center',
    marginLeft:hp(2)
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
    right: wp(0),
    width: hp(8),
    height: hp(6),
    borderTopLeftRadius:hp(2),
    borderBottomLeftRadius:hp(2),
    backgroundColor: '#ff6347',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeFirst;
