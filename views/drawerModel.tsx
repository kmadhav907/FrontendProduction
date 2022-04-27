import React, { useState } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import Modal from "react-native-modal";

const SignUpModal = (props: any) => {
  return (
    <Modal
      isVisible={props.display}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onBackButtonPress={props.toggle}
      style={styles.modalStyle}
    >
      <View>
        <Button title="Sign Up" onPress={props.toggle} />
        <Text>Ok</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: "white",
    color: "white",
  },
});

export default SignUpModal;
