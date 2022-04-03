import React, {Component} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 10;

interface NotificationProps {
  notifications: any[] | null;
}
class Notification extends Component<NotificationProps, {}> {
  constructor(props: NotificationProps) {
    super(props);
    console.log(this.props.notifications);
  }
  numItems =
    this.props.notifications !== null ? this.props.notifications.length : 0;
  itemWidth =
    ((FIXED_BAR_WIDTH / this.numItems) as number) -
    ((this.numItems as number) - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  render() {
    let notifications: any[] = [];
    // let main_notif = this.props.notifications;
    this.props.notifications &&
      this.props.notifications.forEach((noti: any, i) => {
        const notification = (
          <View key={i}>
            {i.toString()}
            <View style={styles.towText}>
              <Text style={styles.towTextText}>TOWING REQUEST</Text>
            </View>
            <View style={styles.mainBorder}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                  }}
                  style={styles.imageStyle}
                />
              </View>
              <View style={styles.desp}>
                <View style={styles.custName}>
                  <Text style={styles.custNameName}>
                    {/* main_notif[i].notificationid */}
                    {i.toString()}
                  </Text>
                </View>
                <View style={styles.towRequest}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      // onPress={this.handleSubmit}
                      style={styles.buttonStyle1}>
                      <Text style={styles.buttonTextStyle1}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      // onPress={this.handleSubmit}
                      style={styles.buttonStyle2}>
                      <Text style={styles.buttonTextStyle2}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
        notifications.push(notification);
      });

    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.animVal}}}],
            {useNativeDriver: false},
          )}>
          {notifications}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainBorder: {
    backgroundColor: '#f9d342',
    width: '100%',
    height: '20%',
    elevation: 7,
    borderRadius: 15,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  imageContainer: {
    marginLeft: 80,
    height: 85,
    width: 85,
    borderRadius: 40,
    marginRight: 25,
  },
  imageStyle: {
    height: 85,
    width: 85,
    borderRadius: 40,
  },
  custName: {
    marginBottom: 10,
  },
  custNameName: {
    fontSize: 20,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
    color: 'black',
  },
  desp: {
    justifyContent: 'space-between',
  },
  towText: {
    backgroundColor: '#f9d342',
    width: '50%',
    height: '7%',
    borderRadius: 15,
    borderBottomColor: 'black',
    borderWidth: 2,
    color: 'black',
    marginTop: -60,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 100,
  },
  towTextText: {
    fontSize: 20,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
    color: 'black',
  },
  towRequest: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonStyle1: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    fontSize: 10,
  },
  buttonStyle2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonTextStyle1: {
    color: 'white',
    fontFamily: 'Mertropolis',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonTextStyle2: {
    color: 'black',
    fontFamily: 'Mertropolis',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Notification;

{
  /* <Image
            key={`image${i}`}
            source={{uri: image}}
            style={{width: deviceWidth - 20, margin: 'auto', height: 200}}
          />
            <View
              style={{
                width: deviceWidth,
                height: 150,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'gold',
              }}
              key={i}>
              <Text style={{width: '100%'}}>
                This is a notification {i.toString()}
              </Text>
            </View>
          ); */
}

// const thisBar = (
//   <View
//     key={`bar${i}`}
//     style={[
//       styles.track,
//       {
//         width: this.itemWidth,
//         marginLeft: i === 0 ? 0 : BAR_SPACE,
//       },
//     ]}>
//     <Animated.View
//       style={[
//         styles.bar,
//         {
//           width: this.itemWidth,
//           transform: [{translateX: scrollBarVal}],
//         },
//       ]}
//     />
//   </View>
// );
// barArray.push(thisBar);

// container: {
//   flex: 1,
//   alignItems: 'center',
//   justifyContent: 'center',
// },
// track: {
//   backgroundColor: '#ccc',
//   overflow: 'hidden',
//   height: 2,
// },
// bar: {
//   backgroundColor: '#5294d6',
//   height: 2,
// },
