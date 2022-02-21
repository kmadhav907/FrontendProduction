import ProfileView from './profileScreen';
import HelpView from './helpScreen';
import Infoview from './infoScreen';
import {View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Profile: {
      screen: ProfileView,
      navigationOptions: {
        tabBarLabel: 'profile',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-home'} />
          </View>
        ),
      },
    },
    User: {
      screen: Infoview,
      navigationOptions: {
        tabBarLabel: 'User',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-person'} />
          </View>
        ),
      },
    },
    Setting: {
      screen: HelpView,
      navigationOptions: {
        tabBarLabel: 'Setting',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-home'} />
          </View>
        ),
      },
    },
  },
  {
    barStyle: {backgroundColor: '#FFFFFF'},
  },
);

const Navigator = createAppContainer(TabNavigator);

export default Navigator;
