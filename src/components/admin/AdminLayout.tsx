import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { getThemeConfig } from '../../utils/theme';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Settings,
  Store,
  RotateCcw,
  Plus,
  Bell,
  LogOut,
  Tag,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    setIsAdminMode,
    settings,
    orders,
    products,
    promos,
    resetToDefaults,
  } = useStore();

  const themeConfig = getThemeConfig(settings.primaryTheme, settings.customHexColor);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const totalReviewsCount = products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'ওভারভিউ ড্যাশবোর্ড', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'পণ্য এডিটর', icon: <Package className="w-4 h-4" />, badge: products.length },
    { id: 'categories', label: 'ক্যাটাগরি কাস্টমাইজ', icon: <Layers className="w-4 h-4" /> },
    { id: 'orders', label: 'অর্ডার ম্যানেজমেন্ট', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingOrdersCount },
    { id: 'promos', label: 'প্রোমো কোড ও অফার', icon: <Tag className="w-4 h-4" />, badge: promos.length },
    { id: 'banners', label: 'ব্যনার ও স্লাইডার', icon: <Sliders className="w-4 h-4" /> },
    { id: 'reviews', label: 'রিভিউ এডিটর ও রিমুভ', icon: <MessageSquare className="w-4 h-4" />, badge: totalReviewsCount },
    { id: 'settings', label: 'সাইট সেটিংস এডিটর', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-gray-100 font-sans flex flex-col md:flex-row w-full max-w-full">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex flex-col justify-between shrink-0 shadow-xl border-r border-gray-800 min-h-screen">
        <div>
          {/* Header - Click Logo/Title to Return to Store Homepage */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-3 cursor-pointer group transition-all"
              title="ওয়েবসাইট হোম পেজে ফিরে যান"
            >
              {settings.siteLogoImage ? (
                <img
                  src={settings.siteLogoImage}
                  alt={settings.siteName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-contain rounded-xl border border-white/20 bg-gray-950 p-1 shadow-md shrink-0 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div
                  style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
                  className="w-10 h-10 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md shrink-0 border border-white/20 group-hover:scale-105 transition-transform"
                >
                  {settings.siteName ? settings.siteName.charAt(0) : 'অ্যা'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-black text-white tracking-tight truncate group-hover:opacity-90 transition-opacity">{settings.siteName}</h2>
                <span
                  style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
                  className="text-[10px] text-white font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/20 inline-block mt-0.5 shadow-2xs"
                >
                  অ্যাডমিন এডিটর
                </span>
              </div>
            </div>
          </div>

          {/* Quick return to store button */}
          <div className="p-3">
            <button
              onClick={() => setIsAdminMode(false)}
              style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
              className="w-full py-2.5 px-3 hover:opacity-95 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>লাইভ ওয়েবসাইট দেখুন</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-1">
              ম্যানেজমেন্ট মেনু
            </div>
            {tabs.map((tab) => {
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  style={isActive ? { background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' } : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'text-white shadow-md scale-[1.02]'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive ? 'bg-white text-gray-950 shadow-2xs' : 'bg-red-600 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => {
              if (confirm('আপনি কি নিশ্চিত যে সমস্ত ডেটা রিসেট করে ডিফল্ট সেটিংসে ফিরিয়ে আনতে চান?')) {
                resetToDefaults();
              }
            }}
            className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title="মূল ডেটা রিস্টোর করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিসেট</span>
          </button>

          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full py-2 px-3 bg-gray-950 text-gray-400 hover:text-red-400 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট / বন্ধ করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 md:p-8 w-full max-w-full">
        {/* Top bar header with Website Matching Theme */}
        <div
          style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
          className="text-white rounded-3xl p-5 md:p-6 shadow-xl border border-white/20 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden w-full transition-all duration-300"
        >
          {/* Decorative glow overlay */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/90 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>অটো থিম কালার সিংক্রোনাইজড</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {tabs.find((t) => t.id === adminTab)?.label}
            </h1>
            <p className="text-xs text-white/80 mt-0.5">
              ওয়েবসাইটের সকল তথ্য, ছবি, ক্যাটাগরি, প্রোডাক্ট অপশন ও অর্ডার লাইভ সম্পাদন ও নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-sm">
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>পেন্ডিং অর্ডার: {pendingOrdersCount} টি</span>
            </div>

            <button
              onClick={() => setIsAdminMode(false)}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-950 rounded-xl text-xs font-black shadow-lg transition-all ml-auto md:ml-0 cursor-pointer"
            >
              লাইভ স্টোর দেখুন ↗
            </button>
          </div>
        </div>

        {/* Tab content view */}
        <div className="animate-fade-in w-full max-w-full">{children}</div>
      </main>
    </div>
  );
};
