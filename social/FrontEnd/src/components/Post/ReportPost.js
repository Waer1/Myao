import * as React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { GoReport } from "react-icons/go";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";

const ReportPost = ({ reported_id, is_post = true, myButton }) => {
  const [openReport, setopenReport] = React.useState(0);
  const [value, setValue] = React.useState(-1);
  const stylerep = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 50,
    p: 1,
    width: {
      xs: "90%",
      sm: "60%",
      md: "40%",
    },
  };
  const reasons = [
    "Supporting or promoting a hate or terror group",
    "Speech that belittles or stereotypes a group of people",
    "Racism, sexism, homophobia or other discrimination",
    "Supporting or promoting a hate group",
    "Violation of someone's privacy",
  ];

  const createReport = async () => {
    try {
      await axios.post("/api/v1/report", {
        reported_id,
        report_option: value,
      });
      setopenReport(0);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <React.Fragment>
      {is_post ? (
        <MenuItem
          onClick={() => {
            setopenReport(1);
          }}
        >
          report
        </MenuItem>
      ) : (
        <span
          style={{
            height: "fit-content",
            width: "fit-content",
          }}
          onClick={() => {
            setopenReport(1);
          }}
        >
          {myButton}
        </span>
      )}
      <Modal
        open={openReport}
        onClose={() => {
          setopenReport(0);
        }}
      >
        <Paper sx={stylerep}>
          <Box sx={{ p: 2, borderTop: "3px solid blue", borderRadius: "16px" }}>
            <Typography align="left" variant="h6">
              Report Post
            </Typography>
          </Box>
          <Typography
            align="left"
            variant="caption"
            sx={{ display: { xs: "block", md: "none" } }}
          >
            Please Choice what is the type of report{" "}
          </Typography>
          <Typography
            align="left"
            variant="h6"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {" "}
            Please Choice what is the type of report{" "}
          </Typography>

          <Stack
            direction="column"
            justifyContent="center"
            alignItems="left"
            spacing={2}
            sx={{ p: 2, borderBottom: "3px solid blue", borderRadius: "16px" }}
          >
            <RadioGroup
              name="use-radio-group"
              onChange={(v) => {
                setValue(v.target.value);
              }}
            >
              {reasons.map((element, index) => (
                <FormControlLabel
                  value={index}
                  label={element}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>

            <Stack
              direction="row"
              justifyContent="left"
              alignItems="left"
              spacing={1}
            >
              <Button
                variant="contained"
                sx={{ color: "white" }}
                onClick={createReport}
                disabled={value === -1}
              >
                make A Report
                <GoReport style={{ fontSize: "1.2rem", marginLeft: ".7rem" }} />
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </React.Fragment>
  );
};

export default ReportPost;
