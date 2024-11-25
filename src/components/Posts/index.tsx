import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Posts.css";

interface User {
  email: string;
  display_name: string;
  status: string;
  role: string;
  phone_number: string;
  pay_time: string | Date;
  created_time: string | Date;
  plan_name: string;
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

interface PostsProps {
  user: User;
  posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Intentando cargar posts...");
        const querySnapshot = await getDocs(collection(db, "posts"));
        if (querySnapshot.empty) {
          console.warn("La colección 'posts' está vacía.");
        }

        const postsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Sin título",
            description: data.description || "Sin descripción",
            images: data.images || [],
            views: data.views || 0,
            rating: data.rating || 0,
            create_time: data.create_time ? data.create_time.toDate().toISOString() : "",
          } as Post;
        });

        setPosts(postsData);
        console.log("Posts cargados correctamente:", postsData);
      } catch (err) {
        console.error("Error al cargar los posts:", err);
        setError("Hubo un problema al cargar los posts. Verifica tu conexión o permisos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  if (user.role !== "premium") {
    console.warn("El usuario no tiene rol 'premium'.");
    return;
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
          <h4>{post.title}</h4>
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
