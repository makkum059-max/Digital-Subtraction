import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

export const TrackOrderModal: React.FC = () => {
  const { trackOrderModalOpen, setTrackOrderModalOpen, orders } = useStore();
  const [searchKey, setSearchKey] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!trackOrderModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const key = searchKey.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === key ||
        (o.invoice_id && o.invoice_id.toUpperCase() === key) ||
        (o.paymentTrxId && o.paymentTrxId.toUpperCase() === key) ||
        o.customerPhone.includes(searchKey.trim())
    );
    setSearchedOrder(found || null);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-100 animate-slide-up">
        <button
          onClick={() => setTrackOrderModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">অর্ডার ট্র্যাকিং</h3>
            <p className="text-xs text-gray-500">আপনার অর্ডার নম্বর বা ফোন নম্বর দিন</p>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="যেমন: ORD-1092 অথবা 01712345678"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
              autoFocus
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-red-600/20"
          >
            খুঁজুন
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {searchedOrder ? (
              <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">অর্ডার নম্বর:</span>
                    <h4 className="text-base font-black text-red-700 font-mono">{searchedOrder.id}</h4>
                    {searchedOrder.invoice_id && (
                      <span className="text-[11px] text-gray-500 font-mono block">
                        Invoice ID: <strong className="text-purple-700 font-bold">{searchedOrder.invoice_id}</strong>
                      </span>
                    )}
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full uppercase">
                    {searchedOrder.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="py-4">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${(getStepIndex(searchedOrder.status) / 3) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {['অর্ডার গ্রহন', 'প্রসেসিং', 'কুরিয়ারে হস্তান্তর', 'ডেলিভার্ড'].map((step, idx) => {
                      const currentStep = getStepIndex(searchedOrder.status);
                      const isCompleted = idx <= currentStep;
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white border-2 border-gray-300 text-gray-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info summary */}
                <div className="text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                  <p><strong>গ্রাহক:</strong> {searchedOrder.customerName} ({searchedOrder.customerPhone})</p>
                  <p><strong>ঠিকানা:</strong> {searchedOrder.address}, {searchedOrder.district}</p>
                  <p><strong>সর্বমোট বিল:</strong> ৳{searchedOrder.totalAmount} ({searchedOrder.paymentMethod.toUpperCase()})</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-red-50/50 rounded-2xl border border-red-100 text-gray-600">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">কোনো অর্ডার পাওয়া যায়নি!</p>
                <p className="text-xs text-gray-500 mt-1">দয়া করে সঠিক অর্ডার আইডি বা মোবাইল নম্বর দিন।</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
