import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  messageContainer: {
    gap: 12,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 2,
    margin: 8,
    borderRadius: 15,
  },
  userMessageContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  contentText: { color: "white" },
});

export default style;
