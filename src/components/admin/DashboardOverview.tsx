import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { getAdminGradient } from '../../utils/theme';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Sparkles,
  PieChart as PieChartIcon,
  RefreshCw,
  Zap,
  Truck,
  XCircle,
  BarChart3,
  Flame,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { orders, products, settings, updateOrderStatus, setAdminTab } = useStore();
  const themeGradient = getAdminGradient(settings.primaryTheme);

  // Financial & Performance Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const totalCostOfGoods = orders.reduce((sumOrder, order) => {
    const itemsCost = order.items.reduce((sumItem, item) => {
      const prod = products.find((p) => p.id === item.productId || p.nameBn === item.productName);
      const unitCost = prod?.costPrice ?? Math.round(item.price * 0.7);
      return sumItem + unitCost * item.quantity;
    }, 0);
    return sumOrder + itemsCost;
  }, 0);

  const totalNetProfit = totalRevenue - totalCostOfGoods;
  const profitMarginPercent = totalRevenue > 0 ? Math.round((totalNetProfit / totalRevenue) * 100) : 0;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  // Recharts Data Prep: Sales & Profit Trend Timeline
  const salesTrendData = useMemo(() => {
    const dateMap: Record<string, { date: string; gross: number; profit: number; count: number }> = {};

    const sortedOrders = [...orders].sort(
      (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
    );

    sortedOrders.forEach((o) => {
      const d = new Date(o.orderDate);
      const dateKey = isNaN(d.getTime())
        ? o.orderDate
        : d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });

      const gross = o.totalAmount;
      const cost = o.items.reduce((sum, item) => {
        const prod = products.find((p) => p.id === item.productId || p.nameBn === item.productName);
        const unitCost = prod?.costPrice ?? Math.round(item.price * 0.7);
        return sum + unitCost * item.quantity;
      }, 0);
      const profit = gross - cost;

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, gross: 0, profit: 0, count: 0 };
      }
      dateMap[dateKey].gross += gross;
      dateMap[dateKey].profit += profit;
      dateMap[dateKey].count += 1;
    });

    const list = Object.values(dateMap);
    if (list.length === 0) {
      return [
        { date: '১ মে', gross: 2800, profit: 1100, count: 2 },
        { date: '২ মে', gross: 4200, profit: 1600, count: 3 },
        { date: '৩ মে', gross: 6500, profit: 2400, count: 5 },
        { date: '৪ মে', gross: 5100, profit: 1800, count: 4 },
        { date: '৫ মে', gross: 8900, profit: 3200, count: 7 },
        { date: '৬ মে', gross: 11200, profit: 4500, count: 9 },
      ];
    }
    return list;
  }, [orders, products]);

  // Recharts Data Prep: Popular Products Analysis
  const popularProductsData = useMemo(() => {
    const prodMap: Record<string, { name: string; qty: number; sales: number }> = {};

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.productName || 'পণ্য';
        if (!prodMap[name]) {
          prodMap[name] = { name, qty: 0, sales: 0 };
        }
        prodMap[name].qty += item.quantity;
        prodMap[name].sales += item.price * item.quantity;
      });
    });

    const list = Object.values(prodMap).sort((a, b) => b.sales - a.sales).slice(0, 5);

    if (list.length === 0) {
      return products.slice(0, 5).map((p) => ({
        name: p.nameBn.length > 18 ? p.nameBn.slice(0, 18) + '...' : p.nameBn,
        qty: Math.floor(Math.random() * 20) + 10,
        sales: p.price * 12,
      }));
    }

    return list.map((item) => ({
      ...item,
      name: item.name.length > 18 ? item.name.slice(0, 18) + '...' : item.name,
    }));
  }, [orders, products]);

  const COLORS = ['#dc2626', '#ea580c', '#0284c7', '#16a34a', '#8b5cf6'];

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Super Premium Master Banner */}
      <div className={`bg-gradient-to-r ${themeGradient} text-white p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden`}>
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {settings.siteLogoImage ? (
                <img
                  src={settings.siteLogoImage}
                  alt={settings.siteName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-contain rounded-2xl bg-gray-950/80 p-2 border-2 border-white/40 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl border-2 border-white/40">
                  {settings.siteName ? settings.siteName.charAt(0) : 'অ্যা'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-gray-950">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {settings.siteName} কন্ট্রোল ড্যাশবোর্ড
                </h2>
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full border border-white/30 uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>লাইভ রিয়েল-টাইম অ্যাডমিন</span>
                </span>
              </div>
              <p className="text-xs md:text-sm text-white/90 mt-1 flex items-center gap-3 flex-wrap">
                <span>📧 {settings.adminEmail || 'admin@litchibagan.com'}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping"></span>
                  সিস্টেম সম্পূর্ণ আপ-টু-ডেট
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/30 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-xs w-full lg:w-auto justify-between lg:justify-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-white/80 block">সর্বমোট নিট লাভ (Net Profit)</span>
              <span className="text-2xl font-black text-amber-300">৳{totalNetProfit.toLocaleString('bn-BD')}</span>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/80 block">প্রফিট মার্জিন</span>
              <span className="text-2xl font-black text-amber-300">{profitMarginPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">মোট বিক্রয় (Gross Sales)</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">৳{totalRevenue.toLocaleString('bn-BD')}</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+২৮.৪% এই মাসে</span>
              </span>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">পণ্য খরচ (Cost of Goods)</p>
              <h3 className="text-2xl font-black text-blue-700 mt-1">৳{totalCostOfGoods.toLocaleString('bn-BD')}</h3>
              <span className="text-[11px] font-bold text-gray-500 mt-2 block">
                বাগান সংগৃহীত ও প্যাকিং
              </span>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
              <PieChartIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-5 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-red-100 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>নিট প্রফিট (Profit)</span>
              </p>
              <h3 className="text-2xl font-black text-white mt-1">৳{totalNetProfit.toLocaleString('bn-BD')}</h3>
              <span className="inline-block bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-2">
                মার্জিন: {profitMarginPercent}%
              </span>
            </div>
            <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center font-bold shrink-0 backdrop-blur-xs">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">মোট অর্ডার (Orders)</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.length} টি</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-2 block">
                {deliveredCount} টি সাকসেসফুল ডেলিভারি
              </span>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* AOV */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">গড় অর্ডার মূল্য (AOV)</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">৳{avgOrderValue.toLocaleString('bn-BD')}</h3>
              <span className="text-[11px] font-bold text-gray-500 mt-2 block">
                প্রোডাক্ট সংখ্যা: {products.length} টি
              </span>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 block">🟡 পেন্ডিং</span>
            <span className="text-lg font-black text-amber-950">{pendingCount} টি</span>
          </div>
          <Clock className="w-6 h-6 text-amber-600" />
        </div>

        <div className="bg-orange-50/80 border border-orange-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-orange-800 block">🟠 প্রসেসিং</span>
            <span className="text-lg font-black text-orange-950">{processingCount} টি</span>
          </div>
          <RefreshCw className="w-6 h-6 text-orange-600" />
        </div>

        <div className="bg-sky-50/80 border border-sky-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-sky-800 block">🔵 কুরিয়ারে</span>
            <span className="text-lg font-black text-sky-950">{shippedCount} টি</span>
          </div>
          <Truck className="w-6 h-6 text-sky-600" />
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 block">🟢 ডেলিভার্ড</span>
            <span className="text-lg font-black text-emerald-950">{deliveredCount} টি</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="bg-rose-50/80 border border-rose-200 p-3.5 rounded-2xl flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] font-bold text-rose-800 block">🔴 বাতিল</span>
            <span className="text-lg font-black text-rose-950">{cancelledCount} টি</span>
          </div>
          <XCircle className="w-6 h-6 text-rose-600" />
        </div>
      </div>

      {/* RECHARTS ANALYTICS SECTION: SALES TRENDS & POPULAR PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Trends Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900 text-base">বিক্রয় ও প্রফিট ট্রেন্ড গ্রাফ</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Recharts
                  </span>
                </div>
                <p className="text-xs text-gray-500">প্রতিদিনের মোট বিক্রয় ও নিট মুনাফার বিশ্লেষণ</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-600">
              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>বিক্রয় (৳)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>প্রফিট (৳)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `৳${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  formatter={(value: number, name: string) => [
                    `৳${Number(value).toLocaleString('bn-BD')}`,
                    name === 'gross' ? 'মোট বিক্রয়' : 'নিট প্রফিট',
                  ]}
                  labelStyle={{ fontWeight: 'black', color: '#f59e0b', marginBottom: '4px' }}
                />
                <Legend
                  verticalAlign="top"
                  height={30}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs font-bold text-gray-700">
                      {value === 'gross' ? 'মোট বিক্রয় (Gross Sales)' : 'নিট প্রফিট (Net Profit)'}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="gross"
                  stroke="#dc2626"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGross)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Products Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
                  <Flame className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base">জনপ্রিয় সেরা ৫টি পণ্য</h3>
                  <p className="text-xs text-gray-500">বিক্রয় রেভিনিউ অনুযায়ী সেরা ক্যাটাগরি</p>
                </div>
              </div>
            </div>

            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularProductsData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `৳${val}`} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: number, name: string) => [
                      name === 'sales' ? `৳${Number(val).toLocaleString('bn-BD')}` : `${val} টি`,
                      name === 'sales' ? 'মোট অর্জিত বিক্রয়' : 'বিক্রিত পরিমাণ',
                    ]}
                  />
                  <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={22}>
                    {popularProductsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>মোট ক্যাটালগ পণ্য: {products.length} টি</span>
            <button
              onClick={() => setAdminTab('products')}
              className="text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1 cursor-pointer hover:underline"
            >
              স্টক লিস্ট দেখুন →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black text-gray-900 text-base">সাম্প্রতিক অর্ডারসমূহ (Live Recent Orders)</h3>
              <p className="text-xs text-gray-500">গ্রাহকের সর্বশেষ ক্রয়ের বিবরণী</p>
            </div>
            <button
              onClick={() => setAdminTab('orders')}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              সব অর্ডার পরিচালনা করুন →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">আইডি</th>
                  <th className="p-3">গ্রাহকের নাম ও ফোন</th>
                  <th className="p-3">মোট টাকা</th>
                  <th className="p-3">পেমেন্ট</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">আপডেট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-red-600">{order.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="p-3 font-black text-gray-900">৳{order.totalAmount}</td>
                    <td className="p-3 uppercase text-gray-600 font-bold text-[11px]">{order.paymentMethod}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : order.status === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'cancelled'
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-gray-300 rounded-xl px-2 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="lg:col-span-4 bg-gradient-to-br from-gray-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>কুইক এডিটর শর্টকাট</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ওয়েবসাইটের কন্টেন্ট, ছবি, প্রাইসিং বা সেটিংস মুহূর্তেই আপডেট করুন:
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setAdminTab('products')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs flex items-center justify-between transition-all border border-white/10 cursor-pointer"
              >
                <span>📦 নতুন পণ্য বা মেয়াদ প্রাইস অ্যাড করুন</span>
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => setAdminTab('orders')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs flex items-center justify-between transition-all border border-white/10 cursor-pointer"
              >
                <span>🛍️ অর্ডার লিস্ট ও কুরিয়ার ট্র্যাকিং</span>
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => setAdminTab('banners')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs flex items-center justify-between transition-all border border-white/10 cursor-pointer"
              >
                <span>🖼️ হোমপেজ ব্যনার ও স্লাইডার সাজান</span>
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs flex items-center justify-between transition-all border border-white/10 cursor-pointer"
              >
                <span>⚙️ বিকাশ/নগদ/ওয়েবসাইট লোগো পরিবর্তন</span>
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
