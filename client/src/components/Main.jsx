import React, {useEffect, useState} from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import {onAuthStateChanged} from "firebase/auth";
import {firebaseAuth} from "@/utils/FirebaseConfig";
import axios from "axios";
import {CHECK_USER_ROUTE} from "@/utils/ApiRoutes";
import {useRouter} from "next/router";
import {useStateProvider} from "@/context/StateContext";
import {reducerCases} from "@/context/constants";

function Main() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const router = useRouter();
  const [{userInfo}, dispatch] = useStateProvider();

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const {data} = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser?.email,
      });
      if (!data.status) router.push("/login");
      const {email, name, id, profilePicture: profileImage, status} = data.data;
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {name, id, email, profileImage, status},
      });
      router.push("/");
    }
  });

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        <Empty />
      </div>
    </>
  );
}

export default Main;
