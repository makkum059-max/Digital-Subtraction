import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Banner } from '../../types';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Upload,
  Image as ImageIcon,
  Info,
  Save,
  Wand2,
  Tag,
  ShoppingBag,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const BannersManager: React.FC = () => {
  const { banners, categories, products, addBanner, updateBanner, deleteBanner, updateCategory, showToast } =
    useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');
  const [bgGradient, setBgGradient] = useState('from-rose-900 via-red-800 to-emerald-950');
  const [buttonText, setButtonText] = useState('এখনই অর্ডার করুন');
  const [buttonLinkCategory, setButtonLinkCategory] = useState('dinajpur');
  const [isActive, setIsActive] = useState(true);

  // One Box Product & Category Auto Save Box state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || 'dinajpur');
  const [customCatNameBn, setCustomCatNameBn] = useState<string>(categories[0]?.nameBn || '');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('ফাইল সাইজ সর্বোচ্চ 5MB হতে পারবে!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          showToast('ব্যনার ইমেজ সফলভাবে আপলোড হয়েছে!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBannerImage = () => {
    setImage('');
  };

  const GRADIENTS = [
    { label: 'রেড ও এমেরাল্ড (Classic Red)', value: 'from-rose-900 via-red-800 to-emerald-950' },
    { label: 'রয়্যাল রেড ও এম্বার (Royal Gold)', value: 'from-red-950 via-rose-900 to-amber-900' },
    { label: 'ডার্ক গ্রেডিয়েন্ট (Dark Luxury)', value: 'from-gray-950 via-red-950 to-gray-900' },
  ];

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('দিনাজপুরের আসল রসালো লিচু');
    setSubtitle('সরাসরি বাগান থেকে কোনো কেমিক্যাল ছাড়া ১০০% খাঁটি লিচু সংগৃহীত।');
    setBadge('অর্গ্যানিক স্পেশাল অফার');
    setImage('https://images.unsplash.com/photo-1528821128474-27f963b077fe?auto=format&fit=crop&q=80&w=1200');
    setBgGradient(GRADIENTS[0].value);
    setButtonText('এখনই কিনুন');
    setButtonLinkCategory('dinajpur');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setBadge(b.badge);
    setImage(b.image);
    setBgGradient(b.bgGradient || GRADIENTS[0].value);
    setButtonText(b.buttonText);
    setButtonLinkCategory(b.buttonLinkCategory || 'dinajpur');
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleSaveOneBoxProductCat = () => {
    if (selectedCatId && customCatNameBn.trim()) {
      const cat = categories.find((c) => c.id === selectedCatId);
      updateCategory(selectedCatId, {
        nameBn: customCatNameBn.trim(),
        nameEn: cat?.nameEn || customCatNameBn.trim(),
      });
      setSavedSuccessMsg(`ক্যাটাগরি '${customCatNameBn}' ও প্রোডাক্ট লিংক সেভ হয়েছে!`);
      showToast('প্রোডাক্ট ও ক্যাটাগরি নাম সফলভাবে সেভ করা হয়েছে!', 'success');
      setTimeout(() => setSavedSuccessMsg(null), 3500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(editingBanner.id, {
        title,
        subtitle,
        badge,
        image,
        bgGradient,
        buttonText,
        buttonLinkCategory,
        isActive,
      });
      showToast('ব্যনার স্লাইডার আপডেট ও সেভ হয়েছে!', 'success');
    } else {
      addBanner({
        title,
        subtitle,
        badge,
        image,
        bgGradient,
        buttonText,
        buttonLinkCategory,
        isActive,
      });
      showToast('নতুন ব্যনার স্লাইডার যোগ ও সেভ হয়েছে!', 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 backdrop-blur-md rounded-xl inline-flex">
              <Wand2 className="w-5 h-5 text-amber-300 animate-pulse" />
            </span>
            <h3 className="text-xl font-black tracking-tight">
              হোমপেজ ব্যানার ও কভার স্লাইডার ম্যানেজার
            </h3>
          </div>
          <p className="text-xs text-red-100 max-w-xl">
            ওয়েবসাইটের স্লাইডার ব্যানার, প্রধান হেডার কভার, প্রোমোশনাল লোগো এবং লিঙ্কযুক্ত ক্যাটাগরি ও পণ্য নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-red-700 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-red-600" />
            <span>নতুন ব্যানার যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Upload Guidelines Box Card */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white p-5 rounded-3xl border border-gray-800 shadow-md space-y-3">
        <div className="flex items-center gap-2.5 border-b border-gray-800 pb-2.5">
          <div className="p-2 bg-red-600/30 text-red-400 rounded-xl border border-red-500/30">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-gray-100">
              Admin Banner Size & Upload Guidelines
            </h4>
            <p className="text-xs text-gray-400">
              হাই-কোয়ালিটি ব্যানার প্রদর্শনের জন্য নিম্নে নির্দেশাবলী অনুসরণ করুন:
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <li className="bg-gray-800/80 p-3 rounded-2xl border border-gray-700/60 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
            <div>
              <strong className="block text-gray-200">Supported Formats:</strong>
              <span className="text-gray-400 text-[11px]">JPG, PNG, GIF, WebP</span>
            </div>
          </li>

          <li className="bg-gray-800/80 p-3 rounded-2xl border border-gray-700/60 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
            <div>
              <strong className="block text-gray-200">Recommended Size:</strong>
              <span className="text-amber-300 font-mono font-bold text-[11px]">1920 x 900 pixels</span>
            </div>
          </li>

          <li className="bg-gray-800/80 p-3 rounded-2xl border border-gray-700/60 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
            <div>
              <strong className="block text-gray-200">Maximum File Size:</strong>
              <span className="text-gray-400 text-[11px]">5MB per image</span>
            </div>
          </li>

          <li className="bg-gray-800/80 p-3 rounded-2xl border border-gray-700/60 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
            <div>
              <strong className="block text-gray-200">Upload Action:</strong>
              <span className="text-gray-400 text-[11px]">Click the plus (+) button to upload images</span>
            </div>
          </li>
        </ul>
      </div>

      {/* ONE BOX PRODUCT & CATEGORY SELECT & SAVE TOOL */}
      <div className="bg-gradient-to-br from-white via-red-50/30 to-amber-50/40 p-5 rounded-3xl border-2 border-red-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-red-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-red-600 to-amber-500 text-white rounded-2xl shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                <span>⚡ ওয়ান বক্স প্রোডাক্ট সিলেক্ট ও ক্যাটাগরি নেম সেভ টুলস</span>
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                প্রোডাক্ট লিংক ও ক্যাটাগরির নাম ১-ক্লিকে সিলেক্ট ও সেভ করুন
              </p>
            </div>
          </div>

          {savedSuccessMsg ? (
            <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1.5 shrink-0 shadow-2xs animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{savedSuccessMsg}</span>
            </span>
          ) : (
            <span className="text-[11px] font-extrabold bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1 shrink-0">
              <span>অটো ক্যাটাগরি সিঙ্ক লিঙ্ক</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select Product */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
              <span>প্রোডাক্ট সিলেক্ট করুন:</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) {
                  setSelectedCatId(prod.category);
                  const cat = categories.find((c) => c.id === prod.category);
                  if (cat) setCustomCatNameBn(cat.nameBn);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-red-200 rounded-2xl font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameBn} (৳{p.price})
                </option>
              ))}
            </select>
          </div>

          {/* Select Target Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>টার্গেট ক্যাটাগরি সিলেক্ট করুন:</span>
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => {
                setSelectedCatId(e.target.value);
                const cat = categories.find((c) => c.id === e.target.value);
                if (cat) setCustomCatNameBn(cat.nameBn);
              }}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-red-200 rounded-2xl font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameBn} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Category Name & Save Button */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-red-600" />
              <span>ক্যাটাগরি কাস্টম নাম ও সেভ বাটন:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCatNameBn}
                onChange={(e) => setCustomCatNameBn(e.target.value)}
                placeholder="ক্যাটাগরি নাম লিখুন..."
                className="flex-1 px-3.5 py-2.5 bg-white border-2 border-red-200 rounded-2xl font-black text-xs text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleSaveOneBoxProductCat}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List of Active Banner Slides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-red-600" />
            <span>হোমপেজ সক্রিয় স্লাইডার তালিকা ({banners.length} টি)</span>
          </h4>
          <span className="text-xs text-gray-500 font-bold bg-white px-3 py-1 rounded-xl border border-gray-200">
            অটো স্লাইড একটিভ
          </span>
        </div>

        {banners.map((b) => (
          <div
            key={b.id}
            className={`relative rounded-3xl overflow-hidden border p-5 shadow-sm transition-all ${
              b.isActive ? 'border-gray-200 hover:border-red-300' : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Banner Background Image & Overlay Preview */}
            <div className="absolute inset-0 z-0">
              {b.image ? (
                <>
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/80 to-gray-900/40"></div>
                </>
              ) : (
                <div className={`w-full h-full bg-gradient-to-r ${b.bgGradient || 'from-rose-950 via-red-900 to-amber-950'}`}></div>
              )}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-red-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                    {b.badge || 'অফার ব্যানার'}
                  </span>
                  {b.isActive ? (
                    <span className="bg-emerald-500/80 text-white font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                      ● ওয়েবসাইট লাইভ
                    </span>
                  ) : (
                    <span className="bg-gray-800 text-gray-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-gray-700">
                      ○ নিষ্ক্রিয়
                    </span>
                  )}
                </div>
                <h4 className="font-black text-white text-base sm:text-lg tracking-tight leading-snug drop-shadow-md">{b.title}</h4>
                <p className="text-xs text-rose-100/90 line-clamp-2">{b.subtitle}</p>
                <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-amber-300">
                  <span>বাটন: "{b.buttonText || 'অর্ডার করুন'}"</span>
                  <span>•</span>
                  <span>ক্যাটাগরি: {b.buttonLinkCategory === 'all' ? 'সকল পণ্য' : categories.find(c => c.id === b.buttonLinkCategory)?.nameBn || b.buttonLinkCategory}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <button
                  onClick={() => {
                    updateBanner(b.id, { isActive: !b.isActive });
                    showToast(
                      `ব্যানারটি ${!b.isActive ? 'সক্রিয়' : 'বন্ধ'} করা হয়েছে!`,
                      'info'
                    );
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    b.isActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {b.isActive ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{b.isActive ? 'সক্রিয়' : 'বন্ধ'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1 border border-white/20 shadow-md"
                  title="সম্পাদনা করুন"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>

                <button
                  onClick={() => {
                    deleteBanner(b.id);
                    showToast('ব্যনার স্লাইডার মুছে ফেলা হয়েছে!', 'info');
                  }}
                  className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-bold transition-all text-xs cursor-pointer border border-red-400/30 shadow-md"
                  title="১-ক্লিকে মুছে ফেলুন (Instant Delete)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-100 animate-slide-up my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-600" />
              <span>{editingBanner ? 'ব্যনার স্লাইডার কাস্টমাইজ করুন' : 'নতুন স্লাইড ব্যনার যোগ করুন'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">অফার ব্যাজ (Badge Text)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="যেমন: ১০০% কেমিক্যাল মুক্ত"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">প্রধান শিরোনাম (Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: ফ্রেশ ও মিষ্টি লিচু"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none font-black"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">উপ-শিরোনাম (Subtitle)</label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Banner Image Upload & Plus Button Section */}
              <div className="space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-800">
                    ব্যানার ব্যাকগ্রাউন্ড পিকচার (Banner Image)
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveBannerImage}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>রিমুভ করুন</span>
                    </button>
                  )}
                </div>

                {image ? (
                  <div className="relative group w-full h-28 bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
                    <img src={image} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveBannerImage}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ব্যানার রিমুভ করুন</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white">
                    <ImageIcon className="w-6 h-6 stroke-1 text-gray-300 mb-1" />
                    <span className="text-[11px] font-bold">কোনো ব্যানার ছবি সিলেক্ট করা নেই</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer text-xs font-black transition-all shadow-md active:scale-95">
                    <Plus className="w-4 h-4 text-white font-bold" />
                    <Upload className="w-4 h-4 text-white" />
                    <span>ছবি আপলোড করতে (+) বাটন টিপুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="অথবা ছবি URL লিঙ্ক দিন..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">বাটন ক্যাটাগরি লিঙ্ক</label>
                  <select
                    value={buttonLinkCategory}
                    onChange={(e) => setButtonLinkCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="all">সকল পণ্য</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ব্যনার ব্যাকগ্রাউন্ড কালার থিম</label>
                <select
                  value={bgGradient}
                  onChange={(e) => setBgGradient(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none cursor-pointer"
                >
                  {GRADIENTS.map((g, idx) => (
                    <option key={idx} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>ব্যানারটি সক্রিয় (Active) থাকবে</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
