/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { HotProductsAutoRun } from './components/HotProductsAutoRun';
import { AuthProfileModal } from './components/AuthProfileModal';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProductsManager } from './components/admin/ProductsManager';
import { CategoriesManager } from './components/admin/CategoriesManager';
import { OrdersManager } from './components/admin/OrdersManager';
import { PromosManager } from './components/admin/PromosManager';
import { BannersManager } from './components/admin/BannersManager';
import { SettingsManager } from './components/admin/SettingsManager';
import { ReviewsManager } from './components/admin/ReviewsManager';

import { Sparkles, ArrowRight, ShieldCheck, Heart, Star, ChevronLeft, ChevronRight, Quote, Play, Pause } from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    isAdminMode,
    adminTab,
    selectedProductDetail,
    settings,
  } = useStore();

  // Testimonial Auto-Run State
  const [activeTestimonialIdx, setActiveTestimonialIdx] = React.useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = React.useState(false);

  const testimonialsList = [
    {
      text: settings.testimonial1Text || '"দিনাজপুরের অরিজিনাল বেদানা লিচু পেয়েছিলাম। সত্যিই কোনো ফরমালিন ছিল না, মিষ্টি ছিল অসম্ভব! ধন্যবাদ লিচু বাজার। "',
      author: settings.testimonial1Author || '— ড. রফিকুল ইসলাম (ধানমন্ডি, ঢাকা)',
      badge: 'ভেরিফাইড ক্রেতা',
    },
    {
      text: settings.testimonial2Text || '"চায়না-৩ লিচুর সাইজ অনেক বড় ছিল। কুরিয়ারে ১ দিনেই ডেলিভারি পাইছি। প্যাকজিং অনেক সুসংগঠিত ছিল। "',
      author: settings.testimonial2Author || '— ফারহানা ইয়াসমিন (উপশহর, রাজশাহী)',
      badge: 'সন্তুষ্ট কাস্টমার',
    },
    {
      text: settings.testimonial3Text || '"রয়্যাল এক্সিকিউটিভ গিফট বক্স বানিয়ে দিয়েছিলাম বসকে উপহার দেয়ার জন্য। তিনি অনেক খুশি হয়েছেন। সার্ভিস অসাধারণ।"',
      author: settings.testimonial3Author || '— সাজ্জাদ হোসেন (গুলশান, ঢাকা)',
      badge: 'ভিআইপি অর্ডারিং',
    },
  ];

  React.useEffect(() => {
    if (isTestimonialPaused) return;
    const interval = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonialsList.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isTestimonialPaused, testimonialsList.length]);

  // If Admin Mode is active, render Admin Dashboard System
  if (isAdminMode) {
    return (
      <AdminLayout>
        {adminTab === 'overview' && <DashboardOverview />}
        {adminTab === 'products' && <ProductsManager />}
        {adminTab === 'categories' && <CategoriesManager />}
        {adminTab === 'orders' && <OrdersManager />}
        {adminTab === 'promos' && <PromosManager />}
        {adminTab === 'banners' && <BannersManager />}
        {adminTab === 'reviews' && <ReviewsManager />}
        {adminTab === 'settings' && <SettingsManager />}
      </AdminLayout>
    );
  }

  // If a specific product was clicked, open full Product Details Page
  if (selectedProductDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-red-600 selection:text-white">
        <Header />
        <main className="flex-1">
          <ProductDetailPage product={selectedProductDetail} />
        </main>
        <Footer />

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <ProductQuickViewModal />
        <CheckoutModal />
        <OrderSuccessModal />
        <TrackOrderModal />
        <AuthProfileModal />
        <Toast />
      </div>
    );
  }

  // Filter products by active category & search query
  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Group products by origin/category for home view sections (when category === 'all')
  const dinajpurProducts = products.filter((p) => p.category === 'dinajpur' || p.origin.includes('দিনাজপুর'));
  const rajshahiProducts = products.filter((p) => p.category === 'rajshahi' || p.origin.includes('রাজশাহী'));
  const premiumProducts = products.filter((p) => p.category === 'premium' || p.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-red-600 selection:text-white">
      <Header />

      {/* Show Hero Banner only on main page view */}
      {activeCategory === 'all' && !searchQuery && <HeroBanner />}

      {/* Main Container */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 md:py-10 space-y-12">
        {/* Hot Products Live Auto-Run Slider */}
        {activeCategory === 'all' && !searchQuery && <HotProductsAutoRun />}

        {/* Search Results Banner */}
        {searchQuery && (
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold text-gray-800">
              🔍 "<span className="text-red-600">{searchQuery}</span>" এর জন্য প্রাপ্ত ফলাফল (
              {filteredProducts.length} টি)
            </h2>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              সব লিচু দেখুন
            </button>
          </div>
        )}

        {/* SECTION VIEW: Filtered Category View */}
        {(activeCategory !== 'all' || searchQuery) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span
                    className="w-3 h-7 rounded-full inline-block"
                    style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                  ></span>
                  <span>
                    {categories.find((c) => c.id === activeCategory)?.nameBn || 'সকল লিচু'}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  সরাসরি বাগান থেকে সংগৃহীত ১০০০% খাঁটি ও তাজা লিচু
                </p>
              </div>

              <span
                className="text-xs font-bold px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: 'var(--theme-light, #fef2f2)',
                  borderColor: 'var(--theme-border, #fecaca)',
                  color: 'var(--theme-text, #991b1b)',
                }}
              >
                {filteredProducts.length} টি পণ্য পাওয়া গেছে
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 space-y-3">
                <div className="text-4xl">🍃</div>
                <h3 className="font-bold text-gray-700 text-base">কোনো লিচু পাওয়া যায়নি!</h3>
                <p className="text-xs text-gray-500">অন্য কোনো ক্যাটাগরি অথবা সার্চ কি-ওয়ার্ড ট্রাই করুন।</p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 text-white rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                >
                  সকল লিচু প্রদর্শন করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* HOMEPAGE DEFAULT SECTIONS (matching reference layout screenshot & Admin Catalog names) */}
        {activeCategory === 'all' && !searchQuery && (
          <>
            {categories.map((cat, index) => {
              // Map section ID for CSS targeting while staying completely dynamic
              let sectionId = `${cat.id}-section`;
              if (cat.id === 'dinajpur') sectionId = 'dinajpur-section';
              if (cat.id === 'rajshahi') sectionId = 'rajshahi-section';
              if (cat.id === 'gift-pack' || cat.id === 'premium') sectionId = 'premium-section';

              // Filter products belonging to this category
              const catProducts = products.filter(
                (p) =>
                  p.category === cat.id ||
                  p.category?.toLowerCase() === cat.nameBn.toLowerCase() ||
                  (cat.id === 'dinajpur' && (p.category === 'dinajpur' || p.origin.includes('দিনাজপুর'))) ||
                  (cat.id === 'rajshahi' && (p.category === 'rajshahi' || p.origin.includes('রাজশাহী'))) ||
                  ((cat.id === 'gift-pack' || cat.id === 'premium') && (p.category === 'premium' || p.category === 'gift-pack' || p.isFeatured))
              );

              return (
                <section key={cat.id} id={sectionId} className={`space-y-4 ${index > 0 ? 'pt-4' : ''}`}>
                  <div
                    className="flex items-center justify-between border-b-2 pb-2"
                    style={{ borderColor: 'var(--theme-primary, #dc2626)' }}
                  >
                    <div className="flex items-center gap-2">
                      {cat.id === 'gift-pack' || cat.id === 'premium' ? (
                        <Sparkles className="w-6 h-6 text-amber-500" />
                      ) : (
                        <div
                          className="w-3 h-6 rounded-sm"
                          style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                        ></div>
                      )}
                      <h2
                        className="text-xl md:text-2xl font-black"
                        style={{ color: 'var(--theme-primary, #dc2626)' }}
                      >
                        {cat.nameBn}
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className="text-white text-xs font-black px-3.5 py-1.5 rounded-md shadow-sm transition-transform hover:scale-105 active:scale-95 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                    >
                      <span>VIEW ALL</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {catProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                      {catProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-500">
                      এই ক্যাটাগরিতে এখনও পণ্য যুক্ত করা হয়নি। অ্যাডমিন ড্যাশবোর্ড থেকে পণ্য যোগ করতে পারেন।
                    </div>
                  )}
                </section>
              );
            })}

            {/* Section 4: Customer Trust & Auto-Run Live Testimonials */}
            <section
              style={{ background: 'var(--theme-dark-gradient, linear-gradient(135deg, #b91c1c, #111827))' }}
              className="rounded-3xl p-6 md:p-10 text-white shadow-2xl my-8 transition-all duration-300 relative overflow-hidden group"
              onMouseEnter={() => setIsTestimonialPaused(true)}
              onMouseLeave={() => setIsTestimonialPaused(false)}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-white/15 pb-6">
                <div className="text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="bg-amber-400 text-red-950 text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      {settings.whyChooseBadge || 'গ্রাহকদের মতামত'}
                    </span>
                    <span className="bg-white/20 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      অটো-রান লাইভ (Auto-Run)
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                    {settings.whyChooseTitle || 'কেন আমাদের লিচু সবার সেরা?'}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium max-w-xl">
                    {settings.whyChooseSubtitle || 'বিগত ৫ বছর ধরে আমরা ১০,০০০+ সন্তুষ্ট গ্রাহকের দরজায় খাঁটি ও রসালো দিনাজপুরী লিচু পৌঁছে দিয়েছি।'}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/15 shrink-0">
                  <button
                    onClick={() =>
                      setActiveTestimonialIdx((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length)
                    }
                    className="p-2 bg-white/10 hover:bg-white/25 rounded-xl transition-all cursor-pointer text-white"
                    title="পূর্ববর্তী রিভিউ"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsTestimonialPaused(!isTestimonialPaused)}
                    className="px-2.5 py-2 bg-amber-400 hover:bg-amber-300 text-gray-950 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                    title={isTestimonialPaused ? 'প্লে করুন' : 'পজ করুন'}
                  >
                    {isTestimonialPaused ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-gray-950" />
                        <span className="text-[10px] uppercase font-black">প্লে</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-gray-950" />
                        <span className="text-[10px] uppercase font-black">অটো</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % testimonialsList.length)}
                    className="p-2 bg-white/10 hover:bg-white/25 rounded-xl transition-all cursor-pointer text-white"
                    title="পরবর্তী রিভিউ"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Featured Active Auto-Run Spotlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonialsList.map((item, idx) => {
                  const isActive = idx === activeTestimonialIdx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer relative flex flex-col justify-between ${
                        isActive
                          ? 'bg-white/20 backdrop-blur-xl border-2 border-amber-400 shadow-2xl scale-102 ring-4 ring-amber-400/20'
                          : 'bg-white/10 backdrop-blur-md border border-white/15 opacity-80 hover:opacity-100 hover:bg-white/15'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400" />
                            ))}
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-amber-400 text-gray-950' : 'bg-white/10 text-amber-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>

                        <p className="text-xs text-gray-100 leading-relaxed italic font-medium relative pl-2">
                          <Quote className="w-3.5 h-3.5 text-amber-300 inline mr-1 opacity-70" />
                          {item.text}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div className="text-xs font-bold text-amber-300">{item.author}</div>
                        {isActive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress dots indicator */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonialsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeTestimonialIdx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    title={`রিভিউ ${idx + 1}`}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductQuickViewModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />
      <AuthProfileModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
