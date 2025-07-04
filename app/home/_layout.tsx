import History from "@/components/Conversations/History";
import styles from "@/components/Conversations/styles";
import { SimpleLineIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function DrawerLayout() {
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveBackgroundColor: "transparent",
          drawerActiveTintColor: "white",
          headerTitleStyle: styles.heading,
          headerShown: false,
          drawerLabelStyle: styles.heading,
          drawerIcon: () => (
            <Ionicons name="list-outline" size={30} color={"white"} />
          ),
        }}
        drawerContent={() => (
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Image
                source={require("@/assets/images/ailyx.png")}
                style={styles.drawerLogo}
              />
              <Text style={styles.drawerTitle}>AILYX</Text>
            </View>

            <History />

            <View style={styles.drawerFooter}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push("/home/explore");
                }}
              >
                <Ionicons name="grid-outline" size={20} color="white" />
                <Text style={styles.drawerItemText}>Models</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push("/paywall");
                }}
              >
                <SimpleLineIcons name="credit-card" size={20} color="white" />
                <Text style={styles.drawerItemText}>Plans</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push("/home/settings");
                }}
              >
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text style={styles.drawerItemText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      ></Drawer>
    </GestureHandlerRootView>
  );
}
