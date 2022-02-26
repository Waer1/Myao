import {
  Avatar,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";

const Reviews = ({ open, product_id }) => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noComment, setNoComments] = useState(false);
  const [value, setValue] = useState("");
  const [ratingVal, setRatingVal] = useState(2);
  const user = useSelector((state) => state.reducer.user);
  const fetching = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/v1/product/${product_id}/review`);
    console.log(data);
    setInfo([...info, ...data.data]);
    setLoading(false);
    setNoComments(true);
  };

  const createReview = async () => {
    if (value.length > 0) {
      try {
        const date = new Date().toISOString();
        let dataToSend = {
          content: value,
          created_time: (0, date.slice(0, date.indexOf("T"))),
          product_id,
          rating: ratingVal,
          surfer_id: user.id,
        };
        // console.log(dataToSend);
        await axios.post("/api/v1/review", dataToSend);
        dataToSend.fname = user.fname;
        dataToSend.lname = user.lname;
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

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {info.map((el) => (
          <ListItem alignItems="flex-start" key={el.product_id}>
            <ListItemAvatar>
              <Avatar alt={el.marherter_name} src={el.photo} />
            </ListItemAvatar>
            <ListItemText
              primary={`${el.fname} ${el.lname}`}
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
            <Avatar alt="Name" src={user.photo} />
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
                  label="Review"
                  placeholder="give your Review"
                  multiline
                  value={value}
                  sx={{ width: "85%" }}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Rating
                    defaultValue="2"
                    precision=".5"
                    value={ratingVal}
                    onChange={(e, newValue) => setRatingVal(newValue)}
                    size="small"
                    name="read-only"
                    sx={{ marginRight: "auto" }}
                  />
                  <Button
                    onClick={createReview}
                    variant="text"
                    centerRipple
                    size="small"
                    disabled={value.length === 0}
                    startIcon={<BsFillArrowRightCircleFill />}
                  />
                </Stack>
              </Stack>
            }
          />
        </ListItem>
      </List>
    </Collapse>
  );
};

export default Reviews;
