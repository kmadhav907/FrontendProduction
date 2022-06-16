/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import NotificationItem from "./NotificationItem";

// const FIXED_BAR_WIDTH = 280;
// const BAR_SPACE = 10;

interface NotificationProps {
  notifications: any[] | null;
  // eslint-disable-next-line prettier/prettier
  navigation: any;
  setSelectedRegion: any;
}
class Notification extends Component<NotificationProps, {}> {
  constructor(props: NotificationProps) {
    super(props);
    // console.log(
    //   'notif in construct : ' + JSON.stringify(this.props.notifications),
    // );
  }

  animVal = new Animated.Value(0);

  render() {
    let notifications: any[] = [];
    this.props.notifications &&
      this.props.notifications.forEach((noti: any, i) => {
        notifications.push(
          <NotificationItem
            item={noti}
            index={i}
            key={i}
            setSelectedRegion={this.props.setSelectedRegion}
            navigation={this.props.navigation}
          />
        );
      });

    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.animVal } } }],
            { useNativeDriver: false }
          )}
        >
          {notifications}
        </ScrollView>
      </View>
    );
  }
}
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    marginTop: -180,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height / 5,
  },
  track: {
    backgroundColor: "#ccc",
    overflow: "hidden",
    height: 2,
  },
  bar: {
    backgroundColor: "#5294d6",
    height: 2,
  },
});

export default Notification;

// numItems =
//   this.props.notifications !== null ? this.props.notifications.length : 0;
// itemWidth =
//   ((FIXED_BAR_WIDTH / this.numItems) as number) -
//   ((this.numItems as number) - 1) * BAR_SPACE;

//     //     const notification = (
//     //       <View
//     //         style={{
//     //           width: deviceWidth,
//     //           height: 150,
//     //           flex: 1,
//     //           justifyContent: 'center',
//     //           alignItems: 'center',
//     //           backgroundColor: 'gold',
//     //         }}
//     //         key={i}>
//     //         <Text style={{width: '100%'}}>Hello :</Text>
//     //       </View>
//     //     );
//     // const notification =
