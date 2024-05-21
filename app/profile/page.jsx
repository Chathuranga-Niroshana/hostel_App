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
import TextField from "@mui/material/TextField";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [hostel, setHostel] = useState();
  const [open, setOpen] = useState(false);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        console.log("Hostel Deleted Successfully");
        // Remove the deleted hostel from the state
        setHostel(hostel.filter((h) => h.id !== hostelId));
        handleCloseHostelDialog();
        window.location.reload();
      } else {
        console.log("Hostel Not Deleted");
        handleCloseHostelDialog();
      }
    } catch (error) {
      console.error("Error deleting hostel:", error);
    }
  };

  // update user
  const handleUpdateClickOpen = () => {
    setOpenUpdateUser(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdateUser(false);
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const userData = { username, email, mobile, password };

  const handleUpdateUser = async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      const decodedToken = parseJwt(authToken);
      const userId = decodedToken.user.id;

      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        console.log("User Updated Successfully");
        setOpenUpdateUser(false);
        window.location.reload();
      } else {
        console.log("User Not Updated");
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
        {user &&
          user.map((user) => (
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
                    <td className="border border-gray-300 p-2">
                      {user.email}{" "}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-2">Mobile</th>
                    <td className="border border-gray-300 p-2">
                      {user.mobile}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2 flex items-center justify-evenly ">
                {/* update user */}
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
                    onClick={handleUpdateClickOpen}
                  >
                    Update
                  </Button>
                  <Dialog
                    open={openUpdateUser}
                    onClose={handleUpdateClose}
                    PaperProps={{
                      component: "form",
                      onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleUpdateClose();
                      },
                    }}
                  >
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Update your profile here
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        name="username"
                        label="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        fullWidth
                        variant="standard"
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        fullWidth
                        variant="standard"
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="mobile"
                        name="mobile"
                        label="Mobile No"
                        type="number"
                        onChange={(e) => setMobile(e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleUpdateClose}>Cancel</Button>
                      <Button onClick={handleUpdateUser}>Save</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>

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
          ))}
        <div className="w-1/3 h-[200px] bg-slate-200">
          <div className="mt-2 flex items-center justify-evenly ">
            <button
              onClick={() => navigate("/profile/addhostel")}
              className="bg-black  p-2 text-white w-1/3"
            >
              Add Hostel
            </button>
          </div>
        </div>
      </div>
      <div className=" w-full  min-h-[400px] mt-6">
        <h1 className="mt-4 font-semibold text-purple-700 text-xl">
          My Hostels
        </h1>

        <div className="flex  flex-wrap gap-4 mt-6 bg-slate-900 p-5 w-full min-h-[300px]">
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
                        {h.type} - {h.address} 
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
