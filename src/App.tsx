import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import Login from "./components/Login";
import { Home } from "./components/Home";
import Navigation from "./components/Navigation";
import Posts from "./components/Posts";
import { VideoPlayer } from "./components/VideoPlayer";
import "./App.css";
import "./styles/video-list.css";

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

interface User {
  uid: string;
  email: string;
  display_name: string;
  status: string;
  role: string;
  phone_number: string;
  pay_time: string;
  created_time: string;
  plan_name: string;
}

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch videos from Firestore
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const videoData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().titulo || "Sin título",
          description: doc.data().descripcion || "Sin descripción",
          views: doc.data().visualizaciones || 0,
          rating: doc.data().valoracion || 0,
          uploadDate: doc.data().createTime?.toDate().toISOString() || new Date().toISOString(),
          videoUrl: doc.data().url || "",
          thumbnailUrl: doc.data().urlString || "",
        }));
        setVideos(videoData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los videos:", error);
        setLoading(false);
      }
    };

    // Handle user authentication state
    const handleAuthStateChange = () => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            setUser(null);
            await auth.signOut();
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    fetchVideos();
    const unsubscribe = handleAuthStateChange();

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <Router>
      {user && <Navigation />}
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route
          path="/videos"
          element={
            user.role === "premium" ? (
              <div className="video-grid">
                {videos.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    {...video} // Pasamos todas las propiedades del video como props
                  />
                ))}
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/posts"
          element={
            user.role === "premium" ? (
              <Posts role={user.role} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
