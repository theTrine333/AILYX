import {
  BatchSuperAddModels,
  FilterModelsByType,
  GetModelTypes,
  GetRecentlyUsedModels,
  GetSuggestedModels,
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

interface AIContextType {
  models: Model[];
  recentlyUsed: Model[];
  suggested: Model[];
  categories: string[];
  searchWord: string;
  setSearchWord: (word: string) => void;
  handleSearch: () => Promise<void>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setCategories: (categories: string[]) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  chatMessages: Message[];
  searchResults: Model[];
  setSearchResults: (models: Model[]) => void;
  filterModelType: () => Promise<void>;
  state: null | "filter-type-loading" | "filter-type-error";
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
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

  useEffect(() => {
    setChatMessages([]);
  }, [selectedModel]);
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
        const data = await fetchModels();
        setModels(data);
        await BatchSuperAddModels({ db, models: data });

        const recent = await GetRecentlyUsedModels(db);
        setRecentlyUsed(recent);

        const suggestions = await GetSuggestedModels(
          db,
          "chat-completion",
          recent.map((m) => m.id)
        );
        setSuggested(suggestions);

        const types = await GetModelTypes(db);
        setCategoriesState(types);
        setSelectedModel(
          recent[recent.length - 1].id || "google/gemma-3-27b-it"
        );
        setSelectedCategoryState("All");
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
          max_token: 4096,
          stream: true,
        }),
      });

      if (!response.body) throw new Error("Streaming not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let finalText = "";

      // Append a new assistant message first
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleString(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");

            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;

              if (delta) {
                finalText += delta;

                // Update last assistant message in the array
                setChatMessages((prev) => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: finalText,
                  };
                  return updated;
                });
              }
            } catch (err) {
              console.error("Failed to parse stream chunk:", err);
            }
          }
        }
      }

      await MarkModelAsUsed(db, selectedModel);
    } catch (error: any) {
      console.error("Stream error:", error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        models,
        recentlyUsed,
        suggested,
        handleSearch,
        searchWord,
        setSearchWord,
        searchResults,
        setSearchResults,
        categories,
        setCategories: setCategoriesState,
        selectedCategory,
        setSelectedCategory: setSelectedCategoryState,
        selectedModel,
        setSelectedModel,
        chatMessages,
        state,
        sendMessage,
        isLoading,
        filterModelType,
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
