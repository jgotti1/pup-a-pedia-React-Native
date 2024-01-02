import React, {useState} from "react";
import { View, ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import getBreedInfo from "../scripts/dogapi";


function Search() {

  const [breed, setBreed] = useState("")
 
  
  const handleSubmit = () => {
    console.log(breed)
  getBreedInfo(breed)
  }
  
  const onChangeSearch = (query) => {
    setBreed(query);
  };
  

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={breed}
              onSubmitEditing={handleSubmit}
              autoCorrect={false}
              spellCheck={false}
            />
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