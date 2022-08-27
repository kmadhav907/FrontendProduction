/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialDialog } from "react-native-material-dialog";
import { selectNotification } from "../../apiServices/notificationServices";
import AsyncStorage from "@react-native-community/async-storage";

export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

function NotificationItem(props: any) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<
    any | undefined
  >(undefined);
  // const setProblemDescription = (description: string): string => {
  //   if (description.length > 15) {
  //     return description.substring(0, 15) + "...";
  //   } else {
  //     return description;
  //   }
  // };

  return (
    <View key={props.index} style={{ width: width, height: height / 4 }}>
      <View style={styles.towText}>
        <Text style={styles.towTextText}>TOWING REQUEST</Text>
      </View>
      <View style={styles.mainBorder}>
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
              }}
              style={styles.imageStyle}
            />
          </View>

          <View style={styles.desp}>
            <View style={styles.custName}>
              <Text style={styles.custNameName}>
                {props.item

                  && props.item["userVehicleDetail:"]?.bikename || "Not Added"}
              </Text>
              <TouchableOpacity
                onPressIn={() => {
                  props.setSelectedRegion(props.item);
                  setSelectedNotification(props.item);
                  setShowDialog(true);
                  console.log("this is props.item" + props.item);
                }}
              >
                <Image
                  source={require("../../assets/information.png")}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.towRequest}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    const userObject = await AsyncStorage.getItem("userObject");
                    const fixitID = JSON.parse(userObject as string).fixitId;
                    const notificationId = props.item["notificationid:"];
                    props.navigation.navigate("RouteMap");
                    await selectNotification(notificationId, fixitID, "Accept")
                      .then((response) => {
                        console.log("Accepted");
                        console.log(response.data);
                        props.navigation.navigate("RouteMap");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  }}
                  style={styles.buttonStyle1}
                >
                  <Text style={styles.buttonTextStyle1}>Accept</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    const userObject = await AsyncStorage.getItem("userObject");
                    const fixitID = JSON.parse(userObject as string).fixitId;
                    const notificationId = props.item["notificationid:"];
                    await selectNotification(notificationId, fixitID, "Decline")
                      .then((response) => {
                        console.log("Declined");
                        console.log(response);
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  }}
                  style={styles.buttonStyle2}
                >
                  <Text style={styles.buttonTextStyle2}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      {showDialog && (
        <MaterialDialog
          title={"Notification Information"}
          visible={showDialog}
          onOk={() => setShowDialog(false)}
          onCancel={() => setShowDialog(false)}
          colorAccent="#000"
        >
          <View>

            <Text style={styles.textStyle}>
              1.Vehicle: {selectedNotification["userVehicleDetail:"]?.bikename}
            </Text>
            <Text style={styles.textStyle}>
              2.Status: {selectedNotification["userTravelStatus:"] === "TravelToMechanic" ? "Travel to Mechanic" : "Need Mechanic to come"}
            </Text>
            <Text style={styles.textStyle}>
              3.Problem Description: {selectedNotification["userVehicleProblems:"]?.problemname}
            </Text>
            <Text style={styles.textStyle}>
              4.Latitude: {selectedNotification["userLocation"]?.latitude}
            </Text>
            <Text style={styles.textStyle}>
              5.Longitude: {selectedNotification["userLocation"]?.longitude}
            </Text>
            <Text style={styles.textStyle}>
              6.Description: {selectedNotification.problemDescription}
            </Text>
          </View>
        </MaterialDialog>
      )}
    </View>
  );
}
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  iconStyle: {
    width: 20,
    height: 20,
    marginLeft: -85,
    marginTop: -7,
  },
  mainContainer: {
    backgroundColor: "#f9d342",
    height: "100%",
    width: "100%",
    alignItems: "center",
    elevation: 7,
    borderRadius: 15,
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
  },
  mainBorder: {
    width: ITEM_WIDTH,
    height: "50%",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    // marginTop: -10,
  },
  imageContainer: {
    marginLeft: 80,
    height: 80,
    width: 85,
    borderRadius: 40,
    marginRight: 25,
  },
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  custName: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  custNameName: {
    fontSize: height / 45,
    fontFamily: "Metropolis",
    fontWeight: "bold",
    color: "black",
  },
  desp: {
    justifyContent: "space-between",
  },
  towText: {
    backgroundColor: "#f9d342",
    width: "70%",
    height: "17%",
    borderRadius: 15,
    borderBottomColor: "black",
    borderWidth: 2,
    color: "black",
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 60,
  },
  towTextText: {
    fontSize: height / 70,
    fontFamily: "Metropolis",
    fontWeight: "bold",
    color: "black",
  },
  towRequest: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: width / 5,
    height: height / 24,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonStyle1: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 3,
  },
  buttonStyle2: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonTextStyle1: {
    color: "white",
    fontFamily: "Mertropolis",
    fontWeight: "bold",
    fontSize: height / 60,
  },
  buttonTextStyle2: {
    color: "black",
    fontFamily: "Mertropolis",
    fontWeight: "bold",
    fontSize: 15,
  },
  textStyle: {
    fontSize: 15,
    color: "black",
  },
});
export default NotificationItem;
