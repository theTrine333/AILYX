import { useAI } from "@/context/AIContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Conversation } from "../../context/conversationUtils";
import ConversationItem from "./Item";
import styles from "./styles";
const Index = () => {
  const {
    conversations,
    currentConversationId,
    loadConversation,
    deleteConversation,
    toggleConversationFavorite,
    newConversation,
    conversationStats,
  } = useAI();
  const router = useRouter();

  const handleConversationPress = async (conversation: Conversation) => {
    await loadConversation(conversation.id);
    router.push("/home");
  };

  const handleDeleteConversation = async (conversationId: number) => {
    await deleteConversation(conversationId);
  };

  const handleToggleFavorite = async (conversationId: number) => {
    await toggleConversationFavorite(conversationId);
  };

  const handleNewConversation = () => {
    newConversation();
    router.push("/home");
  };

  const groupConversationsByDate = (conversations: Conversation[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const groups = {
      today: [] as Conversation[],
      yesterday: [] as Conversation[],
      lastWeek: [] as Conversation[],
      lastMonth: [] as Conversation[],
      older: [] as Conversation[],
    };

    conversations.forEach((conversation) => {
      const date = new Date(conversation.updated_at);
      if (date.toDateString() === today.toDateString()) {
        groups.today.push(conversation);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(conversation);
      } else if (date >= lastWeek) {
        groups.lastWeek.push(conversation);
      } else if (date >= lastMonth) {
        groups.lastMonth.push(conversation);
      } else {
        groups.older.push(conversation);
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(conversations);

  const renderConversationGroup = (
    title: string,
    conversations: Conversation[]
  ) => {
    if (conversations.length === 0) return null;

    return (
      <View key={title} style={styles.conversationGroup}>
        <Text style={styles.groupTitle}>{title}</Text>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onPress={() => handleConversationPress(conversation)}
            onDelete={() => handleDeleteConversation(conversation.id)}
            onToggleFavorite={() => handleToggleFavorite(conversation.id)}
            isActive={currentConversationId === conversation.id}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Conversation History</Text>
        <TouchableOpacity
          onPress={handleNewConversation}
          style={styles.newChatButton}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {conversationStats.totalConversations} conversations •{" "}
          {conversationStats.totalMessages} messages
        </Text>
      </View>

      <ScrollView
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      >
        {renderConversationGroup("Today", groupedConversations.today)}
        {renderConversationGroup("Yesterday", groupedConversations.yesterday)}
        {renderConversationGroup("Last Week", groupedConversations.lastWeek)}
        {renderConversationGroup("Last Month", groupedConversations.lastMonth)}
        {renderConversationGroup("Older", groupedConversations.older)}

        {conversations.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={50} color="#666" />
            <Text style={styles.emptyStateText}>No conversations yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start chatting to see your history here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
