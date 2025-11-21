import React, { useState } from 'react';
import { User } from '../types';
import { saveUser } from '../services/storage';
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PasswordProps {
  user: User;
  setUser: (u: User | null) => void;
}

const UserChangePassword: React.FC<PasswordProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (oldPass !== user.password) {
        setMsg({ type: 'error', text: 'Old password is incorrect.' });
        return;
    }

    if (newPass.length < 4) {
        setMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
        return;
    }

    if (newPass !== confirmPass) {
        setMsg({ type: 'error', text: 'New passwords do not match.' });
        return;
    }

    const updatedUser = { ...user, password: newPass };
    saveUser(updatedUser);
    setUser(updatedUser);
    
    setMsg({ type: 'success', text: 'Password updated successfully!' });
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    
    setTimeout(() => {
        setMsg(null);
        navigate('/profile');
    }, 2000);
  };

  return (
    <div className="pt-4 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/profile')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Security</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <div className="flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mx-auto mb-6">
            <Lock className="w-8 h-8 text-purple-600" />
         </div>
         
         <h3 className="text-center font-bold text-lg mb-2">Change Password</h3>
         <p className="text-center text-gray-500 text-sm mb-8">Ensure your account is secure by using a strong password.</p>

         {msg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {msg.text}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Old Password</label>
                <input
                    type="password"
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark"
                    value={oldPass}
                    onChange={e => setOldPass(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">New Password</label>
                <input
                    type="password"
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                <input
                    type="password"
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark"
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                />
            </div>

            <button type="submit" className="w-full bg-apso-dark text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Update Password
            </button>
         </form>
      </div>
    </div>
  );
};

export default UserChangePassword;