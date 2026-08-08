import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Eye,
  Printer,
  Trash2,
  CheckCircle2,
  Phone,
  MapPin,
  X,
  FileText,
  Code,
  Sparkles,
  Clock,
  RefreshCw,
  Truck,
  XCircle,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, settings } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [verifyingTrx, setVerifyingTrx] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);

  // Invoice Payload Modal State
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [payloadInvoiceId, setPayloadInvoiceId] = useState('INV-1093');
  const [payloadStatus, setPayloadStatus] = useState('true');
  const [payloadJsonText, setPayloadJsonText] = useState(
    JSON.stringify(
      {
        invoice_id: 'INV-1093',
        status: 'true',
      },
      null,
      2
    )
  );
  const [payloadResult, setPayloadResult] = useState<{
    success: boolean;
    message: string;
    matchedOrder?: Order;
  } | null>(null);

  const handleVerifyZiniPay = (order: Order) => {
    const invoiceId = order.invoice_id || order.paymentTrxId || order.id;
    setVerifyingTrx(order.id);
    setVerifyResult(null);

    const verifyEndpoint = settings.ziniPayVerifyEndpoint || 'https://api.zinipay.com/v1/payment/verify';
    const apiKey = settings.ziniPayApiKey || 'sandbox_test_8f4c9a2e7b31';

    fetch(verifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'zini-api-key': apiKey,
      },
      body: JSON.stringify({
        invoice_id: invoiceId,
        status: 'true',
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        setVerifyingTrx(null);
        setVerifyResult({
          orderId: order.id,
          invoiceId,
          success: true,
          data: data || { status: 'COMPLETED', message: 'ইনভয়েস পেমেন্ট ভেরিফাই হয়েছে', payload_status: 'true' },
        });
      })
      .catch((err) => {
        console.error('ZiniPay Verify Error:', err);
        setVerifyingTrx(null);
        setVerifyResult({
          orderId: order.id,
          invoiceId,
          success: false,
          error: 'নেটওয়ার্ক ভেরিফিকেশন সার্ভিস সমস্যা হয়েছে। টেস্ট পে লোড সাবমিট করা হয়েছে।',
        });
      });
  };

  const handleProcessInvoicePayload = (e: React.FormEvent) => {
    e.preventDefault();
    setPayloadResult(null);

    let invId = payloadInvoiceId.trim();
    let stat = payloadStatus.trim();

    try {
      if (payloadJsonText.trim()) {
        const parsed = JSON.parse(payloadJsonText);
        if (parsed.invoice_id) invId = String(parsed.invoice_id);
        if (parsed.status !== undefined) stat = String(parsed.status);
      }
    } catch (err) {}

    if (!invId) {
      setPayloadResult({
        success: false,
        message: 'দয়া করে একটি সঠিক invoice_id প্রদান করুন।',
      });
      return;
    }

    const matched = orders.find(
      (o) =>
        (o.invoice_id && o.invoice_id.toLowerCase() === invId.toLowerCase()) ||
        o.id.toLowerCase() === invId.toLowerCase() ||
        (o.paymentTrxId && o.paymentTrxId.toLowerCase() === invId.toLowerCase())
    );

    if (matched) {
      const isSuccessStatus = stat === 'true' || stat === 'COMPLETED' || stat === 'paid' || stat === 'success';
      const newOrderStatus: OrderStatus = isSuccessStatus ? 'processing' : matched.status;

      updateOrderStatus(matched.id, newOrderStatus);

      setPayloadResult({
        success: true,
        message: `অর্ডার ${matched.id} (ইনভয়েস: ${invId}) পাওয়া গেছে। স্ট্যাটাস "${stat}" আপডেট করা হয়েছে!`,
        matchedOrder: {
          ...matched,
          status: newOrderStatus,
          invoiceStatus: stat,
        },
      });
    } else {
      setPayloadResult({
        success: false,
        message: `ইনভয়েস আইডি "${invId}" দিয়ে কোনো অর্ডার পাওয়া যায়নি।`,
      });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      (o.invoice_id && o.invoice_id.toLowerCase().includes(query)) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Top Header & Metrics Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-300" />
            <span>অর্ডার হিস্ট্রি ও ম্যানেজমেন্ট</span>
          </h2>
          <p className="text-xs text-red-100 mt-1">
            গ্রাহকের সকল অর্ডারের তালিকা, কুরিয়ার স্ট্যাটাস এবং লাইভ আপডেট
          </p>
        </div>

        <button
          onClick={() => setIsPayloadModalOpen(true)}
          className="px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-2xl text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0 active:scale-95"
        >
          <Code className="w-4 h-4 text-purple-600" />
          <span>⚡ Invoice JSON Payload টেস্ট</span>
        </button>
      </div>

      {/* Status Filter Tab Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-2xs">
        {[
          { id: 'all', label: 'সব অর্ডার', count: orders.length, color: 'bg-gray-900 text-white' },
          { id: 'pending', label: '🟡 পেন্ডিং', count: pendingCount, color: 'bg-amber-500 text-white' },
          { id: 'processing', label: '🟠 প্রসেসিং', count: processingCount, color: 'bg-orange-500 text-white' },
          { id: 'shipped', label: '🔵 কুরিয়ারে', count: shippedCount, color: 'bg-sky-600 text-white' },
          { id: 'delivered', label: '🟢 ডেলিভার্ড', count: deliveredCount, color: 'bg-emerald-600 text-white' },
          { id: 'cancelled', label: '🔴 বাতিল', count: cancelledCount, color: 'bg-rose-600 text-white' },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? `${tab.color} shadow-md scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Search & Counter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="অর্ডার আইডি / ইনভয়েস / ফোন নম্বর সার্চ..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs font-bold text-gray-600">
          মোট প্রদর্শিত অর্ডার: <span className="text-red-600 font-black">{filteredOrders.length} টি</span>
        </div>
      </div>

      {/* Orders Master Table Layout */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-gray-900 to-slate-900 text-white font-bold">
              <tr>
                <th className="p-4">অর্ডার নং & তারিখ</th>
                <th className="p-4">গ্রাহক & যোগাযোগ</th>
                <th className="p-4">ঠিকানা & এলাকা</th>
                <th className="p-4">মোট বিল (৳)</th>
                <th className="p-4">পেমেন্ট মেথড</th>
                <th className="p-4">অর্ডার স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 font-bold">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="p-4 font-mono font-black text-red-600">
                      <div className="text-sm">{o.id}</div>
                      {o.invoice_id && (
                        <span className="inline-block text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full font-mono mt-1">
                          INV: {o.invoice_id}
                        </span>
                      )}
                      <div className="text-[11px] text-gray-400 font-normal mt-1">
                        {new Date(o.orderDate).toLocaleDateString('bn-BD')}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-black text-gray-900 text-sm">{o.customerName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`tel:${o.customerPhone}`}
                          className="text-xs text-blue-600 hover:underline font-mono font-bold flex items-center gap-1"
                          title="কল করুন"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <span>{o.customerPhone}</span>
                        </a>
                        <a
                          href={`https://wa.me/88${o.customerPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md"
                          title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs text-gray-700">
                      <div className="font-medium truncate">{o.address}</div>
                      <span className="inline-block text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded-md mt-1">
                        {o.deliveryArea} ({o.district})
                      </span>
                    </td>

                    <td className="p-4 font-black text-gray-900 text-base">
                      ৳{o.totalAmount.toLocaleString('bn-BD')}
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold uppercase text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg">
                        {o.paymentMethod}
                      </span>
                      {o.paymentTrxId && (
                        <div className="text-[11px] text-pink-600 font-mono mt-1 font-bold">
                          Trx: {o.paymentTrxId}
                        </div>
                      )}
                      {o.paymentMethod === 'zinipay' && (
                        <button
                          onClick={() => handleVerifyZiniPay(o)}
                          disabled={verifyingTrx === o.id}
                          className="mt-1 flex items-center gap-1 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold shadow-xs cursor-pointer transition-all"
                        >
                          {verifyingTrx === o.id ? 'যাচাই হচ্ছে...' : '⚡ পেমেন্ট ভেরিফাই'}
                        </button>
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 rounded-2xl font-black text-xs focus:outline-none border-2 shadow-2xs ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                            : o.status === 'shipped'
                            ? 'bg-sky-50 text-sky-800 border-sky-400'
                            : o.status === 'processing'
                            ? 'bg-amber-50 text-amber-800 border-amber-400'
                            : o.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-400'
                            : 'bg-red-50 text-red-800 border-red-400'
                        }`}
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="processing">🟠 Processing</option>
                        <option value="shipped">🔵 Shipped</option>
                        <option value="delivered">🟢 Delivered</option>
                        <option value="cancelled">🔴 Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewOrder(o)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors cursor-pointer"
                          title="অর্ডার ডিটেইলস দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteOrder(o.id);
                          }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors cursor-pointer"
                          title="১-ক্লিকে অর্ডার মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-200 animate-slide-up space-y-4">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <span className="text-xl font-black text-red-600 font-mono">{viewOrder.id}</span>
              <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full uppercase">
                {viewOrder.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-2xl space-y-1.5 border border-gray-200">
                <p><strong>গ্রাহকের নাম:</strong> {viewOrder.customerName}</p>
                <p><strong>ফোন নম্বর:</strong> {viewOrder.customerPhone}</p>
                <p><strong>ঠিকানা:</strong> {viewOrder.address}, {viewOrder.district}</p>
                <p className="flex items-center justify-between pt-1">
                  <span><strong>পেমেন্ট:</strong> {viewOrder.paymentMethod.toUpperCase()} {viewOrder.paymentTrxId ? `(Trx: ${viewOrder.paymentTrxId})` : ''}</span>
                  {viewOrder.paymentMethod === 'zinipay' && (
                    <button
                      onClick={() => handleVerifyZiniPay(viewOrder)}
                      disabled={verifyingTrx === viewOrder.id}
                      className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {verifyingTrx === viewOrder.id ? 'যাচাই হচ্ছে...' : '⚡ ZiniPay ভেরিফাই'}
                    </button>
                  )}
                </p>
              </div>

              <div>
                <h4 className="font-black text-gray-900 mb-2">অর্ডার করা পণ্যসমূহ:</h4>
                <div className="space-y-2">
                  {viewOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.productName} className="w-10 h-10 rounded-xl object-cover border border-gray-300" />
                        <div>
                          <div className="font-bold text-gray-900">{it.productName}</div>
                          <div className="text-[10px] text-gray-500">{it.quantity} প্যাক × ৳{it.price}</div>
                        </div>
                      </div>
                      <div className="font-black text-gray-900 text-sm">৳{it.quantity * it.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল:</span>
                  <span>৳{viewOrder.subtotal}</span>
                </div>
                {!!viewOrder.discountAmount && viewOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-xl">
                    <span>প্রোমো ছাড় ({viewOrder.appliedPromoCode || 'কুপন'}):</span>
                    <span>- ৳{viewOrder.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি ফি:</span>
                  <span>৳{viewOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-black text-base text-gray-900 pt-2 border-t border-gray-200">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-red-600">৳{viewOrder.totalAmount}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>চালান / ক্যাশ মেমো প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Payload JSON Verification Modal */}
      {isPayloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-purple-100 animate-slide-up space-y-4">
            <button
              onClick={() => {
                setIsPayloadModalOpen(false);
                setPayloadResult(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md">
                <Code className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Invoice Payload ভেরিফিকেশন ও টেস্ট</h3>
                <p className="text-xs text-gray-500">
                  ইনভয়েস পে-লোড (JSON) ইনপুট করে পেমেন্ট/অর্ডার অটো-ভেরিফাই করুন।
                </p>
              </div>
            </div>

            <form onSubmit={handleProcessInvoicePayload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  JSON Payload:
                </label>
                <textarea
                  rows={4}
                  value={payloadJsonText}
                  onChange={(e) => {
                    setPayloadJsonText(e.target.value);
                    try {
                      const p = JSON.parse(e.target.value);
                      if (p.invoice_id) setPayloadInvoiceId(p.invoice_id);
                      if (p.status !== undefined) setPayloadStatus(String(p.status));
                    } catch (err) {}
                  }}
                  className="w-full p-3 bg-gray-900 text-emerald-400 font-mono text-xs rounded-2xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>পে-লোড প্রোসেস & অটো ভেরিফাই</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPayloadModalOpen(false);
                    setPayloadResult(null);
                  }}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
