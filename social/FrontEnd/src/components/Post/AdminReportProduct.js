import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { Box, Paper, Typography } from "@mui/material";
import PostContent from "./PostContent";
import PostImgs from "./imgGallary";
import { IoHandRightSharp } from "react-icons/io5";
import { BsHandThumbsUpFill } from "react-icons/bs";
import theme from "../../Utilities/Theme";
import { useHistory } from "react-router-dom";

const formatDate = (created_date) => {
  let date = new Date(created_date);
  return date.toUTCString().slice(0, 16);
};

const AdminReportProduct = ({
  marketer_info = {},
  data,
  className = {},
  style = [],
  handleBlock,
  index,
}) => {
  const media =
    data.media.length > 0 ? <PostImgs photos={data.media} /> : <></>;
  const history = useHistory();
  return (
    <Paper
      style={{ width: "100%", height: "fit-content", ...style }}
      className={className}
    >
      <Card>
        <CardHeader
          avatar={
            <Avatar
              color="primary"
              aria-label="recipe"
              src={marketer_info.photo} // revise
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push(`/marketer/${data.marketer_id}`);
              }}
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
                size="medium"
                aria-label="delete this post"
                aria-haspopup="true"
                onClick={() => handleBlock(index, data, 0)}
                color="inherit"
              >
                <BsHandThumbsUpFill style={{ color: "#aaa" }} />
              </IconButton>
              <IconButton
                size="medium"
                aria-label="delete this post"
                aria-haspopup="true"
                onClick={() => handleBlock(index, data, 1)}
                color="inherit"
              >
                <IoHandRightSharp style={{ color: "#aaa" }} />
              </IconButton>
            </div>
          }
        />
        <PostContent text={data.product_text} style={{ minHeight: "1rem" }} />

        {/* <Box style={{ marginLeft: "1rem" }}>
          <Typography
            variant="body2"
            sx={{ fontSize: "1.3rem", fontWeight: "500" }}
          >
            Report reason
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: "1rem", color: theme.palette.warning.main }}
          >
            this report becaue its not good
          </Typography>
        </Box> */}

        {media}
      </Card>
    </Paper>
  );
};

export default AdminReportProduct;
