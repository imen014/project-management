import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState(''); const [pwd,setPwd]=useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password: pwd });
      login(res.data);
      if(res.data.user.role === 'manager') nav('/manager'); else nav('/employee');
    } catch(err) { alert(err.response?.data?.msg || 'Erreur'); }
  };

  return (
    <form onSubmit={submit}>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
      <input value={pwd} type="password" onChange={e=>setPwd(e.target.value)} placeholder="password" />
      <button>Login</button>
    </form>
  );
}
