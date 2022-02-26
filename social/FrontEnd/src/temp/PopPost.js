import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { Avatar, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { style , Item } from './PopPostStyle';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import UploadButton from './UploadButton';
import PostButton from './PostButton';
import img from "../IMG_20200124_165226.jpg"


const PopPost = () => {
const [open, setOpen] = React.useState(false);
const [value, setValue] = React.useState('Controlled');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleOpen = () => { setOpen(true) };
  const handleClose = () => { setOpen(false) };



  return (
    <Box sx={{ height: 500, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial uncontrolled open example"
        sx={{ position: 'absolute', bottom: 10, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={handleOpen}
        open={open}
      />

<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style} >
            <Box>
                <Typography align='center' variant='h4' > Create Post </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center"  >
            <Item elevation='0' >
            <Avatar
                alt="Waer"
                src={img}
                sx={{ width: 56, height: 56 }}
            /> </Item>
            <Item elevation='0'> <Typography variant='h4' > Waer </Typography> </Item>
            </Stack>

            <Box>
            <TextField
          id="outlined-textarea"
          label="Post"
          placeholder="What Are You Think about"
          multiline
          fullWidth
          variant="standard"
          rows={6}
          autoFocus
        />
            </Box>
        <Box>
        <Stack
  direction="row"
  justifyContent="center"
  alignItems="center"
  spacing={2}
>
              <Item> <UploadButton /> </Item>
              <Item> <PostButton /> </Item>

        </Stack>
        </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default PopPost;