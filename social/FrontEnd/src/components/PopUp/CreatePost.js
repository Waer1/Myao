// import * as React from "react";
// import Backdrop from "@mui/material/Backdrop";
// import Button from "@mui/material/Button";
// import { IoAdd } from "react-icons/io5";
// import { Card, IconButton } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// const useStyle = makeStyles({
//   Button: {
//     "&.MuiButton-root": {
//       width: "fit-content",
//       height: "fit-content",
//       "&:hover": {
//         backgroundColor: "#fff",
//       },
//     },
//   },
// });

// const CreatePost = () => {
//   const [open, setOpen] = React.useState(false);
//   const classes = useStyle();
//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <div style={{ position: "absolute", bottom: "3rem", right: "2rem" }}>
//       <Button onClick={handleToggle} disableRipple className={classes.Button}>
//         <IconButton aria-label="delete" size="small">
//           <IoAdd fontSize="2rem" />
//         </IconButton>
//       </Button>

//       <Backdrop
//         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={open}
//         onClick={handleClose}
//       >
//         <Card>create new post</Card>
//       </Backdrop>
//     </div>
//   );
// };

// export default CreatePost;
