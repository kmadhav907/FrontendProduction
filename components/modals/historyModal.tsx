import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

interface HistoryModalState {}

interface HistoryModalProps {
  currentNotifications: any[];
  histroyNotifications: any[];
  navigation: any;
  toggle: any;
}
class HistoryModal extends React.Component<
  HistoryModalProps,
  HistoryModalState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  renderItemHistroy = (itemData: any, index: number) => (
    <View style={styles.cardContainer} key={index}>
      {console.log(itemData)}
      <Text style={styles.cardText}>Service: {itemData?.serviceid}</Text>
      <Text style={styles.cardText}>Time: {itemData.service_datetime}</Text>
    </View>
  );
  renderItemCurrent = (itemData: any, index: number) => (
    <View style={styles.cardContainer} key={index}>
      {console.log(itemData)}
      <Text style={styles.cardText}>Service: {itemData?.serviceid}</Text>
      <Text style={styles.cardText}>Time: {itemData["DOSD&T"]}</Text>
    </View>
  );
  render() {
    return (
      //   <ScrollView
      //     style={styles.container}

      //   >
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={{ paddingBottom: `${Math.round(HEIGHT / 50)}%` }}
      >
        <View
          style={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <TouchableOpacity onPress={this.props.toggle}>
            <Image
              source={require("../../assets/error-white.png")}
              style={styles.drawerIconStyle}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Current:</Text>
        {this.props.currentNotifications.length !== 0 ? (
          <>
            {this.props.currentNotifications.map((item: any, index: number) =>
              this.renderItemCurrent(item, index)
            )}
          </>
        ) : (
          <View>
            <Text>No Data!!!</Text>
          </View>
        )}

        <Text style={styles.headerTitle}>History:</Text>
        {this.props.histroyNotifications.length !== 0 ? (
          <>
            {this.props.histroyNotifications.map((item: any, index: number) =>
              this.renderItemHistroy(item, index)
            )}
          </>
        ) : (
          <View>
            <Text style={{ color: "white" }}>No Data!!!</Text>
          </View>
        )}
      </ScrollView>
      //   </ScrollView>
    );
  }
}
const HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  drawerIconStyle: {
    width: 30,
    height: 30,
  },
  container: {
    backgroundColor: "black",
    flex: 1,
    height: HEIGHT,
    width: "100%",
  },
  innerContainer: {
    marginTop: "40%",
    height: "100%",
    width: "80%",
    marginLeft: "10%",
    borderRadius: 12,
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    padding: 6,
  },

  activityIndicator: {
    alignItems: "center",
    height: 80,
    margin: 15,
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
    paddingLeft: 4,
    alignContent: "center"
  },
  cardContainer: {
    height: 60,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 6,
    justifyContent: "center",
    padding: 5,
    borderWidth: 2,
  },
  cardText: {},
});

export default HistoryModal;
