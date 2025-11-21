import React, { useState, useEffect } from 'react';
import { User, BankDetails } from '../types';
import { saveUser, getUserById } from '../services/storage';
import { ArrowLeft, CreditCard, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BankProps {
  user: User;
  setUser: (u: User | null) => void;
}

const UserBankDetails: React.FC<BankProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<BankDetails>({
    accountHolder: '',
    accountNumber: '',
    ifsc: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user.bankDetails) {
        setDetails(user.bankDetails);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!details.accountHolder || !details.accountNumber || !details.ifsc) {
        setMsg('Please fill in all fields.');
        return;
    }

    const updatedUser = { ...user, bankDetails: details };
    saveUser(updatedUser);
    setUser(updatedUser); // Update session state
    
    setMsg('Bank details saved successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="pt-4 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/profile')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-blue-600" />
         </div>
         
         <h3 className="text-center font-bold text-lg mb-2">Manage Payout Account</h3>
         <p className="text-center text-gray-500 text-sm mb-8">Enter your bank details correctly to receive withdrawals without delay.</p>

         {msg && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {msg}
            </div>
         )}

         <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Account Holder Name</label>
                <input
                    type="text"
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark"
                    placeholder="Enter your name"
                    value={details.accountHolder}
                    onChange={e => setDetails({...details, accountHolder: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Account Number</label>
                <input
                    type="text"
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark"
                    placeholder="e.g. 1234567890"
                    value={details.accountNumber}
                    onChange={e => setDetails({...details, accountNumber: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">IFSC Code</label>
                <input
                    type="text"
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark uppercase"
                    placeholder="e.g. SBIN0001234"
                    value={details.ifsc}
                    onChange={e => setDetails({...details, ifsc: e.target.value})}
                />
            </div>

            <button type="submit" className="w-full bg-apso-dark text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Details
            </button>
         </form>
      </div>
    </div>
  );
};

export default UserBankDetails;