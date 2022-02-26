const { makeStyles } = require("@mui/styles");

const useStyle = makeStyles({
  block_sur_button: {
    "&.MuiButton-root": {
      color: "white",
      marginTop: ".8rem",
      width: "90%",
    },
  },
  ignore_sur_button: {
    "&.MuiButton-root": {
      color: "white",
      margin: ".5rem 0",
      width: "90%",
    },
  },
});
export default useStyle;
