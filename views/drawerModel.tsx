import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Linking,
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
      onBackdropPress={props.toggle}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.upBox}>
          <View style={styles.upTopInnerText}>
            <Text style={styles.upTopText}>Mr Fixit</Text>
            <Text style={styles.upTopText1}>Version 0.1</Text>
          </View>
        </View>
        <View style={styles.profilePicSection}>
          <View style={styles.drawerTabContainer}>
            <View style={styles.tabOutBoxStyle}>
              <TouchableWithoutFeedback onPress={() => console.log("touched")}>
                <Text style={styles.drawerTabStyle}>
                  <Image
                    source={require("../assets/5-01.png")}
                    style={styles.tabTileStyle}
                  />
                  <Text>{"   "}</Text>
                  Notices
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.tabOutBoxStyle}>
              <TouchableWithoutFeedback onPress={() => console.log("touched")}>
                <Text style={styles.drawerTabStyle}>
                  <Image
                    source={require("../assets/6-01.png")}
                    style={styles.tabTileStyle}
                  />
                  <Text>{"   "}</Text>
                  Feedback
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.tabOutBoxStyle}>
              <TouchableWithoutFeedback
                onPress={() => {
                  Linking.openURL("https://askmechanic.herokuapp.com/about");
                }}
              >
                <Text style={styles.drawerTabStyle}>
                  <Image
                    source={require("../assets/7-01.png")}
                    style={styles.tabTileStyle}
                  />
                  <Text>{"   "}</Text>
                  About Us
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingTop: "110%",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              textDecorationLine: "underline",
              paddingTop: 5,
            }}
            onPress={() => {
              Linking.openURL(
                "https://askmechanic.herokuapp.com/PrivacyPolicy"
              );
            }}
          >
            Privacy policy
          </Text>
          <Text
            style={{
              color: "white",
              textDecorationLine: "underline",
              paddingTop: 5,
            }}
            onPress={() => {
              Linking.openURL(
                "https://askmechanic.herokuapp.com/TermsAndConditions"
              );
            }}
          >
            Terms & Conditions
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const WIDTH = Dimensions.get("window").width;
const styles = StyleSheet.create({
  upBox: {
    width: "100%",
    // backgroundColor: "#f9d342",
    backgroundColor: "white",
    height: "25%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  upTopText: {
    fontSize: 30,
    fontWeight: "normal",
    color: "black",
  },
  upTopText1: {
    fontSize: 15,
    fontWeight: "normal",
    color: "black",
  },

  tabTileStyle: {
    width: 50,
    height: 50,
  },
  upTopInnerText: {
    paddingTop: "30%",
    marginLeft: "10%",
  },
  drawerIconStyle: {
    width: 20,
    height: 20,
  },
  tabOutBoxStyle: {
    width: "100%",
    paddingLeft: "10%",
  },
  modalStyle: {
    width: WIDTH * 0.75,
    // backgroundColor: "#f9d342",
    backgroundColor: "black",
    color: "white",
    margin: 0,
    flex: 1,
    borderTopRightRadius: 15,
    // borderBottomRightRadius: 15,
  },
  cancelStyle: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  container: {
    height: "100%",
    width: "100%",
  },
  drawerTabStyle: {
    fontSize: 20,
    color: "white",
    paddingBottom: 20,
    width: "100%",
    position: "relative",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  drawerTabContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicSection: {
    width: "100%",
    height: "15%",
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainerStyle: {
    alignItems: "flex-end",
  },
});

export default DrawerModal;
