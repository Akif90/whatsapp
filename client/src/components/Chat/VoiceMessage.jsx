import {useStateProvider} from "@/context/StateContext";
import {HOST} from "@/utils/ApiRoutes";
import React, {useEffect, useRef, useState} from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import {FaPlay, FaStop} from "react-icons/fa";
import {calculateTime} from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({message}) {
  const [{currentChatUser, userInfo}] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [waveform, setWaveform] = useState(null);
  // const waveform = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    if (!waveFormRef.current) return;
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveform(wavesurfer);
    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [waveFormRef]);

  useEffect(() => {
    if (!waveform) return;
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
    waveform.on("ready", () => {
      setTotalDuration(waveform.current.getDuration());
    });
    waveform.load(audioURL);
  }, [message.message, waveform]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(audioMessage.curentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.stop();
      waveform.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };
  const handlePauseAudio = () => {
    waveform.stop();
    audioMessage.pause();
    setIsPlaying(false);
  };
  return (
    <div
      className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md 
  ${
    message.senderId === currentChatUser.id
      ? "bg-incoming-background"
      : "bg-outgoing-background"
  }
  `}
    >
      <div>
        <Avatar type="lg" image={currentChatUser?.profilePicture} />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />
        <div
          className="text-bubble-meta text-[11px] pt-1 flex
          justify-between absolute bottom-[-22px] w-full"
        >
          <span>
            {formatTime(isPlaying ? currentPlayBackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.senderId && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
