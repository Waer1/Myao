import { Avatar, Grid, IconButton, Paper, Typography } from "@mui/material";
import { SiAdblock } from "react-icons/si";
import { MdAdminPanelSettings } from "react-icons/md";
import useStyle from "./ProfileStyle";
import LeftSection from "./LeftSection";
import GetPosts from "../GlobalForAll/GetPosts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendSectionButton from "./firstSectionButton";
import axios from "axios";
const ProfilePage = () => {
  const classes = useStyle();
  const { user } = useSelector((state) => state.reducer);
  const [profileUser, setProfileUser] = useState(user);
  const params = useParams();
  useEffect(() => {
    const fetchingFunc = async () => {
      const { data } = await axios.get(`/api/v1/surfer/${params.id}`);
      setProfileUser(data.data[0]);
    };
    try {
      if (user.id !== params.id) {
        fetchingFunc();
      }
    } catch (err) {
      alert(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);
  // useEffect(() => {
  //   let leftSectionElement = document.getElementById("leftSectionProfile");

  //   document.addEventListener("scroll", () => {
  //     if (window.innerWidth >= Theme.breakpoints.values.lg) {
  //       if (window.scrollY > 806.4000244140625) {
  //         leftSectionElement.style.position = "fixed";
  //         leftSectionElement.style.bottom = "0";
  //       } else if (window.scrollY < 806.4000244140625) {
  //         leftSectionElement.style.position = "relative";
  //       }
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const makeAdmin = async () => {
    try {
      await axios.post("/api/v1/user/changeRole", {
        oldRole: "surfer",
        newRole: "admin",
        user_id: profileUser.id,
        newData: {
          type: 1,
        },
      });
    } catch (err) {
      alert(err.message);
    }
  };
  const handleBlock = async () => {
    await axios.patch(`/api/v1/surfer/${params.id}`, {
      is_active: 0,
    });
  };
  return (
    <Grid container className={classes.page} direction="column">
      <Paper className={classes.imageSection} elevation={3}>
        <Grid container className={classes.secondImage}>
          {profileUser.cover_photo && (
            <img
              alt="coverimage"
              src={profileUser.cover_photo}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          <Grid
            container
            className={classes.cover}
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              sx={{ width: "95%", height: "95%" }}
              src={profileUser.photo}
            ></Avatar>
          </Grid>
        </Grid>

        <Typography variant="h2" className={classes.personName}>
          {`${profileUser.fname} ${profileUser.lname}`}{" "}
          {user.role === "admin" && (
            <>
              <IconButton size="medium">
                <SiAdblock style={{ fontSize: "2rem" }} onClick={handleBlock} />
              </IconButton>
              <IconButton size="medium" onClick={makeAdmin}>
                <MdAdminPanelSettings style={{ fontSize: "2rem" }} />
              </IconButton>
            </>
          )}
        </Typography>
        <Typography variant="subtitle1" className={classes.role}>
          {profileUser.jop && `${profileUser.jop}`}
        </Typography>
        <Typography variant="subtitle1" className={classes.address}>
          {profileUser.address && `${profileUser.address}`}
        </Typography>
        {params.id !== user.id && user.role === "surfer" && (
          <FriendSectionButton source_id={user.id} target_id={params.id} />
        )}
      </Paper>
      <Grid container>
        <Grid item sm={12} lg={5} style={{ height: "fit-content" }}>
          <LeftSection user={user} />
        </Grid>
        <Grid container className={classes.rightSection} item lg={7}>
          <Grid container style={{ height: "fit-content" }}>
            <GetPosts
              className={classes.post}
              linkOfFetching={`/api/v1/surfer/${params.id}/post`}
            />
            <div style={{ height: "1rem", width: "100%" }}></div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
