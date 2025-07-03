import { Model } from "@/api/db.types";
import { height, width } from "@/constants/GlobalStyles";
import { useAI } from "@/context/AIContext";
import getCompanyLogo from "@/logos";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Recent = ({ features, id, info, type, action }: Model) => {
  const isSelected = useAI().selectedModel === id;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "rgba(255,255,255,0.2)",
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 10,
        padding: 10,
        width: width * 0.75,
        minHeight: height * 0.06,
        maxHeight: height * 0.1,
      }}
      onPress={action}
    >
      {isSelected && (
        <View
          style={{
            backgroundColor: "#0bf446",
            position: "absolute",
            right: -10,
            width: 60,
            height: 10,
            alignItems: "center",
            top: 12,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
            transform: [{ rotate: "40deg" }],
          }}
        />
      )}

      {/* Logo and Name */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <Image
          source={{
            uri: getCompanyLogo(info.developer),
          }}
          resizeMode="center"
          style={{
            height: 55,
            width: 55,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 12,
          }}
        />
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
              width: width * 0.5,
            }}
            numberOfLines={3}
          >
            {info.name}
          </Text>
          <Text style={{ color: "white", fontSize: 12 }} numberOfLines={1}>
            {info.developer}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Recent;
