import GlobalStyles, { height, width } from "@/constants/GlobalStyles";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
const CodeWebViewScreen = () => {
  const { code, language } = useLocalSearchParams<{ code: string; language: string }>();
  return (
    <View style={GlobalStyles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>Code Preview</Text>
        <Text style={styles.languageTag}>{language.toUpperCase()}</Text>
      </View>
      <ScrollView>
      <CodeHighlighter
			hljsStyle={atomOneDarkReasonable}
			containerStyle={styles.codeContainer}
			textStyle={styles.text}
			language={language}
      scrollViewProps={{showsHorizontalScrollIndicator:false,bounces:false}}
		>
      {code}
    </CodeHighlighter>
    </ScrollView>
    </View>
  );
};

const escapeHtml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:40
  },
  webview: {
    width:width,height:"100%",
  },
  headerTitle: {
    color: '#abb2bf',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#21252b',
    borderBottomWidth: 1,
    borderBottomColor: '#3e4451',
  },
  languageTag: {
    color: '#61afef',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: '#3e4451',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  codeContainer: {
		paddingHorizontal: 30,
    paddingVertical:10,
    backgroundColor:"#181920",
		minWidth: width+10,
    minHeight:height
	},
	text: {
		fontSize: 14,
    fontFamily:"FiraCode"
	},
});

export default CodeWebViewScreen;
