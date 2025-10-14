import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";

import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";

export const AvatarControls: React.FC = () => {
  const {
    isVoiceChatLoading,
    isVoiceChatActive,
    startVoiceChat,
    stopVoiceChat,
  } = useVoiceChat();
  const { interrupt } = useInterrupt();

  return (
    <div className="flex flex-col gap-6 relative w-full items-center -mt-8 mb-8">
      {/* Glassmorphic Toggle Group - Positioned Higher */}
      <ToggleGroup
        className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-1.5 shadow-2xl transition-all duration-300 ${isVoiceChatLoading ? "opacity-50" : ""}`}
        disabled={isVoiceChatLoading}
        type="single"
        value={isVoiceChatActive || isVoiceChatLoading ? "voice" : "text"}
        onValueChange={(value) => {
          if (value === "voice" && !isVoiceChatActive && !isVoiceChatLoading) {
            startVoiceChat();
          } else if (
            value === "text" &&
            isVoiceChatActive &&
            !isVoiceChatLoading
          ) {
            stopVoiceChat();
          }
        }}
      >
        <ToggleGroupItem
          className="data-[state=on]:bg-white/20 data-[state=on]:shadow-lg rounded-xl px-8 py-3 text-sm font-medium w-[130px] text-center text-white/80 data-[state=on]:text-white transition-all duration-200 hover:bg-white/10"
          value="voice"
        >
          🎤 Voice
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-white/20 data-[state=on]:shadow-lg rounded-xl px-8 py-3 text-sm font-medium w-[130px] text-center text-white/80 data-[state=on]:text-white transition-all duration-200 hover:bg-white/10"
          value="text"
        >
          💬 Text
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Input with glassmorphism */}
      <div className="w-full">
        {isVoiceChatActive || isVoiceChatLoading ? (
          <AudioInput />
        ) : (
          <TextInput />
        )}
      </div>

      {/* Glassmorphic Interrupt Button */}
      <div className="absolute -top-24 right-4">
        <Button
          className="!bg-white/10 !text-white !border !border-white/20 !backdrop-blur-xl !shadow-2xl hover:!bg-white/20 transition-all duration-200 !rounded-xl !px-5 !py-2"
          onClick={interrupt}
        >
          ⏸️ Interrupt
        </Button>
      </div>
    </div>
  );
};
