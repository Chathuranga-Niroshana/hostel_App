"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(async () => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (authToken) {
        const decodedToken = parseJwt(authToken);
        const userId = decodedToken.user.id;

        const response = await fetch(`/api/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });
        setUser(response.data[0]);
      }
    } catch (error) {
      console.log("Error fetching user profile:", error);
    }
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split("."[1])));
    } catch (error) {
      return null;
    }
  };
  return (
    <div>
      <h1>Profile</h1>
      <p>{user?.name}</p>
      <p>{user.id} </p>
    </div>
  );
};

export default Profile;
