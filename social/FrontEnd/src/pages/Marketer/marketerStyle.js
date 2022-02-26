import { makeStyles } from "@mui/styles";
import theme from "../../Utilities/Theme";

const useStyleMarketer = makeStyles({
  marketerTitle: {
    "&.MuiTypography-root": {
      margin: "3.5rem auto 0",
      fontSize: "3rem",
      color: "#444",
      [theme.breakpoints.down("sm")]: {
        fontSize: "2.5rem",
      },
    },
  },
  MarketerImageSection: {
    height: "31.5rem",
    marginBottom: "4rem",
    [theme.breakpoints.down("md")]: {
      height: "29rem",
    },
    [theme.breakpoints.down("sm")]: {
      height: "26.5rem",
    },
  },
});
export default useStyleMarketer;
