import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";

import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";

import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { Vortex } from "@/components/ui/vortex";
import ColourfulText from "@/components/ui/colourful-text";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

import { AVATARS } from "@/app/lib/constants";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality:
    AvatarQuality[
      process.env.NEXT_PUBLIC_AVATAR_QUALITY as keyof typeof AvatarQuality
    ] || AvatarQuality.Low,
  avatarName:
    process.env.NEXT_PUBLIC_DEFAULT_AVATAR_NAME || AVATARS[0].avatar_id,
  knowledgeId:
    process.env.KNOWLEDGEBASE_ID || "988437160dc645f9a6aec4eb616795f2",
  voice: {
    rate: parseFloat(process.env.NEXT_PUBLIC_VOICE_RATE || "1.5"),
    emotion:
      VoiceEmotion[
        process.env.NEXT_PUBLIC_VOICE_EMOTION as keyof typeof VoiceEmotion
      ] || VoiceEmotion.EXCITED,
    model:
      ElevenLabsModel[
        process.env.NEXT_PUBLIC_VOICE_MODEL as keyof typeof ElevenLabsModel
      ] || ElevenLabsModel.eleven_flash_v2_5,
  },
  language: process.env.NEXT_PUBLIC_LANGUAGE || "en",
  voiceChatTransport:
    VoiceChatTransport[
      process.env
        .NEXT_PUBLIC_VOICE_CHAT_TRANSPORT as keyof typeof VoiceChatTransport
    ] || VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider:
      STTProvider[
        process.env.NEXT_PUBLIC_STT_PROVIDER as keyof typeof STTProvider
      ] || STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAutoEnteredFullscreen = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const enterFullscreen = async () => {
    try {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen(); // fallback
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
    }
  };

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      // Trigger fullscreen immediately on user interaction
      await enterFullscreen();

      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  // Auto-enter fullscreen when avatar connects (only once)
  useEffect(() => {
    if (
      sessionState === StreamingAvatarSessionState.CONNECTED &&
      !hasAutoEnteredFullscreen.current
    ) {
      hasAutoEnteredFullscreen.current = true;
      setTimeout(() => {
        enterFullscreen();
      }, 500);
    }

    // Reset flag when session ends
    if (sessionState === StreamingAvatarSessionState.INACTIVE) {
      hasAutoEnteredFullscreen.current = false;
    }
  }, [sessionState]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      {sessionState === StreamingAvatarSessionState.INACTIVE ? (
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 w-full h-full"
        >
          <div className="text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
              Welcome to <ColourfulText text="MAHE Dubai" /> –{" "}
              <br className="hidden sm:block" />
              <ColourfulText text="Shaping Futures" />,{" "}
              <span className="whitespace-nowrap">
                <ColourfulText text="Inspiring Minds" />
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 md:mb-8 font-light px-2">
              Click below to talk to me and explore MAHE Dubai
            </p>
          </div>
          <div className="flex justify-center">
            <MovingBorderButton
              onClick={() => startSessionV2(true)}
              borderRadius="2rem"
              className="bg-slate-900/[0.8] text-white border-slate-700 hover:bg-slate-800/[0.8] transition-colors duration-200"
              containerClassName="w-40 sm:w-48 md:w-56 h-10 sm:h-12 md:h-14"
              borderClassName="bg-[radial-gradient(#0ea5e9_40%,transparent_60%)]"
            >
              <span className="text-xs sm:text-sm md:text-base">Start Voice Chat</span>
            </MovingBorderButton>
          </div>
        </Vortex>
      ) : (
        // The fullscreen root wrapper
        <div
          className={
            isFullscreen
              ? 'fixed inset-0 z-50 w-screen h-screen max-w-none p-0 m-0 rounded-none bg-black overflow-hidden'
              : 'w-full h-full fixed inset-0 overflow-hidden bg-slate-950'
          }
        >
          {/* Main content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-6 xl:p-8 pb-4 sm:pb-6 md:pb-8 lg:pb-12 xl:pb-16 overflow-hidden">
            {sessionState === StreamingAvatarSessionState.CONNECTING ? (
              <>
                {/* Connection Status */}
                <div className="absolute top-2 sm:top-4 md:top-6 lg:top-8 left-2 sm:left-4 md:left-6 lg:left-8 z-30">
                  <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium text-white">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-orange-500" />
                    Connecting...
                  </div>
                </div>

                {/* Loading overlay - fixed positioning to prevent scrollbars */}
                <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
                    <div className="relative">
                      <LoadingIcon />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-lg sm:text-xl md:text-2xl text-white font-light mb-1 sm:mb-2">
                        Initializing AI Avatar
                      </p>
                      <p className="text-sm sm:text-base text-gray-400">Please wait a moment...</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto h-full flex flex-col justify-center">
                {/* Live Status Pill */}
                <div className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-2 sm:top-4 md:top-6 lg:top-8 z-20">
                  <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium text-white shadow-2xl">
                    <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3">
                      <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 rounded-full bg-green-500" />
                    </span>
                    Live
                  </div>
                </div>

                {/* Avatar Display Container - Responsive */}
                <div className="relative mb-4 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-16 flex-shrink-0">
                  {/* Video/viewport area */}
                  <div className={
                    isFullscreen
                      ? 'relative w-full h-full'
                      : 'relative rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[2rem] border border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-3xl p-0.5 sm:p-1 md:p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]'
                  }>
                    <div className={
                      isFullscreen
                        ? 'relative w-full h-full overflow-hidden bg-slate-900/60'
                        : 'relative aspect-video overflow-hidden rounded-md sm:rounded-lg md:rounded-xl lg:rounded-[1.75rem] bg-slate-900/60'
                    }>
                      {/* Avatar video */}
                      <AvatarVideo
                        ref={mediaStream}
                        className={isFullscreen ? 'w-full h-full object-cover' : 'w-full h-full object-contain'}
                      />

                      {/* Corner accents - responsive */}
                      {!isFullscreen && (
                        <>
                          <div className="absolute top-1 sm:top-2 md:top-3 left-1 sm:left-2 md:left-3 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t border-l border-cyan-400/40 rounded-tl-lg" />
                          <div className="absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t border-r border-purple-400/40 rounded-tr-lg" />
                          <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-1 sm:left-2 md:left-3 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b border-l border-orange-400/40 rounded-bl-lg" />
                          <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 right-1 sm:right-2 md:right-3 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b border-r border-amber-400/40 rounded-br-lg" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls - positioned at bottom */}
                <div className="flex-shrink-0">
                  <AvatarControls />
                </div>
              </div>
            )}
          </div>

          {/* Top Right Controls */}
          {(sessionState === StreamingAvatarSessionState.CONNECTED ||
            sessionState === StreamingAvatarSessionState.CONNECTING) && (
            <div className={
              isFullscreen
                ? 'absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2 sm:gap-3 z-50'
                : 'fixed top-1 sm:top-2 md:top-4 lg:top-6 xl:top-8 right-1 sm:right-2 md:right-4 lg:right-6 xl:right-8 z-50 flex items-center gap-1 sm:gap-2 md:gap-3'
            }>
              {/* Fullscreen Toggle Button */}
              <button
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                className="flex items-center justify-center p-1.5 sm:p-2 md:p-2.5 lg:p-3 xl:p-3.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl shadow-lg"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <svg
                  className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isFullscreen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  )}
                </svg>
              </button>

              {/* End Session Button */}
              <button
                onClick={stopAvatar}
                className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-3.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl shadow-lg"
              >
                {/* Content */}
                <div className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
                  <div className="w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 rounded-full bg-red-500" />
                  <span className="text-white font-medium text-xs sm:text-sm tracking-wide">
                    End Session
                  </span>
                  <svg
                    className="w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InteractiveAvatarWrapper() {
  return (
    <StreamingAvatarProvider basePath={process.env.BASE_API_URL}>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}
