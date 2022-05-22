import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { preventBack } from "../global/utils";

interface ETAScreenState {}
interface ETAScreenProps {
  navigation: any;
}
export default class ETAScreen extends React.Component<
  ETAScreenProps,
  ETAScreenState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    preventBack(this.props.navigation);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("FeedbackScreen");
          }}
          activeOpacity={1}
        >
          <Text>OK</Text>
        </TouchableOpacity>
        <Text>Click Up</Text>
      </View>
    );
  }
}
