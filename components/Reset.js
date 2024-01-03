import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";


const Reset = ({ setIsPressed, isPressed, setBreedResults }) => {
  // const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setBreedResults(null)
  };

  return (
   <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255, 255,255, 0.2)",
    borderWidth: 1,
    borderColor: "#e4e4e9",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 40,
    marginTop: 10,
  },

  text: {
    color: "#f2f2f7",
    fontWeight: "bold",
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
});

export default Reset;
