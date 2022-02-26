import { Box, ImageListItem } from "@mui/material";
import React, { useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import {
  slider,
  image,
  right_arrow,
  left_arrow,
  slide_active,
} from "./imgSliderStyles.js";

const ImageSlider = ({ SliderData, currentimg }) => {
  const [current, setCurrent] = useState(currentimg);
  const length = SliderData.length;
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(SliderData) || SliderData.length <= 0) {
    return null;
  }

  return (
    <Box sx={slider}>
      <Box sx={left_arrow}>
        <FaArrowAltCircleLeft onClick={prevSlide} />
      </Box>
      <Box sx={right_arrow}>
        <FaArrowAltCircleRight onClick={nextSlide} />
      </Box>
      <Box sx={slide_active}>
        <ImageListItem sx={image}>
          <img alt="post_photo" src={SliderData[current]} />
        </ImageListItem>
      </Box>
    </Box>
  );
};

export default ImageSlider;
