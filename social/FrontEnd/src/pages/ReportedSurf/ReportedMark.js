import { Button, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import MarketerCard from "../../components/surferCard/marketerCard";
import Wrapper from "../../components/Wrapper/Wrapper";
import useStyle from "./reportStyle";
const ReportedMar = () => {
  const [rep_mar, set_rep_mar] = useState([]);
  const classes = useStyle();
  useEffect(() => {
    const asyFun = async () => {
      const { data } = await axios.get("/api/v1/report/marketer");
      // console.log(data);
      set_rep_mar([...data.data]);
    };
    asyFun();
  }, []);

  const handleBlock = async (ind, element, removed) => {
    try {
      await axios.post("/api/v1/report/block", {
        reported_id: element.reported_id,
        reporter_id: element.reporter_id,
        removed,
      });
      rep_mar.splice(ind, 1);
      set_rep_mar([...rep_mar]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Wrapper>
      <Grid container item xs={11} lg={7} md={8} spacing={3}>
        {rep_mar.map((el, ind) => (
          <Grid item sm={4} xs={6} key={el.id}>
            <MarketerCard
              user={el}
              id_given={el.reported_id}
              newThings={
                <Grid container justifyContent="center">
                  {/* <Typography variant="h5">
                    {"Violance and bad words"}
                  </Typography> */}
                  <Button
                    variant="contained"
                    className={classes.block_sur_button}
                    onClick={() => {
                      handleBlock(ind, el, 1);
                    }}
                  >
                    Block
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.ignore_sur_button}
                    onClick={() => {
                      handleBlock(ind, el, 0);
                    }}
                  >
                    ignore
                  </Button>
                </Grid>
              }
            />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};
export default ReportedMar;
