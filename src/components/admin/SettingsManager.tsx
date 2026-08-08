import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Settings,
  Save,
  Phone,
  DollarSign,
  Lock,
  RotateCcw,
  Building,
  Palette,
  Check,
  Upload,
  Trash2,
  Image,
  ShieldCheck,
  Globe,
  Plus,
  QrCode,
  Share2,
  Tag,
  CreditCard,
  Layers,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Award,
  Clock,
} from 'lucide-react';
import { THEME_PRESETS, ThemePreset, applyTheme } from '../../utils/theme';
import { CustomPaymentMethod, SocialLink } from '../../types';
import { SocialIcon } from '../common/SocialIcon';

export const SettingsManager: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaults,
    showToast,
    syncWithCloud,
    restoreFromCloud,
    cloudSyncStatus,
    clearAllProducts,
    clearAllOrders,
    clearAllCategories,
    clearAllBanners,
    clearAllPromos,
    clearAllData,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'brand' | 'contact' | 'payment' | 'security' | 'cloud' | 'delete'>('cloud');
  const [restoreEmailInput, setRestoreEmailInput] = useState('');

  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline);
  const [siteLogoImage, setSiteLogoImage] = useState(settings.siteLogoImage || '');
  const [weAcceptLogoImage, setWeAcceptLogoImage] = useState(settings.weAcceptLogoImage || '');
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [phonePrimary, setPhonePrimary] = useState(settings.phonePrimary);
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(settings.phoneWhatsapp);
  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber);
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber);
  const [deliveryFeeInsideDhaka, setDeliveryFeeInsideDhaka] = useState(settings.deliveryFeeInsideDhaka);
  const [deliveryFeeOutsideDhaka, setDeliveryFeeOutsideDhaka] = useState(settings.deliveryFeeOutsideDhaka);
  const [deliveryFeeExpress, setDeliveryFeeExpress] = useState(settings.deliveryFeeExpress);
  const [addressText, setAddressText] = useState(settings.addressText);
  const [emailText, setEmailText] = useState(settings.emailText);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [adminPin, setAdminPin] = useState(settings.adminPin);
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail || 'admin@litchibagan.com');
  const [onlinePaymentUrl, setOnlinePaymentUrl] = useState(settings.onlinePaymentUrl || 'https://shurjopay.com/');
  const [onlinePaymentTitle, setOnlinePaymentTitle] = useState(settings.onlinePaymentTitle || '🌐 অনলাইন পে মার্চেন্ট পেমেন্ট গেটোয়ে');
  const [primaryTheme, setPrimaryTheme] = useState<ThemePreset>(settings.primaryTheme || 'red');
  const [customHexColor, setCustomHexColor] = useState(settings.customHexColor || '#dc2626');

  // Customer Trust Section Settings ("কেন আমাদের লিচু সবার সেরা?")
  const [whyChooseBadge, setWhyChooseBadge] = useState(settings.whyChooseBadge || 'গ্রাহকদের মতামত');
  const [whyChooseTitle, setWhyChooseTitle] = useState(settings.whyChooseTitle || 'কেন আমাদের লিচু সবার সেরা?');
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(
    settings.whyChooseSubtitle || 'বিগত ৫ বছর ধরে আমরা ১০,০০০+ সন্তুষ্ট গ্রাহকের দরজায় খাঁটি ও রসালো দিনাজপুরী লিচু পৌঁছে দিয়েছি।'
  );
  const [testimonial1Text, setTestimonial1Text] = useState(
    settings.testimonial1Text || '"দিনাজপুরের অরিজিনাল বেদানা লিচু পেয়েছিলাম। সত্যিই কোনো ফরমালিন ছিল না, মিষ্টি ছিল অসম্ভব! ধন্যবাদ লিচু বাজার। "'
  );
  const [testimonial1Author, setTestimonial1Author] = useState(
    settings.testimonial1Author || '— ড. রফিকুল ইসলাম (ধানমন্ডি, ঢাকা)'
  );
  const [testimonial2Text, setTestimonial2Text] = useState(
    settings.testimonial2Text || '"চায়না-৩ লিচুর সাইজ অনেক বড় ছিল। কুরিয়ারে ১ দিনেই ডেলিভারি পাইছি। প্যাকজিং অনেক সুসংগঠিত ছিল।"'
  );
  const [testimonial2Author, setTestimonial2Author] = useState(
    settings.testimonial2Author || '— ফারহানা ইয়াসমিন (উপশহর, রাজশাহী)'
  );
  const [testimonial3Text, setTestimonial3Text] = useState(
    settings.testimonial3Text || '"রয়্যাল এক্সিকিউটিভ গিফট বক্স বানিয়ে দিয়েছিলাম বসকে উপহার দেয়ার জন্য। তিনি অনেক খুশি হয়েছেন। সার্ভিস অসাধারণ।"'
  );
  const [testimonial3Author, setTestimonial3Author] = useState(
    settings.testimonial3Author || '— সাজ্জাদ হোসেন (গুলশান, ঢাকা)'
  );

  // Hero 4 Feature Badges Settings
  const [feature1Title, setFeature1Title] = useState(settings.feature1Title || '১০০% অর্গানিক লিচু');
  const [feature1Subtitle, setFeature1Subtitle] = useState(settings.feature1Subtitle || 'কোনো কেমিক্যাল বা কেমিক্যাল স্প্রে মুক্ত');
  const [feature2Title, setFeature2Title] = useState(settings.feature2Title || 'সরাসরি বাগান থেকে');
  const [feature2Subtitle, setFeature2Subtitle] = useState(settings.feature2Subtitle || 'দিনাজপুর ও রাজশাহীর তাজা ফসল');
  const [feature3Title, setFeature3Title] = useState(settings.feature3Title || 'দ্রুত ডেলিভারি');
  const [feature3Subtitle, setFeature3Subtitle] = useState(settings.feature3Subtitle || '২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি');
  const [feature4Title, setFeature4Title] = useState(settings.feature4Title || 'ক্যাশ অন ডেলিভারি');
  const [feature4Subtitle, setFeature4Subtitle] = useState(settings.feature4Subtitle || 'পণ্য বুঝে পেয়ে মূল্য পরিশোধের সুবিধা');

  // SSL Service Link & Gateway States
  const [sslEnabled, setSslEnabled] = useState(!!settings.sslEnabled);
  const [sslServiceUrl, setSslServiceUrl] = useState(settings.sslServiceUrl || '');
  const [sslSealImage, setSslSealImage] = useState(settings.sslSealImage || '');

  // ZiniPay Payment Gateway State
  const [ziniPayApiKey, setZiniPayApiKey] = useState(settings.ziniPayApiKey || 'sandbox_test_8f4c9a2e7b31');
  const [ziniPayEndpoint, setZiniPayEndpoint] = useState(settings.ziniPayEndpoint || 'https://api.zinipay.com/v1/payment/create');
  const [ziniPayVerifyEndpoint, setZiniPayVerifyEndpoint] = useState(settings.ziniPayVerifyEndpoint || 'https://api.zinipay.com/v1/payment/verify');
  const [ziniPayRedirectUrl, setZiniPayRedirectUrl] = useState(settings.ziniPayRedirectUrl || 'https://litchibag.com/payment/success');
  const [ziniPayCancelUrl, setZiniPayCancelUrl] = useState(settings.ziniPayCancelUrl || 'https://litchibag.com/payment/cancel');
  const [ziniPayWebhookUrl, setZiniPayWebhookUrl] = useState(settings.ziniPayWebhookUrl || 'https://litchibag.com/api/zinipay/webhook');
  const [ziniPayEnabled, setZiniPayEnabled] = useState(settings.ziniPayEnabled ?? true);

  // Custom Payment Methods
  const [customPaymentMethods, setCustomPaymentMethods] = useState<CustomPaymentMethod[]>(
    settings.customPaymentMethods || [
      {
        id: 'pm1',
        name: 'bKash (বিকাশ)',
        accountType: 'Personal',
        accountNumber: '01700-889900',
        logoImage: '',
        qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bKash:01700-889900',
        instructions: 'বিকাশ সেন্ড মানি বা ক্যাশ আউট করুন এবং ট্রানজেকশন আইডি প্রদান করুন।',
        isActive: true,
      },
      {
        id: 'pm2',
        name: 'Nagad (নগদ)',
        accountType: 'Personal',
        accountNumber: '01700-889900',
        logoImage: '',
        qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Nagad:01700-889900',
        instructions: 'নগদ অ্যাপ বা *167# ব্যবহার করে সেন্ড মানি করুন।',
        isActive: true,
      },
    ]
  );

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    settings.socialLinks || [
      { id: 'soc1', platform: 'facebook', title: 'Facebook Page', url: 'https://facebook.com', isActive: true },
      { id: 'soc2', platform: 'whatsapp', title: 'WhatsApp Business', url: 'https://wa.me/8801700889900', isActive: true },
    ]
  );

  // Logo Upload Handlers
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteLogoImage(reader.result as string);
        showToast('ওয়েবসাইট লোগো আপলোড করা হয়েছে!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSiteLogoImage('');
    showToast('লোগো রিমুভ করা হয়েছে!', 'info');
  };

  const handleWeAcceptLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWeAcceptLogoImage(reader.result as string);
        showToast('We Accept পেমেন্ট লোগো আপলোড করা হয়েছে!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveWeAcceptLogo = () => {
    setWeAcceptLogoImage('');
    showToast('We Accept লোগো রিমুভ করা হয়েছে!', 'info');
  };

  // Payment Method Logo & QR Upload Handlers
  const handlePaymentLogoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPaymentMethods((prev) =>
          prev.map((pm) => (pm.id === id ? { ...pm, logoImage: reader.result as string } : pm))
        );
        showToast('পেমেন্ট মেথড লোগো আপলোড করা হয়েছে!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePaymentLogo = (id: string) => {
    setCustomPaymentMethods((prev) =>
      prev.map((pm) => (pm.id === id ? { ...pm, logoImage: '' } : pm))
    );
    showToast('পেমেন্ট মেথড লোগো রিমুভ করা হয়েছে!', 'info');
  };

  const handlePaymentQrUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPaymentMethods((prev) =>
          prev.map((pm) => (pm.id === id ? { ...pm, qrCodeImage: reader.result as string } : pm))
        );
        showToast('কিউআর কোড (QR Code) ছবি আপলোড করা হয়েছে!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePaymentQr = (id: string) => {
    setCustomPaymentMethods((prev) =>
      prev.map((pm) => (pm.id === id ? { ...pm, qrCodeImage: '' } : pm))
    );
    showToast('কিউআর কোড ছবি রিমুভ করা হয়েছে!', 'info');
  };

  const handleAddPaymentMethod = () => {
    const newPm: CustomPaymentMethod = {
      id: 'pm-' + Date.now(),
      name: 'Rocket / Upay / Bank',
      accountType: 'Personal',
      accountNumber: '01700-000000',
      logoImage: '',
      qrCodeImage: '',
      instructions: 'পেমেন্ট পাঠিয়ে ট্রানজেকশন আইডি প্রদান করুন।',
      isActive: true,
    };
    setCustomPaymentMethods([...customPaymentMethods, newPm]);
    showToast('নতুন পেমেন্ট মেথড যোগ করা হয়েছে!', 'success');
  };

  const handleRemovePaymentMethod = (id: string) => {
    setCustomPaymentMethods(customPaymentMethods.filter((pm) => pm.id !== id));
    showToast('পেমেন্ট মেথড ডিলিট করা হয়েছে!', 'info');
  };

  const handleAddSocialLink = () => {
    const newSoc: SocialLink = {
      id: 'soc-' + Date.now(),
      platform: 'facebook',
      title: 'নতুন সোশ্যাল লিঙ্ক',
      url: 'https://facebook.com',
      isActive: true,
    };
    setSocialLinks([...socialLinks, newSoc]);
    showToast('নতুন সোশ্যাল মিডিয়া লিঙ্ক যোগ করা হয়েছে!', 'success');
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((s) => s.id !== id));
    showToast('সোশ্যাল লিঙ্ক ডিলিট করা হয়েছে!', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName,
      siteTagline,
      siteLogoImage,
      announcementText,
      phonePrimary,
      phoneWhatsapp,
      bkashNumber,
      nagadNumber,
      deliveryFeeInsideDhaka,
      deliveryFeeOutsideDhaka,
      deliveryFeeExpress,
      addressText,
      emailText,
      facebookUrl,
      sslEnabled,
      sslServiceUrl,
      sslSealImage,
      weAcceptLogoImage,
      customPaymentMethods,
      socialLinks,
      adminPin,
      adminEmail,
      onlinePaymentUrl,
      onlinePaymentTitle,
      primaryTheme,
      customHexColor,
      whyChooseBadge,
      whyChooseTitle,
      whyChooseSubtitle,
      testimonial1Text,
      testimonial1Author,
      testimonial2Text,
      testimonial2Author,
      testimonial3Text,
      testimonial3Author,
      feature1Title,
      feature1Subtitle,
      feature2Title,
      feature2Subtitle,
      feature3Title,
      feature3Subtitle,
      feature4Title,
      feature4Subtitle,
      ziniPayApiKey,
      ziniPayEndpoint,
      ziniPayVerifyEndpoint,
      ziniPayRedirectUrl,
      ziniPayCancelUrl,
      ziniPayWebhookUrl,
      ziniPayEnabled,
    });
    showToast('সমস্ত সেটিংস সফলভাবে সেভ করা হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner - Executive & Compact */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-zinc-900 text-white p-5 rounded-3xl shadow-lg border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600/30 text-red-400 rounded-xl border border-red-500/30 inline-flex">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </span>
            <h3 className="text-lg font-black tracking-tight">
              গ্লোবাল এডমিন সেটিংস ও ডাটা কন্ট্রোল হাব
            </h3>
          </div>
          <p className="text-xs text-gray-400">
            ওয়েবসাইটের ব্র্যান্ডিং, থিম কালার, পেমেন্ট নাম্বার, সিকিউরিটি পিন এবং ডাটা ক্লিয়ারিং টুলস
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>সেটিংস সেভ করুন</span>
        </button>
      </div>

      {/* Modern Compact Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-2xs">
        {[
          { id: 'cloud', label: 'ইমেইল ক্লাউড অটো-সেভ', icon: Globe, badge: 'Auto Sync' },
          { id: 'brand', label: 'ব্র্যান্ডিং ও থিম', icon: Palette, badge: null },
          { id: 'contact', label: 'কন্টাক্ট ও ডেলিভারি', icon: Phone, badge: null },
          { id: 'payment', label: 'পেমেন্ট ও গেটওয়ে', icon: CreditCard, badge: null },
          { id: 'security', label: 'সিকিউরিটি ও পিন', icon: Lock, badge: null },
          { id: 'delete', label: 'অল ডাটা ডিলিট বক্স', icon: Trash2, badge: 'Working Tool' },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* TAB 0: CLOUD AUTO-SAVE & EMAIL BACKUP */}
        {activeTab === 'cloud' && (
          <div className="space-y-5 animate-fade-in">
            {/* Cloud Auto-Save Status Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 text-emerald-300">
                    <Globe className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white flex items-center gap-2">
                      <span>এডমিন ইমেইল ক্লাউড অটো-সেভ ও অটো-রিস্টোর সিস্টেম</span>
                    </h4>
                    <p className="text-xs text-emerald-200/90 font-medium">
                      ওয়েবসাইটের সমস্ত প্রোডাক্ট, অর্ডার, থিম ও সেটিংস অটোমেটিক ক্লাউড ডাটাবেসে সেভ হচ্ছে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full self-start sm:self-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-black text-emerald-300">লাইভ সিন্ক সচল</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-emerald-200 font-bold mb-1">সংযুক্ত এডমিন ইমেইল</div>
                  <div className="font-mono font-black text-white text-sm truncate">{adminEmail || 'admin@litchibagan.com'}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-emerald-200 font-bold mb-1">সর্বশেষ অটো-সেভ সময়</div>
                  <div className="font-mono font-bold text-emerald-300">
                    {cloudSyncStatus.lastSyncedAt
                      ? new Date(cloudSyncStatus.lastSyncedAt).toLocaleString('bn-BD')
                      : 'স্বয়ংক্রিয়ভাবে সিন্ক হচ্ছে...'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-emerald-200 font-bold">ইনস্ট্যান্ট ম্যানুয়াল সিন্ক</div>
                    <div className="text-[10px] text-gray-300">১-ক্লিকে ক্লাউডে ব্যাকআপ জমা দিন</div>
                  </div>
                  <button
                    type="button"
                    disabled={cloudSyncStatus.isSyncing}
                    onClick={async () => {
                      const ok = await syncWithCloud(adminEmail);
                      if (ok) {
                        showToast('☁️ ক্লাউড সার্ভারে ব্যাকআপ সফলভাবে আপডেট হয়েছে!', 'success');
                      }
                    }}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus.isSyncing ? 'animate-spin' : ''}`} />
                    <span>{cloudSyncStatus.isSyncing ? 'সিন্ক হচ্ছে...' : 'সিন্ক করুন'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Restore Data on New Domain / Browser */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">নতুন ডোমেইন বা ব্রাউজারে ডাটা ব্যাকআপ রিস্টোর</h4>
                  <p className="text-gray-500 text-[11px]">
                    ডোমেইন রিমুভ/পরিবর্তন হলেও এডমিন ইমেইল লিখে ১-ক্লিকে সম্পূর্ণ ডাটা (প্রোডাক্ট, অর্ডার, সেটিংস) রিস্টোর করুন।
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                <div className="flex-1 w-full">
                  <label className="block font-bold text-gray-700 mb-1">ব্যাকআপ রিস্টোর এডমিন ইমেইল</label>
                  <input
                    type="email"
                    value={restoreEmailInput || adminEmail}
                    onChange={(e) => setRestoreEmailInput(e.target.value)}
                    placeholder="admin@litchibagan.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  disabled={cloudSyncStatus.isSyncing}
                  onClick={async () => {
                    const emailToRestore = restoreEmailInput || adminEmail;
                    const ok = await restoreFromCloud(emailToRestore);
                    if (ok) {
                      showToast(`☁️ '${emailToRestore}' ব্যাকআপ থেকে সকল ডাটা রিস্টোর করা হয়েছে!`, 'success');
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 self-end"
                >
                  <RefreshCw className={`w-4 h-4 ${cloudSyncStatus.isSyncing ? 'animate-spin' : ''}`} />
                  <span>ইমেইল ব্যাকআপ রিস্টোর করুন</span>
                </button>
              </div>
            </div>

            {/* Offline JSON Export / Import Backup */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>ম্যানুয়াল JSON ফাইল এক্সপোর্ট ও ইমপোর্ট ব্যাকআপ</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                  <div className="font-bold text-purple-900 text-xs">ব্যাকআপ ফাইল ডাউনলোড (JSON Export)</div>
                  <p className="text-[11px] text-gray-600">
                    কম্পিউটার বা মোবাইলে ওয়েবসাইটের সমস্ত ডাটার একটি অফলাইন JSON কপি সেভ করে রাখুন।
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(useStore(), null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `litchi_bazaar_backup_${new Date().toISOString().slice(0, 10)}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('💾 ব্যাকআপ JSON ফাইল ডাউনলোড হয়েছে!', 'success');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 rotate-180" />
                    <span>ডাউনলোড JSON ব্যাকআপ</span>
                  </button>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
                  <div className="font-bold text-amber-900 text-xs">ব্যাকআপ ফাইল ইমপোর্ট (JSON Import)</div>
                  <p className="text-[11px] text-gray-600">
                    পূর্বে ডাউনলোড করা JSON ব্যাকআপ ফাইল সিলেক্ট করে ওয়েবসাইট রিস্টোর করুন।
                  </p>
                  <label className="inline-flex px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl items-center gap-1.5 cursor-pointer shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>JSON ব্যাকআপ ফাইল আপলোড</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const parsed = JSON.parse(event.target?.result as string);
                              if (parsed) {
                                showToast('JSON ফাইল লোড হয়েছে! পেজ রিফ্রেশ দিলে আপডেট পাওয়া যাবে।', 'success');
                              }
                            } catch {
                              showToast('অবৈধ JSON ব্যাকআপ ফাইল!', 'error');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BRANDING & THEME */}
        {activeTab === 'brand' && (
          <div className="space-y-5 animate-fade-in">
            {/* Site Name & Announcement */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-red-600" />
                <span>ব্র্যান্ড ও টাইটেল সেটিংস</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">ওয়েবসাইটের নাম (Site Name)</label>
                  <input
                    type="text"
                    required
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">ট্যাগলাইন (Tagline)</label>
                  <input
                    type="text"
                    value={siteTagline}
                    onChange={(e) => setSiteTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">শীর্ষ ঘোষণা বার (Top Announcement Text)</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              {/* Trust Section Editor ("কেন আমাদের লিচু সবার সেরা?") */}
              <div className="pt-3 border-t border-gray-100 space-y-3 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-gray-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <span>গ্রাহক বিশ্বাস ও ট্রাস্ট সেকশন হেডার এডিটর ("কেন আমাদের লিচু সবার সেরা?")</span>
                  </h5>
                  <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full">
                    Auto-Save On Save Button
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ব্যাজ লেবেল (Badge Text)</label>
                    <input
                      type="text"
                      value={whyChooseBadge}
                      onChange={(e) => setWhyChooseBadge(e.target.value)}
                      placeholder="যেমন: গ্রাহকদের মতামত"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 font-bold text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">প্রধান শিরোনাম (Section Title)</label>
                    <input
                      type="text"
                      value={whyChooseTitle}
                      onChange={(e) => setWhyChooseTitle(e.target.value)}
                      placeholder="যেমন: কেন আমাদের লিচু সবার সেরা?"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 font-black text-xs text-red-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">সাব-টাইটেল / বিবরণ (Section Subtitle)</label>
                  <textarea
                    rows={2}
                    value={whyChooseSubtitle}
                    onChange={(e) => setWhyChooseSubtitle(e.target.value)}
                    placeholder="যেমন: বিগত ৫ বছর ধরে আমরা ১০,০০০+ সন্তুষ্ট গ্রাহকের দরজায় খাঁটি ও রসালো দিনাজপুরী লিচু পৌঁছে দিয়েছি।"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 font-medium text-xs leading-relaxed"
                  />
                </div>

                {/* 3 Featured Customer Testimonials Form */}
                <div className="pt-2 border-t border-red-100 space-y-3">
                  <h6 className="font-extrabold text-xs text-gray-800">হোমপেজ ট্রাস্ট কার্ড ৩টি গ্রাহক রিভিউ এডিটর:</h6>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Card 1 */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                      <span className="text-[11px] font-black text-red-600 block">১ম রিভিউ কার্ড</span>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">গ্রাহকের নাম ও ঠিকানা</label>
                        <input
                          type="text"
                          value={testimonial1Author}
                          onChange={(e) => setTestimonial1Author(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">রিভিউ কমেন্ট</label>
                        <textarea
                          rows={2}
                          value={testimonial1Text}
                          onChange={(e) => setTestimonial1Text(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                      <span className="text-[11px] font-black text-red-600 block">২য় রিভিউ কার্ড</span>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">গ্রাহকের নাম ও ঠিকানা</label>
                        <input
                          type="text"
                          value={testimonial2Author}
                          onChange={(e) => setTestimonial2Author(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">রিভিউ কমেন্ট</label>
                        <textarea
                          rows={2}
                          value={testimonial2Text}
                          onChange={(e) => setTestimonial2Text(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                      <span className="text-[11px] font-black text-red-600 block">৩য় রিভিউ কার্ড</span>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">গ্রাহকের নাম ও ঠিকানা</label>
                        <input
                          type="text"
                          value={testimonial3Author}
                          onChange={(e) => setTestimonial3Author(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">রিভিউ কমেন্ট</label>
                        <textarea
                          rows={2}
                          value={testimonial3Text}
                          onChange={(e) => setTestimonial3Text(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Banner 4 Feature Badges Editor */}
                <div className="pt-3 border-t border-red-100 space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <h6 className="font-extrabold text-xs text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>হিরো ব্যানার ৪টি সার্ভিস ফিচার কার্ড টেক্সট এডিটর (Hero Feature Badges)</span>
                    </h6>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded-full">
                      Live Editable
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Badge 1 */}
                    <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black text-red-600">
                        <ShieldCheck className="w-4 h-4 text-red-500" />
                        <span>১ম ফিচার কার্ড</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">প্রধান শিরোনাম (Title)</label>
                        <input
                          type="text"
                          value={feature1Title}
                          onChange={(e) => setFeature1Title(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">উপ-শিরোনাম (Subtitle)</label>
                        <input
                          type="text"
                          value={feature1Subtitle}
                          onChange={(e) => setFeature1Subtitle(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Badge 2 */}
                    <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                        <Award className="w-4 h-4 text-emerald-500" />
                        <span>২য় ফিচার কার্ড</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">প্রধান শিরোনাম (Title)</label>
                        <input
                          type="text"
                          value={feature2Title}
                          onChange={(e) => setFeature2Title(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">উপ-শিরোনাম (Subtitle)</label>
                        <input
                          type="text"
                          value={feature2Subtitle}
                          onChange={(e) => setFeature2Subtitle(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Badge 3 */}
                    <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-600">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>৩য় ফিচার কার্ড</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">প্রধান শিরোনাম (Title)</label>
                        <input
                          type="text"
                          value={feature3Title}
                          onChange={(e) => setFeature3Title(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">উপ-শিরোনাম (Subtitle)</label>
                        <input
                          type="text"
                          value={feature3Subtitle}
                          onChange={(e) => setFeature3Subtitle(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Badge 4 */}
                    <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black text-rose-600">
                        <Sparkles className="w-4 h-4 text-rose-500" />
                        <span>৪র্থ ফিচার কার্ড</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">প্রধান শিরোনাম (Title)</label>
                        <input
                          type="text"
                          value={feature4Title}
                          onChange={(e) => setFeature4Title(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">উপ-শিরোনাম (Subtitle)</label>
                        <input
                          type="text"
                          value={feature4Subtitle}
                          onChange={(e) => setFeature4Subtitle(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="block font-bold text-gray-800">ওয়েবসাইট লোগো ছবি (Logo Upload & Remove)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  {siteLogoImage ? (
                    <div className="relative group w-20 h-20 bg-white rounded-2xl border border-gray-300 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                      <img src={siteLogoImage} alt="Site Logo" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors"
                        title="লোগো রিমুভ করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0">
                      <Image className="w-6 h-6 mb-1 text-gray-400" />
                      <span className="text-[9px] font-bold">নো লোগো</span>
                    </div>
                  )}

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 bg-white border border-gray-300 hover:border-red-500 rounded-xl cursor-pointer text-xs font-bold text-gray-700 hover:text-red-600 transition-colors shadow-2xs inline-flex items-center gap-2">
                        <Upload className="w-4 h-4 text-red-600" />
                        <span>ডিভাইস থেকে লোগো আপলোড</span>
                        <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                      </label>
                      {siteLogoImage && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>লোগো মুছে ফেলুন</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={siteLogoImage}
                      onChange={(e) => setSiteLogoImage(e.target.value)}
                      placeholder="অথবা সরাসরি লোগো ছবির ইমেজ লিঙ্ক (URL) দিন..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Color System */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>ওয়েবসাইট থিম কালার সিস্টেম (Website Theme Color)</span>
                </div>
                <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                  লাইভ কালার চেঞ্জার
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setPrimaryTheme(t.id);
                      applyTheme(t.id, customHexColor);
                      updateSettings({ primaryTheme: t.id, customHexColor });
                      showToast(`থিম কালার '${t.nameBn}' হিসেবে সেভ ও আপডেট হয়েছে!`, 'success');
                    }}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      primaryTheme === t.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500 shadow-md bg-emerald-50/50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: t.primary }}
                    >
                      {primaryTheme === t.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-gray-900 truncate">{t.nameBn.split(' ')[0]}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{t.primary}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50 p-3.5 rounded-2xl">
                <div>
                  <label className="font-bold text-gray-800">কাস্টম কালার সিলেক্ট করুন (Custom Hex Code)</label>
                  <p className="text-[11px] text-gray-500">পছন্দমতো ইউনিক কালার কোড বেছে দিন (স্বয়ংক্রিয়ভাবে সেভ হবে)</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="color"
                    value={customHexColor}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setCustomHexColor(hex);
                      setPrimaryTheme('custom');
                      applyTheme('custom', hex);
                      updateSettings({ primaryTheme: 'custom', customHexColor: hex });
                    }}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-gray-300 p-0.5 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={customHexColor}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setCustomHexColor(hex);
                      setPrimaryTheme('custom');
                      if (hex.length >= 4) {
                        applyTheme('custom', hex);
                        updateSettings({ primaryTheme: 'custom', customHexColor: hex });
                      }
                    }}
                    className="w-full sm:w-32 px-3 py-2 font-mono text-xs border border-gray-300 rounded-xl font-bold bg-white"
                    placeholder="#dc2626"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT & DELIVERY */}
        {activeTab === 'contact' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>যোগাযোগ ও কাস্টমার হেল্পলাইন</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">প্রাইমারি ফোন নম্বর (Hotline)</label>
                  <input
                    type="text"
                    value={phonePrimary}
                    onChange={(e) => setPhonePrimary(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">হোয়াটসঅ্যাপ (WhatsApp Number)</label>
                  <input
                    type="text"
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">অফিস / বাগান ঠিকানা</label>
                  <input
                    type="text"
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">অ্যাডমিন ইমেইল (Auto Notification Alert Email)</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="makkum059@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-300 rounded-2xl font-bold text-amber-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    * নতুন প্রতিটি কাস্টমার অর্ডারের অটো ইমেইল নোটিফিকেশন এই ঠিকানায় চলে যাবে।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/80 p-5 rounded-3xl border border-emerald-200 shadow-2xs space-y-2">
              <h4 className="font-black text-emerald-950 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>ডেলিভারি চার্জ সিস্টেম (Free Delivery Enabled)</span>
              </h4>
              <p className="text-xs font-bold text-emerald-800">
                ✅ সারা দেশে কাস্টমার ও অ্যাডমিন উভয় প্যানেলেই ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (৳০) করা হয়েছে।
              </p>
            </div>

            {/* Social Media Links Dashboard Manager */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span>সোশ্যাল মিডিয়া সিস্টেম লিঙ্ক ম্যানেজার (Social Media Links)</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>সোশ্যাল লিঙ্ক যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {socialLinks.map((soc) => (
                  <div key={soc.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between gap-2 border-b border-gray-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-2xs transition-colors"
                          style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                        >
                          <SocialIcon platform={soc.platform} size={16} />
                        </div>
                        <span className="font-bold text-gray-900 text-xs">{soc.title || soc.platform}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                          <input
                            type="checkbox"
                            checked={soc.isActive}
                            onChange={(e) =>
                              setSocialLinks(
                                socialLinks.map((item) => (item.id === soc.id ? { ...item, isActive: e.target.checked } : item))
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span>{soc.isActive ? 'একটিভ' : 'ইন-একটিভ'}</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(soc.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">প্ল্যাটফর্ম (Platform):</label>
                        <select
                          value={soc.platform}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((item) => (item.id === soc.id ? { ...item, platform: e.target.value as any } : item))
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="telegram">Telegram</option>
                          <option value="youtube">YouTube</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">Twitter / X</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">টাইটেল (Title):</label>
                        <input
                          type="text"
                          value={soc.title}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((item) => (item.id === soc.id ? { ...item, title: e.target.value } : item))
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">ইউআরএল (URL):</label>
                        <input
                          type="url"
                          value={soc.url}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((item) => (item.id === soc.id ? { ...item, url: e.target.value } : item))
                            )
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & GATEWAY */}
        {activeTab === 'payment' && (
          <div className="space-y-5 animate-fade-in">
            {/* Custom Payment Methods */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>কাস্টম পেমেন্ট মেথড (Custom Payment Methods & QR)</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddPaymentMethod}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>পেমেন্ট মেথড যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {customPaymentMethods.map((pm, index) => (
                  <div key={pm.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <span className="font-bold text-gray-800">{pm.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePaymentMethod(pm.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">পেমেন্ট মেথড নাম:</label>
                        <input
                          type="text"
                          value={pm.name}
                          onChange={(e) =>
                            setCustomPaymentMethods(
                              customPaymentMethods.map((item) => (item.id === pm.id ? { ...item, name: e.target.value } : item))
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">একাউন্ট টাইপ:</label>
                        <select
                          value={pm.accountType || 'Personal'}
                          onChange={(e) =>
                            setCustomPaymentMethods(
                              customPaymentMethods.map((item) => (item.id === pm.id ? { ...item, accountType: e.target.value } : item))
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                        >
                          <option value="Personal">Personal (পার্সোনাল)</option>
                          <option value="Agent">Agent (এজেন্ট)</option>
                          <option value="Merchant">Merchant (মার্চেন্ট)</option>
                          <option value="Bank">Bank Account (ব্যাংক)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">একাউন্ট নম্বর:</label>
                        <input
                          type="text"
                          value={pm.accountNumber}
                          onChange={(e) =>
                            setCustomPaymentMethods(
                              customPaymentMethods.map((item) => (item.id === pm.id ? { ...item, accountNumber: e.target.value } : item))
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Image Upload Row: Payment Icon/Logo + QR Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200/60">
                      {/* 1. Payment Icon / Logo Upload */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                        <label className="block text-[11px] font-bold text-gray-700 flex items-center justify-between">
                          <span>পেমেন্ট আইকন/লোগো (Payment Logo):</span>
                          {pm.logoImage && (
                            <button
                              type="button"
                              onClick={() => handleRemovePaymentLogo(pm.id)}
                              className="text-red-600 hover:text-red-800 text-[10px] font-black underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>রিমুভ আইকন</span>
                            </button>
                          )}
                        </label>
                        <div className="flex items-center gap-2">
                          {pm.logoImage ? (
                            <img
                              src={pm.logoImage}
                              alt={pm.name}
                              className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-gray-50 p-1 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                              No Icon
                            </div>
                          )}
                          <label className="flex-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl py-1.5 px-2 text-center text-xs font-bold transition-colors flex items-center justify-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>লোগো আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePaymentLogoUpload(pm.id, e)}
                            />
                          </label>
                        </div>
                      </div>

                      {/* 2. QR Code Image Upload */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                        <label className="block text-[11px] font-bold text-gray-700 flex items-center justify-between">
                          <span>পেমেন্ট QR কোড ছবি (QR Code Image):</span>
                          {pm.qrCodeImage && (
                            <button
                              type="button"
                              onClick={() => handleRemovePaymentQr(pm.id)}
                              className="text-red-600 hover:text-red-800 text-[10px] font-black underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>রিমুভ QR</span>
                            </button>
                          )}
                        </label>
                        <div className="flex items-center gap-2">
                          {pm.qrCodeImage ? (
                            <img
                              src={pm.qrCodeImage}
                              alt={`${pm.name} QR`}
                              className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-gray-50 p-1 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                              No QR
                            </div>
                          )}
                          <label className="flex-1 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl py-1.5 px-2 text-center text-xs font-bold transition-colors flex items-center justify-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>QR কোড আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePaymentQrUpload(pm.id, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                <span>অ্যাডমিন অ্যাক্সেস সিকিউরিটি ও পিন</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    অ্যাডমিন ইমেইল (Admin Authorized Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-mono font-bold text-gray-900 text-xs focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">অ্যাডমিন সিকিউরিটি পিন (Admin PIN)</label>
                  <input
                    type="text"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-mono font-bold tracking-widest text-center text-xs focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WORKING ADMIN ALL DELETE BOX (ওয়েবসাইট অল ডাটা ডিলিট ও রিমুভ মাস্টার বক্স) */}
        {activeTab === 'delete' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-gradient-to-br from-white via-red-50/40 to-rose-50/50 p-6 rounded-3xl border-2 border-red-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-600 text-white rounded-2xl shadow-md">
                    <Trash2 className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-900 flex items-center gap-2">
                      <span>ওয়েবসাইট অল ডাটা ডিলিট ও রিমুভ মাস্টার বক্স</span>
                    </h4>
                    <p className="text-xs text-gray-600 font-medium">
                      যে কোনো সেকশনের ডাটা বা সম্পূর্ণ ওয়েবসাইট ডাটা ১-ক্লিকে স্থায়ীভাবে মুছে ফেলতে বা রিস্টোর করতে পারবেন।
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-300 flex items-center gap-1.5 self-start sm:self-center shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>অ্যাডমিন ডাটা ইরেজার টুলস</span>
                </span>
              </div>

              {/* Grid of Working Delete Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Delete Products */}
                <div className="bg-white p-4 rounded-2xl border-2 border-red-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-red-400 transition-colors">
                  <div>
                    <h5 className="font-black text-gray-900 text-xs flex items-center gap-2">
                      <Tag className="w-4 h-4 text-red-600" />
                      <span>প্রোডাক্ট ডিলিট বক্স</span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                      স্টোরের সমস্ত প্রোডাক্ট ও ক্যাটালগ আইটেম মুছে ফেলুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllProducts();
                      showToast('স্টোরের সমস্ত প্রোডাক্ট মুছে ফাকা করা হয়েছে!', 'info');
                    }}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব প্রোডাক্ট ১-ক্লিকে মুছুন</span>
                  </button>
                </div>

                {/* Delete Orders */}
                <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-amber-400 transition-colors">
                  <div>
                    <h5 className="font-black text-gray-900 text-xs flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>অর্ডার হিস্টোরি ডিলিট</span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                      গ্রাহকদের জমা পড়া সকল অর্ডার হিস্টোরি মুছুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllOrders();
                      showToast('সকল অর্ডার হিস্টোরি মুছে ফেলা হয়েছে!', 'info');
                    }}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব অর্ডার ১-ক্লিকে মুছুন</span>
                  </button>
                </div>

                {/* Delete Categories */}
                <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-400 transition-colors">
                  <div>
                    <h5 className="font-black text-gray-900 text-xs flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>ক্যাটাগরি ক্যাটালগ ডিলিট</span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                      স্টোরের সকল ক্যাটাগরি ক্যাটালগ মুছে ফেলুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllCategories();
                      showToast('সকল ক্যাটাগরি মুছে ফেলা হয়েছে!', 'info');
                    }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব ক্যাটাগরি ১-ক্লিকে মুছুন</span>
                  </button>
                </div>

                {/* Delete Banners */}
                <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-sky-400 transition-colors">
                  <div>
                    <h5 className="font-black text-gray-900 text-xs flex items-center gap-2">
                      <Image className="w-4 h-4 text-sky-600" />
                      <span>হোম ব্যানার ডিলিট</span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                      ওয়েবসাইটের সকল হোম স্লাইডার ব্যানার মুছুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllBanners();
                      showToast('সকল ব্যানার মুছে ফেলা হয়েছে!', 'info');
                    }}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব ব্যানার ১-ক্লিকে মুছুন</span>
                  </button>
                </div>

                {/* Delete Promo Codes */}
                <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-emerald-400 transition-colors">
                  <div>
                    <h5 className="font-black text-gray-900 text-xs flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>কুপন প্রমো কোড ডিলিট</span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                      স্টোরের সকল ডিসকাউন্ট কুপন মুছে ফেলুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllPromos();
                      showToast('সকল কুপন প্রমো কোড মুছে ফেলা হয়েছে!', 'info');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব প্রমো কোড ১-ক্লিকে মুছুন</span>
                  </button>
                </div>

                {/* Clear All Custom Data (Complete Wipe) */}
                <div className="bg-gradient-to-br from-rose-50 to-red-100 p-4 rounded-2xl border-2 border-dashed border-red-300 shadow-2xs flex flex-col justify-between space-y-3">
                  <div>
                    <h5 className="font-black text-red-950 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                      <span>ওয়েবসাইট অল ডাটা ডিলিট</span>
                    </h5>
                    <p className="text-[11px] text-red-800 mt-1 font-bold">
                      ওয়েবসাইটের অল কাস্টম ডাটা ১ ক্লিকে ফাকা করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllData();
                      showToast('ওয়েবসাইটের সমস্ত ডাটা সফলভাবে মুছে ফাকা করা হয়েছে!', 'success');
                    }}
                    className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 ring-2 ring-red-400"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>অল ডাটা ১-ক্লিকে ডিলিট করুন</span>
                  </button>
                </div>
              </div>

              {/* Restore Defaults Bar */}
              <div className="pt-4 border-t border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 p-4 rounded-2xl border border-red-100">
                <div>
                  <h6 className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-gray-700" />
                    <span>নমুনা ডাটা পুনরায় রিস্টোর করার অপশন</span>
                  </h6>
                  <p className="text-[11px] text-gray-500 font-medium">
                    ভুলবশত বা টেস্ট করার পর স্টোরকে পূর্বের মতো অরিজিনাল ডাটা দিয়ে সাজাতে চান?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('ডিফল্ট নমুনা ডেটা (দিনাজপুর ও রাজশাহী লিচু) পুনরায় রিস্টোর করতে চান?')) {
                      resetToDefaults();
                      showToast('ডিফল্ট নমুনা ডাটা সফলভাবে রিস্টোর হয়েছে!', 'success');
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>নমুনা ডাটা রিস্টোর</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Floating Save Changes Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500 font-bold">
            সকল ফিল্ড পরিবর্তন করার পর "সেটিংস সেভ করুন" বাটনে ক্লিক করুন।
          </span>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সেভ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
