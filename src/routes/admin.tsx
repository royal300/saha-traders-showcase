import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { 
  LayoutDashboard, Image as ImageIcon, Tags, ShoppingBag, 
  Users, Phone, LogOut, Plus, Edit, Trash2, Download, 
  CheckCircle, PlusCircle, ArrowRight, Settings, Globe, ShieldAlert,
  Loader2, Check
} from "lucide-react";
import { inr } from "@/lib/products";
import { 
  getDashboardStatsFn,
  getBannersFn, saveBannerFn, deleteBannerFn,
  getCategoriesFn, saveCategoryFn, deleteCategoryFn,
  getProductsFn, saveProductFn, deleteProductFn,
  getCustomersFn,
  getSettingsFn, updateSettingFn,
  uploadImageFn
} from "@/lib/server-functions";


export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Saha Marble & Tiles" }] }),
  component: AdminPage,
});

function ImageUploadField({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select or upload an image...", 
  recommendedSize 
}: { 
  label: string; 
  value: string; 
  onChange: (url: string) => void; 
  placeholder?: string; 
  recommendedSize?: string; 
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      try {
        const res = await uploadImageFn({ data: { fileName: file.name, base64Data: base64String } });
        if (res.success && res.url) {
          onChange(res.url);
        } else {
          alert("Upload failed: " + (res.error || "Unknown error"));
        }
      } catch (err: any) {
        alert("Upload error: " + err.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex justify-between items-center">
        <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)]">{label}</label>
        {recommendedSize && (
          <span className="text-[10px] text-[var(--charcoal)]/40 font-mono">Size: {recommendedSize}</span>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {value ? (
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-subtle bg-slate-50 shrink-0 relative group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[9px] text-white font-bold uppercase tracking-wider">Preview</span>
            </div>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg border border-dashed border-subtle bg-slate-50 shrink-0 flex items-center justify-center text-slate-400">
            <ImageIcon size={20} className="opacity-40" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={value} 
              className="ipt !py-2 text-xs !bg-slate-50/50 cursor-default truncate flex-1" 
              placeholder={placeholder}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-slate-brand text-slate-brand hover:bg-slate-brand hover:text-white transition-all text-xs font-bold rounded-md shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Uploading...
                </>
              ) : (
                "Choose File"
              )}
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
}

function GalleryUploadField({ 
  gallery, 
  onChange 
}: { 
  gallery: string[]; 
  onChange: (newGallery: string[]) => void; 
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls = [...gallery];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64String = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(file);
        });
        
        const res = await uploadImageFn({ data: { fileName: file.name, base64Data: base64String } });
        if (res.success && res.url) {
          newUrls.push(res.url);
        }
      }
      onChange(newUrls);
    } catch (err: any) {
      alert("Error uploading gallery image: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(gallery.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between items-center border-b border-subtle pb-2">
        <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)]">Product Gallery Showcase Images</label>
        <span className="text-[10px] text-[var(--charcoal)]/40 font-mono">Recommend: 800x800 px</span>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {gallery.map((url, idx) => (
          <div key={idx} className="aspect-square rounded-lg border border-subtle bg-slate-50 relative group overflow-hidden">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer text-xs font-bold"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-lg border-2 border-dashed border-slate-brand hover:border-slate-800 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center gap-1.5 transition-all text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin text-slate-brand" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Uploading...</span>
            </>
          ) : (
            <>
              <PlusCircle size={20} className="text-slate-brand" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
            </>
          )}
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAddFile}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "media" | "categories" | "products" | "customers" | "whatsapp">("dashboard");
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Login Form State
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // Database Data States
  const [stats, setStats] = React.useState<any>({ products: 0, categories: 0, customers: 0, visitors: 0, recentOrders: [] });
  const [banners, setBanners] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [settings, setSettings] = React.useState<Record<string, string>>({ whatsapp_number: "919330833711" });

  // Form Editing States
  const [editingBanner, setEditingBanner] = React.useState<any>(null);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);

  // Loader feedback
  const [actionLoading, setActionLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");

  // Check auth state on mount
  React.useEffect(() => {
    const auth = sessionStorage.getItem("saha_admin_auth");
    if (auth === "true") {
      setIsLoggedIn(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("saha_admin_auth", "true");
        setIsLoggedIn(true);
        fetchData();
      } else {
        setLoginError("Invalid username or password");
        setIsLoggingIn(false);
      }
    }, 600);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("saha_admin_auth");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const dashboardStats = await getDashboardStatsFn();
      const loadedBanners = await getBannersFn();
      const loadedCategories = await getCategoriesFn();
      const loadedProducts = await getProductsFn();
      const loadedCustomers = await getCustomersFn();
      const loadedSettings = await getSettingsFn();

      setStats(dashboardStats);
      setBanners(loadedBanners);
      setCategories(loadedCategories);
      setProducts(loadedProducts);
      setCustomers(loadedCustomers);
      if (loadedSettings.whatsapp_number) {
        setSettings(loadedSettings);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  };

  // ==========================================
  // Media Slide CRUD actions
  // ==========================================
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await saveBannerFn({ data: editingBanner });
      if (res.success) {
        const loaded = await getBannersFn();
        setBanners(loaded);
        setEditingBanner(null);
        showFeedback("Banner slide saved successfully!");
      }
    } catch (e: any) {
      alert("Error saving banner: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    setActionLoading(true);
    try {
      const res = await deleteBannerFn({ id });
      if (res.success) {
        const loaded = await getBannersFn();
        setBanners(loaded);
        showFeedback("Banner slide deleted.");
      }
    } catch (e: any) {
      alert("Error deleting banner: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Categories CRUD actions
  // ==========================================
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await saveCategoryFn({ data: editingCategory });
      if (res.success) {
        const loaded = await getCategoriesFn();
        setCategories(loaded);
        setEditingCategory(null);
        showFeedback("Category saved successfully!");
      }
    } catch (e: any) {
      alert("Error saving category: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? All products under it will be deleted!")) return;
    setActionLoading(true);
    try {
      const res = await deleteCategoryFn({ id });
      if (res.success) {
        const loaded = await getCategoriesFn();
        setCategories(loaded);
        // Refresh products since they cascade delete in DB
        const prod = await getProductsFn();
        setProducts(prod);
        showFeedback("Category and associated products deleted.");
      }
    } catch (e: any) {
      alert("Error deleting category: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Products CRUD actions
  // ==========================================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await saveProductFn({ data: editingProduct });
      if (res.success) {
        const loaded = await getProductsFn();
        setProducts(loaded);
        setEditingProduct(null);
        showFeedback("Product saved successfully!");
      }
    } catch (e: any) {
      alert("Error saving product: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setActionLoading(true);
    try {
      const res = await deleteProductFn({ id });
      if (res.success) {
        const loaded = await getProductsFn();
        setProducts(loaded);
        showFeedback("Product deleted successfully.");
      }
    } catch (e: any) {
      alert("Error deleting product: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Settings CRUD actions
  // ==========================================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await updateSettingFn({ key: "whatsapp_number", value: settings.whatsapp_number });
      if (res.success) {
        showFeedback("WhatsApp settings updated globally!");
      }
    } catch (e: any) {
      alert("Error saving settings: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // CSV Export for Customers Log
  // ==========================================
  const downloadCustomerCSV = () => {
    if (customers.length === 0) return;
    
    // CSV Header row
    const headers = ["Order ID", "Customer Name", "Mobile Number", "Address", "Items Ordered", "Total Price (INR)", "Date"];
    
    const rows = customers.map((c: any) => {
      let itemsSummary = "";
      try {
        const items = JSON.parse(c.items || "[]");
        itemsSummary = items.map((i: any) => `${i.name} (Qty: ${i.qty})`).join("; ");
      } catch {
        itemsSummary = c.items || "";
      }
      
      return [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.mobile,
        `"${c.address.replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        c.total_price,
        new Date(c.created_at).toLocaleString()
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Saha_Marbles_Customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Login view if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-brand flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/60 border border-[var(--gold)]/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative z-10 animate-fade-up">
          <div className="text-center mb-8">
            <div className="text-2xl font-display font-semibold text-[var(--gold)] tracking-wider">
              SAHA MARBLE & TILES
            </div>
            <div className="text-xs text-white/50 uppercase tracking-widest mt-1">
              Systems Control Portal
            </div>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3.5 mb-6 flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/60 mb-2">Username</label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all"
                placeholder="Enter admin user ID"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/60 mb-2">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[var(--gold)] hover:bg-white text-slate-brand hover:text-slate-brand transition-all py-3.5 px-6 rounded-lg text-sm font-bold shadow-lg shadow-black/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Systems...
                </>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Loader spinner if fetching dashboard data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="text-[var(--gold)] animate-spin" />
        <span className="text-xs uppercase tracking-widest text-[var(--charcoal)]/50 font-semibold">Loading Control Portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-[var(--slate)] font-sans">
      {/* 1. SIDEBAR (Persistent Desktop, Floating Mobile) */}
      <aside className="lg:w-64 bg-slate-brand text-white border-r border-[var(--gold)]/20 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <img src="/src/logo.png" alt="Saha logo" className="h-10 w-auto object-contain bg-white rounded p-0.5 shrink-0" />
            <div className="text-left leading-tight">
              <span className="font-display text-sm font-semibold tracking-wider block text-[var(--gold)]">SAHA MARBLE</span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium">Tiles & Fittings</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "media", label: "Media Manager", icon: ImageIcon },
              { id: "categories", label: "Category Manager", icon: Tags },
              { id: "products", label: "Product Manager", icon: ShoppingBag },
              { id: "customers", label: "Customers", icon: Users },
              { id: "whatsapp", label: "WhatsApp Settings", icon: Phone },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setEditingBanner(null);
                    setEditingCategory(null);
                    setEditingProduct(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
                    active 
                      ? "bg-[var(--gold)] text-slate-brand font-bold shadow-md shadow-black/10" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs font-semibold text-white">System Admin</div>
              <div className="text-[10px] text-white/40">admin@royal300.com</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 flex items-center justify-center transition-colors"
              title="Logout System"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN BODY */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Toast Notification popup */}
        {feedback && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-[var(--gold)]/50 text-white text-xs font-semibold rounded-xl py-3.5 px-6 shadow-2xl animate-slide-in-right flex items-center gap-2">
            <CheckCircle size={14} className="text-[var(--gold)]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-subtle flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-semibold text-lg md:text-xl capitalize text-slate-brand">
              {activeTab === "whatsapp" ? "WhatsApp Configuration" : `${activeTab} manager`}
            </h1>
            <span className="text-[var(--gold)]/35 text-xs">•</span>
            <span className="text-xs uppercase tracking-widest text-[var(--charcoal)]/50 font-semibold">Saha Administration</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-xs font-semibold border border-subtle rounded-full py-1.5 px-4 text-slate-brand hover:border-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 shadow-sm bg-white"
            >
              <Globe size={13} /> Storefront
            </a>
          </div>
        </header>

        {/* Dynamic Route Container */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {actionLoading && (
            <div className="absolute inset-0 z-[100] bg-white/40 backdrop-blur-[0.5px] flex items-center justify-center">
              <Loader2 size={36} className="text-[var(--gold)] animate-spin" />
            </div>
          )}

          {/* ==========================================
              TAB A: ANALYTICS DASHBOARD
              ========================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-up">
              {/* Analytics Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { label: "Products Catalog", count: stats.products, icon: ShoppingBag, color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600" },
                  { label: "Tile Categories", count: stats.categories, icon: Tags, color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600" },
                  { label: "Total Purchases", count: stats.customers, icon: Users, color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600" },
                ].map((card, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden"
                  >
                    <div className="text-left relative z-10">
                      <div className="text-2xl md:text-3xl font-display font-bold text-slate-brand leading-none">
                        {card.count}
                      </div>
                      <div className="text-[11px] md:text-xs text-[var(--charcoal)]/50 uppercase tracking-widest font-semibold mt-1.5 leading-none">
                        {card.label}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <card.icon size={22} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Analytics table: Recent WhatsApp checkout orders */}
              <div className="bg-white border border-subtle rounded-xl p-6 shadow-sm text-left">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-semibold text-slate-brand text-lg">Recent Orders</h3>
                  <button 
                    onClick={() => setActiveTab("customers")} 
                    className="text-xs font-bold text-[var(--gold)] hover:text-slate-brand transition-colors flex items-center gap-1 bg-slate-50 border border-subtle hover:border-[var(--gold)]/50 rounded-full px-4 py-1.5 shadow-sm cursor-pointer"
                  >
                    View All Customers Log <ArrowRight size={12} />
                  </button>
                </div>
                {stats.recentOrders.length === 0 ? (
                  <div className="text-center py-10 text-[var(--charcoal)]/50 text-sm">No orders registered yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-subtle bg-slate-50/50 text-[11px] uppercase tracking-widest text-[var(--charcoal)]/50 font-bold">
                          <th className="py-3 px-4">Customer Name</th>
                          <th className="py-3 px-4">Contact Number</th>
                          <th className="py-3 px-4">Delivery Address</th>
                          <th className="py-3 px-4 text-right">Order Date</th>
                          <th className="py-3 px-4 text-right">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-subtle">
                        {stats.recentOrders.map((ord: any) => (
                          <tr key={ord.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-semibold text-slate-brand">{ord.name}</td>
                            <td className="py-3.5 px-4 font-mono text-xs text-[var(--charcoal)]/80">{ord.mobile}</td>
                            <td className="py-3.5 px-4 text-xs text-[var(--slate)] max-w-xs truncate">{ord.address}</td>
                            <td className="py-3.5 px-4 text-right text-xs text-[var(--charcoal)]/50">{new Date(ord.created_at).toLocaleDateString()}</td>
                            <td className="py-3.5 px-4 text-right font-bold text-[var(--gold)]">{inr(ord.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB B: MEDIA MANAGER (Slideshow Slider)
              ========================================== */}
          {activeTab === "media" && (
            <div className="space-y-6 text-left animate-fade-up">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-semibold text-slate-brand text-lg">Slideshow Slider Images</h3>
                  <p className="text-xs text-[var(--charcoal)]/50">Add or manage banner slides running in your home page header slideshow.</p>
                </div>
                <button 
                  onClick={() => setEditingBanner({ image: "", heading: "", sub: "", label: "", slug: "", display_order: 1 })}
                  className="btn-gold !py-2.5 flex items-center gap-1.5 text-xs font-bold"
                >
                  <Plus size={14} /> Add Slide Banner
                </button>
              </div>

              {/* Banner Modal */}
              {editingBanner && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)'}}>
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-subtle">
                      <h4 className="font-display font-semibold text-slate-brand text-base">
                        {editingBanner.id ? "Edit Slide Banner" : "Add New Slide Banner"}
                      </h4>
                      <button type="button" onClick={() => setEditingBanner(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer">×</button>
                    </div>
                    <form onSubmit={handleSaveBanner} className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <ImageUploadField
                          label="Banner Image *"
                          value={editingBanner.image}
                          onChange={(url) => setEditingBanner({ ...editingBanner, image: url })}
                          recommendedSize="1920x800 px"
                          placeholder="Upload JPG/PNG banner slide..."
                        />
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Label (Mini Tag)</label>
                          <input type="text" value={editingBanner.label} onChange={(e) => setEditingBanner({ ...editingBanner, label: e.target.value })} className="ipt" placeholder="e.g. Floor & Wall Tiles" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Heading</label>
                          <input type="text" value={editingBanner.heading} onChange={(e) => setEditingBanner({ ...editingBanner, heading: e.target.value })} className="ipt" placeholder="Leave blank for image-only slide" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Subtitle</label>
                          <input type="text" value={editingBanner.sub} onChange={(e) => setEditingBanner({ ...editingBanner, sub: e.target.value })} className="ipt" placeholder="e.g. Premium floor and wall tiles" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Link Category Slug</label>
                          <input type="text" value={editingBanner.slug} onChange={(e) => setEditingBanner({ ...editingBanner, slug: e.target.value })} className="ipt" placeholder="e.g. floor-tiles" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Display Order</label>
                          <input type="number" value={editingBanner.display_order} onChange={(e) => setEditingBanner({ ...editingBanner, display_order: parseInt(e.target.value) || 0 })} className="ipt" placeholder="1" />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end border-t border-subtle pt-4">
                        <button type="button" onClick={() => setEditingBanner(null)} className="btn-outline-slate !py-2.5 !px-5 text-xs font-semibold">Cancel</button>
                        <button type="submit" className="btn-gold !py-2.5 !px-6 text-xs font-bold">Save Banner</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Banners display */}
              <div className="grid md:grid-cols-3 gap-6">
                {banners.map((ban: any) => (
                  <div key={ban.id} className="bg-white border border-subtle rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                      <img src={ban.image} alt="" className="w-full h-full object-cover" />
                      {!ban.heading && (
                        <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold py-1 px-2.5 rounded">Image Only</div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="text-left mb-4">
                        <div className="text-[10px] uppercase font-bold text-[var(--gold)] tracking-wider">{ban.label || "No Tag Label"}</div>
                        <h4 className="font-display font-semibold text-slate-brand text-sm line-clamp-1 mt-0.5">{ban.heading || "Image-Only Slide"}</h4>
                        <p className="text-[11px] text-[var(--charcoal)]/60 line-clamp-2 mt-1">{ban.sub || "Background image only slide."}</p>
                        <div className="text-[10px] font-mono text-[var(--charcoal)]/50 mt-2">Order: {ban.display_order}</div>
                      </div>
                      <div className="flex gap-2 justify-end border-t border-subtle pt-3">
                        <button onClick={() => setEditingBanner(ban)} className="w-8 h-8 rounded border border-subtle text-[var(--slate)] hover:border-[var(--gold)]/60 hover:text-[var(--gold)] flex items-center justify-center transition-colors"><Edit size={13} /></button>
                        <button onClick={() => handleDeleteBanner(ban.id)} className="w-8 h-8 rounded border border-subtle text-red-500 hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB C: CATEGORY MANAGER
              ========================================== */}
          {activeTab === "categories" && (
            <div className="space-y-6 text-left animate-fade-up">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-semibold text-slate-brand text-lg">Category Manager</h3>
                  <p className="text-xs text-[var(--charcoal)]/50">Add, edit, or delete storefront tile categories.</p>
                </div>
                <button 
                  onClick={() => setEditingCategory({ name: "", slug: "", image: "", banner: "", blurb: "", is_featured: 1 })}
                  className="btn-gold !py-2.5 flex items-center gap-1.5 text-xs font-bold"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {/* Category Modal — only 3 fields */}
              {editingCategory && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)'}}>
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-subtle">
                      <h4 className="font-display font-semibold text-slate-brand text-base">
                        {editingCategory.id ? "Edit Category" : "Add New Category"}
                      </h4>
                      <button type="button" onClick={() => setEditingCategory(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer">×</button>
                    </div>
                    <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
                      {/* Field 1: Category Name */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Category Name *</label>
                        <input 
                          required
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/,"");
                            setEditingCategory({ ...editingCategory, name, slug });
                          }}
                          className="ipt"
                          placeholder="e.g. Vitrified Tiles"
                          autoFocus
                        />
                      </div>

                      {/* Field 2: Image Upload */}
                      <ImageUploadField
                        label="Category Image *"
                        value={editingCategory.image}
                        onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                        recommendedSize="500x500 px"
                        placeholder="Upload JPG/PNG thumbnail..."
                      />

                      {/* Field 3: Feature in Home Screen */}
                      <div className="flex items-center gap-3 bg-slate-50 border border-subtle rounded-lg px-4 py-3 cursor-pointer" onClick={() => setEditingCategory({ ...editingCategory, is_featured: editingCategory.is_featured === 1 ? 0 : 1 })}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${editingCategory.is_featured === 1 ? 'bg-[var(--gold)] border-[var(--gold)]' : 'bg-white border-slate-300'}`}>
                          {editingCategory.is_featured === 1 && <Check size={12} className="text-slate-brand" strokeWidth={3} />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-brand uppercase tracking-wider">Feature in Home Screen</div>
                          <div className="text-[10px] text-[var(--charcoal)]/50 mt-0.5">Show this category in the homepage "Shop by Category" grid</div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end border-t border-subtle pt-4">
                        <button type="button" onClick={() => setEditingCategory(null)} className="btn-outline-slate !py-2.5 !px-5 text-xs font-semibold">Cancel</button>
                        <button type="submit" className="btn-gold !py-2.5 !px-6 text-xs font-bold">Save Category</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Categories list table */}
              <div className="bg-white border border-subtle rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-subtle bg-slate-50 text-[11px] uppercase tracking-widest text-[var(--charcoal)]/50 font-bold">
                        <th className="py-4 px-6 w-20">Image</th>
                        <th className="py-4 px-6">Category Name</th>
                        <th className="py-4 px-6 text-center">Featured on Home</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-subtle">
                      {categories.map((cat: any) => (
                        <tr key={cat.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6">
                            <div className="w-12 h-12 rounded overflow-hidden bg-slate-100 border border-subtle">
                              <img src={cat.image} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-brand text-sm">{cat.name}</div>
                            <div className="text-[10px] font-mono text-[var(--charcoal)]/40 mt-0.5">{cat.slug}</div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {(cat.is_featured === 1 || cat.is_featured === true || cat.is_featured === "1") ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 py-1 px-3 rounded-full uppercase">✓ Featured</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--charcoal)]/40 bg-slate-100 py-1 px-3 rounded-full uppercase">Hidden</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => setEditingCategory({ ...cat, is_featured: (cat.is_featured === 1 || cat.is_featured === true || cat.is_featured === "1") ? 1 : 0 })}
                                className="w-8 h-8 rounded border border-subtle text-[var(--slate)] hover:border-[var(--gold)]/60 hover:text-[var(--gold)] flex items-center justify-center transition-colors bg-white"
                              >
                                <Edit size={13} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="w-8 h-8 rounded border border-subtle text-red-500 hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center transition-colors bg-white"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr><td colSpan={4} className="py-12 text-center text-[var(--charcoal)]/50 text-sm">No categories yet. Click "Add Category" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB D: PRODUCT MANAGER
              ========================================== */}
          {activeTab === "products" && (
            <div className="space-y-6 text-left animate-fade-up">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-semibold text-slate-brand text-lg">Product Catalog Manager</h3>
                  <p className="text-xs text-[var(--charcoal)]/50">Manage your tiles catalog. Add, edit, or delete items instantly.</p>
                </div>
                <button 
                  onClick={() => setEditingProduct({ 
                    id: "", slug: "", name: "", category_slug: categories[0]?.slug || "", 
                    price: 0, old_price: 0, image: "", gallery: [], description: "", 
                    details: ["Premium Quality Certified", "Available in bulk orders"], 
                    specs: [{ label: "Material", value: "Ceramic" }, { label: "Size", value: "600 × 600 mm" }, { label: "Finish", value: "Glossy" }, { label: "Coverage", value: "4 tiles per box" }],
                    shipping_info: "Delivered across Barasat and nearby areas within 2–4 business days. Free shipping on orders above ₹5000.",
                    return_policy: "7-day hassle-free return on unused products in original packaging."
                  })}
                  className="btn-gold !py-2.5 flex items-center gap-1.5 text-xs font-bold"
                >
                  <Plus size={14} /> Create New Product
                </button>
              </div>

              {/* Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 overflow-y-auto" style={{background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)'}}>
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-subtle sticky top-0 bg-white rounded-t-2xl z-10">
                      <h4 className="font-display font-semibold text-slate-brand text-base">
                        {editingProduct.isEdit ? "Edit Product" : "Create New Product"}
                      </h4>
                      <button type="button" onClick={() => setEditingProduct(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer">×</button>
                    </div>
                  <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
                  <div className=""></div>
                  
                  {/* Standard details grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Product ID (Optional SKU)</label>
                      <input 
                        type="text"
                        disabled={editingProduct.isEdit}
                        value={editingProduct.id}
                        onChange={(e) => setEditingProduct({ ...editingProduct, id: e.target.value })}
                        className="ipt disabled:bg-slate-100 disabled:text-slate-400"
                        placeholder="Leave blank to use slug as ID"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Product Name *</label>
                      <input 
                        required
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                          setEditingProduct({ ...editingProduct, name, slug });
                        }}
                        className="ipt"
                        placeholder="e.g. Carrara Gold Glazed Tile"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">URL URL Slug *</label>
                      <input 
                        required
                        type="text"
                        value={editingProduct.slug}
                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                        className="ipt"
                        placeholder="e.g. carrara-gold-glazed-tile"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Product Category *</label>
                      <select
                        value={editingProduct.category_slug}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category_slug: e.target.value })}
                        className="ipt"
                      >
                        {categories.map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Offer Price *</label>
                      <input 
                        required
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="ipt"
                        placeholder="e.g. 520"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Original Price (Strikeout)</label>
                      <input 
                        type="number"
                        value={editingProduct.old_price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, old_price: parseFloat(e.target.value) || 0 })}
                        className="ipt"
                        placeholder="e.g. 680"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 border-t border-subtle pt-4 space-y-2">
                    <ImageUploadField
                      label="Main Product Image *"
                      value={editingProduct.image}
                      onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                      recommendedSize="800x800 px (Square)"
                      placeholder="Upload JPG/PNG main product showcase image..."
                    />
                    <GalleryUploadField
                      gallery={editingProduct.gallery || []}
                      onChange={(urls) => setEditingProduct({ ...editingProduct, gallery: urls })}
                    />
                  </div>

                  <div className="border-t border-subtle pt-4 space-y-4">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-slate-brand mb-1">Product Description & Bullet Details</label>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-[var(--charcoal)]/60 mb-1.5">Summary Text</label>
                      <textarea 
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="ipt"
                        placeholder="Detailed text description..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-[var(--charcoal)]/60 mb-1.5">Highlights / Checklist Boxes (one per line)</label>
                      <textarea 
                        rows={2}
                        value={Array.isArray(editingProduct.details) ? editingProduct.details.join("\n") : ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, details: e.target.value.split("\n").filter(Boolean) })}
                        className="ipt"
                        placeholder="e.g. Premium Quality Certified&#10;Available in bulk orders"
                      />
                      <span className="text-[10px] text-[var(--charcoal)]/50 mt-1 block">These will render with elegant gold checkmarks next to them in the storefront details list.</span>
                    </div>
                  </div>

                  {/* Specifications boxes (Material, Size, Finish, Coverage) */}
                  <div className="border-t border-subtle pt-4 space-y-4">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-slate-brand mb-1">Specification Parameters</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Material", "Size", "Finish", "Coverage"].map((label) => {
                        const spec = Array.isArray(editingProduct.specs) ? editingProduct.specs.find((s: any) => s.label === label) : null;
                        const value = spec ? spec.value : "";
                        return (
                          <div key={label}>
                            <label className="block text-[11px] uppercase tracking-wider font-medium text-[var(--charcoal)]/70 mb-1.5">{label}</label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => {
                                const newVal = e.target.value;
                                let currentSpecs = Array.isArray(editingProduct.specs) ? [...editingProduct.specs] : [];
                                const idx = currentSpecs.findIndex((s: any) => s.label === label);
                                if (idx > -1) {
                                  currentSpecs[idx] = { label, value: newVal };
                                } else {
                                  currentSpecs.push({ label, value: newVal });
                                }
                                setEditingProduct({ ...editingProduct, specs: currentSpecs });
                              }}
                              className="ipt"
                              placeholder={`e.g. ${label === "Material" ? "Vitrified" : label === "Size" ? "600x600 mm" : ""}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping & Return policy fields */}
                  <div className="grid md:grid-cols-2 gap-4 border-t border-subtle pt-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Shipping Info Info</label>
                      <textarea
                        rows={2}
                        value={editingProduct.shipping_info}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shipping_info: e.target.value })}
                        className="ipt"
                        placeholder="Shipping text details..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-1.5">Return Policy policy</label>
                      <textarea
                        rows={2}
                        value={editingProduct.return_policy}
                        onChange={(e) => setEditingProduct({ ...editingProduct, return_policy: e.target.value })}
                        className="ipt"
                        placeholder="Return policies text details..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-subtle pt-4">
                    <button type="button" onClick={() => setEditingProduct(null)} className="btn-outline-slate !py-2.5 !px-5 text-xs font-semibold">Cancel</button>
                    <button type="submit" className="btn-gold !py-2.5 !px-6 text-xs font-bold">Save Product</button>
                  </div>
                  </form>
                  </div>
                </div>
              )}

              {/* Products listing grid view */}
              <div className="bg-white border border-subtle rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-subtle bg-slate-50 text-[11px] uppercase tracking-widest text-[var(--charcoal)]/50 font-bold">
                        <th className="py-4 px-6 w-20">Image</th>
                        <th className="py-4 px-6">Product Details</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Offer Price</th>
                        <th className="py-4 px-6">Strike Price</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-subtle">
                      {products.map((prod: any) => {
                        const cat = categories.find(c => c.slug === prod.category_slug);
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6">
                              <div className="w-12 h-12 rounded overflow-hidden bg-slate-100 border border-subtle">
                                <img src={prod.image} alt="" className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-semibold text-slate-brand text-sm">{prod.name}</div>
                              <div className="text-[10px] font-mono text-[var(--charcoal)]/40 mt-0.5 uppercase">ID: {prod.id}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-xs bg-slate-100 text-slate-700 py-1 px-3 rounded-full font-semibold border border-slate-200">
                                {cat ? cat.name : prod.category_slug}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-[var(--gold)]">{inr(prod.price)}</td>
                            <td className="py-4 px-6 line-through text-[var(--charcoal)]/40">{prod.old_price ? inr(prod.old_price) : "-"}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => {
                                    let galleryArr = [];
                                    let detailsArr = [];
                                    let specsArr = [];
                                    try { galleryArr = JSON.parse(prod.gallery || "[]"); } catch { galleryArr = prod.gallery || []; }
                                    try { detailsArr = JSON.parse(prod.details || "[]"); } catch { detailsArr = prod.details || []; }
                                    try { specsArr = JSON.parse(prod.specs || "[]"); } catch { specsArr = prod.specs || []; }

                                    setEditingProduct({ 
                                      ...prod, 
                                      gallery: galleryArr, 
                                      details: detailsArr, 
                                      specs: specsArr,
                                      isEdit: true 
                                    });
                                  }}
                                  className="w-8 h-8 rounded border border-subtle text-[var(--slate)] hover:border-[var(--gold)]/60 hover:text-[var(--gold)] flex items-center justify-center transition-colors bg-white"
                                >
                                  <Edit size={13} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="w-8 h-8 rounded border border-subtle text-red-500 hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center transition-colors bg-white"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB E: CUSTOMERS & PURCHASES LOG (CSV Download)
              ========================================== */}
          {activeTab === "customers" && (
            <div className="space-y-6 text-left animate-fade-up">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-semibold text-slate-brand text-lg">Customer Database</h3>
                  <p className="text-xs text-[var(--charcoal)]/50">View all client checkout logs and download a formatted spreadsheet list of all orders.</p>
                </div>
                {customers.length > 0 && (
                  <button 
                    onClick={downloadCustomerCSV}
                    className="btn-gold !py-2.5 flex items-center gap-1.5 text-xs font-bold shadow-md shadow-[var(--gold)]/10"
                  >
                    <Download size={14} /> Download Customers CSV
                  </button>
                )}
              </div>

              {/* Customer data table */}
              <div className="bg-white border border-subtle rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-subtle bg-slate-50 text-[11px] uppercase tracking-widest text-[var(--charcoal)]/50 font-bold">
                        <th className="py-4 px-6 w-16 text-center">ID</th>
                        <th className="py-4 px-6">Customer Details</th>
                        <th className="py-4 px-6">Address</th>
                        <th className="py-4 px-6">Items Purchased</th>
                        <th className="py-4 px-6">Total Order</th>
                        <th className="py-4 px-6">Order Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-subtle">
                      {customers.map((c: any) => {
                        let itemsList: any[] = [];
                        try {
                          itemsList = JSON.parse(c.items || "[]");
                        } catch {}
                        
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6 font-mono text-xs text-[var(--charcoal)]/50 text-center">{c.id}</td>
                            <td className="py-4 px-6">
                              <div className="font-semibold text-slate-brand text-sm">{c.name}</div>
                              <div className="text-xs font-mono text-[var(--charcoal)]/60 mt-0.5">{c.mobile}</div>
                            </td>
                            <td className="py-4 px-6 max-w-xs">
                              <div className="text-xs text-[var(--slate)] leading-snug line-clamp-2">{c.address}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                {itemsList.map((itm: any, idx: number) => (
                                  <div key={idx} className="text-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                                    <span>{itm.name} <span className="text-[var(--charcoal)]/50 font-semibold">× {itm.qty}</span></span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-brand">{inr(c.total_price)}</td>
                            <td className="py-4 px-6 text-xs text-[var(--charcoal)]/60">{new Date(c.created_at).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[var(--charcoal)]/50 text-sm">No customers registered yet. Placing mock checkout orders logs them here.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB F: WHATSAPP NUMBER CONFIGURATION
              ========================================== */}
          {activeTab === "whatsapp" && (
            <div className="text-left animate-fade-up max-w-xl">
              <div className="bg-white border border-subtle rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-slate-brand text-lg">WhatsApp Redirect Configuration</h3>
                  <p className="text-xs text-[var(--charcoal)]/50 mt-1">Configure the global phone number receiving customer redirect orders during checkout.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] mb-2">WhatsApp Redirect Number *</label>
                    <div className="flex gap-2">
                      <input 
                        required
                        type="text"
                        value={settings.whatsapp_number}
                        onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                        className="ipt font-semibold text-base"
                        placeholder="e.g. 919330833711"
                      />
                    </div>
                    <span className="text-[10px] text-[var(--charcoal)]/50 mt-1.5 block">
                      Include country code (e.g. `91` for India) with absolutely NO spaces, pluses (`+`), or hyphens. (Standard: `919330833711`).
                    </span>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 flex items-start gap-2">
                    <Settings size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-[var(--slate)] leading-relaxed">
                      <span className="font-semibold block text-slate-brand">Dynamic Global Redirection</span>
                      Updating this value immediately changes the receiver number on all **"Order via WhatsApp"** floating cart elements and main checkout forms throughout the storefront.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold flex items-center justify-center gap-1.5 !py-3.5 !px-8 text-xs font-bold"
                  >
                    <Check size={14} /> Update Phone Settings
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .ipt {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid var(--subtle-border);
          border-radius: 6px;
          background: var(--offwhite);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          transition: border-color 0.2s;
        }
        .ipt:focus {
          outline: none;
          border-color: var(--gold);
        }
      `}</style>
    </div>
  );
}
