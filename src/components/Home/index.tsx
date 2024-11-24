import React from 'react';
import './Home.css';

interface User {
  email: string;
  display_name: string;
  status: string;
  role: string;
  phone_number: string;
  pay_time: string;
  created_time: string;
  plan_name: string;
}

interface HomeProps {
  user: User;
  onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  return (
    <div className="home-container">
      <h1>Bienvenido, {user.display_name}</h1>
      <div className="user-info">
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Estado:</strong> {user.status}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <p><strong>Teléfono:</strong> {user.phone_number}</p>
        <p><strong>Fecha de pago:</strong> {new Date(user.pay_time).toLocaleDateString()}</p>
        <p><strong>Fecha de creación:</strong> {new Date(user.created_time).toLocaleDateString()}</p>
        <p><strong>Plan:</strong> {user.plan_name}</p>
      </div>
      <button onClick={onLogout} className="logout-button">Cerrar sesión</button>
    </div>
  );
};



