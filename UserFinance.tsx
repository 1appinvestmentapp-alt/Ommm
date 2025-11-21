import React, { useState, useEffect } from 'react';
import { User, Transaction, TransactionType, TransactionStatus } from '../types';
import { getTransactions, addTransaction, getUserById } from '../services/storage';
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinanceProps {
  user: User;
  refreshUser: () => void;
}

const UserFinance: React.FC<FinanceProps> = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [details, setDetails] = useState(''); // e.g. UTR or Account Number
  const [history, setHistory] = useState<Transaction[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (activeTab === 'history') {
      const all = getTransactions();
      setHistory(all.filter(t => t.userId === user.id));
    }
  }, [activeTab, user.id]);

  const handleTransaction = (type: TransactionType) => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    
    if (type === TransactionType.WITHDRAWAL) {
        if (val > user.balance) {
            setMsg("Insufficient balance.");
            return;
        }
        if (!user.bankDetails) {
            setMsg("Please add bank details first.");
            return;
        }
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      type,
      amount: val,
      method: type === TransactionType.WITHDRAWAL ? 'Bank Transfer' : method,
      details: type === TransactionType.WITHDRAWAL 
        ? `${user.bankDetails?.accountNumber} (${user.bankDetails?.ifsc})` 
        : details,
      status: TransactionStatus.PENDING,
      date: new Date().toISOString()
    };

    addTransaction(newTx);
    
    setMsg(`${type === TransactionType.DEPOSIT ? 'Deposit' : 'Withdrawal'} request submitted! ID: ${newTx.id}`);
    setAmount('');
    setDetails('');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-8">
        <button 
            onClick={() => setActiveTab('deposit')} 
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'deposit' ? 'bg-apso-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            Deposit
        </button>
        <button 
            onClick={() => setActiveTab('withdraw')} 
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'withdraw' ? 'bg-apso-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            Withdraw
        </button>
        <button 
            onClick={() => setActiveTab('history')} 
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-apso-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            History
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* DEPOSIT FORM */}
        {activeTab === 'deposit' && (
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowDownCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Funds to Wallet</h2>
            <p className="text-gray-500 mb-8">Transfer funds and enter the details below.</p>
            
            <div className="space-y-4 text-left">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        className="w-full bg-slate-800 text-white placeholder-gray-400 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-apso-gold outline-none" 
                        placeholder="500" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select 
                        value={method} 
                        onChange={e => setMethod(e.target.value)} 
                        className="w-full bg-slate-800 text-white border border-slate-700 p-3 rounded-lg outline-none"
                    >
                        <option value="UPI">UPI (GPay, PhonePe)</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
                    <input 
                        type="text" 
                        value={details} 
                        onChange={e => setDetails(e.target.value)} 
                        className="w-full bg-slate-800 text-white placeholder-gray-400 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-apso-gold outline-none" 
                        placeholder="12 digits UTR" 
                    />
                </div>
                <button onClick={() => handleTransaction(TransactionType.DEPOSIT)} className="w-full bg-apso-dark text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors mt-4 shadow-lg">
                    Submit Deposit Request
                </button>
                {msg && <p className="text-green-600 font-semibold text-center mt-2">{msg}</p>}
            </div>
          </div>
        )}

        {/* WITHDRAW FORM */}
        {activeTab === 'withdraw' && (
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowUpCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Withdraw Funds</h2>
            <p className="text-gray-500 mb-2">Available Balance: <span className="font-bold text-apso-dark">₹{user.balance}</span></p>
            
            <div className="space-y-4 text-left mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Withdraw Amount (₹)</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        className="w-full bg-slate-800 text-white placeholder-gray-400 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-apso-gold outline-none" 
                        placeholder="Minimum ₹100" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank Account</label>
                    <select 
                        className="w-full bg-slate-800 text-white border border-slate-700 p-3 rounded-lg outline-none"
                        onChange={(e) => {
                            if (e.target.value === 'add') navigate('/profile/bank');
                        }}
                    >
                        {user.bankDetails ? (
                            <option value="saved">
                                {user.bankDetails.accountHolder} - {user.bankDetails.accountNumber}
                            </option>
                        ) : (
                            <option value="">Select Bank Account</option>
                        )}
                        <option value="add">{user.bankDetails ? 'Change Bank Details' : 'Add Bank Account'}</option>
                    </select>
                </div>
                <button onClick={() => handleTransaction(TransactionType.WITHDRAWAL)} className="w-full bg-apso-gold text-apso-dark font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors mt-4 shadow-lg">
                    Request Withdrawal
                </button>
                {msg && <p className={msg.includes('Insufficient') || msg.includes('Please add') ? "text-red-600 text-center mt-2" : "text-green-600 text-center mt-2"}>{msg}</p>}
            </div>
          </div>
        )}

        {/* HISTORY TABLE */}
        {activeTab === 'history' && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Transaction History</h3>
            {history.length === 0 ? <p className="text-gray-500">No transactions found.</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-3 text-gray-600 font-medium">ID</th>
                                <th className="p-3 text-gray-600 font-medium">Type</th>
                                <th className="p-3 text-gray-600 font-medium">Amount</th>
                                <th className="p-3 text-gray-600 font-medium">Date</th>
                                <th className="p-3 text-gray-600 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(tx => (
                                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3 text-gray-500 font-mono text-xs">#{tx.id.slice(-6)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === TransactionType.DEPOSIT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-3 font-bold text-gray-800">₹{tx.amount}</td>
                                    <td className="p-3 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            {tx.status === TransactionStatus.APPROVED && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            {tx.status === TransactionStatus.PENDING && <Clock className="w-4 h-4 text-yellow-500" />}
                                            {tx.status === TransactionStatus.REJECTED && <XCircle className="w-4 h-4 text-red-500" />}
                                            <span className={`text-xs font-semibold ${
                                                tx.status === TransactionStatus.APPROVED ? 'text-green-600' : 
                                                tx.status === TransactionStatus.PENDING ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserFinance;