import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [role, setRole] = useState('employee'); // valeur par défaut
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password: pwd, role });
      login(res.data);
      // Rediriger selon le rôle
      if (res.data.user.role === 'manager') nav('/manager');
      else nav('/employee');
    } catch (err) {
      alert(err.response?.data?.msg || 'Erreur lors de l’inscription');
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input value={pwd} type="password" onChange={e => setPwd(e.target.value)} placeholder="Mot de passe" required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="employee">Employé</option>
        <option value="manager">Manager</option>
      </select>
      <button type="submit" style={{ marginTop: '10px' }}>S’inscrire</button>
    </form>
  );
}
