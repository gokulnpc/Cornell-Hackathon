// Define the properties for MessageParserProps based on your needs
interface MessageParserProps {
  actionProvider: {
    handleMessage: (message: string) => void;
  };
}

class MessageParser {
  actionProvider: MessageParserProps["actionProvider"];

  constructor(actionProvider: MessageParserProps["actionProvider"]) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    if (message.trim().length > 0) {
      this.actionProvider.handleMessage(message);
    }
  }
}

export default MessageParser;
