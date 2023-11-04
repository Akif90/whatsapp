import {useStateProvider} from "@/context/StateContext";
import {reducerCases} from "@/context/constants";
import {CHECK_USER_ROUTE} from "@/utils/ApiRoutes";
import {firebaseAuth} from "@/utils/FirebaseConfig";
import axios from "axios";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {FcGoogle} from "react-icons/fc";

function login() {
  const router = useRouter();
  const [{userInfo, newUser}, dispatch] = useStateProvider();
  useEffect(() => {
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const {
        user: {displayName: name, email, photoURL: profileImage},
      } = await signInWithPopup(firebaseAuth, provider);
      const {data} = await axios.post(CHECK_USER_ROUTE, {email});
      if (!data.status) {
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: true,
        });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {name, email, profileImage, status: ""},
        });
        router.push("/onboarding");
      } else {
        const {email, name, id, profilePicture: profileImage, status} = data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {name, id, email, profileImage, status},
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" width={300} height={300} alt="Whatsapp" />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button
        onClick={handleLogin}
        className="flex  bg-search-input-container-background p-4 rounded-lg gap-4 justify-center items-center"
      >
        <FcGoogle className="text-3xl" />
        <span className="text-3xl text-white">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
