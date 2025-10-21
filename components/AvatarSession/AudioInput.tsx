import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import { LoadingIcon } from "../Icons";
import { useConversationState } from "../logic/useConversationState";
import { useVoiceChat } from "../logic/useVoiceChat";
import { useMessageHistory, MessageSender } from "../logic";
import "../../styles/scrollbar.css";

export const AudioInput: React.FC = () => {
  const { isVoiceChatLoading } = useVoiceChat();
  const { isUserTalking } = useConversationState();
  const { messages } = useMessageHistory();
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Threshold for when scrolling should activate (characters)
  const SCROLL_THRESHOLD = 200;
  const MAX_LINES = 4;

  useEffect(() => {
    // Get the most recent avatar message
    const avatarMessages = messages.filter(
      (msg) => msg.sender === MessageSender.AVATAR
    );
    const lastMessage = avatarMessages[avatarMessages.length - 1];

    if (lastMessage) {
      setCurrentSubtitle(lastMessage.content);
      // Check if content exceeds threshold
      setIsScrollable(lastMessage.content.length > SCROLL_THRESHOLD);
    } else {
      setCurrentSubtitle("");
      setIsScrollable(false);
    }
  }, [messages]);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (scrollContainerRef.current && isScrollable) {
      const container = scrollContainerRef.current;
      // Slower scroll to bottom with increased delay for better readability
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 150);
    }
  }, [currentSubtitle, isScrollable]);

  // Handle manual scrolling - pause auto-scroll temporarily
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (!isScrollable) return;

    setIsManualScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Resume auto-scroll after 3 seconds of no manual scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 3000);
  };

  // Enhanced auto-scroll that respects manual scrolling
  useEffect(() => {
    if (scrollContainerRef.current && isScrollable && !isManualScrolling) {
      const container = scrollContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        20;

      // Only auto-scroll if user is near the bottom or if it's new content
      if (isNearBottom || currentSubtitle) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 200); // Increased delay for smoother experience
      }
    }
  }, [currentSubtitle, isScrollable, isManualScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full relative">
      <AnimatePresence mode="wait">
        {currentSubtitle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-2 md:px-4"
          >
            {/* Glassmorphic Subtitle Container */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-lg sm:rounded-xl md:rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Main subtitle box */}
              <div className="relative rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-transparent backdrop-blur-sm shadow-lg">
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                {/* Subtitle text container */}
                <div className="relative px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6">
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className={`
                      text-white text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium leading-relaxed tracking-wide drop-shadow-lg
                      ${
                        isScrollable
                          ? "max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto subtitle-scrollbar"
                          : "max-h-none"
                      }
                      scroll-smooth transition-all duration-300
                    `}
                  >
                    {currentSubtitle}
                  </div>

                  {/* Scroll indicators */}
                  {isScrollable && (
                    <>
                      {/* Top fade indicator */}
                      <div className="absolute top-2 sm:top-3 md:top-4 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-gray-900/60 to-transparent pointer-events-none z-10" />
                      {/* Bottom fade indicator */}
                      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 h-2 sm:h-3 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none z-10" />
                      {/* Scroll hint with better positioning */}
                      <div className="absolute bottom-0.5 sm:bottom-1 right-1 sm:right-2 md:right-3 text-xs text-cyan-400/70 animate-pulse font-mono">
                        {isManualScrolling ? "⏸" : "↕"}
                      </div>
                      {/* Content length indicator */}
                      <div className="absolute top-0.5 sm:top-1 left-1 sm:left-2 md:left-3 text-xs text-cyan-400/50 font-mono">
                        {Math.ceil(currentSubtitle.length / 50)} lines
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6"
          >
            {/* Voice Activity Indicator - Simplified */}
            <div className="relative">
              {/* Main circle - reduced size */}
              <div
                className={`relative w-12 sm:w-14 md:w-16 lg:w-18 xl:w-20 h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 rounded-full border-2 transition-all duration-300 backdrop-blur-xl shadow-2xl ${
                  isUserTalking
                    ? "border-green-400/60 bg-green-400/10"
                    : "border-blue-400/40 bg-blue-400/5"
                } flex items-center justify-center`}
              >
                {/* Microphone Icon - smaller size */}
                <svg
                  className={`w-4 sm:w-5 md:w-6 lg:w-7 xl:w-8 h-4 sm:h-5 md:h-6 lg:h-7 xl:h-8 transition-all duration-300 ${
                    isUserTalking ? "text-green-400" : "text-blue-400/70"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center">
              <p className="text-white/90 font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                {isUserTalking ? "Listening..." : "Speak to continue"}
              </p>
              <p className="text-white/50 text-xs sm:text-sm">
                {isUserTalking
                  ? "I'm hearing you clearly"
                  : "Voice chat is active"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      {isVoiceChatLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
            <LoadingIcon />
            <p className="text-white/70 text-xs sm:text-sm">Initializing voice...</p>
          </div>
        </div>
      )}
    </div>
  );
};
