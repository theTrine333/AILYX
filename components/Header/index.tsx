import { width } from "@/constants/GlobalStyles";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import HeaderProps from "./types";

const Header = ({
  LeftIcon,
  RightIcon,
  containerStyles,
  Title,
  TitleStyles,
  TitleAction,
  Loading,
  LeftIconAction,
  LeftIconStyles,
  RightIconStyles,
  RightIconAction,
}: HeaderProps) => {
  const hasIcons = LeftIcon || RightIcon;

  return (
    <View
      style={[
        styles.container,
        { justifyContent: hasIcons ? "space-between" : "center" },
        containerStyles,
      ]}
    >
      {LeftIcon && (
        <TouchableOpacity
          style={[styles.icon, LeftIconStyles]}
          onPress={LeftIconAction}
          activeOpacity={0.7}
        >
          {LeftIcon}
        </TouchableOpacity>
      )}

      {Title ? (
        TitleAction ? (
          <TouchableOpacity onPress={TitleAction} activeOpacity={0.7}>
            <Text style={[styles.headingText, TitleStyles]}>{Title}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.headingText, TitleStyles]}>{Title}</Text>
        )
      ) : null}

      {Loading && (
        <ActivityIndicator
          size={20}
          color="white"
          style={{
            position: "absolute",
            alignSelf: "center",
            left: width / 2,
            right: width / 2,
            top: 50,
          }}
        />
      )}

      {RightIcon && (
        <TouchableOpacity
          style={[styles.icon, RightIconStyles]}
          onPress={RightIconAction}
          activeOpacity={0.7}
        >
          {RightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
