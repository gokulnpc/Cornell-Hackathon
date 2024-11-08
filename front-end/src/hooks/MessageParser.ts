interface MessageParserProps {
  actionProvider: {
    handleUserMessage: (message: string) => void;
  };
}

class MessageParser {
  actionProvider: MessageParserProps["actionProvider"];

  constructor(actionProvider: MessageParserProps["actionProvider"]) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    this.actionProvider.handleUserMessage(message);
  }
}

export default MessageParser;
