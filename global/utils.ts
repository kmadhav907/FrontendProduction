import {
  Alert,
  BackHandler,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Polyline from "@mapbox/polyline";
export const requestLocationPermission = async () => {
  const granted = PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Require Location Access",
      message: "Need Permission for location Access",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }
  );
  console.log("granted---------", granted);
  if ((await granted) === PermissionsAndroid.RESULTS.GRANTED) {
    console.log("You can use the device location");
    return true;
  } else {
    console.log("device location permission denied");
    return false;
  }
};
export const modifyPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.startsWith("+91")) {
    phoneNumber = phoneNumber.slice(3);
    console.log(phoneNumber);
  }
  return phoneNumber;
};
export const checkValidPhoneNumber = (phoneNumber: string) => {
  const regex = new RegExp(
    "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
  );
  return regex.test(phoneNumber);
};
export const errorMessage = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
};
export const preventBack = (navigation: any) => {
  navigation.addListener("beforeRemove", (e: any) => {
    // Prevent default behavior of leaving the screen
    e.preventDefault();

    // Prompt the user before leaving the screen
    Alert.alert("Exit?", "You want to exit?", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Yes",
        style: "destructive",
        // If the user confirmed, then we dispatch the action we blocked earlier
        // This will continue the action that had triggered the removal of the screen
        onPress: () => BackHandler.exitApp(),
      },
    ]);
  });
};
export const getDirections = async (
  startLocation: String,
  destinationLocation: String
) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${destinationLocation}&key=AIzaSyBg3XiSveScZgdezEGQBPvyQ_m2EWrBTUQ`
    );
    let respJson = await resp.json();
    console.log(respJson);
    let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point: any, index: number) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    return coords;
  } catch (error) {
    return error;
  }
};
