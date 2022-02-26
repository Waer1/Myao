import { Button, Grid, Paper, Typography, Avatar } from "@mui/material";
import useStyle from "../Profile/ProfileStyle";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import useStyleMarketer from "./marketerStyle";
// import { useSelector } from "react-redux";
import GetProducts from "../GlobalForAll/GetProducts";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateProduct from "../../components/Post/createProduct";
// import { useParams } from "react-router-dom";
const MarketerPage = () => {
  const classes = useStyle();
  const classesMar = useStyleMarketer();
  const [user, setUser] = useState({});
  const params = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchingFunc = async () => {
      setLoading(false);
      const { data } = await axios.get(`/api/v1/marketer/${params.id}`);
      if (data.data.length === 0) history.push("/");
      setUser(data.data[0]);
      setLoading(true);
    };
    fetchingFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);
  return (
    loading && (
      <Grid
        container
        className={classes.page}
        direction="column"
        style={{ maxWidth: "45rem" }}
      >
        <Paper
          className={classesMar.MarketerImageSection}
          elevation={3}
          style={{ maxHeight: "27rem" }}
        >
          <Grid
            container
            className={classes.secondImage}
            style={{ maxHeight: "15rem" }}
          >
            <Grid
              container
              className={`${classes.cover} ${classes.cover_marketer}`}
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                sx={{ width: "95%", height: "95%" }}
                src={user.photo}
              ></Avatar>
            </Grid>
          </Grid>
          <Grid container alignItems="center" direction="column">
            <Typography
              variant="h4"
              className={`${classes.personName} ${classesMar.marketerTitle}`}
            >
              {`${user.fname} ${user.lname}`}
            </Typography>
            <Button
              variant="contained"
              className={classes.AddButton}
              style={{ margin: "1.2rem 0" }}
            >
              <BsFillArrowDownCircleFill
                style={{ marginRight: "6px", fontSize: "1.2rem" }}
              />
              View Products
            </Button>
          </Grid>
        </Paper>
        {<CreateProduct marketer_info={user} />}
        <Grid container sx={{ margin: "2rem auto 5rem" }} rowGap={2.5}>
          {
            <GetProducts
              linkOfFetching={`/api/v1/product`}
              body={{ marketer_id: params.id }}
            />
          }
        </Grid>
      </Grid>
    )
  );
};
/////////////////////////
////////////////////////
export default MarketerPage;
