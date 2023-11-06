import React from "react";
import Avatar from "../common/Avatar";
import {useStateProvider} from "@/context/StateContext";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from "react-icons/bs";
import {reducerCases} from "@/context/constants";
function ChatListHeader() {
  const [{userInfo}, dispatch] = useStateProvider();
  const handleAllContactsPage = async () => {
    dispatch({type: reducerCases.SET_ALL_CONTACTS_PAGE});
  };
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            title="Menu"
            className="text-panel-header-icon cursor-pointer text-xl"
          />
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
