import axios from "axios";
import { OpenAI } from "openai";
import { AIML_API_KEY, BASE_URL } from "../config";
export const headers = {
  Authorization: `Bearer ${AIML_API_KEY}`,
};

export const Client = new OpenAI({ apiKey: AIML_API_KEY, baseURL: BASE_URL });

export interface AIModel {
  id: string;
  object: string;
  owned_by?: string;
  info?: {
    name?: string;
    developer?: string;
    description?: string;
    contextLength?: number | string;
    url?: string;
  };
  features?: string[];
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export const fetchModels = async (): Promise<AIModel[]> => {
  const res = (await axios.get(`${BASE_URL}/models`, { headers })).data;
  return res.data;
};

export const sendChat = async (
  messages: Message[],
  model: string
): Promise<{ choices: { message: Message }[] }> => {
  const res = await axios.post(
    `${BASE_URL}/v1/chat`,
    { model, messages },
    { headers }
  );
  return res.data;
};
