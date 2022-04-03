import React, {Component} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import NotificationItem from './notification_item';

const deviceWidth = Dimensions.get('window').width;
const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 10;

interface NotificationProps {
  notifications: any[] | null;
}
class Notification extends Component<NotificationProps, {}> {
  constructor(props: NotificationProps) {
    super(props);
    console.log('notif in construct : ' + this.props.notifications);
  }
  numItems =
    this.props.notifications !== null ? this.props.notifications.length : 0;
  itemWidth =
    ((FIXED_BAR_WIDTH / this.numItems) as number) -
    ((this.numItems as number) - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  render() {
    // let notifications: any[] = [];
    // this.props.notifications &&
    //   this.props.notifications.forEach((noti: any, i) => {
    //     const notification = (
    //       <View
    //         style={{
    //           width: deviceWidth,
    //           height: 150,
    //           flex: 1,
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           backgroundColor: 'gold',
    //         }}
    //         key={i}>
    //         <Text style={{width: '100%'}}>Hello :</Text>
    //       </View>
    //     );
    //     notifications.push(notification);
    //   });

    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          style={{height: 200}}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.animVal}}}],
            {useNativeDriver: false},
          )}>
          {/* {notifications} */}
          {this.props.notifications?.map((item, index) => {
            return (
              <NotificationItem index={index && index} Item={item && item} />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    backgroundColor: '#ccc',
    overflow: 'hidden',
    height: 2,
  },
  bar: {
    backgroundColor: '#5294d6',
    height: 2,
  },
});

export default Notification;
