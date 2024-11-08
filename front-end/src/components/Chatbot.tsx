// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { Message } from "../components/types";
// import Cerebras from "@cerebras/cerebras_cloud_sdk";
// import "../index.css";
// import ChatbotIcon from "../assets/chatbot.jpg"; // Make sure to replace with your actual icon path

// const ChatbotComponent = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     { text: "Hello! How can I assist you today?", isBot: true },
//   ]);
//   const [input, setInput] = useState("");
//   const [isOpen, setIsOpen] = useState(false); // Track if chatbot is open
//   const location = useLocation(); // Get current route
//   const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for scrolling

//   const client = new Cerebras({
//     apiKey: import.meta.env.VITE_CEREBRAS_API_KEY,
//   });

//   useEffect(() => {
//     // Close chatbot whenever route changes
//     setIsOpen(false);
//   }, [location]);

//   useEffect(() => {
//     // Scroll to the bottom of the messages when new messages are added
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]); // Dependency array includes messages

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { text: input, isBot: false };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput("");

//     try {
//       const completionCreateResponse = await client.chat.completions.create({
//         messages: [{ role: "user", content: input }],
//         model: "llama3.1-8b",
//       });

//       const botResponseText =
//         completionCreateResponse.choices[0]?.message?.content ||
//         "Sorry, I didn't understand that.";

//       const botMessage: Message = { text: botResponseText, isBot: true };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error:", error);
//       const errorMessage: Message = {
//         text: "Sorry, I encountered an error. Please try again.",
//         isBot: true,
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     }
//   };

//   const renderMessage = (msg: Message) => {
//     // Replace **text** with <strong>text</strong> for bold styling
//     const formattedText = msg.text.replace(
//       /\*\*(.*?)\*\*/g,
//       "<strong>$1</strong>"
//     );

//     return (
//       <div
//         className={`chatbot-message ${
//           msg.isBot ? "chatbot-bot-message" : "chatbot-user-message"
//         }`}
//         dangerouslySetInnerHTML={{ __html: formattedText }} // Use dangerouslySetInnerHTML to render HTML
//       />
//     );
//   };

//   return (
//     <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
//       {!isOpen ? (
//         // Render chatbot icon when closed
//         <button className="chatbot-icon-button" onClick={() => setIsOpen(true)}>
//           <img src={ChatbotIcon} alt="Chatbot Icon" className="chatbot-icon" />
//         </button>
//       ) : (
//         // Render full chatbot when open
//         <div className="chatbot-content">
//           <div className="chatbot-header">
//             <span>Chatbot</span>
//             <button
//               className="chatbot-toggle-button"
//               onClick={() => setIsOpen(false)}
//             >
//               ×
//             </button>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((msg, index) => (
//               <div key={index}>{renderMessage(msg)}</div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//           <form
//             className="chatbot-input-container"
//             onSubmit={handleSendMessage}
//           >
//             <input
//               className="chatbot-input"
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Write your message here"
//             />
//             <button className="chatbot-send-button" type="submit">
//               ➤
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatbotComponent;

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { Message } from "../components/types";
// import Cerebras from "@cerebras/cerebras_cloud_sdk";
// import "../index.css";
// import ChatbotIcon from "../assets/chatbot.jpg";

// const ChatbotComponent = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     { text: "Hello! How can I assist you today?", isBot: true },
//   ]);
//   const [input, setInput] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const client = new Cerebras({
//     apiKey: import.meta.env.VITE_CEREBRAS_API_KEY,
//   });

//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { text: input, isBot: false };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput("");

//     try {
//       const completionCreateResponse = await client.chat.completions.create({
//         messages: [{ role: "user", content: input }],
//         model: "llama3.1-8b",
//       });

//       const botResponseText =
//         completionCreateResponse.choices[0]?.message?.content ||
//         "Sorry, I didn't understand that.";

//       const botMessage: Message = { text: botResponseText, isBot: true };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error:", error);
//       const errorMessage: Message = {
//         text: "Sorry, I encountered an error. Please try again.",
//         isBot: true,
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     }
//   };

//   const renderMessage = (msg: Message) => {
//     const formattedText = msg.text.replace(
//       /\*\*(.*?)\*\*/g,
//       "<strong>$1</strong>"
//     );

//     return (
//       <div
//         className={`chatbot-message ${
//           msg.isBot ? "chatbot-bot-message" : "chatbot-user-message"
//         }`}
//         dangerouslySetInnerHTML={{ __html: formattedText }}
//       />
//     );
//   };

//   return (
//     <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
//       {!isOpen ? (
//         <button className="chatbot-icon-button" onClick={() => setIsOpen(true)}>
//           <img src={ChatbotIcon} alt="Chatbot Icon" className="chatbot-icon" />
//         </button>
//       ) : (
//         <div className="chatbot-content">
//           <div className="chatbot-header">
//             <span>Chatbot</span>
//             <button
//               className="chatbot-close-button"
//               onClick={() => setIsOpen(false)}
//             >
//               ×
//             </button>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((msg, index) => (
//               <div key={index}>{renderMessage(msg)}</div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//           <form
//             className="chatbot-input-container"
//             onSubmit={handleSendMessage}
//           >
//             <input
//               className="chatbot-input"
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Write your message here"
//             />
//             <button className="chatbot-send-button" type="submit">
//               ➤
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatbotComponent;

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Message } from "../components/types";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import "../index.css";
import ChatbotIcon from "../assets/chatbot.jpg"; // Replace with actual icon path

const ChatbotComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const client = new Cerebras({
    apiKey: import.meta.env.VITE_CEREBRAS_API_KEY,
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatMessage = (text: string) => {
    // Convert key sections into paragraphs and lists
    const paragraphs = text.split(/(?=\d\.)|(?=NFTs can)/); // Splits on numbered or specific sections
    const formattedText = paragraphs
      .map((paragraph) => {
        // If it's a list item, format with <li>
        if (/^\d+\./.test(paragraph)) {
          return `<li>${paragraph.trim()}</li>`;
        }
        // Otherwise, wrap with <p> for paragraph
        return `<p>${paragraph.trim()}</p>`;
      })
      .join(""); // Join formatted sections

    return formattedText;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const completionCreateResponse = await client.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama3.1-8b",
      });

      const botResponseText =
        completionCreateResponse.choices[0]?.message?.content ||
        "Sorry, I didn't understand that.";

      const formattedBotText = formatMessage(botResponseText);

      const botMessage: Message = {
        text: formattedBotText,
        isBot: true,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const renderMessage = (msg: Message) => (
    <div
      className={`chatbot-message ${
        msg.isBot ? "chatbot-bot-message" : "chatbot-user-message"
      }`}
      dangerouslySetInnerHTML={{ __html: msg.text }}
    />
  );

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {!isOpen ? (
        <button className="chatbot-icon-button" onClick={() => setIsOpen(true)}>
          <img src={ChatbotIcon} alt="Chatbot Icon" className="chatbot-icon" />
        </button>
      ) : (
        <div className="chatbot-content">
          <div className="chatbot-header">
            <span>Chatbot</span>
            <button
              className="chatbot-toggle-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index}>{renderMessage(msg)}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            className="chatbot-input-container"
            onSubmit={handleSendMessage}
          >
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your message here"
            />
            <button className="chatbot-send-button" type="submit">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
