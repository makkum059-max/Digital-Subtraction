import React from 'react';

interface PaymentLogoProps {
  method: 'bkash' | 'nagad' | 'rocket' | 'upay' | 'cellfin' | 'binance' | 'cards' | 'cod' | string;
  className?: string;
  size?: number;
}

export const PaymentLogo: React.FC<PaymentLogoProps> = ({ method, className = "h-6 w-auto", size = 24 }) => {
  const m = method.toLowerCase();

  if (m.includes('zinipay') || m === 'zinipay') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[11px] shadow-xs tracking-tight ${className}`}>
        <svg className="w-4 h-4 fill-current shrink-0 text-amber-300" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span>ZiniPay</span>
      </div>
    );
  }

  if (m.includes('bkash') || m === 'bkash') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e2136e] text-white font-extrabold text-[11px] shadow-xs tracking-tight ${className}`}>
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 2L2 19h20L12 2zm0 4.2L18.2 17H5.8L12 6.2z" />
        </svg>
        <span>bKash</span>
      </div>
    );
  }

  if (m.includes('nagad') || m === 'nagad') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f7921e] text-white font-extrabold text-[11px] shadow-xs tracking-tight ${className}`}>
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
        </svg>
        <span>Nagad</span>
      </div>
    );
  }

  if (m.includes('rocket') || m === 'rocket') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8c3494] text-white font-extrabold text-[11px] shadow-xs tracking-tight ${className}`}>
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 2.5s-4 4.5-4 9.5a4 4 0 0 0 8 0c0-5-4-9.5-4-9.5z" />
        </svg>
        <span>Rocket</span>
      </div>
    );
  }

  if (m.includes('upay') || m === 'upay') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2e3192] text-white font-extrabold text-[11px] shadow-xs tracking-tight ${className}`}>
        <span className="font-black text-amber-300">u</span>
        <span>Upay</span>
      </div>
    );
  }

  if (m.includes('binance') || m === 'binance') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181a20] text-[#f0b90b] border border-[#f0b90b]/40 font-extrabold text-[11px] shadow-xs tracking-tight ${className}`}>
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 3l3 3-3 3-3-3 3-3zm0 6l3 3-3 3-3-3 3-3zm-6 0l3 3-3 3-3-3 3-3zm12 0l3 3-3 3-3-3 3-3zm-6 6l3 3-3 3-3-3 3-3z" />
        </svg>
        <span>BINANCE</span>
      </div>
    );
  }

  if (m.includes('card') || m === 'cards' || m === 'bank') {
    return (
      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-900 text-white font-extrabold text-[11px] border border-gray-700 shadow-xs ${className}`}>
        <svg className="w-4 h-4 fill-current shrink-0 text-amber-400" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
        <span>Cards / Bank</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900 text-emerald-100 font-extrabold text-[11px] border border-emerald-700 shadow-xs ${className}`}>
      <span>💵</span>
      <span>ক্যাশ অন ডেলিভারি</span>
    </div>
  );
};
