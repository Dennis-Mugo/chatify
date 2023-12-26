import React, { useContext, useEffect } from "react";
import "./StarterPage.css";
import Logo from "../../components/Logo/Logo";
import { LinearProgress } from "@mui/material";
import CustomColors from "../../constants/colors";
import { ChatifyContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function StarterPage(props) {
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(ChatifyContext);

    const fetchUser = async () => {
        let userId = localStorage.getItem("uid");
        if (!userId) {
            navigate("/home");
        } else {
            let userRef = doc(db, `users/${userId}`);
            let docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setCurrentUser({
                    ...docSnap.data(), 
                    userId
                })
            }
            navigate("/chat");
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])
  return (
    <div className="starter_container">
      <div className="starter_wrapper">
        <Logo style={{margin: "20px 0"}} />
        <LinearProgress sx={{ color: CustomColors.blue, width: "100%" }} />
      </div>
    </div>
  );
}

export default StarterPage;
