import { BackHandler, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Form } from 'lucide-react-native';
import Feather from '@react-native-vector-icons/feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ScreenWidth = Dimensions.get('window').width;


const ProductList = ({ navigation }) => {

  const [List, setList] = useState([]);

  const getList = async () => {

    const inputData = new FormData();
    inputData.append('req_type', '1');
    inputData.append('res_type', '1');
    inputData.append('action', 'get');
    try {
      const response = await fetch('https://avatto.info/admin_avatto/productManage', {
        method: 'POST',
        body: inputData,
        headers: {
          authentication: `U2FsdGVkX1+GlwN//3zk31Sm9LK1WafujRfUtRVhbR/GA92/CCrS4ECcQr1kXNNY`
        }
      })
      const responseData = await response.json();
      console.log('Product List Response:', responseData);
      if (responseData.Response.Success == 1) {
        setList(responseData.Response.Data);
      } else {
        alert(responseData.Response.Message);
      }
    } catch (error) {
      alert('An error occurred while fetching the product list. Please try again later.');
      console.error('Fetch error:', error);
    }
  }

  useEffect(() => {
    getList();
  }, [])

  const renderItemCard = ({ item }) => {

    const openItemDetails = (item) => {
      navigation.navigate('ProductDescription', { product: item });
    }

    return (
      <TouchableOpacity onPress={() => openItemDetails(item)} style={styles.productCard} activeOpacity={0.94}>
        <Image source={{ uri: item.product_image }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹ {item.product_price || '0.00'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

      function handleBackButtonClick() {
                navigation.navigate('MillionareClub');
                return true;
            }
        
            useEffect(() => {
                const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
                return () => {
                    backhandler.remove();
                };
            }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B2232D' }}>
      <StatusBar backgroundColor={'#B2232D'} barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#F7F4F4', }}>
        <View style={{ padding: 10, backgroundColor: '#B2232D' }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleBackButtonClick}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
            <Text style={{ color: '#fff', marginLeft: 10 }}>Back</Text>
          </TouchableOpacity>

        </View>

        <FlatList
          data={List}
          keyExtractor={(item, index) => `${item?.Item_id || index}`}
          numColumns={2}
          renderItem={renderItemCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.productGridRow}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>Try another search or change the category filter.</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: hp(10) }}></View>}
        />
      </View>


    </SafeAreaView>

  )
}

export default ProductList

const styles = StyleSheet.create({
  productCard: {
    width: wp(42.5),
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1.8),
    padding: hp(1.05),
    marginTop: hp(1.6),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: hp(11),
    borderRadius: hp(1.2),
    backgroundColor: '#FAF6F6',
    resizeMode: 'cover',
  },
  productName: {
    color: '#A5242F',
    fontSize: hp(1.5),
    fontWeight: '700',
    marginTop: hp(0.9),
    minHeight: hp(3.8),
  },
  productMeta: {
    color: '#8D92A0',
    fontSize: hp(1.2),
    marginTop: hp(0.35),
  },
  productMrp: {
    color: '#B7B8C1',
    fontSize: hp(1.15),
    marginTop: hp(0.35),
    textDecorationLine: 'line-through',
  },
  productFooter: {
    marginTop: hp(0.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    color: '#7B0F18',
    fontSize: hp(1.55),
    fontWeight: '800',
  },
  quickAddButton: {
    width: hp(2.9),
    height: hp(2.9),
    borderRadius: hp(1.45),
    backgroundColor: '#B12A33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: hp(4),
  },
  productGridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(4.5),
  },
  emptyState: {
    minHeight: hp(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyStateTitle: {
    color: '#5A3A3D',
    fontSize: hp(2.2),
    fontWeight: '700',
  },
  emptyStateText: {
    color: '#8D8185',
    fontSize: hp(1.65),
    marginTop: hp(0.7),
    textAlign: 'center',
  },
  productModalOverlay: {
    // flex: 1,
    height: hp(100),
    width: wp(100),
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  productModalSheet: {
    flex: 1,
    backgroundColor: '#F7F4F4',
  },
  productModalTopBar: {
    backgroundColor: '#B12A33',
    paddingTop: hp(1.4),
    paddingBottom: hp(1.4),
    paddingHorizontal: wp(4.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productModalBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productModalBackText: {
    color: '#FFFFFF',
    fontSize: hp(1.7),
    marginLeft: wp(1.5),
    fontWeight: '500',
  },
  productModalCart: {
    padding: hp(0.4),
  },
  productModalCartBadge: {
    minWidth: hp(1.8),
    height: hp(1.8),
    borderRadius: hp(0.9),
    backgroundColor: '#F5E2A6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -2,
    top: -2,
    paddingHorizontal: wp(0.4),
  },
  productModalCartBadgeText: {
    color: '#8E2029',
    fontSize: hp(0.95),
    fontWeight: '700',
  },
  productModalContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.6),
    paddingBottom: hp(13),
  },
  productGalleryCard: {
    width: '100%',
    height: hp(21),
    borderRadius: hp(2),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
  modalProductImage: {
    width: '100%',
    height: '100%',
  },
  modalDot: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },
  modalActiveDot: {
    backgroundColor: '#B12A33',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },
  modalPagination: {
    bottom: 8,
  },
  productMetaWrap: {
    marginTop: hp(1.1),
  },
  modalProductName: {
    color: '#A5242F',
    fontSize: hp(1.95),
    fontWeight: '500',
  },
  modalProductMrp: {
    color: '#C17F88',
    fontSize: hp(1.3),
    marginTop: hp(0.35),
    textDecorationLine: 'line-through',
  },
  modalProductPrice: {
    color: '#B12A33',
    fontSize: hp(2.2),
    marginTop: hp(0.35),
    fontWeight: '700',
  },
  modalControlsRow: {
    marginTop: hp(1.4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalVariantButton: {
    minWidth: wp(28),
    height: hp(4.6),
    borderWidth: 1,
    borderColor: '#E3DDE0',
    borderRadius: hp(1.1),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalVariantButtonText: {
    color: '#8D93A5',
    fontSize: hp(1.55),
  },
  modalQtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8D7DA',
    borderRadius: hp(1.2),
    borderWidth: 1,
    borderColor: '#E8D7DA',
    paddingHorizontal: wp(0),
    marginRight: 10

  },
  modalQtyAction: {
    width: hp(3),
    height: hp(3),
    borderRadius: hp(0.8),
    backgroundColor: '#A6222C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalQtyText: {
    color: '#B12A33',
    fontSize: hp(1.8),
    fontWeight: '700',
    marginHorizontal: wp(2.5),
  },
  modalVariantList: {
    marginTop: hp(1),
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1.2),
    borderWidth: 1,
    borderColor: '#EAE3E5',
    overflow: 'hidden',
  },
  modalVariantOption: {
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAEB',
  },
  modalVariantOptionText: {
    color: '#5E6371',
    fontSize: hp(1.55),
  },
  modalDescriptionBlock: {
    marginTop: hp(1.8),
  },
  modalDescriptionTitle: {
    color: '#B12A33',
    fontSize: hp(1.7),
    fontWeight: '700',
    marginBottom: hp(0.7),
  },
  modalFallbackText: {
    color: '#8D93A5',
    fontSize: hp(1.45),
  },
  modalBottomBar: {
    position: 'absolute',

    bottom: 50,
    width: wp(90),
    borderRadius: hp(2),
    alignSelf: 'center',
    backgroundColor: '#A6222C33',
    borderTopWidth: 1,
    borderTopColor: '#EEDBDD',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBottomPrice: {
    color: '#B12A33',
    fontSize: hp(2.5),
    fontWeight: '700',
  },
  modalAddToCartButton: {
    width: wp(38),
    height: hp(4.8),
    borderRadius: hp(2.4),
    backgroundColor: '#B12A33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddToCartText: {
    color: '#FFFFFF',
    fontSize: hp(1.65),
    fontWeight: '700',
  },
  carouselsection: {
    width: '100%',
    height: width / 1.5,
    marginTop: hp(1),
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: hp(1.5),
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  pagination: {
    bottom: 10,
  },

})