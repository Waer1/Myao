import { Button, Grid, Typography } from "@mui/material";
import useStyle from "./SignStyle";
import MainLogo from "../../Material/Images/MainLogo.jpg";
import { useEffect, useState } from "react";
import InputFieldSimple from "../../components/InputField.js/InputField";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import parseDateF from "../../Utilities/ParsingDate";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../Store/UserSlice";
import { useHistory } from "react-router-dom";
function SignUp() {
  const classes = useStyle();

  const isAuth = useSelector((state) => state.reducer.isAuth);
  const history = useHistory();

  useEffect(() => {
    if (isAuth) history.push("/");
  }, [history, isAuth]);

  const [Gender, setGender] = useState(null);
  const [Role, setRole] = useState("surfer");
  const [DateV, setDateV] = useState(null);

  const dispatch = useDispatch();

  // const [ErrorName, setErrorName] = useState(false);
  const [ErrorMail, setErrorMail] = useState(false);
  const [ErrorPassword, setErrorPassword] = useState(false);
  const [ErrorConfirm, setErrorConfirm] = useState(false);

  const [FName, setFName] = useState("");
  const [LName, setLName] = useState("");
  const [Mail, setMail] = useState("");
  const [Password, setPassword] = useState("");
  const [Confirm, setConfirm] = useState("");

  // Make the Button Disabled
  const isDisabled =
    ErrorMail ||
    ErrorPassword ||
    ErrorConfirm ||
    Mail.length === 0 ||
    Password.length === 0 ||
    Confirm.length === 0;

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

  const HandleConfirm = (e) => {
    if (e.target.value === "") return setErrorConfirm(false);
    setConfirm(e.target.value);
    if (e.target.value !== Password) setErrorConfirm(true);
    else setErrorConfirm(false);
  };

  const HandleFName = (e) => {
    // if (e.target.value === "") return setErrorName(false);
    setFName(e.target.value);
    // if (e.target.value.length < 2) setErrorName(true);
    // else setErrorName(false);
  };

  const HandleLName = (e) => {
    setLName(e.target.value);
  };

  ///////////////////////////////////////////////////

  const handleSubmit = async () => {
    try {
      const NOW = parseDateF(Date.now());
      let data;
      if (Role === "marketer") {
        data = {
          email: Mail,
          password: Password,
          fname: FName,
          lname: LName,
          founded_at: parseDateF(DateV),
          is_active: true,
          role: Role,
        };
      } else
        data = {
          email: Mail,
          password: Password,
          fname: FName,
          lname: LName,
          created_date: NOW,
          last_login: NOW,
          gender: Gender === "male" ? 1 : 0,
          birth_date: parseDateF(DateV),
          role: Role,
        };
      const POST = await axios.post("/api/v1/user/signup", data);
      dispatch(UserActions.AddUser(POST.data.data.user));
    } catch (err) {
      console.log(err);
    }
  };

  ////////////////////////////////////////
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh", paddingBottom: "1rem" }}
    >
      <Grid container direction="column" className={classes.SignCard}>
        <img src={MainLogo} alt="LOGO" className={classes.logo} />
        <Typography variant="h4" className={classes.SignWord}>
          Sign Up
        </Typography>
        <Typography variant="subtitle2" style={{ textAlign: "center" }}>
          Create New MYAO Account
        </Typography>
        {/* // y3333333333333333333333333333333333333333333333333333333333333m */}
        <InputFieldSimple
          label="First Name"
          placeholder="Enter First Name"
          onChange={HandleFName}
          // error={ErrorName}
        ></InputFieldSimple>
        <InputFieldSimple
          label="Last Name"
          placeholder="Enter Last Name"
          onChange={HandleLName}
          // error={ErrorName}
        ></InputFieldSimple>

        <FormControl
          component="fieldset"
          style={{ height: "5rem", margin: "-.5rem 0 0" }}
        >
          <Grid container height="100%">
            <Grid item xs={6}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="row-radio-buttons-group"
                value={Gender}
                onChange={(newv) => setGender(newv.target.value)}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                  disabled={Role !== "surfer"}
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                  disabled={Role !== "surfer"}
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">Acount Type</FormLabel>
              <RadioGroup
                row
                aria-label="role"
                name="row-radio-buttons-group"
                value={Role}
                onChange={(newv) => setRole(newv.target.value)}
              >
                <FormControlLabel
                  value="surfer"
                  control={<Radio />}
                  label="surfer"
                />
                <FormControlLabel
                  value="marketer"
                  control={<Radio />}
                  label="marketer"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </FormControl>

        {/* //////////////////////////////////////////////// */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={Role === "surfer" ? "Birth Date" : "Founded At"}
            value={DateV}
            onChange={(newValue) => {
              setDateV(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        {/* //////////////////////////////////////////////// */}
        <InputFieldSimple
          label="Email Address"
          placeholder="Enter email"
          styleTop={{ marginTop: "1.2rem" }}
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
        <InputFieldSimple
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          onChange={HandleConfirm}
          error={ErrorConfirm}
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
            Create New Account
          </Button>
        </Grid>
        <Typography variant="subtitle1" style={{ margin: "1rem auto 0" }}>
          Have an account ?{" "}
          <span
            className={classes.loginButton}
            onClick={() => history.push("/login")}
          >
            login
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default SignUp;
