import React, { useContext, useState } from "react";
import "./Signin.css";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import image from "../../assets/signup.png";
import haikei from "../../assets/polygon-scatter.png";
import { Button, IconButton, Input, InputAdornment, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomColors from "../../constants/colors";
import { ChatifyContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import AuthFooter from "../../components/AuthFooter/AuthFooter";

const Signin = () => {
  const navigate = useNavigate();
  const { fetchTempUser } = useContext(ChatifyContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleEmail = (e) => {
    setEmailError("");
    let newEmail = e.target.value;
    setEmail(newEmail);
  }

  const handleEmailBlur = () => {
    if (!email.length) {
      setEmailError("Email cannot empty!");
    }
  }

  const handlePass = e => {
    setPassError("");
    let password = e.target.value;
    setPass(password);
  }

  const handlePassBlur = () => {
    if (!pass.length) {
      setPassError("Password field cannot be empty!");
    } else if (pass.length < 8) {
      setPassError("Password should be at least 8 characters!");
    }
  }

 
  const handleSubmitEmail = async () => {
    handleEmailBlur();
    handlePassBlur();
    if (!email.length || !pass.length || emailError.length || passError.length) return;
    setSubmitLoading(true);
    try {
      let userCredential = await signInWithEmailAndPassword(auth, email, pass);
      console.log(userCredential.user);
      await fetchTempUser(userCredential.user.uid);
      navigate("/signin-verify-phone");
    } catch (error) {
      // console.log(error.message)
      if (error.message.includes("invalid-email")) {
        setEmailError("Invalid email!");
      } else if (error.message.includes("invalid-credential")) {
        setPassError("Wrong password!");
      }
      setSubmitLoading(false);
    }
    
  }

  

  return (
    <div className="signup_container">
      <div className="signup_left">
        <img src={image} width="80%" />
      </div>
      <div
        className="signup_right"
        style={{ backgroundImage: `url(${haikei})` }}
      >
        <div className="signup_float">
          <h2 className="auth_title">Sign in</h2>
          <TextField
            variant="outlined"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmail}
            onBlur={handleEmailBlur}
            error={!!emailError}
            helperText={emailError}
            sx={{ width: "90%", margin: "15px 0" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <EmailIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            variant="outlined"
            label="Password"
            value={pass}
            onChange={handlePass}
            onBlur={handlePassBlur}
            error={!!passError}
            helperText={passError}
            type={passVisible ? "text" : "password"}
            sx={{ width: "90%", margin: "15px 0" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => {
                      setPassVisible(!passVisible);
                    }}
                  >
                    {passVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            variant="contained"
            onClick={handleSubmitEmail}
            loading={submitLoading}
            style={{
              backgroundColor: !submitLoading ? CustomColors.pink : "rgba(0,0,0,0.2",
              borderRadius: "30px",
              width: "90%",
              margin: "20px 0",
              textTransform: "none",
              fontFamily: "Mooli",
              fontSize: "15px",
              height: "50px"
            }}
          >
            Next
          </LoadingButton>
          <AuthFooter path="signin" />
        </div>
      </div>
    </div>
  );
};

export default Signin;
