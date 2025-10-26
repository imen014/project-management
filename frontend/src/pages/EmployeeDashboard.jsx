import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [colleagues, setColleagues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, colleaguesRes] = await Promise.all([
          api.get('/tasks/mine'),
          api.get('/users/team')
        ]);
        setTasks(taskRes.data);
        setColleagues(colleaguesRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
    } catch (err) { console.error(err); }
  };

  const reassignTask = async (id, newAssignee) => {
    try {
      await api.put(`/tasks/${id}/reassign`, { newAssignee });
      const colleagueObj = colleagues.find(c => c._id === newAssignee);
      setTasks(prev =>
        prev.map(t => t._id === id
          ? { ...t, assignedTo: colleagueObj || { _id: newAssignee }, status: 'assigned' }
          : t
        )
      );
    } catch (err) { console.error(err); }
  };

  const renderTask = (task, buttonLabel, nextStatus) => (
    <div key={task._id} style={{ marginBottom: '10px' }}>
      <strong>{task.title}</strong> ({task.project?.title || 'Projet inconnu'}) - assigné à {task.assignedTo?.name || 'Non assigné'}
      <button style={{ marginLeft: '10px' }} onClick={() => changeStatus(task._id, nextStatus)}>{buttonLabel}</button>
      <select style={{ marginLeft: '10px' }} value={task.assignedTo?._id || ''} onChange={e => reassignTask(task._id, e.target.value)}>
        <option value="">Réaffecter</option>
        {colleagues.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <h2>Bienvenue {user?.name}</h2>

      <section>
        <h3>À faire</h3>
        {tasks.filter(t => t.status === 'assigned').map(t => renderTask(t, 'Start', 'starting'))}
      </section>

      <section>
        <h3>En cours</h3>
        {tasks.filter(t => t.status === 'in_progress' || t.status === 'starting').map(t => renderTask(t, 'Terminer', 'done'))}
      </section>

      <section>
        <h3>Terminées</h3>
        {tasks.filter(t => t.status === 'done').map(t => (
          <div key={t._id}>{t.title} ({t.project?.title || 'Projet inconnu'}) - assigné à {t.assignedTo?.name || 'Non assigné'}</div>
        ))}
      </section>
    </div>
  );
}
