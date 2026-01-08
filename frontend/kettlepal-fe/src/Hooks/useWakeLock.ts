import { useEffect, useRef } from "react";

interface WakeLockSentinel extends EventTarget {
  released: boolean;
  release(): Promise<void>;
}

/**
 * A Hook to engage "Cook Mode" - keeps the screen awake until
 * keepAwake is false, or the component unmounts.
 */
export function useWakeLock(keepAwake: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const safariVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hasWakeLockAPI = "wakeLock" in navigator;

    const requestWakeLock = async () => {
      if (
        cancelled ||
        !keepAwake ||
        document.visibilityState !== "visible" ||
        wakeLockRef.current
      ) {
        return;
      }

      // Chromium / Android
      if (hasWakeLockAPI) {
        try {
          const sentinel = await (
            navigator as unknown as {
              wakeLock: {
                request(type: "screen"): Promise<WakeLockSentinel>;
              };
            }
          ).wakeLock.request("screen");
          wakeLockRef.current = sentinel;

          sentinel.addEventListener("release", () => {
            wakeLockRef.current = null;

            if (
              !cancelled &&
              keepAwake &&
              document.visibilityState === "visible"
            ) {
              requestWakeLock();
            }
          });
        } catch (err) {
          console.error("Wake lock request failed:", err);
        }
        return;
      }

      // Safari / iOS
      if (!safariVideoRef.current) {
        // Safari does not support the Wake Lock API, we play a tiny silent video as a workaround
        const video = document.createElement("video");

        // Syntactically valid video container, no actual content.
        video.src =
          "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDFtcDQyAAAAAG1vb3Y=";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.style.display = "none";

        document.body.appendChild(video);

        video.play().catch(() => {
          // iOS may block autoplay without user gesture
        });

        safariVideoRef.current = video;
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch (e) {
          console.log(e);
        } finally {
          wakeLockRef.current = null;
        }
      }

      if (safariVideoRef.current) {
        safariVideoRef.current.pause();
        safariVideoRef.current.remove();
        safariVideoRef.current = null;
      }
    };

    if (keepAwake) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      } else {
        releaseWakeLock();
      }
    };

    // When tab visibility changes, update wakelock status.
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [keepAwake]);
}
