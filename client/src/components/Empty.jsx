import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div
      className="border-conversation-border border-1 w-full
      bg-panel-header-background flex flex-col justify-center items-center
      border-b-4 h-[100vvh] border-b-icon-green 
    "
    >
      <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
    </div>
  );
}

export default Empty;
