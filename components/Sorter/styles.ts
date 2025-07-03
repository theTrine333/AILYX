import { StyleSheet } from "react-native";

const styles = (selected: boolean = false) => {
  return StyleSheet.create({
    container: {
      backgroundColor: selected ? "blue" : "transparent",
      minWidth: 100,
      borderColor: "white",
      borderWidth: selected ? 0 : 1,
      height: 35,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      paddingHorizontal: 10,
      marginHorizontal: 3,
    },
    text: {
      color: "white",
      fontWeight: selected ? "bold" : "normal",
    },
  });
};

export default styles;
