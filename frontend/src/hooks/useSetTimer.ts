// hooks/useOtpTimer.ts
import { useEffect, useState, useRef } from "react";

export const useOtpTimer = (start: boolean, duration = 300) => {
  const [timeLeft, setTimeLeft] = useState(duration); // in seconds
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (start && timeLeft > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [start, timeLeft]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return { minutes, seconds, expired: timeLeft === 0 };
};
