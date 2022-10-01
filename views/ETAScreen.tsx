import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingViewBase,
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
import { errorMessage, preventBack } from "../global/utils";
import { getAccessories, saveDayOfServiceBilling } from "../apiServices/dashboardApi";
import { CommonActions } from "@react-navigation/native";
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AccesoriesModal from 'react-native-modal/dist/modal';
interface ETAScreenState {
  showHistroyModal: boolean;
  curentNotifications: any;
  showContactModal: boolean;
  histroyNotifications: any;
  etaTimings: string;
  showSignUpModal: boolean;
  detailsBox1: string;
  detailsBox2: string;
  detailsBox3: string;
  priceBox1: number;
  priceBox2: number;
  priceBox3: number;
  totalSum: number;
  labourChargeBox: number;
  accessories: any;
  showAccessoriesModal: boolean;
  selectedAccessories: any;
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
      showAccessoriesModal: false,
      curentNotifications: [],
      histroyNotifications: [],
      accessories: [],
      selectedAccessories: [],
      etaTimings: "",
      detailsBox1: "",
      detailsBox2: "",
      detailsBox3: "",
      priceBox1: 0,
      priceBox2: 0,
      priceBox3: 0,
      labourChargeBox: 0,
      totalSum: 0,
    };
  }

  async componentDidMount() {
    const documentId = await AsyncStorage.getItem("dosId");
    const dosId: string = JSON.parse(documentId!).dosId;
    getAccessories().then((response: any) => {
      this.setState({
        accessories: response.data
      })
      console.log("get accessories new", this.state.accessories);
    });
    getETATimings(dosId).then((response: any) => {
      console.log(response.data);
    });
  }
  componentDidUpdate(prevpros: ETAScreenProps, prevState: ETAScreenState) {
    if (
      this.state.priceBox1 !== prevState.priceBox1 ||
      this.state.priceBox2 !== prevState.priceBox2 ||
      this.state.priceBox3 !== prevState.priceBox3 ||
      this.state.labourChargeBox !== prevState.labourChargeBox
    ) {
      this.calculateTotal();
    }
  }
  submitTheBill = async () => {
    if (
      !(
        this.state.priceBox1 &&
        this.state.priceBox2 &&
        this.state.priceBox3 &&
        this.state.labourChargeBox &&
        this.state.detailsBox1 &&
        this.state.detailsBox2 &&
        this.state.detailsBox3
      )
    ) {
      errorMessage("Please fill Everything");
      return;
    } else {
      const dosId = await AsyncStorage.getItem("dosId");
      const docId = JSON.parse(dosId!).dosId;
      // saveDayOfServiceBilling(
      //   docId,
      //   this.state.detailsBox1,
      //   this.state.detailsBox2,
      //   this.state.detailsBox3,
      //   this.state.priceBox1,
      //   this.state.priceBox2,
      //   this.state.priceBox3,
      //   this.state.totalSum
      // ).then((response: any) => {
      //   console.log(response);
      //   if (response.status === 200) {

      // }
      // });
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "FeedbackScreen" }],
        })
      );
    }
  };

  onSelectedItemsChange = (selectedItems: boolean, item: string) => {
    let newSelectedProblems = this.state.accessories;
    if (selectedItems === true) {
      newSelectedProblems = newSelectedProblems.concat(item);
      this.setState({ selectedAccessories: newSelectedProblems }, () =>
        console.log("if" , this.state.selectedAccessories),
      );
    } else {
      newSelectedProblems.splice(newSelectedProblems.indexOf(item), 1);
      this.setState({ selectedAccessories: newSelectedProblems }, () =>
        console.log("else" , this.state.selectedAccessories),
      );
    }
  };
  calculateTotal = () => {
    const sum =
      this.state.priceBox1 +
      this.state.priceBox2 +
      this.state.priceBox3 +
      this.state.labourChargeBox;
    this.setState({
      totalSum: sum + (sum * 5) / 100,
    });
    // return sum + (sum * 5) / 100;
  };
  render() {
    return (
      <>
        <View style={styles.container}>
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

          <ScrollView style={styles.sectionContainer}>
            <View style={styles.etaContent}>
              <Text style={styles.etaText}>02 Hours</Text>
              <View style={styles.etaActions}>
                <Pressable onPress={() => { }} style={styles.etaButton}>
                  <Text style={styles.buttonTextstyle}>Change</Text>
                </Pressable>
                <Pressable onPress={() => { }} style={styles.etaButton}>
                  <Text style={styles.buttonTextstyle}>Update</Text>
                </Pressable>
              </View>
            </View>
            <View style={{ height: height / 50, width: width }}></View>
            <View>
              <View style={styles.billingBox}>
                <Text style={styles.billingTextStyle}>BILLING</Text>
              </View>
            </View>

            <View style={styles.centyerStyle}>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput
                    style={styles.billingInputStyle}
                    value="1"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Add your details"
                    onChangeText={(text: string) => {
                      this.setState({ detailsBox1: text });
                    }}
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Enter the price"
                    keyboardType="numeric"
                    onChangeText={(text: string) => {
                      this.setState({
                        priceBox1: Number(text.replace(/[^0-9]/g, "")),
                      });
                    }}
                  />
                </View>
              </View>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput
                    style={styles.billingInputStyle}
                    value="2"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Add your details"
                    onChangeText={(text: string) => {
                      this.setState({ detailsBox2: text });
                    }}
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Enter the price"
                    keyboardType="numeric"
                    onChangeText={(text: string) => {
                      this.setState({
                        priceBox2: Number(text.replace(/[^0-9]/g, "")),
                      });
                    }}
                  />
                </View>
              </View>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput
                    style={styles.billingInputStyle}
                    value="3"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Add your details"
                    onChangeText={(text: string) => {
                      this.setState({ detailsBox3: text });
                    }}
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Enter the price"
                    keyboardType="numeric"
                    onChangeText={(text: string) => {
                      this.setState({
                        priceBox3: Number(text.replace(/[^0-9]/g, "")),
                      });
                    }}
                  />
                </View>
              </View>
              <View style={styles.inputPlaceStyle}>
                <View style={styles.input0}>
                  <TextInput
                    style={styles.billingInputStyle}
                    value="4"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={styles.input1}>
                  <TextInput
                    style={styles.billingInputStyle}
                    // placeholder="Add your details"
                    value={"Labour Charges"}
                    editable={false}
                    selectTextOnFocus={false}
                  />
                  <Text
                    style={{
                      fontSize: height / 85,
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Platform Charges 5%
                  </Text>
                </View>
                <View style={styles.input2}>
                  <TextInput
                    style={styles.billingInputStyle}
                    placeholder="Enter the price"
                    keyboardType="numeric"
                    // onChangeText={this._handleChange}
                    onChangeText={(text: string) => {
                      this.setState({
                        labourChargeBox: Number(text.replace(/[^0-9]/g, "")),
                      });
                    }}
                  />
                </View>
              </View>
              <AccesoriesModal isVisible={this.state.showAccessoriesModal}>
                <View style={{ backgroundColor: '#353535'}}>
                  <Text style={{color: 'white' , alignItems: 'center' , textAlign: 'center', marginTop: 5, justifyContent: 'center', fontSize: 20,}}>Please Select Accessories</Text>
                  <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      justifyContent: 'center',
                      paddingBottom: 10,
                    }}
                    style={{
                      width: width,
                      flexDirection: 'column',
                      marginTop: 20,
                    }}>
                    {this.state.accessories!.map(
                      (item: any, index: number) => {
                        return (
                          <BouncyCheckbox
                            key={index}
                            style={{
                              marginTop: 10,
                              backgroundColor: '#353535',
                              padding: 5,
                              borderRadius: 4,
                              width: width * 0.9,
                              alignItems: 'center',
                              paddingLeft: 10,
                            }}
                            isChecked={
                              false
                            }
                            text={item.accessoriesname}
                            fillColor="#D35C13"
                            textStyle={{
                              textDecorationLine: 'none',
                              color: '#fff',
                            }}
                            onPress={(selected: boolean) => 
                                this.onSelectedItemsChange(selected, item.accessoriesname)
                            }
                          />
                        );
                      },
                    )}
                  </ScrollView>
                </View>
              </AccesoriesModal>
              <View style={styles.inputTotalstyle}>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  {"Total:  Rs:" + this.state.totalSum}
                </Text>
                <TouchableOpacity
                  style={styles.plusIconContainer}
                  onPress={() => {
                    this.setState({
                      showAccessoriesModal: true,
                    })
                    console.log(this.state.showAccessoriesModal)
                  }}
                >
                  <Text style={styles.plusIcon}>+</Text>
                </TouchableOpacity>
              </View>
              <Pressable
                style={styles.sendBillContent}
                onPress={this.submitTheBill}
              >
                <Text style={styles.buttonTextstyle}>Send Bill</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>

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
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
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
    width: width - 40,
    marginTop: height / 15,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 15,
    height: height / 18,
  },
  plusIconContainer: {
    backgroundColor: '#f9d342',
    width: 30,
    position: 'absolute',
    right: 0,
    marginRight: 10,
    height: height / 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  plusIcon: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  inputTotalInputTextStyle: {
    color: "black",
    fontSize: 20,
    width: "100%",
    backgroundColor: "#BCBCBC",
  },
  input0: {
    width: "10%",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BCBCBC",
    marginRight: 10,
    height: height / 20,
  },
  billingInputStyle: {
    fontSize: height / 70,
    fontWeight: "bold",
    color: "black",
  },
  input1: {
    width: "40%",
    marginTop: 20,
    backgroundColor: "#BCBCBC",
    marginRight: 10,
    height: height / 20,
  },
  input2: {
    width: "30%",
    marginTop: 20,
    backgroundColor: "#BCBCBC",
    height: height / 20,
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
    justifyContent: "flex-start",
    position: "absolute",
    top: 10,
    left: 10,
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
    minHeight: height - height * 0.15,
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
    paddingBottom: 50,
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
    width: width / 3,
    height: height / 18,
    backgroundColor: "#f9d342",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 1,
    margin: 5,
    marginTop: 20,
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
