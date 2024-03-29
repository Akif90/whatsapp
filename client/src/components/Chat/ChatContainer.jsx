import {useStateProvider} from "@/context/StateContext";
import {calculateTime} from "@/utils/CalculateTime";
import React, {useEffect, useState} from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
import ContextMenu from "../common/ContextMenu";
import axios from "axios";
import {DELETE_MESSAGE} from "@/utils/ApiRoutes";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), {ssr: false});
import {MdDeleteOutline} from "react-icons/md";
import {reducerCases} from "@/context/constants";
import {Socket} from "socket.io-client";

function ChatContainer() {
  const [{messages, currentChatUser, userInfo, socket}, dispatch] =
    useStateProvider();
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  useEffect(() => {
    const container = document.getElementById("scroll-able");
    container.scrollTo(0, container.scrollHeight);
  }, [messages]);

  const handleDelete = async (msgId, userId) => {
    try {
      const res = await axios.post(DELETE_MESSAGE + "/" + msgId);
      if (res.status === 200) {
        socket.current.emit("delete-msg", {id: msgId, to: userId});
        dispatch({
          type: reducerCases.DELETE_MESSAGE,
          id: msgId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      id="scroll-able"
      className="h-[80vh] w-full flex-grow overflow-auto custom-scrollbar"
    >
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message, index) => {
              return (
                <div
                  key={message.id}
                  className={`${
                    message.senderId === currentChatUser.id
                      ? "justify-start"
                      : "justify-end"
                  } flex`}
                >
                  {message.type === "text" && (
                    <div
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsContextMenu(true);
                        setSelectedMessageId(message.id);
                      }}
                      className={`text-white px-2 py-[5px] text-sm rounded-md
                  flex gap-2 items-end max-w-[45%]  ${
                    message.senderId === currentChatUser.id
                      ? "bg-incoming-background"
                      : "bg-outgoing-background"
                  }`}
                    >
                      <span className="break-all">{message.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>
                          {message.senderId === userInfo.id && (
                            <MessageStatus
                              messageStatus={message.messageStatus}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  {message.type === "image" && (
                    <ImageMessage message={message} />
                  )}
                  {message.type === "audio" && (
                    <VoiceMessage message={message} />
                  )}

                  {isContextMenu &&
                    selectedMessageId === message.id &&
                    message.senderId !== currentChatUser.id && (
                      <div
                        className={`w-7 h-7  ${
                          message.senderId === currentChatUser.id
                            ? "order-1"
                            : "-order-1"
                        }   flex justify-center items-center `}
                      >
                        <MdDeleteOutline
                          onClick={() =>
                            handleDelete(message.id, message.receiverId)
                          }
                          className="w-full h-full text-white"
                        />
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
