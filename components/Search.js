import React, {useState} from "react";
import { View, ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import { StyleSheet, Text} from "react-native";

function Search() {

  const [searchQuery, setSearchQuery] = useState("")
  const apiURL = process.env.EXPO_PUBLIC_API_URL;
  
  const handleSubmit = () => {

    console.log(searchQuery)
  }
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
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