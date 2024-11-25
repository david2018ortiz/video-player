import React from "react";
import "./Home.css";

interface User {
  email: string;
  display_name: string;
  status: string;
  role: string;
  phone_number: string;
  pay_time: string | Date; // Puede ser string o un objeto Date
  created_time: string | Date; // Igual que pay_time
  plan_name: string;
}

interface HomeProps {
  user: User;
  onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  return (
    <div className="home-container">
      <h4>Bienvenido, {user.display_name}</h4>
      <div className="user-info">
        <p>
          <strong>Correo:</strong> {user.email}
        </p>
        <p>
          <strong>Estado:</strong> {user.status}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
        <p>
          <strong>Teléfono:</strong> {user.phone_number}
        </p>
        <p>
          <strong>Fecha de pago:</strong>{" "}
          {user.pay_time ? new Date(user.pay_time).toLocaleDateString() : "No disponible"}
        </p>
        <p>
          <strong>Fecha de Inicio:</strong>{" "}
          {user.created_time
            ? new Date(user.created_time).toLocaleDateString()
            : "No disponible"}
        </p>
        <p>
          <strong>Plan:</strong> {user.plan_name}
        </p>
      </div>
      <button onClick={onLogout} className="logout-button">
        Cerrar sesión
      </button>
    </div>
  );
};
