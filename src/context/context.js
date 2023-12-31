import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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

  useEffect(() => {
    if (!currentUser) return;

    let connectionsQuery = query(
      collection(db, `connections`),
      where("user2", "==", currentUser.userId)
    );
    const unsubConn = onSnapshot(connectionsQuery, async (snapshot) => {
      await fetchConnections(false);
    });
    return unsubConn;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    let connectionsQuery = query(
      collection(db, `chats`),
      where("receiverId", "==", currentUser.userId),
      where("status", "==", "unread")
    );
    const unsubConn = onSnapshot(connectionsQuery, async (snapshot) => {
      console.log("new message");
      await fetchConnections(false);
    });
    return unsubConn;
  }, [currentUser]);

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
    setSelectedFriend(null);
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

  const sendFetchConnectionsRequest = async () => {
    let res = await fetch(`${getConnectionsUrl}/get_connections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUser.userId }),
    });
    res = await res.json();
    console.log(res);
    return res;
  };

  const fetchConnections = async (showLoading = true) => {
    if (showLoading) setConnectionsStatus("loading");
    let res = await sendFetchConnectionsRequest();
    setConnections(res);
    if (!res.length) {
      setConnectionsStatus("no results");
    } else {
      setConnectionsStatus("results");
    }
  };

  const initializeConnectionsSnapshot = async () => {};

  const sendChat = async (message) => {
    let chatObj = {
      dateCreated: Date.now().toString(),
      message,
      senderId: currentUser.userId,
      receiverId: selectedFriend.userId,
      status: "unread", //Could be unread or read
    };
    let chatId = v4();
    let chatRef = doc(db, `chats/${chatId}`);
    await setDoc(chatRef, chatObj);
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
        sendChat,
      }}
    >
      {children}
    </ChatifyContext.Provider>
  );
};
