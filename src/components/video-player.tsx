import { useState, useRef } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  src: string;
  poster: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); // Referencia al elemento <video>

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

  return (
    <div className="relative aspect-video">
      {/* Reproductor de video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
      />

      {/* Superposición y botón de reproducción */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="text-white p-3 rounded-full bg-primary bg-opacity-70 hover:bg-opacity-100 transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
      </motion.div>

      {/* Botón de maximizar */}
      <button className="absolute bottom-2 right-2 text-white p-1.5 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
        <Maximize2 size={16} />
      </button>
    </div>
  );
}
