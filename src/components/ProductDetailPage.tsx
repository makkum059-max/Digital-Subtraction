import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { getThemeConfig } from '../utils/theme';
import { calculateProductPrice } from '../utils/pricing';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Sparkles,
  Send,
  Heart,
  Share2,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const {
    products,
    setSelectedProductDetail,
    addToCart,
    setCheckoutProduct,
    addProductReview,
    showToast,
    settings,
  } = useStore();

  const themeConfig = getThemeConfig(settings.primaryTheme, settings.customHexColor);

  const [quantity, setQuantity] = useState(1);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const calculated = calculateProductPrice(product, undefined, undefined, quantity);

  const adjustedProduct: Product = {
    ...product,
    price: calculated.unitPrice,
    originalPrice: calculated.originalUnitPrice || product.originalPrice,
    unit: product.unit,
  };

  const handleAddToCart = () => {
    addToCart(adjustedProduct, quantity);
  };

  const handleBuyNow = () => {
    setCheckoutProduct(adjustedProduct);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.nameBn,
          text: `${product.nameBn} - ৳${product.price}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('পণ্যের লিংক কপি করা হয়েছে!', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      showToast('দয়া করে আপনার নাম লিখুন', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('দয়া করে আপনার রিভিউ বা মতামত লিখুন', 'error');
      return;
    }

    setIsReviewSubmitting(true);
    setTimeout(() => {
      addProductReview(product.id, {
        userName: reviewerName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
      setIsReviewSubmitting(false);
    }, 400);
  };

  // Filter related products (other items)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const reviewsList = product.reviews || [];

  return (
    <div id="product-detail-view" className="min-h-screen bg-gray-50/50 pb-12 font-sans">
      {/* Top Breadcrumb & Back Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-white transition-all px-3 py-1.5 rounded-xl cursor-pointer"
            style={{
              backgroundColor: 'var(--theme-light, #fef2f2)',
              color: 'var(--theme-text, #991b1b)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-primary, #dc2626)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-light, #fef2f2)';
              e.currentTarget.style.color = 'var(--theme-text, #991b1b)';
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← সব পণ্যে ফিরে যান</span>
          </button>

          <div className="text-xs text-gray-500 hidden sm:flex items-center gap-2">
            <span
              onClick={() => setSelectedProductDetail(null)}
              className="hover:underline cursor-pointer"
            >
              হোম
            </span>
            <span>/</span>
            <span className="text-gray-900 font-bold line-clamp-1">{product.nameBn}</span>
          </div>

          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="শেয়ার করুন"
            style={{ color: 'var(--theme-primary, #dc2626)' }}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">শেয়ার</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner group">
                <img
                  src={product.image}
                  alt={product.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {calculated.discountPercent > 0 && (
                    <span
                      className="text-white font-black text-xs px-3 py-1 rounded-lg shadow-md"
                      style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                    >
                      {calculated.discountPercent}% স্পেশাল ছাড়
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      বেস্ট সেলার
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {product.origin} বাগান
                  </span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-emerald-950">১০০% অর্গানিক ও ফ্রেশ</h5>
                    <p className="text-[10px] text-emerald-700">কোনো বিষাক্ত স্প্রে বা কেমিক্যাল মুক্ত</p>
                  </div>
                </div>

                <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3 flex items-center gap-3">
                  <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-rose-950">দ্রুত ডেলিভারি</h5>
                    <p className="text-[10px] text-rose-700">সারা দেশে ক্যাশ অন ডেলিভারি</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Pricing */}
            <div className="lg:col-span-6 space-y-5">
              {/* Category & SKU */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border shadow-2xs"
                  style={{
                    backgroundColor: 'var(--theme-light, #fef2f2)',
                    color: 'var(--theme-text, #991b1b)',
                    borderColor: 'var(--theme-border, #fecaca)',
                  }}
                >
                  {product.origin} বিখ্যাত পণ্য
                </span>
                <span className="bg-gray-100 text-gray-700 font-mono text-xs font-bold px-2.5 py-1 rounded-full">
                  পণ্য কোড: {product.code || product.id}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {product.inStock ? 'স্টকে উপলব্ধ রয়েছে' : 'স্টক শেষ'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {product.nameBn}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900 text-sm">{product.rating}</span>
                <span className="text-gray-400 text-xs">|</span>
                <a
                  href="#reviews-section"
                  className="text-xs font-bold hover:underline"
                  style={{ color: 'var(--theme-primary, #dc2626)' }}
                >
                  ({product.reviewsCount || reviewsList.length}টি গ্রাহক রিভিউ)
                </a>
              </div>

              {/* Price Display */}
              <div
                className="p-4 rounded-2xl border flex items-baseline justify-between transition-colors shadow-2xs"
                style={{
                  backgroundColor: 'var(--theme-light, #fef2f2)',
                  borderColor: 'var(--theme-border, #fecaca)',
                }}
              >
                <div>
                  <span className="text-xs text-gray-500 font-bold block mb-1">অফার মূল্য:</span>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-3xl font-black transition-colors"
                      style={{ color: 'var(--theme-primary, #dc2626)' }}
                    >
                      ৳{calculated.totalPrice.toLocaleString('bn-BD')}
                    </span>
                    {calculated.originalTotalPrice > calculated.totalPrice && (
                      <span className="text-base text-gray-400 line-through font-semibold">
                        ৳{calculated.originalTotalPrice.toLocaleString('bn-BD')}
                      </span>
                    )}
                    {calculated.discountPercent > 0 && (
                      <span className="text-xs font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                        {calculated.discountPercent}% ছাড়ে
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-600 block">প্যাকিং সাইজ:</span>
                  <span
                    className="bg-white font-black text-sm px-3 py-1 rounded-xl border shadow-2xs inline-block mt-0.5"
                    style={{
                      color: 'var(--theme-primary, #dc2626)',
                      borderColor: 'var(--theme-border, #fecaca)',
                    }}
                  >
                    {product.unit}
                  </span>
                </div>
              </div>

              {/* Product Validity Section */}
              <div className="bg-amber-50/90 border-2 border-amber-200/80 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>পণ্যটির স্থায়িত্ব ও মেয়াদকাল (Validity & Freshness):</span>
                </div>
                <p className="text-xs text-amber-900/90 font-medium leading-relaxed pl-7">
                  {product.validity ||
                    'গাছ থেকে কাটার পর সাধারণ তাপমাত্রায় ৭-১০ দিন সম্পূর্ণ তাজা ও সুস্বাদু থাকে। রেফ্রিজারেটরে সংরক্ষণ করলে ১২-১৫ দিন পর্যন্ত তাজা থাকবে।'}
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900">পণ্য বিবরণী:</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {product.description}
                </p>
              </div>

              {/* Bullet Points / Specifications */}
              {product.details && product.details.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-gray-900">বিশেষ বৈশিষ্ট্যসমূহ:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                    {product.details.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-gray-50/80 p-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="pt-2 flex items-center justify-between bg-gray-50 p-3.5 rounded-2xl border border-gray-200/70">
                <span className="text-xs font-bold text-gray-800">অর্ডারের পরিমাণ (প্যাক):</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-black text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 py-3.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-gray-200 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 py-3.5 px-5 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer hover:brightness-110"
                  style={{
                    backgroundColor: 'var(--theme-primary, #dc2626)',
                    boxShadow: '0 10px 25px -5px var(--theme-border, rgba(220,38,38,0.4))',
                  }}
                >
                  <span>এখনই সরাসরি অর্ডার করুন</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Rating Section */}
        <div
          id="reviews-section"
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" style={{ color: 'var(--theme-primary, #dc2626)' }} />
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  গ্রাহক রিভিউ ও মূল্যায়ন ({reviewsList.length})
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ভেরিফাইড ক্রেতাদের আসল অভিজ্ঞতা ও প্রোডাক্ট রেটিং
              </p>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
              <div className="text-2xl font-black text-amber-700">{product.rating}</div>
              <div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-600 font-bold">
                  {reviewsList.length}টি পর্যালোচনার ভিত্তিতে
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviewsList.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500">
                    এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি দিয়ে আপনার মতামত শেয়ার করুন!
                  </p>
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: 'var(--theme-light, #fef2f2)',
                            color: 'var(--theme-primary, #dc2626)',
                          }}
                        >
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-900">{rev.userName}</h5>
                          {rev.verifiedPurchase && (
                            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ ভেরিফাইড ক্রেতা
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed pl-10">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-gray-50/90 p-5 rounded-2xl border border-gray-200/90 space-y-4">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span>আপনার রিভিউ জমা দিন</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h4>

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="যেমন: আরিয়ান হোসেন"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">রেটিং দিন *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          reviewRating >= star
                            ? 'bg-amber-100 border-amber-300 text-amber-500'
                            : 'bg-white border-gray-200 text-gray-300'
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            reviewRating >= star ? 'fill-amber-400' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    আপনার অভিজ্ঞতা ও মতামত *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="পণ্যের গুণমান, স্বাদ ও ডেলিভারি নিয়ে আপনার মন্তব্য লিখুন..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isReviewSubmitting}
                  className="w-full py-2.5 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
                  style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>রিভিউ পোস্ট করুন</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Other Products / Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  অন্যান্য তাজা পণ্যসমূহ
                </h3>
                <p className="text-xs text-gray-500">অন্যান্য জনপ্রিয় সুস্বাদু ফ্রেশ সংগ্রহ</p>
              </div>

              <button
                onClick={() => setSelectedProductDetail(null)}
                className="text-xs font-bold hover:underline cursor-pointer"
                style={{ color: 'var(--theme-primary, #dc2626)' }}
              >
                সব পণ্য দেখুন ➔
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProductDetail(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gray-50/80 rounded-2xl p-3 border border-gray-200 transition-all cursor-pointer group flex flex-col justify-between"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--theme-primary, #dc2626)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div>
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-200 mb-2 relative">
                      <img
                        src={p.image}
                        alt={p.nameBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                        {p.origin}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-[var(--theme-primary)] transition-colors">
                      {p.nameBn}
                    </h4>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span
                        className="text-sm font-black"
                        style={{ color: 'var(--theme-primary, #dc2626)' }}
                      >
                        ৳{p.price.toLocaleString('bn-BD')}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ৳{p.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="mt-3 w-full py-1.5 bg-white border font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--theme-border, #fecaca)',
                      color: 'var(--theme-primary, #dc2626)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--theme-primary, #dc2626)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = 'var(--theme-primary, #dc2626)';
                    }}
                  >
                    বিস্তারিত দেখুন
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
