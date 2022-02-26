import SignIn from "./pages/Sign/SignIn";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import SignUp from "./pages/Sign/SignUp";
import MainPage from "./pages/Home/MainPage";
import SettingPage from "./pages/SettingPage/settingPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import Header from "./components/Header/header";
import MarketerPage from "./pages/Marketer/marketerProfile";
import getMe from "./Store/Thunk/getMe";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import SearchPage from "./pages/SearchPage/SearchPage";
import FriendRequestPage from "./pages/FriendRequests/FriendRequestPage";
import FavPosts from "./pages/favPosts/favPosts";
import ReportedSurf from "./pages/ReportedSurf/ReportedSurf";
import ReportedMar from "./pages/ReportedSurf/ReportedMark";
import ReportedPost from "./pages/ReportedSurf/ReportedPosts";
import ReportedProduct from "./pages/ReportedSurf/ReportedProduct";
function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const loadingUser = useSelector((state) => state.reducer.loadingUser);
  const { isAuth, user } = useSelector((state) => state.reducer);
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
  useEffect(() => {
    const locationPath = location.pathname;
    if (!loadingUser)
      if (
        isAuth &&
        (locationPath.includes("/login") || locationPath.includes("/signup"))
      ) {
        if (user.role === "marketer") history.push(`/marketer/${user.id}`);
        else if (user.role === "admin") history.push("/admin/surfers");
        else history.push("/");
      } else if (
        !isAuth &&
        !locationPath.includes("/login") &&
        !locationPath.includes("/signup")
      )
        history.push("/login");
      else {
        if (
          user.role === "marketer" &&
          (locationPath === "/" || locationPath.includes("admin"))
        )
          history.push(`/marketer/${user.id}`);
        else if (user.role === "surfer" && locationPath.includes("admin"))
          history.push("/");
        // else if (user.role === "admin") history.push("/admin/surfer");
      }
      if(user.role === "admin" && (locationPath === "/") )
        history.push("/admin/surfers")
  }, [history, isAuth, loadingUser, location.pathname]);
  return (
    <>
      {loadingUser ? null : (
        <>
          {isAuth && <Header />}
          <Switch>
            <Route path="/" exact>
              <MainPage />
            </Route>
            <Route path="/login">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/setting">
              <SettingPage />
            </Route>
            <Route path="/marketer/:id">
              <MarketerPage />
            </Route>
            <Route path="/search/:search">
              <SearchPage />
            </Route>
            <Route path="/profile/:id">
              <ProfilePage />
            </Route>
            <Route path="/fav">
              <FavPosts />
            </Route>
            <Route path="/requests">
              <FriendRequestPage />
            </Route>
            <Route path="/admin/surfers">
              <ReportedSurf />
            </Route>
            <Route path="/admin/marketers">
              <ReportedMar />
            </Route>
            <Route path="/admin/posts">
              <ReportedPost />
            </Route>
            <Route path="/admin/products">
              <ReportedProduct />
            </Route>
          </Switch>
        </>
      )}
    </>
  );
}

export default App;
