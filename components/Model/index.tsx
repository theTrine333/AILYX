import { Model } from "@/api/db.types";
import { width } from "@/constants/GlobalStyles";
import getCompanyLogo from "@/logos";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const index = ({ features, id, info, type, action }: Model) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "rgba(255,255,255,0.1)",
        padding: 10,
      }}
      onPress={action}
    >
      <Image
        source={{
          uri: getCompanyLogo(info.developer),
        }}
        style={{
          height: 50,
          width: 50,
          borderRadius: 10,
          backgroundColor: "transparent",
        }}
        resizeMode="contain"
      />
      <View style={{ gap: 5, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
          {info.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 10, color: "grey" }}>{info.developer}</Text>
        </View>
        {info.description && (
          <Text
            numberOfLines={1}
            style={{
              color: "white",
              fontSize: 11,
              width: width * 0.77,
            }}
          >
            {info.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default index;
