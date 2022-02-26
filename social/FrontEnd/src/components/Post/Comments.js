import {
  Avatar,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const Comments = ({ open, post_id }) => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noComment, setNoComments] = useState(false);
  const [value, setValue] = useState("");
  const history = useHistory();
  const user = useSelector((state) => state.reducer.user);
  const fetching = async () => {
    setLoading(true);
    const { data } = await axios.patch("/api/v1/comment", { post_id });
    setInfo([...info, ...data.data]);
    setLoading(false);
    setNoComments(true);
  };
  const createComment = async () => {
    if (value.length > 0) {
      try {
        const date = new Date().toISOString();
        let dataToSend = {
          content: value,
          created_time: (0, date.slice(0, date.indexOf("T"))),
          post_id,
        };
        await axios.post("/api/v1/comment", dataToSend);
        dataToSend = { ...dataToSend, ...user };
        setInfo([...info, dataToSend]);
        setValue("");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  useEffect(() => {
    if (open && info.length === 0 && !loading && !noComment) {
      fetching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const goProfile = (el) => {
    history.push(`/profile/${el.surfer_id}`);
  };
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {info.map((el) => (
          <ListItem alignItems="flex-start" key={el.post_id}>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                style={{ cursor: "pointer" }}
                src={el.photo}
                onClick={() => goProfile(el)}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <span
                  onClick={goProfile}
                  style={{ cursor: "pointer" }}
                >{`${el.fname} ${el.lname}`}</span>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {/* {el.created_time.slice(0, el.created_time.indexOf("T"))} */}
                  </Typography>
                  {el.content}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Name" src={user.photo} /> {/*revise*/}
          </ListItemAvatar>
          <ListItemText
            secondary={
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <TextField
                  sx={{ width: "85%" }}
                  label="Comment"
                  placeholder="give your comment"
                  multiline
                  variant="standard"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button
                  onClick={createComment}
                  variant="text"
                  centerRipple
                  size="small"
                  disabled={value.length === 0}
                  startIcon={<BsFillArrowRightCircleFill />}
                />
              </Stack>
            }
          />
        </ListItem>
      </List>
    </Collapse>
  );
};

export default Comments;
