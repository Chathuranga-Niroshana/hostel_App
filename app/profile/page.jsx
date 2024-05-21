"use client";

import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [hostel, setHostel] = useState();
  const [open, setOpen] = React.useState(false);
  const [openHostelDialog, setOpenHostelDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedHostelId, setSelectedHostelId] = useState(null);

  const navigate = (page) => router.push(page);

  // fetch user
  useEffect(() => {
    const fetchUserData = async () => {
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
            setHostel(data.hostels);
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

  // button handles
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // delete user
  const handleDelete = () => {
    const deleteUser = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");
        const decodedToken = parseJwt(authToken);
        const userId = decodedToken.user.id;

        const response = await fetch(`/api/user/${userId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          localStorage.removeItem("auth-token");
          navigate("/");
          console.log("User Deleted Successfully");
          setOpen(false);
        } else {
          console.log("User Not Deleted");
          setOpen(false);
        }
      } catch (error) {
        console.error("Error deleting user profile:", error);
      }
    };
    deleteUser();
  };

  const handleOpenHostelDialog = (id) => {
    setOpenHostelDialog(true);
    setSelectedHostelId(id);
  };
  const handleCloseHostelDialog = () => {
    setOpenHostelDialog(false);
    setSelectedHostelId(null);
  };

  // delete hostel
  const handleHostelDelete = async (hostelId) => {
    try {
      const response = await fetch(`/api/hostel/${selectedHostelId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Hostel Deleted Successfully");
        // Remove the deleted hostel from the state
        setHostel(hostel.filter((h) => h.id !== hostelId));
        handleCloseHostelDialog();
      } else {
        console.log("Hostel Not Deleted");
        handleCloseHostelDialog();
      }
    } catch (error) {
      console.error("Error deleting hostel:", error);
    }
  };

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
                    {user.username}
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
              {/* delete acc */}
              <React.Fragment>
                <Button
                  sx={{
                    background: "#000",
                    padding: "9px",
                    width: "33%",
                    border: "none",
                    borderRadius: "0",
                    color: "#fff",
                  }}
                  variant="outlined"
                  onClick={handleClickOpen}
                >
                  Delete Account
                </Button>
                <Dialog
                  fullScreen={fullScreen}
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Do You want to delete your account?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      If you do, you will lose every details.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                      No
                    </Button>
                    <Button onClick={handleDelete} autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
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
      <div className=" w-full  min-h-[400px] mt-6">
        <h1 className="mt-4 font-semibold text-purple-700 text-xl">
          My Hostels
        </h1>

        <div className="flex gap-4 mt-6 bg-slate-900 p-5 w-full min-h-[300px]">
          {hostel &&
            hostel.map((h) => (
              <div>
                <Card key={h.id} sx={{ width: 345 }}>
                  <CardActionArea>
                    {/* <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  /> */}
                    <CardContent
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <Typography gutterBottom variant="h5" component="div">
                        {h.type} - {h.address} {h.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: Rs.{h.price}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          onClick={() => navigate(`/hostel/${h.id}`)}
                          sx={{ background: "#000" }}
                          variant="contained"
                        >
                          View Hostel
                        </Button>
                        <React.Fragment>
                          <Button
                            sx={{
                              background: "#000",
                              border: "none",
                              borderRadius: "3",
                              padding: "7px",
                              color: "#fff",
                            }}
                            variant="outlined"
                            onClick={() => handleOpenHostelDialog(h.id)}
                          >
                            Delete Hostel
                          </Button>
                          <Dialog
                            fullScreen={fullScreen}
                            open={openHostelDialog}
                            onClose={handleCloseHostelDialog}
                            aria-labelledby="responsive-dialog-title"
                          >
                            <DialogTitle id="responsive-dialog-title">
                              {"Do You want to delete this Hostel?"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                If you do, you will lose every details.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                autoFocus
                                onClick={handleCloseHostelDialog}
                              >
                                No
                              </Button>
                              <Button onClick={handleHostelDelete} autoFocus>
                                Yes
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </React.Fragment>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
