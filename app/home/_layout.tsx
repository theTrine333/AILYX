import Ionicons from "@expo/vector-icons/Ionicons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveBackgroundColor: "transparent",
          drawerActiveTintColor: "white",
          headerTitleStyle: styles.heading,
          drawerLabelStyle: styles.heading,
          drawerIcon: () => (
            <Ionicons name="list-outline" size={30} color={"white"} />
          ),
        }}
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Home",
            headerShown: false,
            drawerIcon: () => (
              <Image
                source={require("@/assets/images/ai.png")}
                style={{ height: 30, width: 30 }}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="explore" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Models",
            title: "Models",
            headerShown: false,
            drawerIcon: () => (
              <Ionicons
                name="grid-outline"
                size={20}
                color={"white"}
                style={{ paddingRight: 5 }}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 17,
  },
});
