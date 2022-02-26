import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Grid, Menu, Paper, Stack } from "@mui/material";
import Rating from "@mui/material/Rating";
import ReportProduct from "./ReportProduct";
import PostContent from "./PostContent";
import PostImgs from "./imgGallary";
import { MdOutlineRateReview } from "react-icons/md";
import { FiMoreVertical as MoreVertIcon } from "react-icons/fi";
import Reviews from "./Reviews";
import { useHistory } from "react-router-dom";

const formatDate = (created_date) => {
  let date = new Date(created_date);
  return date.toUTCString().slice(0, 16);
};

const Product = ({ id, marketer_info = {}, data, className, style = {} }) => {
  const LikesCounter = data.like_counter;
  const ReviewCounter = data.Review_counter;
  const history = useHistory();
  const media =
    data.media.length > 0 ? <PostImgs photos={data.media} /> : <></>;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [RatingValue, setRatingValue] = React.useState(data.avg_rating);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [openComment, setOpenComment] = React.useState(0);
  const handleCommentClick = () => {
    setOpenComment(!openComment);
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
              onClick={() =>
                history.push(
                  `/marketer/${marketer_info.id || marketer_info.marketer_id}`
                )
              }
              sx={{ cursor: "pointer" }}
              color="primary"
              aria-label="recipe"
              src={marketer_info.photo}
            />
          }
          title={
            <span style={{ color: "#222" }}>
              {marketer_info.fname + " " + marketer_info.lname}
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
                <MoreVertIcon />
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
                onClose={handleClose}
              >
                <ReportProduct />
              </Menu>
            </div>
          }
        />
        <PostContent text={data.product_text} />
        {media}
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography variant="body2" marginLeft="1rem" marginRight="auto">
            {!LikesCounter ? null : `${LikesCounter} Reaction`}
          </Typography>
          <Grid container width="fit-content" marginLeft="auto">
            <Typography variant="body2" marginRight=".5rem">
              {!ReviewCounter ? null : `${ReviewCounter} Comments`}
            </Typography>
            <Typography variant="body2" marginRight="1rem">
              {!ReviewCounter ? null : `${ReviewCounter} Shares`}
            </Typography>
          </Grid>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={5}
        >
          <Rating
            defaultValue="1"
            precision=".1"
            size="medium"
            name="read-only"
            value={RatingValue}
            readOnly
          />
          <IconButton onClick={handleCommentClick}>
            <MdOutlineRateReview />
          </IconButton>
        </Stack>
        <Reviews open={openComment} product_id={data.product_id} />
      </Card>
    </Paper>
  );
};

export default Product;
