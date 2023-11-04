import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import {useStateProvider} from "@/context/StateContext";
import {ONBOARD_USER_ROUTE} from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";

function onboarding() {
  const [{userInfo, newUser}, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");
  const router = useRouter();

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const onBoardUserHandler = async () => {
    if (name.length < 3) return false;
    const email = userInfo.email;
    try {
      const {data} = await axios.post(ONBOARD_USER_ROUTE, {
        email,
        name,
        about,
        image,
      });
      if (data.status) {
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: false,
        });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id: data.id,
            name,
            email,
            profileImage: image,
            status: about,
          },
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center flex-col  text-white bg-panel-header-background h-screen w-screen">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              onClick={onBoardUserHandler}
              className="flexbg-search-input-container-background p-4 rounded-lg gap-4 justify-center items-center"
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
