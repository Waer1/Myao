import { Button, Grid, Typography } from "@mui/material";
import useStyle from "./SignStyle";
import MainLogo from "../../Material/Images/MainLogo.jpg";
import { useEffect, useState } from "react";
import InputFieldSimple from "../../components/InputField.js/InputField";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../Store/UserSlice";
import { useHistory } from "react-router-dom";
function SignIn() {
  const isAuth = useSelector((state) => state.reducer.isAuth);
  const history = useHistory();

  useEffect(() => {
    if (isAuth) history.push("/");
  }, [history, isAuth]);

  const classes = useStyle();

  const dispatch = useDispatch();

  const [ErrorMail, setErrorMail] = useState(false);
  const [ErrorPassword, setErrorPassword] = useState(false);

  const [Mail, setMail] = useState("");
  const [Password, setPassword] = useState("");

  // Make the Button Disabled
  const isDisabled =
    ErrorMail || ErrorPassword || Mail.length === 0 || Password.length === 0;

  // Handling Errors of the Fields
  const HandleMail = (e) => {
    if (e.target.value === "") return setErrorMail(false);
    setMail(e.target.value);
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(e.target.value).toLowerCase())) setErrorMail(true);
    else setErrorMail(false);
  };

  const HandlePassword = (e) => {
    if (e.target.value === "") return setErrorPassword(false);
    setPassword(e.target.value);
    if (e.target.value.length < 8) setErrorPassword(true);
    else setErrorPassword(false);
  };

  const handleSubmit = async () => {
    const data = {
      email: Mail,
      password: Password,
    };
    try {
      const user = await axios.post("/api/v1/user/login", data);
      dispatch(UserActions.AddUser(user.data.data.user));
      history.push("/");
    } catch (err) {
      alert(err);
    }
  };
  ///////////////////////////////////////////////////
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      className={classes.SignPage}
    >
      <Grid container direction="column" className={classes.SignCard}>
        <img src={MainLogo} alt="LOGO" className={classes.logo} />
        <Typography variant="h4" className={classes.SignWord}>
          Login
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ textAlign: "center", marginBottom: "1.3rem" }}
        >
          Sign In To Your MYAO Account
        </Typography>

        <InputFieldSimple
          label="Email Address"
          placeholder="Enter email"
          onChange={HandleMail}
          error={ErrorMail}
        ></InputFieldSimple>

        <InputFieldSimple
          label="Password"
          type="password"
          placeholder="Enter password"
          onChange={HandlePassword}
          error={ErrorPassword}
        ></InputFieldSimple>

        <Grid item>
          <Button
            variant="contained"
            //   onClick={HandleSignUp}
            className={classes.Button}
            disableRipple
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </Grid>
        <Typography variant="subtitle1" style={{ margin: "1rem auto 0" }}>
          Don't have an account ?{" "}
          <span
            className={classes.loginButton}
            onClick={() => history.push("/signup")}
          >
            Sign up
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default SignIn;
