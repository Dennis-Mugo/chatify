import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { db, storage } from "../firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uuid4 as v4 } from "uuid4";

export const ChatifyContext = createContext();

export const ChatifyProvider = ({ children }) => {
  const [tempUser, setTempUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
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

  return (
    <ChatifyContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatifyContext.Provider>
  );
};
