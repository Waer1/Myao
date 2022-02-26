import { Grid } from "@mui/material";
import GetPosts from "../GlobalForAll/GetPosts";
import fav from "../../Material/Images/fav.svg";
import Wrapper from "../../components/Wrapper/Wrapper";
import BackToMainScreen from "../../components/emptyScreen/NoFriendReq";

const FavPosts = () => {
  return (
    <Wrapper>
      <Grid
        container
        justifyContent="center"
        item
        xs={11}
        lg={7}
        md={8}
        rowGap={3}
      >
        <GetPosts
          linkOfFetching="/api/v1/favpost/myFavPosts"
          allowScroll={false}
        />
        <img
          src={fav}
          alt="add"
          style={{ width: "25rem", marginTop: "3rem" }}
        />
        <BackToMainScreen />
      </Grid>
    </Wrapper>
  );
};
export default FavPosts;
