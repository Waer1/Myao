import { Grid, Paper, Typography } from "@mui/material";
import { AiFillHome } from "react-icons/ai";
import { IoMdSchool } from "react-icons/io";
import { MdWork } from "react-icons/md";

import useStyle from "./ProfileStyle";
import FriendCard from "./FriendCard";
import { useEffect, useState } from "react";
import axios from "axios";
const LeftSection = ({ user }) => {
  const classes = useStyle();
  const [Friends, setFriends] = useState([]);
  useEffect(() => {
    const asyncFunction = async () => {
      const { data } = await axios.get("/api/v1/friend/myFriends");
      console.log(data.data);
      setFriends([...data.data]);
    };
    asyncFunction();
  }, []);
  const infoKeys = {
    education: { convertTo: "studied at", icon: <IoMdSchool /> },
    address: { convertTo: "Lives in", icon: <AiFillHome /> },
    interests: { convertTo: "interests in", icon: <AiFillHome /> },
    job: { convertTo: "works as", icon: <MdWork /> },
    birth_date: { convertTo: "was born at", icon: <MdWork /> },
  };

  const about = {
    address: user.address,
    education: user.education,
    birth_date: !user.birth_date ? undefined : user.birth_date.slice(0, 10),
    interests: user.interests,
    job: user.jop,
  };
  return (
    <Grid
      container
      direction="column"
      height="fit-content"
      id="leftSectionProfile"
      className={classes.scrollFunc}
    >
      {Friends.length !== 0 && (
        <Paper
          // style={{ backgroundColor: "red" }}
          style={{
            paddingBottom:
              Friends.length === 3
                ? "2rem"
                : Friends.length === 2
                ? "4rem"
                : Friends.length === 1
                ? "5rem"
                : undefined,
          }}
          className={classes.friendSection}
        >
          <Grid container justifyContent="space-between">
            <Grid container style={{ margin: "0 0 0 1rem" }}>
              <Typography variant="h2">Friends</Typography>
            </Grid>
            <Grid container spacing={1.5}>
              {Friends.map((el, i) => {
                return (
                  <Grid item xs={4} key={el}>
                    <FriendCard
                      imageLink={el[0].photo}
                      key={i}
                      id={el[0].surfer_id || el[0].id}
                      name={`${el[0].fname} ${el[0].lname}`}
                    ></FriendCard>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper className={classes.friendSection}>
        <Grid container style={{ margin: "1rem 0", paddingRight: ".5rem" }}>
          <Typography variant="h2">About</Typography>

          <Grid container direction="column">
            {Object.keys(about).map((el) => {
              return (
                about[el] && (
                  <Grid
                    item
                    container
                    key={el}
                    style={{
                      marginLeft: "0.5rem",
                      marginTop: "1.3rem",
                      fontSize: ".8rem",
                    }}
                    columnSpacing={1}
                  >
                    <Grid
                      item
                      style={{
                        marginRight: ".5rem",
                        color: "#aaa",
                        paddingTop: ".1rem",
                      }}
                    >
                      {infoKeys[el].icon}
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h5" style={{ fontWeight: "normal" }}>
                        {infoKeys[el].convertTo} {about[el]}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              );
            })}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
export default LeftSection;
