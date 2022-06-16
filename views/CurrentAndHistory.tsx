import React from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getCurrentService,
  getHistroy,
} from "../apiServices/notificationServices";
import AsyncStorage from "@react-native-community/async-storage";
import { errorMessage } from "../global/utils";

interface CurrentAndHistoryState {
  currentNotifications: any[];
  histroyNotifications: any[];
  loading: boolean;
}

interface CurrentAndHistoryProps {
  navigation: any;
}
class CurrentAndHistory extends React.Component<
  CurrentAndHistoryProps,
  CurrentAndHistoryState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentNotifications: [],
      histroyNotifications: [],
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    await this.getNotifications();
    this.setState({ loading: false });
  }
  getNotifications = async () => {
    const userObject = await AsyncStorage.getItem("userObject");
    if (userObject === null) {
      this.props.navigation.replace("LoginView");
    } else {
      const fixitId = JSON.parse(userObject as string).fixitId;
      getCurrentService(fixitId)
        .then((response: any) => {
          // console.log("In Current Service");
          // console.log(response.data);
          this.setState({ currentNotifications: response.data });
          getHistroy(fixitId)
            .then((response: any) => {
              console.log("In History");
              console.log(response.data);
              this.setState({ histroyNotifications: response.data });
            })
            .catch((error) => errorMessage("Something went wrong"));
        })
        .catch((error) => errorMessage("Something went wrong"));
    }
  };
  renderItem = (itemData: any) => (
    <View style={styles.cardContainer}>
      {console.log(itemData)}
      <Text style={styles.cardText}>Service: {itemData.item?.serviceid}</Text>
      <Text style={styles.cardText}>
        Time: {itemData.item?.service_datetime}
      </Text>
    </View>
  );
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: `${Math.round(HEIGHT / 30)}%` }}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.headerTitle}>Current:</Text>
          {this.state.currentNotifications.length !== 0 ? (
            <>
              <FlatList
                data={this.state.currentNotifications}
                renderItem={(item) => this.renderItem(item)}
              />
            </>
          ) : (
            <View>
              <Text>No Data!!!</Text>
            </View>
          )}

          <Text style={styles.headerTitle}>History:anfljdjadl</Text>
          {this.state.histroyNotifications.length !== 0 ? (
            <>
              <FlatList
                data={this.state.histroyNotifications}
                renderItem={(item) => this.renderItem(item)}
              />
            </>
          ) : (
            <View>
              <Text>No Data!!!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}
const HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    height: HEIGHT,
    width: "100%",
  },
  innerContainer: {
    marginTop: "40%",
    height: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "yellow",
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },

  activityIndicator: {
    alignItems: "center",
    height: 80,
    margin: 15,
  },
  headerTitle: {
    fontSize: 24,
    color: "black",
  },
  cardContainer: {
    height: 50,
    margin: 10,
    backgroundColor: "wheat",
    borderRadius: 6,
    justifyContent: "center",
    padding: 5,
    borderWidth: 2,
  },
  cardText: {},
});

export default CurrentAndHistory;

// import React from "react";

// import {
//   StyleSheet,
//   SafeAreaView,
//   FlatList,
//   View,
//   Image,
//   TouchableOpacity,
// } from "react-native";

// export default class CurrentAndHistory extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data: [],

//       refreshing: true,
//     };
//   }

//   componentDidMount() {
//     this.fetchCats();
//   }

//   fetchCats() {
//     this.setState({ refreshing: true });

//     fetch("https://api.thecatapi.com/v1/images/search?limit=10&page=1")
//       .then((res) => res.json())

//       .then((resJson) => {
//         this.setState({ data: resJson });

//         this.setState({ refreshing: false });
//       })
//       .catch((e) => console.log(e));
//   }

//   renderItemComponent = (data) => (
//     <TouchableOpacity style={styles.container}>
//       <Image style={styles.image} source={{ uri: data.item.url }} />
//     </TouchableOpacity>
//   );

//   ItemSeparator = () => (
//     <View
//       style={{
//         height: 2,

//         backgroundColor: "rgba(0,0,0,0.5)",

//         marginLeft: 10,

//         marginRight: 10,
//       }}
//     />
//   );

//   handleRefresh = () => {
//     this.setState({ refreshing: false }, () => {
//       this.fetchCats();
//     }); // call fetchCats after setting the state
//   };

//   render() {
//     return (
//       <SafeAreaView>
//         <FlatList
//           data={this.state.data}
//           renderItem={(item) => this.renderItemComponent(item)}
//           keyExtractor={(item) => item.id.toString()}
//           ItemSeparatorComponent={this.ItemSeparator}
//           refreshing={this.state.refreshing}
//           onRefresh={this.handleRefresh}
//         />
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({

//   image: {
//     height: "100%",

//     borderRadius: 4,
//   },
// });
// export default CurrentAndHistory;
