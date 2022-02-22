import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Alert, BackHandler, StyleSheet} from 'react-native';

import Dashboard from '../components/dashboard/dashboard';
import Navigator from '../components/bottomPanel/navigator';

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
      this.props.navigation.navigate('UserProfileView');
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
      <>
        <Dashboard />
        <Navigator></Navigator>
      </>
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
});

export default DashboardView;
