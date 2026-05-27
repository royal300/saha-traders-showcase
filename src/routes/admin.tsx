import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Tags,
  ShoppingBag,
  Users,
  Phone,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  PlusCircle,
  Settings,
  Globe,
  ShieldAlert,
  Loader2,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Eye,
  RefreshCw,
  Package,
  Package,
  BarChart3,
  Menu,
} from "lucide-react";
import { inr } from "@/lib/products";
import logoPng from "@/logo.png";
import { toast } from "sonner";
import {
  getDashboardStatsFn,
  getBannersFn,
  saveBannerFn,
  deleteBannerFn,
  getCategoriesFn,
  saveCategoryFn,
  deleteCategoryFn,
  getProductsFn,
  saveProductFn,
  deleteProductFn,
  getCustomersFn,
  getSettingsFn,
  updateSettingFn,
  uploadImageFn,
} from "@/lib/server-functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Saha Marble & Tiles" }] }),
  component: AdminPage,
});

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (inline — admin is fully self-contained)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  sidebar: "#0f172a",
  sidebarBorder: "rgba(255,255,255,0.06)",
  gold: "#d4a017",
  goldHover: "#b8860b",
  bg: "#f1f5f9",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  danger: "#ef4444",
  success: "#10b981",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1.5px solid ${C.border}`,
  fontSize: 13,
  color: C.text,
  background: "#f8fafc",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const btnGold: React.CSSProperties = {
  background: C.gold,
  color: "#0f172a",
  border: "none",
  borderRadius: 10,
  padding: "10px 20px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  letterSpacing: "0.03em",
  transition: "all 0.15s",
};

const btnDanger: React.CSSProperties = {
  background: "#fef2f2",
  color: C.danger,
  border: `1px solid #fecaca`,
  borderRadius: 8,
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  transition: "all 0.15s",
};

const btnOutline: React.CSSProperties = {
  background: "white",
  color: C.muted,
  border: `1.5px solid ${C.border}`,
  borderRadius: 10,
  padding: "10px 20px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: C.muted,
  display: "block",
  marginBottom: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOAD FIELD
// ─────────────────────────────────────────────────────────────────────────────
function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "Click to upload image",
  recommendedSize,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  recommendedSize?: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(",")[1];
      try {
        const res = await uploadImageFn({ data: { fileName: file.name, base64Data } });
        if (res.success && res.url) {
          onChange(res.url);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Upload failed: " + (res.error || "Unknown error"));
        }
      } catch (err: any) {
        toast.error("Upload error: " + err.message);
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={labelStyle}>{label}</label>
        {recommendedSize && (
          <span style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
            {recommendedSize}
          </span>
        )}
      </div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: value ? `1.5px solid ${C.border}` : "2px dashed #cbd5e1",
          borderRadius: 12,
          background: "#f8fafc",
          cursor: uploading ? "wait" : "pointer",
          overflow: "hidden",
          transition: "border-color 0.15s",
        }}
      >
        {uploading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
            <Loader2 size={15} style={{ animation: "spin 1s linear infinite", color: C.gold }} />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Uploading image...</span>
          </div>
        ) : value ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10 }}>
            <img
              src={value}
              alt="Preview"
              style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}` }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.success, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle size={11} /> Image Uploaded
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, wordBreak: "break-all" }}>
                {value.split("/").pop()}
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: "white", border: `1px solid ${C.border}`, padding: "5px 12px", borderRadius: 8, flexShrink: 0 }}>
              Change
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ImageIcon size={15} color="#94a3b8" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{placeholder}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>JPEG, PNG, WEBP</div>
            </div>
          </div>
        )}
      </div>
      <input type="file" ref={inputRef} onChange={handleFile} accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: "none" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY UPLOAD
// ─────────────────────────────────────────────────────────────────────────────
function GalleryUpload({ gallery, onChange }: { gallery: string[]; onChange: (g: string[]) => void }) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);
    const newUrls = [...gallery];
    let added = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
      const result = await uploadImageFn({ data: { fileName: file.name, base64Data: b64 } });
      if (result.success && result.url) { newUrls.push(result.url); added++; }
    }
    onChange(newUrls);
    setUploading(false);
    if (added > 0) toast.success(`${added} gallery image(s) uploaded!`);
  };

  return (
    <div>
      <label style={labelStyle}>Gallery Images</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 8 }}>
        {gallery.map((url, idx) => (
          <div key={idx} style={{ aspectRatio: "1", position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={() => onChange(gallery.filter((_, i) => i !== idx))}
              style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.85)", color: "white", border: "none", cursor: "pointer", opacity: 0, transition: "0.2s", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >✕ Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ aspectRatio: "1", border: "2px dashed #cbd5e1", borderRadius: 8, background: "#f8fafc", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: "#94a3b8", minHeight: 76 }}
        >
          {uploading
            ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            : <><PlusCircle size={18} /><span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Add</span></>
          }
        </button>
      </div>
      <input type="file" ref={inputRef} onChange={handleFiles} accept="image/*" multiple style={{ display: "none" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DELETE DIALOG
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmDelete({
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "white", borderRadius: 18, padding: "28px 28px 24px", maxWidth: 420, width: "90%", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={20} color={C.danger} />
          </div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: C.text, margin: "0 0 6px" }}>Confirm Delete</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>{message}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} disabled={loading} style={{ ...btnOutline, padding: "9px 18px" }}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ background: C.danger, color: "white", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={13} />}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = 640 }: { title: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", overflowY: "auto", padding: "32px 16px" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: width, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: C.text, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}
          >
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER (consistent heading + subtitle + action button)
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontWeight: 800, fontSize: 20, color: C.text, margin: "0 0 4px" }}>{title}</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 6 }}>{label}</div>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={22} color="white" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA TABLE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function DataTable({ headers, children, empty }: { headers: string[]; children: React.ReactNode; empty?: boolean }) {
  return (
    <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
              {headers.map((h) => (
                <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted, whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td colSpan={headers.length} style={{ padding: "48px 18px", textAlign: "center", color: C.muted, fontSize: 13 }}>
                  No records found.
                </td>
              </tr>
            ) : children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE ROW BASE STYLES
// ─────────────────────────────────────────────────────────────────────────────
const tdStyle: React.CSSProperties = { padding: "13px 18px", borderBottom: `1px solid #f1f5f9`, verticalAlign: "middle" };
const actionBtnStyle: React.CSSProperties = { width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: "white", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" };

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("saha_admin_auth", "true");
        onLogin();
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: `${C.gold}15`, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(80px)" }} />
      </div>
      <div style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 36px", backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.4)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${C.gold}20`, border: `1.5px solid ${C.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Settings size={26} color={C.gold} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: "0 0 6px" }}>Admin Control Panel</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Saha Marble & Tiles</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldAlert size={15} color="#f87171" />
            <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ ...labelStyle, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Username</label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={{ ...inputStyle, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...btnGold, justifyContent: "center", padding: "14px", fontSize: 13, borderRadius: 12, marginTop: 8 }}
          >
            {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Verifying...</> : "Authorize Access"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TAB
// ─────────────────────────────────────────────────────────────────────────────
function DashboardTab({ stats }: { stats: any }) {
  return (
    <div>
      <SectionHeader title="Dashboard Overview" subtitle="Real-time analytics and store performance at a glance." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Products" value={stats.products ?? 0} icon={ShoppingBag} color="#6366f1" />
        <StatCard label="Categories" value={stats.categories ?? 0} icon={Tags} color={C.goldHover} />
        <StatCard label="Total Orders" value={stats.customers ?? 0} icon={Users} color="#10b981" />
        <StatCard label="Unique Visitors" value={stats.visitors ?? 0} icon={BarChart3} color="#f59e0b" />
      </div>

      {/* Recent Orders */}
      <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, color: C.text, margin: 0 }}>Recent Orders</h3>
        </div>
        {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: C.muted, fontSize: 13 }}>No orders yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                  {["Customer", "Mobile", "Address", "Date", "Total"].map((h) => (
                    <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: `1px solid #f1f5f9` }}>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: C.text }}>{o.name}</span></td>
                    <td style={tdStyle}><span style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{o.mobile}</span></td>
                    <td style={{ ...tdStyle, maxWidth: 200 }}><span style={{ fontSize: 12, color: C.muted, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.address}</span></td>
                    <td style={tdStyle}><span style={{ fontSize: 12, color: C.muted }}>{new Date(o.created_at).toLocaleDateString("en-IN")}</span></td>
                    <td style={tdStyle}><span className="price-inr" style={{ fontWeight: 800, color: C.goldHover }}>{inr(o.total_price)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA TAB (Banners / Slideshow)
// ─────────────────────────────────────────────────────────────────────────────
function MediaTab({ banners, onReload }: { banners: any[]; onReload: () => Promise<void> }) {
  const [editing, setEditing] = React.useState<any>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  const emptyForm = { image: "", heading: "", sub: "", label: "", slug: "", display_order: 1 };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveBannerFn({ data: editing });
      if (res.success) {
        toast.success(editing.id ? "Banner updated!" : "Banner added!");
        setEditing(null);
        await onReload();
      } else {
        toast.error("Failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // FIXED: use { data: { id } } pattern to match server function signature
      const res = await deleteBannerFn({ data: { id: deleteTarget.id } });
      if (res.success) {
        toast.success("Banner deleted successfully.");
        setDeleteTarget(null);
        await onReload();
      } else {
        toast.error("Delete failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Media Manager"
        subtitle="Manage your homepage slideshow banners."
        action={
          <button onClick={() => setEditing({ ...emptyForm })} style={btnGold}>
            <Plus size={14} /> Add Banner
          </button>
        }
      />

      {editing && (
        <Modal title={editing.id ? "Edit Banner" : "Add New Banner"} onClose={() => setEditing(null)} width={680}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <ImageUploadField label="Banner Image *" value={editing.image} onChange={(u) => setEditing({ ...editing, image: u })} recommendedSize="1920×800 px" placeholder="Upload banner slide image" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Heading</label>
                <input style={inputStyle} type="text" value={editing.heading} onChange={(e) => setEditing({ ...editing, heading: e.target.value })} placeholder="e.g. Premium Floor Tiles" />
              </div>
              <div>
                <label style={labelStyle}>Mini Tag / Label</label>
                <input style={inputStyle} type="text" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="e.g. Floor & Wall Tiles" />
              </div>
              <div>
                <label style={labelStyle}>Subtitle</label>
                <input style={inputStyle} type="text" value={editing.sub} onChange={(e) => setEditing({ ...editing, sub: e.target.value })} placeholder="e.g. Crafted for elegance..." />
              </div>
              <div>
                <label style={labelStyle}>Link to Category Slug</label>
                <input style={inputStyle} type="text" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="e.g. floor-tiles" />
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input style={inputStyle} type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 1 })} min={1} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              <button type="button" onClick={() => setEditing(null)} style={btnOutline}>Cancel</button>
              <button type="submit" disabled={saving || !editing.image} style={btnGold}>
                {saving ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={13} /> Save Banner</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete
          message={`Delete the banner "${deleteTarget.heading || deleteTarget.label || "Image Slide"}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {banners.length === 0 ? (
        <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, padding: "64px 24px", textAlign: "center", color: C.muted }}>
          <ImageIcon size={36} color="#cbd5e1" style={{ marginBottom: 12 }} />
          <p style={{ margin: 0, fontSize: 13 }}>No banners yet. Click "Add Banner" to create your first slide.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {banners.map((ban: any) => (
            <div key={ban.id} style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ aspectRatio: "16/7", overflow: "hidden", background: "#f1f5f9", position: "relative" }}>
                <img src={ban.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.05em" }}>
                  ORDER {ban.display_order}
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em" }}>{ban.label || "No Tag"}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginTop: 3, marginBottom: 4 }}>{ban.heading || "Image-Only Slide"}</div>
                <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ban.sub || "Background image slide"}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <button onClick={() => setEditing({ ...ban })} style={{ ...actionBtnStyle, color: "#6366f1" }} title="Edit">
                    <Edit size={13} />
                  </button>
                  <button onClick={() => setDeleteTarget(ban)} style={{ ...actionBtnStyle, color: C.danger, borderColor: "#fecaca" }} title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES TAB
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesTab({ categories, onReload }: { categories: any[]; onReload: () => Promise<void> }) {
  const [editing, setEditing] = React.useState<any>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  const emptyForm = { name: "", slug: "", image: "", banner: "", blurb: "", is_featured: 1 };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.image) { toast.error("Please upload a category thumbnail image."); return; }
    setSaving(true);
    try {
      const res = await saveCategoryFn({ data: editing });
      if (res.success) {
        toast.success(editing.id ? "Category updated!" : "Category created!");
        setEditing(null);
        await onReload();
      } else {
        toast.error("Failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // FIXED: use { data: { id } } pattern to match server function signature
      const res = await deleteCategoryFn({ data: { id: deleteTarget.id } });
      if (res.success) {
        toast.success("Category and its products deleted.");
        setDeleteTarget(null);
        await onReload();
      } else {
        toast.error("Delete failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Category Manager"
        subtitle="Create and manage your product categories. Changes reflect instantly on the storefront."
        action={
          <button onClick={() => setEditing({ ...emptyForm })} style={btnGold}>
            <Plus size={14} /> Add Category
          </button>
        }
      />

      {editing && (
        <Modal title={editing.id ? `Edit: ${editing.name}` : "Add New Category"} onClose={() => setEditing(null)} width={700}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Left column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Category Name *</label>
                  <input
                    required
                    style={inputStyle}
                    type="text"
                    value={editing.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                      setEditing({ ...editing, name, slug });
                    }}
                    placeholder="e.g. Vitrified Tiles"
                    autoFocus
                  />
                  {editing.slug && (
                    <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginTop: 5 }}>
                      URL: /category/{editing.slug}
                    </div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Short Description</label>
                  <textarea
                    style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                    value={editing.blurb}
                    onChange={(e) => setEditing({ ...editing, blurb: e.target.value })}
                    placeholder="Brief category description shown on category page..."
                  />
                </div>
                {/* Featured toggle */}
                <div
                  onClick={() => setEditing({ ...editing, is_featured: editing.is_featured === 1 ? 0 : 1 })}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `2px solid ${editing.is_featured === 1 ? C.gold : C.border}`, background: editing.is_featured === 1 ? `${C.gold}10` : "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${editing.is_featured === 1 ? C.gold : "#cbd5e1"}`, background: editing.is_featured === 1 ? C.gold : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {editing.is_featured === 1 && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Feature on Home Screen</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Show in "Shop by Category" grid on homepage</div>
                  </div>
                </div>
              </div>
              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ImageUploadField
                  label="Category Thumbnail *"
                  value={editing.image}
                  onChange={(u) => setEditing({ ...editing, image: u })}
                  recommendedSize="500×500 px"
                  placeholder="Upload square thumbnail"
                />
                <ImageUploadField
                  label="Category Page Banner"
                  value={editing.banner || ""}
                  onChange={(u) => setEditing({ ...editing, banner: u })}
                  recommendedSize="1600×500 px"
                  placeholder="Upload wide banner for category page"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <button type="button" onClick={() => setEditing(null)} style={btnOutline}>Cancel</button>
              <button type="submit" disabled={saving} style={btnGold}>
                {saving ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={13} /> Save Category</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete
          message={`Delete category "${deleteTarget.name}"? All products under this category will also be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <DataTable
        headers={["", "Category", "Slug", "Featured", "Actions"]}
        empty={categories.length === 0}
      >
        {categories.map((cat: any) => {
          const isFeatured = cat.is_featured === 1 || cat.is_featured === true || cat.is_featured === "1";
          return (
            <tr key={cat.id} style={{ borderBottom: `1px solid #f1f5f9` }}>
              <td style={{ ...tdStyle, width: 56 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", background: "#f1f5f9", border: `1px solid ${C.border}` }}>
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={16} color="#cbd5e1" /></div>
                  }
                </div>
              </td>
              <td style={tdStyle}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{cat.name}</div>
                {cat.blurb && <div style={{ fontSize: 11, color: C.muted, marginTop: 2, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.blurb}</div>}
              </td>
              <td style={tdStyle}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6366f1", background: "#eef2ff", padding: "3px 8px", borderRadius: 6 }}>{cat.slug}</span>
              </td>
              <td style={tdStyle}>
                {isFeatured
                  ? <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>✓ Featured</span>
                  : <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, background: "#f1f5f9", padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hidden</span>
                }
              </td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setEditing({ ...cat, is_featured: isFeatured ? 1 : 0 })}
                    style={{ ...actionBtnStyle, color: "#6366f1" }}
                    title="Edit category"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    style={{ ...actionBtnStyle, color: C.danger, borderColor: "#fecaca" }}
                    title="Delete category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ProductsTab({ products, categories, onReload }: { products: any[]; categories: any[]; onReload: () => Promise<void> }) {
  const [editing, setEditing] = React.useState<any>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredProducts = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category_slug?.toLowerCase().includes(search.toLowerCase())
  );

  const newProductForm = {
    id: "",
    slug: "",
    name: "",
    category_slug: categories[0]?.slug || "",
    price: "",
    old_price: "",
    image: "",
    gallery: [],
    description: "",
    details: ["Premium Quality Certified", "Available in bulk orders"],
    specs: [
      { label: "Material", value: "Ceramic" },
      { label: "Size", value: "600 × 600 mm" },
      { label: "Finish", value: "Glossy" },
      { label: "Coverage", value: "4 tiles per box" },
    ],
    shipping_info: "Delivered across Barasat and nearby areas within 2–4 business days. Free shipping on orders above ₹5000.",
    return_policy: "7-day hassle-free return on unused products in original packaging.",
    isEdit: false,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.image) { toast.error("Please upload a product image."); return; }
    setSaving(true);
    try {
      const payload = {
        ...editing,
        price: parseFloat(editing.price) || 0,
        old_price: editing.old_price ? parseFloat(editing.old_price) : null,
      };
      const res = await saveProductFn({ data: payload });
      if (res.success) {
        toast.success(editing.isEdit ? "Product updated!" : "Product created!");
        setEditing(null);
        await onReload();
      } else {
        toast.error("Failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // FIXED: use { data: { id } } pattern to match server function signature
      const res = await deleteProductFn({ data: { id: deleteTarget.id } });
      if (res.success) {
        toast.success("Product deleted successfully.");
        setDeleteTarget(null);
        await onReload();
      } else {
        toast.error("Delete failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const addSpec = () => setEditing({ ...editing, specs: [...(editing.specs || []), { label: "", value: "" }] });
  const updateSpec = (i: number, k: "label" | "value", v: string) => {
    const specs = [...editing.specs];
    specs[i] = { ...specs[i], [k]: v };
    setEditing({ ...editing, specs });
  };
  const removeSpec = (i: number) => setEditing({ ...editing, specs: editing.specs.filter((_: any, idx: number) => idx !== i) });

  return (
    <div>
      <SectionHeader
        title="Product Catalog"
        subtitle={`Managing ${products.length} product${products.length !== 1 ? "s" : ""} across ${categories.length} categories.`}
        action={
          <button onClick={() => setEditing({ ...newProductForm })} style={btnGold}>
            <Plus size={14} /> Add Product
          </button>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          style={{ ...inputStyle, maxWidth: 360 }}
          type="text"
          placeholder="Search products or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {editing && (
        <Modal title={editing.isEdit ? `Edit: ${editing.name}` : "Create New Product"} onClose={() => setEditing(null)} width={780}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Row 1: Basic info */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {!editing.isEdit && (
                <div>
                  <label style={labelStyle}>Product ID (optional)</label>
                  <input style={inputStyle} type="text" value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} placeholder="Auto-generated if blank" />
                </div>
              )}
              <div style={{ gridColumn: editing.isEdit ? "1 / 2" : undefined }}>
                <label style={labelStyle}>Product Name *</label>
                <input
                  required
                  style={inputStyle}
                  type="text"
                  value={editing.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                    setEditing({ ...editing, name, slug });
                  }}
                  placeholder="e.g. Marble Floor Tile 600×600"
                />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  required
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={editing.category_slug}
                  onChange={(e) => setEditing({ ...editing, category_slug: e.target.value })}
                >
                  {categories.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Price */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input required style={inputStyle} type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <label style={labelStyle}>Original Price (₹)</label>
                <input style={inputStyle} type="number" step="0.01" value={editing.old_price} onChange={(e) => setEditing({ ...editing, old_price: e.target.value })} placeholder="Leave blank if no discount" />
              </div>
              <div>
                <label style={labelStyle}>URL Slug</label>
                <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: 11 }} type="text" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated-from-name" />
              </div>
            </div>

            {/* Row 3: Images */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ImageUploadField label="Main Product Image *" value={editing.image} onChange={(u) => setEditing({ ...editing, image: u })} recommendedSize="800×800 px" placeholder="Upload main product photo" />
              <GalleryUpload gallery={editing.gallery || []} onChange={(g) => setEditing({ ...editing, gallery: g })} />
            </div>

            {/* Row 4: Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Detailed product description..." />
            </div>

            {/* Row 5: Specs */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={labelStyle}>Specifications</label>
                <button type="button" onClick={addSpec} style={{ ...btnGold, padding: "5px 12px", fontSize: 11 }}>
                  <Plus size={11} /> Add Spec
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(editing.specs || []).map((spec: any, i: number) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                    <input style={{ ...inputStyle, padding: "8px 12px" }} type="text" value={spec.label} onChange={(e) => updateSpec(i, "label", e.target.value)} placeholder="Label (e.g. Material)" />
                    <input style={{ ...inputStyle, padding: "8px 12px" }} type="text" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Value (e.g. Ceramic)" />
                    <button type="button" onClick={() => removeSpec(i)} style={{ ...actionBtnStyle, color: C.danger, borderColor: "#fecaca" }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 6: Shipping + Returns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Shipping Info</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} value={editing.shipping_info} onChange={(e) => setEditing({ ...editing, shipping_info: e.target.value })} placeholder="Delivery timeframe and areas served..." />
              </div>
              <div>
                <label style={labelStyle}>Return Policy</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} value={editing.return_policy} onChange={(e) => setEditing({ ...editing, return_policy: e.target.value })} placeholder="Return conditions and timeframe..." />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <button type="button" onClick={() => setEditing(null)} style={btnOutline}>Cancel</button>
              <button type="submit" disabled={saving} style={btnGold}>
                {saving ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={13} /> {editing.isEdit ? "Update Product" : "Create Product"}</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete
          message={`Delete product "${deleteTarget.name}"? This action is permanent and cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <DataTable
        headers={["", "Product", "Category", "Price", "Actions"]}
        empty={filteredProducts.length === 0}
      >
        {filteredProducts.map((p: any) => (
          <tr key={p.id} style={{ borderBottom: `1px solid #f1f5f9` }}>
            <td style={{ ...tdStyle, width: 56 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", background: "#f1f5f9", border: `1px solid ${C.border}` }}>
                {p.image
                  ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={16} color="#cbd5e1" /></div>
                }
              </div>
            </td>
            <td style={tdStyle}>
              <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginTop: 2 }}>{p.id}</div>
            </td>
            <td style={tdStyle}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", background: "#eef2ff", padding: "3px 10px", borderRadius: 6 }}>
                {categories.find((c: any) => c.slug === p.category_slug)?.name || p.category_slug}
              </span>
            </td>
            <td style={tdStyle}>
              <div className="price-inr" style={{ fontWeight: 800, color: C.text, fontSize: 13 }}>{inr(parseFloat(p.price) || 0)}</div>
              {p.old_price && <div className="price-inr" style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>{inr(parseFloat(p.old_price))}</div>}
            </td>
            <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => {
                    let gallery = p.gallery || [];
                    let specs = p.specs || [];
                    let details = p.details || [];
                    try { if (typeof gallery === "string") gallery = JSON.parse(gallery); } catch { gallery = []; }
                    try { if (typeof specs === "string") specs = JSON.parse(specs); } catch { specs = []; }
                    try { if (typeof details === "string") details = JSON.parse(details); } catch { details = []; }
                    setEditing({ ...p, gallery, specs, details, price: p.price || "", old_price: p.old_price || "", isEdit: true });
                  }}
                  style={{ ...actionBtnStyle, color: "#6366f1" }}
                  title="Edit product"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  style={{ ...actionBtnStyle, color: C.danger, borderColor: "#fecaca" }}
                  title="Delete product"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMERS TAB
// ─────────────────────────────────────────────────────────────────────────────
function CustomersTab({ customers }: { customers: any[] }) {
  const downloadCSV = () => {
    if (customers.length === 0) return;
    const headers = ["Order ID", "Customer Name", "Mobile", "Address", "Items", "Total (INR)", "Date"];
    const rows = customers.map((c: any) => {
      let items = "";
      try { items = JSON.parse(c.items || "[]").map((i: any) => `${i.name} (×${i.qty})`).join("; "); } catch { items = c.items || ""; }
      return [c.id, `"${c.name}"`, c.mobile, `"${c.address}"`, `"${items}"`, c.total_price, new Date(c.created_at).toLocaleString("en-IN")];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Saha_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div>
      <SectionHeader
        title="Customer Orders"
        subtitle={`${customers.length} WhatsApp order${customers.length !== 1 ? "s" : ""} recorded.`}
        action={
          customers.length > 0
            ? <button onClick={downloadCSV} style={btnGold}><Download size={13} /> Export CSV</button>
            : undefined
        }
      />
      <DataTable
        headers={["#", "Customer", "Mobile", "Address", "Total", "Date"]}
        empty={customers.length === 0}
      >
        {customers.map((c: any) => (
          <tr key={c.id} style={{ borderBottom: `1px solid #f1f5f9` }}>
            <td style={{ ...tdStyle, color: C.muted, fontSize: 11, fontFamily: "monospace" }}>#{c.id}</td>
            <td style={tdStyle}><span style={{ fontWeight: 700, color: C.text }}>{c.name}</span></td>
            <td style={tdStyle}><span style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{c.mobile}</span></td>
            <td style={{ ...tdStyle, maxWidth: 220 }}><span style={{ fontSize: 12, color: C.muted, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.address}</span></td>
            <td style={tdStyle}><span className="price-inr" style={{ fontWeight: 800, color: C.goldHover }}>{inr(parseFloat(c.total_price) || 0)}</span></td>
            <td style={tdStyle}><span style={{ fontSize: 11, color: C.muted }}>{new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ─────────────────────────────────────────────────────────────────────────────
function SettingsTab({ settings, onReload }: { settings: Record<string, string>; onReload: () => Promise<void> }) {
  const [whatsapp, setWhatsapp] = React.useState(settings.whatsapp_number || "919330833711");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setWhatsapp(settings.whatsapp_number || "919330833711");
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateSettingFn({ key: "whatsapp_number", value: whatsapp });
      if (res.success) {
        toast.success("WhatsApp number updated globally!");
        await onReload();
      } else {
        toast.error("Failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Store Settings" subtitle="Configure global store settings like WhatsApp contact routing." />
      <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, padding: "28px 28px", maxWidth: 520, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontWeight: 800, fontSize: 15, color: C.text, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={16} color={C.gold} /> WhatsApp Configuration
        </h3>
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 24px", lineHeight: 1.6 }}>
          This is the number customers are connected to when they tap "Order via WhatsApp". Use full international format without + or spaces.
        </p>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>WhatsApp Number (with country code)</label>
            <input
              required
              style={inputStyle}
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
              placeholder="919330833711"
            />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
              Current: <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" style={{ color: "#059669", fontWeight: 600 }}>wa.me/{whatsapp}</a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={btnGold}>
              {saving ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={13} /> Save Settings</>}
            </button>
            <a href="/" target="_blank" rel="noreferrer" style={{ ...btnOutline, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Globe size={13} /> View Storefront
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "media", label: "Media Manager", icon: ImageIcon },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ activeTab, onTabChange, onLogout, isMobile, isOpen, onClose }: { activeTab: string; onTabChange: (t: string) => void; onLogout: () => void; isMobile?: boolean; isOpen?: boolean; onClose?: () => void; }) {
  return (
    <>
      {isMobile && isOpen && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      )}
      <aside style={{ 
        width: 240, background: C.sidebar, display: "flex", flexDirection: "column", flexShrink: 0, borderRight: C.sidebarBorder,
        position: isMobile ? "fixed" : "relative",
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
        transform: isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform 0.3s ease"
      }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoPng} alt="Saha" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", background: "white", padding: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.gold, letterSpacing: "0.04em" }}>SAHA MARBLE</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: active ? C.gold : "transparent",
                color: active ? "#0f172a" : "rgba(255,255,255,0.55)",
                fontSize: 13,
                fontWeight: active ? 800 : 500,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s",
                letterSpacing: active ? "0.01em" : undefined,
              }}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>System Admin</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>admin@sahamarble.com</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.1)", color: "#f87171", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("dashboard");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // All data lives here — each tab receives its slice + a reload callback
  const [stats, setStats] = React.useState<any>({ products: 0, categories: 0, customers: 0, visitors: 0, recentOrders: [] });
  const [banners, setBanners] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [settings, setSettings] = React.useState<Record<string, string>>({ whatsapp_number: "919330833711" });

  // Auth check on mount
  React.useEffect(() => {
    const auth = sessionStorage.getItem("saha_admin_auth");
    if (auth === "true") {
      setIsLoggedIn(true);
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [s, b, cats, prods, custs, sett] = await Promise.all([
        getDashboardStatsFn(),
        getBannersFn(),
        getCategoriesFn(),
        getProductsFn(),
        getCustomersFn(),
        getSettingsFn(),
      ]);
      setStats(s || { products: 0, categories: 0, customers: 0, visitors: 0, recentOrders: [] });
      setBanners(b || []);
      setCategories(cats || []);
      setProducts(prods || []);
      setCustomers(custs || []);
      if (sett) setSettings(sett);
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error("Failed to load data. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  // Called by each tab after a CRUD op — reloads data AND invalidates frontend routes
  const handleReload = async () => {
    await loadAllData();
    await router.invalidate();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("saha_admin_auth");
    setIsLoggedIn(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAllData();
    setIsRefreshing(false);
    toast.success("Data refreshed!");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => { setIsLoggedIn(true); loadAllData(); }} />;
  }

  const tabTitles: Record<string, string> = {
    dashboard: "Dashboard",
    media: "Media Manager",
    categories: "Category Manager",
    products: "Product Catalog",
    customers: "Customer Orders",
    settings: "Store Settings",
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", background: C.bg }}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(t) => { setActiveTab(t); setMobileMenuOpen(false); }} 
        onLogout={handleLogout} 
        isMobile={isMobile}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ height: 60, background: "white", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
                <Menu size={22} color={C.text} />
              </button>
            )}
            <h1 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0 }}>{tabTitles[activeTab]}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{ ...btnOutline, padding: "7px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
              title="Refresh all data from database"
            >
              <RefreshCw size={13} style={isRefreshing ? { animation: "spin 1s linear infinite" } : undefined} />
              Refresh
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{ ...btnOutline, padding: "7px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, color: C.muted }}
            >
              <Globe size={13} /> Storefront ↗
            </a>
          </div>
        </header>

        {/* Content area */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14 }}>
              <Loader2 size={36} color={C.gold} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Loading data...</span>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardTab stats={stats} />}
              {activeTab === "media" && <MediaTab banners={banners} onReload={handleReload} />}
              {activeTab === "categories" && <CategoriesTab categories={categories} onReload={handleReload} />}
              {activeTab === "products" && <ProductsTab products={products} categories={categories} onReload={handleReload} />}
              {activeTab === "customers" && <CustomersTab customers={customers} />}
              {activeTab === "settings" && <SettingsTab settings={settings} onReload={handleReload} />}
            </>
          )}
        </main>
      </div>

      {/* CSS keyframes injection */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus {
          border-color: #d4a017 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(212,160,23,0.12);
        }
        button:disabled { opacity: 0.6; cursor: not-allowed !important; }
      `}</style>
    </div>
  );
}
