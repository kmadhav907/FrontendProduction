import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import CheckBox from "@react-native-community/checkbox";
import {
  editProfile,
  getUserDetails,
  uploadProfilePic,
} from "../apiServices/userProfileApi";
import { errorMessage } from "../global/utils";
import SelectMultiple from "react-native-select-multiple";
import "./drawerModel";
import SignUpModal from "./drawerModel";
import { serviceProviders } from "../global/constant";

interface UserProfileProps {
  navigation: any;
}
interface UserProfileState {
  userProfileImage: any | null;
  privacyPolicy: boolean;
  userEmail: string;
  userName: string;
  userAddress: string;
  userExperience: string;
  userServiceProviderType: any[] | null;
  dropDownOpen: boolean;
  userPhoneNumber: string;
  showSignUpModal: boolean;
  termsAndCondition: boolean;
  showEditableContent: boolean;
  loading: boolean;
}
const userProfileImage = require("../assets/userProfileImage.png");
class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      userProfileImage: null,
      privacyPolicy: true,
      userExperience: "",
      userEmail: "",
      showSignUpModal: false,
      userAddress: "",
      userName: "",
      userServiceProviderType: null,
      dropDownOpen: false,
      userPhoneNumber: "",
      termsAndCondition: true,
      showEditableContent: true,
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    const userObject = await AsyncStorage.getItem("userObject");
    const phoneNumber = JSON.parse(userObject as string).userPhoneNumber;
    const fixitID = JSON.parse(userObject as string).fixitId;
    const newUserFlag = JSON.parse(userObject as string).newUser;
    this.setState({ userPhoneNumber: phoneNumber });
    if (newUserFlag) {
      this.setState({ showEditableContent: false });
    }
    if (!newUserFlag) this.getUserDetailsForReadableContent(fixitID);

    // this.props.navigation.addListener('beforeRemove', (event: any) => {
    //   event.preventDefault();
    //   Alert.alert('Exit AskMechanics', 'Do you want to exit?', [
    //     {
    //       text: 'No',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'Yes', onPress: () => BackHandler.exitApp()},
    //   ]);
    // });
  }
  getUserDetailsForReadableContent = (fixitId: string) => {
    getUserDetails(fixitId).then((response: any) => {
      const userDetails = response.data;
      console.log(userDetails["Mr.Fixit Specialization"].length);
      const userServices = userDetails["Mr.Fixit Specialization"];
      let services: any = [];
      userServices.forEach((service: string) => {
        let serviceObj = { value: service, label: service };
        services.push(serviceObj);
      });
      console.log(services);
      this.setState({
        userEmail: userDetails["Mr.Fixit Email"],
        userAddress: userDetails["Mr.Fixit Worskshop Adress"],
        userExperience: userDetails["Mr.Fixit Experience"],
        userName: userDetails["Mr.FixitName"],
        userServiceProviderType: services,
      });
    });
    this.setState({ loading: false });
  };
  choosePhotoFromTheStorage = () => {
    var options: any = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Photo from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    launchImageLibrary(options, async (response: any) => {
      // console.log("Response = ", response);
      if (response.didCancel) {
        errorMessage("Pick an image");
      } else if (response.error) {
        // console.log("ImagePicker Error: ", response.error);
        errorMessage("Something went wrong :(");
      }
      //   (response.customButton);
      else {
        if (response.assets.length != 1) {
          errorMessage("Please select an image");
          return;
        }
        const asset = response.assets[0];
        const formData = new FormData();
        if (asset.fileSize > 3000000) {
          errorMessage("Please select an image below 3MB");
          return;
        }
        console.log("Asset is:");
        console.log(asset);
        formData.append("imageFile", {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        });
        const userObject = await AsyncStorage.getItem("userObject");
        const fixitID = JSON.parse(userObject as string).fixitId;
        console.log(formData);
        uploadProfilePic(formData, fixitID)
          .then((response: any) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  handleSubmitProfile = async () => {
    console.log(this.state.userServiceProviderType);
    if (
      !(
        this.state.userName &&
        this.state.userAddress &&
        this.state.userEmail &&
        this.state.userExperience &&
        this.state.userServiceProviderType
      )
    ) {
      errorMessage("Please fill everything");
      return;
    }
    if (!(this.state.privacyPolicy && this.state.termsAndCondition)) {
      errorMessage("Please accept the terms");
      return;
    }
    let userObject = await AsyncStorage.getItem("userObject");
    const fixitId = JSON.parse(userObject as string).fixitId;
    const userType = JSON.parse(userObject as string).userType;
    const modifiedServiceProviders = this.state.userServiceProviderType!.map(
      ({ label, value }) => {
        return label;
      }
    );

    this.setState({ userServiceProviderType: modifiedServiceProviders });
    editProfile(
      this.state.userEmail,
      this.state.userExperience,
      this.state.userName,
      fixitId,
      this.state.userAddress,
      this.state.userServiceProviderType
    )
      .then(async (response: any) => {
        console.log(response);
        if (response.status === 200) {
          await AsyncStorage.removeItem("userObject");
          const newUserObject = JSON.stringify({
            newUser: false,
            userName: this.state.userName,
            userPhoneNumber: this.state.userPhoneNumber,
            fixitId: fixitId,
            userType: userType,
          });
          console.log("Storage in profiel : " + userObject);
          AsyncStorage.setItem("userObject", newUserObject).then(() =>
            this.props.navigation.goBack()
          );
        } else {
          errorMessage("Something went wrong :(");
        }
      })
      .catch((error: any) => {
        console.log(error);
        errorMessage("Something went wrong :(");
      });
  };
  onSelectedItemsChange = (selectedItems: any) => {
    console.log(selectedItems);
    this.setState({ userServiceProviderType: selectedItems });
  };
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.userProfileContainer}>
          <ActivityIndicator
            animating={this.state.loading}
            color="blue"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      );
    }
    if (!this.state.loading && this.state.showEditableContent) {
      return (
        <View style={styles.userProfileContainer}>
          <View style={styles.drawerStyle}>
            <SignUpModal
              display={this.state.showSignUpModal}
              toggle={() => {
                this.setState({ showSignUpModal: false });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ showSignUpModal: true });
              }}
            >
              <Image
                source={require("../assets/menu-black.png")}
                style={styles.drawerIconStyle}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.sectionStyle}
            nestedScrollEnabled={true}
            contentContainerStyle={{
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <View style={styles.profilePicSection}>
              {/* <Image
              source={require(this.state.userProfileImage)}
              style={{width: 20, height: 20}}
            /> */}

              <TouchableOpacity
                style={{
                  marginTop: 5,
                  height: 100,
                  width: 100,
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                disabled={true}
                // onPress={this.choosePhotoFromTheStorage}
              >
                <Image
                  source={userProfileImage}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, { marginTop: "10%" }]}>
              <Text style={styles.readAbleTitle}>Name:</Text>
              <Text style={styles.fieldTextStyle}>
                {this.state.userName || "Not Set"}
              </Text>
            </View>
            <View
              style={[
                {
                  height:
                    this.state.userServiceProviderType !== null
                      ? this.state.userServiceProviderType!.length * 25
                      : 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                },
              ]}
            >
              <Text style={styles.readAbleTitle}>User Type:</Text>
              <View
                style={[
                  {
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  },
                ]}
              >
                {(this.state.userServiceProviderType &&
                  this.state.userServiceProviderType.map(
                    (item: any, index: number) => (
                      <View
                        style={{
                          margin: 2,
                          flexDirection: "column",
                        }}
                        key={index}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 16,
                          }}
                        >
                          {item.value}
                        </Text>
                      </View>
                    )
                  )) || <Text>Not Set</Text>}
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.readAbleTitle]}>Phone Number:</Text>
              <Text style={styles.fieldTextStyle}>
                {this.state.userPhoneNumber}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.readAbleTitle]}>Work-shop Address:</Text>
              <Text style={styles.fieldTextStyle}>
                {this.state.userAddress || "Not set"}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.readAbleTitle]}>Work Experience:</Text>
              <Text style={styles.fieldTextStyle}>
                {this.state.userExperience || "Not set"}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.readAbleTitle]}>Email:</Text>
              <Text style={styles.fieldTextStyle}>
                {this.state.userEmail || "Not Set"}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Text style={styles.buttonTextStyle}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.setState({
                    showEditableContent: !this.state.showEditableContent,
                  });
                }}
              >
                <Text style={styles.buttonTextStyle}>Edit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    } else if (!this.state.loading && !this.state.showEditableContent) {
      return (
        <View style={styles.userProfileContainer}>
          <View style={styles.drawerStyle}>
            <SignUpModal
              display={this.state.showSignUpModal}
              toggle={() => {
                this.setState({ showSignUpModal: false });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ showSignUpModal: true });
              }}
            >
              <Image
                source={require("../assets/menu-black.png")}
                style={styles.drawerIconStyle}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.sectionStyle}
            nestedScrollEnabled={true}
            contentContainerStyle={{ justifyContent: "center" }}
          >
            <View style={styles.profilePicSection}>
              {/* <Image
              source={require(this.state.userProfileImage)}
              style={{width: 20, height: 20}}
            /> */}

              <TouchableOpacity
                style={{
                  marginTop: 5,
                  height: 100,
                  width: 100,
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onPress={this.choosePhotoFromTheStorage}
              >
                <Image
                  source={userProfileImage}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Name:</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter your workshop name"
                onChangeText={(name: string) => {
                  this.setState({ userName: name });
                }}
                value={this.state.userName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Email:</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter your Email"
                onChangeText={(email: string) => {
                  this.setState({ userEmail: email });
                }}
                value={this.state.userEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Experience:</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter your Experience"
                onChangeText={(experience: string) => {
                  this.setState({ userExperience: experience });
                }}
                value={this.state.userExperience}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Workshop Address:</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter your address"
                multiline={true}
                onChangeText={(address: string) => {
                  this.setState({ userAddress: address });
                }}
                value={this.state.userAddress}
              />
            </View>
            <View style={{ height: 20 }}></View>
            <Text
              style={[
                styles.inputTitle,
                { flexShrink: 1, height: 50, width: 200 },
              ]}
            >
              Service Category:
            </Text>
            <View style={{ flexDirection: "row" }}>
              <SelectMultiple
                items={serviceProviders}
                selectedItems={
                  this.state.userServiceProviderType &&
                  this.state.userServiceProviderType
                }
                onSelectionsChange={this.onSelectedItemsChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputTitle,
                  {
                    width: "100%",
                    marginTop: 20,
                    fontSize: 16,
                    height: 20,
                    color: "black",
                  },
                ]}
              >
                {"Your Phone Number is " + this.state.userPhoneNumber}
              </Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Text
                style={{
                  color: "blue",
                  fontSize: 14,
                  fontWeight: "600",
                  marginRight: 5,
                }}
                onPress={() => {
                  Linking.openURL(
                    "https://askmechanic.herokuapp.com/PrivacyPolicy"
                  );
                }}
              >
                Privacy Policy
              </Text>
              <CheckBox
                value={this.state.privacyPolicy}
                onChange={(event: any) => {
                  this.setState({
                    privacyPolicy: !this.state.privacyPolicy,
                  });
                }}
              ></CheckBox>
            </View>
            <View style={styles.checkboxContainer}>
              <Text
                style={{
                  color: "blue",
                  fontSize: 14,
                  fontWeight: "600",
                  marginRight: 5,
                }}
                onPress={() => {
                  Linking.openURL(
                    "https://askmechanic.herokuapp.com/TermsAndConditions"
                  );
                }}
              >
                Terms & Conditions
              </Text>
              <CheckBox
                value={this.state.termsAndCondition}
                onChange={(event: any) => {
                  this.setState({
                    termsAndCondition: !this.state.termsAndCondition,
                  });
                }}
              ></CheckBox>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.handleSubmitProfile}
                style={styles.buttonStyle1}
              >
                <Text style={styles.buttonTextStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  userProfileContainer: {
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
  fieldTextStyle: {
    flex: 1.0,
    textAlign: "left",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    flexWrap: "wrap",
  },
  sectionStyle: {
    flex: 1,
    padding: 8,
    flexDirection: "column",
    alignContent: "center",
    minHeight: "70%",
    marginTop: "20%",
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
  drawerStyle: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 35,
    paddingLeft: 10,
  },
  iconStyle: {
    width: 40,
    height: 40,
  },
  drawerIconStyle: {
    width: 60,
    height: 60,
  },
  profilePicSection: {
    width: "100%",
    height: "15%",
    alignContent: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    height: 45,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 3,
  },
  inputStyle: {
    marginLeft: 10,
    width: "60%",
    height: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    fontSize: 14,
    borderRadius: 4,
    paddingLeft: 5,
  },
  inputStyleForMultipleSelect: {
    marginLeft: 10,
    width: "60%",
    height: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
    paddingLeft: 5,
  },
  inputTitle: {
    width: "35%",
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  readAbleTitle: {
    width: "45%",
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonStyle: {
    backgroundColor: "#f9d342",
    padding: 10,
    width: 100,
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  buttonStyle1: {
    backgroundColor: "#f9d342",
    padding: 10,
    width: 100,
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 30,
  },
  buttonTextStyle: {
    fontWeight: "900",
    color: "black",
    fontSize: 16,
  },
});

export default UserProfile;
