// import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, FlatList } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from '@react-native-vector-icons/ant-design';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import RenderHtml from 'react-native-render-html';

// const MyActivity = ({navigation}) => {

//     const [list, setList] = useState(null);
//     const [loader, setLoader] = useState(true);

//     const getActivity = async () => {
//         try {
//             const response = await fetch(`https://sparkredeem.com/avatto/Myactivityget?uid=1`, {
//                 method: 'GET',

//             })
//             const responseData = await response.json();
//             if (responseData.Response.Success == 1) {
//                 setList(responseData.Response.Data);
//             } else {
//                 setList(null);
//                 console.log(responseData.Response.Message)
//             }
//         }
//         catch (err) {
//             console.log('Error ehile fetching activity list ', err)
//         } finally {
//             setLoader(false)
//         }
//     }

//     useEffect(() => {
//         getActivity()
//     }, [])

//     const formatDate = (datestr) => {
//         const isoDate = datestr;

//         const date = new Date(isoDate);

//         const formatted =
//             String(date.getDate()).padStart(2, '0') + '-' +
//             String(date.getMonth() + 1).padStart(2, '0') + '-' +
//             date.getFullYear();

//         return formatted
//     }

//     return (

//         <SafeAreaView style={styles.container}>
//             <StatusBar backgroundColor='#A6222C' />
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{ flexDirection: 'row', marginTop: hp(0) }}>
//                     <Icon onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
//                     <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>My Activity</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.listView}>
//                 <FlatList
//                     data={list}
//                     keyExtractor={(item, index) => index + 1}
//                     renderItem={({ item }) => {
//                         const formatedDate = formatDate(item.un_created_at)
//                         return (
//                             <View style={styles.maincontentView}>
//                                 <View style={styles.dateView}>
//                                     <Text style={styles.date}>{formatedDate}</Text>
//                                 </View>
//                                 <View style={styles.contentMainView}>
//                                     <View style={styles.iconView}>
//                                         <Image source={require('./assets/restore.png')} style={styles.icon} />
//                                     </View>
//                                     <View style={styles.contentView}>
//                                         <Text style={styles.contentText}>{item.un_title}</Text>
//                                         <RenderHtml
//                                             contentWidth={'60%'}
//                                             source={{ html: `${item.un_message}` }}
//                                         />
//                                     </View>
//                                 </View>
//                             </View>
//                         )
//                     }}

//                 />
//             </View>

//         </SafeAreaView>
//     )
// }

// export default MyActivity

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         backgroundColor: '#A6222C',
//         // backgroundColor: '#ff6000',
//         height: hp(8),
//         padding: hp(1.5),
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },

//     headerText: {
//         color: "#fff",
//         fontSize: hp(2),
//         fontWeight: "bold",
//         marginTop: hp(0),
//         marginLeft: wp(5),
//         fontFamily: "DMSans-Medium",
//     },
//     maincontentView: {
//         padding: 10,
//         width: wp(90),
//         alignSelf: 'center',
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 3,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         marginTop: hp(2)
//     },
//     dateView: {
//         padding: 5,
//         width: wp(30),
//         backgroundColor: '#A6222C',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 10
//     },
//     date: {
//         color: '#fff'
//     },
//     icon: {
//         height: hp(5),
//         width: hp(5)
//     },
//     iconView: {
//         padding: 2,
//         width: wp(20),
//         justifyContent: 'center',
//         alignItems: 'center',

//     },
//     contentView: {
//         padding: 5,
//         width: wp(70),
//     },
//     contentText: {
//         fontSize: hp(2),
//         fontWeight: '600',

//     },
//     contentMainView: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignSelf: 'center',
//         width: wp(90),
//     },
//     listView: {
//         height: hp(80),
//         width: wp(100),
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

// })

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ant-design';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA = [
  { id: '1', day: '04', month: 'Jan' },
  { id: '2', day: '28', month: 'Dec' },
  { id: '3', day: '15', month: 'Dec' },
  { id: '4', day: '02', month: 'Dec' },
];

const formatDate = datestr => {
  //     console.log('====================================');
  //     console.log(datestr);
  //     console.log('====================================');
  //   const isoDate = datestr;
  //   const date = new Date(isoDate);
  //   const formatted =
  //     String(date.getDate()).padStart(2, '0') +
  //     '-' +
  //     String(date.getMonth() + 1).padStart(2, '0') +
  //     '-' +
  //     date.getFullYear();

  //   return formatted;

  const dateString = datestr;
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date
    .toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const formattedDate = `${day} ${month}`;
  return formattedDate;
};

const MyActivity = () => {
  const [list, setList] = useState(null);
  const [loader, setLoader] = useState(true);

  const navigation = useNavigation();

  const getActivity = async () => {
    try {
      const value = await AsyncStorage.getItem('user'); // Wait for AsyncStorage to retrieve the item

      if (value !== null) {
        const response = await fetch(
          `${BaseUrl}Myactivityget?uid=${value}`,
          //`https://sparkredeem.com/avatto/Myactivityget?uid=1`,
          {
            method: 'GET',
          },
        );
        const responseData = await response.json();
        if (responseData.Response.Success == 1) {
          setList(responseData.Response.Data);
        } else {
          setList(null);
          console.log(responseData.Response.Message);
        }
      }
    } catch (err) {
      console.log('Error ehile fetching activity list ', err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getActivity();
  }, []);

  const { width } = useWindowDimensions();

  const NotificationCard = ({ item }) => {
    const formatedDate = formatDate(item.un_created_at);
    return (
      <View style={styles.card}>
        {/* Date Box */}
        <View
          style={[
            styles.dateBox,
            {
              backgroundColor: '#A6222C',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.dayText, { textAlign: 'center' }]}>
            {formatedDate}
          </Text>
          {/* <Text style={styles.monthText}>{month}</Text> */}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{item?.un_title}</Text>
          {/* <Text style={styles.subtitle}>{item?.un_message}</Text> */}
          <RenderHtml
            contentWidth={width}
            source={{ html: `${item.un_message}` }}
            tagsStyles={{
              strong: {
                fontWeight: 'bold',
              },
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { width: wp(100) }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Footer')}
          style={{ flexDirection: 'row', marginTop: hp(0) }}
        >
          <Icon
            onPress={() => navigation.navigate('Footer')}
            name="left"
            size={22}
            color="white"
            style={{ marginTop: hp(0) }}
          />
          <Text
            onPress={() => navigation.navigate('Footer')}
            style={styles.headerText}
          >
            My Activity
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MyActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: wp(95),
    alignSelf: 'center',
  },

  dateBox: {
    width: 80,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingVertical: 10,
  },

  dayText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  monthText: {
    fontSize: 16,
    color: '#fff',
  },

  content: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: '#555',
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
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
    marginTop: hp(0),
    marginLeft: wp(5),
    fontFamily: 'DMSans-Medium',
  },
});
