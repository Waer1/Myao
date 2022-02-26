import { makeStyles } from "@mui/styles";
import theme from "../../Utilities/Theme";

const useStyle = makeStyles({
  Page: {
    padding: "3rem",
  },
  Avatar: {
    width: "8rem",
    height: "8rem",
    backgroundColor: "red",
  },
  container1: {
    padding: "3rem 0",
    maxWidth: "40rem",
    width: "5vw",
  },
  line: {
    height: "1px",
    margin: "1rem 0 2.3rem",
    width: "100%",
    backgroundColor: "#aaa",
  },
  changePass: {
    width: "20rem",
    "&.MuiButton-root": {
      margin: "auto",
      padding: ".7rem 0",
      fontWeight: "600",
      //   letterSpacing: "1px",
      wordSpacing: "1px",
      borderRadius: "0",
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
});

export default useStyle;
