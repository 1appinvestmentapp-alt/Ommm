import React, { useState, useEffect } from 'react';
import { User, Plan, Investment } from '../types';
import { getPlans, addInvestment, saveUser, getUserById, getInvestments } from '../services/storage';
import { CheckCircle, TrendingUp, Info, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvestProps {
  user: User;
  refreshUser: () => void;
}

const UserInvest: React.FC<InvestProps> = ({ user, refreshUser }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [myInvestments, setMyInvestments] = useState<Investment[]>([]);
  const navigate = useNavigate();
  const [msg, setMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    setPlans(getPlans());
    const allInv = getInvestments();
    setMyInvestments(allInv.filter(i => i.userId === user.id && i.isActive));
  }, [user.id]);

  const handleInvest = (plan: Plan) => {
    if (plan.id !== 'p1') return;

    // Check purchase limit for Plan A
    const myPlanACount = myInvestments.filter(i => i.planId === 'p1').length;
    if (myPlanACount >= 5) {
        setMsg({ text: `Maximum limit reached for Plan A (5 Max).`, type: 'error' });
        setTimeout(() => setMsg(null), 3000);
        return;
    }

    // Re-fetch fresh user data to be safe
    const freshUser = getUserById(user.id);
    if (!freshUser) return;

    if (freshUser.balance < plan.cost) {
      setMsg({ text: `Insufficient balance. You need ₹${plan.cost - freshUser.balance} more.`, type: 'error' });
      return;
    }

    // Deduct balance
    freshUser.balance -= plan.cost;
    saveUser(freshUser);
    refreshUser();

    // Add Investment
    const newInv: Investment = {
      id: `inv-${Date.now()}`,
      userId: user.id,
      planId: plan.id,
      planName: plan.name,
      startDate: new Date().toISOString(),
      dailyReturn: plan.dailyReturn,
      totalReturn: plan.dailyReturn * plan.durationDays, // simplified
      claimedDays: 0,
      isActive: true
    };
    addInvestment(newInv);
    setMyInvestments(prev => [...prev, newInv]);

    setMsg({ text: `Successfully invested in ${plan.name}! Check dashboard.`, type: 'success' });
    setTimeout(() => setMsg(null), 4000);
  };

  return (
    <div>
       <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-apso-dark mb-3">Grow Your Wealth</h2>
          <p className="text-gray-500">Choose a plan that fits your financial goals. Higher tiers offer better daily returns.</p>
       </div>

       {msg && (
         <div className={`fixed top-24 right-4 p-4 rounded-xl shadow-xl z-50 text-white font-bold animate-bounce ${msg.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
           {msg.text}
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map(plan => {
            const isPlanA = plan.id === 'p1';
            const planACount = myInvestments.filter(i => i.planId === 'p1').length;
            const isLimitReached = isPlanA && planACount >= 5;
            const isLocked = !isPlanA;

            return (
            <div key={plan.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 flex flex-col relative ${isLocked ? 'opacity-80 grayscale' : ''}`}>
               {isLocked && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <div className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                            <Lock className="w-4 h-4" /> Coming Soon
                        </div>
                    </div>
               )}
               
               <div className="bg-apso-dark p-4 text-center">
                  <h3 className="text-white font-bold text-xl">{plan.name}</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <div className="text-center mb-6 border-b border-gray-100 pb-6">
                     <p className="text-gray-500 text-sm mb-1">Investment</p>
                     <p className="text-4xl font-bold text-apso-dark">₹{plan.cost}</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500"/> Daily Return</span>
                        <span className="font-bold text-green-600">+₹{plan.dailyReturn}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2"><ClockIcon className="w-4 h-4 text-blue-500"/> Duration</span>
                        <span className="font-bold text-gray-800">{plan.durationDays} Days</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-apso-gold"/> Total Return</span>
                        <span className="font-bold text-apso-gold text-lg">₹{plan.dailyReturn * plan.durationDays}</span>
                     </div>
                  </div>

                  {isPlanA && isLimitReached ? (
                        <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-bold cursor-not-allowed mt-auto">
                            Limit Reached
                        </button>
                  ) : (
                        <button 
                            onClick={() => handleInvest(plan)}
                            disabled={isLocked}
                            className="w-full py-3 rounded-xl bg-apso-gold text-apso-dark font-bold hover:bg-yellow-400 transition-colors mt-auto"
                        >
                            {isLocked ? 'Locked' : 'Invest Now'}
                        </button>
                  )}
               </div>
            </div>
          )})}
       </div>
    </div>
  );
};

function ClockIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

export default UserInvest;