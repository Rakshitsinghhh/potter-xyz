import React, { useEffect, useRef, useState } from "react";

export default function Main() {
  // const fullTime = 24 * 60 * 60; // 24 hours in seconds
  const fullTime = 20; // 24 hours in seconds
  const [totalSeconds, setTotalSeconds] = useState(fullTime);
  const intervalRef = useRef(null);
  const fillRef = useRef(null);

  // Authentication check
  useEffect(() => {
    const authenticate = async () => {
      const tkn = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/Main", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tkn }),
        });

        if (response.ok) {
          console.log("✅ Authenticated successfully");
        } else {
          console.log("❌ Authentication failed");
        }
      } catch (err) {
        console.error("🚫 Error during authentication:", err);
      }
    };

    authenticate();
  }, []);

  // Format seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Timer logic
  useEffect(() => {
    if (totalSeconds <= 0) return;

    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Update fill height on time change
  useEffect(() => {
    if (fillRef.current) {
      const fillPercent = ((fullTime - totalSeconds) / fullTime) * 100;
      fillRef.current.style.height = `${fillPercent}%`;
    }
  }, [totalSeconds]);

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTotalSeconds(fullTime);
    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B192C] text-white font-sans">
      <div className="relative w-[250px] h-[300px] bg-gradient-to-br from-[#0B192C] to-[#1E3E62] rounded-[50%_50%_40%_40%/60%_60%_30%_30%] shadow-[0_0_30px_rgba(255,101,0,0.4),inset_0_0_20px_rgba(255,101,0,0.2)] overflow-hidden flex justify-center items-end mb-8">
        <div
          ref={fillRef}
          className="absolute bottom-0 left-0 w-full bg-[#FF6500] transition-all duration-1000 z-[1]"
        ></div>
        <div className="relative z-[2] text-2xl text-white pb-5 drop-shadow-[0_0_10px_#FF6500]">
          {formatTime(totalSeconds)}
        </div>
      </div>

      <button
        onClick={resetTimer}
        className="px-6 py-2 text-base border-none rounded-md bg-orange-500 text-black cursor-pointer shadow-[0_0_10px_#ff6600,0_0_20px_#ff6600] transition-all duration-300 hover:bg-[#e55a00] hover:scale-105"
      >
        Reset Timer
      </button>
    </div>
  );
}
