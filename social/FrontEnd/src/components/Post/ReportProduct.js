import * as React from 'react';
import Box from '@mui/material/Box';
import {  Button, MenuItem, Modal, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { BsFillArrowRightCircleFill } from "react-icons/bs";

const ReportProduct = () => {
const [value, setValue] = React.useState('Controlled');
const [openReport, setopenReport] = React.useState(0);

    const stylerep = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 50,
    p:1,
    width: {
    xs: "90%", 
    sm: "60%", 
    md: "40%"
}
  };

  return (<React.Fragment>
    <MenuItem onClick={ ()=>{setopenReport(1);} } >
    report
    </MenuItem>
<Modal
        open={openReport}
        onClose={ ()=>{ setopenReport(0);} }
      >
        <Paper sx={stylerep} >

            <Box sx={{ p: 2, borderTop: '3px solid blue' , borderRadius : '16px' }} >
                <Typography align='left' variant='h6' > Report Product </Typography>
            </Box>
            <Typography align='left' variant='caption' sx={{display: { xs: 'block', md: 'none' } }} > Please Choice what is the type of report  </Typography>
            <Typography align='left' variant='h6' sx={{display: { xs: 'none', md: 'block' } }} > Please Choice what is the type of report  </Typography>

            <Stack 
            direction="column"
            justifyContent="center"
            alignItems="left"
            spacing={2}
            sx={{ p: 2, borderBottom: '3px solid blue' , borderRadius : '16px' }}
            >
            <RadioGroup name="use-radio-group" defaultValue="first">
            <FormControlLabel value="first" label="first reason" control={<Radio />} />
            <FormControlLabel value="second" label="Second reason" control={<Radio />} />
            <FormControlLabel value="third" label="third reason" control={<Radio />} />
            <FormControlLabel value="Forth" label="forth reason" control={<Radio />} />
            <FormControlLabel value="Fifth" label="Fifth reason" control={<Radio />} />
            </RadioGroup>
           
            <Stack
            direction="row"
            justifyContent="left"
            alignItems="left"
            spacing={1}
            >
            <TextField
            label="Report"
            placeholder="Explain your report"
            multiline
            variant="standard"
            />
            <Button variant="text" centerRipple size="medium" startIcon={<BsFillArrowRightCircleFill />} />
            </Stack>


            </Stack>


        </Paper>

      </Modal>
      </React.Fragment>
  );
}

export default ReportProduct;