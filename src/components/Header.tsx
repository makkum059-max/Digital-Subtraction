import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  MessageSquare,
  Search,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Menu,
  X,
  Lock,
  Store,
  CheckCircle,
  User,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    cart,
    setIsCartOpen,
    isAdminMode,
    setIsAdminMode,
    setTrackOrderModalOpen,
    currentUser,
    setIsAuthModalOpen,
    setSelectedProductDetail,
    setQuickViewProduct,
    setCheckoutProduct,
    showToast,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      showToast('কাস্টমার ভিউতে ফিরে যাওয়া হয়েছে');
    } else {
      setPinModalOpen(true);
      setInputPin('');
      setPinError('');
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === settings.adminPin || inputPin === '1234') {
      setIsAdminMode(true);
      setPinModalOpen(false);
      showToast('অ্যাডমিন ড্যাশবোর্ডে স্বাগতম! সর্বমোট এডিটিং সিস্টেম চালু হয়েছে।');
    } else {
      setPinError('ভুল পিন কোড! সঠিক পিন দিন (ডিফল্ট: 1234)');
    }
  };

  return (
    <header id="main-site-header" className="sticky top-0 z-40 bg-white shadow-sm font-sans">
      {/* Top Announcement Bar - Auto Run Live Ticker */}
      <div
        className="text-white text-[11px] sm:text-xs py-1.5 px-3 shadow-inner transition-colors duration-300 relative overflow-hidden"
        style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-2 overflow-hidden">
          {/* Badge */}
          <div className="flex items-center gap-1.5 shrink-0 z-10 py-0.5 pr-2 font-medium tracking-wide">
            <span className="bg-amber-300 text-gray-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              অটো-রান নোটিশ
            </span>
          </div>

          {/* Scrolling Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap font-bold tracking-wide text-amber-100 flex items-center">
              <span className="mx-6 flex items-center gap-1.5">📢 {settings.announcementText}</span>
              <span className="mx-6 flex items-center gap-1.5">🚚 সারাদেশের কুরিয়ারে ক্যাশ অন ডেলিভারি সুবিধা!</span>
              <span className="mx-6 flex items-center gap-1.5">🥭 ১০০% অরিজিনাল ফরমালিন মুক্ত দিনাজপুরী লিচু!</span>
              <span className="mx-6 flex items-center gap-1.5">📞 যে কোনো অনুসন্ধানে কল করুন: {settings.phonePrimary}</span>

              {/* Repeat for seamless infinite marquee scroll */}
              <span className="mx-6 flex items-center gap-1.5">📢 {settings.announcementText}</span>
              <span className="mx-6 flex items-center gap-1.5">🚚 সারাদেশের কুরিয়ারে ক্যাশ অন ডেলিভারি সুবিধা!</span>
              <span className="mx-6 flex items-center gap-1.5">🥭 ১০০% অরিজিনাল ফরমালিন মুক্ত দিনাজপুরী লিচু!</span>
              <span className="mx-6 flex items-center gap-1.5">📞 যে কোনো অনুসন্ধানে কল করুন: {settings.phonePrimary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-2 md:py-3 flex items-center justify-between gap-3">
        {/* Mobile menu button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-gray-600 hover:text-red-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo & Branding - One Click Return to Home Page */}
        <div
          onClick={() => {
            setActiveCategory('all');
            setSearchQuery('');
            setSelectedProductDetail(null);
            setQuickViewProduct(null);
            setCheckoutProduct(null);
            setIsAdminMode(false);
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer group transition-all duration-200 select-none"
          title="হোম পেজে ফিরে যান"
        >
          <div className="relative shrink-0 transition-transform group-hover:scale-105">
            {settings.siteLogoImage ? (
              <img
                src={settings.siteLogoImage}
                alt={settings.siteName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain rounded-xl border border-gray-200 shadow-sm group-hover:border-red-500 transition-colors"
              />
            ) : (
              <div
                style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shadow-md text-white font-black text-xl sm:text-2xl tracking-tighter transform -rotate-2 group-hover:rotate-0 transition-transform"
              >
                {settings.siteName ? settings.siteName.charAt(0) : 'লি'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight group-hover:opacity-90 transition-opacity leading-none flex items-center gap-2">
              <span>{settings.siteName}</span>
            </h1>
            <p
              style={{ color: 'var(--theme-primary, #dc2626)' }}
              className="text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-tight mt-0.5 group-hover:opacity-80 transition-opacity"
            >
              {settings.siteTagline}
            </p>
          </div>
        </div>

        {/* Search Bar with Search Button */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 items-center gap-1.5">
          <div className="relative flex-1">
            <input
              id="desktop-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="দিনাজপুরের বেদানা, চায়না-৩, বোম্বাই লিচু খুঁজুন..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                title="সার্চ ক্লিয়ার করুন"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (searchQuery) {
                showToast(`"${searchQuery}" অনুসন্ধানের ফলাফল দেখানো হচ্ছে`);
              }
            }}
            className="px-4 py-2 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>খুঁজুন</span>
          </button>
        </div>

        {/* Actions: Profile / Account & Cart */}
        <div className="flex items-center gap-2">
          {/* Profile & Account / Admin Button */}
          <button
            id="toggle-admin-panel-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isAdminMode
                ? 'bg-amber-500 text-gray-950 hover:bg-amber-400 ring-2 ring-amber-300'
                : currentUser
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-gray-900 text-white hover:bg-red-700'
            }`}
            title="অ্যাকাউন্ট প্রোফাইল, সাইন ইন ও সাইন আপ"
          >
            {isAdminMode ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-gray-950" />
                <span className="hidden sm:inline">অ্যাডমিন ড্যাশবোর্ড</span>
                <span className="sm:hidden">অ্যাডমিন</span>
              </>
            ) : currentUser ? (
              <>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full border border-amber-300 object-cover shrink-0"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span className="max-w-[80px] sm:max-w-[110px] truncate">{currentUser.name}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">প্রোফাইল / লগইন</span>
                <span className="sm:hidden">লগইন</span>
              </>
            )}
          </button>

          {/* Cart Icon */}
          <button
            id="open-cart-drawer-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: 'var(--theme-light, #fef2f2)',
              color: 'var(--theme-text, #991b1b)',
            }}
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartItemsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[9px] sm:text-[10px] font-black rounded-full h-4 min-w-4 sm:h-5 sm:min-w-5 px-1 flex items-center justify-center border-2 border-white shadow-sm"
                style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
              >
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="লিচু সার্চ করুন..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Navigation Bar Categories */}
      <nav
        id="category-navigation"
        className="text-white shadow-sm overflow-x-auto scrollbar-none transition-colors duration-300"
        style={{
          backgroundColor: 'var(--theme-primary, #dc2626)',
          borderTop: '1px solid var(--theme-hover, #b91c1c)',
        }}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 flex items-center space-x-1 whitespace-nowrap py-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 text-xs md:text-sm font-bold rounded-md transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white shadow-sm'
                : 'text-white/90 hover:bg-black/10 hover:text-white'
            }`}
            style={
              activeCategory === 'all'
                ? { color: 'var(--theme-text, #991b1b)' }
                : undefined
            }
          >
            সকল লিচু
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs md:text-sm font-bold rounded-md transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white shadow-sm'
                  : 'text-white/90 hover:bg-black/10 hover:text-white'
              }`}
              style={
                activeCategory === cat.id
                  ? { color: 'var(--theme-text, #991b1b)' }
                  : undefined
              }
            >
              {cat.nameBn}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-3 px-4 shadow-lg animate-fade-in">
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              দ্রুত লিঙ্কসমূহ
            </div>
            <button
              onClick={() => {
                setTrackOrderModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              <Truck className="w-4 h-4 text-red-600" />
              <span>আপনার অর্ডার ট্র্যাক করুন</span>
            </button>
            <a
              href={`tel:${settings.phonePrimary}`}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>কল করুন: {settings.phonePrimary}</span>
            </a>
            <a
              href={`https://wa.me/88${settings.phoneWhatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp এ সরাসরি চ্যাট</span>
            </a>
          </div>
        </div>
      )}

      {/* Admin PIN Verification Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100 animate-slide-up">
            <button
              onClick={() => setPinModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-gray-900 mb-1">
              অ্যাডমিন প্যানেল সিকিউরিটি
            </h3>
            <p className="text-xs text-center text-gray-500 mb-4">
              ওয়েবসাইট এডিটিং প্যানেলে প্রবেশ করতে পিন কোড প্রদান করুন। (ডিফল্ট পিন: <strong>1234</strong>)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="৪ সংখ্যার পিন কোড লিখুন..."
                  className="w-full text-center tracking-widest text-lg font-bold py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  autoFocus
                />
                {pinError && <p className="text-xs text-red-600 font-medium mt-1.5 text-center">{pinError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-red-600/30"
                >
                  প্রবেশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
