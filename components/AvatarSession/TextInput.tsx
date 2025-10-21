import React, { useCallback, useEffect, useState } from "react";
import { usePrevious } from "ahooks";

import { Button } from "../Button";
import { SendIcon } from "../Icons";
import { useTextChat } from "../logic/useTextChat";
import { Input } from "../Input";
import { useConversationState } from "../logic/useConversationState";

export const TextInput: React.FC = () => {
  const { sendMessage } = useTextChat();
  const { startListening, stopListening } = useConversationState();
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    if (message.trim() === "") {
      return;
    }
    sendMessage(message);
    setMessage("");
  }, [message, sendMessage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSend]);

  const previousText = usePrevious(message);

  useEffect(() => {
    if (!previousText && message) {
      startListening();
    } else if (previousText && !message) {
      stopListening();
    }
  }, [message, previousText, startListening, stopListening]);

  return (
    <div className="flex flex-row gap-2 sm:gap-3 items-center w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
      <Input
        className="flex-1 !bg-white/10 !border-white/20 !backdrop-blur-xl !text-white placeholder:!text-white/50 !rounded-lg sm:!rounded-xl !shadow-2xl focus:!border-white/30 transition-all !text-xs sm:!text-sm !px-2 sm:!px-3 md:!px-4 !py-2 sm:!py-2.5 md:!py-3"
        placeholder="Type your message here..."
        value={message}
        onChange={(value: string) => setMessage(value)}
      />
      <Button
        className="!bg-white/10 !text-white !border !border-white/20 !backdrop-blur-xl !shadow-2xl hover:!bg-white/20 transition-all duration-200 !rounded-lg sm:!rounded-xl !px-2 sm:!px-3 md:!px-4 !py-2 sm:!py-2.5 md:!py-3"
        onClick={handleSend}
      >
        <SendIcon className="w-3 sm:w-4 h-3 sm:h-4" />
      </Button>
    </div>
  );
};
