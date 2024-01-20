import React, {useEffect, useRef} from "react";

function ContextMenu({options, coordinates, contextMenu, setContextMenu}) {
  const contextMenuRef = useRef(null);
  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target)
        ) {
          setContextMenu(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[2000] shadow-xl`}
      ref={contextMenuRef}
      style={{
        top: coordinates.y,
        left: coordinates.x,
      }}
    >
      <ul>
        {options.map(({name, callback}) => {
          return (
            <li
              className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
              key={name}
              onClick={(e) => handleClick(e, callback)}
            >
              <span className="text-white">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContextMenu;
