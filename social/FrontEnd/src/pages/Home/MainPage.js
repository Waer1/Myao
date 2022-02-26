import { Grid } from "@mui/material";
import LeftSection from "./leftSection";
import MediumSection from "./MediumSection";
// import PopPost from "../../components/PopUp/PopPost";
const MainPage = () => {
  return (
    <>
      <Grid container>
        <Grid item lg={4}>
          <LeftSection />
        </Grid>
        <Grid item lg={4}>
          <MediumSection />
        </Grid>
        <Grid item lg={4}></Grid>
      </Grid>
      {/* <PopPost /> */}
    </>
  );
};

export default MainPage;
