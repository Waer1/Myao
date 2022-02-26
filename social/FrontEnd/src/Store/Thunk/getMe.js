import axios from "axios";
import { UserActions } from "../UserSlice";

function getMe() {
  return async (dispatch) => {
    dispatch(UserActions.setLoadingUser(true));
    try {
      if (document.cookie.includes("jwt") && document.cookie.length > 10) {
        const me = await axios.get("/api/v1/user/me");
        me.data.data.role = "surfer";
        dispatch(UserActions.AddUser(me.data.data));
      } else dispatch(UserActions.setAuth(false));
    } catch (err) {
      dispatch(UserActions.setAuth(false));
    }
    dispatch(UserActions.setLoadingUser(false));
  };
}
export default getMe;
