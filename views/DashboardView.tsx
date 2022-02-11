import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Alert, BackHandler, Text, View } from 'react-native';

import ProfileView from '../components/bottonPanel/profileScreen';
import HelpView from '../components/bottonPanel/helpScreen';
import Infoview from '../components/bottonPanel/infoScreen';

import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

const TabNavigator =  createMaterialBottomTabNavigator(
  {
    Home: {
      screen: ProfileView,
      navigationOptions: {
        tabBarLabel: "Home",
  
      },
    },
    User: {
      screen: Infoview,
      navigationOptions: {
        tabBarLabel: "User",
        
      },
    },
    Setting: {
      screen: HelpView,
      navigationOptions: {
        tabBarLabel: "Setting",
      },
    },
  },
  {
    initialRouteName: "Home",
    barStyle: { backgroundColor: "#006600" },
  }
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
      // <View>
      //   <Text>DashBoard Hi Hleelejdgdjfjngdgnfnkn</Text>
      // </View>
      <Navigator>
        <ProfileView />
    </Navigator>
    );
  }
}

export default DashboardView;
