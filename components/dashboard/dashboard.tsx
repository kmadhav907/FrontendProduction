import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

class Dashboard extends React.Component {
  render() {
    return (
      <View>
        <Text>Dashboard Screen</Text>
      </View>
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
export default Dashboard;
