import * as SQLite from "expo-sqlite";
import { Message } from "../services";

// Types
export interface Conversation {
  id: number;
  title: string;
  model_id: string;
  created_at: string;
  updated_at: string;
  is_favorite: number;
  message_count: number;
}

export interface ConversationMessage {
  id: number;
  conversation_id: number;
  role: string;
  content: string;
  timestamp: string;
  created_at: string;
}

// Save a new conversation
export const saveConversation = async (
  db: SQLite.SQLiteDatabase,
  title: string,
  modelId: string,
  messages: Message[]
): Promise<number> => {
  const result = await db.runAsync(
    `INSERT INTO conversations (title, model_id, message_count) VALUES (?, ?, ?)`,
    [title, modelId, messages.length]
  );

  const conversationId = result.lastInsertRowId;

  // Save all messages
  for (const message of messages) {
    await db.runAsync(
      `INSERT INTO conversation_messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)`,
      [conversationId, message.role, message.content, message.timestamp]
    );
  }

  return conversationId;
};

// Update an existing conversation
export const updateConversation = async (
  db: SQLite.SQLiteDatabase,
  conversationId: number,
  title?: string,
  messages?: Message[]
): Promise<void> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (title) {
    updates.push("title = ?");
    values.push(title);
  }

  if (messages) {
    updates.push("message_count = ?", "updated_at = CURRENT_TIMESTAMP");
    values.push(messages.length);

    // Clear existing messages and add new ones
    await db.runAsync(
      `DELETE FROM conversation_messages WHERE conversation_id = ?`,
      [conversationId]
    );

    for (const message of messages) {
      await db.runAsync(
        `INSERT INTO conversation_messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)`,
        [conversationId, message.role, message.content, message.timestamp]
      );
    }
  }

  if (updates.length > 0) {
    values.push(conversationId);
    await db.runAsync(
      `UPDATE conversations SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }
};

// Get all conversations
export const getConversations = async (
  db: SQLite.SQLiteDatabase,
  limit: number = 50,
  offset: number = 0
): Promise<Conversation[]> => {
  const result = await db.getAllAsync(
    `SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return result as Conversation[];
};

// Get a specific conversation with messages
export const getConversationWithMessages = async (
  db: SQLite.SQLiteDatabase,
  conversationId: number
): Promise<{ conversation: Conversation; messages: Message[] } | null> => {
  const conversationResult = await db.getFirstAsync(
    `SELECT * FROM conversations WHERE id = ?`,
    [conversationId]
  );

  if (!conversationResult) return null;

  const messagesResult = await db.getAllAsync(
    `SELECT role, content, timestamp FROM conversation_messages WHERE conversation_id = ? ORDER BY created_at ASC`,
    [conversationId]
  );

  return {
    conversation: conversationResult as Conversation,
    messages: messagesResult as Message[],
  };
};

// Delete a conversation
export const deleteConversation = async (
  db: SQLite.SQLiteDatabase,
  conversationId: number
): Promise<void> => {
  await db.runAsync(`DELETE FROM conversations WHERE id = ?`, [conversationId]);
  await db.runAsync(
    "DELETE FROM conversation_messages WHERE conversation_id = ?",
    [conversationId]
  );
};

// Search conversations
export const searchConversations = async (
  db: SQLite.SQLiteDatabase,
  query: string,
  limit: number = 20
): Promise<Conversation[]> => {
  const result = await db.getAllAsync(
    `SELECT DISTINCT c.* FROM conversations c
     LEFT JOIN conversation_messages cm ON c.id = cm.conversation_id
     WHERE c.title LIKE ? OR cm.content LIKE ?
     ORDER BY c.updated_at DESC
     LIMIT ?`,
    [`%${query}%`, `%${query}%`, limit]
  );
  return result as Conversation[];
};

// Toggle favorite status
export const toggleConversationFavorite = async (
  db: SQLite.SQLiteDatabase,
  conversationId: number
): Promise<void> => {
  await db.runAsync(
    `UPDATE conversations SET is_favorite = NOT is_favorite, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [conversationId]
  );
};

// Get favorite conversations
export const getFavoriteConversations = async (
  db: SQLite.SQLiteDatabase
): Promise<Conversation[]> => {
  const result = await db.getAllAsync(
    `SELECT * FROM conversations WHERE is_favorite = 1 ORDER BY updated_at DESC`
  );
  return result as Conversation[];
};

// Generate conversation title from messages
export const generateConversationTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((msg) => msg.role === "user");
  if (!firstUserMessage) return "New Conversation";
  const content = firstUserMessage.content.trim();
  if (content.length <= 50) return content;
  return content.substring(0, 50) + "...";
};

// Auto-save conversation (for use in context)
export const autoSaveConversation = async (
  db: SQLite.SQLiteDatabase,
  currentConversationId: number | null,
  messages: Message[],
  modelId: string
): Promise<number> => {
  if (messages.length === 0) return currentConversationId || 0;

  const title = generateConversationTitle(messages);

  if (currentConversationId) {
    // Update existing conversation
    await updateConversation(db, currentConversationId, title, messages);
    return currentConversationId;
  } else {
    // Create new conversation
    return await saveConversation(db, title, modelId, messages);
  }
};

// Get conversation statistics
export const getConversationStats = async (
  db: SQLite.SQLiteDatabase
): Promise<{
  totalConversations: number;
  totalMessages: number;
  favoriteConversations: number;
  modelsUsed: string[];
}> => {
  const totalConversationsResult = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM conversations`
  );

  const totalMessagesResult = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM conversation_messages`
  );

  const favoriteConversationsResult = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM conversations WHERE is_favorite = 1`
  );

  const modelsUsedResult = await db.getAllAsync(
    `SELECT DISTINCT model_id FROM conversations ORDER BY model_id`
  );

  return {
    totalConversations: (totalConversationsResult as any)?.count || 0,
    totalMessages: (totalMessagesResult as any)?.count || 0,
    favoriteConversations: (favoriteConversationsResult as any)?.count || 0,
    modelsUsed: modelsUsedResult.map((row: any) => row.model_id),
  };
};
