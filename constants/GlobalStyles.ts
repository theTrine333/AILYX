import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "./Colors";
const { height, width } = Dimensions.get("window");
export default StyleSheet.create({
  InputContainer: {
    backgroundColor: Colors.dark.background,
    width: "100%",
    // minHeight: 65,
    padding: 10,
    borderTopRightRadius: 16,
    alignItems: "flex-end",
    flexDirection: "row",
    borderTopLeftRadius: 16,
  },
  textInput: {
    width: "58%",
    maxHeight: height * 0.16,
    alignSelf: "center",
    marginHorizontal: 3,
    padding: 5,
    color: "white",
    // borderWidth: 1,
    borderColor: "white",
  },
});
