import React, { useContext, useState } from "react";
import "./SigninVerify.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import image from "../../assets/signup.png";
import haikei from "../../assets/polygon-scatter.png";
import { Button, IconButton, Input, InputAdornment, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomColors from "../../constants/colors";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { ChatifyContext } from "../../context/context";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";


const SigninVerify = () => {
  const getTempUser = () => {
    let user = JSON.parse(localStorage.getItem("tempUser"));
    if (!user) {
      console.log("No temp user.");
      return false;
    }
    return user;
  }
  let tempUser = getTempUser();
  const navigate = useNavigate();
  const { signinUser } = useContext(ChatifyContext);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(tempUser.phoneNumber);
  const [userId, setUserId] = useState(tempUser.uid);
  const [otpError, setOtpError] = useState("");
  const [otpConfirm, setOtpConfirm] = useState();
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifier, setVerifier] = useState(false);

  
  const handleOtp = (e) => {
    let value = e.target.value;
    setOtpError("");
    setOtp(value);
  }

  const hanldeOtpBlur = () => {
    if (!otp.length) {
      setOtpError("OTP field cannot be empty!");
    }
  }

  

  const handleSend = async () => {
    // let user = getTempUser();
    // if (!user) return;
    // let phone = user.phoneNumber;
    // setPhoneNumber(phone);
    // setUserId(user.uid);
    if (!phoneNumber || phoneNumber == "+254") return;
    setSendLoading(true);
    try {
      await sendOTP();

    } catch (error) {
      console.log(error.message)
      
    }
    setSendLoading(false);
    
  }

  const sendOTP = async () => {
    try {
      auth.languageCode = auth.useDeviceLanguage();
      let recaptchaVerifier;
      if (!resending) {
        recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {size: "invisible"});
        setVerifier(recaptchaVerifier);
      } else {
        recaptchaVerifier = verifier;
      }
           
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      setOtpVisible(true);
      setOtpConfirm(confirmation);
      setResending(true);
     
    } catch (err) {
      console.log(err);
    }
  };

  const verifyOtp = async () => {
    if (!otp.length) return;
    setVerifyLoading(true);
    try {
      const user = await otpConfirm.confirm(otp);
      await signinUser(userId);
      navigate("/chat", {state: {firstTime: false}});
    } catch(err) {
      console.log(err.message);
      if (err.message) {
        if (err.message.includes("invalid-verification-code")) {
          setOtpError("Invalid verification code!");
        }
      }
      setVerifyLoading(false);
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
          {/* <p className="encourage_message">You're almost there</p> */}
          <h2 className="auth_title">Verify Phone Number</h2>
          <p className="verify_sub">
            A verification code will be sent to:
          </p>
          <TextField
            variant="outlined"
            label="Phone Number"
            disabled={false}
            value={phoneNumber}
            
            type="tel"
            sx={{ width: "90%", margin: "15px 0" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <CallIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
          id='recaptcha'
            variant="contained"
            onClick={handleSend}
            loading={sendLoading}
            style={{
              backgroundColor: !sendLoading ? CustomColors.pink : "rgba(0,0,0,0.2)",
              borderRadius: "30px",
              width: "90%",
              margin: "20px 0",
              textTransform: "none",
              fontFamily: "Mooli",
              fontSize: "15px",
              height: "50px"
            }}
          >
            {resending ? "Resend code" : "Send code"}
          </LoadingButton>
          
            
          {/* <div id="recaptcha"></div> */}
          <p className="otp_text" hidden={!otpVisible}>{`A code has been sent to ${phoneNumber}. Enter the code below.`}</p>
          <TextField
            variant="outlined"
            label="OTP"
            value={otp}
            onChange={handleOtp}
            onBlur={hanldeOtpBlur}
            error={!!otpError}
            helperText={otpError}
            type="number"
            sx={{ width: "90%",display: otpVisible ? "inherit" : "none" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <VpnKeyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            variant="contained"
            onClick={verifyOtp}
            loading={verifyLoading}
            style={{
              backgroundColor: !verifyLoading ? CustomColors.pink : "rgba(0,0,0,0.2",
              borderRadius: "30px",
              width: "90%",
              margin: "20px 0",
              textTransform: "none",
              fontFamily: "Mooli",
              fontSize: "15px",
              height: "50px",
              display: otpVisible ? "block" : "none"
            }}
          >
            Verify
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default SigninVerify;
