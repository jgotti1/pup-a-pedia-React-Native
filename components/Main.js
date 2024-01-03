import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, ImageBackground, StyleSheet, SafeAreaView , TouchableOpacity, Linking} from "react-native";
import Puppy from "../assets/images/doggy-bkg.jpg";
import Constants from "expo-constants";
import Search from "./Search"
import Reset from "./Reset"
import ResultDisplay from "./ResultDisplay";



const Main = () => {
  const version = Constants.expoConfig.ios.buildNumber;
  const [breedResults, setBreedResults] = useState(null)
  const [isPressed, setIsPressed] = useState(false);
console.log(breedResults)
  return (
    <ImageBackground source={Puppy} style={styles.image}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.topLineContainer}>
          <Text style={styles.versionText}>{version}</Text>
          <View style={styles.copyright}>
            <TouchableOpacity onPress={() => Linking.openURL("https://johnmargotti.com/")}>
              <Text style={styles.linkText}>&#169; margotticode2023</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>
          Pup <Text style={styles.titlePaw}>A</Text> Pedia
        </Text>
        {!breedResults && <Search setBreedResults={setBreedResults} />}
        {!breedResults && <Text style={styles.breedSearch}>
          Which breed shall we explore together?
        </Text>}
        {breedResults && <ResultDisplay breedResults={breedResults} />}
       {breedResults && < Reset setBreedResults={setBreedResults} setIsPressed={setIsPressed} isPressed={isPressed} />}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Main;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  title: {
    color: "white",
    fontFamily: "Bangers-Regular",
    fontSize: 60,
    letterSpacing: 4,
    textAlign: "center",
    marginTop: 10,
  },
  titlePaw: {
    color: "white",
    fontSize: 100,
    fontFamily: "MfPawPrints-rgXM7",
  },
  copyright: {
    flexDirection: "row",
    alignItems: "center",
    color: "white",
    marginRight: 5,
  },
  versionText: {
    fontSize: 10,
    color: "white",
    marginLeft: 5,
  },
  versionText: {
    fontSize: 10,
    color: "white",
  },
  topLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 12,
  },
  linkText: {
    fontSize: 9,
    color: "white",
    marginLeft: 5,
  },
  searchWord: {
    fontSize: 32,
  },
  breedSearch: {
    textAlign: "center",
    color: "white",
    // fontFamily: "LilitaOne-Regular",
    fontSize: 12,
    letterSpacing: 2,
  },
});
