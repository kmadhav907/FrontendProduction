import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  Dimensions,
  Touchable,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const DrawerModal = (props: any) => {
  return (
    <Modal
      isVisible={props.display}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      onBackButtonPress={props.toggle}
      style={styles.modalStyle}
      hideModalContentWhileAnimating
      useNativeDriver
      swipeDirection="left"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.profilePicSection}>
          <Text>Hello</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const WIDTH = Dimensions.get("window").width;
const styles = StyleSheet.create({
  modalStyle: {
    width: WIDTH * 0.75,
    backgroundColor: "#f9d342",
    color: "white",
    margin: 0,
    flex: 1,
  },
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  profilePicSection: {
    width: "100%",
    height: "15%",
    marginTop: "10%",
  },
});

export default DrawerModal;
