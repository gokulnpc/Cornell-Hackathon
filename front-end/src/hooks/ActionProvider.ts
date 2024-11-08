// import Cerebras from "@cerebras/cerebras_cloud_sdk";
// import ActionProviderProps from "react-chatbot-kit";

// const client = new Cerebras({
//   apiKey: process.env.REACT_APP_CEREBRAS_API_KEY!,
// });

// class ActionProvider {
//   createChatBotMessage: ActionProviderProps["createChatBotMessage"];
//   setState: ActionProviderProps["setState"];

//   constructor(
//     createChatBotMessage: ActionProviderProps["createChatBotMessage"],
//     setState: ActionProviderProps["setState"]
//   ) {
//     this.createChatBotMessage = createChatBotMessage;
//     this.setState = setState;
//   }

//   async handleUserMessage(message: string) {
//     try {
//       const response = await client.chat.completions.create({
//         messages: [{ role: "user", content: message }],
//         model: "llama3.1-8b",
//       });

//       const botMessage = response.choices[0].message.content;
//       this.addMessageToBotState(botMessage);
//     } catch (error) {
//       console.error("Error fetching response from Cerebras API:", error);
//       this.addMessageToBotState(
//         "Oops! Something went wrong. Please try again."
//       );
//     }
//   }

//   addMessageToBotState = (message: string) => {
//     const botMessage = this.createChatBotMessage(message);
//     this.setState((prev: any) => ({
//       ...prev,
//       messages: [...prev.messages, botMessage],
//     }));
//   };
// }

// export default ActionProvider;
