export type Message = {
  sender: "user" | "ai";
  content: string;
  timestamp: string;
};
