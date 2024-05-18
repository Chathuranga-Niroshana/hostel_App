"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import headerImg from "../public/header1.jpg";
import logo from "../public/logo.jpg";

const Header = () => {
  const router = useRouter();
  const navigate = (page) => router.push(page);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if auth-token exists in localStorage
      const token = localStorage.getItem("auth-token");
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  return (
    <div
      className="w-full h-[350px] bg-slate-400 flex flex-col justify-between"
      style={{
        backgroundImage: `url(${headerImg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex justify-between w-full">
        <Image alt="Header" src={logo} width={150} height={50} />
      </div>
      <div className="flex justify-between w-full">
        <ul className="flex w-full justify-evenly items-center pt-3">
          <li
            onClick={() => navigate("/")}
            className="text-red-400 text-xl font-bold hover:text-green-500 cursor-pointer "
          >
            Home
          </li>
          <li
            onClick={() => navigate("/profile")}
            className="text-red-400 text-xl font-bold hover:text-green-500 cursor-pointer "
          >
            Profile
          </li>
          <li
            onClick={() => navigate("/chat")}
            className="text-red-400 text-xl font-bold hover:text-green-500 cursor-pointer "
          >
            Chat
          </li>
          {isAuthenticated ? (
            <li
              onClick={handleLogout}
              className="text-red-400 text-xl font-bold hover:text-green-500 cursor-pointer "
            >
              Logout
            </li>
          ) : (
            <li
              onClick={() => navigate("/login")}
              className="text-red-400 text-xl font-bold hover:text-green-500 cursor-pointer "
            >
              Login
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
