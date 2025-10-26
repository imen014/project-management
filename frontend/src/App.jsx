import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/employee"
            element={
              <PrivateRoute roles={['employee']}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <PrivateRoute roles={['manager']}>
                <ManagerDashboard />
              </PrivateRoute>
            }
          />

          {/* Route par défaut */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
