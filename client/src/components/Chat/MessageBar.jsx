import {useStateProvider} from "@/context/StateContext";
import {SEND_MESSAGE} from "@/utils/ApiRoutes";
import axios from "axios";
import React, {useState} from "react";
import {BsEmojiSmile} from "react-icons/bs";
import {FaMicrophone} from "react-icons/fa";
import {ImAttachment} from "react-icons/im";
import {MdSend} from "react-icons/md";

function MessageBar() {
  const [{userInfo, currentChatUser}, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      const {data} = await axios.post(SEND_MESSAGE, {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6 ">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl "
            title="emoji"
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
          />
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none
          text-white h-10 rounded-lg px-5 py-4 w-full"
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl "
              title="Send a message"
              onClick={sendMessage}
            />
            {/* <FaMicrophone
              className="text-panel-header-icon cursor-pointer text-xl "
              title="Record a message"
            /> */}
          </button>
        </div>
      </>
    </div>
  );
}

export default MessageBar;
