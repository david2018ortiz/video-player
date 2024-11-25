import React, { useState, useEffect } from "react";
import Slider from "react-slick";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Para la imagen en pantalla completa

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        if (querySnapshot.empty) {
          console.warn("La colección 'posts' está vacía.");
        }

        const postsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.titulo || "Sin título",
            description: data.descripcion || "Sin descripción",
            images: data.images || [],
            views: data.visualizaciones || 0,
            rating: data.valoracion || 0,
            create_time: data.create_time ? data.create_time.toDate().toISOString() : "",
          } as Post;
        });

        setPosts(postsData);
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
    return <div>No tienes acceso a este contenido.</div>;
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    swipe: true,
    adaptiveHeight: true,
    customPaging: () => <div className="custom-dot"></div>,
    appendDots: (dots: React.ReactNode) => <ul className="custom-dots">{dots}</ul>,
  };

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-carousel">
            <Slider {...sliderSettings}>
              {post.images.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img
                    src={image}
                    alt={`${post.title} - imagen ${index + 1}`}
                    className="post-image"
                    onClick={() => setSelectedImage(image)} // Mostrar la imagen en pantalla completa
                  />
                </div>
              ))}
            </Slider>
          </div>
          <h4>{post.title}</h4>
          <p>{post.description}</p>
          <div className="post-meta">
            <span>Vistas: {post.views}</span>
            <span>Valoración: {post.rating}/5</span>
            <span>{new Date(post.create_time).toLocaleDateString()}</span>
          </div>
        </div>
      ))}

      {selectedImage && ( // Modal de pantalla completa
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Imagen en pantalla completa" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default Posts;
