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
  componentDidMount() {
    // this.props.navigation.navigate('LoginView');
  }
  render() {
    return (
      <View>
        <Text>DashBoard</Text>
      </View>
    );
  }
}
export default DashboardView;
