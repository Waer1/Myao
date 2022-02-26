import { Button, Grid } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import AvatarImage from "../../components/AvatarImage/AvatarImage";
import InputFieldSimple from "../../components/InputField.js/InputField";
import useStyle from "./settingStyle";

const SettingPage = () => {
  const classes = useStyle();
  const { user } = useSelector((state) => state.reducer);
  const [oldPass, setOldPass] = useState("");
  const [newPassword, SetNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [oldPassError, setOldPassError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPassConfirmError, setNewPassConfirmError] = useState(false);
  const [address, setAddress] = useState(
    user.address === null ? "" : user.address
  );
  const [cover,setCover] = useState(user.cover_photo);
  const [coverLink,setCoverLink] = useState(user.cover_photo);
  const [education, setEducation] = useState(
    user.education === null ? "" : user.education
  );
  const [img, setImg] = useState();
  const recieveImage = (image) => {
    if (image && image !== img) {
      setImg(image);
    }
  };
  const buttonDisabled =
    oldPassError ||
    newPassConfirmError ||
    newPasswordError ||
    oldPass.length === 0 ||
    newPassword.length === 0 ||
    newPasswordConfirm.length === 0;
  const infoButtonsDisabled =
    (user.education || "") == education && (user.address || "") == address;
  const ref = useRef()
  const backToDefault = () => {
    setAddress(user.address || "");
    setEducation(user.education || "");
  };
  const updateInfo = async () => {
    const res = await axios.patch("/api/v1/user/me", {
      address,
      education,
    });
    console.log(res);
  };
  const oldPassHandler = (e) => {
    setOldPass(e.target.value);
    if (e.target.value === "") return setOldPassError(false);
    if (e.target.value.length < 8) return setOldPassError(true);
    setOldPassError(false);
  };
  const newPassHandler = (e) => {
    SetNewPassword(e.target.value);
    if (e.target.value === "") return setNewPasswordError(false);
    if (e.target.value.length < 8) return setNewPasswordError(true);
    setNewPasswordError(false);
  };
  const newPassConfirmHandler = (e) => {
    setNewPasswordConfirm(e.target.value);
    if (e.target.value === "") return setNewPassConfirmError(false);
    if (e.target.value.length < 8 || e.target.value !== newPassword) {
      return setNewPassConfirmError(true);
    }
    setNewPassConfirmError(false);
  };
  const changePassHandler = async () => {
    try {
      const d = await axios.post("/api/v1/user/changePassword", {
        currentPassword: oldPass,
        newPassword,
        newPasswordConfirm,
        role: "surfer",
      });
      console.log(d);
    } catch (err) {
      console.log(err);
    }
  };
  const uploadThePhoto = async () => {
    console.log(cover);
    if (img || cover) {
      try {
        const form = new FormData();
        if(img)
          form.append("photo", img);
        if(cover)
          form.append("cover_photo",cover);
        await axios.patch("/api/v1/user/me", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (err) {
        alert("error");
      }
    }
  };
  const changeProfileCover = (e)=>{
    if (ref.current.files[0]) {
      setCoverLink(URL.createObjectURL(ref.current.files[0]));
      setCover(ref.current.files[0]);
    }
  }
  
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.Page}
      >
      <Grid container height="14rem" onClick={()=>ref.current.click()} sx={{padding:"0"}} style={{marginBottom:"2rem",backgroundColor:"#aaa"}} className={classes.container1}>
        {cover &&<img style={{width:"100%",height:"100%"}} src={coverLink}></img>}
      </Grid>
       <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          // id="settingImage"
          onChange={changeProfileCover}
        />
      <AvatarImage sendImage={recieveImage} />
      <Grid container direction="column" className={classes.container1}>
        {/* information just for showing */}
        <InputFieldSimple label="Email" disable={true} value={user.email} />
        <InputFieldSimple
          label="Name"
          disable={true}
          value={`${user.fname} ${user.lname}`}
        />
        <Button
          variant="contained"
          className={classes.changePass}
          style={{ marginBottom: "1rem" }}
          onClick={uploadThePhoto}
          disabled={!img && !cover}
          disableRipple
        >
          Upload The Image
        </Button>
        <div className={classes.line} />
        {/* <InputFieldSimple label="" /> */}
        <InputFieldSimple
          label="Current Password"
          placeholder="Current Password"
          error={oldPassError}
          onChange={oldPassHandler}
          type="password"
        />
        <InputFieldSimple
          label="New Password"
          placeholder="New Password"
          error={newPasswordError}
          onChange={newPassHandler}
          type="password"
        />
        <InputFieldSimple
          label="Confirm Password"
          placeholder="Confirm your Password"
          type="password"
          error={newPassConfirmError}
          onChange={newPassConfirmHandler}
        />
        <Button
          variant="contained"
          className={classes.changePass}
          disableRipple
          disabled={buttonDisabled}
          onClick={changePassHandler}
        >
          Change password
        </Button>
        <div className={classes.line} />
        {user.role === "surfer" && (
          <>
            <InputFieldSimple
              label={
                user.address === null
                  ? "add your address"
                  : "change your address"
              }
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <InputFieldSimple
              label={
                user.education === null
                  ? "add your education"
                  : "change your education"
              }
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
            <Grid container>
              <Button
                variant="contained"
                className={classes.changePass}
                disableRipple
                disabled={infoButtonsDisabled}
                onClick={updateInfo}
                style={{ width: "15rem" }}
              >
                update information
              </Button>
              <Button
                variant="contained"
                className={classes.changePass}
                style={{ width: "15rem" }}
                disableRipple
                disabled={infoButtonsDisabled}
                onClick={backToDefault}
              >
                back to default
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default SettingPage;
