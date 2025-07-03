import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181920",
    paddingTop: 40,
  },
  InputContainer: {
    backgroundColor: "rgba(0,0,0,1)",
    width: "100%",
    minHeight: 80,
    padding: 10,
    borderTopRightRadius: 16,
    alignItems: "flex-end",
    flexDirection: "row",
    borderTopLeftRadius: 16,
  },
  textInput: {
    width: width * 0.9,
    maxHeight: height * 0.16,
    minHeight: height * 0.06,
    alignSelf: "center",
    marginHorizontal: 3,
    padding: 5,
    color: "white",
    // borderWidth: 1,
    borderColor: "white",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    color: Colors.dark.text,
  },
});
