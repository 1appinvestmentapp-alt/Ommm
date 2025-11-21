import React from 'react';
import { User } from '../types';
import { setSession } from '../services/storage';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Phone, Shield, ChevronRight, CreditCard, Lock } from 'lucide-react';

interface ProfileProps {
  user: User;
  setUser: (u: User | null) => void;
}

const UserProfile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="pt-6 space-y-6">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-apso-dark to-blue-800 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
            <span className="text-3xl font-bold text-white">{user.fullName.charAt(0)}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
        <p className="text-gray-500 flex items-center gap-1 mt-1">
            <Phone className="w-3 h-3" /> {user.phone}
        </p>
        <div className="mt-4 bg-apso-gold/10 text-apso-dark px-4 py-1 rounded-full text-sm font-bold">
            ID: {user.id}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">Account Settings</h3>
         </div>
         
         <div className="divide-y divide-gray-100">
             <button onClick={() => navigate('/profile/bank')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CreditCard className="w-5 h-5" /></div>
                    <span className="font-medium text-gray-700">Bank Details</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
             </button>

             <button onClick={() => navigate('/profile/password')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Lock className="w-5 h-5" /></div>
                    <span className="font-medium text-gray-700">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
             </button>

             <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Shield className="w-5 h-5" /></div>
                    <span className="font-medium text-gray-700">Privacy Policy</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
             </button>
         </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
      
      <p className="text-center text-xs text-gray-300 pt-4">App Version 1.0.2</p>
    </div>
  );
};

export default UserProfile;