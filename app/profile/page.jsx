"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [hostel, setHostel] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");

        if (authToken) {
          const decodedToken = parseJwt(authToken);
          const userId = decodedToken.user.id;

          const response = await fetch(`/api/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUser(data.result[0][0]);
            setHostel(data.hostels[0]);
          }
        } else {
          console.error("No auth token found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);

  if (hostel) {
    hostel.map((element) => {
      console.log(element.address);
    });
  }

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="w-full h-full p-2  flex flex-col">
      <div className="w-full h-full   flex">
        {user ? (
          <div className="w-2/3 h-[200px]  bg-slate-500">
            <table className="w-full">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2">Name</th>
                  <td className="border border-gray-300 p-2">
                    {user.username} {user.id}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2">Email</th>
                  <td className="border border-gray-300 p-2">{user.email} </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2">Mobile</th>
                  <td className="border border-gray-300 p-2">{user.mobile} </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 flex items-center justify-evenly ">
              <button className="bg-black  p-2 text-white w-1/3">Update</button>
              <button className="bg-black p-2 text-white w-1/3">
                Delete Acc
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="w-1/3 h-[200px] bg-slate-200">
          <div className="mt-2 flex items-center justify-evenly ">
            <button className="bg-black  p-2 text-white w-1/3">
              Add Hostel
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="mt-4 font-semibold text-purple-700 text-xl">
          My Hostels
        </h1>
        {/* {hostel.type} */}

        <div>
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
