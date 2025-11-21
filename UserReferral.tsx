import React from 'react';
import { User } from '../types';
import { Copy, Gift, Share2 } from 'lucide-react';

interface ReferralProps {
  user: User;
}

const UserReferral: React.FC<ReferralProps> = ({ user }) => {
  // Generate dynamic referral link
  // Using window.location.origin and adding parameters correctly for HashRouter
  const origin = window.location.origin + window.location.pathname;
  // Important: Add parameter BEFORE the hash if possible, or support both.
  // Current strategy: Add it to the search param of the hash route: #/register?ref=ID
  const referralLink = `${origin}#/register?ref=${user.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join APSO Finance',
          text: `Start earning daily returns with APSO! Use my code: ${user.id}`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="bg-gradient-to-br from-apso-dark to-blue-900 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-xl">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10">
             <div className="w-16 h-16 bg-apso-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <Gift className="w-8 h-8 text-apso-dark" />
             </div>
             <h2 className="text-2xl font-bold mb-2">Invite & Earn</h2>
             <p className="text-blue-100 text-sm mb-6">Share your link with friends. Your Referral ID: <span className="font-mono font-bold text-white">{user.id}</span></p>
             
             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <p className="text-xs text-gray-300 mb-2">Your Referral Link</p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 pl-3">
                    <span className="text-gray-500 text-xs flex-1 truncate">{referralLink}</span>
                    <button onClick={copyToClipboard} className="bg-apso-dark text-white p-2 rounded-md hover:bg-blue-800">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-apso-gold">10%</h3>
            <p className="text-[10px] text-gray-500">Level 1</p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-blue-400">5%</h3>
            <p className="text-[10px] text-gray-500">Level 2</p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-purple-400">2%</h3>
            <p className="text-[10px] text-gray-500">Level 3</p>
         </div>
      </div>

      <button onClick={handleShare} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-600/20">
        <Share2 className="w-5 h-5" /> Share Link Now
      </button>
    </div>
  );
};

export default UserReferral;