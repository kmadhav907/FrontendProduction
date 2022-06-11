import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getETATimings } from "../apiServices/notificationServices";
import ContactModal from "../components/modals/ContactModal";
import HistoryModal from "../components/modals/historyModal";
import SignUpModal from "./drawerModel";
import { preventBack } from "../global/utils";

interface ETAScreenState {
  showHistroyModal: boolean;
  curentNotifications: any;
  showContactModal: boolean;
  histroyNotifications: any;
  etaTimings: string;
  showSignUpModal: boolean;
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
      showSignUpModal: false,
      showHistroyModal: false,
      showContactModal: false,
      curentNotifications: [],
      histroyNotifications: [],
      etaTimings: "",
    };
  }
  async componentDidMount() {
    const documentId = await AsyncStorage.getItem("dosId");
    console.log("DOCID in ETA" + documentId);
    // const dosId = documentId!.toString();
    // getETATimings(dosId).then((response: any) => {
    //   console.log(response);
    // });
  }

  render() {
    return (
      <>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.drawerStyle}>
            <SignUpModal
              display={this.state.showSignUpModal}
              toggle={() => {
                this.setState({ showSignUpModal: false });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ showSignUpModal: true });
              }}
            >
              <Image
                source={require("../assets/menu-black.png")}
                style={styles.drawerIconStyle}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.etaContent}>
              <Text style={styles.etaText}>02 Hours</Text>
              <View style={styles.etaActions}>
                <Pressable onPress={() => {}} style={styles.etaButton}>
                  <Text style={styles.buttonTextstyle}>Change</Text>
                </Pressable>
                <Pressable onPress={() => {}} style={styles.etaButton}>
                  <Text style={styles.buttonTextstyle}>Update</Text>
                </Pressable>
              </View>
            </View>
            <View>
              <View style={styles.billingBox}>
                <Text style={styles.billingTextStyle}>BILLING</Text>
              </View>
            </View>

            <View style={styles.centyerStyle}>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput style={styles.billingInputStyle} placeholder="1" />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="smthg"
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="20000"
                  />
                </View>
              </View>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput style={styles.billingInputStyle} placeholder="2" />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="smthgagain"
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="43645"
                  />
                </View>
              </View>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput style={styles.billingInputStyle} placeholder="3" />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="smthgagain2"
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="200"
                  />
                </View>
              </View>

              <View style={styles.inputTotalstyle}>
                <View>
                  <Text style={styles.billingInputStyle}>TOTAL</Text>
                </View>
                <View>
                  <TextInput
                    style={styles.inputTotalInputTextStyle}
                    placeholder="200"
                  />
                </View>
              </View>
            </View>

            <Pressable
              style={styles.sendBillContent}
              onPress={() => {
                this.props.navigation.navigate("FeedbackScreen");
              }}
            >
              <Text style={styles.buttonTextstyle}>Send Bill</Text>
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
                currentNotifications={this.state.curentNotifications}
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
  inputPlaceStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
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
  inputTotalstyle: {
    width: "85%",
    marginTop: 20,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 15,
  },
  inputTotalTextStyle: {
    color: "white",
    fontSize: 20,
  },
  inputTotalInputTextStyle: {
    color: "white",
    fontSize: 20,
    width: "100%",
    backgroundColor: "lightgrey",
  },
  input0: {
    width: "10%",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    backgroundColor: "lightgrey",
    marginRight: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  billingInputStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  input1: {
    width: "40%",
    marginTop: 20,
    backgroundColor: "lightgrey",
    marginRight: 10,
  },
  input2: {
    width: "30%",
    marginTop: 20,
    backgroundColor: "lightgrey",
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
  drawerIconStyle: {
    width: 60,
    height: 60,
  },
  drawerStyle: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 10,
  },

  buttonTextstyle: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  centyerStyle: {
    alignItems: "center",
  },
  billingBox: {
    width: "100%",
    backgroundColor: "#f9d342",
    padding: 10,
    marginTop: 20,
  },
  billingTextStyle: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },

  sectionContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    minHeight: "70%",
    marginTop: "25%",
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
    height: 40,
    width: "40%",
    marginLeft: "30%",
    backgroundColor: "#f9d342",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 3,
  },
});
