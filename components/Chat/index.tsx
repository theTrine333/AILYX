import MDStyles from "@/constants/MDStyles";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Clipboard,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import style from "./styles";

interface MessageContent {
  type: "text" | "image";
  text?: string;
  image_url?: {
    url: string;
  };
}

const Index = ({
  content,
  sender,
  timestamp,
  router,
}: {
  content: string | MessageContent[];
  sender: string;
  timestamp: string;
  router: any;
}) => {
  const isUser = sender === "user";
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = async (word: string) => {
    await Clipboard.setString(word);
    setCopiedCode(word);
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
  };

  // Function to render content based on type
  const renderContent = () => {
    // If content is a string (text only), render as before
    if (typeof content === "string") {
      return (
        <Text selectable>
          <Markdown
            style={MDStyles}
            rules={{
              fence: (node: any, children, parent, styles) => {
                const language = node?.sourceInfo || "unknown";
                const code = node.content;
                const isCopied = code === copiedCode;

                const handleViewCode = (code: string, language: string) => {
                  router.push({
                    pathname: "/previewer",
                    params: {
                      code: code,
                      language: language,
                    },
                  });
                };

                return (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      padding: 10,
                      marginVertical: 10,
                      borderRadius: 10,
                      minHeight: 120,
                      maxHeight: 120,
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
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        width: "100%",
                        alignItems: "center",
                        borderRadius: 10,
                        marginTop: 10,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      onPress={() => {
                        handleViewCode(code, language);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Preview
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              },
              image: (node, children, parent, styles) => {
                const imageUrl = node.attributes.src;
                return (
                  <View>
                    <Image
                      key={node.key}
                      source={{ uri: imageUrl }}
                      style={{
                        width: 200,
                        height: 200,
                        resizeMode: "contain",
                        backgroundColor: "grey",
                        borderRadius: 12,
                      }}
                    />
                    {/* Buttons */}
                    {!isUser && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          paddingTop: 5,
                        }}
                      >
                        <TouchableOpacity style={{ margin: 10 }} hitSlop={20}>
                          <AntDesign
                            name="sharealt"
                            size={20}
                            color={"white"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ margin: 10 }} hitSlop={20}>
                          <AntDesign
                            name="download"
                            size={20}
                            color={"white"}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              },
            }}
          >
            {content}
          </Markdown>
        </Text>
      );
    }

    // If content is an array (multimodal), render each item
    return (
      <View style={{ gap: 10 }}>
        {content.map((item, index) => {
          if (item.type === "text") {
            return (
              <Text key={index} selectable>
                <Markdown
                  style={MDStyles}
                  rules={{
                    fence: (node: any, children, parent, styles) => {
                      const language = node?.sourceInfo || "unknown";
                      const code = node.content;
                      const isCopied = code === copiedCode;

                      const handleViewCode = (
                        code: string,
                        language: string
                      ) => {
                        router.push({
                          pathname: "/previewer",
                          params: {
                            code: code,
                            language: language,
                          },
                        });
                      };

                      return (
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: 10,
                            marginVertical: 10,
                            borderRadius: 10,
                            minHeight: 120,
                            maxHeight: 120,
                          }}
                          key={node.key}
                        >
                          {/* Same header structure as above */}
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
                          <TouchableOpacity
                            style={{
                              padding: 10,
                              width: "100%",
                              alignItems: "center",
                              borderRadius: 10,
                              marginTop: 10,
                              backgroundColor: "rgba(255,255,255,0.1)",
                            }}
                            onPress={() => {
                              handleViewCode(code, language);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              Preview
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    },
                    image: (node, children, parent, styles) => {
                      const imageUrl = node.attributes.src;
                      return (
                        <Image
                          key={node.key}
                          source={{ uri: imageUrl }}
                          style={{
                            width: 200,
                            height: 200,
                            resizeMode: "contain",
                            backgroundColor: "grey",
                            borderRadius: 12,
                          }}
                        />
                      );
                    },
                  }}
                >
                  {item.text || ""}
                </Markdown>
              </Text>
            );
          } else if (item.type === "image" && item.image_url) {
            return (
              <Image
                key={index}
                source={{ uri: item.image_url.url }}
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: "contain",
                  backgroundColor: "grey",
                  borderRadius: 12,
                  marginVertical: 5,
                }}
              />
            );
          }
          return null;
        })}
      </View>
    );
  };

  return (
    <View
      style={[style.messageContainer, isUser && style.userMessageContainer]}
    >
      {renderContent()}
    </View>
  );
};

export default Index;
