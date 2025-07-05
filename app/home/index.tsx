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
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useKeyboardStatus();
  const [state, setState] = useState<
    null | "loading" | "loading-image" | "error"
  >();
  const height = useSharedValue(0);
  const AI = useAI();
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const db = useSQLiteContext();
  const [modelData, setModelData] = useState<Model | any>();
  const sheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string | null>(null);
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

  const extractImageBase64 = async (filePath: string): Promise<string> => {
    setState("loading-image");
    const res = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const ext = filePath.substring(filePath.lastIndexOf(".") + 1);
    const base64 = `data:image/${ext};base64,${res}`;
    setSelectedImages(base64);
    setTimeout(() => {
      setState(null);
    }, 2000);
    return base64;
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to select images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: false,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      extractImageBase64(imageUri);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImages(imageUri);
    }
  };

  const removeImage = () => {
    setSelectedImages(null);
  };

  const send = () => {
    if (text.trim() === "" || (selectedImages && selectedImages.length === 0))
      return;
    if (selectedImages && selectedImages.length > 0) {
      AI.sendMessage(text, selectedImages);
      setText("");
      setSelectedImages(null);
      return;
    }
    AI.sendMessage(text);
    setText("");
  };
  const animatedProps = {
    damping: 80,
    stiffness: 200,
  };

  const handleIdClick = async () => {
    setState("loading");
    const res = await GetModelByID(db, AI.selectedModel);
    setModelData(res);
    setTimeout(() => {
      setState(null);
      res && sheetRef.current?.snapToIndex(1);
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
          RightIconStyles={{ opacity: 0.5 }}
          RightIconAction={() => {}}
        />
        {/* Chatarea */}
        <View style={{ flex: 1, marginVertical: 15 }}>
          <FlatList
            ref={flatListRef}
            data={
              AI.isLoading
                ? [
                    ...AI.chatMessages,
                    {
                      content: "Thinking...",
                      role: "assistant",
                      timestamp: new Date().toLocaleString(),
                    },
                  ]
                : AI.chatMessages
            }
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Chat
                content={item.content}
                sender={item.role === "user" ? "user" : "ai"}
                timestamp={item.timestamp}
                router={router}
              />
            )}
          />
        </View>

        {/* Keyboard Area */}
        <View style={GlobalStyles.InputContainer}>
          <View>
            {state === "loading-image" ? (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 10,
                  gap: 10,
                }}
              >
                <View style={{ position: "relative" }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      backgroundColor: "grey",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size={25} color={"white"} />
                  </View>
                </View>
              </View>
            ) : (
              selectedImages &&
              selectedImages?.toString().length > 5 && (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 10,
                    gap: 10,
                  }}
                >
                  <View style={{ position: "relative" }}>
                    <Image
                      source={selectedImages}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        backgroundColor: "grey",
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        backgroundColor: "red",
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => removeImage()}
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}
            <TextInput
              style={GlobalStyles.textInput}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus
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
              <TouchableOpacity style={styles.icon} onPress={pickImage}>
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
