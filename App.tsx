import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register } from './pages/Auth';
import Layout from './components/Layout';
import UserDashboard from './pages/UserDashboard';
import UserFinance from './pages/UserFinance';
import UserProfile from './pages/UserProfile';
import UserReferral from './pages/UserReferral';
import UserTeam from './pages/UserTeam';
import UserHistory from './pages/UserHistory';
import UserBankDetails from './pages/UserBankDetails';
import UserChangePassword from './pages/UserChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import { getCurrentSession, getUserById } from './services/storage';
import { User, Role } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate session
    const session = getCurrentSession();
    if (session) {
        // Fetch latest state of user to ensure balance is correct
        const fresh = getUserById(session.id);
        setUser(fresh || session);
    }
    setLoading(false);
  }, []);

  const refreshUser = () => {
    if(user) {
        const fresh = getUserById(user.id);
        if (fresh) setUser(fresh);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-apso-dark font-bold">Loading APSO...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <Layout user={user} setUser={setUser}>
                <Routes>
                    {/* User Routes */}
                    {user.role === Role.USER && (
                        <>
                        <Route path="/dashboard" element={<UserDashboard user={user} />} />
                        <Route path="/finance" element={<UserFinance user={user} refreshUser={refreshUser} />} />
                        <Route path="/referral" element={<UserReferral user={user} />} />
                        <Route path="/team" element={<UserTeam user={user} />} />
                        <Route path="/history" element={<UserHistory />} />
                        <Route path="/profile" element={<UserProfile user={user} setUser={setUser} />} />
                        <Route path="/profile/bank" element={<UserBankDetails user={user} setUser={setUser} />} />
                        <Route path="/profile/password" element={<UserChangePassword user={user} setUser={setUser} />} />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                        </>
                    )}

                    {/* Admin Routes */}
                    {user.role === Role.ADMIN && (
                        <>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/*" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/admin" />} />
                        </>
                    )}
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;