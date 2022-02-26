import { Avatar, Grid, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
const useStyle = makeStyles({
  avatarContainer: {
    position: "relative",
    height: "5rem",
    marginBottom: "2.5rem",
    borderRadius: "5px 5px 0 0",
    backgroundColor: "#ccc",
    cursor: "pointer",
  },
  avatarleft: {
    "&.MuiAvatar-root": {
      width: "4.5rem",
      height: "4.5rem",
      marginBottom: "1.5rem",
      position: "absolute",
      top: "100%",
      transform: "translateY(-50%)",
    },
  },
  nameLeft: {
    cursor: "pointer",
    "&.MuiTypography-root": {
      color: "#333",
      fontWeight: "500",
      marginBottom: "5px",
    },
  },
  margin: {
    "&.MuiTypography-root": {
      marginLeft: "1rem",
      marginRight: "1rem",
      marginBottom: "1rem",
    },
    textAlign: "center",
  },
});
const MarketerCard = ({
  user = {},
  newThings = null,
  id_given = undefined,
}) => {
  const classes = useStyle();
  const history = useHistory();
  function goProfile() {
    const id = id_given === undefined ? user.id : id_given;
    history.push("/marketer/" + id);
  }
  return (
    <Paper style={{ width: "100%" }}>
      <Grid container direction="column" alignItems="center">
        <Grid
          container
          justifyContent="center"
          className={classes.avatarContainer}
          onClick={goProfile}
        >
          <Avatar src={user.photo} className={classes.avatarleft} />
        </Grid>
        <Typography
          variant="h5"
          className={`${classes.nameLeft} ${classes.margin}`}
          onClick={goProfile}
        >
          {user.fname + " " + user.lname}
        </Typography>
        {newThings}
        {/* <Typography variant="subtitle1" className={classes.margin}>
          {user.job ? user.job : "NO RULE SPECIFIED"}
        </Typography> */}
      </Grid>
    </Paper>
  );
};
export default MarketerCard;
