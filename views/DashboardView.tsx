/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";

import {
  getNotification,
  getCurrentService,
  selectNotification,
  getHistroy,
} from "../apiServices/notificationServices";

import {
  getFixitStatus,
  saveLocation,
  toggleOffStatus,
  toggleOnStatus,
} from "../apiServices/dashboardApi";
import Map from "../components/googleMap/Map";
import ToggleSwitch from "toggle-switch-react-native";
import Geolocation from "react-native-geolocation-service";
import {
  errorMessage,
  preventBack,
  requestLocationPermission,
} from "../global/utils";
import Notification from "../components/notification/Notifications";
import HistoryModal from "../components/modals/historyModal";
import "./drawerModel";
import SignUpModal from "./drawerModel";
import ContactModal from "../components/modals/ContactModal";
import { CommonActions } from "@react-navigation/native";

interface DashboardViewState {
  showSignUpModal: boolean;
  showingString: string;
  username: string;
  latitude: number | undefined;
  longitude: number | undefined;
  isOn: boolean | false;
  dutyCall: string;
  loading: boolean;
  notifData: any;
  selectedRegion: { latitude: string; longitude: string } | undefined;
  cuurentNotifications: any[];
  currentLocations: any[];
  histroyNotifications: any[];
  showHistroyModal: boolean;
  showContactModal: boolean;
}
interface DashboardViewProps {
  navigation: any;
}
class DashboardView extends React.Component<
  DashboardViewProps,
  DashboardViewState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showSignUpModal: false,
      showingString: "",
      username: "",
      showHistroyModal: false,
      latitude: undefined,
      longitude: undefined,
      isOn: false,
      dutyCall: "OFF DUTY",
      loading: false,
      notifData: [],
      selectedRegion: undefined,
      cuurentNotifications: [],
      histroyNotifications: [],
      currentLocations: [],
      showContactModal: false,
    };
    console.log("Created");
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const userObject = await AsyncStorage.getItem("userObject");
    console.log("userobject" + userObject);
    if (userObject === null) {
      // this.props.navigation.navigate("LoginView");
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "LoginView" }],
        })
      );
    }
    const currentDosId = await AsyncStorage.getItem("dosId");
    if (currentDosId !== null) {
      const status = JSON.parse(currentDosId).status;
      if (status === "Reached") {
        this.props.navigation.navigate("ETAScreen");
      } else {
        this.props.navigation.navigate("RouteMap");
      }
    }
    const fixitID = JSON.parse(userObject as string).fixitId;
    const userName = JSON.parse(userObject as string).userName;
    //@TODO
    // await getCurrentService(fixitID).then((response: any) => {
    //   console.log("In current service via DashBoard");
    //   if (response.data && response.data.length !== 0) {
    //     this.props.navigation.navigate("RouteMap");
    //   }
    // });
    //preventBack(this.props.navigation);
    const newUserFlag = JSON.parse(userObject as string).newUser;
    console.log(userObject);
    if (newUserFlag) {
      // this.props.navigation.navigate("UserProfileView");
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "UserProfileView" }],
        })
      );
      // this.props.navigation.navigate('Notification');
      return;
      // this.props.navigation.navigate('DashboardView');
    }
    try {
      const permissionStatus = await requestLocationPermission();
      if (permissionStatus === true) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.setState({ latitude: latitude, longitude: longitude });
          },
          (error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        Geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.setState({ latitude: latitude, longitude: longitude });
          },
          (error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
          },
          {
            showLocationDialog: true,
            enableHighAccuracy: true,
          }
        );
      }
    } catch (err) {
      console.log(err);
    }

    await saveLocation(fixitID, this.state.latitude, this.state.longitude).then(
      (response: any) => {
        // console.log('Response from saveLoc : ' + response);
        if (response.status === 200) {
          // console.log('data is dash', response);
          this.setState({
            username: userName,
          });
          console.log("User name is : " + this.state.username);
          console.log("no Error in save loc");
        } else {
          errorMessage("Please check your connection");
        }
      }
    );

    // const UserName =
    console.log("fixitId in dash: " + fixitID);

    await getFixitStatus(fixitID)
      .then(async (response: any) => {
        const status = response.data;
        this.setState({
          isOn: status,
        });
        if (this.state.isOn === true) {
          await getNotification(
            fixitID,
            this.state.latitude,
            this.state.longitude
          )
            .then((res: any) => {
              console.log(
                "Notification data in dashboard : " + res.data[0].userLocation
              );
              this.setState({
                notifData: res.data.reverse(),
                dutyCall: "ON DUTY",
              });
              console.log("done" + res.data);
            })
            .catch((err) => {
              console.log("Error in get notif = " + err.message);
            });
        }
      })
      .catch((err) => console.log("in getLoc " + err));
    await this.getCurrNotificationsAndHistroy();
    this.setState({ loading: false });
    // this.props.navigation.navigate('LoginView');
  }

  handleToggle = async () => {
    console.log("In HandleToggle");
    const userObject = await AsyncStorage.getItem("userObject");
    const fixitID = JSON.parse(userObject as string).fixitId;
    this.setState({
      isOn: !this.state.isOn,
    });
    if (this.state.isOn === false) {
      toggleOffStatus(fixitID).then((response: any) => {
        // console.log(response);
        if (response.status === 200) {
          this.setState({ dutyCall: "OFF DUTY" });
        } else {
          this.setState({ isOn: true });
        }
      });
    }
    if (this.state.isOn === true) {
      toggleOnStatus(this.state.latitude, this.state.longitude, fixitID).then(
        async (response: any) => {
          if (response.status === 200) {
            // console.log(response);
            this.setState({ dutyCall: "ON DUTY" });
            await getNotification(
              fixitID,
              this.state.latitude,
              this.state.longitude
            )
              .then((res: any) => {
                console.log("data in dashboard : " + res.data[0]);
                this.setState({
                  notifData: res.data,
                  selectedRegion: undefined,
                });
                console.log("done");
              })
              .catch((err) => {
                console.log("Error in get notif = " + err.message);
              });
          }
        }
      );
    }
  };
  getCurrNotificationsAndHistroy = async () => {
    const userObject = await AsyncStorage.getItem("userObject");
    if (userObject === null) {
      // this.props.navigation.replace("LoginView");
      this.props.navigation.replace(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "LoginView" }],
        })
      );
    } else {
      const fixitId = JSON.parse(userObject as string).fixitId;
      getCurrentService(fixitId)
        .then((response: any) => {
          // console.log("In Current Service : ");
          // console.log(response.data);
          this.setState({ cuurentNotifications: response.data });
          // let locations:any =[];
          // currNotification.forEach((item:any, index:number)=> {
          //   let location = {latitude: item?.}
          //   locations.push()
          // })
          // getHistroy(fixitId)
          //   .then((response: any) => {
          //     console.log(response.data);
          //     this.setState({ histroyNotifications: response.data });
          //   })
          //   .catch((error) => {
          //     console.log(error.message);
          //     errorMessage("Something went wrong in Histroy");
          //   });
        })
        .catch((error) => errorMessage(error.message));
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loginContainer}>
          <ActivityIndicator
            animating={this.state.loading}
            color="blue"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      );
    }
    if (this.state.isOn === true) {
      return (
        <View style={styles.loginContainer1}>
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
                source={require("../assets/menu-white.png")}
                style={styles.drawerIconStyle}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.titleStyle1}>{this.state.dutyCall}</Text>
          <View style={styles.switchStyle}>
            <ToggleSwitch
              isOn={this.state.isOn}
              onColor="#f9d342"
              offColor="black"
              size="medium"
              onToggle={this.handleToggle}
            />
          </View>
          <View style={styles.dahsboardContainer1}>
            <View style={styles.mapContsiner}>
              <View style={styles.inputStyle}>
                <Text style={styles.innerText}>
                  {"   "}
                  {this.state.username} , {this.state.latitude} ,
                  {this.state.longitude}
                </Text>
              </View>

              <View style={styles.mapStyle1}>
                <Map
                  latitude={this.state.latitude as number}
                  longitude={this.state.longitude as number}
                  navigation={this.props.navigation}
                  selectedRegion={
                    this.state.selectedRegion && this.state.selectedRegion
                  }
                />
              </View>
            </View>
            <Notification
              notifications={this.state.notifData && this.state.notifData}
              setSelectedRegion={(notification: any) => {
                console.log(notification.userLocation);
                const userLocation = notification.userLocation;
                this.setState({
                  selectedRegion: {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  },
                });
                console.log(this.state.selectedRegion);
              }}
              navigation={this.props.navigation}
            />
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
        </View>
      );
    } else {
      return (
        <View style={styles.loginContainer}>
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

          <Text style={styles.titleStyle}>{this.state.dutyCall}</Text>
          <View style={styles.switchStyle}>
            <ToggleSwitch
              isOn={this.state.isOn}
              onColor="#f9d342"
              offColor="black"
              size="medium"
              onToggle={this.handleToggle}
            />
          </View>
          <View style={styles.dahsboardContainer}>
            <View>
              <Image
                style={styles.offlineContainer}
                source={require("../assets/man-15.png")}
              />
            </View>
            <View style={styles.oflfineText}>
              <Text style={styles.midText1}>YOU ARE OFFLINE</Text>
              <Text style={styles.midText2}>Please turn on above</Text>
              <Text style={styles.midText3}>toggle button to get request</Text>
            </View>
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
                onDismiss={() => {
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
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  drawerIconStyleTop: {
    width: 30,
    height: 30,
  },
  modalView: {
    margin: 0,
    flex: 1,
    // justifyContent: "flex-end",
    alignItems: "center",
  },
  innerText: {
    marginRight: 50,
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#f9d342",
  },
  loginContainer1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },

  drawerIconStyle: {
    width: 60,
    height: 60,
  },
  iconStyle: {
    width: 40,
    height: 40,
  },
  dahsboardContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    paddingLeft: 30,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    minHeight: "70%",
    marginTop: "10%",
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
  drawerStyle: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 30,
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

  titleStyle: {
    fontSize: 25,
    fontFamily: "Metropolis",
    fontWeight: "bold",
  },
  titleStyle1: {
    fontSize: 25,
    color: "white",
    fontFamily: "Metropolis",
    fontWeight: "bold",
  },
  switchStyle: {
    paddingLeft: 250,
  },
  offlineContainer: {
    width: 200,
    height: 200,
    // backgroundColor: 'orange',
    marginLeft: 55,
    marginTop: -15,
  },
  oflfineText: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 40,
  },
  midText1: {
    paddingTop: 10,
    fontSize: 20,
    fontFamily: "Metropolis",
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },

  midText2: {
    fontFamily: "Metropolis",
    fontWeight: "300",
    color: "black",
  },
  midText3: {
    fontFamily: "Metropolis",
    fontWeight: "300",
    color: "black",
  },
  dahsboardContainer1: {
    flex: 1,
    paddingTop: 50,
    flexDirection: "column",
    alignContent: "center",
    minHeight: "50%",
    marginTop: "10%",

    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    elevation: 6,
  },
  inputStyle: {
    backgroundColor: "#feffff",
    borderRadius: 12,
    width: "90%",
    padding: 5,
    elevation: 4,
  },
  mapStyle1: {
    // flexDirection: "column",
    // alignContent: "",
    minHeight: "50%",
    height: "100%",
    marginTop: -80,
    marginBottom: 50,
    width: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  mapContsiner: {
    minHeight: "50%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
    margin: 15,
  },
});

export default DashboardView;
