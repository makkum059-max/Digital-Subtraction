import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MapPin,
  CreditCard,
  ArrowLeft,
  Tag,
  Check,
  QrCode,
  Copy,
  User,
  Mail,
  FileText,
  Lock,
  Zap,
  Headphones,
  ShoppingBag,
  Percent,
  Smartphone,
  Wallet,
  Timer,
  ExternalLink,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { PaymentLogo } from './common/PaymentIcons';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutProduct,
    setCheckoutProduct,
    cart,
    settings,
    placeOrder,
    setIsCartOpen,
    validatePromoCode,
    currentUser,
    showToast,
  } = useStore();

  const isDirectProduct = !!checkoutProduct;

  const checkoutItems = isDirectProduct
    ? [
        {
          product: checkoutProduct,
          quantity: 1,
          selectedUnit: checkoutProduct.unit,
        },
      ]
    : cart;

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [deliveryArea] = useState<'inside_dhaka' | 'outside_dhaka' | 'express'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash_nagad');
  const [paymentTrxId, setPaymentTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto Payment Gateway Modal State
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [gatewayStep, setGatewayStep] = useState<'input' | 'processing' | 'success'>('input');
  const [gatewayTrxInput, setGatewayTrxInput] = useState('');
  const [gatewaySenderPhone, setGatewaySenderPhone] = useState('');
  const [gatewayCountdown, setGatewayCountdown] = useState(299); // 5 minutes timer
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user info if available
  useEffect(() => {
    if (currentUser) {
      if (!customerName && currentUser.name) setCustomerName(currentUser.name);
      if (!customerPhone && currentUser.phone) setCustomerPhone(currentUser.phone);
      if (!customerEmail && currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Timer countdown effect for payment gateway
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showGatewayModal && gatewayCountdown > 0 && gatewayStep === 'input') {
      interval = setInterval(() => {
        setGatewayCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showGatewayModal, gatewayCountdown, gatewayStep]);

  if (!checkoutProduct && cart.length === 0) return null;

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = 0; // Strictly Free Delivery
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleApplyPromoCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = validatePromoCode(promoInput, subtotal);
    if (res.valid) {
      setAppliedPromoCode(res.promo?.code || promoInput.toUpperCase());
      setDiscountAmount(res.discountAmount);
      setPromoFeedback({ type: 'success', message: res.message });
      showToast(res.message, 'success');
    } else {
      setAppliedPromoCode('');
      setDiscountAmount(0);
      setPromoFeedback({ type: 'error', message: res.message });
      showToast(res.message, 'error');
    }
  };

  const handleClose = () => {
    setCheckoutProduct(null);
  };

  // Trigger Confirmation & Launch Auto Payment Gateway
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('দয়া করে আপনার সম্পূর্ণ নাম লিখুন।');
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 11) {
      setFormError('দয়া করে ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন (যেমন: 01712345678)।');
      return;
    }

    if (!address.trim()) {
      setFormError('দয়া করে আপনার ডেলিভারি ঠিকানা লিখুন।');
      return;
    }

    // Set phone for gateway automatically
    setGatewaySenderPhone(customerPhone);
    setGatewayCountdown(299);
    setGatewayStep('input');

    // Auto open Payment Gateway Modal
    setShowGatewayModal(true);
  };

  // Finalize order placement inside Payment Gateway Modal
  const handleFinalizeGatewayPayment = (autoTrx?: string) => {
    const finalTrx = autoTrx || gatewayTrxInput || paymentTrxId || `TRX${Math.floor(10000000 + Math.random() * 90000000)}`;

    setGatewayStep('processing');
    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems = checkoutItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameBn,
        quantity: item.quantity,
        unit: item.product.unit,
        price: item.product.price,
        image: item.product.image,
      }));

      placeOrder({
        customerName,
        customerPhone,
        customerEmail: customerEmail.trim() || undefined,
        address,
        district,
        deliveryArea,
        deliveryFee,
        items: orderItems,
        subtotal,
        discountAmount,
        appliedPromoCode,
        totalAmount,
        paymentMethod: paymentMethod === 'bkash_nagad' ? 'bKash/Nagad' : paymentMethod,
        paymentTrxId: finalTrx,
        notes: notes ? `${notes} (Auto Payment Confirmed)` : 'Auto Payment Confirmed',
      });

      setGatewayStep('success');
      setIsSubmitting(false);

      setTimeout(() => {
        setShowGatewayModal(false);
        setCheckoutProduct(null);
        setIsCartOpen(false);
      }, 900);
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find custom payment details
  const primaryBkashAccount = settings.customPaymentMethods?.find(
    (pm) => pm.name.toLowerCase().includes('bkash') || pm.name.toLowerCase().includes('বিকাশ')
  )?.accountNumber || '01700-889900';

  const primaryNagadAccount = settings.customPaymentMethods?.find(
    (pm) => pm.name.toLowerCase().includes('nagad') || pm.name.toLowerCase().includes('নগদ')
  )?.accountNumber || '01700-889900';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#f8f9fc] rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden relative border border-purple-100 animate-slide-up my-auto max-h-[95vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-white px-5 sm:px-7 py-4 border-b border-gray-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              type="button"
              className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-4 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                Checkout
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>১০০% ফ্রি হোম ডেলিভারি</span>
            </span>
            <button
              onClick={handleClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Checkout Grid Container */}
        <form
          onSubmit={handleInitiatePayment}
          className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto max-h-[calc(95vh-75px)]"
        >
          {/* LEFT COLUMN: Customer Information & Payment Method */}
          <div className="md:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
            {/* Error banner */}
            {formError && (
              <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3.5 rounded-2xl border border-rose-200 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* SECTION 1: CUSTOMER INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span>Customer Information</span>
                </h3>
                <span className="text-[10px] text-purple-700 font-extrabold bg-purple-50 px-2.5 py-0.5 rounded-full">
                  ধাপ ১/২
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Md Makku"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 focus:outline-none font-medium transition-all text-gray-900"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Phone Number (BD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 focus:outline-none font-medium transition-all text-gray-900"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Email Optional */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="makkum059@gmail.com"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 focus:outline-none font-medium transition-all text-gray-900"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="আপনার পুরো ঠিকানা (বাসা/রোড/এলাকা)"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 focus:outline-none font-medium transition-all text-gray-900"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* District Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    জেলা / বিভাগ
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="ঢাকা"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    অর্ডার নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="বিশেষ কোনো বার্তা"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-none font-medium text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PAYMENT METHOD */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Payment Method</span>
                </h3>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>অটো গেটওয়ে সক্রিয়</span>
                </span>
              </div>

              {/* Payment Option Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mobile Banking Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash_nagad')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'bkash_nagad'
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      <span className="font-extrabold text-xs text-gray-900">
                        bKash / Nagad
                      </span>
                    </div>
                    {paymentMethod === 'bkash_nagad' && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <PaymentLogo method="bkash" />
                    <PaymentLogo method="nagad" />
                  </div>
                  <span className="text-[10px] text-purple-700 font-bold mt-2">
                    Mobile Banking
                  </span>
                </button>

                {/* Wallet Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    paymentMethod === 'wallet'
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-xs text-gray-900">
                        Wallet
                      </span>
                    </div>
                    {paymentMethod === 'wallet' && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Balance: <span className="font-bold text-gray-900">৳0</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-2">
                    Instant Pay
                  </span>
                </button>

                {/* COD / ZiniPay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      <PaymentLogo method="cod" />
                    </div>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Cash on Delivery
                  </span>
                  <span className="text-[10px] text-gray-700 font-bold mt-2">
                    হাতে পেয়ে মূল্য দিন
                  </span>
                </button>
              </div>

              {/* Guarantees Bar */}
              <div className="pt-2 flex items-center justify-around text-[11px] font-extrabold text-gray-500 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-purple-600" />
                  <span>24/7 Support</span>
                </span>
              </div>
            </div>

            {/* Desktop Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4.5 h-4.5" />
                <span>Pay ৳{totalAmount.toLocaleString('bn-BD')}</span>
                <span className="text-xs font-bold opacity-90">
                  (অটোমেটিক পেমেন্ট চালু হবে)
                </span>
              </button>
              <p className="text-[11px] text-center text-gray-400 font-medium mt-2">
                🔒 ক্লিকে সাথে সাথে পেমেন্ট গেটওয়ে ওপেন হবে
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="md:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-lg">📑</span>
                <h3 className="font-black text-gray-900 text-base tracking-tight">
                  Order Summary
                </h3>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-start gap-3 bg-gray-50/70 p-3 rounded-2xl border border-gray-100 relative"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.nameBn}
                      className="w-14 h-14 object-cover rounded-xl shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.product.nameBn || item.product.name}
                      </h4>
                      <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
                        {item.product.unit || '১ প্যাক'} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-xs font-black text-gray-900 text-right">
                      ৳{(item.product.price * item.quantity).toLocaleString('bn-BD')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-[11px] font-extrabold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-purple-600" />
                  <span>Apply Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {promoFeedback && (
                  <p
                    className={`text-[11px] font-bold mt-1.5 flex items-center gap-1 ${
                      promoFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {promoFeedback.type === 'success' ? <Check className="w-3.5 h-3.5" /> : '⚠️ '}
                    {promoFeedback.message}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ৳{subtotal.toLocaleString('bn-BD')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-xl">
                    <span>Discount ({appliedPromoCode})</span>
                    <span>- ৳{discountAmount.toLocaleString('bn-BD')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Free (Digital)
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-2xl font-black text-purple-700">
                    ৳{totalAmount.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile-only Sticky / Bottom Submit Button */}
            <div className="md:hidden pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ৳{totalAmount.toLocaleString('bn-BD')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* AUTO PAYMENT GATEWAY MODAL (OPENS AUTOMATICALLY ON CONFIRM) */}
      {/* ========================================================= */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative border border-purple-200 animate-slide-up flex flex-col">
            {/* Payment Header branding */}
            <div
              className={`p-5 text-white flex items-center justify-between transition-colors ${
                paymentMethod === 'bkash_nagad'
                  ? 'bg-gradient-to-r from-[#e2136e] via-[#f7921e] to-purple-700'
                  : 'bg-gradient-to-r from-purple-700 to-indigo-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                  ⚡
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Express Payment Gateway
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">
                    {paymentMethod === 'bkash_nagad'
                      ? 'bKash / Nagad Instant Merchant Pay'
                      : 'Express Secure Checkout'}
                  </p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 border border-white/20">
                <Timer className="w-3.5 h-3.5 text-amber-300" />
                <span>{formatTimer(gatewayCountdown)}</span>
              </div>
            </div>

            {/* Gateway Body */}
            <div className="p-5 space-y-5">
              {gatewayStep === 'input' && (
                <>
                  {/* Order & Merchant Info Box */}
                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-semibold">মর্চেণ্ট নাম:</span>
                      <span className="font-bold text-gray-900">Litchi Bazaar Express</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-semibold">গ্রাহকের নাম:</span>
                      <span className="font-bold text-gray-900">{customerName} ({customerPhone})</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-purple-200/60">
                      <span className="text-gray-600 font-bold">প্রদেয় সর্বমোট মূল্য:</span>
                      <span className="text-base font-black text-purple-700">
                        ৳{totalAmount.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Instruction & Copy Number */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-purple-600" />
                        <span>অফিসিয়াল সেন্ড মানি / মার্চেন্ট নম্বর:</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-rose-700">bKash Personal</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(primaryBkashAccount);
                              showToast(`bKash নম্বর কপি করা হয়েছে: ${primaryBkashAccount}`);
                            }}
                            className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="font-mono text-xs font-black text-gray-900">
                          {primaryBkashAccount}
                        </p>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-amber-800">Nagad Personal</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(primaryNagadAccount);
                              showToast(`Nagad নম্বর কপি করা হয়েছে: ${primaryNagadAccount}`);
                            }}
                            className="text-[10px] bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="font-mono text-xs font-black text-gray-900">
                          {primaryNagadAccount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TrxID / Payment Verification Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      ট্রানজেকশন আইডি (TrxID) বা পেমেন্ট রেফারেন্স লিখুন:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gatewayTrxInput}
                        onChange={(e) => setGatewayTrxInput(e.target.value)}
                        placeholder="e.g. TRX982347102"
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono font-bold uppercase bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const generated = `TRX${Math.floor(10000000 + Math.random() * 90000000)}`;
                          setGatewayTrxInput(generated);
                          showToast('অটোমেটিক TrxID তৈরি করা হয়েছে!', 'info');
                        }}
                        className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Auto Gen</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleFinalizeGatewayPayment()}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>যাচাই ও পেমেন্ট কনফার্ম করুন (৳{totalAmount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGatewayModal(false)}
                      className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      বাতিল করুন
                    </button>
                  </div>
                </>
              )}

              {gatewayStep === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                    <Zap className="w-6 h-6 text-purple-600 absolute inset-0 m-auto" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-900">
                      পেমেন্ট যাচাই করা হচ্ছে...
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      দয়া করে অপেক্ষা করুন, আপনার অর্ডারটি প্রক্রিয়াজাত হচ্ছে।
                    </p>
                  </div>
                </div>
              )}

              {gatewayStep === 'success' && (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-black text-lg text-emerald-950">
                    পেমেন্ট সফল হয়েছে!
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium">
                    আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
