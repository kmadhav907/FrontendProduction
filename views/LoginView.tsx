import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import OTPField from '../components/otpfield/OTPField';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from '../global/utils';

interface LoginViewState {
  stepsForLogin: number;
  loading: boolean;
  phoneNumber: string;
  errorMessage: string;
  errorFlag: boolean;
  otpToVerify: string;
  latitude: number;
  longitude: number;
}
interface LoginViewProps {
  navigation: any;
}
const CELL_COUNT = 5;
class LoginView extends React.Component<LoginViewProps, LoginViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      stepsForLogin: 0,
      loading: false,
      phoneNumber: '',
      errorFlag: false,
      errorMessage: 'Please Put a valid Phone Number',
      otpToVerify: '',
      latitude: 0,
      longitude: 0,
    };
  }
  async componentDidMount() {
    try {
      await requestLocationPermission();
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
    } catch (err) {
      console.warn(err);
    }
  }
  handleLogin = () => {
    this.setState({loading: true});
    if (this.state.phoneNumber.length < 10) {
      this.setState({
        loading: false,
      });
      this.errorMessage('Enter a valid Phone Number');
      return;
    }
    setTimeout(() => {
      this.setState({
        loading: false,
        stepsForLogin: this.state.stepsForLogin + 1,
      });
    }, 2000);
  };

  handleVerifyOTP = () => {
    this.setState({loading: true});
    console.log(this.state.otpToVerify);
    if (
      this.state.stepsForLogin === 1 &&
      this.state.otpToVerify.length < CELL_COUNT
    ) {
      this.setState({
        loading: false,
      });
      this.errorMessage('Enter a valid OTP');
      return;
    }
    setTimeout(() => {
      this.setState({
        loading: false,
        stepsForLogin: this.state.stepsForLogin + 1,
      });
    }, 2000);
  };
  handleNextPage = () => {
    ToastAndroid.show(this.state.latitude.toString(), ToastAndroid.SHORT);
    this.props.navigation.navigate('DashboardView');
  };
  errorMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };
  render() {
    if (!this.state.loading && this.state.stepsForLogin === 0)
      return (
        <View style={styles.loginContainer}>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your Phone Number"
              keyboardType="phone-pad"
              onChangeText={(number: any) => {
                this.setState({phoneNumber: number});
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.handleLogin}>
            <Text style={styles.buttonTextStyle}>Login</Text>
          </TouchableOpacity>
        </View>
      );
    else if (!this.state.loading && this.state.stepsForLogin === 1)
      return (
        <View style={styles.loginContainer}>
          <View>
            <Text>Enter the OTP:</Text>
          </View>
          <View>
            <Text>
              {'We have sent the OTP:' + this.state.phoneNumber.toString()}
            </Text>
          </View>
          <View>
            <OTPField
              otp={this.state.otpToVerify}
              setOtp={(otp: any) => {
                this.setState({otpToVerify: otp});
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.handleVerifyOTP}>
            <Text style={styles.buttonTextStyle}>{'Verify'}</Text>
          </TouchableOpacity>
        </View>
      );
    else if (!this.state.loading && this.state.stepsForLogin === 2) {
      return (
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.handleNextPage}>
            <Text style={styles.buttonTextStyle}>Dashboard</Text>
          </TouchableOpacity>
          {/* {this.state.latitude && this.state.longitude && (
            <View>
              <Text>{this.state.latitude.toString()}</Text>
              <Text>{this.state.longitude.toString()}</Text>
            </View>
          )} */}
        </View>
      );
    } else
      return (
        <View style={styles.loginContainer}>
          {this.state.loading && (
            <ActivityIndicator
              animating={this.state.loading}
              color="blue"
              size="large"
              style={styles.activityIndicator}
            />
          )}
        </View>
      );
  }
}
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  inputStyle: {
    marginTop: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    padding: 10,
    fontSize: 15,
    color: 'black',
    height: 50,
    width: '90%',
  },
  sectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: 'yellow',
    borderWidth: 0.5,
    borderColor: 'black',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 40,
    marginBottom: 20,
    width: 100,
  },
  buttonTextStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 8,
    paddingHorizontal: 20,
  },
  otpView: {
    width: '80%',
    height: 200,
    color: 'black',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
    borderBottomColor: '#17BED0',
  },
});
export default LoginView;
