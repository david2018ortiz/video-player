import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/posts">Imagenes</Link></li>
        <li><Link to="/videos">Videos</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
