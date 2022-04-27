/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';

import {
  getNotification,
  getCurrentService,
  selectNotification,
  getHistroy,
} from '../apiServices/notificationServices';

import {
  getFixitStatus,
  saveLocation,
  toggleOffStatus,
  toggleOnStatus,
} from '../apiServices/dashboardApi';
import Map from '../components/googleMap/Map';
import ToggleSwitch from 'toggle-switch-react-native';
import Geolocation from 'react-native-geolocation-service';
import { errorMessage, requestLocationPermission } from '../global/utils';
import Notification from '../components/notification/Notifications';
import HistoryModal from '../components/modals/historyModal';
import './drawerModel';
import SignUpModal from './drawerModel';

interface DashboardViewState {
  isEnabled: boolean;
  isVisible: boolean;
  isVisibleTop: boolean | false;
  showingString: string;
  username: string;
  latitude: number | undefined;
  longitude: number | undefined;
  isOn: boolean | false;
  dutyCall: string;
  loading: boolean;
  notifData: Array<String>;
  selectedRegion: { latitude: string; longitude: string } | undefined;
  cuurentNotifications: any[];
  currentLocations: any[];
  histroyNotifications: any[];
  currentModal: String | undefined;
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
      currentModal: 'model1',
      isVisibleTop: false,
      isVisible: false,
      latitude: undefined,
      longitude: undefined,
      isOn: false,
      dutyCall: 'OFF DUTY',
      loading: false,
      notifData: [],
      selectedRegion: undefined,
      cuurentNotifications: [],
      histroyNotifications: [],
      currentLocations: [],
    };
    console.log('Created');
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const userObject = await AsyncStorage.getItem('userObject');
    console.log('userobject' + userObject);
    if (userObject === null) {
      this.props.navigation.navigate('LoginView');
    }
    const newUserFlag = JSON.parse(userObject as string).newUser;
    console.log(userObject);
    if (newUserFlag) {
      this.props.navigation.navigate('UserProfileView');
      // this.props.navigation.navigate('Notification');
      return;
      // this.props.navigation.navigate('DashboardView');
    }
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
      }
    } catch (err) {
      console.log(err);
    }
    const fixitID = JSON.parse(userObject as string).fixitId;
    const userName = JSON.parse(userObject as string).userName;
    await saveLocation(fixitID, this.state.latitude, this.state.longitude).then(
      (response: any) => {
        // console.log('Response from saveLoc : ' + response);
        if (response.status === 200) {
          // console.log('data is dash', response);
          this.setState({
            username: userName,
          });
          console.log('no Error in save loc');
        } else {
          errorMessage('Please check your connection');
        }
      }
    );

    // const UserName =
    console.log('fixitId in dash: ' + fixitID);

    await getFixitStatus(fixitID)
      .then(async (response: any) => {
        const status = response.data;
        this.setState({
          isOn: status,
        });
        if (this.state.isOn === true) {
          await getNotification(
            fixitID,
            this.state.latitude,
            this.state.longitude
          )
            .then((res: any) => {
              // console.log('data in dashboard : ' + res.data);
              this.setState({
                notifData: res.data,
              });
              console.log('done');
            })
            .catch((err) => {
              console.log('Error in get notif = ' + err.message);
            });
        }
      })
      .catch((err) => console.log('in getLoc ' + err));
    await this.getCurrNotificationsAndHistroy();
    this.setState({ loading: false });
    // this.props.navigation.navigate('LoginView');
  }

  handleToggle = async () => {
    console.log('In HandleToggle');
    const userObject = await AsyncStorage.getItem('userObject');
    const fixitID = JSON.parse(userObject as string).fixitId;
    this.setState({
      isOn: !this.state.isOn,
    });
    if (this.state.isOn === false) {
      toggleOffStatus(fixitID).then((response: any) => {
        // console.log(response);
        if (response.status === 200) {
          this.setState({ dutyCall: 'OFF DUTY' });
        } else {
          this.setState({ isOn: true });
        }
      });
    }
    if (this.state.isOn === true) {
      toggleOnStatus(this.state.latitude, this.state.longitude, fixitID).then(
        async (response: any) => {
          if (response.status === 200) {
            // console.log(response);
            this.setState({ dutyCall: 'ON DUTY' });
            await getNotification(
              fixitID,
              this.state.latitude,
              this.state.longitude
            )
              .then((res: any) => {
                // console.log('data in dashboard : ' + res.data);
                this.setState({
                  notifData: res.data,
                  selectedRegion: undefined,
                });
                console.log('done');
              })
              .catch((err) => {
                console.log('Error in get notif = ' + err.message);
              });
          }
        }
      );
    }
  };
  getCurrNotificationsAndHistroy = async () => {
    const userObject = await AsyncStorage.getItem('userObject');
    if (userObject === null) {
      this.props.navigation.replace('LoginView');
    } else {
      const fixitId = JSON.parse(userObject as string).fixitId;
      getCurrentService(fixitId)
        .then((response: any) => {
          console.log('In Current Service : ');
          console.log(response.data);
          this.setState({ cuurentNotifications: response.data });
          // let locations:any =[];
          // currNotification.forEach((item:any, index:number)=> {
          //   let location = {latitude: item?.}
          //   locations.push()
          // })
          getHistroy(fixitId)
            .then((response1: any) => {
              console.log(response1.data);
              this.setState({ histroyNotifications: response1.data });
            })
            .catch((error) => {
              console.log(error.message);
              errorMessage('Something went wrong');
            });
        })
        .catch((error) => errorMessage(error.message));
    }
  };

  displayModal(show: boolean) {
    this.setState({ isVisible: show });
  }

  displayTopModal(show: boolean) {
    this.setState({ isVisibleTop: show });
  }

  toggleModal = () => {
    this.setState({ isVisibleTop: !this.state.isVisibleTop });
  };

  toggleShortModal = () => {
    console.log('okkkkkkkkkkkkkkk');
    this.setState({isVisible: !this.state.isVisible });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loginContainer}>
          <ActivityIndicator
            animating={this.state.loading}
            color="blue"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      );
    }
    if (this.state.isOn === true) {
      return (
        <View style={styles.loginContainer1}>
          <View style={styles.drawerStyle}>
            <SignUpModal
              display={this.state.isVisibleTop}
              toggle={this.toggleModal}
            />
            <TouchableOpacity
              onPress={() => {
                this.displayTopModal(true);
              }}
            >
              <Image
                source={require('../assets/menu-white.png')}
                style={styles.drawerIconStyle}
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
            <View style={styles.mapContsiner}>
              <View style={styles.inputStyle}>
                <Text style={styles.innerText}>
                  {'   '}
                  {this.state.username} , {this.state.latitude} ,
                  {this.state.longitude}
                </Text>
              </View>

              <View style={styles.mapStyle1}>
                <Map
                  latitude={this.state.latitude as number}
                  longitude={this.state.longitude as number}
                  selectedRegion={
                    this.state.selectedRegion && this.state.selectedRegion
                  }
                />
              </View>
            </View>
            <Notification
              notifications={this.state.notifData && this.state.notifData}
              setSelectedRegion={(notification: any) => {
                const userLocation = notification.userLocation;
                this.setState({
                  selectedRegion: {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  },
                });
                console.log(this.state.selectedRegion);
              }}
            />
          </View>

          <View style={styles.bottomView}>
            <View>
              <Image
                source={require('../assets/2-01.png')}
                style={styles.iconStyle}
              />
            </View>
            <Modal
              animationType={'slide'}
              transparent={true}
              style={styles.modalView}
              visible={this.state.isVisible}
              onRequestClose={() => {
                this.displayModal(!this.state.isVisible);
              }}
            >
              {/* <HistoryModal
                navigation={this.props.navigation}
                currentNotifications={this.state.cuurentNotifications}
                histroyNotifications={this.state.histroyNotifications}
              /> */}
              <View>
                  <View>
                  <TouchableOpacity onPress={() => {this.displayModal(!this.state.isVisible);}}>
                    <Image
                      source={require('../assets/error-white.png')}
                      style={styles.drawerIconStyleTop}
                    />
                </TouchableOpacity>
                  </View>
                <HistoryModal
                  toggle={this.toggleShortModal}
                  navigation={this.props.navigation}
                  currentNotifications={this.state.cuurentNotifications}
                  histroyNotifications={this.state.histroyNotifications}
                />
              </View>
            </Modal>
            <TouchableOpacity
              onPress={() => {
                this.displayModal(true);
              }}
            >
              <Image
                source={require('../assets/3-01.png')}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('UserProfileView');
              }}
            >
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
            <SignUpModal
              display={this.state.isVisibleTop}
              toggle={this.toggleModal}
            />
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.navigate('MapView');
                console.log('Clicked');
                this.displayTopModal(true);
              }}
            >
              <Image
                source={require('../assets/menu-black.png')}
                style={styles.drawerIconStyle}
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
            <Modal
              animationType={'slide'}
              transparent={true}
              style={styles.modalView}
              visible={this.state.isVisible}
              onRequestClose={() => {
                // Alert.alert('Modal has now been closed.');
                this.displayModal(!this.state.isVisible);
              }}
            >
              <View>
                  <TouchableOpacity onPress={() => {this.displayModal(!this.state.isVisible);}}>
                    <Image
                      source={require('../assets/error.png')}
                      style={styles.drawerIconStyleTop}
                    />
                </TouchableOpacity>
                <HistoryModal
                  navigation={this.props.navigation}
                  currentNotifications={this.state.cuurentNotifications}
                  histroyNotifications={this.state.histroyNotifications}
                />
              </View>
            </Modal>
            <TouchableOpacity
              onPress={() => {
                this.displayModal(true);
              }}
            >
              <Image
                source={require('../assets/3-01.png')}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('UserProfileView');
              }}
            >
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
  drawerIconStyleTop: {
    width: 30 ,
    height: 30,
  },
  modalView: {
    margin: 0,
    flex: 1,
    // justifyContent: "flex-end",
    alignItems: 'center',
  },
  innerText: {
    marginRight: 50,
  },
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

  drawerIconStyle: {
    width: 60,
    height: 60,
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
    paddingTop: 50,
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: '50%',
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
    padding: 5,
    elevation: 4,
  },
  mapStyle1: {
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: '50%',
    backgroundColor: 'white',
    width: '100%',
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  mapContsiner: {
    minHeight: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
    margin: 15,
  },
});

export default DashboardView;
