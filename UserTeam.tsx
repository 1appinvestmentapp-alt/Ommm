import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getTeamMembers, getUserStats } from '../services/storage';
import { Users, UserPlus, Calendar, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';

interface TeamProps {
  user: User;
}

const UserTeam: React.FC<TeamProps> = ({ user }) => {
  const [teamData, setTeamData] = useState<{ [key: number]: User[] }>({ 1: [], 2: [], 3: [] });
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const fetchTeam = () => {
    setLoading(true);
    // Simulate small network delay for feedback
    setTimeout(() => {
        const data = getTeamMembers(user.id);
        setTeamData(data);
        setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchTeam();
  }, [user.id]);

  const currentList = teamData[activeLevel] || [];
  const totalTeamSize = teamData[1].length + teamData[2].length + teamData[3].length;

  // Helper to mask phone number
  const maskPhone = (phone: string) => {
      if (phone.length < 4) return phone;
      return phone.substring(0, 2) + '******' + phone.substring(phone.length - 2);
  };

  // Helper to format date
  const formatDate = (isoString: string) => {
      const d = new Date(isoString);
      return {
          date: d.toLocaleDateString(),
          time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
  };

  return (
    <div className="pt-4 space-y-6 pb-20">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-apso-dark to-blue-900 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-blue-200 text-sm font-medium">Total Team Members</p>
            <h2 className="text-4xl font-bold mt-1">{totalTeamSize}</h2>
            <p className="text-xs text-blue-300 mt-2">Across 3 Levels</p>
        </div>
        <div className="relative z-10 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Users className="w-7 h-7 text-apso-gold" />
        </div>
        
        {/* Decoration */}
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Level Tabs */}
      <div className="flex gap-2">
        {[1, 2, 3].map(lvl => (
            <button 
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    activeLevel === lvl 
                    ? 'bg-apso-gold border-apso-gold text-apso-dark shadow-md' 
                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
            >
                Level {lvl}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeLevel === lvl ? 'bg-white/30 text-apso-dark' : 'bg-gray-100 text-gray-500'}`}>
                    {teamData[lvl].length}
                </span>
            </button>
        ))}
      </div>

      {/* Members List */}
      <div>
        <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-gray-800">Level {activeLevel} Members</h3>
            <button 
                onClick={fetchTeam} 
                disabled={loading}
                className="text-xs flex items-center gap-1 text-apso-dark font-semibold bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
        </div>
        
        {currentList.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No members in Level {activeLevel} yet</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">Share your referral link from the Referral tab to start building your team.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {currentList.map(member => {
                    const { date, time } = formatDate(member.joinedDate);
                    const stats = getUserStats(member.id);

                    return (
                        <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-inner border border-white">
                                        {member.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800">{maskPhone(member.phone)}</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {date} at {time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${activeLevel === 1 ? 'bg-green-100 text-green-700' : activeLevel === 2 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                        L{activeLevel}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Stats Row */}
                            <div className="flex border-t border-gray-50 pt-3 mt-1">
                                <div className="flex-1 flex items-center gap-2 text-xs">
                                     <div className="p-1 bg-green-50 rounded-full text-green-600"><ArrowDownCircle className="w-3 h-3"/></div>
                                     <div>
                                        <p className="text-gray-400 text-[10px]">Deposit</p>
                                        <p className="font-bold text-gray-700">₹{stats.totalDeposit}</p>
                                     </div>
                                </div>
                                <div className="flex-1 flex items-center gap-2 text-xs border-l border-gray-50 pl-4">
                                     <div className="p-1 bg-red-50 rounded-full text-red-600"><ArrowUpCircle className="w-3 h-3"/></div>
                                     <div>
                                        <p className="text-gray-400 text-[10px]">Withdraw</p>
                                        <p className="font-bold text-gray-700">₹{stats.totalWithdraw}</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default UserTeam;