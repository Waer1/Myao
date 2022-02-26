import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { MdProductionQuantityLimits } from "react-icons/md";
import { SiMarketo, SiNamecheap } from "react-icons/si";
import { GiBuyCard } from "react-icons/gi";
import { Box } from "@mui/system";
import UploadButton from "./UploadButton";
import { IoIosImages } from "react-icons/io";
import PostButton from "./PostButton";
import { style as Style } from "./PopPostStyle";
import theme from "../../Utilities/Theme";
import axios from "axios";
import parseDateF from "../../Utilities/ParsingDate";

const CreateProduct = ({ marketer_info = {}, style = {} }) => {
  const [open, setOpen] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [name, setName] = React.useState("");
  const [imgs, setImgs] = React.useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    console.log("ddd");
  };
  const createPost = async () => {
    try {
      if (name.length === 0 || price.length === 0 || value.length === 0) {
        return;
      }
      const form = new FormData();
      imgs.forEach((e) => form.append("media", e));
      form.append("product_text", value);
      form.append("created_date", parseDateF(Date.now()));
      form.append("price", price);
      form.append("product_name", name);
      await axios.post("/api/v1/product", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleClose();
    } catch (err) {
      alert(err);
    }
  };
  const handleImagesArray = (e) => {
    if (e) setImgs([...imgs, e]);
  };
  return (
    <>
      <Paper
        onClick={handleOpen}
        style={{ width: "100%", height: "fit-content" }}
        sx={{ marginTop: "-1rem" }}
      >
        <Card sx={{ width: "100%", cursor: "pointer" }}>
          <CardHeader
            avatar={<Avatar aria-label="recipe" src={marketer_info.photo} />}
            title={
              <span style={{ color: "#222", fontSize: "1rem" }}>
                {marketer_info.fname + " " + marketer_info.lname}
              </span>
            }
          />

          <TextField
            id="standard-textarea"
            label="publish a product"
            variant="standard"
            disabled
            sx={{
              width: "80%",
              margin: "-1rem 0rem 0rem 2rem",
            }}
          />

          <Stack
            sx={{ marginTop: ".7rem", paddingBottom: ".7rem" }}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={8}
          >
            <MdProductionQuantityLimits size="1.8em" color="#7FC15E" />
            <SiMarketo size="1.8em" color={theme.palette.primary.main} />
            <GiBuyCard size="1.8em" color="#70B5F9" />
          </Stack>
        </Card>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{ maxWidth: "40rem", ...Style }}>
          <Box>
            <Typography align="center" variant="h3">
              Publish
            </Typography>
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            style={{ margin: "2rem 1rem 1rem" }}
          >
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-Name">Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-Name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SiNamecheap />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Stack>
          <Stack direction="row" justifyContent="center">
            <TextField
              id="outlined-textarea"
              label="PRODUCT"
              placeholder="Write the discription of the product"
              multiline
              fullWidth
              variant="standard"
              sx={{ maxWidth: "calc(100% - 2rem)" }}
              onChange={(v) => setValue(v.target.value)}
              rows={3}
              autoFocus
            />
          </Stack>
          <Box margin="1rem 0 .5rem">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <UploadButton
                sendimage={handleImagesArray}
                icon={<IoIosImages />}
              />
              <PostButton createPost={createPost} label="Publish" />
            </Stack>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default CreateProduct;
