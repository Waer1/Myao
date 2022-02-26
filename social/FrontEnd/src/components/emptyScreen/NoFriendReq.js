import { Button, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
const BackToMainScreen = () => {
  const history = useHistory();
  return (
    <Grid container alignItems="center" direction="column">
      <Button
        variant="contained"
        sx={{ color: "#fff" }}
        onClick={() => history.push("/")}
      >
        Back to the main Screen
      </Button>
    </Grid>
  );
};
export default BackToMainScreen;
