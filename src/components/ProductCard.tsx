import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingCart, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setQuickViewProduct, setSelectedProductDetail, setCheckoutProduct } = useStore();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckoutProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleOpenDetail = () => {
    setSelectedProductDetail(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative hover:border-emerald-500"
    >
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span
            className="text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm"
            style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
          >
            {discountPercent}% ছাড়
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-400 text-gray-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-900" />
            বেস্ট সেলার
          </span>
        )}
      </div>

      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
          {product.origin}
        </span>
      </div>

      {/* Image Container */}
      <div
        onClick={handleOpenDetail}
        className="relative aspect-4/3 bg-gray-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.nameBn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ক্যাটালগ ও বিবরণ</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 md:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title & Code */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3
              onClick={handleOpenDetail}
              className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 transition-colors cursor-pointer leading-tight hover:text-emerald-700"
              title={product.nameBn}
            >
              {product.nameBn}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 shrink-0 font-bold">
              ক্যাটালগ কোড: {product.code || product.id}
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 border border-emerald-100">
              {product.unit}
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span
              className="text-lg md:text-xl font-black"
              style={{ color: 'var(--theme-primary, #dc2626)' }}
            >
              ৳{product.price.toLocaleString('bn-BD')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.originalPrice.toLocaleString('bn-BD')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`order-now-btn-${product.id}`}
              onClick={handleDirectOrder}
              disabled={!product.inStock}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs md:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 ${
                product.inStock
                  ? 'text-white shadow-sm active:scale-98 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={
                product.inStock
                  ? { backgroundColor: 'var(--theme-primary, #dc2626)' }
                  : undefined
              }
            >
              <span>{product.inStock ? 'অর্ডার করুন' : 'স্টক শেষ'}</span>
            </button>

            <button
              id={`add-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center cursor-pointer text-gray-700 hover:text-emerald-700"
              title="কার্টে যোগ করুন"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
