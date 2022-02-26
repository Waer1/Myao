import { Avatar, Grid, Paper, Typography } from "@mui/material";
import useStyle from "./HomeStyle";
import { useSelector } from "react-redux";
import SurferCard from "../../components/surferCard/surferCard";
const LeftSection = () => {
  const classes = useStyle();
  const { user } = useSelector((state) => state.reducer);
  return (
    <>
      <Grid container justifyContent="flex-end">
        <Grid item className={classes.LeftSection}>
          <SurferCard
            user={user}
            newThings={
              <Typography variant="subtitle1" className={classes.margin}>
                {user.job ? user.job : "NO RULE SPECIFIED"}
              </Typography>
            }
          />
        </Grid>
        {/* <Paper className={classes.LeftSection}>
          <Grid container direction="column" alignItems="center">
            <Grid
              container
              justifyContent="center"
              className={classes.avatarContainer}
            >
              <Avatar src={user.photo} className={classes.avatarleft} />
            </Grid>
            <Typography
              variant="h5"
              className={`${classes.nameLeft} ${classes.margin}`}
            >
              {user.fname + " " + user.lname}
            </Typography>
            <Typography variant="subtitle1" className={classes.margin}>
              {user.job ? user.job : "NO RULE SPECIFIED"}
            </Typography>
          </Grid>
        </Paper> */}
      </Grid>
    </>
  );
};
export default LeftSection;
