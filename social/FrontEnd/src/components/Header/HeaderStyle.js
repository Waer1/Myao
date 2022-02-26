import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { makeStyles } from "@mui/styles";
import theme from "../../Utilities/Theme";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "40px",
  backgroundColor: "#fff", //alpha(theme.palette.common.white, 0.0),
  "&:hover": {
    backgroundColor: "#fff",
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "80%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "20%",
    marginRight: theme.spacing(10),
  },
  [theme.breakpoints.up("lg")]: {
    marginLeft: theme.spacing(1),
    width: "15%",
    marginRight: "27%",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const useStyle = makeStyles({
  icons: {
    color: theme.palette.secondary.main,
    fontSize: "1.8rem",
    [theme.breakpoints.down("sm")]: {
      color: theme.palette.primary.main,
    },
  },
  appBar: {
    "&.MuiAppBar-root": {
      backgroundColor: "#f3f3f3",
      position: "fixed",
      top: "0",
      zIndex: "10000",
    },
  },
  color: {
    color: "#555",
    transition: "transform .3s linear",
  },
  moveSetting: {
    transform: "rotate(60deg)",
  },
});
