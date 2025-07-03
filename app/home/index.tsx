import { GetModelByID } from "@/api/db";
import { Model } from "@/api/db.types";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
import styles from "@/components/Header/styles";
import ModelSheet from "@/components/Model/BottomSheet";
import GlobalStyles, { width } from "@/constants/GlobalStyles";
import { useAI } from "@/context/AIContext";
import useKeyboardStatus from "@/hooks/useKeyboard";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useKeyboardStatus();
  const [state, setState] = useState<null | "loading" | "error">();
  const height = useSharedValue(0);
  const AI = useAI();
  const [text, setText] = useState<string>("");
  const db = useSQLiteContext();
  const [modelData, setModelData] = useState<Model | any>();
  const sheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [AI.chatMessages]);

  useEffect(() => {
    if (isFocused) {
      height.value = withSpring(300, animatedProps);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150); // slight delay for keyboard animation
    } else {
      height.value = withSpring(0, animatedProps);
    }
  }, [isFocused]);

  const send = () => {
    if (text.trim() === "") return;
    AI.sendMessage(text);
    setText("");
  };
  const animatedProps = {
    damping: 80,
    stiffness: 200,
  };

  const handleIdClick = async () => {
    setState("loading");
    if (AI.selectedModel === modelData.id) {
      sheetRef.current?.snapToIndex(1);
      setState(null);
      return;
    }
    const res = await GetModelByID(db, AI.selectedModel);
    setModelData(res);
    setTimeout(() => {
      setState(null);
      sheetRef.current?.snapToIndex(1);
    }, 1500);
  };

  useEffect(() => {
    if (isFocused) {
      height.value = withSpring(300, animatedProps);
    } else {
      height.value = withSpring(0, animatedProps);
    }
  }, [isFocused]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={GlobalStyles.container}>
        {/* Header component */}
        <Header
          LeftIcon={<AntDesign name="menuunfold" size={20} color={"white"} />}
          LeftIconAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          Loading={state === "loading" ? true : false}
          Title={AI.selectedModel || ""}
          TitleAction={handleIdClick}
          TitleStyles={[styles.icon, { fontSize: 13 }]}
          RightIcon={
            <Ionicons name="notifications-outline" size={20} color={"white"} />
          }
        />
        {/* Chatarea */}
        <View style={{ flex: 1, marginVertical: 15 }}>
          <FlatList
            ref={flatListRef}
            data={AI.chatMessages}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
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
          <View>
            <TextInput
              style={GlobalStyles.textInput}
              multiline
              value={text}
              onChangeText={setText}
              cursorColor={"white"}
              placeholderTextColor={"grey"}
              placeholder="Ask anything..."
            />
            <View
              style={{
                flexDirection: "row",
                width: width,
                justifyContent: "space-between",
                paddingRight: 20,
              }}
            >
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="images-outline" size={20} color={"white"} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={[styles.icon, { marginHorizontal: 5 }]}
                >
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
            </View>
          </View>
        </View>
        {/* Manual keyboard onboarding view */}
        <Animated.View style={{ height }} />

        {modelData && (
          <ModelSheet bottomSheetRef={sheetRef} model={modelData} />
        )}
      </View>
    </GestureHandlerRootView>
  );
}
