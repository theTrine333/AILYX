import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AIModel, Client, fetchModels, Message } from "../services";

interface AIContextType {
  models: AIModel[];
  selectedModel: string | null;
  setSelectedModel: (model: string) => void;
  chatMessages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchModels();
        setModels(data);
        // setSelectedModel(data[0]?.info?.name ?? null);
        setSelectedModel("meta-llama/Llama-Vision-Free");
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    loadModels();
  }, []);

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
      const response = await Client.chat.completions.create({
        model: selectedModel,
        messages: updated,
      });
      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0].message.content || "An error occured",
        timestamp: new Date().toLocaleString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        models,
        selectedModel,
        setSelectedModel,
        chatMessages,
        sendMessage,
        isLoading,
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
