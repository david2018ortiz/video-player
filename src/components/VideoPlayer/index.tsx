import { useState, useRef } from "react";
import { Play, Pause, Maximize2, Volume2, VolumeX, Eye, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import "./VideoPlayer.css";

interface VideoProps {
  title: string;
  description: string;
  views: number;
  rating: number;
  uploadDate: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export function VideoPlayer({
  title,
  description,
  views,
  rating,
  uploadDate,
  videoUrl,
  thumbnailUrl,
}: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? volume || 1 : 0;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    try {
      if (videoRef.current) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen(); // Safari
        } else if ((videoRef.current as any).mozRequestFullScreen) {
          (videoRef.current as any).mozRequestFullScreen(); // Firefox
        } else if ((videoRef.current as any).msRequestFullscreen) {
          (videoRef.current as any).msRequestFullscreen(); // IE/Edge
        } else {
          console.warn("Fullscreen API no es compatible con este navegador.");
        }
      }
    } catch (error) {
      console.error("Error al intentar fullscreen:", error);
    }
  };

  return (
    <motion.div
      className="video-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="containerVideo">
        {/* Miniatura del video */}
        <div className="poster-overlay" onClick={togglePlay}>
          {!isPlaying && <img src={thumbnailUrl} alt="Miniatura del video" />}
          {!isPlaying && (
            <button className="play-button">
              <Play size={15} />
            </button>
          )}
        </div>
        {/* Elemento de video */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="video"
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="controls">
          <div className="container-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
            />
          </div>
          <div className="container-2">
            <div className="container-3">
              <div className="container-4">
                <button onClick={togglePlay}>
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={toggleMute}>
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
              <button onClick={handleFullscreen}>
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información del video */}
      <div className="video-info">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="video-meta">
          <div>
            <Eye size={14} /> {views.toLocaleString()} visualizaciones
          </div>
          <div>
            <Star size={14} className="text-yellow-400" /> {rating.toFixed(1)}
          </div>
          <div>
            <Calendar size={14} /> {new Date(uploadDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
