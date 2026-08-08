import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, CreditCard, Share2 } from 'lucide-react';
import { SocialIcon } from './common/SocialIcon';
import { PaymentLogo } from './common/PaymentIcons';

export const PaymentAndSocialBanner: React.FC = () => {
  const { settings } = useStore();

  const activePaymentMethods = settings.customPaymentMethods?.filter((p) => p.isActive) || [];
  const activeSocialLinks = settings.socialLinks?.filter((s) => s.isActive) || [];

  return (
    <section id="live-payment-social-banner" className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl border border-gray-800 my-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Payment Methods Section */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm md:text-base font-black text-white tracking-wide">
              পেমেন্ট মেথড সমুহ (Accepted Live Payment Methods)
            </h3>
            {settings.sslEnabled && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>SSL 256-Bit</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {settings.weAcceptLogoImage ? (
              <div className="bg-white/10 p-1.5 rounded-xl border border-white/20 shadow-xs flex items-center gap-2">
                <img src={settings.weAcceptLogoImage} alt="We Accept Payment Logos" className="h-8 max-w-[280px] object-contain rounded" />
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

            {activePaymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center gap-2 bg-gray-800/90 hover:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700/80 shadow-sm transition-all"
              >
                {pm.logoImage ? (
                  <img
                    src={pm.logoImage}
                    alt={pm.name}
                    className="w-5 h-5 object-contain rounded bg-white p-0.5 shrink-0"
                  />
                ) : (
                  <span className="text-sm">💳</span>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-100">{pm.name}</span>
                  <span className="text-[9px] text-amber-400 font-medium">{pm.accountType}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/80 shadow-sm">
              <span className="text-sm">💵</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-200">ক্যাশ অন ডেলিভারি</span>
                <span className="text-[9px] text-emerald-400 font-medium">পণ্য হাতে পেয়ে পেমেন্ট</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="md:col-span-5 space-y-3 md:border-l md:border-gray-800 md:pl-6">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs md:text-sm font-bold text-gray-200">
              সোশ্যাল মিডিয়ায় যুক্ত থাকুন (Social Links)
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeSocialLinks.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                title={soc.title}
                className="flex items-center gap-2 px-3 py-1.5 text-white rounded-full text-xs font-bold border border-white/20 transition-all shadow-md hover:scale-105 cursor-pointer"
                style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <SocialIcon platform={soc.platform} size={13} />
                </div>
                <span>{soc.title || soc.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
