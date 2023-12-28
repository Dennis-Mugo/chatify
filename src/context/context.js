import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db, storage } from "../firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uuid4 as v4 } from "uuid4";
import { baseUrl, getConnectionsUrl } from "../constants/constants";

export const ChatifyContext = createContext();

export const ChatifyProvider = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(null);
  const [tempUser, setTempUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionsStatus, setConnectionsStatus] = useState("loading");
  const [selectedFriend, setSelectedFriend] = useState(null);

  let hasWindow = typeof window !== "undefined";
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    if (hasWindow) {
      setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [hasWindow]);

  const clipWords = (words, num) => {
    return words.length > num ? words.slice(0, num) + "..." : words;
  };

  const storeTempUser = async (user) => {
    localStorage.setItem("tempUser", JSON.stringify(user));
  };

  const fetchTempUser = async (userId) => {
    let userRef = doc(db, `users/${userId}`);
    let userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      let user = { ...userSnap.data(), uid: userId };
      localStorage.setItem("tempUser", JSON.stringify(user));
    } else {
      console.log("User does not exist");
    }
  };

  const signinUser = async (userId) => {
    localStorage.setItem("uid", userId);
    let userRef = doc(db, `users/${userId}`);
    let userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setCurrentUser({ ...userSnap.data(), userId });
    }
    localStorage.removeItem("tempUser");
  };

  const createNewUser = async (tel) => {
    let user = JSON.parse(localStorage.getItem("tempUser"));
    // console.log(user);
    // console.log(tel);
    let userId = user.uid;
    let userObj = {
      dateCreated: user.createdAt,
      email: user.email,
      lastLogin: user.lastLoginAt,
      phoneNumber: tel,
    };
    let userRef = doc(db, `users/${userId}`);
    await setDoc(userRef, userObj);
    localStorage.removeItem("tempUser");
    localStorage.setItem("uid", userId);
    setCurrentUser({ ...userObj, userId });
  };

  const signOut = async () => {
    localStorage.removeItem("uid");
    setCurrentUser(false);
  };

  const updateUserProfile = async (profileDetails) => {
    if (!currentUser) {
      console.error("No user!");
    }
    let userRef = doc(db, `users/${currentUser.userId}`);
    await updateDoc(userRef, profileDetails);
    setCurrentUser({ ...currentUser, ...profileDetails });
  };

  const uploadFile = async (
    fileDetails,
    endProcess,
    directory = "avatars",
    setProgress = (val) => {}
  ) => {
    const storageRef = ref(storage, `${directory}/${fileDetails.name + v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, fileDetails);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          endProcess(downloadURL);
        });
      }
    );
  };

  const fetchConnections = async () => {
    setConnectionsStatus("loading");
    let res = await fetch(`${getConnectionsUrl}/get_connections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUser.userId }),
    });
    res = await res.json();
    // let res = [];
    console.log(res);
    setConnections(res);
    if (!res.length) {
      setConnectionsStatus("no results");
    } else {
      setConnectionsStatus("results");
    }
  };

  return (
    <ChatifyContext.Provider
      value={{
        screenWidth,
        clipWords,
        currentUser,
        setCurrentUser,
        tempUser,
        setTempUser,
        fetchTempUser,
        signinUser,
        createNewUser,
        storeTempUser,
        uploadFile,
        updateUserProfile,
        signOut,
        fetchConnections,
        connections,
        connectionsStatus,
        setConnectionsStatus,
        selectedFriend,
        setSelectedFriend,
      }}
    >
      {children}
    </ChatifyContext.Provider>
  );
};
