import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Text, View} from 'react-native';

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
      this.props.navigation.dispatch(event.data.action);
    });
    // this.props.navigation.navigate('LoginView');
  }
  render() {
    return (
      <View>
        <Text>DashBoard Hi Hleelejdgdjfjngdgnfnkn</Text>
      </View>
    );
  }
}
export default DashboardView;
