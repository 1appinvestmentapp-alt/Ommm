import React, { useEffect, useState } from 'react';
import { Transaction, TransactionType, TransactionStatus } from '../types';
import { getTransactions, getCurrentSession } from '../services/storage';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

const UserHistory: React.FC = () => {
  const [history, setHistory] = useState<Transaction[]>([]);
  const user = getCurrentSession();

  useEffect(() => {
    if (user) {
        const all = getTransactions();
        setHistory(all.filter(t => t.userId === user.id));
    }
  }, [user?.id]);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
        case TransactionStatus.APPROVED:
        case TransactionStatus.COMPLETED:
            return 'bg-green-50 text-green-600 border-green-100';
        case TransactionStatus.PENDING:
            return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        case TransactionStatus.REJECTED:
        case TransactionStatus.FAILED:
            return 'bg-red-50 text-red-600 border-red-100';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
        case TransactionStatus.APPROVED:
        case TransactionStatus.COMPLETED:
            return <CheckCircle className="w-4 h-4" />;
        case TransactionStatus.PENDING:
            return <Clock className="w-4 h-4" />;
        case TransactionStatus.REJECTED:
        case TransactionStatus.FAILED:
            return <XCircle className="w-4 h-4" />;
        default:
            return null;
    }
  };

  return (
    <div className="pb-10 space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
       </div>

       {history.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Clock className="w-8 h-8 text-gray-300" />
               </div>
               <p className="text-gray-500">No transactions yet.</p>
           </div>
       ) : (
           <div className="space-y-4">
               {history.map(tx => {
                   const isDeposit = tx.type === TransactionType.DEPOSIT;
                   return (
                       <div key={tx.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                               <div className="flex gap-3 items-center">
                                   <div className={`p-3 rounded-full ${isDeposit ? 'bg-green-100' : 'bg-red-100'}`}>
                                       {isDeposit ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
                                   </div>
                                   <div>
                                       <h3 className="font-bold text-gray-800">{isDeposit ? 'Add Money' : 'Withdrawal'}</h3>
                                       <p className="text-xs text-gray-400 font-mono">#{tx.id.slice(-8).toUpperCase()}</p>
                                   </div>
                               </div>
                               <div className="text-right">
                                   <p className={`text-lg font-bold ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
                                       {isDeposit ? '+' : '-'}₹{tx.amount}
                                   </p>
                               </div>
                           </div>

                           <div className="h-px bg-gray-100 w-full"></div>

                           <div className="flex justify-between items-center text-sm">
                               <div className="flex items-center gap-2 text-gray-500 text-xs">
                                   <Calendar className="w-3 h-3" />
                                   {new Date(tx.date).toLocaleString()}
                               </div>
                               
                               <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(tx.status)}`}>
                                   {getStatusIcon(tx.status)}
                                   {tx.status}
                               </div>
                           </div>
                       </div>
                   );
               })}
           </div>
       )}
    </div>
  );
};

export default UserHistory;