import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Checkbox, Grid, Menu, MenuItem, Paper, Stack } from "@mui/material";
import { RiShareForwardLine } from "react-icons/ri";
import ReportPost from "./ReportPost";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import Comments from "./Comments";
import PostContent from "./PostContent";
import PostImgs from "./imgGallary";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import parseDateF from "../../Utilities/ParsingDate";
const formatDate = (created_date) => {
  let date = new Date(created_date);
  return date.toUTCString().slice(0, 16);
};
const Post = ({ id, surfer_info = {}, data, className, style = {} }) => {
  const [LikesCounter, setLikesCounter] = React.useState(data.like_counter);
  const history = useHistory();
  const [like_checked, set_like_checked] = React.useState(data.liked);
  const CommentCounter = data.comment_counter;
  const user = useSelector((state) => state.reducer.user);
  const media =
    data.media.length > 0 ? <PostImgs photos={data.media} /> : <></>;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [openComment, setOpenComment] = React.useState(0);

  const handleCommentClick = () => {
    setOpenComment(!openComment);
  };
  const addToFav = async () => {
    // console.log(data.post_id);
    try {
      await axios.post(`/api/v1/favpost/${data.post_id || data.id}`);
    } catch (err) {
      alert(err.message);
    }
  };
  const openProfile = () => {
    history.push(`/profile/${data.surfer_id}`);
  };
  const likeHandler = async () => {
    try {
      if (like_checked) {
        await axios.post("/api/v1/like/unlike", {
          type: 0,
          post_id: data.post_id || data.id,
          surfer_id: user.id,
        });
        set_like_checked(0);
        setLikesCounter((l) => l - 1);
      } else {
        await axios.post("/api/v1/like/like", {
          type: 0,
          post_id: data.post_id || data.id,
          like_time: parseDateF(Date.now()),
        });
        set_like_checked(1);
        setLikesCounter((l) => l + 1);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <Paper
      style={{ width: "100%", height: "fit-content", ...style }}
      className={className}
    >
      <Card id={id}>
        <CardHeader
          avatar={
            <Avatar
              color="primary"
              aria-label="recipe"
              src={surfer_info.photo}
              onClick={openProfile}
              sx={{ cursor: "pointer" }}
            />
          }
          title={
            <span style={{ color: "#222" }}>
              {surfer_info.fname + " " + surfer_info.lname}
            </span>
          }
          subheader={
            <span style={{ fontSize: ".75rem" }}>
              {formatDate(data.created_date)}
            </span>
          }
          action={
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <FiMoreVertical />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => {
                  setAnchorEl(null);
                }}
              >
                <MenuItem
                  onClick={() => {
                    addToFav();
                    setAnchorEl(null);
                  }}
                >
                  Add To favourite
                </MenuItem>
                {user.id !== data.surfer_id && (
                  <ReportPost reported_id={data.post_id} />
                )}
              </Menu>
            </div>
          }
        />

        <PostContent text={data.post_text} />

        {media}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" marginLeft="1rem" marginRight="auto">
            {!LikesCounter ? null : `${LikesCounter} Reaction`}
          </Typography>
          <Grid container width="fit-content" marginLeft="auto">
            <Typography variant="body2" marginRight=".5rem">
              {!CommentCounter ? null : `${CommentCounter} Comments`}
            </Typography>
          </Grid>
        </Stack>
        {/* {line} */}
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={3}
        >
          <Checkbox
            onClick={likeHandler}
            {...label}
            icon={<MdOutlineFavoriteBorder size={25} />}
            checkedIcon={<MdOutlineFavorite size={25} />}
            checked={like_checked}
          />
          <IconButton aria-label="share" onClick={handleCommentClick}>
            <FaRegComment />
          </IconButton>

          {/* <IconButton aria-label="share">
            <RiShareForwardLine />
          </IconButton> */}
        </Stack>
        <Comments open={openComment} post_id={data.post_id || data.id} />
      </Card>
    </Paper>
  );
};

export default Post;
