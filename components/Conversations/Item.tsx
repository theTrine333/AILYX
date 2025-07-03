import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Conversation } from "../../context/conversationUtils";
import styles from "./styles";
const ConversationItem = ({
  conversation,
  onPress,
  onDelete,
  onToggleFavorite,
  isActive,
}: {
  conversation: Conversation;
  onPress: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  isActive: boolean;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleLongPress = () => {
    Alert.alert("Conversation Options", conversation.title, [
      {
        text: conversation.is_favorite
          ? "Remove from Favorites"
          : "Add to Favorites",
        onPress: onToggleFavorite,
      },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert(
            "Delete Conversation",
            "Are you sure you want to delete this conversation?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: onDelete },
            ]
          );
        },
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.conversationItem, isActive && styles.activeConversation]}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.conversationTitleContainer}>
          <Text style={styles.conversationTitle} numberOfLines={1}>
            {conversation.title}
          </Text>
          {conversation.is_favorite === 1 && (
            <Ionicons
              name="heart"
              size={14}
              color="#ff6b6b"
              style={styles.favoriteIcon}
            />
          )}
        </View>
        <Text style={styles.conversationDate}>
          {formatDate(conversation.updated_at)}
        </Text>
      </View>
      <View style={styles.conversationMeta}>
        <Text style={styles.conversationModel} numberOfLines={1}>
          {conversation.model_id}
        </Text>
        <Text style={styles.messageCount}>
          {conversation.message_count} messages
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;
