import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Posts.css";

interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  rating: number;
  create_time: string;
}

interface PostsProps {
  role: string; // Prop para recibir el rol del usuario
}

const Posts: React.FC<PostsProps> = ({ role }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Post)
        );
        setPosts(postsData);
      } catch (err) {
        console.error("Error al cargar los posts:", err);
        setError("Hubo un problema al cargar los posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (role !== "premium") {
    return (
      <div className="posts-container">
        <p>No tienes acceso a este contenido. Solo usuarios premium pueden ver los posts.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="posts-container">Cargando posts...</div>;
  }

  if (error) {
    return <div className="posts-container">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="posts-container">No hay posts disponibles.</div>;
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-carousel">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${post.title} - imagen ${index + 1}`}
                className="post-image"
              />
            ))}
          </div>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <div className="post-meta">
            <span>Vistas: {post.views}</span>
            <span>Valoración: {post.rating}/5</span>
            <span>Creado: {new Date(post.create_time).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
