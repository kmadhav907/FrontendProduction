import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import Map from "../components/googleMap/Map";
import { preventBack, requestLocationPermission } from "../global/utils";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-community/async-storage";
import {
  getCurrentService,
  setReachedStatus,
} from "../apiServices/notificationServices";
import HistoryModal from "../components/modals/historyModal";
import ContactModal from "../components/modals/ContactModal";
import { CommonActions } from "@react-navigation/native";

interface MapRoutingState {
  latitude: number | undefined;
  longitude: number | undefined;
  currentService: any;
  showHistroyModal: boolean;
  curentNotifications: any;
  histroyNotifications: any;
  showContactModal: boolean;
  selectedRegion: any;
  loading: boolean;
}
interface MapRoutingProps {
  navigation: any;
}
const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;
class MapRoutingScreen extends React.Component<
  MapRoutingProps,
  MapRoutingState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showHistroyModal: false,
      showContactModal: false,
      latitude: undefined,
      longitude: undefined,
      currentService: {},
      curentNotifications: [],
      histroyNotifications: [],
      selectedRegion: {},
      loading: false,
    };
  }
  async componentDidMount() {
    try {
      this.setState({ loading: true });
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
        const userObject = await AsyncStorage.getItem("userObject");
        const fixitID = JSON.parse(userObject as string).fixitId;
        await getCurrentService(fixitID).then((response: any) => {
          console.log("In Current Serive in Map Routing Screen");
          if (response.data.length !== 0) {
            const service = response.data.pop();
            console.log(service);
            const userLocation = {
              latitude: Number(service["UserLocation"].latitude),
              longitude: Number(service["UserLocation"].longitude),
            };
            // console.log(userLocation);
            this.setState({
              currentService: service,
              selectedRegion: userLocation,
            });
            let dosId = { reached: "NotReached", dosId: service.DosId };
            console.log(dosId);
            AsyncStorage.setItem("dosId", JSON.stringify(dosId)).then(() => {
              console.log("data is stored");
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({ loading: false });
    // preventBack(this.props.navigation);
  }
  handleETA = async () => {
    const status = "Reached";
    await AsyncStorage.removeItem("dosId");
    const dosId = this.state.currentService["DosId"];
    console.log(dosId);
    setReachedStatus(dosId, status).then((response: any) => {
      console.log(response.data);
      if (response.data) {
        const dosObject = { status: status, dosId: dosId };
        AsyncStorage.setItem("dosId", JSON.stringify(dosObject)).then(() => {
          console.log("Data is stored");
        });
        this.props.navigation.navigate("ETAScreen");
      }
      // AsyncStorage.setItem("dosId", ).then(() => {
      //   console.log("data is stored");
      // });
    });
    // setReachedStatus(this.state.currentService)
  };
  render() {
    if (this.state.loading === true) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color="yellow"
          size="large"
          style={styles.activityIndicator}
        />
      );
    }
    return (
      <View style={styles.mapView}>
        <View style={styles.mapContainer}>
          <Map
            latitude={this.state.latitude as number}
            longitude={this.state.longitude as number}
            selectedRegion={{
              latitude: this.state.selectedRegion?.latitude,
              longitude: this.state.selectedRegion?.longitude,
            }}
            navigation={this.props.navigation}
          ></Map>
        </View>

        <TouchableOpacity
          style={styles.reachedButton}
          onPress={() => {
            this.handleETA();
            // this.props.navigation.navigate("ETAScreen");
          }}
        >
          <Text style={styles.fontText}>Reached</Text>
        </TouchableOpacity>
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
              // this.props.navigation.navigate("UserProfileView");
              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: "UserProfileView" }],
                })
              );
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
const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  mapContainer: {
    height: HEIGHT - 40,
    width: WIDTH,
  },
  bottomView: {
    backgroundColor: "white",
    width: WIDTH,
    height: 40,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 0,
    elevation: 100,
    marginTop: 5,
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
  reachedButton: {
    position: "absolute",
    bottom: HEIGHT / 8,
    right: WIDTH / 10,
    height: HEIGHT / 15,
    width: WIDTH / 3,
    backgroundColor: "#ebd705",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#d9d50f",
    borderWidth: 1,
    borderRadius: 10,
    elevation: 5,
  },
  fontText: {
    color: "black",
    fontSize: 20,
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
    margin: 15,
  },
});
export default MapRoutingScreen;
// {"latitude": 14.2004, "longitude": 74.7922, "positionid": "5575bf7f-a786-4fa3-b79e-af753c35c398"}
