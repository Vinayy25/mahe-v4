import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { LoadingIcon, MicIcon, MicOffIcon } from "../Icons";
import { useConversationState } from "../logic/useConversationState";

export const AudioInput: React.FC = () => {
  const { muteInputAudio, unmuteInputAudio, isMuted, isVoiceChatLoading } =
    useVoiceChat();
  const { isUserTalking } = useConversationState();

  const handleMuteClick = () => {
    if (isMuted) {
      unmuteInputAudio();
    } else {
      muteInputAudio();
    }
  };

  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto">
      <Button
        className={`!p-4 relative !bg-white/10 !border !border-white/20 !backdrop-blur-xl !shadow-2xl !rounded-full hover:!bg-white/20 transition-all duration-200 ${isUserTalking ? "!border-cyan-400/60" : ""}`}
        disabled={isVoiceChatLoading}
        onClick={handleMuteClick}
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
        ) : isMuted ? (
          <MicOffIcon size={24} />
        ) : (
          <MicIcon size={24} />
        )}
      </Button>
    </div>
  );
};
