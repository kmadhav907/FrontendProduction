import React from 'react';

import ProfileView from './profileScreen';
import HelpView from './helpScreen';
import Infoview from './infoScreen';

import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {StyleSheet, Image} from 'react-native';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Profile: {
      screen: ProfileView,
      navigationOptions: {
        tabBarLabel: 'profile',
        tabBarIcon: () => (
          <Image
            source={require('../../assets/phone.png')}
            style={styles.iconStyle}
          />
        ),
      },
    },
    User: {
      screen: Infoview,
      navigationOptions: {
        tabBarLabel: 'User',
        tabBarIcon: () => (
          <Image
            source={require('../../assets/information.png')}
            style={styles.iconStyle}
          />
        ),
      },
    },
    Setting: {
      screen: HelpView,
      navigationOptions: {
        tabBarLabel: 'Setting',
        tabBarIcon: () => (
          <Image
            source={require('../../assets/user.png')}
            style={styles.iconStyle}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'User',
    barStyle: {backgroundColor: '#FFFFFF'},
  },
);

const Navigator = createAppContainer(TabNavigator);
const styles = StyleSheet.create({
  iconStyle: {
    width: 25,
    height: 25,
  },
});

export default Navigator;
