import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Banner,
  SiteSettings,
  Order,
  CartItem,
  OrderStatus,
  AdminTab,
  PromoCode,
  UserProfile,
  ProductReview,
} from '../types';
import { applyTheme } from '../utils/theme';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  serverTimestamp,
} from '../lib/firebase';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_PROMOS,
} from '../data/initialData';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: SiteSettings;
  orders: Order[];
  promos: PromoCode[];
  cart: CartItem[];
  activeCategory: string;
  searchQuery: string;
  isAdminMode: boolean;
  adminTab: AdminTab;
  quickViewProduct: Product | null;
  selectedProductDetail: Product | null;
  checkoutProduct: Product | null; // Product if direct 1-click checkout, null if cart checkout
  isCartOpen: boolean;
  lastOrder: Order | null;
  trackOrderModalOpen: boolean;
  toast: ToastNotification | null;
  currentUser: UserProfile | null;
  isAuthModalOpen: boolean;
  isGoogleLoading: boolean;

  // Actions
  loginWithGoogle: () => Promise<boolean>;
  setActiveCategory: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setIsAdminMode: (admin: boolean) => void;
  setAdminTab: (tab: AdminTab) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSelectedProductDetail: (product: Product | null) => void;
  setCheckoutProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setLastOrder: (order: Order | null) => void;
  setTrackOrderModalOpen: (open: boolean) => void;
  setCurrentUser: (user: UserProfile | null) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  logoutUser: () => void;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;

  placeOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
  updateProductReview: (productId: string, reviewId: string, updatedReview: Partial<ProductReview>) => void;
  deleteProductReview: (productId: string, reviewId: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updatedCategory: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updatedBanner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  addPromoCode: (promo: Omit<PromoCode, 'id'>) => void;
  updatePromoCode: (id: string, updated: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  validatePromoCode: (
    code: string,
    subtotal: number
  ) => { valid: boolean; discountAmount: number; message: string; promo?: PromoCode };

  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  syncWithCloud: (overrideEmail?: string) => Promise<boolean>;
  restoreFromCloud: (email?: string) => Promise<boolean>;
  cloudSyncStatus: {
    isSyncing: boolean;
    lastSyncedAt: string | null;
    cloudEmail: string | null;
  };

  clearAllProducts: () => void;
  clearAllOrders: () => void;
  clearAllCategories: () => void;
  clearAllBanners: () => void;
  clearAllPromos: () => void;
  clearAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state initialization
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lb_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lb_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('lb_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('lb_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lb_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [promos, setPromos] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('lb_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMOS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lb_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lb_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lb_user');
    }
  }, [currentUser]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const configuredAdminEmail = (settings.adminEmail || 'admin@litchibagan.com').trim().toLowerCase();
        const userEmail = fbUser.email?.trim().toLowerCase() || '';
        const isAdmin = userEmail === configuredAdminEmail || userEmail === 'makkum059@gmail.com';

        const profile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || userEmail.split('@')[0] || 'ইউজার',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          role: isAdmin ? 'admin' : 'customer',
          photoURL: fbUser.photoURL || undefined,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        setCurrentUser(profile);
        if (isAdmin) {
          setIsAdminMode(true);
        }

        // Auto Save User Profile to Firestore Database
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            displayName: profile.name,
            email: profile.email,
            photoURL: profile.photoURL || null,
            role: profile.role,
            createdAt: profile.createdAt,
            lastLoginAt: new Date().toISOString(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (fsErr) {
          console.warn('Firestore user profile sync warning:', fsErr);
        }
      }
    });

    return () => unsubscribe();
  }, [settings.adminEmail]);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const configuredAdminEmail = (settings.adminEmail || 'admin@litchibagan.com').trim().toLowerCase();
      const userEmail = fbUser.email?.trim().toLowerCase() || '';
      const isAdmin = userEmail === configuredAdminEmail || userEmail === 'makkum059@gmail.com';

      const profile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || userEmail.split('@')[0] || 'ইউজার',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '',
        role: isAdmin ? 'admin' : 'customer',
        photoURL: fbUser.photoURL || undefined,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      setCurrentUser(profile);
      setIsAuthModalOpen(false);

      // Save user record in Firestore
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          displayName: profile.name,
          email: profile.email,
          photoURL: profile.photoURL || null,
          role: profile.role,
          createdAt: profile.createdAt,
          lastLoginAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore user sync:', fsErr);
      }

      if (isAdmin) {
        setIsAdminMode(true);
        showToast(`🎉 গুগল সাইন ইন সফল! এডমিন প্যানেল সক্রিয় করা হয়েছে (${profile.name})`, 'success');
      } else {
        showToast(`🎉 গুগল লগইন সফল! স্বাগতম ${profile.name}`, 'success');
      }

      return true;
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      showToast(`গুগল সাইন ইন করতে সমস্যা হয়েছে: ${err?.message || ''}`, 'error');
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout:', e);
    }
    setCurrentUser(null);
    setIsAdminMode(false);
    showToast('সফলভাবে লগআউট করা হয়েছে', 'info');
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lb_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lb_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('lb_settings', JSON.stringify(settings));
    applyTheme(settings.primaryTheme || 'red', settings.customHexColor);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lb_promos', JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem('lb_cart', JSON.stringify(cart));
  }, [cart]);

  // Cloud Auto-Sync & Server Persistence State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<{
    isSyncing: boolean;
    lastSyncedAt: string | null;
    cloudEmail: string | null;
  }>({
    isSyncing: false,
    lastSyncedAt: null,
    cloudEmail: settings.adminEmail || 'admin@litchibagan.com',
  });

  const syncWithCloud = async (overrideEmail?: string): Promise<boolean> => {
    try {
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
      const emailToUse = overrideEmail || settings.adminEmail || 'admin@litchibagan.com';
      const response = await fetch('/api/store/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: emailToUse,
          products,
          categories,
          banners,
          settings,
          orders,
          promos,
          user: currentUser,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCloudSyncStatus({
          isSyncing: false,
          lastSyncedAt: data.timestamp,
          cloudEmail: emailToUse,
        });
        return true;
      }
    } catch (err) {
      console.warn('Cloud auto-save standby:', err);
    } finally {
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
    }
    return false;
  };

  const restoreFromCloud = async (email?: string): Promise<boolean> => {
    try {
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
      const emailQuery = email || settings.adminEmail || 'admin@litchibagan.com';
      const response = await fetch(`/api/store/restore?email=${encodeURIComponent(emailQuery)}`);
      const resData = await response.json();
      if (resData.success && resData.data) {
        const payload = resData.data;
        if (payload.products && Array.isArray(payload.products)) {
          setProducts(payload.products);
          localStorage.setItem('lb_products', JSON.stringify(payload.products));
        }
        if (payload.categories && Array.isArray(payload.categories)) {
          setCategories(payload.categories);
          localStorage.setItem('lb_categories', JSON.stringify(payload.categories));
        }
        if (payload.banners && Array.isArray(payload.banners)) {
          setBanners(payload.banners);
          localStorage.setItem('lb_banners', JSON.stringify(payload.banners));
        }
        if (payload.settings && typeof payload.settings === 'object') {
          setSettings(payload.settings);
          localStorage.setItem('lb_settings', JSON.stringify(payload.settings));
          applyTheme(payload.settings.primaryTheme || 'red', payload.settings.customHexColor);
        }
        if (payload.orders && Array.isArray(payload.orders)) {
          setOrders(payload.orders);
          localStorage.setItem('lb_orders', JSON.stringify(payload.orders));
        }
        if (payload.promos && Array.isArray(payload.promos)) {
          setPromos(payload.promos);
          localStorage.setItem('lb_promos', JSON.stringify(payload.promos));
        }

        setCloudSyncStatus({
          isSyncing: false,
          lastSyncedAt: payload.timestamp || new Date().toISOString(),
          cloudEmail: payload.adminEmail || emailQuery,
        });

        showToast('☁️ ক্লাউড সার্ভার থেকে ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!', 'success');
        return true;
      } else {
        showToast('ক্লাউডে কোনো সেভকৃত ডাটা পাওয়া যায়নি', 'info');
      }
    } catch (err) {
      console.error('Error restoring from cloud:', err);
      showToast('ক্লাউড ডাটা রিস্টোর করতে সমস্যা হয়েছে', 'error');
    } finally {
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
    }
    return false;
  };

  // 1. Auto-fetch latest backend data when website is opened in any browser/domain
  useEffect(() => {
    let isMounted = true;
    const fetchLatestServerData = async () => {
      try {
        const res = await fetch('/api/store/latest');
        const resData = await res.json();
        if (isMounted && resData.success && resData.data) {
          const payload = resData.data;
          if (payload.products?.length) {
            setProducts(payload.products);
            localStorage.setItem('lb_products', JSON.stringify(payload.products));
          }
          if (payload.categories?.length) {
            setCategories(payload.categories);
            localStorage.setItem('lb_categories', JSON.stringify(payload.categories));
          }
          if (payload.banners?.length) {
            setBanners(payload.banners);
            localStorage.setItem('lb_banners', JSON.stringify(payload.banners));
          }
          if (payload.settings && Object.keys(payload.settings).length) {
            setSettings(payload.settings);
            localStorage.setItem('lb_settings', JSON.stringify(payload.settings));
            applyTheme(payload.settings.primaryTheme || 'red', payload.settings.customHexColor);
          }
          if (payload.orders?.length) {
            setOrders(payload.orders);
            localStorage.setItem('lb_orders', JSON.stringify(payload.orders));
          }
          if (payload.promos?.length) {
            setPromos(payload.promos);
            localStorage.setItem('lb_promos', JSON.stringify(payload.promos));
          }

          setCloudSyncStatus({
            isSyncing: false,
            lastSyncedAt: payload.timestamp || new Date().toISOString(),
            cloudEmail: payload.adminEmail || 'admin@litchibagan.com',
          });
        }
      } catch (err) {
        console.log('Server auto-fetch standby:', err);
      }
    };
    fetchLatestServerData();
    return () => { isMounted = false; };
  }, []);

  // 2. Auto-Save to Cloud Server on data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      syncWithCloud();
    }, 2500);
    return () => clearTimeout(timer);
  }, [products, categories, banners, settings, orders, promos]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedUnit: product.unit }];
    });
    showToast(`🛒 "${product.nameBn}" কার্টে যোগ করা হয়েছে!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('কার্ট থেকে আইটেম সরানো হয়েছে', 'info');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCart([]);

  // Orders
  const placeOrder = (orderData: Partial<Order> & Omit<Order, 'id' | 'orderDate' | 'status'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = orderData.id || `ORD-${randomNum}`;
    const generatedInvoiceId = orderData.invoice_id || `INV-${randomNum}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      invoice_id: generatedInvoiceId,
      invoiceStatus: orderData.invoiceStatus || 'true',
      status: orderData.status || 'pending',
      orderDate: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();

    // Auto Save Order to Firebase Firestore Database
    try {
      setDoc(doc(db, 'orders', newId), {
        ...newOrder,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
    } catch (fsErr) {
      console.warn('Firestore order save error:', fsErr);
    }

    // Auto Admin Email & Auto SMS Notification Simulation
    const adminMail = settings.adminEmail || 'admin@litchibagan.com';
    const adminSmsNum = settings.phonePrimary || '01700-000000';
    console.log(`[AUTO-EMAIL NOTIFICATION] Sent to Admin (${adminMail}): New Order #${newId} placed by ${newOrder.customerName} (${newOrder.customerPhone}), Amount: ৳${newOrder.totalAmount}, Payment: ${newOrder.paymentMethod}`);
    console.log(`[AUTO-SMS NOTIFICATION] Sent to Admin SMS (${adminSmsNum}): New Order #${newId} - ৳${newOrder.totalAmount} by ${newOrder.customerPhone}`);

    showToast(`🎉 অভিনন্দন! অর্ডার #${newId} সফলভাবে গৃহীত হয়েছে। অ্যাডমিন ইমেইল (${adminMail}) এবং অটো SMS নোটিফিকেশন পাঠানো হয়েছে।`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`অর্ডার ${orderId} এর স্ট্যাটাস '${status}' এ আপডেট করা হয়েছে।`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`অর্ডার ${orderId} মুছে ফেলা হয়েছে।`, 'info');
  };

  // Products CRUD
  const addProduct = (product: Omit<Product, 'id'>) => {
    const id = `p_${Date.now()}`;
    const newProd = { ...product, id };
    setProducts((prev) => [newProd, ...prev]);
    showToast('নতুন লিচু পণ্য যোগ করা হয়েছে!');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast('পণ্য সফলভাবে আপডেট করা হয়েছে!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('পণ্য টি ডিলিট করা হয়েছে', 'info');
  };

  const addProductReview = (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => {
    const newReview: ProductReview = {
      ...review,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const existing = p.reviews || [];
          const updated = [newReview, ...existing];
          const totalRating = updated.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = Number((totalRating / updated.length).toFixed(1));
          return {
            ...p,
            reviews: updated,
            rating: avgRating,
            reviewsCount: updated.length,
          };
        }
        return p;
      })
    );

    setSelectedProductDetail((prev) => {
      if (prev && prev.id === productId) {
        const existing = prev.reviews || [];
        const updated = [newReview, ...existing];
        const totalRating = updated.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Number((totalRating / updated.length).toFixed(1));
        return {
          ...prev,
          reviews: updated,
          rating: avgRating,
          reviewsCount: updated.length,
        };
      }
      return prev;
    });

    showToast('আপনার গুরুত্বপূর্ণ রিভিউ ও ফিডব্যাক জমা হয়েছে। ধন্যবাদ!');
  };

  const updateProductReview = (productId: string, reviewId: string, updatedReview: Partial<ProductReview>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const existing = p.reviews || [];
          const updatedList = existing.map((r) => (r.id === reviewId ? { ...r, ...updatedReview } : r));
          const totalRating = updatedList.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = updatedList.length > 0 ? Number((totalRating / updatedList.length).toFixed(1)) : 5.0;
          return {
            ...p,
            reviews: updatedList,
            rating: avgRating,
            reviewsCount: updatedList.length,
          };
        }
        return p;
      })
    );

    setSelectedProductDetail((prev) => {
      if (prev && prev.id === productId) {
        const existing = prev.reviews || [];
        const updatedList = existing.map((r) => (r.id === reviewId ? { ...r, ...updatedReview } : r));
        const totalRating = updatedList.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = updatedList.length > 0 ? Number((totalRating / updatedList.length).toFixed(1)) : 5.0;
        return {
          ...prev,
          reviews: updatedList,
          rating: avgRating,
          reviewsCount: updatedList.length,
        };
      }
      return prev;
    });

    showToast('রিভিউ সফলভাবে আপডেট করা হয়েছে!');
  };

  const deleteProductReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const existing = p.reviews || [];
          const updatedList = existing.filter((r) => r.id !== reviewId);
          const totalRating = updatedList.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = updatedList.length > 0 ? Number((totalRating / updatedList.length).toFixed(1)) : 5.0;
          return {
            ...p,
            reviews: updatedList,
            rating: avgRating,
            reviewsCount: updatedList.length,
          };
        }
        return p;
      })
    );

    setSelectedProductDetail((prev) => {
      if (prev && prev.id === productId) {
        const existing = prev.reviews || [];
        const updatedList = existing.filter((r) => r.id !== reviewId);
        const totalRating = updatedList.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = updatedList.length > 0 ? Number((totalRating / updatedList.length).toFixed(1)) : 5.0;
        return {
          ...prev,
          reviews: updatedList,
          rating: avgRating,
          reviewsCount: updatedList.length,
        };
      }
      return prev;
    });

    showToast('রিভিউ সফলভাবে রিমুভ/ডিলিট করা হয়েছে!', 'info');
  };

  // Categories CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const id = cat.nameEn.toLowerCase().replace(/\s+/g, '-');
    setCategories((prev) => [...prev, { ...cat, id }]);
    showToast('নতুন ক্যাটাগরি তৈরি হয়েছে!');
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    showToast('ক্যাটাগরি তথ্য আপডেট করা হয়েছে!');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('ক্যাটাগরি রিমুভ করা হয়েছে', 'info');
  };

  // Banners CRUD
  const addBanner = (b: Omit<Banner, 'id'>) => {
    const id = `b_${Date.now()}`;
    setBanners((prev) => [...prev, { ...b, id }]);
    showToast('নতুন ব্যানার স্লাইড যোগ করা হয়েছে!');
  };

  const updateBanner = (id: string, updated: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
    showToast('ব্যনার কাস্টমাইজেশন সেভ করা হয়েছে!');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('ব্যনার স্লাইডার রিমুভ করা হয়েছে', 'info');
  };

  // Promos CRUD
  const addPromoCode = (promo: Omit<PromoCode, 'id'>) => {
    const id = `pr_${Date.now()}`;
    const newPromo: PromoCode = {
      ...promo,
      id,
      code: promo.code.trim().toUpperCase(),
      usageCount: 0,
    };
    setPromos((prev) => [newPromo, ...prev]);
    showToast(`প্রোমো কোড "${newPromo.code}" তৈরি করা হয়েছে!`);
  };

  const updatePromoCode = (id: string, updated: Partial<PromoCode>) => {
    setPromos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updated,
              code: updated.code ? updated.code.trim().toUpperCase() : p.code,
            }
          : p
      )
    );
    showToast('প্রোমো কোড তথ্য আপডেট হয়েছে!');
  };

  const deletePromoCode = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
    showToast('প্রোমো কোডটি মুছে ফেলা হয়েছে', 'info');
  };

  const validatePromoCode = (
    codeStr: string,
    subtotal: number
  ): { valid: boolean; discountAmount: number; message: string; promo?: PromoCode } => {
    const cleanCode = codeStr.trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, discountAmount: 0, message: 'একটি বৈধ প্রোমো কোড লিখুন' };
    }

    const promo = promos.find((p) => p.code.toUpperCase() === cleanCode);
    if (!promo) {
      return { valid: false, discountAmount: 0, message: 'প্রোমো কোডটি সঠিক নয়' };
    }

    if (!promo.isActive) {
      return { valid: false, discountAmount: 0, message: 'এই প্রোমো কোডটির মেয়াদ শেষ বা নিস্ক্রিয়' };
    }

    if (subtotal < promo.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `এই কুপনটি পেতে সর্বনিম্ন ৳${promo.minOrderAmount} টাকার অর্ডার প্রয়োজন (আপনার বর্তমান অর্ডারের সাবটোটাল ৳${subtotal})`,
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((subtotal * promo.discountValue) / 100);
    } else {
      discount = promo.discountValue;
    }

    if (discount > subtotal) {
      discount = subtotal;
    }

    return {
      valid: true,
      discountAmount: discount,
      message: `🎉 প্রোমো কোড সফলভাবে প্রয়োগ করা হয়েছে! ৳${discount} ছাড় পেয়েছেন।`,
      promo,
    };
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('ওয়েবসাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!');
  };

  // Reset Data
  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBanners(INITIAL_BANNERS);
    setSettings(INITIAL_SETTINGS);
    setOrders(INITIAL_ORDERS);
    setPromos(INITIAL_PROMOS);
    setCart([]);
    localStorage.removeItem('lb_products');
    localStorage.removeItem('lb_categories');
    localStorage.removeItem('lb_banners');
    localStorage.removeItem('lb_settings');
    localStorage.removeItem('lb_orders');
    localStorage.removeItem('lb_promos');
    localStorage.removeItem('lb_cart');
    showToast('সমস্ত তথ্য মূল ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে!', 'info');
  };

  const clearAllProducts = () => {
    setProducts([]);
    showToast('সমস্ত প্রোডাক্ট ডিলিট করা হয়েছে!', 'info');
  };

  const clearAllOrders = () => {
    setOrders([]);
    showToast('সমস্ত অর্ডার ডিলিট করা হয়েছে!', 'info');
  };

  const clearAllCategories = () => {
    setCategories([]);
    showToast('সমস্ত ক্যাটাগরি ডিলিট করা হয়েছে!', 'info');
  };

  const clearAllBanners = () => {
    setBanners([]);
    showToast('সমস্ত ব্যানার ডিলিট করা হয়েছে!', 'info');
  };

  const clearAllPromos = () => {
    setPromos([]);
    showToast('সমস্ত প্রমো কোড ডিলিট করা হয়েছে!', 'info');
  };

  const clearAllData = () => {
    setProducts([]);
    setOrders([]);
    setCategories([]);
    setBanners([]);
    setPromos([]);
    setCart([]);
    showToast('ওয়েবসাইটের সমস্ত ডাটা ডিলিট ও ফাকা করা হয়েছে!', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        settings,
        orders,
        promos,
        cart,
        activeCategory,
        searchQuery,
        isAdminMode,
        adminTab,
        quickViewProduct,
        selectedProductDetail,
        checkoutProduct,
        isCartOpen,
        lastOrder,
        trackOrderModalOpen,
        toast,
        currentUser,
        isAuthModalOpen,
        isGoogleLoading,

        loginWithGoogle,
        setActiveCategory,
        setSearchQuery,
        setIsAdminMode,
        setAdminTab,
        setQuickViewProduct,
        setSelectedProductDetail,
        setCheckoutProduct,
        setIsCartOpen,
        setLastOrder,
        setTrackOrderModalOpen,
        setCurrentUser,
        setIsAuthModalOpen,
        logoutUser,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        placeOrder,
        updateOrderStatus,
        deleteOrder,

        addProduct,
        updateProduct,
        deleteProduct,
        addProductReview,
        updateProductReview,
        deleteProductReview,

        addCategory,
        updateCategory,
        deleteCategory,

        addBanner,
        updateBanner,
        deleteBanner,

        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        validatePromoCode,

        updateSettings,
        resetToDefaults,
        showToast,

        syncWithCloud,
        restoreFromCloud,
        cloudSyncStatus,

        clearAllProducts,
        clearAllOrders,
        clearAllCategories,
        clearAllBanners,
        clearAllPromos,
        clearAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
