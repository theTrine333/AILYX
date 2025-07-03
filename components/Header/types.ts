import { ReactNode } from "react";
import { TextStyle, ViewStyle } from "react-native";

interface HeaderProps {
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  containerStyles?: ViewStyle;
  Title?: string;
  TitleStyles?: TextStyle | TextStyle[];
  Loading?: boolean;
  TitleAction?: any;
  LeftIconAction?: any;
  LeftIconStyles?: ViewStyle;
  RightIconAction?: any;
  RightIconStyles?: ViewStyle;
}

export default HeaderProps;
