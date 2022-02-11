import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Alert, BackHandler, Text, View} from 'react-native';

import ProfileView from '../components/bottomPanel/profileScreen';
import HelpView from '../components/bottomPanel/helpScreen';
import Infoview from '../components/bottomPanel/infoScreen';
import Dashboard from '../components/dashboard/dashboard';

import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    
    Profile: {
      screen: ProfileView,
      navigationOptions: {
        tabBarLabel: 'profile',
      },
    },
    User: {
      screen: Infoview,
      navigationOptions: {
        tabBarLabel: 'User',
      },
    },
    Setting: {
      screen: HelpView,
      navigationOptions: {
        tabBarLabel: 'Setting',
      },
    },
  },
  {
    barStyle: {backgroundColor: '#FFFFFF'},
  },
);

const Navigator = createAppContainer(TabNavigator);

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
      <Navigator>
        <Dashboard />
      </Navigator>
    );
  }
}

export default DashboardView;
