import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';

interface SplashViewState {
  animating: boolean;
}
interface SplashViewProps {
  navigation: any;
}
const splashViewImage = require('../assets/SplashScreen.png');
class SplashView extends React.Component<SplashViewProps, SplashViewState> {
  constructor(props: SplashViewProps) {
    super(props);
    this.state = {
      animating: true,
    };
  }
  async componentDidMount() {
    setTimeout(async () => {
      try {
        this.setState({animating: false});
        const userObject = await AsyncStorage.getItem('userObject');
        console.log(userObject);
        if (userObject !== null) {
          this.props.navigation.navigate('DashboardView');
        } else {
          this.props.navigation.navigate('LoginView');
        }
      } catch (error) {
        console.log(error);
      }
    }, 2000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={splashViewImage}
          style={{width: '100%', resizeMode: 'contain', height: 170}}
        />
        <View
          style={{
            width: '100%',
            height: 20,
            margin: 20,
          }}>
          <Text style={{textAlign: 'center', fontSize: 16}}>By</Text>
          <Text style={{textAlign: 'center', color: '#f9d342', fontSize: 18}}>
            SIMPLE MECHANIAL SOLUTIONS
          </Text>
        </View>
        <ActivityIndicator
          animating={this.state.animating}
          color="yellow"
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
    backgroundColor: 'black',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
    margin: 15,
  },
});
export default SplashView;
