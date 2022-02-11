import React from "react";
import {View , Text} from 'react-native';

class helpScreen extends React.Component {  
    render() {  
        return (  
            <View>  
                <Text>Image Screen</Text>  
            </View>  
        );  
    }  
}  

// function HomeStack() {
//     return (
//         <Stack.Navigator
//           initialRouteName="Home"
//           screenOptions={{
//             headerStyle: { backgroundColor: '#42f44b' },
//             headerTintColor: '#fff',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}>
//           <Stack.Screen
//             name="Home"
//             component={ProfileView}
//             options={{ title: 'Home Page' }}/>
//         </Stack.Navigator>
//     );
//   }
  
//   function SettingsStack() {
//     return (
//       <Stack.Navigator
//         initialRouteName="Settings"
//         screenOptions={{
//           headerStyle: { backgroundColor: '#42f44b' },
//           headerTintColor: '#fff',
//           headerTitleStyle: { fontWeight: 'bold' }
//         }}>
//         <Stack.Screen
//           name="Settings"
//           component={Infoview}
//           options={{ title: 'Setting Page' }}/>
//       </Stack.Navigator>
//     );
//   }

export default helpScreen;