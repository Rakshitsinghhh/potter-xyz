import React, { useEffect, useState } from 'react';

export function Main() {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      const tkn = localStorage.getItem("token");
    //   console.log("Token from localStorage:", tkn);

      try {
        const response = await fetch("http://localhost:5000/Main", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tkn }),
        });

        if (response.ok) {
          console.log("✅ Authenticated successfully");
          setAuthStatus("success");
        } else {
          console.log("❌ Authentication failed");
          setAuthStatus("failed");
        }
      } catch (err) {
        console.error("🚫 Error during authentication:", err);
        setAuthStatus("error");
      }
    };

    authenticate();
  }, []);

  // Optional render output (can be kept or removed)
  return <div>Check console for auth status</div>;
}

export default Main;