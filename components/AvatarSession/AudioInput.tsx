import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { LoadingIcon } from "../Icons";
import { useConversationState } from "../logic/useConversationState";
import { useVoiceChat } from "../logic/useVoiceChat";
import { useMessageHistory, MessageSender } from "../logic";

export const AudioInput: React.FC = () => {
  const { isVoiceChatLoading } = useVoiceChat();
  const { isUserTalking } = useConversationState();
  const { messages } = useMessageHistory();
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");

  useEffect(() => {
    // Get the most recent avatar message
    const avatarMessages = messages.filter(
      (msg) => msg.sender === MessageSender.AVATAR
    );
    const lastMessage = avatarMessages[avatarMessages.length - 1];

    if (lastMessage) {
      setCurrentSubtitle(lastMessage.content);
    } else {
      setCurrentSubtitle("");
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {currentSubtitle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            {/* Glassmorphic Subtitle Container */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Main subtitle box */}
              <div className="relative rounded-2xl border border-white/30 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-2xl shadow-2xl">
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                {/* Subtitle text */}
                <div className="px-6 py-4">
                  <p className="text-white text-center text-base md:text-lg font-medium leading-relaxed tracking-wide drop-shadow-lg">
                    {currentSubtitle}
                  </p>
                </div>

                {/* Bottom accent corners */}
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400/40 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-purple-400/40 rounded-br-lg" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <div
              className={`p-4 relative bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl rounded-full ${isUserTalking ? "border-cyan-400/60" : ""}`}
            >
              {/* Voice Activity Ring */}
              <div
                className={`absolute left-0 top-0 rounded-full border-2 w-full h-full transition-all duration-200 ${
                  isUserTalking
                    ? "border-cyan-400 animate-ping opacity-75"
                    : "border-transparent"
                }`}
              />
              {isVoiceChatLoading ? (
                <LoadingIcon className="animate-spin" size={24} />
              ) : (
                <div className="w-6 h-6 rounded-full bg-cyan-400" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
