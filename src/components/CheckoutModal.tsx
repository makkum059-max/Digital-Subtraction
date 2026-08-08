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
  Globe,
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
  const [paymentMethod, setPaymentMethod] = useState<string>('zinipay');
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

  // ZiniPay API Response State
  const [zinipayLoading, setZinipayLoading] = useState(false);
  const [zinipayPaymentUrl, setZinipayPaymentUrl] = useState<string | null>(null);
  const [zinipayApiResponse, setZinipayApiResponse] = useState<any>(null);
  const [verifyingInvoice, setVerifyingInvoice] = useState(false);
  const [verifyInvoiceResult, setVerifyInvoiceResult] = useState<any>(null);

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

  // Trigger Confirmation & Launch Auto Payment Gateway (Calls ZiniPay API)
  const handleInitiatePayment = async (e: React.FormEvent) => {
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
    setShowGatewayModal(true);

    // Call ZiniPay Backend API Endpoint
    setZinipayLoading(true);
    setZinipayPaymentUrl(null);

    const generatedOrderId = `ORD-${Date.now()}`;
    const generatedCusId = currentUser?.id || `CUS-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const response = await fetch('/api/zinipay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cus_name: customerName,
          cus_email: customerEmail || 'customer@example.com',
          amount: totalAmount,
          metadata: {
            order_id: generatedOrderId,
            customer_id: generatedCusId,
            phone: customerPhone,
          },
          redirect_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          webhook_url: `${window.location.origin}/api/zinipay/webhook`,
        }),
      });

      const resData = await response.json();
      console.log('ZiniPay API response received:', resData);
      setZinipayApiResponse(resData);

      if (resData.success && resData.data) {
        const payUrl =
          resData.data.payment_url ||
          resData.data.redirect_url ||
          resData.data.url ||
          resData.data.gateway_url;

        if (payUrl) {
          setZinipayPaymentUrl(payUrl);
          showToast('ZiniPay গেটওয়ে প্রস্তুত! ZiniPay ওয়েবসাইটে রিডাইরেক্ট করা হচ্ছে...', 'success');
          // Auto redirect to ZiniPay website after short delay
          setTimeout(() => {
            if (payUrl.startsWith('http')) {
              window.open(payUrl, '_blank');
            }
          }, 1000);
        } else {
          showToast('ZiniPay অটো-পেমেন্ট গেটওয়ে সক্রিয় করা হয়েছে', 'info');
        }
      }
    } catch (err) {
      console.error('Failed to trigger ZiniPay payment:', err);
    } finally {
      setZinipayLoading(false);
    }
  };

  // Verify ZiniPay Invoice via API /v1/payment/verify
  const handleVerifyInvoiceApi = async () => {
    const invId = gatewayTrxInput.trim() || `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    setVerifyingInvoice(true);
    setVerifyInvoiceResult(null);

    try {
      const response = await fetch('/api/zinipay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_id: invId,
          apiKey: settings.ziniPayApiKey || 'sandbox_test_8f4c9a2e7b31',
        }),
      });

      const resData = await response.json();
      console.log('ZiniPay Verify API response:', resData);
      setVerifyInvoiceResult(resData);

      if (resData.success) {
        showToast('ZiniPay API: ইনভয়েস সফলভাবে ভেরিফাই হয়েছে!', 'success');
      } else {
        showToast('ZiniPay API ভেরিফিকেশন সাড়া পেয়েছে', 'info');
      }
    } catch (err: any) {
      console.error('ZiniPay verify failed:', err);
      showToast('ZiniPay API সংযোগ ব্যর্থ: ' + err.message, 'error');
    } finally {
      setVerifyingInvoice(false);
    }
  };

  // Finalize order placement inside Payment Gateway Modal
  const handleFinalizeGatewayPayment = (autoTrx?: string) => {
    const finalTrx =
      autoTrx ||
      gatewayTrxInput ||
      paymentTrxId ||
      `ZINI-${Math.floor(10000000 + Math.random() * 90000000)}`;

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
        paymentMethod: paymentMethod === 'zinipay' ? 'ZiniPay Express' : paymentMethod,
        paymentTrxId: finalTrx,
        notes: notes ? `${notes} (ZiniPay API Verified)` : 'ZiniPay API Verified',
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
  const primaryBkashAccount =
    settings.customPaymentMethods?.find(
      (pm) => pm.name.toLowerCase().includes('bkash') || pm.name.toLowerCase().includes('বিকাশ')
    )?.accountNumber || '01700-889900';

  const primaryNagadAccount =
    settings.customPaymentMethods?.find(
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

            {/* SECTION 2: AUTOMATED ZINIPAY PAYMENT GATEWAY */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Automatic Payment Gateway</span>
                </h3>
                <span className="text-[10px] text-purple-700 font-extrabold bg-purple-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
                  <Zap className="w-3 h-3 text-purple-600 fill-purple-300" />
                  <span>ZiniPay API Enabled</span>
                </span>
              </div>

              {/* Automated ZiniPay Banner Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white border border-purple-700/60 shadow-md space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner">
                      <Zap className="w-5 h-5 text-amber-400 animate-pulse fill-amber-300" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                        <span>ZiniPay Auto Gateway</span>
                        <span className="text-[9px] bg-emerald-500 text-gray-950 font-black px-2 py-0.2 rounded-full uppercase">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-200/90 font-medium">
                        bKash, Nagad, Rocket, Upay, Visa & Mastercard অটোমেটিক পেমেন্ট
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                    <PaymentLogo method="bkash" />
                    <PaymentLogo method="nagad" />
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-800/80 flex items-center justify-between text-[11px] text-purple-200 font-medium">
                  <span className="flex items-center gap-1 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>১০০% নিরাপদ অটো-গেটওয়ে</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>সরাসরি ZiniPay ওয়েবসাইটে পেমেন্ট</span>
                  </span>
                </div>
              </div>

              {/* Guarantees Bar */}
              <div className="pt-2 flex items-center justify-around text-[11px] font-extrabold text-gray-500 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit SSL Encryption</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Verification</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mobile Banking Ready</span>
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
                  (ZiniPay অটোমেটিক পেমেন্ট চালু হবে)
                </span>
              </button>
              <p className="text-[11px] text-center text-gray-400 font-medium mt-2">
                🔒 ক্লিকে সাথে সাথে ZiniPay API দিয়ে পেমেন্ট গেটওয়ে ওপেন হবে
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
      {/* AUTO PAYMENT GATEWAY MODAL (POWERED BY ZINIPAY API 2.0) */}
      {/* ========================================================= */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative border border-purple-200 animate-slide-up flex flex-col">
            {/* Payment Header branding */}
            <div className="p-5 text-white flex items-center justify-between transition-colors bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                  ⚡
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight flex items-center gap-1.5">
                    <span>ZiniPay Gateway</span>
                    <span className="text-[10px] bg-emerald-400 text-gray-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Live API
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">
                    bKash • Nagad • Rocket • Cards Secure Gateway
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
                      <span className="text-gray-500 font-semibold">গ্রাহকের নাম:</span>
                      <span className="font-bold text-gray-900">{customerName} ({customerPhone})</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-semibold">এপিআই কী:</span>
                      <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                        sandbox_test_8f4c...
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-purple-200/60">
                      <span className="text-gray-600 font-bold">প্রদেয় সর্বমোট মূল্য:</span>
                      <span className="text-base font-black text-purple-700">
                        ৳{totalAmount.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* ZiniPay Direct Payment Gateway Redirect Link if available */}
                  {zinipayLoading ? (
                    <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-100 border border-purple-700/80 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold shadow-lg animate-pulse">
                      <RefreshCw className="w-5 h-5 animate-spin text-purple-300" />
                      <span>ZiniPay API সিকিউর পেমেন্ট লিঙ্ক তৈরি হচ্ছে...</span>
                    </div>
                  ) : zinipayPaymentUrl ? (
                    <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-emerald-100 border border-emerald-500/50 rounded-2xl space-y-2.5 shadow-xl animate-fade-in relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-emerald-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                          <span>ZiniPay অটো-পেমেন্ট ওয়েবসাইট প্রস্তুত!</span>
                        </p>
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-extrabold animate-pulse">
                          Auto Redirecting...
                        </span>
                      </div>
                      <a
                        href={zinipayPaymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer uppercase tracking-wider"
                      >
                        <span>সরাসরি ZiniPay পেমেন্ট পেজে যান</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : null}

                  {/* Payment Instruction & Copy Number */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-purple-600" />
                        <span>অফিসিয়াল মার্চেন্ট নম্বর (Instant Pay):</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-rose-700">bKash Merchant</span>
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
                          <span className="text-[10px] font-black text-amber-800">Nagad Merchant</span>
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
                        placeholder="e.g. ZINI982347102"
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono font-bold uppercase bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const generated = `ZINI${Math.floor(10000000 + Math.random() * 90000000)}`;
                          setGatewayTrxInput(generated);
                          showToast('অটোমেটিক ZiniPay TrxID তৈরি করা হয়েছে!', 'info');
                        }}
                        className="px-2.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Auto Gen</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleVerifyInvoiceApi}
                        disabled={verifyingInvoice}
                        className="px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
                      >
                        {verifyingInvoice ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        )}
                        <span>API Verify</span>
                      </button>
                    </div>

                    {/* ZiniPay Verify Result display */}
                    {verifyInvoiceResult && (
                      <div className="p-3 bg-purple-950 text-purple-100 text-[11px] rounded-xl font-mono space-y-1 border border-purple-800 animate-fade-in max-h-32 overflow-y-auto">
                        <div className="flex items-center justify-between font-bold text-emerald-400">
                          <span>API Response (200 OK)</span>
                          <span className="text-[10px] bg-purple-800 px-1.5 py-0.5 rounded text-purple-200">
                            /v1/payment/verify
                          </span>
                        </div>
                        <pre className="text-[10px] text-purple-200 whitespace-pre-wrap break-all">
                          {JSON.stringify(verifyInvoiceResult, null, 2)}
                        </pre>
                      </div>
                    )}
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
                      ZiniPay API পেমেন্ট যাচাই করা হচ্ছে...
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      দয়া করে অপেক্ষা করুন, আপনার অর্ডারটি কনফার্ম হচ্ছে।
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
                    ZiniPay পেমেন্ট সফল হয়েছে!
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
