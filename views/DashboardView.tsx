import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  Alert,
  BackHandler,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';

interface DashboardViewState {
  isEnabled: boolean;
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
    this.state = {isEnabled: false};
    this.changeIsEnabled = this.changeIsEnabled.bind(this);
  }
  async componentDidMount() {
    const userObject = await AsyncStorage.getItem('userObject');
    console.log('userobject' + userObject);
    if (userObject === null) {
      this.props.navigation.navigate('LoginView');
    }
    const newUserFlag = JSON.parse(userObject as string).newUser;
    console.log(userObject);
    if (newUserFlag) {
      this.props.navigation.navigate('UserProfileView');
      return;
      // this.props.navigation.navigate('DashboardView');
    }

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
    // this.props.navigation.navigate('LoginView');
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.drawerStyle}>
          <Image
            source={require('../assets/meat.png')}
            style={styles.iconStyle}
          />
        </View>

        <View style={styles.dahsboardContainer}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Location of User Here"
          />
        </View>
        <View style={styles.bottomView}>
          <Image
            source={require('../assets/information.png')}
            style={styles.iconStyle}
          />

          <Image
            source={require('../assets/phone.png')}
            style={styles.iconStyle}
          />

          <Image
            source={require('../assets/user.png')}
            style={styles.iconStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f9d342',
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  dahsboardContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    paddingLeft: 30,
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: '70%',
    marginTop: '20%',
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
    marginTop: 35,
    paddingLeft: 20,
  },
  bottomView: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    elevation: 10,
  },
  inputStyle: {
    backgroundColor: '#feffff',
    borderRadius: 12,
    width: '100%',
    marginLeft: -10,
    marginTop: -40,
    height: 45,
    paddingLeft: 10,
    padding: 2,
    elevation: 4,
  },
});

export default DashboardView;
