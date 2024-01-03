import React from "react";
import { View, StyleSheet, Image, ScrollView, Text  } from "react-native";
import { Card } from "react-native-paper";

const ResultDisplay = ({ breedResults, breed }) => {

  // API translations / descriptions 
  
 // Shedding 
    const sheddingDescriptions = {
      1: "No shedding",
      2: "Minimal shedding",
      3: "Moderate shedding",
      4: "Significant shedding",
      5: "Maximum shedding",
    };
    
    // grooming -

    const groomingDescriptions = {
      0: "Very Low Grooming Requirement",
      1: "Minimal Grooming Required",
      2: "Low Grooming Needs",
      3: "Moderate Grooming Necessary",
      4: "Frequent Grooming Necessary",
      5: "High Grooming Demands"

    };
// drooling -
    const droolingDescriptions = {
      0: "Very Low Drooling Tendency",
      1: "Minimal Drooling Tendency",
      2: "Occasional Drooling",
      3: "Moderate Drooling Likelihood",
      4: "Frequent Drooling Expected",
      5: "Excessive Drooling Potential"
    }

    // children -
    const childrenDescriptions = {
      0: "Definetly Not Recommended for Homes with Children",
      1: "Not Recommended for Homes with Children",
      2: "Requires Supervision Around Kids",
      3: "Generally Good with Children",
      4: "Very Friendly and Patient with Kids",
      5: "Excellent with Children"
    }

        //good_with_strangers
    const strangersDescriptions = {
      5: "Very Friendly with Strangers",
      4: "Generally Welcoming to New Faces",
      3: "Cautious but Approachable with Strangers",
      2: "Reserved or Shy with Strangers",
      1: "Guarded or Anxious around Strangers",
      0: "Very Guarded or Anxious around Strangers",
    }
    
    // other dogs-
    const otherDogDescriptions = {
      0: "Definetly Not for Homes with Other Dogs",
      1: "Not Recommended for Homes with Other Dogs",
      2: "May Have Conflicts with Certain Dogs",
      3: "Generally Good with Other Dogs",
      4: "Very Sociable with Canine Companions",
      5: "Excellent with Other Dogs"
    }

      // playfull-
    const playfullDescriptions = {
      0: "Very Low Playfulness",
      1: "Low Playfulness",
      2: "Moderate Playfulness",
      3: "Playfull",
      4: "Very Playfull",
      5: "Extremely Playfull"
    }
    
    // protectiveness 
    const protectDescriptions = {
      0: "Definetly Not Protective Breed",
      1: "Not Very Protective Breed",
      2: "Somewhat Protective Breed",
      3: "Moderate Protective Breed ",
      4: "Very Protective Breed",
      5: "Extremely Protective Breed",
    }
    // trainability
    const trainabilityDescriptions = {
      0: "Definetly Not Trainable Breed",
      1: "Not Very Trainable Breed",
      2: "Somewhat Trainable Breed",
      3: "Moderately Trainable Breed ",
      4: "Highly Trainable Breed",
      5: "Extremely Trainable Breed",
    }

    // Barking Traits
   const barkingDescriptions = {
      0: "Silent Breed",
      1: "Not Very Barky Breed",
      2: "Somewhat Barky Breed",
      3: "Moderately Barky Breed ",
      4: "Highly Barky Breed",
      5: "Extremely Barky Breed",
   }
  
    // Energy Traits
  const energyDescriptions = {
  0: "Calm and Relaxed",
  1: "Low Energy Level",
  2: "Moderate Energy Level",
  3: "Energetic",
  4: "Very Energetic",
  5: "Extremely Energetic",
};

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
        <View style={styles.infoContainer}>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Barking:</Text>
              <Text style={styles.text}>
                {barkingDescriptions[breedResult.barking] || "Unknown Barking value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Drooling:</Text>
              <Text style={styles.text}>
                {droolingDescriptions[breedResult.drooling] || "Unknown drooling value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Energy:</Text>
              <Text style={styles.text}>
                {energyDescriptions[breedResult.energy] || "Unknown energy value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Child Friendly:</Text>
              <Text style={styles.text}>
                {childrenDescriptions[breedResult.good_with_children] || "Unknown children value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Other Dogs:</Text>
              <Text style={styles.text}>
                {otherDogDescriptions[breedResult.good_with_other_dogs] || "Unknown other dog value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Strangers:</Text>
              <Text style={styles.text}>
                {strangersDescriptions[breedResult.good_with_strangers] || "Unknown other dog value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Grooming:</Text>
              <Text style={styles.text}>
                {groomingDescriptions[breedResult.grooming] || "Unknown grooming value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Playful:</Text>
              <Text style={styles.text}>
                {playfullDescriptions[breedResult.playfulness] || "Unknown grooming value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Protective:</Text>
              <Text style={styles.text}>
                {protectDescriptions[breedResult.protectiveness] || "Unknown protective value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Shedding:</Text>
              <Text style={styles.text}>
                {sheddingDescriptions[breedResult.shedding] || "Unknown Shedding value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Trainability:</Text>
              <Text style={styles.text}>
                {trainabilityDescriptions[breedResult.trainability] || "Unknown Trainability value"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Life Expectancy:</Text>
              <Text style={styles.text}> Min. - {breedResult.min_life_expectancy} years   Max. - {breedResult.max_life_expectancy} years </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Min. Height:</Text>
              <Text style={styles.text}>Female - {breedResult.min_height_female} inches  Male - {breedResult.min_height_male} inches </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Max. Height:</Text>
              <Text style={styles.text}>Female - {breedResult.max_height_female} inches  Male - {breedResult.max_height_male} inches </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Min. Weight:</Text>
              <Text style={styles.text}>Female - {breedResult.min_weight_female} lbs  Male - {breedResult.min_weight_male} lbs </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.textBold}>Max. Weight:</Text>
              <Text style={styles.text}>Female - {breedResult.max_weight_female} lbs  Male - {breedResult.max_weight_male} lbs </Text>
            </View>
        </View>
      </Card>
      ))}
        <Text style={styles.disclaimer}>** Please Note: All measurements of height, weight, and other dimensions in this application are provided in accordance with United States standards. Please be aware that these values may differ from measurements used in other regions, and conversion may be required for international comparisons. </Text>
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
 infoLine: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    marginLeft: 12,
    marginBottom: -4,
    borderBottomColor: '#ccc', // Adjust the color of the rule line as needed
    borderBottomWidth: 1,      // Adjust the width of the rule line as needed
   marginVertical: 1,        // Adjust the spacing above and below the rule line as needed
    marginRight: 12,
 

  },
 
  infoContainer: {
 marginBottom: 20,
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

    height: 225, 
    resizeMode: "stretch", 
    borderRadius: 30, 
    marginTop: 10,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 5,
    
  
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
     textBold: {
      fontFamily: "Inter-Black",
      marginRight: 4,
      color: "#444343",
      marginLeft: 5,
      fontSize: 12.5,
    
  },
     
  bullet: {
    marginLeft: 10,
    fontSize: 20,
     },
     
  text: {
    color: "#060606", 
    textShadowColor: "rgba(255, 255, 255, 1)", // Shadow color
    textShadowOffset: { width: .15, height: .15 }, // Shadow offset
    textShadowRadius: .5, // Shadow radius
    fontSize: 12,
  },
  
  disclaimer: {
    color: "white",
    fontStyle: 'italic',
  }
});

export default ResultDisplay
