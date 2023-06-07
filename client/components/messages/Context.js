/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import Message from './Message';

const MessageContext = createContext();

export function MessageWrapper({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((newMessage) => {
    const maxAgeMs = 20 * 1000; // 20 seconds
    const now = new Date();

    messages.push({
      date: now,
      ...newMessage,
    });
    const newMessages = messages.filter(
      (message) => now - message.date < maxAgeMs,
    );
    setMessages(newMessages);
  }, []);

  const close = (id) => {
    const newMessages = messages.filter((m) => m.id !== id);
    setMessages(newMessages);
  };

  const log = useCallback(
    (text, type = 'message') => {
      const genMessageId = () => {
        const num = Math.floor(Math.random() * 10000);
        return `message-${num}`;
      };
      const id = genMessageId();
      const message = {
        id,
        text: text.toString(),
        type,
      };
      addMessage(message);
    },
    [addMessage],
  );

  const contextValue = useMemo(() => {
    log.error = (text) => log(text, 'error');
    log.warn = (text) => log(text, 'warning');
    log.success = (text) => log(text, 'success');
    return log;
  }, [log]);

  return (
    <MessageContext.Provider value={contextValue}>
      <div className="container mx-auto">
        {messages.map((m) => (
          <Message key={m.id} {...m} onClick={() => close(m.id)} />
        ))}
      </div>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
