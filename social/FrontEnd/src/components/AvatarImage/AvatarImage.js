import { Avatar, Grid } from "@mui/material";
import useStyle from "./AvatarStyle";
import { AiFillCamera } from "react-icons/ai";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
const AvatarImage = ({ sendImage }) => {
  const classes = useStyle();
  const ref = useRef();
  const user = useSelector((state) => state.reducer.user);
  const [image, setImage] = useState(user.photo);
  const [sentImg, setSentImg] = useState();
  const uploadImage = () => {
    ref.current.click();
  };
  const changeProfileImg = async () => {
    if (ref.current.files[0]) {
      setImage(URL.createObjectURL(ref.current.files[0]));
      setSentImg(ref.current.files[0]);
    }
  };
  sendImage(sentImg);
  return (
    <Grid item className={classes.avatarContainer}>
      <Avatar
        src={!image ? user.photo : image}
        sx={{ width: "11rem", height: "11rem" }}
        className={classes.avatar}
        onClick={uploadImage}
      />
      <Grid
        container
        justifyContent="center"
        className={`${classes.camera} cccc`}
      >
        <AiFillCamera />
      </Grid>
      <form>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          id="settingImage"
          onChange={changeProfileImg}
        />
      </form>
    </Grid>
  );
};
export default AvatarImage;
