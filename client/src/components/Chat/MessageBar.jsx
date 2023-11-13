import {useStateProvider} from "@/context/StateContext";
import {reducerCases} from "@/context/constants";
import {ADD_IMAGE_MESSAGES, SEND_MESSAGE} from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, {useEffect, useRef, useState} from "react";
import {BsEmojiSmile} from "react-icons/bs";
import {FaMicrophone} from "react-icons/fa";
import {ImAttachment} from "react-icons/im";
import {MdSend} from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import {headers} from "../../../next.config";
import CaptureAudio from "../common/CaptureAudio";

function MessageBar() {
  const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const emojiPickerRef = useRef();
  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emoji) => {
    setMessage((prevMsg) => prevMsg + emoji.emoji);
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target)
        )
          setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);
  const sendMessage = async () => {
    try {
      const {data} = await axios.post(SEND_MESSAGE, {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message,
      });
      socket.current.emit("send-msg", {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(ADD_IMAGE_MESSAGES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
      if (res.status === 201) {
        socket.current.emit("send-msg", {
          from: userInfo?.id,
          to: currentChatUser?.id,
          message: res.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...res.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6 ">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl "
              title="emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-24 left-16 z-40"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              onClick={() => setGrabPhoto(true)}
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
              {message.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl "
                  title="Send a message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl "
                  onClick={() => setShowAudioRecorder(true)}
                  title="Record a message"
                />
              )}
            </button>
          </div>
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio onChange={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
