import React from 'react';
import {SafeAreaView, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {mapStyles} from './constant';

interface MapState {
  isMapLoaded: boolean;
}
interface MapProps {
  latitude: number;
  longitude: number;
  selectedRegion: any;
}
class Map extends React.Component<MapProps, MapState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isMapLoaded: false,
    };
  }
  onMapLayout = () => {
    this.setState({isMapLoaded: true});
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, margin: 0, padding: 0}}>
        {this.props.latitude && this.props.longitude && (
          <MapView
            zoomEnabled={true}
            onMapReady={this.onMapLayout}
            zoomControlEnabled={true}
            style={{minHeight: '100%'}}
            customMapStyle={mapStyles}
            initialRegion={{
              latitude: this.props.latitude,
              longitude: this.props.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{
                latitude: this.props.latitude,
                longitude: this.props.longitude,
              }}
            />
            {this.props.selectedRegion && (
              <Marker
                coordinate={{
                  latitude: this.props.selectedRegion.latitude,
                  longitude: this.props.selectedRegion.longitude,
                }}
                pinColor="yellow"
              />
            )}
          </MapView>
        )}
      </SafeAreaView>
    );
  }
}
export default Map;
