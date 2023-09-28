import React from "react";
import { useState, useEffect, useCallback } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View} from "react-native";
import Main from "./components/Main";


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          "Bangers-Regular": require("./assets/fonts/Bangers-Regular.ttf"),
          "MfPawPrints-rgXM7": require("./assets/fonts/MfPawPrints-rgXM7.ttf"),
          "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
          "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
          "LilitaOne-Regular": require("./assets/fonts/LilitaOne-Regular.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  //Render you components here
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Main />
    </View>
  );
}
