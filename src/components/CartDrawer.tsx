import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    setCheckoutProduct,
  } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCheckoutProduct(null); // Triggers cart checkout
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-slide-left border-l border-gray-100">
        {/* Drawer Header */}
        <div
          style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
          className="p-4 md:p-5 text-white flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-black text-lg">আপনার শপিং কার্ট</h2>
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} আইটেম
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400 space-y-3">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-700 text-sm">আপনার কার্ট খালি!</p>
              <p className="text-xs text-gray-500">দিনাজপুর ও রাজশাহীর তাজা লিচু কার্টে যোগ করুন।</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-sm"
              >
                <img
                  src={item.product.image}
                  alt={item.product.nameBn}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 truncate">
                    {item.product.nameBn}
                  </h4>
                  <div className="text-xs font-black mt-0.5" style={{ color: 'var(--theme-primary, #dc2626)' }}>
                    ৳{item.product.price} <span className="text-[10px] text-gray-400 font-normal">/ {item.product.unit}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="আইটেম মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-gray-900">
                    ৳{item.product.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>পণ্য মূল্য:</span>
                <span className="font-bold text-gray-900">৳{subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি ফি:</span>
                <span className="text-gray-500">পরের ধাপে হিসাব করা হবে</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>সাবটোটাল:</span>
                <span className="text-base font-black" style={{ color: 'var(--theme-primary, #dc2626)' }}>
                  ৳{subtotal.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              style={{ backgroundColor: 'var(--theme-primary, #dc2626)' }}
              className="w-full py-3.5 hover:opacity-90 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
