import React from "react";
import {
  Dimensions,
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
import { getCurrentService } from "../apiServices/notificationServices";

interface MapRoutingState {
  latitude: number | undefined;
  longitude: number | undefined;
}
interface MapRoutingProps {
  navigation: any;
}
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").height;
class MapRoutingScreen extends React.Component<
  MapRoutingProps,
  MapRoutingState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      latitude: undefined,
      longitude: undefined,
    };
  }
  async componentDidMount() {
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
        const userObject = await AsyncStorage.getItem("userObject");
        const fixitID = JSON.parse(userObject as string).fixitId;
        await getCurrentService(fixitID).then((response: any) => {
          console.log("In Current Serive");
          console.log(response.data);
        });
      }
    } catch (err) {
      console.log(err);
    }
    preventBack(this.props.navigation);
  }
  render() {
    return (
      <View style={styles.mapView}>
        <Map
          latitude={this.state.latitude as number}
          longitude={this.state.longitude as number}
          selectedRegion={{ latitude: 14.2004, longitude: 74.7922 }}
          navigation={this.props.navigation}
        ></Map>

        <TouchableOpacity
          style={styles.reachedButton}
          onPress={() => {
            this.props.navigation.navigate("ETAScreen");
          }}
        >
          <Text style={styles.fontText}>Reached</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mapView: {
    height: HEIGHT,
    width: WIDTH,
  },
  reachedButton: {
    position: "absolute",
    bottom: HEIGHT / 100,
    left: WIDTH / 6,
    height: HEIGHT / 10,
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
});
export default MapRoutingScreen;
// {"latitude": 14.2004, "longitude": 74.7922, "positionid": "5575bf7f-a786-4fa3-b79e-af753c35c398"}
