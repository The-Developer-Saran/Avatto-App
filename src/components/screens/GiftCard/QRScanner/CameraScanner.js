import React, { useRef, useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Image,
    BackHandler,
    ToastAndroid,
    Platform,
    PermissionsAndroid
} from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNHoleView } from 'react-native-hole-view';
import { getWindowHeight, getWindowWidth } from './helpers';
import AntDesign from '@react-native-vector-icons/ant-design';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Entypo from '@react-native-vector-icons/entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNQRGenerator from 'rn-qr-generator';
import { useNavigation } from '@react-navigation/native';




const CameraScanner = ({ setIsCameraShown, onReadCode }) => {
    const device = useCameraDevice('back');
    const camera = useRef(null);
    const navigation = useNavigation();
    useEffect(() => {
        if (!device) {
            ToastAndroid.showWithGravityAndOffset(
                'Camera could not be started',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            setIsCameraShown(false);
        }
    }, [device]);

    const onError = error => {
        // navigation.navigate('Home')
        ToastAndroid.showWithGravityAndOffset(
            'Camera Error',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        // Alert.alert('Camera Error', error.message);
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: codes => {
            if (codes?.[0]?.value) {
                setTimeout(() => {
                    onReadCode(codes[0].value);
                    setIsCameraShown(false);
                }, 500);
            }
        },
    });

    if (!device) return null;



    const readQr = async (imageUri) => {
        try {
            const result = await RNQRGenerator.detect({
                uri: imageUri,
            });

            if (result?.values?.length > 0) {
                onReadCode(result.values[0]); // QR value
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    'No QR code found in image',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            }
        } catch (e) {
            console.log(e)
            ToastAndroid.showWithGravityAndOffset(
                'Failed to scan QR from image',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    }

    const [QrImage, setQrImage] = useState(null);
    const [torchOn, setTorchOn] = useState(false);

    const RequestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to your camera',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission granted');
                    return true;
                } else {
                    console.log('Camera permission denied');
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
    };

    useEffect(() => {
        RequestCameraPermission()
    }, [])


    const takePicFromGallery = async () => {
        // await requestStoragePermission();
        StatusBar.setHidden(true); // hide before opening
        ImageCropPicker.openPicker({
            // cropping: true,
            // freeStyleCropEnabled: true,
            // compressImageQuality: 0.8,
            // cropperToolbarTitle: 'Crop your image',
            // cropperStatusBarColor: '#000000',
            // cropperToolbarColor: '#000000',
            // cropperToolbarWidgetColor: '#ffffff',
        })
            .then((image) => {
                let extension = image.path.split('.').pop().toLowerCase();
                if (
                    [
                        "mp4",
                        "avi",
                        "mov",
                        "3gp",
                        "mpeg",
                        "mpg",
                        "m4v",
                        "pdf",
                    ].includes(extension)
                ) {
                    ToastAndroid.showWithGravityAndOffset(
                        'Invalid file format only images',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                } else {
                    // handleFile(field, {
                    //     uri: image.path,
                    //     type: image.mime,
                    //     name: image.path.split("/").pop(),
                    // });
                    setQrImage({
                        uri: image.path,
                        type: image.mime,
                        name: image.path.split("/").pop(),
                    })
                    readQr(image.path)
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                StatusBar.setHidden(false);
            });
    };


    function handleBackButtonClick() {
        navigation.navigate('GiftCard')
        return true;
    }

    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButtonClick());
        return () => {
            backhandler.remove();
        };
    }, []);

    const [visible, setVisible] = useState(true);

    const onRequestClose = () => {
        setVisible(false);
        navigation.navigate('Home');
    }
    return (
        <Modal visible={visible} presentationStyle="fullScreen" animationType="slide" onRequestClose={onRequestClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.topOverlay}>
                    <TouchableOpacity onPress={() => navigation.navigate('GiftCard')}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Scan QR to Redeem Gift Card</Text>

                    </View>
                </View>

                {/* <View style={styles.bottomOverlay}>
                    <View>
                        <TouchableOpacity onPress={() => takePicFromGallery()} style={{ height: hp(7), width: hp(7), backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="picture-o" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', marginTop: 4, alignSelf: 'center' }}>Upload QR</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => setTorchOn(!torchOn)} style={{ height: hp(7), width: hp(7), backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                            <Entypo name="light-up" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', marginTop: 4, alignSelf: 'center' }}>Torch</Text>
                    </View>
                </View> */}

                <View style={styles.centerOverlay}>
                    {/* <Image source={require('../../assets/qrBorder.png')} style={styles.qrIcon} /> */}
                    <View style={styles.bottomOverlay}>
                        <View>
                            <TouchableOpacity onPress={() => takePicFromGallery()} style={{ height: hp(7), width: hp(7), backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="picture-o" color="#fff" size={24} />
                            </TouchableOpacity>
                            <Text style={{ color: '#fff', marginTop: 4, alignSelf: 'center' }}>Upload QR</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setTorchOn(!torchOn)} style={{ height: hp(7), width: hp(7), backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                <Entypo name="light-up" color="#fff" size={24} />
                            </TouchableOpacity>
                            <Text style={{ color: '#fff', marginTop: 4, alignSelf: 'center' }}>Torch</Text>
                        </View>
                    </View>
                </View>

                <Camera
                    ref={camera}
                    device={device}
                    isActive
                    codeScanner={codeScanner}
                    onError={onError}
                    style={styles.fullScreenCamera}
                    torch={torchOn ? 'on' : 'off'}
                />
                <RNHoleView
                    holes={[
                        {
                            x: getWindowWidth() * 0.1,
                            y: getWindowHeight() * 0.28,
                            width: getWindowWidth() * 0.8,
                            height: getWindowHeight() * 0.4,
                            borderRadius: 12,
                        },
                    ]}
                    style={[styles.fullScreenCamera, styles.overlay]}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default CameraScanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    fullScreenCamera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },

    topOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 300,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 40,
        zIndex: 300,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: wp(40),
        justifyContent: 'space-between'
    },
    centerOverlay: {
        // position: 'absolute',
        // top: 220,
        // zIndex: 300,
        // height: hp(40),
        // width: hp(40),
        // alignSelf: 'center'
        position: 'absolute',
        zIndex: 300,
        height: hp(75),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(10),
        // backgroundColor: 'blue'

    },
    qrIcon: {
        height: hp(40),
        width: hp(40),
        resizeMode: 'contain'
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },

    subTitle: {
        color: '#ccc',
        fontSize: 13,
        marginTop: 4,
    },

    backIcon: {
        color: '#fff',
        fontSize: 24,
        marginRight: 12,
    },

    helpIcon: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 12,
    },
});
