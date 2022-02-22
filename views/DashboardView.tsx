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
} from 'react-native';

import HelpScreen from '../components/bottomPanel/helpScreen';
import InfoScreen from '../components/bottomPanel/infoScreen';
import ProfileScreen from '../components/bottomPanel/profileScreen';

interface DashboardViewState {}
interface DashboardViewProps {
  navigation: any;
}
class DashboardView extends React.Component<
  DashboardViewProps,
  DashboardViewState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const userObject = await AsyncStorage.getItem('userObject');
    if (userObject === null) {
      this.props.navigation.navigate('LoginView');
    }
    const newUserFlag = JSON.parse(userObject as string).newUser;
    if (!newUserFlag) {
      // this.props.navigation.navigate('UserProfileView');
      this.props.navigation.navigate('DashboardView');
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
      <SafeAreaView style={styles.loginContainer}>
        <View style={styles.dahsboardContainer}>
          <Text>Dashboard</Text>
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9d342',
    width: '100%',
    height: '100%',
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  dahsboardContainer: {
    backgroundColor: '#f9d342',
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
  },
});

export default DashboardView;
