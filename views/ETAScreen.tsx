import React from "react";
import { Text, View } from "react-native";
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
        <Text>ETA SCreen</Text>
      </View>
    );
  }
}
