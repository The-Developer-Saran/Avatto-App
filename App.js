import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppNavigation from './src/components/navigation/AppNavigation';
import ProductList from './src/components/screens/MillionareClub/productList';
import GiftCardScreen from './src/components/screens/GiftCard/GiftCardScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <AppNavigation />
      {/* <GiftCardScreen/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
