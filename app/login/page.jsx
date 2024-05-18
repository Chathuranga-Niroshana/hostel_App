"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("Login");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = (page) => {
    router.push(page);
  };

  const LoginHandler = async () => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          console.log("Login successful");
          localStorage.setItem("auth-token", data.token);
          navigate("/");
        } else {
          console.log("Login failed");
          alert(data.message || "Login failed");
        }
      } else {
        console.log("Login failed");
        alert("Login failed");
      }
    } catch (error) {
      console.error("Failed to login user:", error);
      alert("Login failed. Please try again.");
    }
  };

  const RegisterHandler = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
          mobile: mobile,
        }),
      });
      if (response.ok) {
        alert("User Registered");
        setState("Login");
      } else {
        const data = await response.json();
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Failed to register user:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full h-screen bg-black">
      <div className="h-[100px]">
        <h1 className="text-blue-500 font-bold text-2xl mt-2">{state}</h1>
      </div>
      <div className="flex flex-col bg-zinc-600 border-none w-[800px] h-full mb-[40px]">
        {state === "Login" ? (
          <div className="flex flex-col w-full h-full pt-[50px]">
            <div className="flex w-[800px] justify-evenly mb-7">
              <label
                className=" font-bold text-left w-[100px]pt-1 pb-1"
                htmlFor="email"
              >
                User Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-[300px] pt-1 pb-1 p-1 border-none text-center"
                type="email"
                name="email"
                id="email"
                placeholder="abc@email.com"
              />
            </div>
            <div className="flex w-[800px] justify-evenly mb-7">
              <label
                className="w-[100px] font-bold text-left pt-1 pb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-[300px] pt-1 pb-1 p-1 border-none text-center"
                type="password"
                name="password"
                id="password"
              />
            </div>
            <div className="w-full flex-col flex items-center justify-center mt-[50px] mb-[50px]">
              <button
                className="bg-black pl-9 pr-9 p-2 text-white w-[250px]"
                onClick={LoginHandler}
              >
                {state}
              </button>
              <button
                className="bg-black pl-9 pr-9 p-2 text-white mt-9 w-[250px]"
                onClick={() => setState("Register")}
              >
                Register
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full pt-[50px]">
            <div className="flex w-[800px] justify-evenly mb-7">
              <label
                className="w-[100px] font-bold text-left pt-1 pb-1"
                htmlFor="email"
              >
                User Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                className="w-[300px] pt-1 pb-1 p-1 border-none text-center"
                type="text"
                name="name"
                id="name"
              />
            </div>
            <div className="flex w-[800px] justify-evenly mb-7">
              <label
                className="w-[100px] font-bold text-left pt-1 pb-1"
                htmlFor="email"
              >
                Mobile No
              </label>
              <input
                onChange={(e) => setMobile(e.target.value)}
                className="w-[300px] pt-1 pb-1 p-1 border-none text-center"
                type="number"
                name="mobile"
                id="mobile"
                placeholder="+947--------"
              />
            </div>
            <div className="flex w-[800px] justify-evenly mb-7">
              <label
                className="w-[100px] font-bold text-left pt-1 pb-1"
                htmlFor="email"
              >
                User Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-[300px] pt-1 pb-1 p-1 border-none text-center"
                type="email"
                name="email"
                id="email"
                placeholder="abc@email.com"
              />
            </div>
            <div className="flex w-[800px] justify-evenly">
              <label
                className="w-[100px] font-bold text-left pt-1 pb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-[300px] pt-1 pb-1 p-1 border-none text-center"
                type="password"
                name="password"
                id="password"
              />
            </div>
            <div className="w-full flex-col flex items-center justify-center mt-[50px] mb-[50px]">
              <button
                className="bg-black pl-9 pr-9 p-2 text-white w-[250px]"
                onClick={RegisterHandler}
              >
                {state}
              </button>
              <button
                className="bg-black pl-9 pr-9 p-2 text-white mt-9 w-[250px]"
                onClick={() => setState("Login")}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
