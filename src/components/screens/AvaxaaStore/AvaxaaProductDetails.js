import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


const AvaxaaProductDetails = ({
    choosedDetails,
    quantity,
    InitialQuantity,
    selectedQuantityPrice,
    activeAccordionId,
    setActiveAccordionId,
    sub,
    add,
    setInitialQuantity,
    setmaxQuantity,
    setQuantity,
    setSelectedQuantityId,
    setSelectedQuantityPrice,
    AddtoCart,
    navigation,
    setModalVisible,
    carouselRef
}) => {

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: hp(1.5), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: wp(85) }}>
                <Text style={{ color: '#000', fontSize: hp(2), textAlign: 'center' }}>{choosedDetails?.Item_name}</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.carouselsection}>
                <Swiper
                    style={styles.wrapper}
                    autoplay
                    autoplayTimeout={3}
                    loop
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                    paginationStyle={styles.pagination}
                >
                    {choosedDetails?.Extra_image.map((item, index) => (
                        <View key={index} style={styles.slide}>
                            <Image
                                source={{ uri: item.url }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </Swiper>
            </TouchableOpacity>

            <View style={{ width: wp(65), height: hp(4), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ fontSize: hp(1.5), color: '#d3d3d3', textAlign: 'center', marginTop: hp(1), fontWeight: 'bold', textDecorationLine: 'line-through' }}>
                    MRP : ₹ {choosedDetails?.Price_details[0]?.mrp}
                </Text>
                <Text style={{ fontSize: hp(2), color: '#000', textAlign: 'center', marginTop: hp(1), fontWeight: 'bold' }}>
                    ₹ {choosedDetails?.Price_details[0]?.price}
                </Text>
            </View>

            {/* Carousel Prev & Next Buttons */}
            <TouchableOpacity onPress={() => carouselRef.current?.prev()} style={styles.leftArrowButton}>
                <Feather name="arrow-left" size={hp(2)} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => carouselRef.current?.next()} style={styles.rightArrowButton}>
                <Feather name="arrow-right" size={hp(2)} color="#fff" />
            </TouchableOpacity>

            {/* Quantity & Variant Selector */}
            <View style={styles.quantitySection}>
                <TouchableOpacity onPress={() => { setActiveAccordionId(!activeAccordionId) }} style={styles.quantityDropdown}>
                    <Text style={styles.quantityText}>{InitialQuantity}</Text>
                    <SimpleLineIcons name={activeAccordionId ? "arrow-right" : 'arrow-down'} size={hp(2)} color="#fff" style={{ marginLeft: hp(1) }} />
                </TouchableOpacity>

                <View style={styles.counterBox}>
                    <TouchableOpacity onPress={sub}><Text style={styles.counterBtn}>-</Text></TouchableOpacity>
                    <Text style={styles.counterValue}>{quantity}</Text>
                    <TouchableOpacity onPress={add}><Text style={styles.counterBtn}>+</Text></TouchableOpacity>
                </View>
            </View>

            {activeAccordionId && (
                <View style={styles.accordionBox}>
                    <FlatList
                        data={choosedDetails?.Price_details}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setInitialQuantity(`${item.quantity} ${item.units}`);
                                    setActiveAccordionId(!activeAccordionId);
                                    setmaxQuantity(item.max_quantity);
                                    setQuantity(1);
                                    setSelectedQuantityId(item.id);
                                    setSelectedQuantityPrice(item.price);
                                }}
                                style={styles.accordionItem}
                            >
                                <Text>{`${item.quantity} ${item.units}`}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {/* Description */}
            <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>Description</Text>
                {choosedDetails?.Description ? (
                    <RenderHTML
                        source={{ html: choosedDetails.Description }}
                        contentWidth={wp(95)}
                    />
                ) : (
                    <Text>No description available</Text>
                )}
            </View>

            {/* Add to Cart Section */}
            <View style={styles.cartSection}>
                <Text style={styles.cartPrice}>₹ {selectedQuantityPrice * quantity}.00</Text>
                <TouchableOpacity onPress={() => { AddtoCart(choosedDetails?.Item_id); }} style={styles.addToCartBtn}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: hp(5) }} />
        </ScrollView>
    );
};

export default AvaxaaProductDetails;