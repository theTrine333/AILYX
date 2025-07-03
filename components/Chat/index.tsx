import MDStyles from "@/constants/MDStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Clipboard,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [copiedCode, setCopiedCode] = useState("");
  const handleCopy = async (word: string) => {
    await Clipboard.setString(word);
    setCopiedCode(word);
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
  };
  return (
    <View
      style={[style.messageContainer, isUser && style.userMessageContainer]}
    >
      <Text selectable>
        <Markdown
          style={MDStyles}
          rules={{
            fence: (node: any, children, parent, styles) => {
              const language = node?.sourceInfo || "unkown";
              const code = node.content;
              const isCopied = code === copiedCode;
              return (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: 10,
                    marginVertical: 10,
                    borderRadius: 10,
                  }}
                  key={node.key}
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
                        opacity: isCopied ? 0.5 : 1,
                      }}
                      onPress={() => {
                        handleCopy(code);
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
                        {isCopied ? "Copied" : "Copy"}
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
      </Text>
    </View>
  );
};

export default Index;
