// App.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VideoPlayer } from "./components/video-player";
import { Star, Eye, Calendar } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ajusta la ruta según donde crees este archivo
import "./App.css";
import "./styles/video-list.css"; // Asegúrate de incluir este estilo

interface Video {
  id: string;
  title: string;
  description: string;
  views: number;
  rating: number;
  uploadDate: string;
  videoUrl: string;
  thumbnailUrl: string;
}

// Función para probar la conexión con Firestore
const testConnection = async () => {
  try {
    const snapshot = await getDocs(collection(db, "videos"));
    console.log("Conexión exitosa. Datos recibidos:");
    snapshot.forEach((doc) => console.log(doc.id, "=>", doc.data()));
  } catch (error) {
    console.error("Error al conectar con Firestore:", error);
  }
};

// Componente para mostrar estrellas de valoración
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={`${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Probar conexión con Firestore
    testConnection();

    // Función para cargar videos desde Firestore
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const videoData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.titulo || "Sin título",
            description: data.descripcion || "Sin descripción",
            views: data.visualizaciones || 0,
            rating: data.valoracion || 0,
            uploadDate: data.createTime?.toDate().toISOString() || new Date().toISOString(),
            videoUrl: data.url || "",
            thumbnailUrl: data.urlString || "", // Carga la miniatura desde Firestore
          };
        });
        setVideos(videoData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los videos:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="loading">Cargando videos...</div>;
  }

  return (
    <div className="container">
      <div className="video-grid">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            className="video-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Componente de reproductor con miniatura */}
            <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} />
            <div className="video-info">
              <h2 className="video-title">{video.title}</h2>
              <p className="video-description">{video.description}</p>
              <div className="video-meta">
                <div className="containerEstadisticas">
                  <div className="meta-item">
                    <Eye size={14} />
                    {video.views.toLocaleString()} visualizaciones
                  </div>
                  <div className="meta-item">
                    <RatingStars rating={video.rating} />
                  </div>
                </div>
                <div className="meta-item">
                  <Calendar size={14} />
                  {new Date(video.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;
