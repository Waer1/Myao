import * as React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { AiOutlineCamera as PhotoCamera } from "react-icons/ai";
import Stack from "@mui/material/Stack";

const Input = styled("input")({
  display: "none",
});

const UploadButton = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor="icon-button-file">
        <Input accept="image/*" id="icon-button-file" type="file" />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </Stack>
  );
};

export default UploadButton;
