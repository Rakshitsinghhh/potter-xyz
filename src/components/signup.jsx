import { useRef } from "react";
import bg from "../assets/bg.jpg";

export function Signup() {
  const mobile = useRef();
  const pass = useRef();
  const name = useRef();

  async function checker() {
    const mobileValue = mobile.current.value;
    const passwordValue = pass.current.value;
    const nameValue = name.current.value;

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
        localStorage.setItem("token", data.token);
        console.log("User:", data.user);
        console.log("token:", data.token);
        window.location.href = "/main";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-[#00023f] bg-opacity-80 p-6 rounded-2xl shadow-md flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[white]">Login</h1>
        <input
          ref={mobile}
          placeholder="Enter mobile number"
          className="border p-2 rounded"
        />
        <input
          ref={pass}
          type="password"
          placeholder="Enter password"
          className="border p-2 rounded"
        />

        <input
          ref={name}
          placeholder="Enter Name"
          className="border p-2 rounded"
        />
        <button
          onClick={checker}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Signup;