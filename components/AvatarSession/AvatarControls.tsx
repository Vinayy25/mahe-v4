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
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6 relative w-full items-center -mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8 mb-2 sm:mb-4 md:mb-6 lg:mb-8">
      {/* Glassmorphic Toggle Group - Positioned Higher */}
      <ToggleGroup
        className={`rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-0.5 sm:p-1 md:p-1.5 shadow-2xl transition-all duration-300 ${isVoiceChatLoading ? "opacity-50" : ""}`}
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
          className="data-[state=on]:bg-white/20 data-[state=on]:shadow-lg rounded-md sm:rounded-lg md:rounded-xl px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-medium w-16 sm:w-20 md:w-24 lg:w-[100px] xl:w-[130px] text-center text-white/80 data-[state=on]:text-white transition-all duration-200 hover:bg-white/10"
          value="voice"
        >
          <span className="hidden sm:inline">🎤 Voice</span>
          <span className="sm:hidden">🎤</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-white/20 data-[state=on]:shadow-lg rounded-md sm:rounded-lg md:rounded-xl px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-medium w-16 sm:w-20 md:w-24 lg:w-[100px] xl:w-[130px] text-center text-white/80 data-[state=on]:text-white transition-all duration-200 hover:bg-white/10"
          value="text"
        >
          <span className="hidden sm:inline">💬 Text</span>
          <span className="sm:hidden">💬</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Input with glassmorphism */}
      <div className="w-full relative">
        {isVoiceChatActive || isVoiceChatLoading ? (
          <AudioInput />
        ) : (
          <TextInput />
        )}
      </div>

      {/* Glassmorphic Interrupt Button */}
      <div className="absolute -top-8 sm:-top-12 md:-top-16 lg:-top-20 xl:-top-24 right-1 sm:right-2 md:right-3 lg:right-4">
        <Button
          className="!bg-white/10 !text-white !border !border-white/20 !backdrop-blur-xl !shadow-2xl hover:!bg-white/20 transition-all duration-200 !rounded-md sm:!rounded-lg md:!rounded-xl !px-2 sm:!px-3 md:!px-4 lg:!px-5 !py-1 sm:!py-1.5 md:!py-2 !text-xs sm:!text-sm"
          onClick={interrupt}
        >
          <span className="hidden sm:inline">⏸️ Interrupt</span>
          <span className="sm:hidden">⏸️</span>
        </Button>
      </div>
    </div>
  );
};
