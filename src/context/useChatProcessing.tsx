import { createContext, useRef } from "react";

interface ChatProcessingContextType {
  receiverProcessedRef: React.MutableRefObject<boolean>;
  initialSetupDoneRef: React.MutableRefObject<boolean>;
}

export const ChatProcessingContext = createContext<ChatProcessingContextType | undefined>(undefined);

export const ChatProcessingProvider = ({ children }: { children: React.ReactNode }) => {
  const receiverProcessedRef = useRef(false);
  const initialSetupDoneRef = useRef(false);

  return (
    <ChatProcessingContext.Provider value={{ receiverProcessedRef, initialSetupDoneRef }}>
      {children}
    </ChatProcessingContext.Provider>
  );
};

import { useContext } from "react";

export const useChatProcessing = () => {
  const context = useContext(ChatProcessingContext);
  if (!context) {
    throw new Error("useChatProcessing must be used within a ChatProcessingProvider");
  }
  return context;
};
