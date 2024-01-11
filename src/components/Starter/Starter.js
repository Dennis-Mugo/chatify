import React, { useContext, useEffect, useState } from "react";
import "./Starter.css";
import { ChatifyContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { StarterComponent } from "../../pages/StarterPage/StarterPage";
import ErrorIcon from "@mui/icons-material/Error";
import CustomColors from "../../constants/colors";
import { Button } from "@mui/material";

function Starter({ userType, Page }) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(ChatifyContext);
  const [authStatus, setAuthStatus] = useState("loading");
  //loading
  //authenticated
  //admin-no-auth

  const checkUser = (userObj = currentUser) => {
    if (userType === "admin" && !userObj?.isAdmin) {
      setAuthStatus("admin-no-auth");
      return;
    }

    setCurrentUser(userObj);
    setAuthStatus("authenticated");
  };

  const fetchUser = async () => {
    setAuthStatus("loading");
    // console.log("checking...");
    if (currentUser) {
      checkUser();
    } else {
      let userId = localStorage.getItem("uid");
      if (!userId) {
        navigate("/signin");
      } else {
        let userRef = doc(db, `users/${userId}`);
        let docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          let userObj = {
            ...docSnap.data(),
            userId,
          };
          checkUser(userObj);
        } else {
          navigate("/signin");
          return;
        }
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {authStatus === "loading" ? (
        <StarterComponent />
      ) : authStatus === "authenticated" ? (
        <Page />
      ) : authStatus === "admin-no-auth" ? (
        <AdminFailAuth />
      ) : (
        <></>
      )}
    </>
  );
}

const AdminFailAuth = () => {
  const navigate = useNavigate();
  return (
    <div className="auth_fail_container">
      <div className="auth_fail_wrapper">
        <h3>Access denied</h3>
        <ErrorIcon sx={{ fontSize: "4rem", color: CustomColors.pink }} />
        <h4>You need to be an admin to access this page!</h4>
        <Button
          variant="text"
          sx={{ textTransform: "none" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default Starter;
