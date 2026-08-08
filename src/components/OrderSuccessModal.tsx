import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Printer, MessageSquare, Truck, X, ExternalLink, Copy, CreditCard } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { lastOrder, setLastOrder, settings, setTrackOrderModalOpen, showToast } = useStore();

  if (!lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `হ্যালো, আমি অর্ডার করার কথা জানাতে চাই।\nঅর্ডার আইডি: ${lastOrder.id}\nনাম: ${lastOrder.customerName}\nমোবাইল: ${lastOrder.customerPhone}\nমোট বিল: ৳${lastOrder.totalAmount}`
  );

  const ziniPayLink = lastOrder.ziniPayUrl || `${settings.ziniPayEndpoint || 'https://api.zinipay.com/v1/payment/create'}?invoice_id=${lastOrder.invoice_id || lastOrder.id}&amount=${lastOrder.totalAmount}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-gray-100 animate-slide-up my-auto print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Close Button */}
        <button
          onClick={() => setLastOrder(null)}
          className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-500 hover:text-gray-800 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="bg-emerald-600 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black">অর্ডার সফলভাবে গ্রহন করা হয়েছে!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            ধন্যবাদ {lastOrder.customerName}! আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4">
          {/* Order ID & Date Box */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">অর্ডার নম্বর:</span>
              <div className="text-lg font-black text-red-700 font-mono">{lastOrder.id}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-500">পেমেন্ট পদ্ধতি:</span>
              <div className="font-bold text-gray-900 uppercase">{lastOrder.paymentMethod}</div>
            </div>
          </div>

          {/* Auto ZiniPay Payment Link Banner */}
          {lastOrder.paymentMethod === 'zinipay' && (
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-4 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-400 text-gray-950 font-black rounded-lg flex items-center justify-center text-xs">
                    ⚡
                  </div>
                  <span className="font-black text-xs text-amber-300">ZiniPay অটোমেটেড পেমেন্ট লিঙ্ক</span>
                </div>
                <span className="bg-white/20 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                  লাইভ লিঙ্ক
                </span>
              </div>

              <p className="text-xs text-violet-100">
                বিকাশ, নগদ, রকেট বা ব্যাংক কার্ডের মাধ্যমে ইন্সট্যান্ট অনলাইন পেমেন্ট করতে নিচের বাটনে ক্লিক করুন:
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={ziniPayLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>⚡ ZiniPay দিয়ে পেমেন্ট করুন (৳{lastOrder.totalAmount})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ziniPayLink);
                    showToast('ZiniPay পেমেন্ট লিঙ্ক কপি করা হয়েছে!');
                  }}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="লিঙ্ক কপি করুন"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>লিঙ্ক কপি</span>
                </button>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
            <div className="font-bold text-gray-900">ডেলিভারি ঠিকানা:</div>
            <p>{lastOrder.customerName} ({lastOrder.customerPhone})</p>
            <p className="text-gray-500">{lastOrder.address}, {lastOrder.district}</p>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-xs text-gray-900 mb-2">পণ্য তালিকা:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.productName} className="w-8 h-8 rounded object-cover" />
                    <span className="font-medium text-gray-800 truncate max-w-[180px]">{item.productName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">{item.quantity} প্যাক × ৳{item.price}</span>
                    <div className="font-bold text-gray-900">৳{item.quantity * item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-gray-200 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>সাবটোটাল:</span>
              <span>৳{lastOrder.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>ডেলিভারি ফি:</span>
              <span>৳{lastOrder.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-gray-900 pt-1 border-t border-gray-100">
              <span>সর্বমোট প্রদানযোগ্য:</span>
              <span className="text-red-600">৳{lastOrder.totalAmount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2 print:hidden">
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>মেমো প্রিন্ট করুন</span>
              </button>

              <button
                onClick={() => {
                  setLastOrder(null);
                  setTrackOrderModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Truck className="w-4 h-4" />
                <span>অর্ডার ট্র্যাক করুন</span>
              </button>
            </div>

            <a
              href={`https://wa.me/88${settings.phoneWhatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে অর্ডারের কনফার্মেশন পাঠান</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
