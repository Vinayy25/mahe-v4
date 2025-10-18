"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { useMessageHistory, MessageSender } from "../logic";

export const Subtitles: React.FC = () => {
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
    <AnimatePresence mode="wait">
      {currentSubtitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-4xl w-full px-4"
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
              <div className="px-8 py-5">
                <p className="text-white text-center text-lg md:text-xl font-medium leading-relaxed tracking-wide drop-shadow-lg">
                  {currentSubtitle}
                </p>
              </div>

              {/* Bottom accent corners */}
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-cyan-400/40 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-purple-400/40 rounded-br-lg" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};