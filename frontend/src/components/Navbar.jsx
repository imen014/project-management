import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      {user ? (
        <>
          <span>Bonjour {user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Déconnexion</button>
        </>
      ) : (
        <span>Non connecté</span>
      )}
    </nav>
  );
}
