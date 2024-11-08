import { createChatBotMessage } from "react-chatbot-kit";

const chatbotConfig = {
  botName: "MarketPlace Assistant",
  initialMessages: [
    createChatBotMessage("Hi there! How can I assist you today?", {}),
  ],
};

export default chatbotConfig;
