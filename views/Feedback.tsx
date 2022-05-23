import AsyncStorage from "@react-native-community/async-storage";
import { CommonActions } from "@react-navigation/native";
import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Appbar } from "react-native-paper";

const starImageFilled =
  "https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png";
const starImageCorner =
  "https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png";

// const [defaultRating, setDefaultRating] = useState(2);
// const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
interface Props {
  navigation: any;
}
interface State {
  defaultRating: number;
  maxRating: number[];
  loading: boolean;
}

class FeedbackScreen extends React.Component<Props, State> {
  proceedToSplashScreen = () => {
    AsyncStorage.removeItem("dosId", () => {
      console.log("Item removed");
    });
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "SplashView" }],
      })
    );
  };
  constructor(props: any) {
    super(props);
    this.state = {
      defaultRating: 2,
      maxRating: [1, 2, 3, 4, 5],
      loading: true,
    };
    (() => {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 500);
    })();
  }

  CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {this.state.maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => this.setState({ defaultRating: item })}
            >
              <Image
                style={styles.starImageStyle}
                source={
                  item <= this.state.defaultRating
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  render() {
    if (this.state.loading === true) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={this.state.loading}
            color="blue"
            size="large"
          />
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.titleText}>How was your experience with us</Text>
          <Text style={styles.textStyle}>Please Rate Us</Text>
          <this.CustomRatingBar />

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={this.proceedToSplashScreen}
          >
            <Text style={styles.buttonTextStyle}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9d342",
    justifyContent: "center",
    textAlign: "center",
    height: "100%",
    width: "100%",
  },
  sectionContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    paddingTop: "30%",
    marginTop: "30%",
    backgroundColor: "white",
    width: "100%",
    shadowColor: "#000",
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
  titleText: {
    padding: 4,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  textStyle: {
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    marginTop: 15,
  },
  textStyleSmall: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    backgroundColor: "#f9d342",
    margin: 16,
    height: 50,
  },
  buttonTextStyle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  customRatingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  starImageStyle: {
    width: 50,
    height: 50,
    marginLeft: 8,
    resizeMode: "cover",
  },
});

export default FeedbackScreen;
