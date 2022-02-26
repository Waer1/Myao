import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminReportProduct from "../../components/Post/AdminReportProduct";
import Wrapper from "../../components/Wrapper/Wrapper";
// import useStyle from "./reportStyle";
const ReportedProduct = () => {
  const [rep_product, set_rep_product] = useState([]);
  const [info, set_info] = useState([]);
  // const classes = useStyle();
  useEffect(() => {
    const asyFun = async () => {
      const { data } = await axios.get("/api/v1/report/product");
      console.log(data);
      set_rep_product([...data.data]);
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
      rep_product.splice(ind, 1);
      set_rep_product([...rep_product]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Wrapper>
      <Grid item xs={11} lg={6} md={8} marginBottom="2rem">
        {rep_product.map((e, i) => (
          <AdminReportProduct
            handleBlock={handleBlock}
            key={e.id}
            data={e}
            marketer_info={e.marketer_info}
            style={{ marginTop: "1rem" }}
            index={i}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};
export default ReportedProduct;
