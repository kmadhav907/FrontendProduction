import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  Alert,
  BackHandler,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import {
  getLocation,
  saveLocation,
  updateLocation,
} from '../apiServices/dashboardApi';
import Map from '../components/googleMap/Map';
import ToggleSwitch from 'toggle-switch-react-native';
import Geolocation from 'react-native-geolocation-service';
import {errorMessage, requestLocationPermission} from '../global/utils';

interface DashboardViewState {
  isEnabled: boolean;
  showingString: string;
  username: string;
  latitude: number | undefined;
  longitude: number | undefined;
  isOn: boolean | false;
  dutyCall: string;
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
      isEnabled: false,
      showingString: '',
      username: '',
      latitude: undefined,
      longitude: undefined,
      isOn: false,
      dutyCall: 'OFF DUTY',
    };
    console.log('Created');
  }
  async componentDidMount() {
    const userObject = await AsyncStorage.getItem('userObject');
    console.log('userobject' + userObject);
    if (userObject === null) {
      this.props.navigation.navigate('LoginView');
    }
    const newUserFlag = JSON.parse(userObject as string).newUser;
    console.log(userObject);
    if (newUserFlag) {
      this.props.navigation.navigate('UserProfileView');
      return;
      // this.props.navigation.navigate('DashboardView');
    }
    try {
      const permissionStatus = await requestLocationPermission();
      if (permissionStatus === true) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            this.setState({latitude: latitude, longitude: longitude});
          },
          error => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    } catch (err) {
      console.log(err);
    }
    const fixitID = JSON.parse(userObject as string).fixitId;
    const userName = JSON.parse(userObject as string).userName;
    await saveLocation(fixitID, this.state.latitude, this.state.longitude).then(
      (response: any) => {
        console.log('Response from saveLoc : ' + response);
        if (response.status === 200) {
          console.log('data is dash', response);
          console.log('no Error in save loc');
        } else {
          errorMessage('Please check your connection');
        }
      },
    );
    await getLocation(fixitID).then((response: any) => {
      console.log('location reponse', response);
      if (response.status === 200) {
        // const locationString =
        //   userName + response.latitude + response.longitude;
        this.setState({
          username: userName,
        });
      }
    });
    // const UserName =
    console.log('fixitId in dash: ' + fixitID);
    // this.props.navigation.navigate('LoginView');
  }

  handleToggle = async () => {
    this.setState({
      isOn: !this.state.isOn,
      dutyCall: this.state.isOn === false ? 'ON DUTY' : 'OFF DUTY',
    });
  };

  render() {
    if (this.state.isOn === true) {
      return (
        <View style={styles.loginContainer1}>
          <View style={styles.drawerStyle}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('MapView');
              }}>
              <Image
                source={require('../assets/white-menu.png')}
                style={styles.iconStyle}
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
            <View style={styles.mapStyle}>
              <TextInput
                style={styles.inputStyle}
                placeholder={`${this.state.username} , ${this.state.latitude} , ${this.state.longitude}`}
              />
              <Map
                latitude={this.state.latitude}
                longitude={this.state.longitude}
              />
            </View>
          </View>

          <View style={styles.bottomView}>
            <View>
              <Image
                source={require('../assets/2-01.png')}
                style={styles.iconStyle}
              />
            </View>
            <View>
              <Image
                source={require('../assets/3-01.png')}
                style={styles.iconStyle}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('UserProfileView');
              }}>
              <Image
                source={require('../assets/4-01.png')}
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
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('MapView');
              }}>
              <Image
                source={require('../assets/white-menu.png')}
                style={styles.iconStyle}
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
                source={require('../assets/man-15.png')}
              />
            </View>
            <View style={styles.oflfineText}>
              <Text style={styles.midText1}>YOU ARE OFFLINE</Text>
              <Text style={styles.midText2}>Please turn on above</Text>
              <Text style={styles.midText3}>toggle button to get request</Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <View>
              <Image
                source={require('../assets/2-01.png')}
                style={styles.iconStyle}
              />
            </View>
            <View>
              <Image
                source={require('../assets/3-01.png')}
                style={styles.iconStyle}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('UserProfileView');
              }}>
              <Image
                source={require('../assets/4-01.png')}
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
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f9d342',
  },
  loginContainer1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  iconStyle: {
    width: 40,
    height: 40,
  },
  dahsboardContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    paddingLeft: 30,
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: '70%',
    marginTop: '10%',
    backgroundColor: 'white',
    width: '100%',
    shadowColor: '#000',
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
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 30,
    paddingLeft: 20,
  },
  bottomView: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 7,
    elevation: 10,
  },

  titleStyle: {
    fontSize: 25,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
  },
  titleStyle1: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
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
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
  },
  midText1: {
    fontSize: 20,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },

  midText2: {
    fontFamily: 'Metropolis',
    fontWeight: '300',
    color: 'black',
  },
  midText3: {
    fontFamily: 'Metropolis',
    fontWeight: '300',
    color: 'black',
  },
  dahsboardContainer1: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    paddingLeft: 30,
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: '70%',
    marginTop: '10%',
    backgroundColor: 'white',
    width: '100%',
    shadowColor: '#000',
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
  inputStyle: {
    backgroundColor: '#feffff',
    borderRadius: 12,
    width: '100%',
    // marginLeft: -10,
    // marginTop: -40,
    // height: 45,
    paddingLeft: 10,
    padding: 2,
    elevation: 4,
  },
  mapStyle: {
    marginTop: -60,
    marginLeft: -30,
    marginRight: -20,
    width: '100%',
    height: '70%',
  },
});

export default DashboardView;
