import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

export default function ManageEmployees() {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);        // employés du manager
  const [allEmployees, setAllEmployees] = useState([]);  // tous les employés
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/users/all-employees'); 
        setAllEmployees(res.data);

        // Filtrer les employés assignés à ce manager
        const myEmployees = res.data.filter(u => u.manager?._id?.toString() === user._id.toString());
        setEmployees(myEmployees);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, [user]);

  const assignEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return alert('Veuillez sélectionner un employé');

    try {
      await api.put(`/users/${selectedEmployee}/assign`, { manager: user._id });
      const assigned = allEmployees.find(u => u._id === selectedEmployee);
      setEmployees(prev => [...prev, { ...assigned, manager: { _id: user._id } }]);

      // Mettre à jour allEmployees pour retirer la sélection
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
      <h3>Gérer les employés</h3>

      <section>
        <h4>Mes employés</h4>
        {employees.length === 0 ? (
          <p>Aucun employé pour le moment.</p>
        ) : (
          <ul>{employees.map(emp => <li key={emp._id}>{emp.name} ({emp.email})</li>)}</ul>
        )}
      </section>

      <section>
        <h4>Affecter un nouvel employé</h4>
        <form onSubmit={assignEmployee}>
          <select
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
            required
          >
            <option value="">Sélectionner un employé</option>
            {allEmployees
              .filter(u => u.role === 'employee' && (!u.manager || u.manager._id.toString() !== user._id.toString()))
              .map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))
            }
          </select>
          <button type="submit" style={{ marginLeft: '10px' }}>Affecter</button>
        </form>
      </section>
    </div>
  );
}
