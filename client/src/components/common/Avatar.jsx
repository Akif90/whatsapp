import Image from "next/image";
import React, {useState} from "react";
import {FaCamera} from "react-icons/fa";
import ContextMenu from "./ContextMenu";

function Avatar({type, image, setImage}) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {},
    },
    {
      name: "Choose from Library",
      callback: () => {},
    },
    {
      name: "Upload Photo",
      callback: () => {},
    },
    {
      name: "Remove Photo",
      callback: () => {},
    },
  ];
  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({x: e.pageX, y: e.pageY});
  };
  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image
              src={image}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image
              src={image}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        )}
        {type === "xl" && (
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="relative cursor-pointer z-0"
          >
            <div
              className={`bg-photopicker-overlay-background z-10 h-60 w-60 absolute top-0 left-0 flex
               items-center rounded-full justify-center flex-col text-center gap-2
               ${hover ? "visible" : "hidden"}
               `}
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />

              <span id="context-opener" onClick={(e) => showContextMenu(e)}>
                Change <br /> Profile Photo
              </span>
            </div>
            <div className="relative h-60 w-60">
              <Image
                src={image}
                alt="avatar"
                fill={true}
                className="rounded-full"
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
    </>
  );
}

export default Avatar;
