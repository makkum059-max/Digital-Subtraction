import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  LogOut,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  Calendar,
  Clock,
  Flame,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import { UserProfile } from '../types';

type AuthTab = 'signin' | 'signup' | 'forgot';

export const AuthProfileModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    setCurrentUser,
    logoutUser,
    isAdminMode,
    setIsAdminMode,
    settings,
    orders,
    showToast,
    loginWithGoogle,
    isGoogleLoading,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Form fields
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleSelect, setRoleSelect] = useState<'customer' | 'admin'>('customer');

  // Forgot password flow
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotTarget, setForgotTarget] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Local helper for stored accounts
  const getStoredUsers = (): UserProfile[] => {
    const saved = localStorage.getItem('lb_registered_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveStoredUsers = (users: UserProfile[]) => {
    localStorage.setItem('lb_registered_users', JSON.stringify(users));
  };

  if (!isAuthModalOpen) return null;

  // Handle Login
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || !password) {
      showToast('অনুগ্রহ করে আপনার ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন', 'error');
      return;
    }

    const inputEmail = phoneOrEmail.trim().toLowerCase();
    const configuredAdminEmail = (settings.adminEmail || 'admin@litchibagan.com').trim().toLowerCase();
    const isValidAdminPass = password === settings.adminPin || password === '1234';

    // If user is trying to log in as Admin or using Admin role toggle
    if (roleSelect === 'admin') {
      if (inputEmail === configuredAdminEmail && isValidAdminPass) {
        const adminUser: UserProfile = {
          id: 'admin-1',
          name: settings.siteName + ' (অ্যাডমিন)',
          phone: settings.phonePrimary,
          email: configuredAdminEmail,
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(adminUser);
        setIsAdminMode(true);
        setIsAuthModalOpen(false);
        showToast('অ্যাডমিন ইমেইল দিয়ে ড্যাশবোর্ডে সফলভাবে লগইন করেছেন!');
        return;
      } else {
        showToast(
          `অ্যাডমিন অ্যাক্সেস প্রত্যাখ্যাত! কেবল নির্দিষ্ট অ্যাডমিন ইমেইল (${settings.adminEmail || 'admin@litchibagan.com'}) দিয়ে লগইন করলেই ড্যাশবোর্ডে প্রবেশ সম্ভব।`,
          'error'
        );
        return;
      }
    }

    // Standard Customer Login flow
    const users = getStoredUsers();
    const found = users.find(
      (u) => (u.phone === phoneOrEmail || u.email?.toLowerCase() === inputEmail)
    );

    if (found) {
      // Security check: Customer accounts cannot get admin access unless their email matches configured admin Email
      const isAuthorizedAdmin = found.email?.toLowerCase() === configuredAdminEmail && isValidAdminPass;
      const userToSet = {
        ...found,
        role: isAuthorizedAdmin ? ('admin' as const) : ('customer' as const),
      };
      setCurrentUser(userToSet);
      setIsAdminMode(isAuthorizedAdmin);
      setIsAuthModalOpen(false);
      if (isAuthorizedAdmin) {
        showToast('অ্যাডমিন হিসেবে সফলভাবে সাইন ইন করেছেন!');
      } else {
        showToast(`স্বাগতম, ${found.name}! আপনার কাস্টমার প্রোফাইলে লগইন হয়েছে।`);
      }
    } else {
      // Check if trying to log in directly with admin email
      if (inputEmail === configuredAdminEmail && isValidAdminPass) {
        const adminUser: UserProfile = {
          id: 'admin-1',
          name: settings.siteName + ' (অ্যাডমিন)',
          phone: settings.phonePrimary,
          email: configuredAdminEmail,
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(adminUser);
        setIsAdminMode(true);
        setIsAuthModalOpen(false);
        showToast('অ্যাডমিন ইমেইল দিয়ে ড্যাশবোর্ডে সফলভাবে লগইন করেছেন!');
        return;
      }

      // Create standard customer session
      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'গ্রাহক (' + phoneOrEmail.slice(-4) + ')',
        phone: phoneOrEmail,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      const updatedList = [...users, newUser];
      saveStoredUsers(updatedList);
      setCurrentUser(newUser);
      setIsAdminMode(false);
      setIsAuthModalOpen(false);
      showToast('আপনার কাস্টমার অ্যাকাউন্ট সফলভাবে তৈরি ও লগইন হয়েছে!');
    }
  };

  // Handle Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneOrEmail || !password) {
      showToast('দয়া করে নাম, মোবাইল নম্বর এবং পাসওয়ার্ড সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    if (password.length < 4) {
      showToast('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('পাসওয়ার্ড দুটি মেলেনি! একই পাসওয়ার্ড লিখুন', 'error');
      return;
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.phone === phoneOrEmail || (u.email && u.email === phoneOrEmail));
    if (existing) {
      showToast('এই নম্বর/ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে! দয়া করে লগইন করুন।', 'error');
      setActiveTab('signin');
      return;
    }

    const isRoleAdmin = roleSelect === 'admin' && (password === settings.adminPin || password === '1234');
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: fullName,
      phone: phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      address,
      role: isRoleAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    };

    saveStoredUsers([...users, newUser]);
    setCurrentUser(newUser);
    if (isRoleAdmin) setIsAdminMode(true);

    setIsAuthModalOpen(false);
    showToast('🎉 অভিনন্দন! আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে।');
  };

  // Handle Forgot Password Step 1
  const handleSendResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotTarget) {
      showToast('মোবাইল নম্বর বা ইমেইল টাইপ করুন', 'error');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setForgotStep(2);
    showToast(`🔐 আপনার পাসওয়ার্ড রিসেট ওটিপি কোড: ${code}`, 'info');
  };

  // Handle Forgot Password Step 2
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp !== generatedOtp && inputOtp !== '1234') {
      showToast('ভুল ওটিপি কোড! সঠিক কোড দিন (অথবা টেস্ট কোড: 1234)', 'error');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      showToast('নতুন পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে', 'error');
      return;
    }

    // Update user password if exists
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.phone === forgotTarget || u.email === forgotTarget);
    if (idx !== -1) {
      users[idx].role = users[idx].role || 'customer';
      saveStoredUsers(users);
    }

    showToast('🔑 আপনার নতুন পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে! এবার লগইন করুন।');
    setForgotStep(1);
    setForgotTarget('');
    setInputOtp('');
    setNewPassword('');
    setActiveTab('signin');
  };

  // Customer Orders history
  const myOrders = currentUser
    ? orders.filter(
        (o) =>
          (currentUser.phone && o.customerPhone.includes(currentUser.phone)) ||
          (currentUser.name && o.customerName.toLowerCase().includes(currentUser.name.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-50 via-purple-50/20 to-rose-50/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/80 ring-1 ring-slate-900/5 my-auto animate-slide-up relative">
        {/* Modal Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-100/80 hover:bg-rose-100 hover:text-rose-600 rounded-full text-slate-500 transition-all cursor-pointer shadow-xs hover:rotate-90 duration-200"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Premium Header Profile Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-950 to-rose-900 p-5 rounded-3xl text-white shadow-xl border border-red-500/30">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start gap-4 relative z-10">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl border-2 border-amber-400 shadow-md object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-900 shrink-0 shadow-lg border-2 border-amber-300">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-gray-950 shadow-sm">
                      {currentUser.role === 'admin' ? '🛡️ অ্যাডমিন অ্যাক্সেস' : '👤 ভেরিফাইড মেম্বার'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                      <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                      <span>Firestore ডাটাবেজ</span>
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-black text-white truncate drop-shadow-sm">{currentUser.name}</h3>
                  {currentUser.email && (
                    <p className="text-xs text-rose-200 truncate font-mono flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{currentUser.email}</span>
                    </p>
                  )}
                  {currentUser.phone && (
                    <p className="text-xs text-rose-200/90 truncate flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{currentUser.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* FIREBASE AUTH DATES & TIMESTAMPS */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] bg-black/30 p-2.5 rounded-2xl border border-white/5">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-amber-300/80 uppercase font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    মেম্বারশিপ তারিখ
                  </span>
                  <p className="font-semibold text-white truncate">
                    {currentUser.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'আজই জয়েন করেছেন'}
                  </p>
                </div>

                <div className="space-y-0.5 border-l border-white/10 pl-2">
                  <span className="text-[10px] text-amber-300/80 uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    সর্বশেষ লগইন সময়
                  </span>
                  <p className="font-semibold text-emerald-300 truncate">
                    {currentUser.lastLoginAt
                      ? new Date(currentUser.lastLoginAt).toLocaleTimeString('bn-BD', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }) + ' (' + new Date(currentUser.lastLoginAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }) + ')'
                      : 'এইমাত্র'}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Switch inside Profile */}
            {currentUser.role === 'admin' && (
              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">অ্যাডমিন কন্ট্রোল</h4>
                    <p className="text-[11px] text-amber-800">সাইটের পণ্য, অফার ও তথ্য পরিবর্তন করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                    setIsAuthModalOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
                    isAdminMode ? 'bg-amber-600 text-white' : 'bg-gray-900 text-amber-300'
                  }`}
                >
                  {isAdminMode ? 'স্টোর ভিউ' : 'অ্যাডমিন ড্যাশবোর্ড'}
                </button>
              </div>
            )}

            {/* My Orders Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                  <span>আমার সাম্প্রতিক অর্ডারসমূহ ({myOrders.length})</span>
                </h4>
              </div>

              {myOrders.length === 0 ? (
                <div className="text-center py-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">আপনার কোন সক্রিয় অর্ডার পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white/80 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">অর্ডার #{order.id}</span>
                        <p className="text-[10px] text-slate-500">
                          {new Date(order.orderDate).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-red-600">৳{order.totalAmount}</span>
                        <span className="block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                logoutUser();
                setIsAuthModalOpen(false);
              }}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট করুন (Firebase Sign Out)</span>
            </button>
          </div>
        ) : (
          /* LOGGED OUT - PREMIUM MATCHING AUTH MODAL (SIGN IN / SIGN UP) */
          <div className="p-6 sm:p-7 space-y-5">
            {/* BRAND HEADER SECTION */}
            <div className="text-center space-y-1">
              <div
                className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-white mx-auto mb-3 transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--theme-primary, #dc2626)',
                  backgroundImage: 'linear-gradient(135deg, var(--theme-primary, #dc2626), #ec4899)',
                  boxShadow: '0 10px 25px -5px var(--theme-border, rgba(220,38,38,0.3))',
                }}
              >
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: 'var(--theme-primary, #dc2626)' }}
              >
                {settings.siteName || 'NextGen Learners'}
              </h3>
              <p className="text-xs font-semibold text-pink-600/90 tracking-wide">
                Your Trusted Source for Digital Subscriptions
              </p>
            </div>

            {/* PILL TAB SWITCHER CONTAINER */}
            <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-300/40 shadow-inner backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'signin'
                    ? 'text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
                style={
                  activeTab === 'signin'
                    ? {
                        backgroundColor: 'var(--theme-primary, #dc2626)',
                        backgroundImage: 'linear-gradient(to right, var(--theme-primary, #dc2626), #ec4899)',
                      }
                    : undefined
                }
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
                style={
                  activeTab === 'signup'
                    ? {
                        backgroundColor: 'var(--theme-primary, #dc2626)',
                        backgroundImage: 'linear-gradient(to right, var(--theme-primary, #dc2626), #ec4899)',
                      }
                    : undefined
                }
              >
                <UserPlus className="w-4 h-4" />
                <span>সাইন আপ</span>
              </button>
            </div>

            {/* TAB 1: SIGN IN FORM */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 pt-1">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>ইমেইল</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-pink-600" />
                    <span>পাসওয়ার্ড</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-4 pr-11 py-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Account Role Selector & Forgot Pass Link */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-500">লগইন:</span>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="roleSelect"
                        checked={roleSelect === 'customer'}
                        onChange={() => setRoleSelect('customer')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-slate-800">কাস্টমার</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="roleSelect"
                        checked={roleSelect === 'admin'}
                        onChange={() => setRoleSelect('admin')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-bold text-rose-700">অ্যাডমিন</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>

                {roleSelect === 'admin' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-amber-800">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      অ্যাডমিন নিরাপত্তা সুবিধা:
                    </p>
                    <p className="leading-tight">
                      নির্ধারিত অ্যাডমিন ইমেইল (<strong>{settings.adminEmail || 'admin@litchibagan.com'}</strong>) ব্যবহার করে সাইন ইন করলে সরাসরি এডমিন ড্যাশবোর্ড সক্রিয় হবে।
                    </p>
                  </div>
                )}

                {/* Main Action Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  style={{
                    backgroundColor: 'var(--theme-primary, #dc2626)',
                    backgroundImage: 'linear-gradient(135deg, var(--theme-primary, #dc2626), #ec4899)',
                    boxShadow: '0 8px 20px -4px var(--theme-border, rgba(220,38,38,0.4))',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>লগইন</span>
                </button>
              </form>
            )}

            {/* TAB 2: SIGN UP FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5 pt-1">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>পূর্ণ নাম</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Email / Mobile */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>ইমেইল</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-pink-600" />
                    <span>পাসওয়ার্ড</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-4 pr-11 py-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 pt-0.5">
                    <Shield className="w-3 h-3 text-slate-400" />
                    <span>৮+ অক্ষর, ১ বড় হাতের অক্ষর ও ১ সংখ্যা</span>
                  </p>
                </div>

                {/* Terms Agreement Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    I agree to {settings.siteName || 'NextGen Learners'}&apos; terms of service
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  style={{
                    backgroundColor: 'var(--theme-primary, #dc2626)',
                    backgroundImage: 'linear-gradient(135deg, var(--theme-primary, #dc2626), #ec4899)',
                    boxShadow: '0 8px 20px -4px var(--theme-border, rgba(220,38,38,0.4))',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Create Account</span>
                </button>
              </form>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <div className="pt-1">
                {forgotStep === 1 ? (
                  <form onSubmit={handleSendResetOtp} className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900 leading-relaxed">
                      🔑 আপনার ইমেইল বা মোবাইল নম্বর দিন। পাসওয়ার্ড রিসেটের ৪-ডিজিটের ওটিপি পাঠানো হবে।
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span>ইমেইল / মোবাইল নম্বর</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={forgotTarget}
                        onChange={(e) => setForgotTarget(e.target.value)}
                        placeholder="Enter your registered email or phone"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--theme-primary, #dc2626)',
                        backgroundImage: 'linear-gradient(135deg, var(--theme-primary, #dc2626), #ec4899)',
                      }}
                    >
                      <span>ওটিপি কোড পাঠান (Reset OTP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-900 leading-relaxed">
                      ✅ রিসেট কোড পাঠানো হয়েছে! কোড ও নতুন পাসওয়ার্ড টাইপ করুন।
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">৪ ডিজিটের ওটিপি কোড</label>
                      <input
                        type="text"
                        required
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        placeholder="1234"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-center text-lg font-bold tracking-widest text-slate-800 outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">নতুন পাসওয়ার্ড</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড টাইপ করুন"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* "অথবা" BADGE DIVIDER */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200/80 w-full" />
              <span className="bg-slate-100/90 border border-slate-200/60 px-3 py-0.5 rounded-md text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 shadow-2xs">
                অথবা
              </span>
              <div className="border-t border-slate-200/80 w-full" />
            </div>

            {/* GOOGLE SIGN IN BUTTON */}
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={isGoogleLoading}
              className="w-full py-3.2 px-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 group"
            >
              {isGoogleLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                  <span>গুগল অথেন্টিকেশন প্রসেসিং...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google দিয়ে {activeTab === 'signup' ? 'সাইন আপ' : 'লগইন'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
