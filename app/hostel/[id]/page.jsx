"use client";
import React, { useEffect, useState } from "react";
import { items } from "@/app/util/db.js";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const Hostel = ({ params }) => {
  const [item, setItem] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [ratings, setRatings] = useState("");

  useEffect(() => {
    const selectedHostel = items.find((i) => i.id === parseInt(params.id));
    if (selectedHostel) {
      setItem(selectedHostel);
    } else {
      setItem(null);
    }
  }, [params.id]);

  useEffect(() => {
    if (item) {
      const selectedRatings = item.ratings;
      let ratings = "";
      for (let i = 0; i < selectedRatings; i++) {
        ratings += "⭐";
      }
      setRatings(ratings);
    }
  }, [item]);

  const imageHandlerNext = () => {
    setImgIndex((prevIndex) => (prevIndex + 1) % item.images.length);
  };

  const imageHandlerPrev = () => {
    if (imgIndex <= 0) {
      setImgIndex(item.images.length);
    }
    setImgIndex((prevIndex) => (prevIndex - 1) % item.images.length);
  };

  if (!item) {
    return (
      <div>
        <h1>Hostel not found</h1>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4">
      <div className="w-full flex">
        <div className="w-[900px]  h-[500px]">
          <Image
            alt="Boarding Image"
            src={item.images[imgIndex]}
            height={450}
            width={700}
            className="h-[450px]"
          />
          <div className="border-2 w-full h-[50px] bg-black ">
            <button
              onClick={imageHandlerPrev}
              className="border-solid h-full w-1/2 bg-slate-100"
            >
              prev
            </button>
            <button
              onClick={imageHandlerNext}
              className="h-full w-1/2 bg-slate-100"
            >
              next
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full ml-2   h-[50px]">
          <table className="w-full">
            <tbody>
              <tr>
                <th className="border border-gray-300 p-2">Type</th>
                <td className="border border-gray-300 p-2">{item.type} </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Price</th>
                <td className="border border-gray-300 p-2">Rs. {item.price}</td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Location</th>
                <td className="border border-gray-300 p-2">{item.location}</td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Owner ID</th>
                <td className="border border-gray-300 p-2">{item.owner_id}</td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Address</th>
                <td className="border border-gray-300 p-2">{item.address}</td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Bed Capacity</th>
                <td className="border border-gray-300 p-2">
                  {item.bed_capacity}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Available Date</th>
                <td className="border border-gray-300 p-2">
                  {item.available_date}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Extra Features</th>
                <td className="border border-gray-300 p-2">{item.extra}</td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Requested</th>
                <td className="border border-gray-300 p-2">{item.requested}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-9 flex items-center justify-evenly ">
            <button className="bg-black  p-2 text-white w-1/3">
              Chat with owner
            </button>
            <button className="bg-black p-2 text-white w-1/3">Apply</button>
          </div>
        </div>
      </div>
      <div className="w-full  mt-4">
        <div className=" font-bold text-lg mb-[20px] ">Ratings: {ratings}</div>
        <div className=" p-2 bg-blue-300">
          <span className=" font-bold text-blue-900 ">Comments: </span>
          {item.comments.map((comment, index) => (
            <div key={index} className="">
              <div className=" p-2 bg-blue-300 ml-7 mt-3 font-semibold text-green-950 cursor-pointer hover:text-orange-600 ">
                {comment}
              </div>
            </div>
          ))}
        </div>
        <div className=" w-full h-[200px] bg-blue-200  p-5 ">
          <Stack spacing={1}>
            <Rating name="size-medium" defaultValue={0} />
          </Stack>
          <input
            type="text"
            className=" w-3/4 h-1/2 border-collapse border p-3 "
            placeholder="Add a Comment ..."
          />
          <button className="bg-black  p-2 text-white w-1/4 h-1/2">
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hostel;
