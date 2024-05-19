"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import { items } from "./util/db.js";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [items, setItems] = useState();
  const [location, setLocation] = useState([]);

  const navigate = (page) => router.push(page);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch("/api/hostel", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data.result);
          setLocation(data.locations);
          // console.log(data.result);
          // console.log(data);
          // console.log(data.locations);
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };
    fetchHostels();
  }, []);

  const filteredItems = filter
    ? items.filter((item) => item.type === filter)
    : items;
  const filterdLocation = filterLocation
    ? items.filter((item) => item.location === filterLocation)
    : items;
  // const filteredItems = items.filter((item) => {
  //   return (
  //     (!filter || item.type === filter) &&
  //     (!filterLocation || item.location === filterLocation)
  //   );
  // });

  return (
    <div className="w-full h-full">
      <div className="w-full h-[200px] bg-slate-300 border-2 ">
        {/* filters */}
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel htmlFor="grouped-native-select">Bording Type</InputLabel>
          <Select
            native
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            id="grouped-native-select"
            label="Grouping"
          >
            <option aria-label="None" value="" />
            <option value="Hostel">Hostel</option>
            <option value="Annex">Annex</option>
            <option value="Room">Rooms</option>
            <option value="Apartment">Apartment</option>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel htmlFor="grouped-native-select">Location</InputLabel>
          <Select
            native
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            id="grouped-native-select"
            label="Grouping"
          >
            <option aria-label="None" value="" />
            {location.map((loc) => (
              <option key={loc.location_id} value={loc.location_name}>
                {loc.location_name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel htmlFor="grouped-select">Price</InputLabel>
          <Select value={filter} id="grouped-select" label="Grouping">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}> 0-5000.00 </MenuItem>
            <MenuItem value={2}>5000.00-10000.00</MenuItem>
            <MenuItem value={3}>10000.00-20000.00</MenuItem>
            <MenuItem value={4}>20000.00-40000.00</MenuItem>
            <MenuItem value={5}>40000.00-60000.00</MenuItem>
            <MenuItem value={6}>60000.00-more </MenuItem>
          </Select>
        </FormControl>
      </div>
      {/* items */}
      <div className=" grid grid-cols-4 w-full gap-4 ">
        {filteredItems &&
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="w-[250px] h-[400px] bg-slate-700 m-9 cursor-pointer hover:scale-105 transition-transform "
              onClick={() => navigate(`/hostel/${item.id}`)}
            >
              <Image
                alt="Bording Image"
                src={item.images[0].image_url}
                height={250}
                width={250}
                className=" h-[250px] "
              />
              <div className=" w-full h-[150px] flex flex-col pl-4 justify-center ">
                <span className=" text-red-300 ">
                  {item.type} with {item.bed_capacity} Bedrooms
                </span>
                <span className=" font-medium text-sm text-red-300 ">
                  {item.address}
                </span>
                <span className=" font-light text-xs text-red-300 ">
                  Rs. {item.price}
                </span>
                <span className=" font-light text-xs text-violet-300 ">
                  {item.attached_bathrooms == true ? (
                    <span>With attached bathrooms</span>
                  ) : (
                    <span></span>
                  )}
                </span>
                <span className=" font-light text-xs text-violet-300 ">
                  {item.shared_room == true ? (
                    <span>Sheared room with {item.shared_number} persons </span>
                  ) : (
                    <span></span>
                  )}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
