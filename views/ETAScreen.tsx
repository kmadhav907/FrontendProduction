import React from "react";
import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ContactModal from "../components/modals/ContactModal";
import HistoryModal from "../components/modals/historyModal";

import { preventBack } from "../global/utils";

interface ETAScreenState {
  showHistroyModal: boolean;
  showContactModal: boolean;
}
interface ETAScreenProps {
  navigation: any;
}
export default class ETAScreen extends React.Component<
  ETAScreenProps,
  ETAScreenState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showHistroyModal: false,
      showContactModal: false,
    };
  }
  async componentDidMount() {}

  render() {
    return (
      <>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.sectionContainer}>
            <View style={styles.etaContent}>
              <Text style={styles.etaText}>02 Hours</Text>
              <View style={styles.etaActions}>
                <Pressable onPress={() => {}} style={styles.etaButton}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "black",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Change
                  </Text>
                </Pressable>
                <Pressable onPress={() => {}} style={styles.etaButton}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "black",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Update
                  </Text>
                </Pressable>
              </View>
            </View>
            <Pressable
              style={styles.sendBillContent}
              onPress={() => {
                this.props.navigation.navigate("FeedbackScreen");
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "black",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Send Bill
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.bottomView}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showContactModal: !this.state.showContactModal,
              });
            }}
          >
            <Image
              source={require("../assets/2-01.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          {this.state.showContactModal && (
            <ContactModal
              isVisible={this.state.showContactModal}
              closeModal={() => {
                this.setState({ showContactModal: false });
              }}
            />
          )}
          {this.state.showHistroyModal && (
            <Modal
              animationType={"slide"}
              transparent={true}
              style={styles.modalView}
              visible={this.state.showHistroyModal}
              onRequestClose={() => {
                this.setState({ showHistroyModal: false });
              }}
            >
              <HistoryModal
                toggle={() => this.setState({ showHistroyModal: false })}
                navigation={this.props.navigation}
                currentNotifications={this.state.cuurentNotifications}
                histroyNotifications={this.state.histroyNotifications}
              />
            </Modal>
          )}
          <TouchableOpacity
            onPress={() => {
              this.setState({ showHistroyModal: true });
            }}
          >
            <Image
              source={require("../assets/3-01.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("UserProfileView");
            }}
          >
            <Image
              source={require("../assets/4-01.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9d342",
    width: "100%",
    height: "100%",
  },
  bottomView: {
    backgroundColor: "white",
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 7,
    elevation: 10,
  },
  iconStyle: {
    width: 40,
    height: 40,
  },
  modalView: {
    margin: 0,
    flex: 1,
    // justifyContent: "flex-end",
    alignItems: "center",
  },
  sectionContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    minHeight: "70%",
    marginTop: "30%",
    backgroundColor: "white",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 6,
  },
  etaContent: {
    marginTop: 25,
    marginLeft: "10%",
    height: "15%",
    width: "80%",
  },
  etaText: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    textAlign: "center",
  },
  etaActions: {
    width: "100%",
    height: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  etaButton: {
    width: "30%",
    height: "50%",
    backgroundColor: "#f9d342",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 1,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  sendBillContent: {
    marginTop: 30,
    height: 50,
    width: "60%",
    marginLeft: "20%",
    backgroundColor: "#f9d342",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 3,
  },
});
