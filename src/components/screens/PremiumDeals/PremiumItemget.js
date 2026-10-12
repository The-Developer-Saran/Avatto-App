import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from '@react-native-vector-icons/feather';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import { ActivityIndicator, Modal } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import RenderHTML from 'react-native-render-html';
import { useIsFocused } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../BaseUrl/BaseUrl';
import { Authentication_Key } from '../../key/Key';
import { encryptPiDataNew } from '../Encryption/encryption';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

const { width } = Dimensions.get('window');
const ScreenWidth = Dimensions.get('window').width;

const CatalogHeader = React.memo(
  ({
    searchText,
    setSearchText,
    selectCategory,
    selectedCategory,
    handleSelectCategory,
  }) => (
    <View style={styles.catalogTopSection}>
      {/* <View style={styles.storeIllustrationRow}>
        <View style={styles.storeTextBlock}>
          <Text style={styles.storeEyebrow}>AVAXAA STORE</Text>
          <Text style={styles.storeSubtext}>Shop trusted picks from our store collection</Text>
        </View>
        <Image source={require('../../assets/images/Storemanage/store.png')} style={styles.storeIllustration} />
      </View> */}

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Feather name="search" size={hp(1.9)} color="#8F95A3" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by item"
            placeholderTextColor="#A8ADBA"
            style={styles.searchInput}
          />
        </View>
        <View style={styles.searchAction}>
          <MaterialCommunityIcons name="tune-variant" size={hp(2.15)} color="#FFFFFF" />
        </View>
      </View>

      <View>
        <SelectDropdown
          data={selectCategory}
          defaultValue={selectedCategory || selectCategory[0]}
          onSelect={handleSelectCategory}
          renderButton={(selectedItem, isOpened) => (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.title) || 'All Categories'}
              </Text>
              <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
            </View>
          )}
          renderItem={(item, index, isSelected) => (
            <View
              style={{
                ...styles.dropdownItemStyle,
                backgroundColor: isSelected ? '#B12A33' : '#fff',
                borderBottomColor: '#F0D7D9',
              }}>
              <Text style={[styles.dropdownItemTxtStyle, { color: isSelected ? '#fff' : '#5F6270' }]}>
                {item.title}
              </Text>
            </View>
          )}
          dropdownStyle={styles.dropdownMenuStyle}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
);

const PremiumItemget = ({ navigation }) => {
  const EncKey = useMemo(() => encryptPiDataNew(Authentication_Key), []);
  const isFocused = useIsFocused();

  const [InitialQuantity, setInitialQuantity] = useState(null);
  const [selectedQuantityId, setSelectedQuantityId] = useState('');
  const [selectedQuantityPrice, setSelectedQuantityPrice] = useState('');
  const [uid, setUid] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [DetailModal, setDetailModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectCategory, setSelectCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryid, setCategoryid] = useState(null);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [choosedDetails, setchoosedDetails] = useState(null);
  const [CartNo, setCartNo] = useState(null);
  const [activeAccordionId, setActiveAccordionId] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [maxquantity, setmaxQuantity] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleButtonClick = () => {
    Linking.openURL('https://avaxaa.in/panel/Login').catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const filteredItems = useMemo(() => {
    if (!items) {
      return [];
    }

    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) => item?.Item_name?.toLowerCase().includes(normalizedSearch));
  }, [items, searchText]);

  const Category_Detsils_Get = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}menuGet?menuType=SUBCATEGORY&type=M`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authentication: EncKey,
        },
      });

      const data = await response.json();

      if (data.Response.Success === '1') {
        const categories = data.Response.Result || [];
        const allCategory = { id: null, title: 'All Categories' };
        setSelectCategory([allCategory, ...categories]);
        setSelectedCategory((currentCategory) => currentCategory || allCategory);
        setCategoryid((currentCategoryId) => currentCategoryId ?? null);
      } else {
        console.log(data?.Response.Message);
        setSelectCategory([]);
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  }, [EncKey]);

  useEffect(() => {
    Category_Detsils_Get();
  }, [Category_Detsils_Get]);

  const handleSelectCategory = useCallback((selectedItem) => {
    setSelectedCategory(selectedItem);
    setCategoryid(selectedItem?.id || null);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setInitialQuantity(null);
      setSelectedQuantityId(null);
      setSelectedQuantityPrice(null);
      setmaxQuantity(null);
      setQuantity(1);
    }
  }, [isFocused]);

  const getCartDetails = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('user');

      if (value !== null) {
        setUid(value);
        const response = await fetch(`${BaseUrl}cartGet?uId=${value}&type=P`, {
          method: 'GET',
          headers: { authentication: EncKey },
        });

        response
          .json()
          .then((responseData) => {
            if (String(responseData.Response.Success) === '1') {
              setCartNo(responseData.Response.Result?.length);
            } else {
              setCartNo(0);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log('No user data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error.message);
    }
  }, [EncKey]);

  const getItems = useCallback(async () => {
    if (!isFocused) return;

    try {
      setLoading(true);
      const url = categoryid
        ? `${BaseUrl}itemGet?storeType=P&type=M&cat_id=${categoryid}`
        : `${BaseUrl}itemGet?storeType=P&type=M`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { authentication: EncKey },
      });

      const responseData = await response.json();

      if (String(responseData.Response.Success) === '1') {
        const firstItem = responseData.Response.Result[0];
        setItems(responseData.Response.Result);
        setchoosedDetails(firstItem);
        setInitialQuantity(`${firstItem?.Price_details[0]?.quantity} ${firstItem?.Price_details[0]?.units}`);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.log(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [EncKey, categoryid, isFocused]);

  useEffect(() => {
    getCartDetails();
  }, [getCartDetails, isFocused]);

  useEffect(() => {
    getItems();
  }, [getItems, isFocused, categoryid]);

  const add = () => {
    if (!InitialQuantity) {
      ToastAndroid.showWithGravityAndOffset('Choose Unit', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      setActiveAccordionId(!activeAccordionId);
    } else if (quantity === maxquantity) {
      ToastAndroid.showWithGravityAndOffset('Max quantity reached', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const sub = () => {
    if (quantity === 1) {
      setQuantity(1);
    } else {
      setQuantity(quantity - 1);
    }
  };

  const AddtoCart = async () => {
    const cartData = new FormData();
    cartData.append('uId', uid);
    cartData.append('type', 'P');
    cartData.append('item_common_id', choosedDetails?.Item_id);
    cartData.append('item_price_id', selectedQuantityId);
    cartData.append('units', quantity);

    if (!InitialQuantity) {
      ToastAndroid.showWithGravityAndOffset('Choose unit', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      setActiveAccordionId(!activeAccordionId);
    } else {
      const response = await fetch(`${BaseUrl}cartAdd`, {
        method: 'POST',
        body: cartData,
        headers: { authentication: EncKey },
      });

      response
        .json()
        .then((responseData) => {
          if (String(responseData.Response.Success) === '1') {
            ToastAndroid.showWithGravityAndOffset('Item added to cart', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            setDetailModal(false);
          } else {
            ToastAndroid.showWithGravityAndOffset(`${responseData.Response.Message}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
        })
        .finally(() => {
          getCartDetails();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const openItemDetails = (item) => {
    const firstPriceDetail = item?.Price_details?.[0];

    setchoosedDetails(item);
    setSelectedQuantityId(firstPriceDetail?.id || '');
    setSelectedQuantityPrice(firstPriceDetail?.price || '');
    setInitialQuantity(firstPriceDetail ? `${firstPriceDetail.quantity} ${firstPriceDetail.units}` : null);
    setmaxQuantity(firstPriceDetail?.max_quantity || null);
    setQuantity(1);
    setActiveAccordionId(false);
    setDetailModal(true);
  };

  const selectedPriceDetail = useMemo(() => {
    if (!choosedDetails?.Price_details?.length) {
      return null;
    }

    return (
      choosedDetails.Price_details.find((item) => `${item.id}` === `${selectedQuantityId}`) ||
      choosedDetails.Price_details[0]
    );
  }, [choosedDetails, selectedQuantityId]);

  const totalPrice = useMemo(() => {
    return Number(selectedQuantityPrice || selectedPriceDetail?.price || 0) * quantity;
  }, [quantity, selectedPriceDetail?.price, selectedQuantityPrice]);

  const handleBackButtonClick = useCallback(() => {
    navigation.goBack();
    return true;
  }, [navigation]);

  useEffect(() => {
    const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
    return () => {
      backhandler.remove();
    };
  }, [handleBackButtonClick]);

  const renderItemCard = ({ item }) => {
    const defaultPrice = item?.Price_details?.[0];

    return (
      <TouchableOpacity onPress={() => openItemDetails(item)} style={styles.productCard} activeOpacity={0.94}>
        <Image source={{ uri: item.Cover_img }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={2}>
          {item.Item_name}
        </Text>
        <Text style={styles.productMeta} numberOfLines={1}>
          {defaultPrice ? `${defaultPrice.quantity}${defaultPrice.units}` : 'Available'}
        </Text>
        {defaultPrice?.mrp ? (
          <Text style={styles.productMrp} numberOfLines={1}>
            ₹ {defaultPrice.mrp}
          </Text>
        ) : null}
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹ {defaultPrice?.price || '0.00'}</Text>
          <TouchableOpacity onPress={() => openItemDetails(item)} style={styles.quickAddButton}>
            <Feather name="plus" size={hp(1.8)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="#A5242F" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Footer')} style={styles.headerBackWrap}>
              <Icon name="left" size={20} color="white" />
              <Text style={styles.headerBackText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleButtonClick} style={styles.teamLoginButton}>
                <Text style={styles.teamLoginText}>Team Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('PremiumCartItems')} style={styles.cartButton}>
                <Feather name="shopping-cart" size={hp(2.3)} color="#fff" />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{CartNo || 0}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerText}>OFFER DEALS</Text>
          <View style={{height:hp(12)}} />
           <Image source={require('../../assets/images/Storemanage/offer_deal.png')} style={styles.storeIllustration} />

        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color="#B12A33" />
            <Text style={styles.loaderText}>Loading store items...</Text>
          </View>
        ) : (
          <>
            <CatalogHeader
              searchText={searchText}
              setSearchText={setSearchText}
              selectCategory={selectCategory}
              selectedCategory={selectedCategory}
              handleSelectCategory={handleSelectCategory}
            />
            <FlatList
              data={filteredItems}
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
            />
          </>
        )}

        <Modal animationType="fade" transparent visible={DetailModal} onDismiss={() => setDetailModal(false)}>
          <View style={styles.productModalOverlay}>
            <View style={styles.productModalSheet}>
              <View style={styles.productModalTopBar}>
                <TouchableOpacity onPress={() => setDetailModal(false)} style={styles.productModalBack}>
                  <Icon name="left" size={20} color="#FFFFFF" />
                  <Text style={styles.productModalBackText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PremiumCartItems')} style={styles.productModalCart}>
                  <Feather name="shopping-cart" size={hp(2.15)} color="#FFFFFF" />
                  <View style={styles.productModalCartBadge}>
                    <Text style={styles.productModalCartBadgeText}>{CartNo || 0}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productModalContent} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.productGalleryCard}>
                  <Swiper
                    style={styles.wrapper}
                    autoplay
                    autoplayTimeout={3}
                    loop
                    dotStyle={styles.modalDot}
                    activeDotStyle={styles.modalActiveDot}
                    paginationStyle={styles.modalPagination}>
                    {(choosedDetails?.Extra_image?.length ? choosedDetails.Extra_image : [{ url: choosedDetails?.Cover_img }]).map((item, index) => (
                      <View key={index} style={styles.slide}>
                        <Image source={{ uri: item.url }} style={styles.modalProductImage} resizeMode="cover" />
                      </View>
                    ))}
                  </Swiper>
                </TouchableOpacity>

                <View style={styles.productMetaWrap}>
                  <Text style={styles.modalProductName}>{choosedDetails?.Item_name}</Text>
                  <Text style={styles.modalProductMrp}>MRP : ₹ {selectedPriceDetail?.mrp || '0.00'}</Text>
                  <Text style={styles.modalProductPrice}>₹ {selectedPriceDetail?.price || '0.00'}</Text>
                </View>

                <View style={styles.modalControlsRow}>
                  <TouchableOpacity onPress={() => setActiveAccordionId(!activeAccordionId)} style={styles.modalVariantButton}>
                    <Text style={styles.modalVariantButtonText}>{InitialQuantity}</Text>
                    <SimpleLineIcons name={activeAccordionId ? 'arrow-up' : 'arrow-down'} size={hp(1.5)} color="#8D93A5" />
                  </TouchableOpacity>
                  <View style={styles.modalQtyStepper}>
                    <TouchableOpacity onPress={sub} style={styles.modalQtyAction}>
                      <Feather name="minus" size={hp(1.6)} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.modalQtyText}>{quantity}</Text>
                    <TouchableOpacity onPress={add} style={styles.modalQtyAction}>
                      <Feather name="plus" size={hp(1.6)} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {activeAccordionId ? (
                  <View style={[styles.modalVariantList,{width:wp(35)}]}>
                    <FlatList
                      data={choosedDetails?.Price_details}
                      keyExtractor={(item, index) => `${item?.id || index}`}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setInitialQuantity(`${item.quantity} ${item.units}`);
                            setActiveAccordionId(false);
                            setmaxQuantity(item.max_quantity);
                            setQuantity(1);
                            setSelectedQuantityId(item.id);
                            setSelectedQuantityPrice(item.price);
                          }}
                          style={[styles.modalVariantOption,]}>
                          <Text style={styles.modalVariantOptionText}>{`${item.quantity} ${item.units}`}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ) : null}

                <View style={styles.modalDescriptionBlock}>
                  <Text style={styles.modalDescriptionTitle}>Description</Text>
                  {choosedDetails?.Description ? (
                    <RenderHTML source={{ html: choosedDetails.Description }} contentWidth={ScreenWidth * 0.88} />
                  ) : (
                    <Text style={styles.modalFallbackText}>No description available</Text>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalBottomBar}>
                <Text style={styles.modalBottomPrice}>₹ {totalPrice.toFixed(2)}</Text>
                <TouchableOpacity onPress={AddtoCart} style={styles.modalAddToCartButton}>
                  <Text style={styles.modalAddToCartText}>Add to cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
          <View style={{ height: hp(100), width: wp(100), backgroundColor: '#fff' }}>
            <Swiper
              style={styles.wrapper}
              autoplayTimeout={3}
              loop
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={styles.pagination}>
              {choosedDetails?.Extra_image?.map((item, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
                </View>
              ))}
            </Swiper>

            <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20 }} onPress={closeModal}>
              <Image source={require('../AvaxaaStore/images/cross.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default PremiumItemget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3F3',
  },
  header: {
    backgroundColor: '#A5242F',
    paddingTop: hp(6),
    paddingBottom: hp(2.2),
    paddingHorizontal: wp(5),
    borderBottomLeftRadius: hp(0),
    borderBottomRightRadius: hp(20),
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackText: {
    color: '#FDE9EA',
    fontSize: hp(1.55),
    marginLeft: wp(1.5),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLoginButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    marginRight: wp(2.6),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  teamLoginText: {
    color: '#FFFFFF',
    fontSize: hp(1.35),
    fontWeight: '700',
  },
  cartButton: {
    padding: hp(0.5),
  },
  cartBadge: {
    minWidth: hp(1.8),
    height: hp(1.8),
    paddingHorizontal: wp(0.5),
    backgroundColor: '#F4E2A3',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -2,
    right: -2,
  },
  cartBadgeText: {
    color: '#81242B',
    fontSize: hp(1),
    fontWeight: '700',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: hp(2.1),
    fontWeight: '700',
    position:'absolute',
    top:110,
    left:20

  },
  catalogTopSection: {
    paddingTop: hp(2),
    paddingHorizontal: wp(4.5),
    paddingBottom: hp(0.5),
  },
  storeIllustrationRow: {
    backgroundColor: '#B12A33',
    borderRadius: hp(2.2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeTextBlock: {
    flex: 1,
    paddingRight: wp(2),
  },
  storeEyebrow: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  storeSubtext: {
    color: '#F7DDE0',
    fontSize: hp(1.45),
    marginTop: hp(0.6),
    lineHeight: hp(2),
  },
  storeIllustration: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'contain',
    position:'absolute',
    right:15,
    top:70
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.8),
  },
  searchInputWrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.4),
    paddingHorizontal: wp(4),
    height: hp(5.2),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#74232B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#2D3142',
    fontSize: hp(1.65),
    marginLeft: wp(2.4),
    paddingVertical: 0,
  },
  searchAction: {
    width: hp(5.2),
    height: hp(5.2),
    borderRadius: hp(2.6),
    backgroundColor: '#B12A33',
    marginLeft: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: hp(5.2),
    borderRadius: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.8),
    borderWidth: 1,
    borderColor: '#EDD8DA',
    marginTop: hp(1.5),
    backgroundColor: '#FFFFFF',
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: hp(1.65),
    color: '#565A68',
    fontWeight: '600',
  },
  dropdownButtonArrowStyle: {
    fontSize: hp(3),
    color: '#B12A33',
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: '#EDD8DA',
    marginTop: hp(-5.6),
  },
  dropdownItemStyle: {
    width: '100%',
    paddingVertical: hp(1.25),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  dropdownItemTxtStyle: {
    fontSize: hp(1.75),
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: hp(4),
  },
  productGridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(4.5),
  },
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
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: hp(1.3),
    color: '#B12A33',
    fontSize: hp(1.8),
    fontWeight: '600',
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
    height:hp(100),
    width:wp(100),
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
    marginRight:10
   
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
    width:wp(90),
    borderRadius:hp(2),
    alignSelf:'center',
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
});
