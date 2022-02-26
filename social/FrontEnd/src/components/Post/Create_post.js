import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Modal, Paper, Stack, TextField } from "@mui/material";
import { HiPhotograph } from "react-icons/hi";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { AiFillCamera } from "react-icons/ai";
import { Box } from "@mui/system";
import UploadButton from "./UploadButton";
import PostButton from "./PostButton";
import { style as Style, Item } from "./PopPostStyle";
import theme from "../../Utilities/Theme";
import axios from "axios";
import parseDateF from "../../Utilities/ParsingDate";

const CreatePost = ({ surfer_info = {}, style = {} }) => {
  const [open, setOpen] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [imgs, setImgs] = React.useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    console.log("ddd");
  };
  const createPost = async () => {
    try {
      const form = new FormData();
      imgs.forEach((e) => form.append("media", e));
      form.append("post_text", value);
      form.append("created_date", parseDateF(Date.now()));
      await axios.post("/api/v1/post", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleClose();
    } catch (err) {
      alert(err);
    }
  };
  const handleImagesArray = (e) => {
    if (e) setImgs([...imgs, e]);
  };
  return (
    <>
      <Paper
        onClick={handleOpen}
        style={{ width: "100%", height: "fit-content", ...style }}
      >
        <Card sx={{ width: "100%", cursor: "pointer" }}>
          <CardHeader
            avatar={<Avatar aria-label="recipe" src={surfer_info.photo} />}
            title={
              <span style={{ color: "#222", fontSize: "1rem" }}>
                {surfer_info.fname + " " + surfer_info.lname}
              </span>
            }
          />

          <TextField
            id="standard-textarea"
            label="write your opinon"
            variant="standard"
            disabled
            sx={{
              width: "80%",
              margin: "0rem 0rem 0rem 2rem",
            }}
          />

          <Stack
            sx={{ marginTop: ".7rem", paddingBottom: ".7rem" }}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={8}
          >
            <HiPhotograph size="1.8em" color="#7FC15E" />
            <BsFillCameraVideoFill
              size="1.8em"
              color={theme.palette.primary.main}
            />
            <AiFillCamera size="1.8em" color="#70B5F9" />
          </Stack>
        </Card>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{ maxWidth: "40rem", ...Style }}>
          <Box>
            <Typography align="center" variant="h3">
              Create Post
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center">
            <Item elevation="0">
              <Avatar src={surfer_info.photo} sx={{ width: 56, height: 56 }} />
            </Item>
            <Item elevation="0">
              <Typography variant="h5">
                {surfer_info.fname + " " + surfer_info.lname}
              </Typography>
            </Item>
          </Stack>

          <Stack direction="row" justifyContent="center">
            <TextField
              id="outlined-textarea"
              label="Post"
              placeholder="What Do You Think about"
              multiline
              fullWidth
              variant="standard"
              sx={{ maxWidth: "calc(100% - 2rem)" }}
              onChange={(v) => setValue(v.target.value)}
              rows={5}
              autoFocus
            />
          </Stack>
          <Box margin="1rem 0 .5rem">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <UploadButton sendimage={handleImagesArray} />
              <PostButton createPost={createPost} />
            </Stack>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default CreatePost;
