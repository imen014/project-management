import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

export default function ManagerDashboard() {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);      // employés du manager
  const [allEmployees, setAllEmployees] = useState([]); // tous les employés
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [newTask, setNewTask] = useState({
    title: '', description: '', projectId: '', assignedTo: '', deadline: ''
  });
  const [newProject, setNewProject] = useState({
    title: '', description: '', startDate: '', endDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, empRes, allRes] = await Promise.all([
          api.get('/projects/my'),        // projets du manager
          api.get('/users/team'),         // employés assignés
          api.get('/users/all-employees') // tous les employés
        ]);

        setProjects(projRes.data.map(p => ({ ...p, tasks: p.tasks || [] })));
        setEmployees(empRes.data);
        setAllEmployees(allRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  // Créer un projet
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', newProject);
      setProjects(prev => [...prev, { ...res.data, tasks: [] }]);
      setNewProject({ title: '', description: '', startDate: '', endDate: '' });
      alert('Projet créé !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création du projet');
    }
  };

  // Créer une tâche
  const createTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', newTask);
      alert('Tâche créée !');
      setProjects(prev => prev.map(p =>
        p._id === newTask.projectId
          ? { ...p, tasks: [...p.tasks, res.data] }
          : p
      ));
      setNewTask({ title: '', description: '', projectId: '', assignedTo: '', deadline: '' });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la tâche');
    }
  };

  // Changer le statut d’une tâche
  const changeTaskStatus = async (taskId, projectId, status) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      setProjects(prev =>
        prev.map(p =>
          p._id === projectId
            ? { ...p, tasks: p.tasks.map(t => t._id === taskId ? { ...t, status } : t) }
            : p
        )
      );
    } catch (err) { console.error(err); }
  };

  // Réaffecter une tâche
  const reassignTask = async (taskId, projectId, newAssignee) => {
    try {
      await api.put(`/tasks/${taskId}/reassign`, { newAssignee });
      const assignedEmp = employees.find(emp => emp._id === newAssignee);
      setProjects(prev =>
        prev.map(p =>
          p._id === projectId
            ? {
                ...p,
                tasks: p.tasks.map(t =>
                  t._id === taskId
                    ? { ...t, assignedTo: assignedEmp || { _id: newAssignee }, status: 'assigned' }
                    : t
                )
              }
            : p
        )
      );
    } catch (err) { console.error(err); }
  };

  // Affecter un employé au manager
  const assignEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return alert('Veuillez sélectionner un employé');

    try {
      await api.put(`/users/${selectedEmployee}/assign`, { manager: user._id });
      const assigned = allEmployees.find(u => u._id === selectedEmployee);
      setEmployees(prev => [...prev, { ...assigned, manager: { _id: user._id } }]);
      setAllEmployees(prev => prev.map(u =>
        u._id === selectedEmployee ? { ...u, manager: { _id: user._id } } : u
      ));
      setSelectedEmployee('');
      alert('Employé affecté !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’affectation.');
    }
  };

  return (
    <div>
      <h2>Bienvenue Manager {user?.name}</h2>

      {/* Gestion employés */}
      <section>
        <h3>Mes employés</h3>
        {employees.length === 0 ? <p>Aucun employé pour le moment.</p> :
          <ul>{employees.map(emp => <li key={emp._id}>{emp.name} ({emp.email})</li>)}</ul>
        }

        <h3>Affecter un nouvel employé</h3>
        <form onSubmit={assignEmployee} style={{ marginBottom: '20px' }}>
          <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} required>
            <option value="">Sélectionner un employé</option>
            {allEmployees.filter(u => u.role === 'employee' && (!u.manager || u.manager._id.toString() !== user._id.toString()))
              .map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>)
            }
          </select>
          <button type="submit" style={{ marginLeft: '10px' }}>Affecter</button>
        </form>
      </section>

      {/* Formulaire création projet */}
      <section>
        <h3>Créer un nouveau projet</h3>
        <form onSubmit={createProject} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <input type="text" placeholder="Titre" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
          <input type="text" placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} required />
          <label>Date de début</label>
          <input type="date" value={newProject.startDate} onChange={e => setNewProject({ ...newProject, startDate: e.target.value })} required />
          <label>Date de fin</label>
          <input type="date" value={newProject.endDate} onChange={e => setNewProject({ ...newProject, endDate: e.target.value })} required />
          <button type="submit" style={{ marginTop: '10px' }}>Créer Projet</button>
        </form>
      </section>

      {/* Formulaire création tâche */}
      <section>
        <h3>Créer une nouvelle tâche</h3>
        <form onSubmit={createTask}>
          <input type="text" placeholder="Titre" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
          <input type="text" placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} required />
          <select value={newTask.projectId} onChange={e => setNewTask({ ...newTask, projectId: e.target.value })} required>
            <option value="">Sélectionner un projet</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
          <select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} required>
            <option value="">Sélectionner un employé</option>
            {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
          </select>
          <input type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} required />
          <button type="submit">Créer Tâche</button>
        </form>
      </section>

      {/* Liste projets et tâches */}
      <section>
        <h3>Projets et tâches</h3>
        {projects.map(proj => (
          <div key={proj._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{proj.title}</h4>
            {proj.tasks.length === 0 ? <p>Aucune tâche pour ce projet</p> :
              proj.tasks.map(task => (
                <div key={task._id} style={{ marginBottom: '5px' }}>
                  <strong>{task.title}</strong> - {task.status} - assigné à {task.assignedTo?.name || 'Non assigné'}
                  <button onClick={() => changeTaskStatus(task._id, proj._id, 'done')} style={{ marginLeft: '10px' }}>Terminer</button>
                  <select value={task.assignedTo?._id || ''} onChange={e => reassignTask(task._id, proj._id, e.target.value)} style={{ marginLeft: '10px' }}>
                    <option value="">Réaffecter</option>
                    {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                  </select>
                </div>
              ))
            }
          </div>
        ))}
      </section>
    </div>
  );
}
