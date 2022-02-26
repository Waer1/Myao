import React, { useState } from "react";
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
} from "@mui/material";
import { AiOutlinePlusCircle } from "react-icons/ai";

//////////////////////
import ImageSlider from "./ImgSlider";

////////////////////////

const PostImgs = ({ photos = [] }) => {
  const [open, setOpen] = React.useState(false);
  const photolength = photos.length;
  // console.log(photos[0]);
  const handleOpen = (ind) => {
    setImgIndex(ind);
    setOpen(true); /* get the img postio in array*/
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [imgIndex, setImgIndex] = useState();

  let imgs;
  if (photolength > 3)
    imgs = (
      <ImageList
        gap={3}
        rowHeight={121}
        variant="quilted"
        sx={{
          width: "100%",
          height: "auto",
          overflow: "hidden",
        }}
        cols={3}
      >
        <ImageListItem
          rows={2}
          cols={5}
          sx={{
            margin: "0px",
          }}
        >
          <img src={photos[0]} alt={photos[0]} onClick={() => handleOpen(0)} />
        </ImageListItem>
        <ImageListItem rows={1} cols={2} sx={{}}>
          <img
            src={photos[1]}
            alt={photos[1]}
            onClick={() => {
              handleOpen(1);
            }}
          />
        </ImageListItem>
        <ImageListItem rows={1} cols={3} sx={{ height: "150%" }}>
          <img
            src={photos[2]}
            alt={photos[2]}
            onClick={() => {
              handleOpen(2);
            }}
          />
          <ImageListItemBar
            position="top"
            sx={{ height: "100%" }}
            actionIcon={
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                }}
                onClick={() => {
                  handleOpen(2);
                }}
              >
                <AiOutlinePlusCircle />
              </IconButton>
            }
          />
        </ImageListItem>
      </ImageList>
    );

  if (photolength === 3)
    imgs = (
      <ImageList
        gap={1}
        rowHeight={121}
        variant="quilted"
        sx={{ width: "100%", height: "auto", overflow: "hidden" }}
        cols={3}
      >
        <ImageListItem rows={2} cols={5}>
          <img
            src={photos[0]}
            alt={photos[0]}
            onClick={() => {
              handleOpen(0);
            }}
          />
        </ImageListItem>
        <ImageListItem rows={1} cols={2}>
          <img
            src={photos[1]}
            alt={photos[1]}
            onClick={() => {
              handleOpen(1);
            }}
          />
        </ImageListItem>
        <ImageListItem rows={1} cols={3}>
          <img
            src={photos[2]}
            alt={photos[2]}
            onClick={() => {
              handleOpen(2);
            }}
          />
        </ImageListItem>
      </ImageList>
    );

  if (photolength === 2)
    imgs = (
      <ImageList
        gap={1}
        rowHeight={121}
        variant="quilted"
        sx={{ width: "100%", height: "auto", overflow: "hidden" }}
        cols={1}
      >
        <ImageListItem cols={2} sx={{ transform: "scale(1,1.2)" }}>
          <img
            src={photos[0]}
            alt={photos[0]}
            onClick={() => {
              handleOpen(0);
            }}
          />
        </ImageListItem>
        <ImageListItem cols={2} sx={{ transform: "scale(1,.8)" }}>
          <img
            src={photos[1]}
            alt={photos[1]}
            onClick={() => {
              handleOpen(1);
            }}
          />
        </ImageListItem>
      </ImageList>
    );

  if (photolength === 1)
    imgs = (
      <ImageList
        gap={1}
        rowHeight={121}
        variant="quilted"
        sx={{ width: "100%", height: "auto", overflow: "hidden" }}
        cols={1}
      >
        <ImageListItem rows={2} cols={2} sx={{ transform: "scale(1,1.2)" }}>
          <img
            src={photos[0]}
            alt={photos[0]}
            onClick={() => {
              handleOpen(0);
            }}
          />
        </ImageListItem>
      </ImageList>
    );

  return (
    <>
      {imgs}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ width: "50%", margin: "auto" }}
      >
        <ImageSlider SliderData={photos} currentimg={imgIndex} />
      </Modal>
    </>
  );
};

export default PostImgs;
