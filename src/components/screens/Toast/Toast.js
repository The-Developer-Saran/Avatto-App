import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
Toast.show({
    type: "success",
    text1: "Success",
    text2: "Customizable toast message",
    position: "top", // Options: 'top', 'bottom', 'center'
    duration: 3000, // Duration in milliseconds
  });
  
const Toast = () => {
  return (
<></>
  )
}

export default Toast

const styles = StyleSheet.create({})