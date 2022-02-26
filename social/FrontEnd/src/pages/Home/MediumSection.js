import { useSelector } from "react-redux";
import CreatePost from "../../components/Post/Create_post";
import GetPosts from "../GlobalForAll/GetPosts";
import useStyle from "./HomeStyle";

const MediumSection = () => {
  const classes = useStyle();
  const user = useSelector((state) => state.reducer.user);
  return (
    <>
      <CreatePost surfer_info={user} style={{ marginTop: "2rem" }} />
      <div
        style={{
          margin: "1rem 0",
          height: "2px",
          width: "100%",
          borderTop: "2px solid #000",
          opacity: ".2",
        }}
      ></div>
      <GetPosts
        linkOfFetching="/api/v1/post/timeline"
        className={classes.post}
      />
    </>
  );
};
export default MediumSection;
