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
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

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
       const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 20;
       
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
    <div className="flex items-center justify-center w-full max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {currentSubtitle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl"
          >
            {/* Glassmorphic Subtitle Container */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Main subtitle box */}
              <div className="relative rounded-2xl border border-white/20 bg-transparent backdrop-blur-sm shadow-lg">
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                {/* Subtitle text container */}
                <div className="relative px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className={`
                      text-white text-center text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed tracking-wide drop-shadow-lg
                      ${isScrollable 
                        ? 'max-h-40 overflow-y-auto subtitle-scrollbar' 
                        : 'max-h-none'
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
                         <div className="absolute top-4 left-0 right-0 h-3 bg-gradient-to-b from-gray-900/60 to-transparent pointer-events-none z-10" />
                         {/* Bottom fade indicator */}
                         <div className="absolute bottom-4 left-0 right-0 h-3 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none z-10" />
                         {/* Scroll hint with better positioning */}
                         <div className="absolute bottom-1 right-3 text-xs text-cyan-400/70 animate-pulse font-mono">
                           {isManualScrolling ? '⏸' : '↕'}
                         </div>
                         {/* Content length indicator */}
                         <div className="absolute top-1 left-3 text-xs text-cyan-400/50 font-mono">
                           {Math.ceil(currentSubtitle.length / 50)} lines
                         </div>
                       </>
                     )}
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
