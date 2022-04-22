import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {MaterialDialog} from 'react-native-material-dialog';
import {MyServices} from '../../apiServices/notificationServices';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

function NotificationItem(this: any, props: any) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<
    any | undefined
  >(undefined);
  const setProblemDescription = (description: string): string => {
    if (description.length > 15) {
      return description.substring(0, 15) + '...';
    } else {
      return description;
    }
  };
  // const updateLocation = async (
  //   latitude: string,
  //   longitude: string,
  // ): string => {
  //   // await selectNotification(latitude, longitude);
  // };
  const clicked = async () => {
    console.log('licked');
  };
  return (
    <View key={props.index}>
      <View style={styles.towText}>
        <Text style={styles.towTextText}>TOWING REQUEST</Text>
      </View>
      <View style={styles.mainBorder}>
        <View style={styles.mainContainer}>
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
                {props.item &&
                  props.item.problemDesciption &&
                  setProblemDescription(props.item.problemDesciption)}
              </Text>
              <TouchableOpacity
                onPressIn={() => {
                  props.setSelectedRegion(props.item);
                  setSelectedNotification(props.item);
                  setShowDialog(true);
                }}>
                <Image
                  source={require('../../assets/information.png')}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.towRequest}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    MyServices('1234', props.item['notificationid:']);
                  }}
                  style={styles.buttonStyle1}>
                  <Text style={styles.buttonTextStyle1}>Accept</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  // onPressIn={clicked()}
                  style={styles.buttonStyle2}>
                  <Text style={styles.buttonTextStyle2}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      {showDialog && (
        <MaterialDialog
          title={'Notification Information'}
          visible={showDialog}
          onOk={() => setShowDialog(false)}
          onCancel={() => setShowDialog(false)}
          colorAccent="#000">
          <View>
            <Text style={styles.textStyle}>
              Problem Description: {selectedNotification.problemDesciption}
            </Text>
            <Text style={styles.textStyle}>
              Problem Description: {selectedNotification.problemDesciption}
            </Text>
            <Text style={styles.textStyle}>
              Problem Description: {selectedNotification.problemDesciption}
            </Text>
          </View>
        </MaterialDialog>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    width: 20,
    height: 20,
    marginLeft: -85,
    marginTop: -7,
  },
  mainContainer: {
    backgroundColor: '#f9d342',
    height: '100%',
    width: '90%',
    alignItems: 'center',
    elevation: 7,
    borderRadius: 15,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  mainBorder: {
    width: ITEM_WIDTH,
    height: '50%',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // marginTop: -10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: '70%',
    height: '17%',
    borderRadius: 15,
    borderBottomColor: 'black',
    borderWidth: 2,
    color: 'black',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 60,
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
  textStyle: {
    fontSize: 15,
    color: 'black',
  },
});
export default NotificationItem;
