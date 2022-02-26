import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminReportPost from "../../components/Post/AdminReportPost";
import Wrapper from "../../components/Wrapper/Wrapper";
// import useStyle from "./reportStyle";
const ReportedPost = () => {
  const [rep_post, set_rep_post] = useState([]);
  const [info, set_info] = useState([]);
  //   const classes = useStyle();
  useEffect(() => {
    const asyFun = async () => {
      const { data } = await axios.get("/api/v1/report/post");
      set_rep_post([...data.data]);
      set_info([...data.reports]);
    };
    asyFun();
  }, []);

  const handleBlock = async (ind, element, removed) => {
    try {
      await axios.post("/api/v1/report/block", {
        reported_id: info[ind].reported_id,
        reporter_id: info[ind].reporter_id,
        removed,
      });
      rep_post.splice(ind, 1);
      set_rep_post([...rep_post]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Wrapper>
      <Grid item xs={11} lg={6} md={8} marginBottom="2rem">
        {rep_post.map((e, i) => (
          <AdminReportPost
            handleBlock={handleBlock}
            key={e.id}
            data={e}
            surfer_info={e.surfer_info}
            style={{ marginTop: "1rem" }}
            index={i}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};
export default ReportedPost;
