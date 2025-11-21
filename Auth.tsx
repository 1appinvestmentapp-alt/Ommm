import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getUsers, saveUser, setSession } from '../services/storage';
import { Role } from '../types';
import { TrendingUp, ShieldCheck, Wallet, ArrowRight, UserPlus, Lock, Phone, User as UserIcon, Gift } from 'lucide-react';

interface AuthProps {
  setUser: (user: any) => void;
}

export const Login: React.FC<AuthProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);

    if (user) {
      setSession(user);
      setUser(user);
      navigate(user.role === Role.ADMIN ? '/admin' : '/dashboard');
    } else {
      setError('Invalid credentials provided.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0C2D57] via-[#1e3a8a] to-[#F59E0B] relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden relative z-10 min-h-[600px]">
        
        {/* Left Side - Branding (Hidden on small screens) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-apso-dark to-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10 mix-blend-overlay"></div>
           
           <div className="relative z-10">
             <div className="w-12 h-12 bg-apso-gold rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-7 h-7 text-apso-dark" />
             </div>
             <h1 className="text-5xl font-bold mb-6 leading-tight">Grow Your <br/><span className="text-apso-gold">Wealth</span> Today.</h1>
             <p className="text-blue-100 text-lg font-light opacity-90">Experience the next generation of financial growth with APSO's smart investment plans.</p>
           </div>

           <div className="relative z-10 flex gap-6 text-sm font-medium text-blue-200">
              <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-apso-gold"/> Secure Platform</div>
              <div className="flex items-center gap-2"><Wallet className="w-5 h-5 text-apso-gold"/> Instant Withdrawals</div>
           </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
                <p className="text-gray-500 mt-2">Please login to access your dashboard.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                        type="tel"
                        required
                        className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                        type="password"
                        required
                        className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-500 cursor-pointer hover:text-gray-700">
                        <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-apso-dark focus:ring-apso-dark" /> 
                        Remember me
                    </label>
                    <a href="#" className="text-apso-dark font-semibold hover:text-apso-gold transition-colors">Forgot Password?</a>
                </div>

                <button type="submit" className="w-full bg-apso-dark text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group">
                    Login to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                    Don't have an account? 
                    <span onClick={() => navigate('/register')} className="ml-2 text-apso-dark font-bold cursor-pointer hover:text-apso-gold transition-colors">
                        Join APSO Today
                    </span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', confirm: '', referralCode: '' });
  const [error, setError] = useState('');
  const [refFound, setRefFound] = useState(false);

  useEffect(() => {
    // Robust logic to find referral code from multiple possible locations
    let ref = searchParams.get('ref');
    
    // Fallback: Check hash params manually (e.g., if url is #/register?ref=123)
    if (!ref && location.search) {
        const params = new URLSearchParams(location.search);
        ref = params.get('ref');
    }
    
    // Fallback: Check window.location.search (e.g. if url is /?ref=123#/register)
    if (!ref) {
        const urlParams = new URLSearchParams(window.location.search);
        ref = urlParams.get('ref');
    }

    if (ref) {
        const cleanRef = ref.trim();
        setFormData(prev => ({ ...prev, referralCode: cleanRef }));
        setRefFound(true);
    }
  }, [searchParams, location]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
        setError("Passwords do not match");
        return;
    }
    
    const users = getUsers();
    if (users.find(u => u.phone === formData.phone)) {
        setError("Phone number already registered");
        return;
    }

    const newUser = {
        id: `u${Date.now()}`,
        fullName: formData.name,
        phone: formData.phone,
        password: formData.password,
        balance: 0,
        role: Role.USER,
        joinedDate: new Date().toISOString(),
        referredBy: formData.referralCode ? formData.referralCode.trim() : undefined
    };

    saveUser(newUser);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tl from-[#0C2D57] via-[#1e3a8a] to-[#F59E0B] relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden relative z-10 min-h-[600px]">
        
        {/* Left Side - Branding (Hidden on small screens) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-apso-dark to-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden order-2">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10 mix-blend-overlay"></div>
           
           <div className="relative z-10 text-right">
             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 ml-auto shadow-lg backdrop-blur-sm">
                <UserPlus className="w-7 h-7 text-apso-gold" />
             </div>
             <h1 className="text-5xl font-bold mb-6 leading-tight">Join the <br/><span className="text-apso-gold">Community</span></h1>
             <p className="text-blue-100 text-lg font-light opacity-90">Start your journey towards financial freedom today. It takes less than a minute.</p>
           </div>

           <div className="relative z-10 flex flex-col items-end gap-4 text-sm font-medium text-blue-200">
              <div className="flex items-center gap-2">Smart Portfolio <ShieldCheck className="w-5 h-5 text-apso-gold"/></div>
              <div className="flex items-center gap-2">24/7 Support <UserIcon className="w-5 h-5 text-apso-gold"/></div>
           </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white order-1">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-500 mt-2">Enter your details to get started.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                        type="text"
                        required
                        className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                        type="tel"
                        required
                        className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                            type="password"
                            required
                            className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all"
                            placeholder="******"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Confirm</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                            type="password"
                            required
                            className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all"
                            placeholder="******"
                            value={formData.confirm}
                            onChange={e => setFormData({...formData, confirm: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 flex justify-between">
                        Referral Code 
                        {refFound && <span className="text-green-600 text-xs font-bold">✓ Auto-applied</span>}
                    </label>
                    <div className="relative">
                        <Gift className={`absolute left-4 top-3.5 w-5 h-5 ${refFound ? 'text-green-500' : 'text-gray-400'}`} />
                        <input
                        type="text"
                        className={`w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-apso-dark/20 focus:border-apso-dark transition-all ${refFound ? 'bg-green-50 border-green-200 text-green-800' : ''}`}
                        placeholder="Enter referral code (Optional)"
                        value={formData.referralCode}
                        onChange={e => setFormData({...formData, referralCode: e.target.value})}
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-apso-gold text-apso-dark font-bold py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-400/20 mt-2 flex items-center justify-center gap-2 group">
                    Create My Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                    Already have an account? 
                    <span onClick={() => navigate('/login')} className="ml-2 text-apso-dark font-bold cursor-pointer hover:text-apso-gold transition-colors">
                        Login Here
                    </span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};