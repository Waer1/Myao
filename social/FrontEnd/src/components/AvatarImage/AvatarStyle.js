import { makeStyles } from "@mui/styles";

const useStyle = makeStyles({
  avatarContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "50%",
    cursor: "pointer",
    "&:hover": {
      "& > :nth-child(2)": {
        top: "65%",
      },
    },
  },
  avatar: {},
  camera: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    position: "absolute",
    top: "100%",
    transition: "all .5s ease-out",
    opacity: ".5",
    "& > *": {
      color: "#fff",
      fontSize: "2.6rem",
      marginTop: "4px",
    },
  },
});
export default useStyle;
