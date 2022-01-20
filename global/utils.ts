import {PermissionsAndroid, ToastAndroid} from 'react-native';

export const requestLocationPermission = async () => {
  const granted = PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'App Title',
      message: 'App Name needs access to your device location ',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  console.log('granted---------', granted);
  if ((await granted) === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('You can use the device location');
  } else {
    console.log('device location permission denied');
  }
};
