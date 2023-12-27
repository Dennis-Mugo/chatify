import React, { useContext, useEffect, useState } from "react";
import "./ProfileSetup.css";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { LoadingButton } from "@mui/lab";
import { ChatifyContext } from "../../context/context";
import CustomColors from "../../constants/colors";
import Logo from "../../components/Logo/Logo";
import defaultAvatars from "../../constants/defaultAvatars";
import { useLocation, useNavigate } from "react-router-dom";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallIcon from "@mui/icons-material/Call";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { firstTime } = state || {};
  const { currentUser, uploadFile, updateUserProfile } =
    useContext(ChatifyContext);

  const getRandomAvatar = () => {
    let max = defaultAvatars.length;
    let index = Math.floor(Math.random() * max);
    return defaultAvatars[index];
  };
  let randomAvatar = getRandomAvatar();

  const getPhotoUrl = () => {
    if (firstTime) {
      return randomAvatar;
    }
    if (!currentUser?.photoUrl) {
      return randomAvatar;
    }
    return currentUser?.photoUrl;
  };

  
  // console.log(currentUser);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [bio, setBio] = useState("");
  const [bioError, setBioError] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [localUrl, setLocalUrl] = useState("");
  const [localImage, setLocalImage] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleName = (e) => {
    setNameError("");
    let value = e.target.value;
    setName(value);
  };

  const handleNameBlur = () => {
    if (!name.length) {
      setNameError("Username cannot be empty!");
    }
  };

  const handleBio = (e) => {
    setBioError("");
    let value = e.target.value;
    setBio(value);
  };

  const handleBioBlur = () => {
    if (!bio.length) {
      setBioError("This field cannot be empty!");
    }
  };

  const handleImageChange = (e) => {
    if (!e.target.files.length) return;
    let selectedImage = e.target.files[0];
    // console.log(selectedImage);
    let url = URL.createObjectURL(selectedImage);
    setLocalImage(selectedImage);
    setLocalUrl(url);
    setDisplayUrl(url);
  };

  const handleAvatarSelect = (url) => {
    setDisplayUrl(url);
    setOnlineUrl(url);
  };

  const onEndUpload = (url) => {
    // console.log(url);
    setOnlineUrl(url);
    setUploadLoading(false);
    setUploadProgress(0);
  };

  const handleUploadImage = async () => {
    if (uploadLoading || submitLoading) return;
    if (!displayUrl.includes("https")) {
      setUploadLoading(true);
      await uploadFile(localImage, onEndUpload, "avatars", setUploadProgress);
    }
  };

  const handleSubmit = async () => {
    handleNameBlur();
    handleBioBlur();
    if (
      !name.length ||
      !bio.length ||
      nameError.length ||
      bioError.length ||
      submitLoading ||
      uploadLoading
    )
      return;
    setSubmitLoading(true);
    await updateUserProfile({
      bio,
      userName: name,
      photoUrl: onlineUrl,
    });
    navigate("/chat");
  };

  useEffect(() => {
    let defaultBio = "Hey there, I am using Chatify.";
    // if (currentUser) {
    setBio(currentUser?.bio || defaultBio);
    setName(currentUser?.userName || "");
    // } else {
    //   setBio(defaultBio);
    //   setName("");
    // }
    let photoUrl = getPhotoUrl();
    setDisplayUrl(photoUrl);
    setOnlineUrl(photoUrl);
  }, [currentUser]);

  return (
    <div className="profilesetup_container">
      <div className="profile_header">
        <Logo style={{ fontSize: "1.5rem", marginLeft: "20px" }} />
        <h2 className="profile_title">{firstTime ? "Setup your profile" : "My profile"}</h2>
        <div style={{ width: "10%" }} className="dummy"></div>
      </div>
      <div className="profile_header_mobile">
        <Logo style={{ fontSize: "1.5rem", marginLeft: "20px" }} />
        <hr style={{ border: `1px solid ${CustomColors.lightBlue}` }} />
        <h2 className="profile_title">{firstTime ? "Setup your profile" : "My profile"}</h2>
      </div>

      <div className="profile_wrapper">
        <div className="profile_left">
          <div
            className="image_display"
            style={{
              backgroundImage: `url(${displayUrl})`,
              position: "relative",
            }}
          >
            <IconButton
              component="label"
              style={{ backgroundColor: CustomColors.pureWhite }}
              sx={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                position: "absolute",
                top: "145px",
                right: "5px",
              }}
            >
              <CameraAltOutlinedIcon sx={{ color: CustomColors.dark }} />
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </IconButton>
          </div>

          {defaultAvatars.includes(displayUrl) ||
          displayUrl === currentUser?.photoUrl ? (
            <></>
          ) : (
            <div className="upload_container">
              {uploadLoading ? (
                <div className="upload_progress_shadow">
                  <CircularProgressWithLabel value={uploadProgress} />
                </div>
              ) : (
                <></>
              )}

              <Button
                variant="contained"
                onClick={handleUploadImage}
                startIcon={<FileUploadOutlinedIcon />}
                style={{
                  backgroundColor: CustomColors.blue,
                  borderRadius: "30px",
                  margin: "20px 5px",
                  textTransform: "none",
                  fontFamily: "Mooli",
                  fontSize: "15px",
                  height: "40px",
                }}
              >
                {uploadLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
          <div className="all_avatars">
            <div className="all_avatars_wrapper">
              {defaultAvatars.map((url, i) => (
                <div
                  key={i}
                  onClick={() => {
                    handleAvatarSelect(url);
                  }}
                  className="avatar_choice"
                  style={{
                    border:
                      url === displayUrl
                        ? `4px solid ${CustomColors.blue}`
                        : `4px solid ${CustomColors.pureWhite}`,
                  }}
                >
                  <img
                    src={url}
                    width="100%"
                    style={{ borderRadius: "50%" }}
                    alt={`avatar${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="profile_right">
          <TextField
            variant="standard"
            label="Your username"
            error={!!nameError}
            helperText={nameError}
            value={name}
            onChange={handleName}
            onBlur={handleNameBlur}
            sx={{ width: "70%", margin: "20px 0" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
              style: {
                fontFamily: "Mooli",
              },
            }}
          />
          <TextField
            variant="standard"
            label="Bio"
            error={!!bioError}
            helperText={bioError}
            value={bio}
            onChange={handleBio}
            onBlur={handleBioBlur}
            sx={{ width: "70%", margin: "20px 0", fontFamily: "Mooli" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <DescriptionIcon />
                </InputAdornment>
              ),
              style: {
                fontFamily: "Mooli",
              },
            }}
          />
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={submitLoading}
            style={{
              backgroundColor: !submitLoading
                ? CustomColors.blue
                : "rgba(0,0,0,0.2",
              borderRadius: "30px",
              width: "70%",
              margin: "20px 0",
              textTransform: "none",
              fontFamily: "Mooli",
              fontSize: "15px",
              height: "50px",
            }}
          >
            Save
          </LoadingButton>
          <div className="horizontal_rule"></div>
          <div className="profile_detail_container">
            <div className="profile_detail_left">
              <EmailOutlinedIcon sx={{ color: CustomColors.grey }} />
            </div>
            <div className="profile_detail_right">
              <p className="profile_detail_title">Email</p>
              <p className="profile_detail_content">{currentUser?.email}</p>
            </div>
          </div>
          <div className="profile_detail_container">
            <div className="profile_detail_left">
              <CallIcon sx={{ color: CustomColors.grey }} />
            </div>
            <div className="profile_detail_right">
              <p className="profile_detail_title">Phone</p>
              <p className="profile_detail_content">
                {currentUser?.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default ProfileSetup;
