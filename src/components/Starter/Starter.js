import React, { useContext, useEffect } from "react";
import { ChatifyContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function Starter(props) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(ChatifyContext);

  const fetchUser = async () => {
    console.log("checking...");
    if (currentUser) return;
    let userId = localStorage.getItem("uid");
    if (!userId) {
      navigate("/signin");
    } else {
      let userRef = doc(db, `users/${userId}`);
      let docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setCurrentUser({
          ...docSnap.data(),
          userId,
        });
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return <></>;
}

export default Starter;
