import OTPInputView from '@twotalltotems/react-native-otp-input';
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
} from 'react-native';

interface LoginViewState {
  stepsForLogin: number;
  loading: boolean;
  phoneNumber: string;
  errorMessage: string;
  errorFlag: boolean;
  otpToVerify: string;
}
interface LoginViewProps {
  navigation: any;
}
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
    };
  }
  componentDidMount() {}
  handleLogin = () => {
    this.setState({loading: true});
    if (this.state.phoneNumber.length < 10) {
      this.setState({
        errorFlag: true,
        errorMessage: 'Please Put a valid Phone Number',
        loading: false,
      });
      this.errorMessage();
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
    setTimeout(() => {
      this.setState({
        loading: false,
        stepsForLogin: this.state.stepsForLogin + 1,
      });
    }, 2000);
  };

  errorMessage = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(this.state.errorMessage, ToastAndroid.SHORT);
    } else {
      Alert.alert(this.state.errorMessage);
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
            {/* <OTPInputView
              style={{width: '80%', height: 200}}
              pinCount={4}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
            /> */}
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.handleVerifyOTP}>
            <Text style={styles.buttonTextStyle}>Verify</Text>
          </TouchableOpacity>
        </View>
      );
    else if (!this.state.loading && this.state.stepsForLogin === 2)
      return (
        <View>
          <Text>LocationPermission</Text>
        </View>
      );
    else
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
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 2,
    borderColor: 'black',
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
    marginTop: 20,
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
