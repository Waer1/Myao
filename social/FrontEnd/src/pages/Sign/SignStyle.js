import { makeStyles } from "@mui/styles";
import theme from "../../Utilities/Theme";

const useStyle = makeStyles({
  SignPage: {
    minHeight: "100vh",
    padding: "2%",
  },
  logo: {
    maxWidth: "3.5rem",
    margin: "auto",
  },
  SignCard: {
    maxWidth: "30rem",
    height: "fit-content",
    boxSizing: "unset",
    borderRight: `4px solid ${theme.palette.primary.main}`,
    borderBottom: `4px solid ${theme.palette.primary.main}`,
    padding: "1.5rem",
  },
  SignWord: {
    textAlign: "center",
    margin: ".25rem 0 .5rem !important",
    color: theme.palette.primary.main,
  },
  Button: {
    // borderRadius: "0 !important",
    width: "100%",
    "&.MuiButton-root": {
      "&:hover": {
        backgroundColor: theme.palette.primary.main + " !important",
      },
      padding: ".5rem 0",
      borderRadius: "0",
      color: "white",
      fontWeight: "500",
      letterSpacing: "1px",
      textTransform: "none",
      marginTop: "-.2rem",
    },
  },
  loginButton: {
    color: theme.palette.secondary.main,
    cursor: "pointer",
  },
});
export default useStyle;
