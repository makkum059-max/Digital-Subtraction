import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PromoCode } from '../../types';
import { Tag, Plus, Edit3, Trash2, CheckCircle, XCircle, Copy, Check, X, Percent, DollarSign, Gift } from 'lucide-react';

export const PromosManager: React.FC = () => {
  const { promos, addPromoCode, updatePromoCode, deletePromoCode, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(400);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setCode('DISCOUNT' + Math.floor(Math.random() * 90 + 10));
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(500);
    setDescription('১০% প্রমোশনাল ডিসকাউন্ট ছাড়');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setCode(promo.code);
    setDiscountType(promo.discountType);
    setDiscountValue(promo.discountValue);
    setMinOrderAmount(promo.minOrderAmount);
    setDescription(promo.description);
    setIsActive(promo.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      updatePromoCode(editingPromo.id, {
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        description,
        isActive,
      });
    } else {
      addPromoCode({
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        description,
        isActive,
      });
    }
    setIsModalOpen(false);
  };

  const copyCode = (cStr: string) => {
    navigator.clipboard.writeText(cStr);
    setCopiedCode(cStr);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">প্রোমো কোড ম্যানেজমেন্ট (Promo & Coupon Codes)</h3>
              <p className="text-xs text-gray-500">
                নতুন অফার কুপন তৈরি করুন, এডিট করুন ও ওয়েবসাইটে সরাসরি অফার লাইভ করুন
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রোমো কোড যোগ করুন</span>
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
              promo.isActive ? 'border-purple-200 shadow-sm hover:border-purple-400' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-mono font-bold rounded-lg border border-purple-200 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {promo.code}
                </span>
                <button
                  onClick={() => copyCode(promo.code)}
                  title="কোড কপি করুন"
                  className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {copiedCode === promo.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => updatePromoCode(promo.id, { isActive: !promo.isActive })}
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  promo.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-500 border-gray-300'
                }`}
              >
                {promo.isActive ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>লাইভ</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-gray-400" />
                    <span>বন্ধ</span>
                  </>
                )}
              </button>
            </div>

            {/* Main Value */}
            <div className="my-2 space-y-1">
              <div className="text-2xl font-black text-gray-900 flex items-baseline gap-1">
                {promo.discountType === 'percentage' ? (
                  <>
                    <span>{promo.discountValue}%</span>
                    <span className="text-sm font-bold text-purple-600">ছাড় (OFF)</span>
                  </>
                ) : (
                  <>
                    <span>৳{promo.discountValue}</span>
                    <span className="text-sm font-bold text-purple-600">ক্যাশব্যাক/ছাড়</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium text-gray-600 line-clamp-2">{promo.description}</p>
            </div>

            {/* Requirements & Usage */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <div>
                সর্বনিম্ন অর্ডার: <span className="font-bold text-gray-800">৳{promo.minOrderAmount}</span>
              </div>
              <div>
                ব্যবহার: <span className="font-bold text-purple-700">{promo.usageCount || 0} বার</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(promo)}
                className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Edit3 className="w-4 h-4" />
                <span>এডিট</span>
              </button>
              <button
                onClick={() => {
                  deletePromoCode(promo.id);
                  showToast(`"${promo.code}" কুপনটি মুছে ফেলা হয়েছে!`, 'info');
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="১-ক্লিকে মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
                <span>মুছুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {editingPromo ? 'প্রোমো কোড আপডেট করুন' : 'নতুন প্রোমো কোড যোগ করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-gray-800 mb-1">কুপন কোড (Promo Code) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: LITCHI10 বা DINAJPUR100"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none uppercase font-mono text-sm font-bold text-purple-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">ছাড়ের টাইপ (Type)</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="percentage">পার্সেন্টেজ (%)</option>
                    <option value="fixed">ফ্ল্যাট টাকা (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    ছাড়ের পরিমাণ ({discountType === 'percentage' ? '%' : '৳'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">সর্বনিম্ন অর্ডারের টাকা (Min Order Subtotal) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  placeholder="যেমন: 400"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">অফার বিবরণী (Description) *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: ১০% বিশেষ ছাড় সকল অর্ডারে"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <span className="font-bold text-gray-800">কোডটি অবিলম্বে ওয়েবসাইটে সক্রিয় রাখুন?</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {editingPromo ? 'আপডেট করুন' : 'তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
