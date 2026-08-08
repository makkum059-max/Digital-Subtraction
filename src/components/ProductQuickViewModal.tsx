import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateProductPrice } from '../utils/pricing';
import { Product } from '../types';
import { X, Star, ShoppingCart, ShieldCheck, Truck, Plus, Minus, ArrowRight } from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setCheckoutProduct } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const calculated = calculateProductPrice(product, undefined, undefined, quantity);

  const adjustedProduct: Product = {
    ...product,
    price: calculated.unitPrice,
    originalPrice: calculated.originalUnitPrice || product.originalPrice,
    unit: product.unit,
  };

  const handleBuyNow = () => {
    setQuickViewProduct(null);
    setCheckoutProduct(adjustedProduct);
  };

  const handleAddToCart = () => {
    addToCart(adjustedProduct, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative animate-slide-up border border-gray-100 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full text-gray-500 hover:text-gray-800 shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-50 relative p-4 sm:p-6 flex items-center justify-center shrink-0">
          <img
            src={product.image}
            alt={product.nameBn}
            className="w-full h-44 sm:h-56 md:h-full object-cover rounded-2xl shadow-md"
          />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-emerald-600 text-white font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-sm">
            {product.origin} বাগান
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block border"
              style={{
                backgroundColor: 'var(--theme-light, #fef2f2)',
                color: 'var(--theme-primary, #dc2626)',
                borderColor: 'var(--theme-border, #fecaca)',
              }}
            >
              {product.unit}
            </span>

            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
              {product.nameBn}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-xs">
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
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount} রিভিউ)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-1">
              <span
                className="text-2xl font-black"
                style={{ color: 'var(--theme-primary, #dc2626)' }}
              >
                ৳{calculated.totalPrice.toLocaleString('bn-BD')}
              </span>
              {calculated.originalTotalPrice > calculated.totalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ৳{calculated.originalTotalPrice.toLocaleString('bn-BD')}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {product.description}
            </p>

            {/* Benefits */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>১০০% প্রাকৃতিক ও ফরমালিন মুক্ত guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600" />
                <span>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">পরিমাণ (প্যাক):</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>কার্টে রাখুন</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 text-white rounded-xl font-bold text-xs md:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110"
              style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
            >
              <span>সরাসরি অর্ডার</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
