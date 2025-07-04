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
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    marginVertical: 4,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666",
    opacity: 0.6,
  },
  updateIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    marginBottom: 8,
    gap: 8,
  },
  updateText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});

export default style;
