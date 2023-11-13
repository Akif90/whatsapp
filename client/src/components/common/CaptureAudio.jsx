import {useStateProvider} from "@/context/StateContext";
import React, {useRef, useState} from "react";
import {FaMicrophone, FaPause, FaPlay, FaStop, FaTrash} from "react-icons/fa";
import {MdSend} from "react-icons/md";

function CaptureAudio({onChange}) {
  const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const audioRef = useRef(null);
  const waveFormRef = useRef(null);
  const mediaRecordedRef = useRef(null);

  const handlePlayRecording = () => {};
  const handleStopRecording = () => {};

  const handleStartRecording = () => {};
  const handlePauseRecording = () => {};

  const sendRecording = async () => {};

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => onChange(false)}
        />
      </div>
      <div
        className="mx-4 py-2 px-4 text-white text-lg flex gap-3 
      bg-search-input-container-background rounded-full drop-shadow-lg justify-center items-center"
      >
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center ">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onCanPlay={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone
              className="text-red-500"
              onClick={handleStartRecording}
            />
          ) : (
            <FaPause className="text-red-500" onClick={handleStopRecording} />
          )}
        </div>
        <div className="">
          <MdSend
            className="text-panel-header-icon cursor-pointer mr-4 "
            title="Send"
            onClick={sendRecording}
          />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
