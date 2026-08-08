import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import {
  Plus,
  Edit3,
  Trash2,
  Layers,
  X,
  Wand2,
  Sparkles,
  CheckCircle2,
  Tag,
  Save,
  RotateCcw,
} from 'lucide-react';

export const CategoriesManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');

  // Auto-customize Master Box states
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || 'dinajpur');
  const [customNameBn, setCustomNameBn] = useState<string>(categories[0]?.nameBn || '');
  const [customNameEn, setCustomNameEn] = useState<string>(categories[0]?.nameEn || '');
  const [savedBadgeCatId, setSavedBadgeCatId] = useState<string | null>(null);

  // Sync Master Box input when category selection changes
  const handleSelectCat = (catId: string) => {
    setSelectedCatId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      setCustomNameBn(cat.nameBn);
      setCustomNameEn(cat.nameEn);
    }
  };

  const handleApplyAutoCustomize = () => {
    if (!selectedCatId || !customNameBn.trim()) return;
    updateCategory(selectedCatId, {
      nameBn: customNameBn.trim(),
      nameEn: customNameEn.trim() || customNameBn.trim(),
    });
    setSavedBadgeCatId(selectedCatId);
    showToast(`'${customNameBn}' অটো কাস্টমাইজ ও সেভ করা হয়েছে!`, 'success');
    setTimeout(() => setSavedBadgeCatId(null), 3000);
  };

  const handleInlineAutoSave = (id: string, updatedBn: string, updatedEn: string) => {
    updateCategory(id, { nameBn: updatedBn, nameEn: updatedEn });
    setSavedBadgeCatId(id);
    showToast('অটো সেভ হয়েছে!', 'success');
    setTimeout(() => setSavedBadgeCatId(null), 2500);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setNameBn('নতুন কাস্টম ক্যাটাগরি');
    setNameEn('New Custom Category');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setNameBn(c.nameBn);
    setNameEn(c.nameEn);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, { nameBn, nameEn });
      showToast('ক্যাটাগরি সফলভাবে আপডেট ও সেভ হয়েছে!', 'success');
    } else {
      addCategory({ nameBn, nameEn });
      showToast('নতুন ক্যাটাগরি তৈরি ও সেভ হয়েছে!', 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 backdrop-blur-md rounded-xl inline-flex">
              <Wand2 className="w-5 h-5 text-amber-300 animate-pulse" />
            </span>
            <h3 className="text-xl font-black tracking-tight">
              ক্যাটাগরি নেম অটো-কাস্টমাইজ ও সেভ সিস্টেম
            </h3>
          </div>
          <p className="text-xs text-red-100 max-w-xl">
            এখান থেকে ক্যাটাগরি নাম পরিবর্তন করলে তা ওয়েবসাইটের ন্যাভিগেশন বার এবং হোমপেজের সেকশন হেডারগুলোতে (যেমন: দিনাজপুরের লিচু, রাজশাহীর লিচু) লাইভ অটো-আপডেট ও সেভ হয়ে যাবে।
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-red-700 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-red-600" />
            <span>নতুন ক্যাটাগরি যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* ONE BOX MASTER SYSTEM: Auto-Customize Tools Box */}
      <div className="bg-gradient-to-br from-white via-red-50/30 to-amber-50/40 p-5 rounded-3xl border-2 border-red-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-red-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-red-600 to-amber-500 text-white rounded-2xl shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                <span>⚡ ক্যাটাগরি ফাস্ট নেম ও অটো কাস্টমাইজেশন টুলস বক্স</span>
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                সিলেক্ট করা ক্যাটাগরির নাম ১-ক্লিকে কাস্টমাইজ ও অটো-সেভ করুন
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>লাইভ অটো-সেভ একটিভ</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Category Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-red-600" />
              <span>টার্গেট ক্যাটাগরি সিলেক্ট করুন:</span>
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => handleSelectCat(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-red-200 rounded-2xl font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameBn} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Bangla Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              কাস্টম বাংলা নাম (বাংলা শিরোনাম):
            </label>
            <input
              type="text"
              value={customNameBn}
              onChange={(e) => setCustomNameBn(e.target.value)}
              placeholder="e.g. দিনাজপুরের রাজকীয় বোম্বাই লিচু"
              className="w-full px-3.5 py-2.5 bg-white border-2 border-red-200 rounded-2xl font-black text-xs text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
            />
          </div>

          {/* English Name Input & Apply */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              কাস্টম ইংরেজি নাম (English Title):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customNameEn}
                onChange={(e) => setCustomNameEn(e.target.value)}
                placeholder="e.g. Dinajpur Royal Bombai Litchi"
                className="flex-1 px-3.5 py-2.5 bg-white border-2 border-red-200 rounded-2xl font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleApplyAutoCustomize}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>সেভ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets for 1-Click Customization */}
        <div className="pt-2 border-t border-red-100">
          <div className="text-[11px] font-extrabold text-gray-700 mb-2 flex items-center gap-1.5">
            <span>কুইক প্রেসেট শিরোনাম (১-ক্লিকে কাস্টমাইজ করুন):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { bn: 'দিনাজপুরের বিখ্যাত রাজকীয় লিচু', en: 'Dinajpur Famous Royal Litchi' },
              { bn: 'রাজশাহীর সুস্বাদু বোম্বাই লিচু', en: 'Rajshahi Delicious Bombai Litchi' },
              { bn: 'প্রিমিয়াম উপহার ও ফ্যামিলি কম্বো', en: 'Premium Gift & Family Combos' },
              { bn: '১০০% অর্গানিক তাজা জুস ও স্কোয়াশ', en: '100% Organic Fresh Juices' },
              { bn: 'ড্রাই প্রসেসড ক্যান লিচু প্যাক', en: 'Dry Processed Canned Litchi Pack' },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomNameBn(p.bn);
                  setCustomNameEn(p.en);
                  updateCategory(selectedCatId, { nameBn: p.bn, nameEn: p.en });
                  setSavedBadgeCatId(selectedCatId);
                  showToast(`'${p.bn}' প্রেসেট কাস্টমাইজড ও সেভ হয়েছে!`, 'success');
                  setTimeout(() => setSavedBadgeCatId(null), 2500);
                }}
                className="px-3 py-1.5 bg-white hover:bg-red-600 hover:text-white border border-red-200 text-gray-800 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>+ {p.bn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category List Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h4 className="font-black text-base text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-600" />
            <span>সকল ক্যাটাগরি তালিকা ও লাইভ এডিটিং (Auto-Save List)</span>
          </h4>
          <p className="text-xs text-gray-500">
            নিচের যেকোনো ক্যাটাগরির নামের ওপর সরাসরি টাইপ করলেই স্বয়ংক্রিয়ভাবে সেভ হবে।
          </p>
        </div>
        <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
          মোট ক্যাটাগরি: <strong className="text-gray-900 font-black">{categories.length} টি</strong>
        </span>
      </div>

      {/* Grid of Categories with Live Inline Auto-Save */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.id).length;
          const isJustSaved = savedBadgeCatId === cat.id;

          return (
            <div
              key={cat.id}
              className={`bg-white p-5 rounded-3xl border-2 shadow-sm space-y-3 transition-all relative ${
                isJustSaved
                  ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/20'
                  : 'border-gray-200 hover:border-red-400'
              }`}
            >
              {/* Category Top Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xs shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      ID: {cat.id}
                    </span>
                    <span className="text-xs font-black text-red-600">
                      {productCount} টি পণ্য অন্তর্ভুক্ত
                    </span>
                  </div>
                </div>

                {isJustSaved ? (
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 animate-bounce">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>অটো সেভড!</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="সম্পাদনা করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteCategory(cat.id);
                        showToast(`'${cat.nameBn}' ক্যাটাগরি মুছে ফেলা হয়েছে!`, 'info');
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="১-ক্লিকে মুছে ফেলুন (Instant Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Inline Auto-Save Form */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">
                    ক্যাটাগরি নাম (বাংলা):
                  </label>
                  <input
                    type="text"
                    defaultValue={cat.nameBn}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && val !== cat.nameBn) {
                        handleInlineAutoSave(cat.id, val, cat.nameEn);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs font-black text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">
                    Category Name (English):
                  </label>
                  <input
                    type="text"
                    defaultValue={cat.nameEn}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && val !== cat.nameEn) {
                        handleInlineAutoSave(cat.id, cat.nameBn, val);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding/editing new category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100 animate-slide-up space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-900">
                {editingCategory ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  ক্যাটাগরি নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-colors shadow-md shadow-red-600/30 cursor-pointer"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
