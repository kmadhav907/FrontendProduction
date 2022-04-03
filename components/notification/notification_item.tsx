import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

function NotificationItem(this: any, _props) {
  return (
    <View key={this.props.index}>
      <View style={styles.towText}>
        <Text style={styles.towTextText}>TOWING REQUEST</Text>
      </View>
      <View style={styles.mainBorder}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            }}
            style={styles.imageStyle}
          />
        </View>
        <View style={styles.desp}>
          <View style={styles.custName}>
            <Text style={styles.custNameName}>Name of Customer</Text>
          </View>
          <View style={styles.towRequest}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                // onPress={this.handleSubmit}
                style={styles.buttonStyle1}>
                <Text style={styles.buttonTextStyle1}>Accept</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                // onPress={this.handleSubmit}
                style={styles.buttonStyle2}>
                <Text style={styles.buttonTextStyle2}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBorder: {
    backgroundColor: '#f9d342',
    width: '100%',
    height: '20%',
    elevation: 7,
    borderRadius: 15,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  imageContainer: {
    marginLeft: 80,
    height: 85,
    width: 85,
    borderRadius: 40,
    marginRight: 25,
  },
  imageStyle: {
    height: 85,
    width: 85,
    borderRadius: 40,
  },
  custName: {
    marginBottom: 10,
  },
  custNameName: {
    fontSize: 20,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
    color: 'black',
  },
  desp: {
    justifyContent: 'space-between',
  },
  towText: {
    backgroundColor: '#f9d342',
    width: '50%',
    height: '7%',
    borderRadius: 15,
    borderBottomColor: 'black',
    borderWidth: 2,
    color: 'black',
    marginTop: -60,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 100,
  },
  towTextText: {
    fontSize: 20,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
    color: 'black',
  },
  towRequest: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonStyle1: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    fontSize: 10,
  },
  buttonStyle2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonTextStyle1: {
    color: 'white',
    fontFamily: 'Mertropolis',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonTextStyle2: {
    color: 'black',
    fontFamily: 'Mertropolis',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
export default NotificationItem;
