import React from 'react';
import Map from '../components/googleMap/Map';
import {requestLocationPermission} from '../global/utils';
import Geolocation from 'react-native-geolocation-service';
import {Text, ToastAndroid, View} from 'react-native';

interface MapViewState {
  latitude: number | undefined;
  longitude: number | undefined;
}

class MapView extends React.Component<{}, MapViewState> {
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
      console.warn(err);
    }
  }
  render() {
    if (this.state.latitude && this.state.longitude) {
      return (
        <Map latitude={this.state.latitude} longitude={this.state.longitude} />
      );
    } else {
      return (
        <View>
          <Text>Map cant be loaded</Text>
        </View>
      );
    }
  }
}
export default MapView;
