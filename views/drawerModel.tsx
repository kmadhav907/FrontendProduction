import React, { useState } from "react";
import { Text, StyleSheet, View, Modal, Button } from "react-native";

const SignUpModal = (props: any) => {
  return (
    <Modal
      visible={props.display}
      animationType={"slide"}
      onRequestClose={props.toggle}
    >
      <View>
        <Button title="Sign Up" onPress={props.toggle} />
        <Text>Ok</Text>
      </View>
    </Modal>
  );
};

export default SignUpModal;
