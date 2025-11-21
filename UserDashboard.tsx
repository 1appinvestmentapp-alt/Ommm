import React, { useEffect, useState } from 'react';
import { User, Investment, Plan } from '../types';
import { getInvestments, getPlans, saveUser, addInvestment, getUserById } from '../services/storage';
import { Wallet, TrendingUp, CheckCircle, Lock, Send, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const UserDashboard: React.FC<DashboardProps> = ({ user }) => {
  const [myInvestments, setMyInvestments] = useState<Investment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [msg, setMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);
  // Local state for user balance to update UI immediately after invest
  const [currentBalance, setCurrentBalance] = useState(user.balance);

  useEffect(() => {
    const allInv = getInvestments();
    setMyInvestments(allInv.filter(i => i.userId === user.id && i.isActive));
    setPlans(getPlans());
    setCurrentBalance(user.balance);
  }, [user.id, user.balance]);

  const handleInvest = (plan: Plan) => {
    // Plan Logic Restriction
    // Only Plan A (p1) is allowed
    if (plan.id !== 'p1') {
        setMsg({ text: `Plan ${plan.name} is Coming Soon!`, type: 'error' });
        setTimeout(() => setMsg(null), 3000);
        return;
    }

    // Check purchase limit for Plan A
    const myPlanACount = myInvestments.filter(i => i.planId === 'p1').length;
    if (myPlanACount >= 5) {
        setMsg({ text: `Maximum limit reached for Plan A (5 Max).`, type: 'error' });
        setTimeout(() => setMsg(null), 3000);
        return;
    }

    const freshUser = getUserById(user.id);
    if (!freshUser) return;

    if (freshUser.balance < plan.cost) {
      setMsg({ text: `Insufficient balance. Recharge ₹${plan.cost - freshUser.balance} more.`, type: 'error' });
      setTimeout(() => setMsg(null), 3000);
      return;
    }

    // Deduct balance
    freshUser.balance -= plan.cost;
    saveUser(freshUser);
    setCurrentBalance(freshUser.balance);

    // Add Investment
    const newInv: Investment = {
      id: `inv-${Date.now()}`,
      userId: user.id,
      planId: plan.id,
      planName: plan.name,
      startDate: new Date().toISOString(),
      dailyReturn: plan.dailyReturn,
      totalReturn: plan.dailyReturn * plan.durationDays,
      claimedDays: 0,
      isActive: true
    };
    addInvestment(newInv);
    
    // Refresh investments list
    setMyInvestments(prev => [...prev, newInv]);

    setMsg({ text: `Successfully invested in ${plan.name}!`, type: 'success' });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {msg && (
         <div className={`fixed top-20 left-4 right-4 p-4 rounded-xl shadow-xl z-50 text-white font-bold animate-bounce text-center ${msg.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
           {msg.text}
         </div>
       )}

      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-apso-dark to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Wallet className="w-6 h-6 text-apso-gold" /></div>
                  <span className="font-medium text-gray-200">Total Balance</span>
              </div>
              <h2 className="text-4xl font-bold mb-1">₹{currentBalance.toLocaleString('en-IN')}</h2>
              <p className="text-xs text-gray-300 mb-6">Available to Withdraw</p>
              
              <div className="flex gap-3">
                  <Link to="/finance" className="flex-1 bg-apso-gold text-apso-dark text-center py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors text-sm shadow-lg shadow-yellow-400/20">
                      Deposit
                  </Link>
                  <Link to="/finance" className="flex-1 bg-white/10 text-white text-center py-3 rounded-xl font-bold hover:bg-white/20 transition-colors text-sm backdrop-blur-sm">
                      Withdraw
                  </Link>
              </div>
          </div>
      </div>

      {/* External Links: Channel & Service */}
      <div className="grid grid-cols-2 gap-4">
        <a 
            href="https://t.me/APSOINVESTMENTOP" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-95 cursor-pointer group"
        >
             <div className="p-3 bg-blue-50 rounded-full text-blue-500 group-hover:bg-blue-100 transition-colors">
                <Send className="w-6 h-6 -ml-0.5 mt-0.5 transform -rotate-12" />
             </div>
             <span className="font-bold text-gray-700 text-sm">Channel</span>
        </a>

        <a 
            href="https://t.me/OmmPrakash0123" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-95 cursor-pointer group"
        >
            <div className="p-3 bg-apso-gold/10 rounded-full text-apso-dark group-hover:bg-apso-gold/20 transition-colors">
                <Headphones className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700 text-sm">Service</span>
        </a>
      </div>

      {/* Investment Plans Section */}
      <div className="mt-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-apso-gold rounded-full"></span>
            Investment Plans
          </h3>
          
          <div className="grid grid-cols-1 gap-5">
            {plans.map(plan => {
                // Logic Vars
                const isPlanA = plan.id === 'p1';
                const planACount = myInvestments.filter(i => i.planId === 'p1').length;
                const isLimitReached = isPlanA && planACount >= 5;
                const isLocked = !isPlanA;

                return (
                    <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}>
                        {/* Status Overlay for Locked/Limit */}
                        {isLocked && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                                    <Lock className="w-4 h-4" /> Coming Soon
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                            <h4 className="font-bold text-apso-dark">{plan.name}</h4>
                            <span className="bg-apso-dark text-apso-gold text-xs px-2 py-1 rounded font-bold">{plan.durationDays} Days</span>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Price</p>
                                    <p className="text-2xl font-bold text-apso-dark">₹{plan.cost}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Daily Income</p>
                                    <p className="text-xl font-bold text-green-600">+₹{plan.dailyReturn}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between text-sm text-gray-500 mb-5 bg-gray-50 p-3 rounded-lg">
                                <span>Total Revenue</span>
                                <span className="font-bold text-gray-800">₹{plan.dailyReturn * plan.durationDays}</span>
                            </div>

                            {isPlanA && isLimitReached ? (
                                <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Limit Reached (5/5)
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleInvest(plan)}
                                    disabled={isLocked}
                                    className={`w-full py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/20 active:scale-95 transform ${isLocked ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-apso-dark text-white hover:bg-blue-900'}`}
                                >
                                    {isLocked ? 'Coming Soon' : 'Invest Now'}
                                </button>
                            )}
                            
                            {isPlanA && !isLimitReached && (
                                <p className="text-center text-xs text-gray-400 mt-2">Limit: {planACount}/5 Purchases</p>
                            )}
                        </div>
                    </div>
                );
            })}
          </div>
      </div>

      {/* Active Investments List */}
      {myInvestments.length > 0 && (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Your Active Plans
            </h3>
            <div className="space-y-3">
                {myInvestments.map(inv => {
                     const daysTotal = inv.totalReturn / inv.dailyReturn;
                     const progress = (inv.claimedDays / daysTotal) * 100;
                     return (
                        <div key={inv.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-gray-700">{inv.planName}</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">Running</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Earned: ₹{inv.claimedDays * inv.dailyReturn}</span>
                                <span className="text-gray-500">Target: ₹{inv.totalReturn}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                     );
                })}
            </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;