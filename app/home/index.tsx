import Chat from "@/components/Chat";
import Header from "@/components/Header";
import styles from "@/components/Header/styles";
import GlobalStyles from "@/constants/GlobalStyles";
import { useAI } from "@/context/AIContext";
import useKeyboardStatus from "@/hooks/useKeyboard";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useKeyboardStatus();
  const height = useSharedValue(0);
  const AI = useAI();
  const [text, setText] = useState<string>("");
  const send = () => {
    AI.sendMessage(text);
    setText("");
  };
  const animatedProps = {
    damping: 80,
    stiffness: 200,
  };
  useEffect(() => {
    if (isFocused) {
      height.value = withSpring(300, animatedProps);
    } else {
      height.value = withSpring(0, animatedProps);
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: "#1D3D47", paddingTop: 40 }}>
      {/* Header component */}
      <Header
        LeftIcon={<AntDesign name="menuunfold" size={20} color={"white"} />}
        LeftIconAction={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        Title={AI.selectedModel || ""}
        TitleStyles={[styles.icon, { fontSize: 13 }]}
        RightIcon={
          <Ionicons name="notifications-outline" size={20} color={"white"} />
        }
      />
      {/* Chatarea */}
      <View style={{ flex: 1, marginVertical: 15 }}>
        <FlatList
          data={AI.chatMessages}
          renderItem={({ item, index }) => (
            <Chat
              content={item.content}
              sender={item.role === "user" ? "user" : "ai"}
              timestamp={item.timestamp}
            />
          )}
        />
      </View>

      {/* Keyboard Area */}
      <View style={GlobalStyles.InputContainer}>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="images-outline" size={20} color={"white"} />
        </TouchableOpacity>
        {/* Input */}
        <TextInput
          style={GlobalStyles.textInput}
          multiline
          value={text}
          onChangeText={setText}
          cursorColor={"white"}
          placeholderTextColor={"grey"}
          placeholder="Ask anything..."
        />
        <TouchableOpacity style={[styles.icon, { marginHorizontal: 5 }]}>
          <Ionicons name="mic-outline" size={20} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={send}>
          {text ? (
            <Ionicons name="send" size={20} color={"white"} />
          ) : (
            <Image
              source={require("@/assets/images/wave.png")}
              style={{ height: 20, width: 20 }}
            />
          )}
        </TouchableOpacity>
      </View>
      {/* Manual keyboard onboarding view */}
      <Animated.View style={{ height }} />
    </View>
  );
}
