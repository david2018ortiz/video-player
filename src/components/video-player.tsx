import { useState, useRef } from "react";
import { Play, Pause, Maximize2, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface VideoPlayerProps {
    src: string;
    poster: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // Rango: 0 a 1
    const [progress, setProgress] = useState(0); // Rango: 0 a 100
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Toggle reproducción
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

    // Actualizar progreso
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress =
                (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    // Cambiar tiempo de reproducción
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    // Cambiar volumen
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const newVolume = parseFloat(e.target.value);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    // Toggle silencio
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            setVolume(videoRef.current.muted ? 0 : videoRef.current.volume);
        }
    };

    // Pantalla completa
    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitRequestFullscreen) {
                // Para navegadores con prefijos (Safari)
                (videoRef.current as any).webkitRequestFullscreen();
            } else if ((videoRef.current as any).mozRequestFullScreen) {
                // Firefox
                (videoRef.current as any).mozRequestFullScreen();
            } else if ((videoRef.current as any).msRequestFullscreen) {
                // IE/Edge
                (videoRef.current as any).msRequestFullscreen();
            }
        }
    };

    return (
        <div className="relative aspect-video bg-black">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
            />

            {/* Controles */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-50 flex flex-col items-center">
                {/* Barra de progreso */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full mb-2"
                />

                <div className="flex items-center justify-between w-full">
                    {/* Botón de play/pausa */}
                    <button onClick={togglePlay} className="text-white p-2">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    {/* Control de volumen */}
                    <div className="flex items-center">
                        <button onClick={toggleMute} className="text-white p-2">
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="ml-2"
                        />
                    </div>

                    {/* Botón de pantalla completa */}
                    <button onClick={handleFullscreen} className="text-white p-2">
                        <Maximize2 size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
