import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';
import { SocialIcon } from './common/SocialIcon';
import { PaymentLogo } from './common/PaymentIcons';

export const Footer: React.FC = () => {
  const { settings, setActiveCategory, setTrackOrderModalOpen, setIsAdminMode } = useStore();

  return (
    <footer
      id="main-site-footer"
      className="bg-[#0b0f19] text-gray-300 font-sans border-t-4 transition-colors duration-300"
      style={{ borderTopColor: 'var(--theme-primary, #dc2626)' }}
    >
      {/* Upper Footer: Trust Pillars (Auto Theme Color Icons with Glow) */}
      <div className="bg-[#0b0f19] py-9 border-b border-slate-800/80">
        <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1. Secure Payment */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: 'var(--theme-primary, #dc2626)',
                boxShadow: '0 8px 22px -3px var(--theme-primary, rgba(220, 38, 38, 0.45))',
              }}
            >
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Secure Payment
              </h5>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                100% secure transactions
              </p>
            </div>
          </div>

          {/* 2. Instant Delivery */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: 'var(--theme-primary, #dc2626)',
                boxShadow: '0 8px 22px -3px var(--theme-primary, rgba(220, 38, 38, 0.45))',
              }}
            >
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Instant Delivery
              </h5>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Digital products delivered instantly
              </p>
            </div>
          </div>

          {/* 3. Easy Returns */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: 'var(--theme-primary, #dc2626)',
                boxShadow: '0 8px 22px -3px var(--theme-primary, rgba(220, 38, 38, 0.45))',
              }}
            >
              <RotateCcw className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Easy Returns
              </h5>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                30-day money back guarantee
              </p>
            </div>
          </div>

          {/* 4. 24/7 Support */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: 'var(--theme-primary, #dc2626)',
                boxShadow: '0 8px 22px -3px var(--theme-primary, rgba(220, 38, 38, 0.45))',
              }}
            >
              <Headphones className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                24/7 Support
              </h5>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Always here to help you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
        {/* Brand info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            {settings.siteLogoImage ? (
              <img
                src={settings.siteLogoImage}
                alt={settings.siteName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain rounded-lg border border-gray-700 bg-white p-0.5"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
              >
                {settings.siteName ? settings.siteName.charAt(0) : 'লি'}
              </div>
            )}
            <span className="text-xl font-black text-white">{settings.siteName}</span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            দিনাজপুর ও রাজশাহীর ঐতিহ্যবাহী সেরা বাগানের অর্গ্যানিক তাজা বেদানা, চায়না-৩, ও বোম্বাই লিচু সরাসরি ঢাকায় ও সারা বাংলাদেশে দ্রুত সময়ে পৌঁছে দেয়া আমাদের মূল উদ্দেশ্য।
          </p>

          {/* Social Media Links & Icons (Matching Website Primary Theme Color) */}
          {settings.socialLinks && settings.socialLinks.filter(s => s.isActive).length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-wider">সোশ্যাল মিডিয়ায় যুক্ত থাকুন:</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {settings.socialLinks.filter(s => s.isActive).map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={soc.title || soc.platform}
                    className="w-9 h-9 text-white rounded-full border border-white/20 transition-all duration-200 flex items-center justify-center shadow-md hover:scale-110"
                    style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                  >
                    <SocialIcon platform={soc.platform} size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider text-rose-400">
            আমাদের ক্যাটাগরি
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={() => setActiveCategory('dinajpur')} className="hover:text-white transition-colors cursor-pointer">
                দিনাজপুরের লিচু
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('rajshahi')} className="hover:text-white transition-colors cursor-pointer">
                রাজশাহীর লিচু
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('bedana')} className="hover:text-white transition-colors cursor-pointer">
                বেদানা লিচু স্পেশাল
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('china3')} className="hover:text-white transition-colors cursor-pointer">
                চায়না-৩ প্রিমিয়াম প্যাক
              </button>
            </li>
            <li>
              <button onClick={() => setActiveCategory('gift-pack')} className="hover:text-white transition-colors cursor-pointer">
                উপহার ও মেগা কার্টন
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider text-rose-400">
            যোগাযোগের ঠিকানা
          </h4>
          <ul className="space-y-2.5 text-gray-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--theme-primary, #dc2626)' }} />
              <span>{settings.addressText}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href={`tel:${settings.phonePrimary}`} className="hover:text-white font-bold text-gray-200">
                {settings.phonePrimary}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/88${settings.phoneWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-emerald-300 font-bold"
              >
                WhatsApp Support
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.emailText}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/80 border-t border-gray-800 py-4 px-6 text-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-center md:text-left">
          <div>
            © {new Date().getFullYear()} <span className="text-white font-bold">{settings.siteName}</span>. সর্বস্বত্ব সংরক্ষিত।
          </div>

          {/* Payment Methods Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 mr-1 uppercase">We Accept:</span>
            {settings.weAcceptLogoImage ? (
              <div className="bg-white/10 px-2 py-1 rounded-lg border border-gray-700">
                <img src={settings.weAcceptLogoImage} alt="We Accept Payment Logos" className="h-6 max-w-[280px] object-contain" />
              </div>
            ) : (
              <>
                <PaymentLogo method="bkash" />
                <PaymentLogo method="nagad" />
                <PaymentLogo method="rocket" />
                <PaymentLogo method="upay" />
                <PaymentLogo method="cards" />
                <PaymentLogo method="binance" />
              </>
            )}
          </div>


        </div>
      </div>
    </footer>
  );
};
