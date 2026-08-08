import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Clock, Award, ChevronLeft, ChevronRight, ArrowRight, Tag, Copy, Check } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { banners, setActiveCategory, settings, promos, showToast } = useStore();
  const activeBanners = banners.filter((b) => b.isActive);
  const activePromos = promos.filter((p) => p.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Countdown timer simulation for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  const handleCopyCode = (codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(codeStr);
    showToast(`প্রোমো কোড "${codeStr}" কপি করা হয়েছে! চেকআউটে পেস্ট করুন।`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto carousel rotation
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const slide = activeBanners[currentSlide];

  return (
    <div id="hero-banner-section" className="relative bg-gradient-to-b from-red-50 to-white pt-2 pb-5 px-3 sm:px-6 overflow-hidden">
      <div className="max-w-[1920px] mx-auto">
        {/* Main Banner Card */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-gray-950 border border-gray-100 min-h-[200px] sm:min-h-[280px] md:min-h-[360px] flex items-center group transition-all duration-300">
          {/* Full Banner Background Image */}
          {slide.image ? (
            <div
              onClick={() => setActiveCategory(slide.buttonLinkCategory || 'all')}
              className="w-full h-full relative cursor-pointer"
            >
              <img
                src={slide.image}
                alt={slide.title || 'Banner'}
                className="w-full h-auto object-cover object-center rounded-2xl sm:rounded-3xl max-h-[500px] transition-transform duration-500 hover:scale-[1.005]"
              />
            </div>
          ) : (
            /* Fallback text banner if no image */
            <div className={`w-full p-6 sm:p-10 bg-gradient-to-r ${slide.bgGradient || 'from-rose-950 via-red-900 to-amber-950'} text-white space-y-3`}>
              {slide.badge && (
                <span className="inline-block bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-full">
                  {slide.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl font-black text-white">{slide.title}</h2>
              <p className="text-sm text-gray-200">{slide.subtitle}</p>
              <button
                onClick={() => setActiveCategory(slide.buttonLinkCategory || 'all')}
                style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                className="text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <span>{slide.buttonText || 'অর্ডার করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Slider controls if multiple */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm border border-white/20 cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm border border-white/20 cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Live Active Promo Codes Offer Banner */}
        {activePromos.length > 0 && (
          <div className="mt-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-lg border border-purple-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-400/30 shrink-0">
                  <Tag className="w-5 h-5 animate-pulse text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-purple-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      লাইভ অফার কুপন
                    </span>
                    <h4 className="font-bold text-xs md:text-sm text-white">আজকের ডিসকাউন্ট প্রোমো কোড সমূহ</h4>
                  </div>
                  <p className="text-[11px] text-purple-200 mt-0.5">
                    অর্ডার করার সময় নিচে দেওয়া প্রোমো কোড ব্যবহার করে আকর্ষণীয় মূল্যছাড় পান:
                  </p>
                </div>
              </div>

              {/* Promo Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {activePromos.map((promo) => (
                  <button
                    key={promo.id}
                    onClick={() => handleCopyCode(promo.code)}
                    className="flex-1 sm:flex-none flex items-center justify-between gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-purple-300/40 rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="text-left">
                      <div className="font-mono font-black text-amber-300 text-xs tracking-wider flex items-center gap-1">
                        <span>{promo.code}</span>
                        {copiedCode === promo.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-purple-200 group-hover:text-white" />
                        )}
                      </div>
                      <div className="text-[10px] text-purple-100 font-medium">
                        {promo.discountType === 'percentage' ? `${promo.discountValue}% ছাড়` : `৳${promo.discountValue} ক্যাশব্যাক`}
                      </div>
                    </div>
                    <span className="text-[9px] bg-purple-950/80 text-purple-200 px-1.5 py-0.5 rounded font-bold">
                      কপি
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4 Feature Badges below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className="bg-white border border-rose-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm">{settings.feature1Title || '১০০% অর্গানিক লিচু'}</h4>
              <p className="text-[11px] text-gray-500">{settings.feature1Subtitle || 'কোনো কেমিক্যাল বা কেমিক্যাল স্প্রে মুক্ত'}</p>
            </div>
          </div>

          <div className="bg-white border border-rose-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm">{settings.feature2Title || 'সরাসরি বাগান থেকে'}</h4>
              <p className="text-[11px] text-gray-500">{settings.feature2Subtitle || 'দিনাজপুর ও রাজশাহীর তাজা ফসল'}</p>
            </div>
          </div>

          <div className="bg-white border border-rose-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm">{settings.feature3Title || 'দ্রুত ডেলিভারি'}</h4>
              <p className="text-[11px] text-gray-500">{settings.feature3Subtitle || '২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি'}</p>
            </div>
          </div>

          <div className="bg-white border border-rose-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm">{settings.feature4Title || 'ক্যাশ অন ডেলিভারি'}</h4>
              <p className="text-[11px] text-gray-500">{settings.feature4Subtitle || 'পণ্য বুঝে পেয়ে মূল্য পরিশোধের সুবিধা'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
