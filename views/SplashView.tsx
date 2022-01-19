import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';

interface SplashViewState {
  animating: boolean;
}
interface SplashViewProps {
  navigation: any;
}
const splashViewImage = require('../assets/dummy_splash.jpg');
class SplashView extends React.Component<SplashViewProps, SplashViewState> {
  constructor(props: SplashViewProps) {
    super(props);
    this.state = {
      animating: true,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({animating: false});
      this.props.navigation.navigate('LoginView');
    }, 3000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={splashViewImage}
          style={{width: '100%', resizeMode: 'contain'}}
        />
        <ActivityIndicator
          animating={this.state.animating}
          color="blue"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
export default SplashView;
