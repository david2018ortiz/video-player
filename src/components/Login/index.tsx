import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // No necesitas Firestore aquí
import "./Login.css";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetea el estado de error antes de intentar el inicio de sesión
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso:", userCredential.user);

      // Actualiza el usuario en el estado global (pasado como prop)
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);

      // Manejo de errores comunes
      if (err.code === "auth/user-not-found") {
        setError("Usuario no encontrado. Por favor verifica tu correo.");
      } else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta. Intenta nuevamente.");
      } else if (err.code === "auth/invalid-email") {
        setError("Correo electrónico inválido. Por favor ingresa un correo válido.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente más tarde.");
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <img src="https://girlvaleria.shop/wp-content/uploads/2024/11/icono-svg.svg" alt="" className="logo" />
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Entrar</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
