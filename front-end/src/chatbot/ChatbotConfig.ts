import { createChatBotMessage } from "react-chatbot-kit";
import ChatbotActionProvider from "./ChatbotActionProvider";

const config = {
  botName: "QuickNodeBot",
  initialMessages: [
    createChatBotMessage(`Hello! How can I assist you today?`, {}),
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#5A8DEE" },
    chatButton: { backgroundColor: "#5A8DEE" },
  },
  customComponents: {},
  state: {},
  widgets: [],
  actionProvider: ChatbotActionProvider,
};

export default config;
