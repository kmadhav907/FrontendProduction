import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import {uploadProfilePic} from '../apiServices/userProfileApi';
import {errorMessage} from '../global/utils';

interface UserProfileProps {
  navigation: any;
}
interface UserProfileState {
  userProfileImage: any | null;
  privacyPolicyCheck: boolean;
  termsAndConditionsCheck: boolean;
}
const userProfileImage = require('../assets/userProfileImage.png');
class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.state = {
      userProfileImage: null,
      privacyPolicyCheck: true,
      termsAndConditionsCheck: true,
    };
  }
  async componentDidMount() {
    this.props.navigation.addListener('beforeRemove', (event: any) => {
      event.preventDefault();
      Alert.alert('Exit AskMechanics', 'Do you want to exit?', [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ]);
    });
  }
  choosePhotoFromTheStorage() {
    var options: any = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async (response: any) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        errorMessage('Pick an image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        errorMessage('Something went wrong :(');
      }
      //   (response.customButton);
      else {
        if (response.assets.length != 1) {
          errorMessage('Please select an image');
          return;
        }
        const asset = response.assets[0];
        const formData = new FormData();
        if (asset.fileSize > 3000000) {
          errorMessage('Please select an image below 3MB');
          return;
        }
        formData.append('imageFile', asset.fileName);
        formData.append('type', asset.type);
        const userObject = await AsyncStorage.getItem('userObject');
        const fixitID = JSON.parse(userObject as string).fixitId;
        console.log(formData);
        uploadProfilePic(formData, fixitID)
          .then((response: any) => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }
  render() {
    return (
      <View style={styles.userProfileContainer}>
        <View style={styles.sectionStyle}>
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
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              onPress={this.choosePhotoFromTheStorage}>
              <Image
                source={userProfileImage}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Workshop Name:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your workshop name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Mobile Number:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your Mobile Number"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Service Category:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your service category"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Workshop Address:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your address"
              multiline={true}
            />
          </View>
          <View style={{width: '100%', marginTop: 10}}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={this.state.privacyPolicyCheck}
                onChange={() => {
                  this.setState({
                    privacyPolicyCheck: !this.state.privacyPolicyCheck,
                  });
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={this.state.termsAndConditionsCheck}
                onChange={() => {
                  this.setState({
                    termsAndConditionsCheck:
                      !this.state.termsAndConditionsCheck,
                  });
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  userProfileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9d342',
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  sectionStyle: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: '70%',
    marginTop: '30%',
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
  profilePicSection: {
    width: '100%',
    height: '15%',
    alignContent: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    height: 45,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 3,
  },
  inputStyle: {
    marginLeft: 10,
    width: '65%',
    height: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    fontSize: 14,
    borderRadius: 4,
    paddingLeft: 5,
  },
  inputTitle: {width: '30%', fontSize: 12, fontWeight: 'bold'},
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserProfile;
