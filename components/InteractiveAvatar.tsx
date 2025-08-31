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

import { Button } from "./Button";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { Vortex } from "@/components/ui/vortex";

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
          className="flex items-center flex-col justify-center gap-6 px-4 py-6 w-full min-h-screen"
        >
          <h1 className="text-3xl font-bold text-white mb-8">
            Interactive Avatar
          </h1>
          <div className="flex flex-row gap-4">
            <Button onClick={() => startSessionV2(true)}>
              Start Voice Chat
            </Button>
            <Button onClick={() => startSessionV2(false)}>
              Start Text Chat
            </Button>
          </div>
        </Vortex>
      ) : (
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
          <div className="flex flex-col gap-6 items-center justify-center">
            <h1 className="text-3xl font-bold text-white mb-8">
              Interactive Avatar
            </h1>
            {sessionState === StreamingAvatarSessionState.CONNECTING ? (
              <div className="flex flex-col items-center gap-4">
                <LoadingIcon />
                <p className="text-white">Connecting...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-[600px] aspect-video bg-zinc-900 rounded-xl overflow-hidden">
                  <AvatarVideo ref={mediaStream} />
                </div>
                <AvatarControls />
              </div>
            )}
          </div>
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
