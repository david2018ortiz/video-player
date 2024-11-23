import { useState, useRef } from "react";
import { Play, Pause, Maximize2, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    poster: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // Rango: 0 a 1
    const [progress, setProgress] = useState(0); // Rango: 0 a 100
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false); // Controla la visibilidad de la barra de volumen
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
            setIsMuted(newVolume === 0); // Actualiza mute si el volumen es 0
        }
    };

    // Toggle silencio
    const toggleMute = () => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = volume > 0 ? volume : 1;
                setVolume(volume > 0 ? volume : 1);
            } else {
                videoRef.current.volume = 0;
                setVolume(0);
            }
            setIsMuted(!isMuted);
        }
    };

    // Pantalla completa
    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitRequestFullscreen) {
                (videoRef.current as any).webkitRequestFullscreen();
            } else if ((videoRef.current as any).mozRequestFullScreen) {
                (videoRef.current as any).mozRequestFullScreen();
            } else if ((videoRef.current as any).msRequestFullscreen) {
                (videoRef.current as any).msRequestFullscreen();
            }
        }
    };

    return (
        <div className="ContainerVideoPlayer">
            {/* Imagen de previsualización */}
            {!isPlaying && (
                <div
                    className="poster-overlay"
                    onClick={togglePlay}
                >
                    <img
                        src={poster}
                        alt="Miniatura del video"
                        className="object-cover"
                    />
                    <button className="play-button">
                        <Play size={30} />
                    </button>
                </div>
            )}

            {/* Video */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className={`video ${isPlaying ? "visible" : "hidden"}`}
                onTimeUpdate={handleTimeUpdate}
            />

            {/* Controles */}
            <div className="contenedorControles">
                {/* Barra de progreso */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="barraProgreso"
                />

                <div className="containerPlayPausa">
                    
                    <div className="playPausaVolumen">
                        {/* Botón de play/pausa */}
                    <button onClick={togglePlay} className="botonPlayPausa">
                        {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                    </button>

                    {/* Control de volumen */}
                    <div className="controlVolumen">
                        <button
                            onClick={() => {
                                toggleMute();
                                setShowVolumeSlider(!showVolumeSlider);
                            }}
                            className="botonVolumen"
                        >
                            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>
                        {showVolumeSlider && (
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volumen"
                            />
                        )}
                    </div>
                    </div>

                    {/* Botón de pantalla completa */}
                    <button onClick={handleFullscreen} className="pantallaCompleta">
                        <Maximize2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
