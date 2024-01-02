

// API Ninja 

const getBreedInfo = async (breed) => {
// const breed = "great dane"

const url = `https://api.api-ninjas.com/v1/dogs?name=${breed}&offset=0`;

const options = {
  method: "GET",
  headers: {
 
    "X-Api-Key": "GelbFHUS6bA1DLh9LXnMMA==FL2yqt0R4MTlWF47",
    
  },
};

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (result.length === 0) {
    console.log('No Breed Found');
    return; // Added return statement to exit the function
  }


    console.log("----------------");
  


    console.log(result);

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
      0: "Definetly Not Recommended for Homes with Other Dogs",
      1: "Not Recommended for Homes with Other Dogs",
      2: "May Have Conflicts with Certain Dogs",
      3: "Generally Good with Other Dogs",
      4: "Very Sociable and Friendly with Canine Companions",
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
      0: "Definetly Not a Very Protective Breed",
      1: "Not Very Protective Breed",
      2: "Somewhat Protective Breed",
      3: "Moderate Protective Breed ",
      4: "Very Protective Breed",
      5: "Extremely Protective Breed",
    }
    // trainability
    const trainabilityDescriptions = {
      0: "Definetly Not a Very Trainable Breed",
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

    
    // Description translations
     result.forEach((result) => {
      const sheddingValue = result.shedding // Assuming 'shedding' property exists in each result
      const sheddingDescription = sheddingDescriptions[sheddingValue] || "Unknown shedding value";
      const groomingValue = result.grooming; 
      const groomDescription = groomingDescriptions[groomingValue] || "Unknown grooming value";
      const droolingValue = result.drooling; 
      const droolingDescription = droolingDescriptions[droolingValue] || "Unknown drooling value";
      const childrenValue = result.good_with_children; 
      const childrenDescription = childrenDescriptions[childrenValue] || "Unknown children value";
      const strangersValue = result.good_with_strangers; 
      const strangersDescription = strangersDescriptions[strangersValue] || "Unknown strangers value";
      const otherDogValue = result.good_with_other_dogs; 
       const otherDogDescription = otherDogDescriptions[otherDogValue] || "Unknown good with dogs  value";
      const playfullDogValue = result.playfulness;
      const playfullDogDescription = playfullDescriptions[playfullDogValue] || "Unknown playfull value";
      const protectDogValue = result.protectiveness;
      const protectDescription = protectDescriptions[protectDogValue] || "Unknown protect value";
      const trainDogValue = result.trainability;
      const trainabilityDescription = trainabilityDescriptions[trainDogValue] || "Unknown trainability value";
      const barkDogValue = result.barking;
      const barkyDescription = barkingDescriptions[barkDogValue] || "Unknown Barking value";
       
      console.log(`Breed: ${result.name} \n  Shedding: ${sheddingDescription} \n  Grooming: ${groomDescription} \n  Drooling: ${droolingDescription} \n  Children: ${childrenDescription} \n  Strangers: ${strangersDescription}  \n  Other-Dogs: ${otherDogDescription} \n Playfulness: ${playfullDogDescription}  \n Protectiveness: ${protectDescription } \n Trainability: ${trainabilityDescription} \n Barking: ${barkyDescription}  \n Min. Life Expectancy: ${result.min_life_expectancy} years \n Max. Life Expectancy: ${result.max_life_expectancy} years \n Min. Height Male: ${result.min_height_male} inches \n Max. Height Male: ${result.max_height_male} inches \n Min. Weight Male: ${result.min_weight_male} lbs \n Max. Weight Male: ${result.max_weight_male} lbs \n Min. Height Female: ${result.min_height_female} inches \n Max. Height Female: ${result.max_height_female} inches \n Min. Weight Female: ${result.min_weight_female} lbs \n Max. Weight Female: ${result.max_weight_female} lbs \n-------------------`  );
    });

  } catch (error) {
    
    console.error(error); 
  }
};

export default getBreedInfo


