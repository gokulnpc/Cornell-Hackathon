import axios from "axios";

interface Message {
  text: string;
  type: "user" | "bot";
}

class ActionProvider {
  setState: (
    stateFunction: (prevState: { messages: Message[] }) => any
  ) => void;

  constructor(
    setState: (
      stateFunction: (prevState: { messages: Message[] }) => any
    ) => void
  ) {
    this.setState = setState;
  }

  async handleMessage(message: string) {
    // Update state to include user's message
    this.setState((prevState) => ({
      messages: [...prevState.messages, { text: message, type: "user" }],
    }));

    try {
      const response = await axios.post(
        "https://api.cerebras.net/v1/chat/completions", // Correct endpoint
        {
          messages: [{ role: "user", content: message }], // Message format
          model: "llama3.1-8b", // Specify the model being used
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_CEREBRAS_API_KEY}`, // Correct environment variable for API key
          },
        }
      );

      // Extract the bot response from the response structure
      const botResponse: string =
        response.data.choices[0]?.message?.content ||
        "Sorry, I didn't get that.";

      // Update state with the bot's response
      this.setState((prevState) => ({
        messages: [...prevState.messages, { text: botResponse, type: "bot" }],
      }));
    } catch (error) {
      console.error("Cerebras API error:", error);
      // Handle error response by updating state
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          {
            text: "Sorry, there was an error processing your request.",
            type: "bot",
          },
        ],
      }));
    }
  }
}

export default ActionProvider;
