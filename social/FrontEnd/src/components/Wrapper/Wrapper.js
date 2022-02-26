import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../Utilities/Theme";
const useStyle = makeStyles({
  page: {
    marginTop: "3rem",
    maxWidth: "75rem",
    margin: "3rem auto 1rem",
    [theme.breakpoints.only("sm")]: {
      maxWidth: "45rem",
    },
  },
});
const Wrapper = ({ children }) => {
  const classes = useStyle();
  return (
    <Grid container justifyContent="center" className={classes.page}>
      {children}
    </Grid>
  );
};
export default Wrapper;
