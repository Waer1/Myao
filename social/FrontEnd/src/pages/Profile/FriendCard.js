import { Avatar, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import theme from "../../Utilities/Theme";

const useStyle = makeStyles({
  imageCont: {
    width: "100%",
    height: "0",
    position: "relative",
    paddingBottom: "100%",
  },
  image: {
    "&.MuiAvatar-root": {
      position: "absolute",
      borderRadius: ".5rem",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    },
  },
  name: {
    "&.MuiTypography-root": {
      fontSize: ".9rem",
      [theme.breakpoints.down("sm")]: {
        fontSize: ".68rem",
      },
    },
  },
  card: {
    margin: ".8rem 0",
    position: "relative",
    width: "100%",
  },
});
const FriendCard = ({ name, imageLink = undefined, photo ,id}) => {
  const classes = useStyle();
  const history = useHistory();
  useEffect(() => {}, []);

  return (
    <Grid container direction="column">
      <div className={classes.card} >
        <div className={classes.imageCont}></div>
        <Avatar src={imageLink} className={classes.image}></Avatar>
      </div>
      <Typography variant="h5" className={classes.name}>
        {name}
      </Typography>
    </Grid>
  );
};

export default FriendCard;
