import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "@react-native-vector-icons/ant-design";
import Feather from "@react-native-vector-icons/feather";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../Home/HomeScreen";
import QrScreen from "../QrScreen/QrScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import WalletScreen from "../Wallet/walletScreen";

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = "#B12A33";
const INACTIVE_COLOR = "#929AAF";

const TAB_CONFIG = {
  Home: {
    label: "Home",
    renderIcon: (color) => <AntDesign name="home" size={hp(3.15)} color={color} />,
  },
  Topup: {
    label: "Top Up",
    renderIcon: (color) => <MaterialIcons name="account-balance-wallet" size={hp(3.15)} color={color} />,
  },
  Wallet: {
    label: "Wallet",
    renderIcon: (color) => <Feather name="credit-card" size={hp(3)} color={color} />,
  },
  Profile: {
    label: "Profile",
    renderIcon: (color) => <Feather name="user" size={hp(3.1)} color={color} />,
  },
};

const CustomTabBar = ({ state, descriptors, navigation, isKeyboardVisible }) => {
  const insets = useSafeAreaInsets();

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, hp(0.55)) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tabConfig = TAB_CONFIG[route.name];
        const tintColor = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[styles.activeIndicator, isFocused && styles.activeIndicatorVisible]} />
            <View style={styles.iconContainer}>{tabConfig.renderIcon(tintColor)}</View>
            <Text style={[styles.tabLabel, { color: tintColor }]}>{tabConfig.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const Footer = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const renderTabBar = useCallback(
    (props) => <CustomTabBar {...props} isKeyboardVisible={isKeyboardVisible} />,
    [isKeyboardVisible]
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={renderTabBar}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Topup" component={QrScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 2,
    paddingHorizontal: wp(2.6),
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: hp(4.8),
    borderTopRightRadius: hp(4.8),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 18,
    
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: hp(8),
  },
  activeIndicator: {
    width: "82%",
    height: hp(0.38),
    borderRadius: hp(1),
    backgroundColor: "transparent",
    marginBottom: hp(1.1),
  },
  activeIndicatorVisible: {
    backgroundColor: ACTIVE_COLOR,
  },
  iconContainer: {
    minHeight: hp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    marginTop: hp(0.35),
    marginBottom: hp(0),
    fontSize: hp(2),
    fontWeight: "500",
  },
});

export default Footer;
