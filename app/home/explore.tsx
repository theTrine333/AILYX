import {
  BatchSuperAddModels,
  GetRecentlyUsedModels,
  GetSuggestedModels,
} from "@/api/db";
import { Model as ModelType } from "@/api/db.types";
import Header from "@/components/Header";
import styles from "@/components/Header/styles";
import Model from "@/components/Model";
import ModelSheet from "@/components/Model/BottomSheet";
import Sorter from "@/components/Sorter";
import Suggested from "@/components/Suggested";
import Recent from "@/components/Suggested/Recent";
import GlobalStyles, { height, width } from "@/constants/GlobalStyles";
import { useAI } from "@/context/AIContext";
import { fetchModels } from "@/services";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Explore() {
  const sheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const [selectedModelData, setSelectedModelData] = useState<any>(null);
  const [recents, setRecents] = useState<ModelType[]>([]);
  const router = useRouter();
  const [state, setState] = useState<
    | null
    | "loading-suggestions"
    | "loading-Cartegories"
    | "loading-types"
    | "loading-all"
    | "loading-recents"
  >("loading-suggestions");
  const AI = useAI();
  const db = useSQLiteContext();
  const loadData = async () => {
    setState("loading-recents");
    const recent: any = await GetRecentlyUsedModels(db);
    AI.setRecentlyUsed(recent);
    setTimeout(() => {
      setState(null);
    }, 1500);
    setState("loading-suggestions");
    const suggestions = await GetSuggestedModels(
      db,
      "chat-completion",
      recent.map((m: ModelType) => m.id)
    );
    AI.setSuggested(suggestions);
    setTimeout(() => {
      setState(null);
    }, 1500);
    setState("loading-all");
    const data = await fetchModels();
    AI.setModels(data);
    await BatchSuperAddModels({ db, models: data });
    setTimeout(() => {
      setState(null);
    }, 1500);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleOpenModelSheet = (model: any) => {
    setSelectedModelData(model);
    sheetRef.current?.snapToIndex(1);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={GlobalStyles.container}>
        <Header
          LeftIcon={<AntDesign name="menuunfold" size={20} color={"white"} />}
          LeftIconAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          Title={"Explore All Models"}
          TitleStyles={[
            styles.icon,
            { fontSize: 14, fontWeight: "bold", margin: 10 },
          ]}
          RightIcon={
            <Ionicons name="notifications-outline" size={20} color={"white"} />
          }
          RightIconAction={() => {
            router.push("/notifications");
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Recent */}
          {AI.recentlyUsed.length > 0 && (
            <View
              style={{
                width: width,
                height: height * 0.18,
              }}
            >
              <Text style={GlobalStyles.heading}>Recently used</Text>
              <ScrollView
                style={{ width: width, paddingTop: 15 }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {AI.recentlyUsed.map((item, index) => (
                  <Recent
                    key={item.id || index}
                    features={item.features}
                    id={item.id}
                    info={item.info}
                    type={item.type}
                    action={() => {
                      handleOpenModelSheet(item);
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          {/* Suggested */}
          <View
            style={{
              width: width,
              height: height * 0.25,
            }}
          >
            <Text style={GlobalStyles.heading}>Suggested for you</Text>

            <ScrollView
              style={{ width: width, paddingVertical: 15 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {state === "loading-suggestions" || AI.suggested.length === 0 ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: width,
                  }}
                >
                  <ActivityIndicator
                    size={25}
                    color={"white"}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              ) : (
                AI.suggested.map((item, index) => (
                  <Suggested
                    key={item.id || index}
                    features={item.features}
                    id={item.id}
                    info={item.info}
                    type={item.type}
                    action={() => {
                      handleOpenModelSheet(item);
                    }}
                  />
                ))
              )}
            </ScrollView>
          </View>
          {/* Search bar */}
          <View
            style={{
              width: width * 0.95,
              height: height * 0.06,
              marginBottom: 10,
              alignSelf: "center",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.1)",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TextInput
              style={{
                backgroundColor: "transparent",
                flex: 1,
                padding: 10,
                color: "white",
                alignSelf: "center",
              }}
              cursorColor={"white"}
              placeholderTextColor={"grey"}
              onChangeText={AI.setSearchWord}
              placeholder="Search for a model by name"
            />
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                padding: 10,
              }}
              hitSlop={20}
            >
              <AntDesign name="search1" color={"white"} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={GlobalStyles.heading}>Cartegories</Text>
          {/* Cartegories */}
          <ScrollView
            style={{
              flex: 1,
              marginHorizontal: 5,
              paddingHorizontal: 10,
              paddingRight: 50,
              paddingVertical: 5,
              minHeight: 40,
              marginTop: 5,
              flexDirection: "row",
              gap: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {["All", ...AI.categories].map((item, index) => (
              <Sorter key={index} name={item} />
            ))}
            <View style={{ width: 10 }} />
          </ScrollView>
          {/* All models */}
          <ScrollView
            style={{
              width: width,
              marginTop: 10,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {AI.state === "filter-type-loading" || state === "loading-all" ? (
              <ActivityIndicator
                color={"white"}
                style={{ marginTop: 10, alignSelf: "center" }}
              />
            ) : AI.state === "filter-type-error" ? null : AI.searchResults
                .length > 0 ? (
              AI.searchResults.map((item, index) => (
                <Model
                  features={item.features}
                  id={item.id}
                  info={item.info}
                  type={item.type}
                  action={() => {
                    handleOpenModelSheet(item);
                  }}
                  key={index}
                />
              ))
            ) : (
              AI.models.map((item, index) => (
                <Model
                  features={item.features}
                  id={item.id}
                  info={item.info}
                  type={item.type}
                  action={() => {
                    handleOpenModelSheet(item);
                  }}
                  key={index}
                />
              ))
            )}
            <View style={{ height: 10 }} />
          </ScrollView>
        </ScrollView>
      </View>
      {/* Bottom Sheet */}
      {selectedModelData && (
        <ModelSheet bottomSheetRef={sheetRef} model={selectedModelData} />
      )}
    </GestureHandlerRootView>
  );
}
