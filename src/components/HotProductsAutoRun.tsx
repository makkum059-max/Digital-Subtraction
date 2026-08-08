import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ShoppingCart, Eye, Sparkles, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Product } from '../types';

export const HotProductsAutoRun: React.FC = () => {
  const { products, setQuickViewProduct, setSelectedProductDetail, setCheckoutProduct } = useStore();
  const hotProducts = products.filter((p) => p.isHotProduct || p.isBestSeller);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (hotProducts.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [hotProducts, isPaused]);

  if (hotProducts.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-5 relative overflow-hidden">
      <div
        style={{ background: 'var(--theme-dark-gradient, linear-gradient(135deg, #b91c1c, #111827))' }}
        className="rounded-2xl md:rounded-3xl p-3.5 sm:p-5 text-white shadow-2xl relative transition-all duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-white/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl animate-bounce">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-300 text-red-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  লাইভ অটো-রান হট ডিল
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-white mt-0.5 tracking-wide">
                🔥 হট পণ্য সমাহারের স্পেশাল ডিসকাউন্ট অফার
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={scrollLeft}
              className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all text-white cursor-pointer"
              title="পূর্ববর্তী"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all text-white cursor-pointer"
              title="পরবর্তী"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrolling Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
        >
          {hotProducts.map((product) => (
            <div
              key={product.id}
              className="w-52 sm:w-60 md:w-64 shrink-0 bg-white text-gray-900 rounded-xl sm:rounded-2xl p-3 shadow-lg border border-red-100 flex flex-col justify-between transition-transform hover:-translate-y-1 group"
            >
              {/* Product Header & Image */}
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-[4/3] sm:aspect-square bg-gray-100 mb-2.5">
                <img
                  src={product.image}
                  alt={product.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Hot Tag Badge */}
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
                  <span
                    className="text-white font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md sm:rounded-lg shadow-md flex items-center gap-1 animate-pulse"
                    style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                  >
                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 fill-amber-300" />
                    {product.hotTagText || '🔥 হট আইটেম'}
                  </span>
                  {product.code && (
                    <span className="bg-black/80 text-white font-mono font-bold text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                      কোড: {product.code}
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-1.5 right-1.5 bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md sm:rounded-lg shadow-sm">
                    -৳{product.originalPrice - product.price} ছাড়
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1"
                  style={{
                    color: 'var(--theme-text, #991b1b)',
                    backgroundColor: 'var(--theme-light, #fef2f2)',
                  }}
                >
                  {product.origin} বাগান তাজা
                </span>
                <h4
                  onClick={() => setSelectedProductDetail(product)}
                  className="font-bold text-gray-900 text-sm line-clamp-1 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {product.nameBn}
                </h4>

                <div className="flex items-baseline justify-between mt-2 mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-lg font-black"
                      style={{ color: 'var(--theme-primary, #dc2626)' }}
                    >
                      ৳{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{product.unit}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setSelectedProductDetail(product)}
                  className="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-gray-500" />
                  <span>বিস্তারিত</span>
                </button>
                <button
                  onClick={() => setCheckoutProduct(product)}
                  className="px-2 py-2 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-transform hover:scale-102 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>কিনুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
