import React from "react";
import { SafeAreaView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getDirections } from "../../global/utils";
import { mapStyles } from "./constant";

interface MapState {
  isMapLoaded: boolean;
  cordinates: any;
}
interface MapProps {
  latitude: number;
  longitude: number;
  selectedRegion: any;
  navigation: any;
}
class Map extends React.Component<MapProps, MapState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isMapLoaded: false,
      cordinates: [],
    };
  }
  componentDidMount = async () => {
    console.log("In Map Component");
    console.log(this.props.navigation);
    if (
      // this.props.navigation.contains("RouteMap") &&
      this.props.selectedRegion
    ) {
      console.log("Inside the condition");
      let sourceCordinates: String =
        this.props.latitude + ", " + this.props.longitude;
      let destinationCordinates: String =
        this.props.selectedRegion.latitude + ", " + this.props.selectedRegion;
      let cordinates: any = await getDirections(
        sourceCordinates,
        destinationCordinates
      );
      this.setState({ cordinates: cordinates });
      console.log(cordinates);
    }
  };
  onMapLayout = () => {
    this.setState({ isMapLoaded: true });
  };
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          margin: 0,
          padding: 0,
          backgroundColor: "white",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        }}
      >
        {this.props.latitude && this.props.longitude && (
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <MapView
              zoomEnabled={true}
              onMapReady={this.onMapLayout}
              zoomControlEnabled={false}
              style={{
                minHeight: "100%",
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                borderRadius: 18,
                overflow: "hidden",
              }}
              customMapStyle={mapStyles}
              initialRegion={{
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
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
                  pinColor={"green"}
                />
              )}
            </MapView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
export default Map;
