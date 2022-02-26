import React from "react";
import Typography from "@mui/material/Typography";
import { CardContent } from "@mui/material";
import ShowMoreText from "react-show-more-text";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const PostContent = ({ text, style = {} }) => {
  return (
    <CardContent sx={{ padding: "1rem 1rem 0", minHeight: "2rem", ...style }}>
      <ShowMoreText
        lines={3}
        more={<MdExpandMore title="Show More" />}
        less={<MdExpandLess title="Show Less" />}
        className="content-css"
        anchorClass="my-anchor-css-class"
        expanded={false}
      >
        <Typography>{text}</Typography>
      </ShowMoreText>
    </CardContent>
  );
};

export default PostContent;
