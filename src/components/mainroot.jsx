import React, { useEffect, useRef, useState } from "react";
import { Userpanel } from "./userpanel";
import { Link } from "react-router-dom";


export default function Main() {
  const [panel, setpanel] = useState(false);
  const fullTime = 20;
  const [totalSeconds, setTotalSeconds] = useState(fullTime);
  const intervalRef = useRef(null);
  const fillRef = useRef(null);
  const [authenticated, setAuthenticated] = useState(false); // 🔑 auth state

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

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

  useEffect(() => {
    if (fillRef.current) {
      const fillPercent = ((fullTime - totalSeconds) / fullTime) * 100;
      fillRef.current.style.height = `${fillPercent}%`;
    }
  }, [totalSeconds]);

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

  const paneler = () => setpanel((prev) => !prev);

  // Auth check
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
          // Also log the action
          await fetch("http://localhost:5000/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tkn }),
          });

          setAuthenticated(true); // ✅ allow rendering
        } else {
          setAuthenticated(false); // 🚫 block rendering
        }
      } catch (err) {
        console.error("🚫 Error during authentication:", err);
        setAuthenticated(false);
      }
    };

    authenticate();
  }, []);


// Inside your component:
if (!authenticated) return (
  <div>
    You are unauthorized. Please login using the link below:
    <br />
    <Link to="/signup" className="text-blue-500 underline">
      Go to Signup
    </Link>
  </div>
);


  return (
    <div className="min-h-screen flex bg-[#0B192C] text-white font-sans">
      <div className={`flex flex-col items-center justify-center relative ${panel ? "w-3/4" : "w-full max-w-4xl mx-auto"}`}>
        <h1 className="absolute top-4 text-3xl sm:text-4xl md:text-5xl font-bold text-orange-400 drop-shadow-[0_0_10px_#FF6500] font-lemonfunky">
          POTTER
        </h1>

        <div className="relative w-[250px] h-[300px] bg-gradient-to-b from-[#cc6b37] to-[#a7511e] rounded-[60%_60%_45%_45%/40%_40%_60%_60%] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-hidden flex justify-center items-end mb-8 border-[4px] border-[#a24a1b] mt-20">
          <div ref={fillRef} className="absolute bottom-0 left-0 w-full bg-[#FF6500] transition-all duration-1000 z-[1]"></div>
          <div className="relative z-[2] text-2xl text-white pb-5 drop-shadow-[0_0_10px_#FF6500]">
            {formatTime(totalSeconds)}
          </div>
        </div>

        <button
          onClick={resetTimer}
          className="px-6 py-2 text-base border-none rounded-md bg-orange-500 text-black cursor-pointer shadow-[0_0_10px_#ff6600,0_0_20px_#ff6600] transition-all duration-300 hover:bg-[#e55a00] hover:scale-105 font-lemonfunky"
        >
          Reset Timer
        </button>
      </div>

      <button onClick={paneler} className="absolute top-4 right-4 px-4 py-2 bg-orange-500 rounded font-lemonfunky">
        {panel ? "Hide Panel" : "Show Panel"}
      </button>

      {panel && (
        <div className="w-1/4 bg-[#132d4e] p-4 border-l border-gray-600 overflow-y-auto">
          <Userpanel />
        </div>
      )}
    </div>
  );
}
