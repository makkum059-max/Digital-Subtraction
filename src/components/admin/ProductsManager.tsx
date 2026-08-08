import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Plus, Search, Edit3, Trash2, CheckCircle, XCircle, Star, Image, X, Upload, Copy, Sparkles, Tag, Sliders, Check, MessageSquare } from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, showToast, setAdminTab } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState('dinajpur');
  const [price, setPrice] = useState<number>(450);
  const [costPrice, setCostPrice] = useState<number>(310);
  const [originalPrice, setOriginalPrice] = useState<number>(550);
  const [unit, setUnit] = useState('১০০ পিস');
  const [origin, setOrigin] = useState('দিনাজপুর');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1528821128474-27f963b077fe?auto=format&fit=crop&q=80&w=800');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHotProduct, setIsHotProduct] = useState(false);
  const [hotTagText, setHotTagText] = useState('🔥 হট অফার');
  const [description, setDescription] = useState('দিনাজপুরের অর্গানিক ও সুস্বাদু তাজা লিচু। সরাসরি বাগান থেকে সংগৃহীত।');
  const [validityOptionsText, setValidityOptionsText] = useState('1 Month, 3 Month, 6 Month');
  const [subscriptionTypesText, setSubscriptionTypesText] = useState('Personal, Share, Individual');
  
  // Premium Interactive Tag Builder States
  const [validityTags, setValidityTags] = useState<string[]>(['1 Month', '3 Month', '6 Month']);
  const [subscriptionTags, setSubscriptionTags] = useState<string[]>(['Personal', 'Share', 'Individual']);
  const [validityPrices, setValidityPrices] = useState<Record<string, number>>({
    '1 Month': 450,
    '3 Month': 1170,
    '6 Month': 2160,
  });
  const [subscriptionPrices, setSubscriptionPrices] = useState<Record<string, number>>({
    'Personal': 0,
    'Share': 0,
    'Individual': 0,
  });
  const [subscriptionComparePrices, setSubscriptionComparePrices] = useState<Record<string, number>>({
    'Personal': 550,
    'Share': 350,
    'Individual': 600,
  });
  const [subscriptionNotes, setSubscriptionNotes] = useState<Record<string, string>>({
    'Personal': 'note',
    'Share': 'note',
    'Individual': 'note',
  });
  const [newValidityInput, setNewValidityInput] = useState('');
  const [newSubscriptionInput, setNewSubscriptionInput] = useState('');
  const [isCommaMode, setIsCommaMode] = useState(false);

  const handleAddValidityTag = (tagVal?: string, initialPrice?: number) => {
    const val = (tagVal || newValidityInput).trim() || `${validityTags.length + 1} Month`;
    if (!validityTags.includes(val)) {
      const next = [...validityTags, val];
      setValidityTags(next);
      setValidityOptionsText(next.join(', '));
      setValidityPrices((prev) => ({
        ...prev,
        [val]: initialPrice !== undefined ? initialPrice : price || 450,
      }));
      setNewValidityInput('');
    }
  };

  const handleRemoveValidityTag = (tagVal: string) => {
    const next = validityTags.filter((t) => t !== tagVal);
    setValidityTags(next);
    setValidityOptionsText(next.join(', '));
  };

  const handleAddSubscriptionTag = (tagVal?: string, initialPrice?: number) => {
    const val = (tagVal || newSubscriptionInput).trim() || `Option ${subscriptionTags.length + 1}`;
    if (!subscriptionTags.includes(val)) {
      const next = [...subscriptionTags, val];
      setSubscriptionTags(next);
      setSubscriptionTypesText(next.join(', '));
      setSubscriptionPrices((prev) => ({
        ...prev,
        [val]: initialPrice !== undefined ? initialPrice : 0,
      }));
      setSubscriptionComparePrices((prev) => ({
        ...prev,
        [val]: 0,
      }));
      setSubscriptionNotes((prev) => ({
        ...prev,
        [val]: '',
      }));
      setNewSubscriptionInput('');
    }
  };

  const handleRemoveSubscriptionTag = (tagVal: string) => {
    const next = subscriptionTags.filter((t) => t !== tagVal);
    setSubscriptionTags(next);
    setSubscriptionTypesText(next.join(', '));
  };

  const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1528821128474-27f963b077fe?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596368708356-6e1e1025ee73?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&q=80&w=800',
  ];

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicatedCode = `${p.code || 'LIC'}-COPY-${Math.floor(10 + Math.random() * 90)}`;
    addProduct({
      ...p,
      id: `p-${Date.now()}`,
      code: duplicatedCode,
      nameBn: `${p.nameBn} (কপি)`,
      name: `${p.name} (Copy)`,
    });
    showToast(`'${p.nameBn}' পণ্যটির অনুলিপি সফলভাবে তৈরি হয়েছে!`, 'success');
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setCode('LIC-' + Math.floor(100 + Math.random() * 900));
    setName('Dinajpur Bedana Pack');
    setNameBn('দিনাজপুর বেদানা লিচু স্পেশাল প্যাক');
    setCategory('dinajpur');
    setPrice(450);
    setCostPrice(310);
    setOriginalPrice(550);
    setUnit('১০০ পিস');
    setOrigin('দিনাজপুর');
    setImage(SAMPLE_IMAGES[0]);
    setInStock(true);
    setIsFeatured(true);
    setIsBestSeller(false);
    setIsHotProduct(true);
    setHotTagText('🔥 হট অফার');
    setDescription('দিনাজপুরের স্পেশাল মিষ্টি অরিজিনাল বেদানা লিচু।');
    setValidityOptionsText('');
    setSubscriptionTypesText('');
    setValidityTags([]);
    setSubscriptionTags([]);
    setValidityPrices({});
    setSubscriptionPrices({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setCode(p.code || p.id);
    setName(p.name);
    setNameBn(p.nameBn);
    setCategory(p.category);
    setPrice(p.price);
    setCostPrice(p.costPrice || Math.round(p.price * 0.7));
    setOriginalPrice(p.originalPrice || p.price);
    setUnit(p.unit);
    setOrigin(p.origin || 'দিনাজপুর');
    setImage(p.image);
    setInStock(p.inStock);
    setIsFeatured(!!p.isFeatured);
    setIsBestSeller(!!p.isBestSeller);
    setIsHotProduct(!!p.isHotProduct);
    setHotTagText(p.hotTagText || '🔥 হট অফার');
    setDescription(p.description);

    const valList = p.validityOptions && p.validityOptions.length > 0 ? p.validityOptions : [];
    const subList = p.subscriptionTypes && p.subscriptionTypes.length > 0 ? p.subscriptionTypes : [];

    setValidityTags(valList);
    setSubscriptionTags(subList);
    setValidityOptionsText(valList.join(', '));
    setSubscriptionTypesText(subList.join(', '));

    setValidityPrices(p.validityPricing || {});
    setSubscriptionPrices(p.subscriptionPricing || {});

    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedValidityOptions = isCommaMode
      ? validityOptionsText.split(',').map((s) => s.trim()).filter(Boolean)
      : validityTags;

    const parsedSubscriptionTypes = isCommaMode
      ? subscriptionTypesText.split(',').map((s) => s.trim()).filter(Boolean)
      : subscriptionTags;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        code,
        name,
        nameBn,
        category,
        price,
        costPrice,
        originalPrice,
        unit,
        origin,
        image,
        inStock,
        isFeatured,
        isBestSeller,
        isHotProduct,
        hotTagText,
        description,
        validityOptions: parsedValidityOptions,
        validityPricing: validityPrices,
        subscriptionTypes: parsedSubscriptionTypes,
        subscriptionPricing: subscriptionPrices,
      });
      showToast('পণ্যটি সফলভাবে আপডেট ও সেভ করা হয়েছে!', 'success');
    } else {
      addProduct({
        code,
        name,
        nameBn,
        category,
        price,
        costPrice,
        originalPrice,
        unit,
        origin,
        image,
        rating: 5.0,
        reviewsCount: 1,
        inStock,
        isFeatured,
        isBestSeller,
        isHotProduct,
        hotTagText,
        description,
        validityOptions: parsedValidityOptions,
        validityPricing: validityPrices,
        subscriptionTypes: parsedSubscriptionTypes,
        subscriptionPricing: subscriptionPrices,
      });
      showToast('নতুন পণ্য সফলভাবে স্টোরে সেভ ও যুক্ত করা হয়েছে!', 'success');
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Actions */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="পণ্য কোড বা নাম দিয়ে অনুসন্ধান..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => {
              if (searchTerm) {
                showToast(`"${searchTerm}" দিয়ে অনুসন্ধান ফিল্টার করা হয়েছে`);
              }
            }}
            className="px-3.5 py-2 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0"
            style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>খুঁজুন</span>
          </button>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameBn}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-5 py-2.5 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98 cursor-pointer"
          style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
        >
          <Plus className="w-4 h-4" />
          <span>নতুন লিচু পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3.5">ছবি</th>
                <th className="p-3.5">পণ্যের নাম (বাংলা)</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">একক / প্যাক</th>
                <th className="p-3.5">ক্রয় মূল্য</th>
                <th className="p-3.5">বিক্রয় মূল্য</th>
                <th className="p-3.5">নিট প্রফিট</th>
                <th className="p-3.5">স্টক</th>
                <th className="p-3.5">ফিচার্ড</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const itemCost = p.costPrice || Math.round(p.price * 0.7);
                const itemProfit = p.price - itemCost;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <img
                        src={p.image}
                        alt={p.nameBn}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900 text-sm">{p.nameBn}</div>
                      <div className="text-[11px] text-gray-400">{p.origin} বাগান</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-md">
                        {categories.find((c) => c.id === p.category)?.nameBn || p.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-gray-700">{p.unit}</td>
                    <td className="p-3">
                      <span className="font-bold text-blue-700 text-xs">৳{itemCost}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-black text-gray-900 text-sm">৳{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through ml-1">
                          ৳{p.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        +৳{itemProfit}
                      </span>
                    </td>
                  <td className="p-3">
                    <button
                      onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-full ${
                        p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{p.inStock ? 'ইন স্টক' : 'স্টক আউট'}</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
                      className={`p-1.5 rounded-lg ${
                        p.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                      }`}
                      title="ফিচার্ড পজিশন টগল করুন"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setAdminTab('reviews')}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="রিভিউ পরিচালনা / এডিট / রিমুভ করুন"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[10px] font-black">{p.reviews?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(p)}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold transition-colors cursor-pointer"
                        title="অনুলিপি / কপি করুন (Duplicate)"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors cursor-pointer"
                        title="সম্পাদনা (Edit)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          showToast(`'${p.nameBn}' পণ্যটি মুছে ফেলা হয়েছে!`, 'info');
                        }}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-colors cursor-pointer"
                        title="১-ক্লিকে মুছে ফেলুন (Instant Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 relative border border-gray-100 animate-slide-up my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-4">
              {editingProduct ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add Product)'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block font-bold text-amber-950 mb-1">প্রোডাক্ট কোড / SKU (Product Code) *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="যেমন: BEDANA-101 বা LIC-202"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold text-gray-900 uppercase"
                  />
                </div>
                <span className="text-[10px] text-amber-800 font-medium max-w-[160px]">
                  এই কোডটি কাস্টমার ওয়েবসাইটে ও ইনভয়েসে দেখতে পাবে
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">পণ্যের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: দিনাজপুরের অরিজিনাল বেদানা লিচু"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">English Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dinajpur Bedana Litchi Box"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">ক্রয়/কেনা মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    placeholder="যেমন: ৩১০"
                    className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">পূর্বের মূল্য (৳)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Profit preview card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md font-black text-[10px]">অটো প্রফিট হিসাব</span>
                  <span>মুনাফা (Profit): ৳{(price - costPrice).toLocaleString('bn-BD')}</span>
                </div>
                <div className="text-[11px] font-black text-emerald-800">
                  মার্জিন: {price > 0 ? Math.round(((price - costPrice) / price) * 100) : 0}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">একক / প্যাক (Unit)</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="যেমন: ১০০ পিস / ১০০০ পিস / ৫০০ পিস"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">উৎপত্তি স্থান (Origin)</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="যেমন: দিনাজপুর / রাজশাহী"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subscription Types & Validity Options - ONE BOX PREMIUM MASTER SYSTEM */}
              <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-2 border-indigo-500/50 rounded-3xl space-y-4 shadow-xl text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-rose-600 to-indigo-600 rounded-2xl shadow-md text-white shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                        <span>সাবস্ক্রিপশন টাইপ ও ভ্যালিডিটি অল-ইন-ওয়ান মাস্টার বক্স</span>
                      </h4>
                      <p className="text-[11px] text-indigo-200/80 font-medium">
                        কাস্টমার ওয়েবসাইটে যে মেয়াদ ও প্যাক সিলেক্ট করবেন, অটোমেটিক লাইভ দাম আপডেট হয়ে যাবে।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black bg-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-400/30">
                      ⚡ 100% অটো প্রফিট সিস্টেম
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCommaMode(!isCommaMode)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-indigo-100 border border-indigo-400/40 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isCommaMode ? 'ভিজ্যুয়াল বক্স মোড' : 'কমা টেক্সট ইনপুট'}</span>
                    </button>
                  </div>
                </div>

                {isCommaMode ? (
                  /* Power User Comma Text Mode */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border-2 border-red-500 shadow-sm">
                    <div>
                      <label className="block font-bold text-red-700 text-xs mb-1">
                        Validity Options (কমা দিয়ে আলাদা করুন)
                      </label>
                      <input
                        type="text"
                        value={validityOptionsText}
                        onChange={(e) => setValidityOptionsText(e.target.value)}
                        placeholder="e.g. 1 Month, 3 Month, 6 Month, 1 Year"
                        className="w-full px-3.5 py-2 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 font-bold text-xs text-gray-800 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-red-700 text-xs mb-1">
                        Subscription Types (কমা দিয়ে আলাদা করুন)
                      </label>
                      <input
                        type="text"
                        value={subscriptionTypesText}
                        onChange={(e) => setSubscriptionTypesText(e.target.value)}
                        placeholder="e.g. Personal, Share, Individual, Family"
                        className="w-full px-3.5 py-2 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 font-bold text-xs text-gray-800 shadow-2xs"
                      />
                    </div>
                  </div>
                ) : (
                  /* Ultra-Premium Red Pill Diagram Master Box */
                  <div className="bg-gradient-to-br from-white via-red-50/20 to-amber-50/20 p-5 rounded-3xl border-2 border-red-600 shadow-lg space-y-5 text-gray-900">
                    {/* Header Titles Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-red-100 pb-3">
                      <div className="font-black text-red-700 text-sm md:text-base flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                        <span>Validity Options (মেয়াদ ও প্রাইস)</span>
                      </div>

                      <div className="font-black text-red-700 text-sm md:text-base flex items-center gap-2">
                        <span>Subscription Types (প্যাকেজের ধরণ)</span>
                      </div>
                    </div>

                    {/* Main Red Pill Grid Matrix */}
                    <div className="space-y-3 overflow-x-auto pb-1">
                      {/* Grid Header Labels */}
                      <div className="hidden md:grid grid-cols-12 gap-2 text-center font-extrabold text-[11px] text-red-700 px-1">
                        <div className="col-span-3 text-left pl-2">Validity Option</div>
                        <div className="col-span-3">Package Title</div>
                        <div className="col-span-2">Price (৳)</div>
                        <div className="col-span-2">Compare Price</div>
                        <div className="col-span-2">Note / Tag</div>
                      </div>

                      {/* Combination Rows */}
                      {validityTags.map((validityTag, vIdx) => (
                        <div key={validityTag} className="space-y-2 bg-white/80 p-3 rounded-2xl border border-red-200 shadow-2xs">
                          {/* Validity Label & Price Pill */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-red-100">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={validityTag}
                                onChange={(e) => {
                                  const newVal = e.target.value;
                                  const next = validityTags.map((t) => (t === validityTag ? newVal : t));
                                  setValidityTags(next);
                                  setValidityOptionsText(next.join(', '));
                                }}
                                placeholder="month"
                                className="w-36 px-3 py-1.5 text-center font-black text-xs text-red-700 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 shadow-2xs"
                              />
                              <div className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-2xl border border-red-200">
                                <span className="text-[11px] font-bold text-red-700">Base Price:</span>
                                <input
                                  type="number"
                                  value={validityPrices[validityTag] !== undefined ? validityPrices[validityTag] : ''}
                                  onChange={(e) =>
                                    setValidityPrices({ ...validityPrices, [validityTag]: Number(e.target.value) })
                                  }
                                  placeholder={`${price || 450}`}
                                  className="w-20 px-2 py-0.5 text-center text-xs font-black text-red-700 bg-white border border-red-400 rounded-xl focus:outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveValidityTag(validityTag)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                              title="Delete Validity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Subscription Pill Rows linked to this validity */}
                          <div className="space-y-2 pt-1">
                            {subscriptionTags.map((subTag) => (
                              <div key={subTag} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                {/* Empty Spacer / Validity Indicator on desktop */}
                                <div className="hidden md:block col-span-3 text-xs font-bold text-gray-500 pl-3 border-l-2 border-red-300">
                                  ↳ {validityTag}
                                </div>

                                {/* Subscription Title Input Pill */}
                                <div className="col-span-12 md:col-span-3">
                                  <input
                                    type="text"
                                    value={subTag}
                                    onChange={(e) => {
                                      const newVal = e.target.value;
                                      const next = subscriptionTags.map((t) => (t === subTag ? newVal : t));
                                      setSubscriptionTags(next);
                                      setSubscriptionTypesText(next.join(', '));
                                    }}
                                    placeholder="Personal"
                                    className="w-full px-3 py-1.5 text-center text-xs font-bold text-gray-800 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 shadow-2xs placeholder:text-gray-400"
                                  />
                                </div>

                                {/* Price Input Pill */}
                                <div className="col-span-12 md:col-span-2">
                                  <input
                                    type="number"
                                    value={subscriptionPrices[subTag] !== undefined ? subscriptionPrices[subTag] : ''}
                                    onChange={(e) =>
                                      setSubscriptionPrices({ ...subscriptionPrices, [subTag]: Number(e.target.value) })
                                    }
                                    placeholder="Price"
                                    className="w-full px-3 py-1.5 text-center text-xs font-bold text-gray-800 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 shadow-2xs placeholder:text-gray-400"
                                  />
                                </div>

                                {/* Compare Price Input Pill */}
                                <div className="col-span-12 md:col-span-2">
                                  <input
                                    type="number"
                                    value={
                                      subscriptionComparePrices[subTag] !== undefined
                                        ? subscriptionComparePrices[subTag]
                                        : ''
                                    }
                                    onChange={(e) =>
                                      setSubscriptionComparePrices({
                                        ...subscriptionComparePrices,
                                        [subTag]: Number(e.target.value),
                                      })
                                    }
                                    placeholder="comper price"
                                    className="w-full px-3 py-1.5 text-center text-[11px] font-bold text-gray-800 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 shadow-2xs placeholder:text-gray-400"
                                  />
                                </div>

                                {/* Note Input Pill & Delete */}
                                <div className="col-span-12 md:col-span-2 flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={subscriptionNotes[subTag] || ''}
                                    onChange={(e) =>
                                      setSubscriptionNotes({ ...subscriptionNotes, [subTag]: e.target.value })
                                    }
                                    placeholder="note"
                                    className="w-full px-3 py-1.5 text-center text-xs font-bold text-gray-800 bg-white border-2 border-red-600 rounded-2xl focus:ring-2 focus:ring-red-500 shadow-2xs placeholder:text-gray-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSubscriptionTag(subTag)}
                                    className="p-1 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-xl transition-colors cursor-pointer shrink-0"
                                    title="Remove subscription option"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Presets Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-red-100 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-extrabold text-red-700 text-[11px]">মেয়াদ প্রিসেট:</span>
                        {['1 Month', '3 Month', '6 Month', '1 Year', 'Lifetime'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAddValidityTag(preset)}
                            disabled={validityTags.includes(preset)}
                            className="px-2.5 py-0.5 bg-red-50 hover:bg-red-100 disabled:opacity-30 text-red-700 border border-red-200 rounded-full text-[10px] font-bold transition-all cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-extrabold text-red-700 text-[11px]">প্যাকেজ প্রিসেট:</span>
                        {['Personal', 'Share', 'Private', 'Individual', 'Family'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAddSubscriptionTag(preset)}
                            disabled={subscriptionTags.includes(preset)}
                            className="px-2.5 py-0.5 bg-red-50 hover:bg-red-100 disabled:opacity-30 text-red-700 border border-red-200 rounded-full text-[10px] font-bold transition-all cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Instant Calculator Preview Bar */}
                    <div className="bg-red-50 p-3 rounded-2xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-red-100 text-red-600 rounded-xl border border-red-200 font-black text-xs">
                          🧮
                        </span>
                        <div>
                          <div className="text-xs font-bold text-red-800">
                            লাইভ কাস্টমার ক্যালকুলেশন প্রিভিউ (Live Preview):
                          </div>
                          <div className="text-[11px] text-red-600 font-medium">
                            কাস্টমার [{validityTags[0] || '1 Month'}] + [{subscriptionTags[0] || 'Personal'}] সিলেক্ট করলে দাম হবে:
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-1.5 bg-red-600 border border-red-700 rounded-xl text-white font-black text-sm text-right shrink-0 shadow-xs">
                        ৳{((validityPrices[validityTags[0]] || price || 450) + (subscriptionPrices[subscriptionTags[0]] || 0)).toLocaleString('bn-BD')}
                      </div>
                    </div>

                    {/* Large Red Capsule ADD Button (Matching user image) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleAddSubscriptionTag();
                        }}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm rounded-full border-2 border-red-600 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Plus className="w-5 h-5 text-white stroke-[3]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload, Remove & Preset Selection */}
              <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-800">পণ্যের ছবি (Product Image)</label>
                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ছবি রিমুভ করুন</span>
                    </button>
                  )}
                </div>

                {/* Live Preview Box */}
                {image ? (
                  <div className="relative group w-full h-32 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 flex items-center justify-center">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>রিমুভ করুন</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white">
                    <Image className="w-8 h-8 stroke-1 text-gray-300 mb-1" />
                    <span className="text-[11px] font-bold">কোনো ছবি সিলেক্ট করা নেই</span>
                  </div>
                )}

                {/* Upload from Device Button & URL Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:border-red-500 rounded-xl cursor-pointer text-xs font-bold text-gray-700 hover:text-red-600 transition-colors shadow-sm">
                    <Upload className="w-4 h-4 text-red-600" />
                    <span>ডিভাইস থেকে ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="অথবা ছবি লিঙ্ক/URL দিন..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Preset sample images */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold shrink-0">স্যাম্পল বাগান ছবি:</span>
                  <div className="flex gap-1.5 overflow-x-auto">
                    {SAMPLE_IMAGES.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt="Sample"
                        onClick={() => setImage(imgUrl)}
                        className={`w-7 h-7 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                          image === imgUrl ? 'border-red-600 scale-105 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">পণ্যের বিবরণ (Description)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>স্টকে আছে (In Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>হোমপেজে ফিচার্ড রাখুন</span>
                  </label>

                  <label className="flex items-center gap-2 font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHotProduct}
                      onChange={(e) => setIsHotProduct(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>🔥 অটো-রান হট ডিল (Hot Product)</span>
                  </label>
                </div>

                {isHotProduct && (
                  <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-red-700 shrink-0">হট ব্যাজ টেক্সট:</span>
                    <input
                      type="text"
                      value={hotTagText}
                      onChange={(e) => setHotTagText(e.target.value)}
                      placeholder="e.g. 🔥 হট অফার, ⚡ স্পেশাল ছাড়"
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-red-300 rounded-lg font-bold text-red-800"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-red-600/30"
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
