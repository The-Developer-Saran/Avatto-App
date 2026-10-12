import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { userViewmodal } from "../viewModal/userViewmodal";

const User = () => {
    const { User_Details } = userViewmodal();

    useEffect(() => {
        const handleget = async () => {
            console.log("JHAGDFHJA");            
            const response = await User_Details(); // Call the function and wait for its response
            console.log("response", response);
        };
        handleget(); // Execute the handler
    }, []);

    return (
        <View>
            <Text style={{ fontFamily: "DMSans-Italic"}}>User</Text>
        </View>
    );
};

export default User;

const styles = StyleSheet.create({});
