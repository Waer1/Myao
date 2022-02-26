import * as React from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  useStyle,
} from "./HeaderStyle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { BiSearch } from "react-icons/bi";
import { Avatar, Grid, MenuItem, Tab, Tabs } from "@mui/material";
import { AiFillHome } from "react-icons/ai";
import { BsFilePostFill } from "react-icons/bs";
import { IoPersonCircle, IoSettingsSharp, IoPeople } from "react-icons/io5";
import { FaProductHunt, FaPeopleCarry } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";
import { MdFavorite } from "react-icons/md";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UserActions } from "../../Store/UserSlice";
const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const { isAuth, user } = useSelector((state) => state.reducer);
  const [SettingIcon, setSettingIcon] = React.useState(false);
  const classes = useStyle();
  const { id } = user;
  const ref = React.useRef();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (user.role === "surfer") {
      if (location.pathname === "/") setValue(0);
      else if (
        location.pathname.includes("profile") &&
        id === location.pathname.slice(location.pathname.lastIndexOf("/") + 1)
      )
        setValue(1);
      else if (location.pathname === "/fav") setValue(2);
      else if (location.pathname === "/requests") setValue(3);
      else setValue(4);
    } else if (user.role === "admin") {
      if (location.pathname === "/admin/surfers") setValue(0);
      else if (location.pathname.includes("/admin/posts")) setValue(1);
      else if (location.pathname === "/admin/marketers") setValue(2);
      else if (location.pathname === "/admin/products") setValue(3);
      else setValue(4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  React.useEffect(() => {
    ref.current.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
        history.push(`/search/${e.target.value}`);
        e.target.value = "";
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setSettingIcon(1);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSettingIcon(0);
  };
  const logOut = () => {
    document.cookie = ""; // best pracise from index jwt till find the second space (after jwt there is a space)
    axios.post("/api/v1/user/logout");
    dispatch(UserActions.logout());
    history.push("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{ height: "4rem" }}></div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ display: { xs: "block" } }}
          >
            <Avatar src="/meaw.png" sx={{width:"8rem",height:"3rem",marginRight:"-1.5rem"}}/>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <BiSearch />
            </SearchIconWrapper>
            <StyledInputBase
              ref={ref}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Grid
            item
            sx={{
              transform: "translateX(-25%)",
              display: { xs: "none", md: "block" },
            }}
          >
            {isAuth && user.role === "surfer" ? (
              <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                <Tab
                  disableRipple
                  icon={
                    <AiFillHome
                      style={{ color: value !== 0 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="Home"
                  onClick={() => history.push("/")}
                />
                <Tab
                  disableRipple
                  icon={
                    <IoPersonCircle
                      style={{ color: value !== 1 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="person"
                  onClick={() => history.push(`/profile/${user.id}`)}
                />
                <Tab
                  disableRipple
                  icon={
                    <MdFavorite
                      style={{ color: value !== 2 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="favorite"
                  onClick={() => history.push("/fav")}
                />
                <Tab
                  disableRipple
                  icon={
                    <IoPeople
                      style={{ color: value !== 3 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="favorite"
                  onClick={() => history.push("/requests")}
                />{" "}
              </Tabs>
            ) : user.role === "admin" ? (
              <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                <Tab
                  disableRipple
                  icon={
                    <GoOrganization
                      style={{ color: value !== 0 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="Home"
                  onClick={() => history.push("/admin/surfers")}
                />
                <Tab
                  disableRipple
                  icon={
                    <BsFilePostFill
                      style={{ color: value !== 1 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="person"
                  onClick={() => history.push(`/admin/posts`)}
                />
                <Tab
                  disableRipple
                  icon={
                    <FaPeopleCarry
                      style={{ color: value !== 2 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="favorite"
                  onClick={() => history.push("/admin/marketers")}
                />
                <Tab
                  disableRipple
                  icon={
                    <FaProductHunt
                      style={{ color: value !== 3 ? "#555" : undefined }}
                      className={classes.icons}
                    />
                  }
                  aria-label="favorite"
                  onClick={() => history.push("/admin/products")}
                />
              </Tabs>
            ) : null}
          </Grid>

          <Box sx={{ flexGrow: 1 }} />

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <IoSettingsSharp
                className={
                  SettingIcon
                    ? `${classes.moveSetting} ${classes.color}`
                    : classes.color
                }
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              style={{ marginTop: "2.2rem", zIndex: "10000" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  setValue(6);
                  handleClose();
                  history.push("/setting");
                }}
              >
                Setting
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setValue(6);
                  handleClose();
                  logOut();
                }}
              >
                log out
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, backgroundColor: "primary" }}>
        <Grid color="primary" sx={{ display: { xs: "block", md: "none" } }}>
          <Tabs
            variant="fullWidth"
            textColor="secondary"
            value={value}
            onChange={handleChange}
          >
            <Tab
              disableRipple
              icon={<AiFillHome className={classes.icons} />}
              aria-label="phone"
            />
            <Tab
              disableRipple
              icon={<MdFavorite className={classes.icons} />}
              aria-label="favorite"
            />
            <Tab
              disableRipple
              icon={<IoPersonCircle className={classes.icons} />}
              aria-label="person"
            />
          </Tabs>
        </Grid>
      </Box>
    </Box>
  );
};

export default Header;
