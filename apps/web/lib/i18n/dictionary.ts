import { Locale } from "@/lib/types";

const shared = {
  storeName: "SMSM STORE",
  tagline: "BEST SHOES STORE",
  whatsapp: "+20 11 52333633"
};

export const dictionaries = {
  ar: {
    ...shared,
    nav: {
      home: "الرئيسية",
      products: "المنتجات",
      categories: "الأقسام",
      offers: "العروض",
      about: "من نحن",
      contact: "اتصل بنا",
      cart: "السلة"
    },
    actions: {
      shopNow: "تسوق الآن",
      orderWhatsapp: "اطلب عبر واتساب",
      addToCart: "أضف إلى السلة",
      viewDetails: "عرض التفاصيل",
      browseCategory: "تصفح القسم",
      continueShopping: "اكمل التسوق",
      checkoutWhatsapp: "إتمام الطلب عبر واتساب",
      language: "English"
    },
    home: {
      promo: "شحن مجاني داخل مصر للطلبات المميزة لفترة محدودة",
      heroTitle: "أحدث تشكيلات الأحذية",
      heroSubtitle:
        "اكتشف أحدث موديلات السنيكرز والأحذية الرياضية.",
      featuredCategories: "الأقسام المميزة",
      bestSellers: "الأكثر مبيعًا",
      newArrivals: "وصل حديثًا",
      whyUs: "لماذا SMSM STORE",
      gallery: "من داخل المتجر",
      reviews: "آراء العملاء",
      finalCta: "جاهز لاختيار جزمتك القادمة؟"
    },
    products: {
      title: "كل المنتجات",
      subtitle: "تشكيلة أحذية رياضية وكاجوال بتنسيق فاخر",
      search: "ابحث عن منتج...",
      noResults: "لا توجد منتجات بهذه الفلاتر",
      filters: "الفلاتر",
      sortNewest: "الأحدث",
      sortBest: "الأكثر مبيعًا",
      sortLow: "السعر: من الأقل للأعلى",
      sortHigh: "السعر: من الأعلى للأقل",
      availability: "التوفر",
      inStock: "متوفر",
      outStock: "غير متوفر"
    },
    cart: {
      title: "سلة التسوق",
      empty: "السلة فارغة",
      emptySub: "أضف منتجات للمتابعة",
      total: "الإجمالي",
      subtotal: "المجموع",
      customerInfo: "بيانات الشحن",
      name: "الاسم",
      phone: "رقم الهاتف",
      address: "العنوان",
      notes: "ملاحظات"
    },
    footer: {
      rights: "جميع الحقوق محفوظة"
    },
    admin: {
      title: "لوحة تحكم SMSM STORE",
      loginTitle: "تسجيل دخول الإدارة",
      loginHint: "استخدم بيانات الإدارة للدخول إلى لوحة التحكم",
      username: "البريد أو اسم المستخدم",
      password: "كلمة المرور",
      login: "دخول",
      logout: "تسجيل الخروج",
      dashboard: "لوحة القيادة",
      products: "المنتجات",
      orders: "الطلبات",
      categories: "الفئات",
      messages: "الرسائل",
      settings: "الإعدادات",
      addProduct: "إضافة منتج",
      editProduct: "تعديل المنتج",
      recentOrders: "الطلبات الأخيرة",
      quickActions: "إجراءات سريعة"
    }
  },
  en: {
    ...shared,
    nav: {
      home: "Home",
      products: "Products",
      categories: "Categories",
      offers: "Offers",
      about: "About",
      contact: "Contact",
      cart: "Cart"
    },
    actions: {
      shopNow: "Shop Now",
      orderWhatsapp: "Order on WhatsApp",
      addToCart: "Add to Cart",
      viewDetails: "View Details",
      browseCategory: "Browse Category",
      continueShopping: "Continue Shopping",
      checkoutWhatsapp: "Checkout on WhatsApp",
      language: "العربية"
    },
    home: {
      promo: "Free shipping inside Egypt on premium orders this week",
      heroTitle: "Premium Sneakers Collection",
      heroSubtitle:
        "Shop the latest sneaker trends.",
      featuredCategories: "Featured Categories",
      bestSellers: "Best Sellers",
      newArrivals: "New Arrivals",
      whyUs: "Why SMSM STORE",
      gallery: "Store Gallery",
      reviews: "Customer Reviews",
      finalCta: "Ready for your next pair?"
    },
    products: {
      title: "All Products",
      subtitle: "Premium sneakers and shoes with strong street identity",
      search: "Search products...",
      noResults: "No products match these filters",
      filters: "Filters",
      sortNewest: "Newest",
      sortBest: "Best Sellers",
      sortLow: "Price: Low to High",
      sortHigh: "Price: High to Low",
      availability: "Availability",
      inStock: "In Stock",
      outStock: "Out of Stock"
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptySub: "Add products to continue",
      total: "Total",
      subtotal: "Subtotal",
      customerInfo: "Shipping Details",
      name: "Name",
      phone: "Phone Number",
      address: "Address",
      notes: "Notes"
    },
    footer: {
      rights: "All rights reserved"
    },
    admin: {
      title: "SMSM STORE Admin Panel",
      loginTitle: "Admin Login",
      loginHint: "Use admin credentials to access the dashboard",
      username: "Email or username",
      password: "Password",
      login: "Login",
      logout: "Logout",
      dashboard: "Dashboard",
      products: "Products",
      orders: "Orders",
      categories: "Categories",
      messages: "Messages",
      settings: "Settings",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      recentOrders: "Recent Orders",
      quickActions: "Quick Actions"
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)["ar"] | (typeof dictionaries)["en"];
export const getDictionary = (locale: Locale) => dictionaries[locale];
