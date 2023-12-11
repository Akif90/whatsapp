import {useStateProvider} from "@/context/StateContext";
import {reducerCases} from "@/context/constants";
import Image from "next/image";
import React, {useState} from "react";
import {MdOutlineCallEnd} from "react-icons/md";

function Container({data}) {
  const [{socket, userInfo}, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);
  const endCall = () => {
    dispatch({type: reducerCases.END_CALL});
  };
  return (
    <div
      className="border-conversation-border border-l w-full bg-conversation-panel-background
    flex flex-col h-[100vh] overflow-hidden justify-center text-white items-center
    "
    >
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl ">{data.name}</span>
        <span className="text-lg  ">
          {callAccepted && data.callType !== "video"
            ? "On-going Call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.type === "audio") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;
