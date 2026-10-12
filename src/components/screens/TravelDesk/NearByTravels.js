import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, StatusBar, } from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import Icon from '@react-native-vector-icons/ant-design';
import FontAwesome5 from "@react-native-vector-icons/fontawesome5";
import { BaseUrl } from '../BaseUrl/BaseUrl';



export default function NearByTravels() {
  const navigation = useNavigation();
  const cartCount = 34;
  const EncKey = encryptPiDataNew(Authentication_Key);

  const [category, setCategory] = useState([]);
  const [businessList, setBusinessList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);


  const location = {
    "lat": "11.04481280",
    "long": "76.94558150",
  }




  useEffect(() => {
    handleFetchCat();
  }, []);

  const handleFetchCat = async () => {
    console.log("EncKey :", EncKey);
    
    try {
      const response = await fetch(`${BaseUrl}menuGet?menuType=CATEGORY&type=M`, {
        method: 'GET',
        headers: {
          authentication: EncKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const FinalData = data.Response;
      if (FinalData.Success == '1') {
        setCategory(FinalData.Result);
        const initialId = FinalData.Result[0].id;
        setSelectedId(initialId);
        handleFetchNearByBus();
        console.log('Initial Category ID:', initialId);
      } else {
        console.log('No data found');
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };





  const handleSelectCat = (id) => {
    setSelectedId(id);
  };


  useEffect(() => {
    handleFetchNearByBus();
  }, [selectedId])


  // console.log("selectedId :", selectedId);


  const handleFetchNearByBus = async () => {
    console.log("selectedId :", selectedId);
    
    try {
      const response = await fetch(`${BaseUrl}travelGet?latitude=${location.lat}&longitude=${location.long}`, {
        method: 'GET',
        headers: {
          authentication: EncKey,
          'Content-Type': 'application/json',
        },
      });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      const data = await response.json();
      const FinalData = data.Response;
           console.log("data :", data);
      if (FinalData.Success == '1') {
           
        setBusinessList(FinalData.Result);
      } else if (FinalData.Success == '0') {
        setBusinessList([])
        console.log('No data found');
      } else {
        setBusinessList([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };





const handleSelectBusiness = (Result) => {
  navigation.navigate('TravelDesk', { Result });
}












  // const renderCategoryItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={[
  //       styles.categoryItem,
  //       item.id === selectedId && styles.selectedCategory,
  //     ]}
  //     onPress={() => handleSelectCat(item.id)}
  //   >
  //     <Text style={styles.categoryTitle}>{item.title}</Text>
  //   </TouchableOpacity>
  // );





  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.BusinessContainer,
      ]}
      onPress={() => handleSelectBusiness(item)}>
      <Image source={
        item.logo? 
        { uri: item.logo } :
      require('../../assets/images/Home/avaxaa.png')} 
        style={styles.businessImage} />



      <View style={styles.midSection}>
        <Text style={styles.businessTitle}>{item.business_name}</Text>

        <View style={styles.locationContainer}>
          <Text style={styles.businessAddress}>{item.address}</Text>
          <Text style={styles.businessCity}>{item.city_name}</Text>
        </View>

        <View style={styles.distenceContainer}>
          <Ionicons style={styles.locationIcon} name="location" color="#000" />
          <Text style={styles.businessDistance}>{item.distance.toFixed(2)} km</Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <AntDesign style={styles.rightIcon} name="right" color="#000" />
      </View>
    </TouchableOpacity>
  );





  return (
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.header}>
    //     <TouchableOpacity onPress={()=>navigation.navigate("Footer")} style={styles.backContainer}>
    //       <Ionicons style={styles.backIcon} name="chevron-back" color="#000" />
    //       <Text style={styles.backText}>STORE DEALS</Text>
    //     </TouchableOpacity>


    //     <TouchableOpacity style={styles.cartButton}>
    //       <Entypo style={styles.cartIcon} name="shopping-cart" color="#000" />
    //       <Text style={styles.cartItemCount}>{cartCount}</Text>
    //     </TouchableOpacity>
    //   </View>
<>
   <StatusBar  backgroundColor='#A6222C' />
                    <View style={styles.container}>
        
                        <View  style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.navigate("Footer")} style={{flexDirection:'row',marginTop:hp(0)}}>
                                <Icon onPress={() => navigation.navigate("Footer")} name="left" size={22} color="white" style={{ marginTop: hp(0) }} />
                                <Text onPress={() => navigation.navigate("Footer")} style={styles.headerText}>TRAVEL DESK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={{ padding: hp(1),marginTop:hp(3) }}>
                                {/* <FontAwesome5 name="shopping-cart" size={hp(2.5)} color="#fff" style={{ marginRight: hp(1) }} />
                                <View style={{ height: hp(1.8), width: hp(1.8), backgroundColor: 'red', borderRadius: hp(10), justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 10 }}>
                                    <Text style={{ color: '#fff', fontSize: hp(1) }}>{cartCount}</Text>
                                </View> */}
        
                            </TouchableOpacity>
                        </View>


      {/* <View style={styles.categoryListContainer}>
        <FlatList
          data={category}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.flatListContent}
        />
      </View> */}


      <View>
        <View style={styles.businessListContainer}>
        {businessList.length > 0 ? (
  <FlatList
    data={businessList}
    // horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderBusinessItem}
    contentContainerStyle={styles.flatListContent}
  />
) : (
  <View style={styles.noDataContainer}>
    <Text style={styles.noDataText}>No data found</Text>
  </View>
)}
        </View>
      </View>
      </View>
      </>
  );
};


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  // header: {
  //   width: wp(100),
  //   alignItems: 'flex-end',
  //   padding: hp(1),
  //   flexDirection: 'row',
  //   justifyContent: 'space-between'
  // },
  // backContainer: {
  //   // width:wp(20),
  //   flexDirection:'row',
  //   alignItems:'center'
  // },
  // backIcon: {
  //   fontSize: hp(3),
  //   color: 'green',
  //   fontWeight: '900'
  // },
  // backText: {
  //   fontSize: hp(2),
  //   color: '#000',
  //   fontWeight: '600',
  //   // marginLeft:hp(1),
  // },
  // cartButton: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-start',
  // },
  // cartIcon: {
  //   fontSize: hp(3.5),
  //   color: 'green',
  // },
  // cartItemCount: {
  //   backgroundColor: '#fcb713',
  //   borderRadius: hp(2),
  //   paddingHorizontal: hp(0.7),
  //   paddingVertical: hp(0.35),
  //   fontSize: hp(1.6),
  //   fontWeight: '700',
  //   marginLeft: hp(-1),
  //   marginTop: hp(-0.5),
  // },

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
  categoryListContainer: {
    marginTop: hp(2),
    paddingHorizontal: wp(2),
  },
  flatListContent: {
    paddingHorizontal: wp(1),
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: wp(4),
    paddingHorizontal: hp(3),
    paddingVertical: hp(1),
    borderBottomColor: 'transparent',
    borderBottomWidth: hp(0.5),
  },
  selectedCategory: {
    borderBottomColor: '#A6222C',
    borderBottomWidth: hp(0.5),
  },
  categoryTitle: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#3d3d3d'
  },

  businessImage: {
    height: hp(13),
    width: hp(13),
    borderRadius: hp(1),
    resizeMode: "stretch"
  },
  BusinessContainer: {
    backgroundColor: '#e0c7c9',
    width: wp(90),
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(1),
    borderRadius: hp(1.5),
    marginVertical: hp(1.5)
  },
  businessListContainer: {
    alignItems: 'center'
  },

  midSection: {
    marginLeft: hp(1),
    width: wp(49),
  },
  businessTitle: {
    fontSize: hp(1.9),
    fontWeight: 'bold',
    color: '#3d3d3d',
    marginVertical: hp(0.2),
    width: wp(50),
    flexWrap: 'wrap',
  },
  businessDistance: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    marginVertical: hp(0.5),
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
    width: wp(50),
    flexWrap: 'wrap'
  },
  businessAddress: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    textTransform: 'capitalize',
    fontWeight: '400',
    marginRight: hp(1),
  },
  businessCity: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  businessState: {
    fontSize: hp(1.8),
    color: '#3d3d3d',
    marginLeft: hp(1),
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  rightIcon: {
    fontSize: hp(2.5),
    color: '#fff',
    backgroundColor: '#A6222C',
    // marginRight: hp(-1),
    padding: hp(1),
    borderTopLeftRadius: hp(1.5),
    borderBottomLeftRadius: hp(1.5),
  },
  distenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: hp(2.2),
    color: '#A6222C',
    marginRight: hp(1)
  },
  btnContainer:{
alignSelf:'center',
  },
  noDataText:{
marginTop:hp(40),
color:'#000',
fontSize:hp(2)
  },
});
