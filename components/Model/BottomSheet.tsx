import { MarkModelAsUsed } from "@/api/db";
import { AIML_API_KEY, BASE_URL } from "@/config";
import { height } from "@/constants/GlobalStyles";
import { useAI } from "@/context/AIContext";
import getCompanyLogo from "@/logos";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";
interface ModelProps {
  model: {
    id: string;
    type: string;
    info: {
      name: string;
      developer: string;
      description: string;
      contextLength: number;
      url: string;
    };
    features: string[];
  };
  bottomSheetRef: React.RefObject<BottomSheet> | any;
}

const ModelSheet: React.FC<ModelProps> = ({ model, bottomSheetRef }) => {
  const { setSelectedModel, selectedModel } = useAI();
  const [loading, setLoading] = useState(false);
  const isSelected = model.id === selectedModel;
  const db = useSQLiteContext();
  const handleUseModel = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/chat/completions`,
        {
          model: model.id,
          messages: [{ role: "user", content: "hey" }],
        },
        {
          headers: {
            Authorization: `Bearer ${AIML_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setSelectedModel(model.id);
        await MarkModelAsUsed(db, model.id);
        Toast.success("Model selected successfully");
        bottomSheetRef.current?.close();
      } else {
        Toast.error("Upgrade to premium to use this model");
      }
    } catch (error) {
      Toast.error("An error occurred while connecting with your model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["40%", "75%", "90%"]}
      enablePanDownToClose
    >
      <BottomSheetView style={{ padding: 16 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: getCompanyLogo(model.info.developer) }}
            style={{
              width: 75,
              height: 75,
              borderRadius: 32,
              //   borderWidth: 2,
              borderColor: "rgba(0,0,0,0.5)",
            }}
          />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>
            {model.info.name}
          </Text>
          <Text style={{ color: "gray" }}>{model.info.developer}</Text>
        </View>

        <Text style={{ marginTop: 16 }}>{model.info.description}</Text>
        <Text style={{ marginTop: 16, fontWeight: "bold" }}>Features:</Text>
        <ScrollView style={{ maxHeight: height * 0.5 }}>
          {model.features.map((feature, index) => (
            <Text
              key={index}
              style={{ fontSize: 12, color: "gray", paddingLeft: 20 }}
            >
              • {feature}
            </Text>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,0,0,1)",
            marginTop: 20,
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            opacity: isSelected ? 0.5 : 1,
          }}
          onPress={handleUseModel}
          disabled={loading || isSelected}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              {isSelected ? "Selected" : "Select"}
            </Text>
          )}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ModelSheet;
