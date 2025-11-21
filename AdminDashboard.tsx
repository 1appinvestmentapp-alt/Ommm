import React, { useState, useEffect } from 'react';
import { User, Transaction, TransactionStatus, Plan } from '../types';
import { getUsers, getTransactions, updateTransactionStatus, getPlans, savePlans, getInvestments } from '../services/storage';
import { Users, Download, Upload, Plus, Trash, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'users' | 'transactions' | 'plans'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);

  const refreshData = () => {
    setUsers(getUsers());
    setTransactions(getTransactions());
    setPlans(getPlans());
    setInvestments(getInvestments());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleTxAction = (id: string, status: TransactionStatus) => {
    updateTransactionStatus(id, status);
    refreshData();
  };

  // Analytics Data Preparation
  const data = [
    { name: 'Users', count: users.length },
    { name: 'Investments', count: investments.length },
    { name: 'Pending Txs', count: transactions.filter(t => t.status === TransactionStatus.PENDING).length },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 pb-4">
        {['Overview', 'Users', 'Transactions', 'Plans'].map(t => (
            <button 
                key={t} 
                onClick={() => setTab(t.toLowerCase() as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === t.toLowerCase() ? 'bg-apso-dark text-white' : 'text-gray-500 hover:bg-gray-200'}`}
            >
                {t}
            </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
                <StatCard title="Total Deposits" value={`₹${transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'APPROVED').reduce((a,b) => a + b.amount, 0)}`} icon={Download} color="bg-green-500" />
                <StatCard title="Pending Withdrawals" value={transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING').length} icon={Upload} color="bg-yellow-500" />
                <StatCard title="Active Investments" value={investments.filter(i => i.isActive).length} icon={Plus} color="bg-purple-500" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm h-80">
                <h3 className="text-lg font-bold mb-4">Platform Analytics</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0C2D57" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      )}

      {tab === 'transactions' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                                <div className="font-bold">{tx.userName}</div>
                                <div className="text-xs text-gray-400">{tx.userId}</div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tx.type}</span>
                            </td>
                            <td className="p-4 font-bold">₹{tx.amount}</td>
                            <td className="p-4">
                                <span className={`text-xs font-bold ${tx.status === 'PENDING' ? 'text-yellow-600' : tx.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>{tx.status}</span>
                            </td>
                            <td className="p-4">
                                {tx.status === TransactionStatus.PENDING && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleTxAction(tx.id, TransactionStatus.APPROVED)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                                        <button onClick={() => handleTxAction(tx.id, TransactionStatus.REJECTED)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {tab === 'users' && (
         <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold mb-4">Registered Users</h3>
            <ul>
                {users.map(u => (
                    <li key={u.id} className="flex justify-between items-center border-b py-3">
                        <div>
                            <p className="font-bold text-apso-dark">{u.fullName}</p>
                            <p className="text-xs text-gray-500">{u.phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">₹{u.balance}</p>
                            <p className="text-xs text-gray-400">Role: {u.role}</p>
                        </div>
                    </li>
                ))}
            </ul>
         </div>
      )}

      {tab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(p => (
                <div key={p.id} className="bg-white border border-gray-200 p-6 rounded-xl flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg">{p.name}</h4>
                        <p className="text-sm text-gray-500">Invest: ₹{p.cost} | Returns: ₹{p.dailyReturn}/day</p>
                        <p className="text-sm text-gray-500">Duration: {p.durationDays} Days</p>
                    </div>
                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash className="w-5 h-5"/></button>
                </div>
            ))}
            <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 cursor-pointer hover:border-apso-dark hover:text-apso-dark transition-colors">
                <Plus className="w-6 h-6 mr-2" /> Add New Plan
            </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-full text-white ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;