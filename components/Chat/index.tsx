import MDStyles from "@/constants/MDStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";
import style from "./styles";

const Index = ({
  content,
  sender,
  timestamp,
}: {
  content: string;
  sender: string;
  timestamp: string;
}) => {
  const isUser = sender === "user";

  return (
    <View
      style={[style.messageContainer, isUser && style.userMessageContainer]}
    >
      <Markdown
        style={MDStyles}
        rules={{
          fence: (node: any, children, parent, styles) => {
            const language = node?.sourceInfo || "unkown";
            const code = node.content;
            return (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: 10,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    padding: 5,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "white",
                    alignItems: "center",
                    paddingBottom: 10,
                  }}
                >
                  {/* Language tag */}
                  <Text
                    style={{
                      color: "white",
                      opacity: 0.5,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {language}
                  </Text>
                  {/* Copy button */}
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      alignItems: "center",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: 10,
                    }}
                  >
                    <Ionicons
                      name="clipboard-outline"
                      size={15}
                      color={"white"}
                    />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      Copy
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={MDStyles.fence}>{code}</Text>
              </View>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </View>
  );
};

export default Index;
