import { makeStyles } from "@mui/styles";
import theme from "../../Utilities/Theme";
const leftMargin = "3rem";
const leftMarginSm = "1.5rem";
const useStyle = makeStyles({
  page: {
    "&.MuiGrid-root": {
      margin: ".5rem auto",
      maxWidth: "70rem",
      [theme.breakpoints.down("lg")]: {
        width: "43rem",
        maxWidth: "95%",
      },
    },
  },
  imageSection: {
    marginBottom: "4rem",
    paddingBottom: "2rem",
    [theme.breakpoints.down("lg")]: {
      marginBottom: "2rem",
    },
  },
  secondImage: {
    position: "relative",
    height: "20rem",
    backgroundColor: "#aaa",
    [theme.breakpoints.down("lg")]: {
      height: "15rem",
    },
    [theme.breakpoints.down("sm")]: {
      height: "13rem",
    },
  },
  cover: {
    position: "absolute",
    top: "100%",
    transform: "translate(2.5rem,-65%)",
    maxWidth: "10rem",
    height: "10rem",
    backgroundColor: "#fff",
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "9rem",
      height: "9rem",
      transform: "translate(1.5rem,-65%)",
    },
  },
  cover_marketer: {
    top: "100%",
    left: "50%",
    transform: "translate(-50%,-65%)",
    [theme.breakpoints.down("sm")]: {
      transform: "translate(-50%,-65%)",
    },
  },
  personName: {
    "&.MuiTypography-root": {
      margin: "4.5rem 0 .25rem",
      marginLeft: leftMargin,
      fontWeight: "500",
      [theme.breakpoints.down("sm")]: {
        margin: "4rem 0 .25rem",
        marginLeft: leftMarginSm,
      },
    },
  },
  address: {
    "&.MuiTypography-root": {
      marginLeft: leftMargin,
      [theme.breakpoints.down("sm")]: {
        marginLeft: leftMarginSm,
      },
    },
  },
  role: {
    "&.MuiTypography-root": {
      marginLeft: leftMargin,
      color: "#666",
      fontSize: "1rem",
      marginBottom: ".25rem",
      [theme.breakpoints.down("sm")]: {
        marginLeft: leftMarginSm,
        fontSize: ".9rem",
      },
    },
  },
  AddButton: {
    "&.MuiButton-root": {
      textTransform: "none",
      borderRadius: "1000rem",
      marginLeft: leftMargin,
      marginTop: "1.5rem",
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: leftMarginSm,
        fontSize: ".9rem",
      },
    },
  },
  reportButton: {
    "&.MuiButton-root": {
      marginLeft: ".7rem",
      color: "#999",
      border: "2px solid #999",
      padding: "4.5px 9px",
      "&:hover": {
        border: "2px solid #999",
        backgroundColor: "#eee",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: ".9rem",
      },
    },
  },
  friendSection: {
    padding: "1rem",
    marginBottom: "2rem",
  },
  scrollFunc: {
    "&.MuiGrid-root": {
      [theme.breakpoints.up("lg")]: {
        width: "29.2rem",
      },
    },
  },
  rightSection: {
    [theme.breakpoints.up("lg")]: {
      // height: "52.5rem",
      paddingLeft: "1rem",
    },
  },
  post: {
    "&.MuiPaper-root": {
      marginBottom: "1rem",
    },
  },
});
export default useStyle;
