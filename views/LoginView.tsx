import React from 'react';
import {Text, View} from 'react-native';

interface LoginViewState {}

class LoginView extends React.Component<{}, LoginViewState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }
}
export default LoginView;
