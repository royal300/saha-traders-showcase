import { createServerFn } from "@tanstack/react-start";
import pool from "./db";

// ==========================================
// 1. Unique IP Visitor Tracking
// ==========================================
export const trackVisitorFn = createServerFn({ method: "POST" })
  .handler(async ({ request }) => {
    // Extract client IP address from proxy headers passed by Nginx
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim()
      || request.headers.get("x-real-ip")
      || "127.0.0.1";

    try {
      // Check if this IP has visited within the last 24 hours
      const [rows]: any = await pool.query(
        "SELECT id FROM visitors WHERE ip_address = ? AND visited_at > NOW() - INTERVAL 1 DAY",
        [ip]
      );
      if (rows.length === 0) {
        await pool.query("INSERT INTO visitors (ip_address) VALUES (?)", [ip]);
      }
      return { success: true, ip };
    } catch (e) {
      console.error("Error logging visitor IP:", e);
      return { success: false };
    }
  });

// ==========================================
// 2. Dashboard Analytics & Stats
// ==========================================
export const getDashboardStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [products]: any = await pool.query("SELECT COUNT(*) as count FROM products");
      const [categories]: any = await pool.query("SELECT COUNT(*) as count FROM categories");
      const [customers]: any = await pool.query("SELECT COUNT(*) as count FROM customers");
      const [visitors]: any = await pool.query("SELECT COUNT(DISTINCT ip_address) as count FROM visitors");
      const [recentOrders]: any = await pool.query("SELECT * FROM customers ORDER BY id DESC LIMIT 5");

      return {
        products: products[0].count,
        categories: categories[0].count,
        customers: customers[0].count,
        visitors: visitors[0].count,
        recentOrders: recentOrders || [],
      };
    } catch (e) {
      console.error("Dashboard stats error:", e);
      return { products: 0, categories: 0, customers: 0, visitors: 0, recentOrders: [] };
    }
  });

// ==========================================
// 3. Media Slider CRUD
// ==========================================
export const getBannersFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM media ORDER BY display_order ASC, id DESC");
      return rows as any[];
    } catch (e) {
      console.error("Fetch banners error:", e);
      return [];
    }
  });

export const saveBannerFn = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, image, heading, sub, label, slug, display_order } = data;
    try {
      if (id) {
        await pool.query(
          "UPDATE media SET image = ?, heading = ?, sub = ?, label = ?, slug = ?, display_order = ? WHERE id = ?",
          [image, heading || null, sub || null, label || null, slug || null, display_order || 0, id]
        );
        return { success: true, id };
      } else {
        const [result]: any = await pool.query(
          "INSERT INTO media (image, heading, sub, label, slug, display_order) VALUES (?, ?, ?, ?, ?, ?)",
          [image, heading || null, sub || null, label || null, slug || null, display_order || 0]
        );
        return { success: true, id: result.insertId };
      }
    } catch (e: any) {
      console.error("Save banner error:", e);
      return { success: false, error: e.message };
    }
  });

export const deleteBannerFn = createServerFn({ method: "POST" })
  .handler(async ({ id }: { id: number }) => {
    try {
      await pool.query("DELETE FROM media WHERE id = ?", [id]);
      return { success: true };
    } catch (e: any) {
      console.error("Delete banner error:", e);
      return { success: false, error: e.message };
    }
  });

// ==========================================
// 4. Categories CRUD
// ==========================================
export const getCategoriesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM categories ORDER BY id ASC");
      return rows as any[];
    } catch (e) {
      console.error("Fetch categories error:", e);
      return [];
    }
  });

export const saveCategoryFn = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, name, slug, image, banner, blurb, is_featured } = data;
    try {
      if (id) {
        await pool.query(
          "UPDATE categories SET name = ?, slug = ?, image = ?, banner = ?, blurb = ?, is_featured = ? WHERE id = ?",
          [name, slug, image, banner || null, blurb || null, is_featured ? 1 : 0, id]
        );
        return { success: true, id };
      } else {
        const [result]: any = await pool.query(
          "INSERT INTO categories (name, slug, image, banner, blurb, is_featured) VALUES (?, ?, ?, ?, ?, ?)",
          [name, slug, image, banner || null, blurb || null, is_featured ? 1 : 0]
        );
        return { success: true, id: result.insertId };
      }
    } catch (e: any) {
      console.error("Save category error:", e);
      return { success: false, error: e.message };
    }
  });

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .handler(async ({ id }: { id: number }) => {
    try {
      await pool.query("DELETE FROM categories WHERE id = ?", [id]);
      return { success: true };
    } catch (e: any) {
      console.error("Delete category error:", e);
      return { success: false, error: e.message };
    }
  });

// ==========================================
// 5. Products CRUD
// ==========================================
export const getProductsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
      return rows as any[];
    } catch (e) {
      console.error("Fetch products error:", e);
      return [];
    }
  });

export const saveProductFn = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const {
      id, // Can be custom/optional ProductId or slug
      slug,
      name,
      category_slug,
      price,
      old_price,
      image,
      gallery,
      description,
      details,
      specs,
      shipping_info,
      return_policy,
      isEdit
    } = data;

    try {
      const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : gallery || "[]";
      const detailsStr = Array.isArray(details) ? JSON.stringify(details) : details || "[]";
      const specsStr = Array.isArray(specs) ? JSON.stringify(specs) : specs || "[]";

      if (isEdit) {
        await pool.query(
          `UPDATE products 
           SET slug = ?, name = ?, category_slug = ?, price = ?, old_price = ?, image = ?, 
               gallery = ?, description = ?, details = ?, specs = ?, shipping_info = ?, return_policy = ? 
           WHERE id = ?`,
          [
            slug, name, category_slug, price, old_price || null, image, 
            galleryStr, description || null, detailsStr, specsStr, 
            shipping_info || null, return_policy || null, id
          ]
        );
        return { success: true, id };
      } else {
        // Use custom Product ID if written, or fallback to slug
        const finalId = id?.trim() || slug;
        await pool.query(
          `INSERT INTO products 
           (id, slug, name, category_slug, price, old_price, image, gallery, description, details, specs, shipping_info, return_policy) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            finalId, slug, name, category_slug, price, old_price || null, image, 
            galleryStr, description || null, detailsStr, specsStr, 
            shipping_info || null, return_policy || null
          ]
        );
        return { success: true, id: finalId };
      }
    } catch (e: any) {
      console.error("Save product error:", e);
      return { success: false, error: e.message };
    }
  });

export const deleteProductFn = createServerFn({ method: "POST" })
  .handler(async ({ id }: { id: string }) => {
    try {
      await pool.query("DELETE FROM products WHERE id = ?", [id]);
      return { success: true };
    } catch (e: any) {
      console.error("Delete product error:", e);
      return { success: false, error: e.message };
    }
  });

// ==========================================
// 6. Customers & Orders (CSV download log)
// ==========================================
export const getCustomersFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM customers ORDER BY id DESC");
      return rows as any[];
    } catch (e) {
      console.error("Fetch customers error:", e);
      return [];
    }
  });

export const saveCustomerOrderFn = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { name: string; mobile: string; address: string; items: any[]; total: number } }) => {
    const { name, mobile, address, items, total } = data;
    try {
      const [result]: any = await pool.query(
        "INSERT INTO customers (name, mobile, address, items, total_price) VALUES (?, ?, ?, ?, ?)",
        [name, mobile, address, JSON.stringify(items), total]
      );
      return { success: true, id: result.insertId };
    } catch (e: any) {
      console.error("Save customer order error:", e);
      return { success: false, error: e.message };
    }
  });

// ==========================================
// 7. Global Settings & WhatsApp Routing
// ==========================================
export const getSettingsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [rows]: any = await pool.query("SELECT * FROM settings");
      const config: Record<string, string> = {};
      rows.forEach((row: any) => {
        config[row.setting_key] = row.setting_value;
      });
      return config;
    } catch (e) {
      console.error("Fetch settings error:", e);
      return {};
    }
  });

export const updateSettingFn = createServerFn({ method: "POST" })
  .handler(async ({ key, value }: { key: string; value: string }) => {
    try {
      await pool.query(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [key, value]
      );
      return { success: true };
    } catch (e: any) {
      console.error("Update setting error:", e);
      return { success: false, error: e.message };
    }
  });

// ==========================================
// 8. Image File Uploader
// ==========================================
export const uploadImageFn = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { fileName: string; base64Data: string } }) => {
    const { fileName, base64Data } = data;
    try {
      const fs = await import("fs");
      const path = await import("path");

      const buffer = Buffer.from(base64Data, "base64");

      // Clean the filename of special characters
      const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueName = `${Date.now()}_${cleanName}`;

      const publicDir = path.join(process.cwd(), "public");
      const uploadsDir = path.join(publicDir, "uploads");

      // Ensure that public and public/uploads directories exist on disk
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      // Return the public relative path served dynamically by Vite/Vinxi
      return { success: true, url: `/uploads/${uniqueName}` };
    } catch (e: any) {
      console.error("Error uploading image:", e);
      return { success: false, error: e.message };
    }
  });

