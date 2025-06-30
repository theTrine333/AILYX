import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SyntaxHighlighter from "react-syntax-highlighter";
import { trimNewlines } from "trim-newlines";
import { getRNStylesFromHljsStyle } from "./styles";

export const CodeHighlighter = ({
  children,
  textStyle,
  hljsStyle,
  scrollViewProps,
  containerStyle,
  ...rest
}) => {
  const stylesheet = useMemo(
    () => getRNStylesFromHljsStyle(hljsStyle),
    [hljsStyle]
  );

  const getStylesForNode = (node) => {
    const classes = node.properties?.className ?? [];
    return classes.map((c) => stylesheet[c]).filter((c) => !!c);
  };

  const renderNode = (nodes, keyPrefix = "row") =>
    nodes.reduce((acc, node, index) => {
      const key = `${keyPrefix}_${index}`;
      if (node.children) {
        const styles = StyleSheet.flatten([
          textStyle,
          { color: stylesheet.hljs?.color },
          getStylesForNode(node),
        ]);
        acc.push(
          <Text style={styles} key={key}>
            {renderNode(node.children, `${key}_child`)}
          </Text>
        );
      }

      if (node.value) {
        acc.push(trimNewlines(String(node.value)));
      }

      return acc;
    }, []);

  const renderer = (props) => {
    const { rows } = props;
    return (
      <ScrollView
        {...scrollViewProps}
        horizontal
        contentContainerStyle={[
          stylesheet.hljs,
          scrollViewProps?.contentContainerStyle,
          containerStyle,
        ]}
      >
        <View onStartShouldSetResponder={() => true}>{renderNode(rows)}</View>
      </ScrollView>
    );
  };

  return (
    <SyntaxHighlighter
      {...rest}
      renderer={renderer}
      CodeTag={View}
      PreTag={View}
      style={{ backgroundColor: "red" }}
      testID="code-highlighter"
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeHighlighter;
