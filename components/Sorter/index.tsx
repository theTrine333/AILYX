import { useAI } from "@/context/AIContext";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const Index = ({ name }: { name: string }) => {
  const AI = useAI();
  const selected = name === AI.selectedCategory;
  const style = styles(selected);
  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        if (selected) return;
        AI.setSelectedCategory(name);
      }}
    >
      <Text style={style.text}>{name}</Text>
    </TouchableOpacity>
  );
};

export default Index;
