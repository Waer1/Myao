import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/post";
import Product from "../../components/Post/Product";
import SurferCard from "../../components/surferCard/surferCard";
import Wrapper from "../../components/Wrapper/Wrapper";

const SearchPage = () => {
  const params = useParams();
  const [usersPosts, setUsersPosts] = useState({
    posts: [],
    surfers: [],
    products: [],
  });
  const fetchingFunc = async () => {
    const { data } = await axios.post("/api/v1/surfer/search", {
      search: params.search,
    });
    console.log(data.data);
    setUsersPosts(data.data);
  };

  useEffect(() => {
    fetchingFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return (
    <Wrapper>
      <Grid container item xs={11} lg={7} md={8} spacing={3}>
        {usersPosts.surfers.map((e) => (
          <Grid item sm={4} xs={6} key={e.id}>
            <SurferCard user={e} />
          </Grid>
        ))}
      </Grid>
      <Grid item xs={11} lg={7} md={8} marginBottom="2rem">
        {usersPosts.posts.map((e) => (
          <Post
            key={e.id}
            data={e}
            surfer_info={e.surfer_info}
            style={{ marginTop: "1rem" }}
          />
        ))}
      </Grid>
      <Grid item xs={11} lg={7} md={8} marginBottom="2rem">
        {usersPosts.products.map((e) => (
          <Product
            key={e.id}
            data={e}
            marketer_info={e.marketer_info}
            style={{ marginTop: "1rem" }}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};

export default SearchPage;
