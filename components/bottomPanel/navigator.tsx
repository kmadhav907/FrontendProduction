import ProfileView from './profileScreen';
import HelpView from './helpScreen';
import Infoview from './infoScreen';
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

export default Navigator;