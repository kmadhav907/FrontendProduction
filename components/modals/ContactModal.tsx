import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

interface ContactModalProps {
  isVisible: boolean;
  closeModal: any;
}

class ContactModal extends React.Component<ContactModalProps, {}> {
  render() {
    return (
      <Modal
        hideModalContentWhileAnimating
        useNativeDriver
        swipeDirection="left"
        isVisible={this.props.isVisible}
        onBackButtonPress={this.props.closeModal}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        onBackdropPress={this.props.closeModal}
        style={styles.modalStyle}
      >
        <TouchableOpacity
          onPress={this.props.closeModal}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={1}
            style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}
          >
            <SafeAreaView
              style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}
            >
              <View style={styles.modalContaniner1}>
                <View style={styles.modalContent}>
                  <Image
                    source={require("../../assets/8-01.png")}
                    style={{ height: "85%", width: "85%" }}
                  ></Image>
                  <Text style={styles.modalText}>Chat with developers</Text>
                </View>
                <View style={styles.modalContent}>
                  <Image
                    source={require("../../assets/9-01.png")}
                    style={{ height: "85%", width: "85%" }}
                  ></Image>
                  <Text style={styles.modalText}>Suggestions</Text>
                </View>
              </View>
              <View style={styles.modalContaniner1}>
                <View style={styles.modalContent}>
                  <Image
                    source={require("../../assets/10-01.png")}
                    style={{ height: "85%", width: "85%" }}
                  ></Image>
                  <Text style={styles.modalText}>Help & Support</Text>
                </View>
                <View style={styles.modalContent}>
                  <Image
                    source={require("../../assets/11-01.png")}
                    style={{ height: "85%", width: "85%" }}
                  ></Image>
                  <Text style={styles.modalText}>Call developers</Text>
                </View>
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }
}
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  modalStyle: {
    margin: 5,
  },
  modalContainer: {
    position: "absolute",
    bottom: HEIGHT / 15,
    height: HEIGHT / 3,
    width: WIDTH / 1.4,
    backgroundColor: "black",
    borderRadius: 18,
    justifyContent: "space-between",
  },
  modalContaniner1: {
    height: "45%",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalContent: {
    justifyContent: "space-between",
    width: "45%",
    paddingLeft: "2.5%",
    paddingBottom: "2.5%",
    height: "100%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 12,
    color: "white",
  },
});
export default ContactModal;
