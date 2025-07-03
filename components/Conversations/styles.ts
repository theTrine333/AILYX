import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  heading: {
    fontSize: 17,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  drawerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  drawerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  drawerItemText: {
    color: "white",
    fontSize: 16,
    marginLeft: 12,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  newChatButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    marginBottom: 15,
  },
  statsText: {
    color: "#888",
    fontSize: 12,
  },
  conversationsList: {
    flex: 1,
  },
  conversationGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  conversationItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeConversation: {
    borderColor: "#007AFF",
    backgroundColor: "#1a2332",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  conversationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  conversationTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  favoriteIcon: {
    marginLeft: 6,
  },
  conversationDate: {
    color: "#888",
    fontSize: 11,
  },
  conversationMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationModel: {
    color: "#666",
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  messageCount: {
    color: "#666",
    fontSize: 11,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
});

export default styles;
