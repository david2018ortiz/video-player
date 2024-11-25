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

interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  rating: number;
  create_time: string;
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
  const [posts, setPosts] = useState<Post[]>([]); // Estado para los posts
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch videos from Firestore
        const videoQuerySnapshot = await getDocs(collection(db, "videos"));
        const videoData = videoQuerySnapshot.docs.map((doc) => ({
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

        // Fetch posts from Firestore
        const postQuerySnapshot = await getDocs(collection(db, "posts"));
        const postsData = postQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().titulo || "Sin título",
          description: doc.data().description || "Sin descripción",
          images: doc.data().images || [],
          views: doc.data().visualizaciones || 0,
          rating: doc.data().valoracion || 0,
          create_time: doc.data().create_time?.toDate().toISOString() || "",
        }));
        setPosts(postsData);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error al cargar los datos de Firestore:", error.message);
        } else {
          console.error("Error inesperado:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    const handleAuthStateChange = () => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              const userData: User = {
                uid: firebaseUser.uid,
                email: data.email || "",
                display_name: data.display_name || "",
                status: data.status || "",
                role: data.role || "",
                phone_number: data.phone_number || "",
                pay_time: data.pay_time?.toDate().toISOString() || "",
                created_time: data.created_time?.toDate().toISOString() || "",
                plan_name: data.plan_name || "",
              };
              setUser(userData);

              // Fetch Firestore data after user authentication
              await fetchData();
            } else {
              console.error("Usuario no encontrado en Firestore.");
              setUser(null);
              await auth.signOut();
            }
          } catch (error) {
            if (error instanceof Error) {
              console.error("Error al obtener el documento del usuario:", error.message);
            } else {
              console.error("Error inesperado:", error);
            }
            setUser(null);
            await auth.signOut();
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      return unsubscribe;
    };

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
              <Posts user={user} posts={posts} />
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
