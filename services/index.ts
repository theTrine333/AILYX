import { Model } from "@/api/db.types";
import axios from "axios";
import { OpenAI } from "openai";
import { AIML_API_KEY, BASE_URL } from "../config";
export const headers = {
  Authorization: `Bearer ${AIML_API_KEY}`,
};

export const Client = new OpenAI({ apiKey: AIML_API_KEY, baseURL: BASE_URL });
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  title?: string;
}

export const fetchModels = async (): Promise<Model[]> => {
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
