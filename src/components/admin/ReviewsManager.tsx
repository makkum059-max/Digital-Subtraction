import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductReview, Product } from '../../types';
import {
  Star,
  Trash2,
  Edit3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  X,
  Sparkles,
  Package,
} from 'lucide-react';

export const ReviewsManager: React.FC = () => {
  const { products, addProductReview, updateProductReview, deleteProductReview } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<{
    productId: string;
    review: ProductReview;
  } | null>(null);
  const [deletingReview, setDeletingReview] = useState<{
    productId: string;
    reviewId: string;
    userName: string;
    productName: string;
  } | null>(null);

  // Form states
  const [targetProductId, setTargetProductId] = useState<string>('');
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true,
  });

  // Flatten all reviews across all products
  const allReviewsList = products.flatMap((product) =>
    (product.reviews || []).map((review) => ({
      product,
      review,
    }))
  );

  // Filter logic
  const filteredReviews = allReviewsList.filter(({ product, review }) => {
    const matchesSearch =
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProduct =
      selectedProductFilter === 'all' || product.id === selectedProductFilter;

    const matchesRating =
      selectedRatingFilter === 'all' || review.rating === Number(selectedRatingFilter);

    return matchesSearch && matchesProduct && matchesRating;
  });

  // Stats
  const totalReviewsCount = allReviewsList.length;
  const avgRatingOverall =
    totalReviewsCount > 0
      ? (
          allReviewsList.reduce((acc, curr) => acc + curr.review.rating, 0) / totalReviewsCount
        ).toFixed(1)
      : '5.0';
  const fiveStarCount = allReviewsList.filter((r) => r.review.rating === 5).length;
  const verifiedCount = allReviewsList.filter((r) => r.review.verifiedPurchase).length;

  const handleOpenAddModal = () => {
    setTargetProductId(products[0]?.id || '');
    setFormData({
      userName: '',
      rating: 5,
      comment: '',
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (productId: string, review: ProductReview) => {
    setEditingReview({ productId, review });
    setFormData({
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      date: review.date || new Date().toISOString().split('T')[0],
      verifiedPurchase: review.verifiedPurchase !== false,
    });
  };

  const handleSaveNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId || !formData.userName.trim() || !formData.comment.trim()) return;

    addProductReview(targetProductId, {
      userName: formData.userName.trim(),
      rating: Number(formData.rating),
      comment: formData.comment.trim(),
      verifiedPurchase: formData.verifiedPurchase,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEditReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !formData.userName.trim() || !formData.comment.trim()) return;

    updateProductReview(editingReview.productId, editingReview.review.id, {
      userName: formData.userName.trim(),
      rating: Number(formData.rating),
      comment: formData.comment.trim(),
      date: formData.date,
      verifiedPurchase: formData.verifiedPurchase,
    });

    setEditingReview(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingReview) return;
    deleteProductReview(deletingReview.productId, deletingReview.reviewId);
    setDeletingReview(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div
        style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
        className="rounded-3xl p-6 text-white shadow-xl border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>কাস্টমার রিভিউ ম্যানেজমেন্ট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">কাস্টমার রিভিউ এডিটর ও রিমুভ সিস্টেম</h2>
          <p className="text-xs sm:text-sm text-white/90">
            ওয়েবসাইটের সব কাস্টমার রিভিউ দেখা, সম্পাদন (Edit), নতুন রিভিউ যোগ করা এবং ডিলিট (Remove) করুন সহজে।
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="relative z-10 bg-white text-gray-900 hover:bg-gray-100 font-black px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm shrink-0 border border-white/30 active:scale-95"
        >
          <Plus className="w-4 h-4 text-red-600" />
          <span>নতুন রিভিউ যোগ করুন</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div
            style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm"
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">{totalReviewsCount}</div>
            <div className="text-[11px] font-bold text-gray-500">মোট রিভিউ</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">{avgRatingOverall} / 5.0</div>
            <div className="text-[11px] font-bold text-gray-500">গড় রেটিং (Average)</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">{verifiedCount}</div>
            <div className="text-[11px] font-bold text-gray-500">ভেরিফাইড রিভিউ</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">{fiveStarCount}</div>
            <div className="text-[11px] font-bold text-gray-500">৫ স্টার রিভিউ</div>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="কাস্টমারের নাম, মন্তব্য বা পণ্য দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Product Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
            <Package className="w-4 h-4 text-gray-400" />
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-bold text-gray-800 cursor-pointer"
            >
              <option value="all">সব পণ্য ({products.length})</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameBn} ({p.reviews?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Star Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedRatingFilter}
              onChange={(e) => setSelectedRatingFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-bold text-gray-800 cursor-pointer"
            >
              <option value="all">সব রেটিং</option>
              <option value="5">৫ স্টার ⭐⭐⭐⭐⭐</option>
              <option value="4">৪ স্টার ⭐⭐⭐⭐</option>
              <option value="3">৩ স্টার ⭐⭐⭐</option>
              <option value="2">২ স্টার ⭐⭐</option>
              <option value="1">১ স্টার ⭐</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-gray-800">কোনো রিভিউ পাওয়া যায়নি!</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedProductFilter !== 'all' || selectedRatingFilter !== 'all'
              ? 'অনুগ্রহ করে সার্চ বা ফিল্টার ফিল্ড পরিবর্তন করে আবার চেষ্টা করুন।'
              : 'এখনো কোনো কাস্টমার রিভিউ যোগ করা হয়নি। আপনি ওপরের "নতুন রিভিউ যোগ করুন" বাটন চেপে কাস্টমার রিভিউ যুক্ত করতে পারেন।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map(({ product, review }) => (
            <div
              key={`${product.id}_${review.id}`}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all space-y-3 relative group"
            >
              {/* Product Header inside Review card */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={product.image}
                    alt={product.nameBn}
                    className="w-10 h-10 object-cover rounded-xl border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 block truncate">
                      পণ্য: {product.code || product.id}
                    </span>
                    <h4 className="text-xs font-black text-gray-900 truncate">{product.nameBn}</h4>
                  </div>
                </div>

                {/* Actions: Edit and Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(product.id, review)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    title="রিভিউ এডিট করুন"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      deleteProductReview(product.id, review.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 hover:bg-red-100/50 rounded-xl transition-colors cursor-pointer"
                    title="১-ক্লিকে রিভিউ রিমুভ করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reviewer Name and Rating */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">
                    {review.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-black text-gray-900 truncate">{review.userName}</h5>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-gray-400">{review.date}</span>
                      {review.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> ভেরিফাইড
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-black text-amber-700 ml-1">{review.rating}.0</span>
                </div>
              </div>

              {/* Review comment text */}
              <p className="text-xs text-gray-700 leading-relaxed font-medium bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" />
                <span>নতুন কাস্টমার রিভিউ যোগ করুন</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewReview} className="space-y-4">
              {/* Product Select */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">পণ্য সিলেক্ট করুন *</label>
                <select
                  value={targetProductId}
                  onChange={(e) => setTargetProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-red-500"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameBn} ({p.code || p.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">কাস্টমারের নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: আরিফ হোসেন (ধানমন্ডি, ঢাকা)"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রেটিং (১ - ৫ স্টার) *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-2 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-black text-amber-600 ml-2">{formData.rating} স্টার</span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রিভিউ ও মন্তব্য *</label>
                <textarea
                  rows={4}
                  placeholder="কাস্টমারের পজিটিভ মতামত বা মন্তব্য লিখুন..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-500"
                  required
                ></textarea>
              </div>

              {/* Verified Purchase Switch */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-700">ভেরিফাইড কাস্টমার ব্যাজ দেখাবেন?</span>
                <input
                  type="checkbox"
                  checked={formData.verifiedPurchase}
                  onChange={(e) => setFormData({ ...formData, verifiedPurchase: e.target.checked })}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Submit Action */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #dc2626, #b91c1c))' }}
                  className="px-6 py-2.5 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:opacity-95"
                >
                  রিভিউ সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>রিভিউ সম্পাদন (Edit Review)</span>
              </h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditReview} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">কাস্টমারের নাম *</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রেটিং (১ - ৫ স্টার) *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-2 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-black text-amber-600 ml-2">{formData.rating} স্টার</span>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রিভিউ এর তারিখ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রিভিউ মন্তব্য *</label>
                <textarea
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>

              {/* Verified Purchase Switch */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-700">ভেরিফাইড কাস্টমার ব্যাজ</span>
                <input
                  type="checkbox"
                  checked={formData.verifiedPurchase}
                  onChange={(e) => setFormData({ ...formData, verifiedPurchase: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Submit Action */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  আপডেট সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-center border border-gray-100">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">রিভিউ ডিলিট বা রিমুভ নিশ্চিতকরণ</h3>
              <p className="text-xs text-gray-600">
                আপনি কি নিশ্চিত যে <span className="font-bold text-gray-900">"{deletingReview.userName}"</span> এর
                রিভিউটি পণ্য <span className="font-bold text-gray-900">"{deletingReview.productName}"</span> থেকে রিমুভ করে দিতে চান?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setDeletingReview(null)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                না, রেখে দিন
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                হ্যাঁ, রিমুভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
