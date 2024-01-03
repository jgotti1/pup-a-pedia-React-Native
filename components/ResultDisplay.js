import React from "react";
import { View, StyleSheet, Image, ScrollView, Text  } from "react-native";
import { Card } from "react-native-paper";

const ResultDisplay= ({ breedResults }) => {
  return (
    <ScrollView style={styles.scrollViewContent}>
      <View style={styles.cardContainer} >

      {breedResults.map((breedResult, index) => (
        <Card key={index} style={styles.card}>
          <Text style={styles.breedName}>{breedResult.name }</Text>
          <Image
            source={{ uri: breedResult.image_link }}
            style={styles.cardImage}
            />
          {console.log(breedResult)}
        </Card>
      ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

  },
  card: {
    width: "100%", 
    marginVertical: 10,
    backgroundColor: "rgba(231, 229, 229, 0.5)", 
    borderRadius: 20,
   shadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color
    shadowOffset: { width: 14, height: 14 }, // Shadow offset
    shadowOpacity: 0.8, // Shadow opacity
    shadowRadius: 5, // Shadow radius
 
   
  },

  cardImage: {

    height: 200, // Adjust the height as needed
    resizeMode: "cover", // or "contain" based on your preference
    borderRadius: 30, 
    margin: 10,
    backgroundColor: "red"
  
  },
  scrollViewContent: {
    flexGrow: 1, 
  },

    breedName: {
    color: "white",
    fontFamily: "Bangers-Regular",
    fontSize: 23,
    letterSpacing: 3,
    textAlign: "center",
      marginTop: 10,
     textShadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 5, // Shadow radius
  },
});

export default ResultDisplay
