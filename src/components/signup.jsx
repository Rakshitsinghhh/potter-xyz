import { useRef, useState } from "react";
import FlyingEmojis from "./bg";


export function Signup() {
  const mobile = useRef();
  const pass = useRef();
  const name = useRef();
  const [isLoading, setIsLoading] = useState(false);
  

  async function checker() {
    const mobileValue = mobile.current.value;
    const passwordValue = pass.current.value;
    const nameValue = name.current.value;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobileValue,
          password: passwordValue,
          name: nameValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetch("http://localhost:5000/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: data.token , action : "signup"}),
        });

        localStorage.setItem("token", data.token);
        console.log("User:", data.user);
        console.log("token:", data.token);
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
    setIsLoading(false);
  }

  return (    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
    >
      <div className="absolute inset-0 -z-10">
        <FlyingEmojis />
      </div>
      
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-3xl shadow-xl 
                      border-2 border-pink-500 flex flex-col gap-5 w-full max-w-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 text-2xl rotate-12 translate-x-2 -translate-y-1">✨</div>
        <div className="absolute bottom-0 left-0 text-2xl -rotate-12 -translate-x-1 translate-y-1">🌈</div>
        <div className="absolute top-1/4 left-0 text-xl -translate-x-1">💫</div>
        <div className="absolute bottom-1/4 right-0 text-xl translate-x-1">🦄</div>
        
        {/* Login content */}
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-3xl font-bold text-center text-white">
            Hey There! <span className="inline-block animate-bounce">👋</span>
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <div className="flex items-center bg-white/20 rounded-xl overflow-hidden px-4 py-3">
            <span className="text-xl mr-2">🎀</span>
            <input
              ref={name}
              type=""
              placeholder="Enter cute name"
              className="bg-transparent border-none flex-1 text-white placeholder-white/70 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <div className="flex items-center bg-white/20 rounded-xl overflow-hidden px-4 py-3">
            <span className="text-xl mr-2">📱</span>
            <input
              ref={mobile}
              placeholder="Your phone number"
              className="bg-transparent border-none flex-1 text-white placeholder-white/70 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <div className="flex items-center bg-white/20 rounded-xl overflow-hidden px-4 py-3">
            <span className="text-xl mr-2">🔒</span>
            <input
              ref={pass}
              type="password"
              placeholder="Super secret password"
              className="bg-transparent border-none flex-1 text-white placeholder-white/70 focus:outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={checker}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold 
                    shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <span>Let's Go!</span>
              <span className="text-xl">🚀</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-center text-white/70 mt-2">
          Forgot password? <span className="underline cursor-pointer">Click here</span> 💭
        </p>
      </div>
    </div>
  );
}

export default Signup;