import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { BiSend as SendIcon } from "react-icons/bi";

const PostButton = () => {
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
    setTimeout(() => {
      setLoading(0);
    }, 2000);
  }

  return (
    <LoadingButton
      onClick={handleClick}
      endIcon={<SendIcon />}
      loading={loading}
      loadingPosition="end"
      variant="contained"
    >
      Post
    </LoadingButton>
  );
};

export default PostButton;
