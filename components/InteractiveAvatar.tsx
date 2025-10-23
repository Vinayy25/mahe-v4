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
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request was denied:", err.message);
        });
      } else if ((elem as any).webkitRequestFullscreen) {
        // Safari
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        // Firefox
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        // IE11
        (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
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
      // Event listener for fullscreen changes
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen relative">
      {sessionState === StreamingAvatarSessionState.INACTIVE ? (
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center gap-8 px-4 py-6 w-full min-h-screen"
        >
          <div className="text-center w-full max-w-[90%] lg:max-w-[95%] mx-auto px-8 ">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
              Welcome to{" "}
              <ColourfulText text="Manipal Academy of Higher Education Dubai" />{" "}
              – <ColourfulText text="Shaping Futures" />,{" "}
              <ColourfulText text="Inspiring Minds" />
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 font-light">
              Click below to talk to me and explore MAHE Dubai
            </p>
          </div>
          <div className="flex justify-center">
            <MovingBorderButton
              onClick={() => startSessionV2(true)}
              borderRadius="2rem"
              className="bg-slate-900/[0.8] text-white border-slate-700 hover:bg-slate-800/[0.8] transition-colors duration-200"
              containerClassName="w-56 h-14"
              borderClassName="bg-[radial-gradient(#0ea5e9_40%,transparent_60%)]"
            >
              Start Voice Chat
            </MovingBorderButton>
          </div>
        </Vortex>
      ) : (
        <div className="w-screen min-h-screen fixed inset-0 overflow-hidden bg-slate-950">
          {/* Main content */}
          <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8 pb-12 md:pb-16">
            {sessionState === StreamingAvatarSessionState.CONNECTING ? (
              <>
                {/* Connection Status */}
                <div className="absolute top-8 left-8 z-20">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2 text-sm font-medium text-white">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Connecting...
                  </div>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <div className="relative">
                    <LoadingIcon />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-white font-light mb-2">
                      Initializing AI Avatar
                    </p>
                    <p className="text-gray-400">Please wait a moment...</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full max-w-7xl mx-auto">
                {/* Avatar Display Container - Simplified */}
                <div className="relative mb-16">
                  {/* Simple Container */}
                  <div className="relative rounded-[2rem] border border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-3xl p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                    <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-slate-900/60">
                      {/* Avatar video */}
                      <AvatarVideo ref={mediaStream} />

                      {/* Corner accents */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-cyan-400/40 rounded-tl-lg" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-purple-400/40 rounded-tr-lg" />
                      <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-orange-400/40 rounded-bl-lg" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-amber-400/40 rounded-br-lg" />
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div>
                  <AvatarControls />
                </div>
              </div>
            )}
          </div>

          {/* Top Right Controls */}
          {(sessionState === StreamingAvatarSessionState.CONNECTED ||
            sessionState === StreamingAvatarSessionState.CONNECTING) && (
            <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
              {/* Fullscreen Toggle Button */}
              <button
                onClick={() => enterFullscreen()}
                className="flex items-center justify-center p-3.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl shadow-lg hover:bg-white/20 transition-colors duration-200"
                title="Enter Fullscreen"
              >
                <svg
                  className="w-5 h-5 text-white/70 hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>

              {/* End Session Button */}
              <button
                onClick={stopAvatar}
                className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl shadow-lg hover:bg-white/20 transition-colors duration-200"
              >
                {/* Content */}
                <div className="relative flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-white font-medium text-sm tracking-wide">
                    End Session
                  </span>
                  <svg
                    className="w-4 h-4 text-white/70"
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
