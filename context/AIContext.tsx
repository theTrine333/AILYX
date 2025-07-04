import {
  FilterModelsByType,
  GetModelTypes,
  GetRecentlyUsedModels,
  MarkModelAsUsed,
  SearchModels,
} from "@/api/db";
import { Model } from "@/api/db.types";
import { AIML_API_KEY, BASE_URL } from "@/config";
import * as SQLite from "expo-sqlite";
import { fetch as expoFetch } from "expo/fetch";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchModels, Message } from "../services";
import {
  autoSaveConversation,
  Conversation,
  deleteConversation,
  getConversations,
  getConversationStats,
  getConversationWithMessages,
  getFavoriteConversations,
  searchConversations,
  toggleConversationFavorite,
} from "./conversationUtils"; // Import the functions we created above

interface AIContextType {
  models: Model[];
  recentlyUsed: Model[];
  suggested: Model[];
  categories: string[];
  searchWord: string;
  searchResults: Model[];
  selectedCategory: string;
  selectedModel: string;
  chatMessages: Message[];
  state: null | "filter-type-loading" | "filter-type-error";
  isLoading: boolean;

  // Conversation state
  currentConversationId: number | null;
  conversations: Conversation[];
  conversationStats: {
    totalConversations: number;
    totalMessages: number;
    favoriteConversations: number;
    modelsUsed: string[];
  };

  // All setters
  setModels: (models: Model[]) => void;
  setRecentlyUsed: (models: Model[]) => void;
  setSuggested: (models: Model[]) => void;
  setCategories: (categories: string[]) => void;
  setSearchWord: (word: string) => void;
  setSearchResults: (models: Model[]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedModel: (model: string) => void;
  setChatMessages: (messages: Message[]) => void;
  setState: (state: null | "filter-type-loading" | "filter-type-error") => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentConversationId: (id: number | null) => void;
  setConversations: (conversations: Conversation[]) => void;

  // Methods
  handleSearch: () => Promise<void>;
  filterModelType: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;

  // Conversation methods
  saveCurrentConversation: () => Promise<void>;
  loadConversation: (conversationId: number) => Promise<void>;
  deleteConversation: (conversationId: number) => Promise<void>;
  newConversation: () => void;
  loadConversations: () => Promise<void>;
  searchConversations: (query: string) => Promise<Conversation[]>;
  toggleConversationFavorite: (conversationId: number) => Promise<void>;
  getFavoriteConversations: () => Promise<Conversation[]>;
  loadConversationStats: () => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<Model[]>([]);
  const [suggested, setSuggested] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategoriesState] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategoryState] = useState<string>("All");
  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Model[]>([]);
  const [state, setState] = useState<
    "filter-type-loading" | "filter-type-error" | null
  >(null);

  // Conversation state
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationStats, setConversationStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    favoriteConversations: 0,
    modelsUsed: [],
  });

  const db = SQLite.useSQLiteContext();

  const handleSearch = async () => {
    if (!searchWord.trim()) {
      setState(null);
      return;
    }
    setState("filter-type-loading");
    const res = await SearchModels(db, searchWord);
    setSearchResults(res);
    setTimeout(() => {
      setState(null);
    }, 1500);
  };

  // Auto-save conversation when messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      const saveTimeout = setTimeout(async () => {
        try {
          const conversationId = await autoSaveConversation(
            db,
            currentConversationId,
            chatMessages,
            selectedModel
          );
          if (!currentConversationId) {
            setCurrentConversationId(conversationId);
          }
          await loadConversations();
          await loadConversationStats();
        } catch (error) {
          console.error("Failed to auto-save conversation:", error);
        }
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(saveTimeout);
    }
  }, [chatMessages, selectedModel, currentConversationId]);

  useEffect(() => {
    if (!searchWord.trim()) {
      setSearchResults([]);
    } else {
      handleSearch();
    }
  }, [searchWord]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const recent = await GetRecentlyUsedModels(db);
        setRecentlyUsed(recent);
        setSelectedModel(
          recent[recent.length - 1]?.id || "google/gemma-3-27b-it"
        );
        const types = await GetModelTypes(db);
        setCategoriesState(types);
        setSelectedCategoryState("All");
        await loadConversations();
        await loadConversationStats();
      } catch (error) {
        console.error("Failed to load models:", error);
      }
    };

    loadModels();
  }, []);

  const filterModelType = async () => {
    try {
      setState("filter-type-loading");
      const res = await FilterModelsByType(db, selectedCategory.toLowerCase());
      setModels(res);
    } catch (error) {
      setState("filter-type-error");
      console.error("Failed to filter models by type:", error);
    } finally {
      setTimeout(() => setState(null), 1500);
    }
  };

  useEffect(() => {
    const sorter = async () => {
      if (selectedCategory === "All") {
        setState("filter-type-loading");
        const data = await fetchModels();
        setModels(data);
        setTimeout(() => {
          setState(null);
        }, 1500);
      } else {
        await filterModelType();
      }
    };
    sorter();
  }, [selectedCategory]);

  const sendMessage = async (text: string) => {
    if (!selectedModel) return;

    const newMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleString(),
    };

    const updated = [...chatMessages, newMessage];
    setChatMessages(updated);
    setIsLoading(true);

    try {
      const response = await expoFetch(`${BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIML_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: updated,
          top_k: 50,
          top_p: 0.9,
          temperature: 0.7,
          max_tokens: 4096,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) throw new Error("Streaming not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let finalText = "";

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleString(),
        },
      ]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "").trim();

              if (data === "[DONE]") {
                return;
              }

              if (data === "") continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;

                if (delta) {
                  finalText += delta;

                  setChatMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex >= 0) {
                      updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: finalText,
                      };
                    }
                    return updated;
                  });
                }
              } catch (parseErr) {
                console.error("Failed to parse stream chunk:", parseErr);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      await MarkModelAsUsed(db, selectedModel);
    } catch (error: any) {
      console.error("Stream error:", error?.response?.data || error.message);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error while processing your message. Please try again.",
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Conversation methods
  const saveCurrentConversation = async () => {
    if (chatMessages.length === 0) return;

    try {
      const conversationId = await autoSaveConversation(
        db,
        currentConversationId,
        chatMessages,
        selectedModel
      );
      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
      }
      await loadConversations();
      await loadConversationStats();
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  };

  const loadConversation = async (conversationId: number) => {
    try {
      const result = await getConversationWithMessages(db, conversationId);
      if (result) {
        setChatMessages(result.messages);
        setCurrentConversationId(conversationId);
        setSelectedModel(result.conversation.model_id);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const deleteConversationHandler = async (conversationId: number) => {
    try {
      await deleteConversation(db, conversationId);
      if (currentConversationId === conversationId) {
        newConversation();
      }
      await loadConversations();
      await loadConversationStats();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const newConversation = () => {
    setChatMessages([]);
    setCurrentConversationId(null);
  };

  const loadConversations = async () => {
    try {
      const conversations = await getConversations(db);
      setConversations(conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const searchConversationsHandler = async (
    query: string
  ): Promise<Conversation[]> => {
    try {
      return await searchConversations(db, query);
    } catch (error) {
      console.error("Failed to search conversations:", error);
      return [];
    }
  };

  const toggleConversationFavoriteHandler = async (conversationId: number) => {
    try {
      await toggleConversationFavorite(db, conversationId);
      await loadConversations();
      await loadConversationStats();
    } catch (error) {
      console.error("Failed to toggle conversation favorite:", error);
    }
  };

  const getFavoriteConversationsHandler = async (): Promise<Conversation[]> => {
    try {
      return await getFavoriteConversations(db);
    } catch (error) {
      console.error("Failed to get favorite conversations:", error);
      return [];
    }
  };

  const loadConversationStats = async () => {
    try {
      const stats: any = await getConversationStats(db);
      setConversationStats(stats);
    } catch (error) {
      console.error("Failed to load conversation stats:", error);
    }
  };

  return (
    <AIContext.Provider
      value={{
        // State values
        models,
        recentlyUsed,
        suggested,
        categories,
        searchWord,
        searchResults,
        selectedCategory,
        selectedModel,
        chatMessages,
        state,
        isLoading,
        currentConversationId,
        conversations,
        conversationStats,

        // All setters
        setModels,
        setRecentlyUsed,
        setSuggested,
        setCategories: setCategoriesState,
        setSearchWord,
        setSearchResults,
        setSelectedCategory: setSelectedCategoryState,
        setSelectedModel,
        setChatMessages,
        setState,
        setIsLoading,
        setCurrentConversationId,
        setConversations,

        // Methods
        handleSearch,
        filterModelType,
        sendMessage,

        // Conversation methods
        saveCurrentConversation,
        loadConversation,
        deleteConversation: deleteConversationHandler,
        newConversation,
        loadConversations,
        searchConversations: searchConversationsHandler,
        toggleConversationFavorite: toggleConversationFavoriteHandler,
        getFavoriteConversations: getFavoriteConversationsHandler,
        loadConversationStats,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
