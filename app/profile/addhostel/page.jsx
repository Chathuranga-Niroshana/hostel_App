"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import uploadImge from "../../../public/uploadImage.jpg";
import Image from "next/image";

const AddHostel = () => {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [location_id, setLocationId] = useState("");
  const [bed_capacity, setBedCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [owner_id, setOwner] = useState("");
  const [extra, setExtra] = useState("");
  const [available_date, setAvailableDate] = useState();
  const [user, setUser] = useState();
  const [location, setLocation] = useState([]);
  const [hostelId, setHostelId] = useState();
  const [imageInput, setImageInput] = useState();
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();
  const [image4, setImage4] = useState();

  const router = useRouter();
  const navigator = (page) => {
    router(page);
  };

  //   fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");

        if (authToken) {
          const decodedToken = parseJwt(authToken);
          const userId = decodedToken.user.id;

          const response = await fetch(`/api/user/${userId}`, {
            method: "GET",
          });
          if (response.ok) {
            const data = await response.json();
            // console.log(data);
            setUser(data.result);
            setOwner(data.result.id);
          }
        } else {
          console.error("No auth token found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      return null;
    }
  };

  //   get location
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/hostel", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setLocation(data.locations);
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };
    fetchLocations();
  }, []);

  //   console.log(user[0].id);

  //   create a hostel
  const createHostelHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/hostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          price: price,
          owner_id: owner_id,
          address: address,
          location_id: location_id,
          bed_capacity: bed_capacity,
          available_date: available_date,
          extra: extra,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const newHostelId = data.insertId;
        // console.log(newHostelId);
        setHostelId(newHostelId);
        alert("Hostel added successfully");
        console.log("Hostel added");
      }
    } catch (error) {
      console.log("Error while creating hostel", error);
    }
  };

  return (
    <div className="w-full flex  p-4">
      {user && (
        <form
          className="w-1/2 h-[600px] flex flex-col justify-evenly bg-slate-500 p-6"
          onSubmit={createHostelHandler}
        >
          <div className="mt-2 w-full flex justify-between">
            <label className="  font-medium text-lg" htmlFor="owner_id">
              Owner ID
            </label>
            <Select
              native
              value={owner_id}
              onChange={(e) => setOwner(e.target.value)}
              id="grouped-native-select"
              label="Grouping"
            >
              <option aria-label="None" value="" />
              <option value={user[0].id}>{user[0].username}</option>
            </Select>
          </div>
          <FormControl sx={{ border: "#000 ", m: 1, minWidth: 200 }}>
            <InputLabel sx={{ color: "#000" }} htmlFor="grouped-native-select">
              Boarding Type
            </InputLabel>
            <Select
              native
              value={type}
              onChange={(e) => setType(e.target.value)}
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
          <FormControl sx={{ border: "#000", m: 1, minWidth: 200 }}>
            <InputLabel sx={{ color: "#000" }} htmlFor="grouped-native-select">
              Location
            </InputLabel>
            <Select
              native
              value={location_id}
              onChange={(e) => setLocationId(e.target.value)}
              id="grouped-native-select"
              label="Grouping"
            >
              <option aria-label="None" value="" />
              {location.map((loc) => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.location_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <div className="mt-2 w-full flex justify-between">
            <label className=" font-medium text-lg" htmlFor="address">
              Address
            </label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              name="address"
              type="text"
              className="w-3/5 p-2 text-center border-none"
              placeholder="Address"
            />
          </div>
          <div className="mt-2 w-full flex justify-between">
            <label className=" font-medium text-lg" htmlFor="price">
              Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              name="price"
              type="number"
              className="w-3/5 p-2 text-center border-none"
              placeholder="Price"
            />
          </div>

          <div className="mt-2 w-full flex justify-between">
            <label className=" font-medium text-lg" htmlFor="bed_capacity">
              Bed Capacity
            </label>
            <input
              onChange={(e) => setBedCapacity(e.target.value)}
              name="bed_capacity"
              type="number"
              className="w-3/5 p-2 text-center border-none"
              placeholder="Bed Capacity"
            />
          </div>

          <div className="mt-2 w-full flex justify-between">
            <label className=" font-medium text-lg" htmlFor="extra">
              Extra Features
            </label>
            <input
              onChange={(e) => setExtra(e.target.value)}
              name="extra"
              type="text"
              className="w-3/5 p-2 text-center border-none"
              placeholder="Extra Features"
            />
          </div>
          <div className="mt-2 w-full flex justify-between">
            <label className=" font-medium text-lg" htmlFor="available_date">
              Available Date
            </label>
            <input
              onChange={(e) => setAvailableDate(e.target.value)}
              name="available_date"
              type="date"
              className="w-3/5 p-2 text-center border-none"
              placeholder="Available Date"
            />
          </div>
          <div className="w-full flex justify-center items-center h-[40px] mt-[20px]">
            <button
              className="bg-black p-2 text-white mt-3 w-1/3"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {hostelId && (
        <div className="w-1/2 p-4 h-[600px] bg-slate-600 ml-3 flex flex-col justify-between">
          <label className=" font-medium text-lg" htmlFor="images">
            Add Images
          </label>
          <div className="w-full h-1/3 flex flex-wrap justify-evenly">
            <label htmlFor="image1">
              <Image
                src={image1 ? URL.createObjectURL(image1) : uploadImge}
                alt="Upload here"
                width={150}
                height={150}
              />
            </label>
            <input
              type="file"
              name="image1"
              id="image1"
              onChange={(e) => setImage1(e.target.files[0])}
              hidden
            />
            <label htmlFor="image2">
              <Image
                src={image2 ? URL.createObjectURL(image2) : uploadImge}
                alt="Upload here"
                width={150}
                height={150}
              />
            </label>
            <input
              type="file"
              name="image2"
              id="image2"
              onChange={(e) => setImage2(e.target.files[0])}
              hidden
            />
          </div>
          <div className="w-full h-1/3 flex flex-wrap justify-evenly">
            <label htmlFor="image3">
              <Image
                src={image3 ? URL.createObjectURL(image3) : uploadImge}
                alt="Upload here"
                width={150}
                height={150}
              />
            </label>
            <input
              type="file"
              name="image3"
              id="image3"
              onChange={(e) => setImage3(e.target.files[0])}
              hidden
            />
            <label htmlFor="image4">
              <Image
                src={image4 ? URL.createObjectURL(image4) : uploadImge}
                alt="Upload here"
                width={150}
                height={150}
              />
            </label>
            <input
              type="file"
              name="image4"
              id="image4"
              onChange={(e) => setImage4(e.target.files[0])}
              hidden
            />
          </div>
          <div className="w-full flex justify-center items-center h-[40px] mt-[20px]">
            <button className="bg-black p-2 text-white w-1/3">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHostel;
