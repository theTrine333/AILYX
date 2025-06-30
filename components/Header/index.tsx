import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import HeaderProps from "./types";

const Header = ({
  LeftIcon,
  RightIcon,
  containerStyles,
  Title,
  TitleStyles,
  LeftIconAction,
  LeftIconStyles,
  RightIconStyles,
  RightIconAction,
}: HeaderProps) => {
  const iconsVisible = RightIcon || LeftIcon;
  return (
    <View
      style={[
        styles.container,
        { justifyContent: iconsVisible ? "space-between" : "center" },
        containerStyles,
      ]}
    >
      {LeftIcon && (
        <TouchableOpacity
          style={[styles.icon, LeftIconStyles]}
          onPress={LeftIconAction}
        >
          {LeftIcon}
        </TouchableOpacity>
      )}
      {Title && <Text style={[styles.headingText, TitleStyles]}>{Title}</Text>}
      {RightIcon && (
        <TouchableOpacity
          style={[styles.icon, RightIconStyles]}
          onPress={RightIconAction}
        >
          {RightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
