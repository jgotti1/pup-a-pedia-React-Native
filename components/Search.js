import React, {useState} from "react";
import { View, ScrollView, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import getBreedInfo from "../scripts/dogapi";


function Search() {

  const [breed, setBreed] = useState("")
  const [hideSearch, setHideSearch] = useState(false);
  const [breedResults, setBreedResults] = useState()
 
  
  const handleSubmit = () => {

if (!breed) {
      Alert.alert("Please enter a Breed to search.");
      return; // Exit the function early if searchQuery is undefined
}
else {

  setBreedResults(getBreedInfo(breed))

  if (!breedResults) {
     Alert.alert("Please enter a valid Breed.");
      return; // Exit the function early if searchQuery is undefined
  } else {console.log (`hey you have results  ${breed}`)}

 
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