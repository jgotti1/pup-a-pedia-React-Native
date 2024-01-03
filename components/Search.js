import React, {useState} from "react";
import { View, ScrollView, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import { StyleSheet, Text } from "react-native";



function Search({setBreedResults, breed, setBreed}) {

 
  const [hideSearch, setHideSearch] = useState(false);
  
 

  // API INfo 
  const apiURL = process.env.EXPO_PUBLIC_API_URL;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

const options = {
  method: "GET",
  headers: {
 
    "X-Api-Key": apiKey,
    
  },
};
  
  const handleSubmit = async () => {

if (!breed) {
      Alert.alert("Please enter a Breed to search.");
      return; // Exit the function early if searchQuery is undefined
}
    
    try {
        const response = await fetch(`${apiURL}=${breed}&offset=0`, options);
        const result = await response.json();
    
    if (result.length === 0) {
        console.log('No Breed Found');
        Alert.alert('No Breed Found', 'Please enter a valid breed');
        return null;; // Added return statement to exit the function
    } else {
      setBreedResults(result)
  
    }
    
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred while fetching breed information.");
    }
    
  }
  
  const onChangeSearch = (query) => {
    setBreed(query);
  };
  

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            {!hideSearch && <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={breed}
              onSubmitEditing={handleSubmit}
              autoCorrect={false}
              spellCheck={false}
            />}
          </View>
        </View>
      </ScrollView>
          
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 8,
    marginLeft: 55,
    marginRight: 55,
    marginBottom: 20,
  },

});