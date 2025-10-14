import React, { forwardRef } from "react";

import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState } = useStreamingAvatarSession();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;

  return (
    <>
      <video
        ref={ref}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <track kind="captions" />
      </video>

      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white/60">Loading avatar...</span>
          </div>
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
