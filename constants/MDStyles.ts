import { Platform } from "react-native";

const MDStyles: any = {
  body: { color: "white", fontSize: 15, lineHeight: 20 },

  code_inline: {
    backgroundColor: "rgba(0,0,0,.5)",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },

  code_block: {
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "white",
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  fence: {
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    fontSize: 10,
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  table: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    marginVertical: 8,
    overflow: "hidden",
    width: "100%",
  },

  thead: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  th: {
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },

  tr: {
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
  },

  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  tbody: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  heading1: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  heading2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  heading3: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { color: "white", marginBottom: 4 },

  link: { color: "#93c5fd", textDecorationLine: "underline" },

  blockquote: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "rgba(255,255,255,0.3)",
    padding: 8,
    marginVertical: 8,
  },

  hr: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 1,
  },
};

export default MDStyles;
