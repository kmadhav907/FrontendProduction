import React from "react";

const BottomPanel extends React.Component{
    render(){
        return(
            <View style={styles.bottomView}>
          <View>
            <Image
              source={require('../../assets/information.png')}
              style={styles.iconStyle}
            />
          </View>
          <View>
            <Image
              source={require('../../assets/phone.png')}
              style={styles.iconStyle}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('UserProfileView');
            }}>
            <Image
              source={require('../../assets/user.png')}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
        )
    }
}

const styles = StyleSheet.create({
    loginContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#f9d342',
    },
    iconStyle: {
      width: 30,
      height: 30,
    },
    dahsboardContainer: {
      flex: 1,
      padding: 10,
      paddingTop: 60,
      paddingLeft: 30,
      flexDirection: 'column',
      alignContent: 'center',
      minHeight: '70%',
      marginTop: '20%',
      backgroundColor: 'white',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      elevation: 6,
    },
    drawerStyle: {
      width: '100%',
      justifyContent: 'flex-start',
      marginTop: 35,
      paddingLeft: 20,
    },
    bottomView: {
      backgroundColor: 'white',
      width: '100%',
      height: 50,
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 10,
      elevation: 10,
    },
    inputStyle: {
      backgroundColor: '#feffff',
      borderRadius: 12,
      width: '100%',
      marginLeft: -10,
      marginTop: -40,
      height: 45,
      paddingLeft: 10,
      padding: 2,
      elevation: 4,
    },
    titleStyle: {
      fontSize: 20,
    },
    switchStyle: {},
  });

export default BottomPanel;