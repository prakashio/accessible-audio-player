import { useRef, useState } from "react";

import { formatTime, formatHumanReadTime } from "../../helpers/timeFormat";

const AudioPlayer = ({ src, transcript }) => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [mediaTime, setMediaTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const toggleMuted = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const onLoadedMetaData = () => {
    setDuration(audioRef.current.duration);
  };

  const onTimeUpdate = () => {
    setMediaTime(audioRef.current.currentTime);
  };

  const onScrubberChange = (event) => {
    const newTime = event.target.value;
    setMediaTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const onRewind = () => {
    const { currentTime } = audioRef.current;
    const newTime = Math.max(currentTime - 15, 0);
    setMediaTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const onFastForward = () => {
    const { currentTime } = audioRef.current;
    const newTime = Math.min(currentTime + 15, duration);
    setMediaTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const playbackRates = [0.5, 1.25, 1.5, 1.75, 2];

  const changeRate = (rate) => {
    audioRef.current.playbackRate = rate;
  };

  const onVolumeChange = () => {
    if (audioRef.current.muted || audioRef.current.volume === 0) {
      setIsMuted(true);
    } else if (!audioRef.current.muted) {
      setIsMuted(false);
      setVolume(audioRef.current.volume);
    }
  };

  const onVolumeScrubberChange = (event) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <>
      <div>
        <button onClick={togglePlaying}>{isPlaying ? "Pause" : "Play"}</button>
        <span className="elapsed">Elapsed time: {formatTime(mediaTime)}</span>
        <span className="duration">Total time: {formatTime(duration)}</span>
        <label htmlFor="scrubber-input">Scrubber</label>
        <input
          id="scrubber-input"
          type="range"
          value={mediaTime}
          min="0"
          max={duration}
          step={0.1}
          onChange={onScrubberChange}
          aria-valuetext={formatHumanReadTime(mediaTime)}
        />
        <button onClick={onRewind}>Rewind 15 sec</button>
        <button onClick={onFastForward}> Fast forward 15 sec </button>
        {playbackRates.map((rate, i) => (
          <button key={i} onClick={() => changeRate(rate)}>
            {rate}x
          </button>
        ))}
        <button onClick={toggleMuted}>{isMuted ? "Unmute" : "Mute"}</button>
        <label htmlFor="volume-scrubber"></label>
        <input
          type="range"
          id="volume-scrubber"
          value={isMuted ? 0 : volume}
          min={0}
          max={1}
          step={0.1}
          onChange={onVolumeScrubberChange}
        />
      </div>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={onLoadedMetaData}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={onVolumeChange}
        controls
      />
      <div>{transcript}</div>
    </>
  );
};

export default AudioPlayer;
