import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styles from "./Login.module.scss";
import { UserLogin } from "../types/User";

interface LogInProps {
  onLogIn?: (userLogin: UserLogin) => void;
  isLoggedIn?: boolean;
}

const Login: React.FC<LogInProps> = ({ onLogIn, isLoggedIn }) => {
  const rememberLogin = localStorage.getItem("loginData");
  const [isRemember, setIsRemember] = useState<boolean>();
  const [userLogin, setUserLogin] = useState<UserLogin>({
    username: "",
    port: 0,
  });
  const rememberLoginData = useMemo(() => {
    return rememberLogin && JSON.parse(rememberLogin);
  }, [rememberLogin]);
  const onLogInClick = useCallback(() => {
    (isRemember &&
      localStorage.setItem(
        "loginData",
        JSON.stringify({ username: userLogin.username, port: userLogin.port })
      )) ||
      localStorage.removeItem("loginData");
    userLogin && onLogIn && onLogIn(userLogin);
  }, [isRemember, onLogIn, userLogin]);

  const updateUserLogin = useCallback((keyName: string, value: unknown) => {
    setUserLogin((userLoginData) => ({ ...userLoginData, [keyName]: value }));
  }, []);

  useEffect(() => {
    rememberLoginData &&
      setUserLogin({
        username: rememberLoginData?.username,
        port: rememberLoginData?.port,
      });
  }, [rememberLoginData]);

  if (isLoggedIn) return null;

  return (
    <Grid>
      <Paper elevation={10} className={styles.paperStyle}>
        <Grid justifyContent={"center"} alignItems={"center"}>
          <h2>Sign In</h2>
        </Grid>
        <TextField
          label="Username"
          placeholder="Enter username"
          fullWidth
          required
          className={styles.loginInput}
          value={rememberLoginData?.username}
          onChange={(event) => updateUserLogin("username", event.target.value)}
        />
        <TextField
          label="Port"
          placeholder="Enter Port"
          fullWidth
          required
          className={styles.loginInput}
          value={rememberLoginData?.port}
          onChange={(event) =>
            updateUserLogin("port", parseFloat(event.target.value))
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              name="checkedB"
              color="primary"
              onChange={(event) => setIsRemember(!!event.target.value)}
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={styles.btnstyle}
          fullWidth
          onClick={onLogInClick}
        >
          Log in
        </Button>
      </Paper>
    </Grid>
  );
};

export default Login;
