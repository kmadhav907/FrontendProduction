import React from "react";
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
} from "react-native";
import OTPField from "../components/otpfield/OTPField";
import Geolocation from "react-native-geolocation-service";
import {
  checkValidPhoneNumber,
  errorMessage,
  modifyPhoneNumber,
  requestLocationPermission,
} from "../global/utils";
import {
  getOTPForAuthorization,
  resendOTP,
  verifyOTPForAuthorization,
} from "../apiServices/loginApis";
import AsyncStorage from "@react-native-community/async-storage";
import { MaterialDialog } from "react-native-material-dialog";
import { CommonActions } from "@react-navigation/native";

interface LoginViewState {
  stepsForLogin: number;
  loading: boolean;
  phoneNumber: string;
  errorMessage: string;
  errorFlag: boolean;
  otpToVerify: string;
  latitude: number | undefined;
  longitude: number | undefined;
  showDialogMessage: boolean;
  resendOtpFlag: boolean;
}
interface LoginViewProps {
  navigation: any;
}
const CELL_COUNT = 6;
class LoginView extends React.Component<LoginViewProps, LoginViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      stepsForLogin: 0,
      loading: false,
      phoneNumber: "",
      errorFlag: false,
      errorMessage: "Please Put a valid Phone Number",
      otpToVerify: "",
      latitude: undefined,
      longitude: undefined,
      showDialogMessage: false,
      resendOtpFlag: true,
    };
  }
  TIMEOUT_TO_SEND_OTP = 15;
  resendOTPInterval!: NodeJS.Timer;

  resendPasswordTimeOut = () => {
    this.setState({ resendOtpFlag: false, showDialogMessage: true });
    this.resendOTPInterval = setInterval(() => {
      if (this.TIMEOUT_TO_SEND_OTP > 0) {
        // console.log(this.TIMEOUT_TO_SEND_OTP);
        this.TIMEOUT_TO_SEND_OTP = this.TIMEOUT_TO_SEND_OTP - 1;
      }
      if (this.TIMEOUT_TO_SEND_OTP === 0) {
        this.setState({ resendOtpFlag: true });
        console.log("Time out is cancelled");
        clearInterval(this.resendOTPInterval);
        this.TIMEOUT_TO_SEND_OTP = 15;
      }
    }, 1000);
    return () => {
      this.setState({ resendOtpFlag: true });
      clearInterval(this.resendOTPInterval);
      this.TIMEOUT_TO_SEND_OTP = 15;
    };
  };
  async componentDidMount() {
    const userObject = await AsyncStorage.getItem("userObject");
    console.log("loginView" + userObject);
    if (userObject !== null) {
      // this.props.navigation.navigate("DashboardView");
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "DashboardView" }],
        })
      );
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
      }
    } catch (err) {
      console.warn(err);
    }
  }
  // componentDidUpdate = () => {
  //   if (this.state.stepsForLogin === 1) {
  //     // this.resendPasswordTimeOut();
  //   }
  // };
  componentWillUnmount = () => {
    clearInterval(this.resendOTPInterval);
  };
  handleLogin = () => {
    this.setState({ loading: true });
    if (!checkValidPhoneNumber(this.state.phoneNumber)) {
      this.setState({
        loading: false,
      });
      errorMessage("Enter a valid Phone Number");
      return;
    }
    const modifiedPhoneNumber = modifyPhoneNumber(this.state.phoneNumber);
    getOTPForAuthorization(modifiedPhoneNumber).then((response: any) => {
      console.log(response);
      if (response.status === 200) {
        this.setState({
          loading: false,
          stepsForLogin: this.state.stepsForLogin + 1,
          phoneNumber: modifiedPhoneNumber,
        });
      } else {
        this.setState({ loading: false });
        errorMessage("Something went bad :(");
      }
    });

  };
  handleResendOTP = () => {
    if (this.state.resendOtpFlag === true) {
      resendOTP(this.state.phoneNumber)
        .then((response: any) => {
          console.log(response);
          if (response.status !== 200) {
            errorMessage("Something went wrong :(");
          }
          this.setState({ showDialogMessage: true });
          this.resendPasswordTimeOut();
        })
        .catch((error) => {
          errorMessage("Something went bad :(");
        });
    } else {
      this.setState({ showDialogMessage: true });
    }
  };
  handleVerifyOTP = async () => {
    this.setState({ loading: true });
    if (
      this.state.stepsForLogin === 1 &&
      this.state.otpToVerify.length < CELL_COUNT
    ) {
      this.setState({
        loading: false,
      });
      errorMessage("Enter a valid OTP");
      return;
    }
    if (
      this.state.latitude === undefined &&
      this.state.longitude === undefined
    ) {
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
        } else {
          errorMessage("Need Location Permission");
          this.setState({
            loading: false,
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    verifyOTPForAuthorization(
      this.state.phoneNumber,
      this.state.otpToVerify
    ).then(async (response) => {
      console.log(response);
      if (response.data.OtpVerification === true) {
        const userObject = {
          fixitId: response.data.fixitId,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          userPhoneNumber: this.state.phoneNumber,
          userType: response.data.userType,
          newUser: response.data.newUserFlag,
        };
        try {
          await AsyncStorage.setItem("userObject", JSON.stringify(userObject));
        } catch (error) {
          errorMessage("Something went wrong :(");
          return;
        }
        this.setState({
          loading: false,
        });
        console.log(response.data.newUserFlag);
        const newUserFlag = response.data.newUserFlag;
        clearInterval(this.resendOTPInterval);
        if (newUserFlag === false) {
          // this.props.navigation.navigate("DashBoardView");
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "DashBoardView" }],
            })
          );
        } else {
          // this.props.navigation.navigate("UserProfileView");
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "UserProfileView" }],
            })
          );
        }
      } else {
        errorMessage("Enter a valid OTP");
        this.setState({
          loading: false,
        });
        return;
      }
    });
  };
  showMessageDialogBox = () => {
    if (this.state.resendOtpFlag === true || this.TIMEOUT_TO_SEND_OTP === 15) {
      return (
        <MaterialDialog
          title={"Notification Information"}
          visible={this.state.showDialogMessage}
          onOk={() => this.setState({ showDialogMessage: false })}
          onCancel={() => this.setState({ showDialogMessage: false })}
          colorAccent="#000"
        >
          <Text>OTP has been sent Successfully</Text>
        </MaterialDialog>
      );
    } else {
      return (
        <MaterialDialog
          title={"Notification Information"}
          visible={this.state.showDialogMessage}
          onOk={() => this.setState({ showDialogMessage: false })}
          onCancel={() => this.setState({ showDialogMessage: false })}
          colorAccent="#000"
        >
          <Text>Wait for {this.TIMEOUT_TO_SEND_OTP} seconds</Text>
        </MaterialDialog>
      );
    }
  };
  render() {
    if (!this.state.loading && this.state.stepsForLogin === 0) {
      return (
        <View style={styles.loginContainer}>
          <View style={styles.sectionStyle}>
            <Text style={styles.titleTextStyle}>
              Continue with Mobile Number
            </Text>
            <Text style={styles.textStyle}>OTP will be sent to the number</Text>
            <TextInput
              style={styles.inputStyle}
              defaultValue={"+91"}
              keyboardType="phone-pad"
              onChangeText={(number: any) => {
                this.setState({ phoneNumber: number });
                console.log(this.state.phoneNumber);
              }}
            />
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.handleLogin}
            >
              <Text style={styles.buttonTextStyle}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (!this.state.loading && this.state.stepsForLogin === 1) {
      return (
        <View style={styles.loginContainer}>
          <View style={styles.sectionStyle}>
            <Text style={styles.titleTextStyle}>Enter the OTP:</Text>
            <Text style={styles.textStyle}>
              {"We have sent the OTP to:" + this.state.phoneNumber.toString()}
            </Text>
            <OTPField
              otp={this.state.otpToVerify}
              setOtp={(otp: any) => {
                this.setState({ otpToVerify: otp });
              }}
            />

            <Text
              style={[styles.textStyle, styles.resendLinkText]}
              onPress={this.handleResendOTP}
            >
              Resend
            </Text>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.handleVerifyOTP}
            >
              <Text style={styles.buttonTextStyle}>{"Verify"}</Text>
            </TouchableOpacity>
          </View>
          {this.state.showDialogMessage && this.showMessageDialogBox()}
        </View>
      );
    } else {
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
}
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9d342",
    width: "100%",
    height: "100%",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  inputStyle: {
    marginTop: 25,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
    padding: 10,
    fontSize: 18,
    color: "black",
    height: 50,
    width: "90%",
    fontWeight: "bold",
  },
  sectionStyle: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    paddingLeft: 30,
    flexDirection: "column",
    alignContent: "center",
    minHeight: "70%",
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
  buttonStyle: {
    backgroundColor: "#f9d342",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    marginLeft: 20,
    marginBottom: 40,
    flex: 1,
    width: "100%",
    borderRadius: 5,
    elevation: 6,
    padding: 10,
    // marginLeft: 35,
    // marginRight: 35,
    // marginTop: 40,
    // marginBottom: 20,
  },
  buttonTextStyle: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
  },
  otpView: {
    width: "80%",
    height: 200,
    color: "black",
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "black",
    borderBottomColor: "#17BED0",
  },
  titleTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  textStyle: {
    fontSize: 14,
    color: "black",
  },
  resendLinkText: {
    paddingLeft: "80%",
    color: "blue",
    fontSize: 16,
  },
});
export default LoginView;
