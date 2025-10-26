// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // non connecté
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />; // rôle non autorisé

  return children;
}
