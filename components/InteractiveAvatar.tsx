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
import DottedGlowBackground from "@/components/ui/dotted-glow-background";

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

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);

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

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
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

  return (
    <div className="w-full min-h-screen relative">
      {sessionState === StreamingAvatarSessionState.INACTIVE ? (
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center gap-8 px-4 py-6 w-full min-h-screen"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Welcome to <ColourfulText text="MAHE Dubai" /> – <br />
              <ColourfulText text="Shaping Futures" />,{" "}
              <ColourfulText text="Inspiring Minds" />
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 font-light">
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
        <div className="w-screen min-h-screen fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/30 to-orange-950/30">
          {/* Animated Mesh Gradient Background - Extended */}
          <div className="absolute -inset-[20%] opacity-50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-orange-600/30 animate-mesh-gradient blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tl from-amber-600/30 via-blue-600/30 to-purple-600/30 animate-mesh-gradient-reverse blur-3xl" />
          </div>

          {/* Additional Gradient Orbs for Coverage */}
          <div className="absolute inset-0">
            <div className="absolute -left-1/4 top-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-[120px] animate-float-slow" />
            <div className="absolute -right-1/4 bottom-0 w-[800px] h-[800px] bg-gradient-to-tl from-orange-500/20 to-amber-500/20 rounded-full blur-[120px] animate-float-slow-reverse" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-full blur-[100px] animate-breathe" />
          </div>

          {/* Dotted Glow Background */}
          <DottedGlowBackground
            className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-50"
            gap={10}
            radius={1.6}
            colorLightVar="--color-neutral-500"
            glowColorLightVar="--color-neutral-600"
            colorDarkVar="--color-neutral-500"
            glowColorDarkVar="--color-sky-800"
            backgroundOpacity={0}
            speedMin={0.3}
            speedMax={1.6}
            speedScale={1}
          />

          {/* Enhanced Particle System */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/40 rounded-full animate-particle"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${12 + Math.random() * 15}s`,
                }}
              />
            ))}
          </div>

          {/* Radial Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-950/40" />

          {/* Main content */}
          <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8 pb-12 md:pb-16 animate-entrance">
            {sessionState === StreamingAvatarSessionState.CONNECTING ? (
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <LoadingIcon />
                </div>
                <div className="text-center">
                  <p className="text-2xl text-white font-light mb-2">
                    Initializing AI Avatar
                  </p>
                  <p className="text-gray-400">Please wait a moment...</p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-7xl mx-auto animate-scale-in">
                {/* Glassmorphic Live Status Pill */}
                <div className="absolute right-8 top-8 z-20 animate-fade-in-down">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-2 text-sm font-medium text-white shadow-2xl">
                    <span className="relative inline-flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                    </span>
                    Live
                  </div>
                </div>

                {/* Avatar Display Container - Enhanced Glassmorphism */}
                <div className="relative mb-16 animate-scale-in-delayed group">
                  {/* Multi-layer Interactive Glow */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-orange-500/30 rounded-[3rem] blur-3xl opacity-50 animate-breathe group-hover:opacity-70 transition-opacity duration-700" />
                  <div className="absolute -inset-3 bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-amber-500/20 rounded-[2.5rem] blur-xl opacity-40 animate-mesh-gradient" />

                  {/* Premium Glassmorphic Container */}
                  <div className="relative rounded-[2rem] border border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-3xl p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_25px_80px_-15px_rgba(59,130,246,0.4)] hover:border-white/40">
                    <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-900/60 via-blue-950/40 to-slate-800/60">
                      {/* Avatar video with enhanced blend */}
                      <AvatarVideo ref={mediaStream} />

                      {/* Multi-layer ambient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/15 via-transparent to-purple-600/15 pointer-events-none mix-blend-overlay" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />

                      {/* Enhanced flowing scan lines */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/8 to-transparent animate-scan-smooth pointer-events-none" />

                      {/* Corner accents */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-cyan-400/40 rounded-tl-lg" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-purple-400/40 rounded-tr-lg" />
                      <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-orange-400/40 rounded-bl-lg" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-amber-400/40 rounded-br-lg" />
                    </div>
                  </div>
                </div>

                {/* Glassmorphic Controls */}
                <div className="animate-slide-up-smooth">
                  <AvatarControls />
                </div>
              </div>
            )}
          </div>

          {/* Modern Floating End Session Button - Top Right */}
          {(sessionState === StreamingAvatarSessionState.CONNECTED ||
            sessionState === StreamingAvatarSessionState.CONNECTING) && (
            <div className="fixed top-8 right-8 z-50 animate-fade-in-down">
              <button
                onClick={stopAvatar}
                className="group relative flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-105 hover:border-red-400/50"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

                {/* Content */}
                <div className="relative flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse group-hover:bg-red-400" />
                  <span className="text-white font-medium text-sm tracking-wide">
                    End Session
                  </span>
                  <svg
                    className="w-4 h-4 text-white/70 group-hover:text-red-400 transition-colors duration-300"
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
