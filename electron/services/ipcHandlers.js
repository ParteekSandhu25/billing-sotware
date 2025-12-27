// const { ipcMain, BrowserWindow, dialog } = require("electron");
// const dbPromise = require("../db/sqlite");
// const bcrypt = require("bcryptjs");
// const fs = require("fs");
// const { generateInvoiceHTML } = require("../utils/printBillView")

// // -------------------- RABC --------------------
// ipcMain.handle("getUserByUsername", async (_, username) => {
//   const db = await dbPromise;
//   return db.get("SELECT * FROM users WHERE username = ?", [username]);
// });

// // ipcMain.handle("updateUserPassword", async (_, userId, newPassword) => {
// //   const db = await dbPromise;
// //   await db.run("UPDATE users SET password=? WHERE id=?", [newPassword, userId]);
// //   return true;
// // });

// ipcMain.handle(
//   "update-owner-password",
//   async (event, { oldPassword, newPassword }) => {
//     const db = await dbPromise;

//     const owner = await db.get(
//       `SELECT * FROM users WHERE role = 'owner'`
//     );

//     if (!owner) {
//       return { error: "Owner account not found" };
//     }

//     const match = await bcrypt.compare(
//       oldPassword,
//       owner.password
//     );

//     if (!match) {
//       return { error: "Incorrect current password" };
//     }

//     const hashed = await bcrypt.hash(newPassword, 10);

//     await db.run(
//       `UPDATE users SET password = ? WHERE role = 'owner'`,
//       [hashed]
//     );

//     return { success: true };
//   }
// );

// /* ---------------- STAFF PASSWORD ---------------- */

// ipcMain.handle(
//   "update-staff-password",
//   async (event, { oldPassword, newPassword }) => {
//     const db = await dbPromise;

//     const staff = await db.get(
//       `SELECT * FROM users WHERE role = 'staff'`
//     );

//     if (!staff) {
//       return { error: "Staff account not found" };
//     }

//     const match = await bcrypt.compare(
//       oldPassword,
//       staff.password
//     );

//     if (!match) {
//       return { error: "Incorrect current password" };
//     }

//     const hashed = await bcrypt.hash(newPassword, 10);

//     await db.run(
//       `UPDATE users SET password = ? WHERE role = 'staff'`,
//       [hashed]
//     );

//     return { success: true };
//   }
// );
// ipcMain.handle("login-user", async (event,  username, password ) => {
//   const db = await dbPromise;

//   // 1️⃣ Fetch user (pure sqlite, no async inside)
//   console.log("username: ", username);
//   console.log("password", password);
//   const user = await db.get(
//       "SELECT * FROM users WHERE username = ?",
//       [username],
//       (err, row) => {
//         if (err) return reject(err);
//         resolve(row);
//       }
//     );

//   // 2️⃣ User not found
//   if (!user) {
//     return { error: "User not found" };
//   }
//   console.log("USER: ", user);


// const plain = "parteek";
// const hash = "$2b$10$QWxrlAQt1ymOC9zEJISxv.TV7ivh6IPnO5cyiYGYYlDxoP8B3ssOe";

// console.log("test: ",await bcrypt.compare(plain, hash));

//   // 3️⃣ Compare password (safe async)
//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return { error: "Invalid password" };
//   }

//   // 4️⃣ Success
//   return {
//     id: user.id,
//     username: user.username,
//     role: user.role,
//   };
// });

// ipcMain.handle("getAllUsers", async () => {
//   const db = await dbPromise;
//   return db.all("SELECT id, username, role, created_at FROM users");
// });

// // -------------------- Customers --------------------
// ipcMain.handle("getAllCustomers", async () => {
//   const db = await dbPromise;
//   return db.all("SELECT * FROM customers ORDER BY id DESC");
// });

// ipcMain.handle("getCustomerById", async (_, customerId) => {
//   const db = await dbPromise;

//   return db.get(
//     `SELECT * FROM customers WHERE id = ?`,
//     [customerId]
//   );
// });

// ipcMain.handle("createCustomer", async (_, customer) => {
//   const db = await dbPromise;

//   const { name, mobile, address, email, gst_number } = customer;

//   // 1️⃣ Insert customer
//   const result = await db.run(
//     `INSERT INTO customers (name, mobile, address, email, gst_number)
//      VALUES (?, ?, ?, ?, ?)`,
//     [name, mobile, address || "", email || "", gst_number || ""]
//   );

//   // 2️⃣ Fetch newly created customer using lastID
//   const createdCustomer = await db.get(
//     `SELECT * FROM customers WHERE id = ?`,
//     [result.lastID]
//   );

//   // 3️⃣ Return full customer object
//   return createdCustomer;
// });

// ipcMain.handle("updateCustomer", async (_, id, customer) => {
//   const db = await dbPromise;
//   const { name, mobile, address, email, gst_number } = customer;
//   await db.run(
//     `UPDATE customers SET name=?, mobile=?, address=?, email=?, gst_number=? WHERE id=?`,
//     [name, mobile, address, email, gst_number, id]
//   );
//   return true;
// });

// ipcMain.handle("deleteCustomer", async (_, id) => {
//   const db = await dbPromise;
//   await db.run(`DELETE FROM customers WHERE id=?`, [id]);
//   return true;
// });

// ipcMain.handle("getCustomerByMobile", async (event, mobile) => {
//   const db = await dbPromise;
//   const customer = await db.get("SELECT * FROM customers WHERE mobile = ?", mobile);
//   return customer || null;
// });

// ipcMain.handle("getCustomerPurchaseHistory", async (_, customerId) => {
//   const db = await dbPromise;

//   const rows = await db.all(`
//     SELECT 
//       b.id AS bill_id,
//       b.bill_number,
//       b.total_amount,
//       b.created_at,
//       bi.product_name,
//       bi.quantity,
//       bi.price,
//       bi.total
//     FROM bills b
//     JOIN bill_items bi ON b.id = bi.bill_id
//     WHERE b.customer_id = ?
//     ORDER BY b.created_at DESC
//   `, [customerId]);

//   return rows;
// });


// // -------------------- Products --------------------
// ipcMain.handle("getAllProducts", async () => {
//   const db = await dbPromise;
//   return db.all("SELECT * FROM products ORDER BY id DESC");
// });


// // Fetch product by QR code
// ipcMain.handle("getProductById", async (event, id) => {
//   const db = await dbPromise;
//   const product = await db.get("SELECT * FROM products WHERE id = ?", id);
//   return product || null;
// });

// ipcMain.handle("getProductByQR", async (event, qr) => {
//   const db = await dbPromise;
//   const product = await db.get("SELECT * FROM products WHERE qr_code = ?", qr);
//   return product || null;
// });

// ipcMain.handle("createProduct", async (_, product) => {
//   const db = await dbPromise;
//   const { name, qr_code, sku, price, gst_percent, quantity } = product;
//   const stmt = await db.run(
//     `INSERT INTO products (name, qr_code, sku, price, gst_percent, quantity)
//      VALUES (?, ?, ?, ?, ?, ?)`,
//     [name, qr_code || "", sku || "", price, gst_percent || 0, quantity || 0]
//   );

//   // Log initial stock
//   if (quantity > 0) {
//     await db.run(
//       `INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)`,
//       [stmt.lastID, quantity, "Initial stock"]
//     );
//   }

//   return stmt.lastID;
// });

// ipcMain.handle("updateProduct", async (_, id, product) => {
//   const db = await dbPromise;
//   const { name, qr_code, sku, price, gst_percent, quantity } = product;

//   // Get previous quantity
//   const prev = await db.get("SELECT quantity FROM products WHERE id=?", [id]);
//   const diff = quantity - prev.quantity;

//   // Update product
//   await db.run(
//     `UPDATE products SET name=?, qr_code=?, sku=?, price=?, gst_percent=?, quantity=? WHERE id=?`,
//     [name, qr_code, sku, price, gst_percent, quantity, id]
//   );

//   // Log stock change if quantity changed
//   if (diff !== 0) {
//     await db.run(
//       `INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)`,
//       [id, diff, "Stock update"]
//     );
//   }

//   return true;
// });

// ipcMain.handle("deleteProduct", async (_, id) => {
//   const db = await dbPromise;
//   await db.run(`DELETE FROM products WHERE id=?`, [id]);
//   return true;
// });

// // -------------------- Bills --------------------
// ipcMain.handle("getAllBills", async () => {
//   try {
//     const db = await dbPromise;
//     const bills = await db.all(`
//       SELECT 
//         b.id as bill_id,
//         b.bill_number,
//         b.customer_id,
//         b.sub_total,
//         b.gst_amount,
//         b.cash_discount,
//         b.total_amount,
//         b.payment_mode,
//         b.created_at,
//         c.name as customer_name,
//         c.mobile as customer_mobile,
//         c.email as customer_email,
//         c.address as customer_address,
//         c.gst_number as customer_gst_number,
//         c.created_at as customer_created_at
//       FROM bills b
//       LEFT JOIN customers c ON b.customer_id = c.id
//       ORDER BY b.created_at DESC
//     `);
    
//     return bills;
//   } catch (error) {
//     console.error("Error fetching all bills:", error);
//     return [];
//   }
// });


// ipcMain.handle("createBill", async (_, bill) => {
//   const db = await dbPromise;
//   const { 
//     bill_number, 
//     customer_id, 
//     items, 
//     sub_total, 
//     gst_amount, 
//     cash_discount,
//     total_amount,
//     payment_mode
//   } = bill;

//   // Insert bill with new fields
//   const result = await db.run(
//     `INSERT INTO bills (
//       bill_number, 
//       customer_id, 
//       sub_total, 
//       gst_amount, 
//       cash_discount,
//       total_amount,
//       payment_mode
//     ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     [
//       bill_number, 
//       customer_id, 
//       sub_total, 
//       gst_amount, 
//       cash_discount || 0,
//       total_amount,
//       payment_mode || 'CASH'
//     ]
//   );

//   const bill_id = result.lastID;

//   // Insert bill items
//   for (const item of items) {
//     await db.run(
//       `INSERT INTO bill_items (bill_id, product_id, product_name, quantity, price, gst_percent, total)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         bill_id,
//         item.product_id,
//         item.product_name,
//         item.quantity,
//         item.price,
//         item.gst_percent,
//         item.total
//       ]
//     );

//     // Reduce stock
//     await db.run(
//       `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
//       [item.quantity, item.product_id]
//     );

//     // Add stock log
//     await db.run(
//       `INSERT INTO stock_logs (product_id, change, reason)
//        VALUES (?, ?, ?)`,
//       [item.product_id, -item.quantity, `Sold in bill ${bill_number}`]
//     );
//   }

//   // Fetch customer info
//   const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [customer_id]);

//   return { 
//     id: bill_id, 
//     bill_number, 
//     customer, 
//     items, 
//     sub_total, 
//     gst_amount,
//     cash_discount: cash_discount || 0,
//     total_amount,
//     payment_mode: payment_mode || 'CASH'
//   };
// });

// ipcMain.handle("printBill", async (_, bill) => {
//   const { bill_number, customer, items, totals } = bill;

//   if (!items || !Array.isArray(items)) {
//     throw new Error("Bill items missing or invalid");
//   }

//   // Default company information
//   const companyInfo = {
//     name: "G Hari Dewasi Safa House",
//     address: "Shop Address, City, State - PIN Code",
//     mobile: "+91 XXXXX XXXXX",
//     email: "info@safahouse.com",
//     gstin: "GSTIN NUMBER",
//     pan: "PAN NUMBER"
//   };

//   // Transform bill data to match invoice template format with new fields
//   const billData = {
//     bill_number: bill_number,
//     created_at: bill.created_at || new Date().toISOString(),
//     customer: {
//       name: customer.name || "Walk-in Customer",
//       mobile: customer.mobile || "",
//       address: customer.address || "",
//       gstin: customer.gstin || ""
//     },
//     items: items.map(item => ({
//       product_name: item.product_name,
//       hsn_code: item.hsn_code || "",
//       quantity: item.quantity,
//       rate: item.price,
//       discount: item.discount || 0,
//       gst_rate: item.gst_percent || 0,
//       total: item.total
//     })),
//     sub_total: totals.sub_total,
//     gst_amount: totals.gst_amount,
//     cash_discount: totals.cash_discount || 0, // New field
//     total_amount: totals.total_amount,
//     payment_status: bill.payment_status || "Paid",
//     payment_mode: totals.payment_mode || "CASH" // New field
//   };

//   // Generate professional invoice HTML using the template
//   const html = generateInvoiceHTML(billData, companyInfo);

//   const printWindow = new BrowserWindow({
//     width: 900,
//     height: 650,
//     show: true, // ✅ MUST be true on Wayland    
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   });

//   printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

//   printWindow.webContents.on("did-finish-load", () => {
//     printWindow.webContents.print({}, (success) => {
//       if (success) console.log("✅ Bill printed");
//       printWindow.close();
//     });
//   });

//   return true;
// });

// // -------------------- Dashboard --------------------
// ipcMain.handle("getDashboardStats", async () => {
//   const db = await dbPromise;
//   const totalProducts = await db.get("SELECT COUNT(*) as count FROM products");
//   const totalCustomers = await db.get("SELECT COUNT(*) as count FROM customers");
//   const totalBills = await db.get("SELECT COUNT(*) as count FROM bills");
//   const totalRevenue = await db.get("SELECT SUM(total_amount) as total FROM bills");

//   return {
//     totalProducts: totalProducts.count || 0,
//     totalCustomers: totalCustomers.count || 0,
//     totalBills: totalBills.count || 0,
//     totalRevenue: totalRevenue.total || 0
//   };
// });

// // -------------------- Bill Items (optional detailed fetch) --------------------
// ipcMain.handle("getBillItems", async (event, billId) => {
//   try {
//     const db = await dbPromise;
//     const items = await db.all(`
//       SELECT 
//         product_id,
//         product_name,
//         quantity,
//         price,
//         gst_percent,
//         total
//       FROM bill_items
//       WHERE bill_id = ?
//       ORDER BY id
//     `, [billId]);
    
//     return items;
//   } catch (error) {
//     console.error("Error fetching bill items:", error);
//     return [];
//   }
// });

// // -------------------- SalesReport (optional detailed fetch) --------------------

// ipcMain.handle("get-daily-sales", async () => {
//   const db = await dbPromise;

//   return db.get(`
//     SELECT 
//       DATE(created_at) as date,
//       COUNT(*) as total_bills,
//       SUM(total_amount) as total_sales
//     FROM bills
//     WHERE DATE(created_at) = DATE('now')
//   `);
// });

// ipcMain.handle("get-total-sales", async () => {
//   const db = await dbPromise;

//   return db.get(`
//     SELECT 
//       COUNT(*) as total_bills,
//       SUM(total_amount) as total_sales
//     FROM bills
//   `);
// });

// // Daily Report
// ipcMain.handle("export-daily-report", async () => {
//   const db = await dbPromise;
//   const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

//   const rows = await db.all(
//     `SELECT b.bill_number, b.total_amount, b.created_at, c.name AS customer_name, 
//             GROUP_CONCAT(bi.product_name, "; ") AS products
//      FROM bills b
//      LEFT JOIN customers c ON b.customer_id = c.id
//      LEFT JOIN bill_items bi ON bi.bill_id = b.id
//      WHERE DATE(b.created_at) = ?
//      GROUP BY b.id`,
//     [today]
//   );

//   if (!rows.length) return { error: "No sales for today" };

//   const csvContent = [
//     ["Bill Number", "Customer Name", "Products", "Total Amount", "Created At"],
//     ...rows.map((r) => [r.bill_number, r.customer_name, r.products, r.total_amount, r.created_at])
//   ]
//     .map((e) => e.join(","))
//     .join("\n");

//   const { filePath } = await dialog.showSaveDialog({
//     title: "Save Daily Report",
//     defaultPath: `daily-report-${today}.csv`,
//     filters: [{ name: "CSV", extensions: ["csv"] }],
//   });

//   if (!filePath) return { error: "Save cancelled" };

//   fs.writeFileSync(filePath, csvContent);
//   return { success: true, path: filePath };
// });

// // Total Report
// ipcMain.handle("export-total-report", async () => {
//   const db = await dbPromise;

//   const rows = await db.all(
//     `SELECT b.bill_number, b.total_amount, b.created_at, c.name AS customer_name,
//             GROUP_CONCAT(bi.product_name, "; ") AS products
//      FROM bills b
//      LEFT JOIN customers c ON b.customer_id = c.id
//      LEFT JOIN bill_items bi ON bi.bill_id = b.id
//      GROUP BY b.id`
//   );

//   if (!rows.length) return { error: "No sales yet" };

//   const csvContent = [
//     ["Bill Number", "Customer Name", "Products", "Total Amount", "Created At"],
//     ...rows.map((r) => [r.bill_number, r.customer_name, r.products, r.total_amount, r.created_at])
//   ]
//     .map((e) => e.join(","))
//     .join("\n");

//   const { filePath } = await dialog.showSaveDialog({
//     title: "Save Total Report",
//     defaultPath: `total-report.csv`,
//     filters: [{ name: "CSV", extensions: ["csv"] }],
//   });

//   if (!filePath) return { error: "Save cancelled" };

//   fs.writeFileSync(filePath, csvContent);
//   return { success: true, path: filePath };
// });



// *******************************************************************************************8

const { ipcMain, BrowserWindow, dialog } = require("electron");
const dbPromise = require("../db/sqlite");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { generateInvoiceHTML } = require("../utils/printBillView");

// -------------------- HELPER FUNCTIONS --------------------

/**
 * Build WHERE clause for filtering
 * @param {Object} filters - Filter object with field-value pairs
 * @returns {Object} - { whereClause, params }
 */
function buildWhereClause(filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return { whereClause: "", params: [] };
  }

  const conditions = [];
  const params = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined && value !== "") {
      // Handle different filter types
      if (typeof value === "string" && value.includes("%")) {
        // LIKE search
        conditions.push(`${key} LIKE ?`);
        params.push(value);
      } else if (typeof value === "object" && value.min !== undefined && value.max !== undefined) {
        // Range filter (e.g., price, date)
        conditions.push(`${key} BETWEEN ? AND ?`);
        params.push(value.min, value.max);
      } else {
        // Exact match
        conditions.push(`${key} = ?`);
        params.push(value);
      }
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereClause, params };
}

/**
 * Build ORDER BY clause for sorting
 * @param {string} sortBy - Column to sort by
 * @param {string} sortOrder - 'ASC' or 'DESC'
 * @returns {string} - ORDER BY clause
 */
function buildOrderByClause(sortBy, sortOrder = "DESC") {
  if (!sortBy) return "";
  const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
  return `ORDER BY ${sortBy} ${order}`;
}

/**
 * Build LIMIT and OFFSET for pagination
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} - { limitClause, offset }
 */
function buildPaginationClause(page, limit) {
  if (!page || !limit) return { limitClause: "", offset: 0 };
  
  const offset = (page - 1) * limit;
  return { limitClause: `LIMIT ? OFFSET ?`, offset };
}

// -------------------- RABC --------------------
ipcMain.handle("getUserByUsername", async (_, username) => {
  const db = await dbPromise;
  return db.get("SELECT * FROM users WHERE username = ?", [username]);
});

ipcMain.handle(
  "update-owner-password",
  async (event, { oldPassword, newPassword }) => {
    const db = await dbPromise;

    const owner = await db.get(
      `SELECT * FROM users WHERE role = 'owner'`
    );

    if (!owner) {
      return { error: "Owner account not found" };
    }

    const match = await bcrypt.compare(oldPassword, owner.password);

    if (!match) {
      return { error: "Incorrect current password" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.run(
      `UPDATE users SET password = ? WHERE role = 'owner'`,
      [hashed]
    );

    return { success: true };
  }
);

ipcMain.handle(
  "update-staff-password",
  async (event, { oldPassword, newPassword }) => {
    const db = await dbPromise;

    const staff = await db.get(
      `SELECT * FROM users WHERE role = 'staff'`
    );

    if (!staff) {
      return { error: "Staff account not found" };
    }

    const match = await bcrypt.compare(oldPassword, staff.password);

    if (!match) {
      return { error: "Incorrect current password" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.run(
      `UPDATE users SET password = ? WHERE role = 'staff'`,
      [hashed]
    );

    return { success: true };
  }
);

ipcMain.handle("login-user", async (event, username, password) => {
  const db = await dbPromise;

  const user = await db.get(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (!user) {
    return { error: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { error: "Invalid password" };
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
});

// Enhanced with pagination, sorting, filtering
ipcMain.handle("getAllUsers", async (_, options = {}) => {
  const db = await dbPromise;
  const { page, limit, sortBy = "id", sortOrder = "DESC", filters } = options;

  // Build query parts
  const { whereClause, params } = buildWhereClause(filters);
  const orderByClause = buildOrderByClause(sortBy, sortOrder);
  const { limitClause, offset } = buildPaginationClause(page, limit);

  // Count total records
  const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
  const { total } = await db.get(countQuery, params);

  // Fetch paginated data
  const dataQuery = `
    SELECT id, username, role, created_at 
    FROM users 
    ${whereClause}
    ${orderByClause}
    ${limitClause}
  `;
  
  const queryParams = limitClause 
    ? [...params, limit, offset]
    : params;

  const data = await db.all(dataQuery, queryParams);

  return {
    data,
    total,
    page: page || 1,
    limit: limit || total,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
});

// -------------------- Customers --------------------

// Enhanced with pagination, sorting, filtering
ipcMain.handle("getAllCustomers", async (_, options = {}) => {
  const db = await dbPromise;
  const { page, limit, sortBy = "id", sortOrder = "DESC", filters, search } = options;

  // Handle search across multiple fields
  let { whereClause, params } = buildWhereClause(filters);
  
  if (search) {
    const searchCondition = whereClause 
      ? `${whereClause} AND (name LIKE ? OR mobile LIKE ? OR email LIKE ?)`
      : `WHERE (name LIKE ? OR mobile LIKE ? OR email LIKE ?)`;
    whereClause = searchCondition;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const orderByClause = buildOrderByClause(sortBy, sortOrder);
  const { limitClause, offset } = buildPaginationClause(page, limit);

  // Count total records
  const countQuery = `SELECT COUNT(*) as total FROM customers ${whereClause}`;
  const { total } = await db.get(countQuery, params);

  // Fetch paginated data
  const dataQuery = `
    SELECT * FROM customers 
    ${whereClause}
    ${orderByClause}
    ${limitClause}
  `;
  
  const queryParams = limitClause 
    ? [...params, limit, offset]
    : params;

  const data = await db.all(dataQuery, queryParams);

  return {
    data,
    total,
    page: page || 1,
    limit: limit || total,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
});

ipcMain.handle("getCustomerById", async (_, customerId) => {
  const db = await dbPromise;
  return db.get(`SELECT * FROM customers WHERE id = ?`, [customerId]);
});

ipcMain.handle("createCustomer", async (_, customer) => {
  const db = await dbPromise;
  const { name, mobile, address, email, gst_number } = customer;

  const result = await db.run(
    `INSERT INTO customers (name, mobile, address, email, gst_number)
     VALUES (?, ?, ?, ?, ?)`,
    [name, mobile, address || "", email || "", gst_number || ""]
  );

  const createdCustomer = await db.get(
    `SELECT * FROM customers WHERE id = ?`,
    [result.lastID]
  );

  return createdCustomer;
});

ipcMain.handle("updateCustomer", async (_, id, customer) => {
  const db = await dbPromise;
  const { name, mobile, address, email, gst_number } = customer;
  await db.run(
    `UPDATE customers SET name=?, mobile=?, address=?, email=?, gst_number=? WHERE id=?`,
    [name, mobile, address, email, gst_number, id]
  );
  return true;
});

ipcMain.handle("deleteCustomer", async (_, id) => {
  const db = await dbPromise;
  await db.run(`DELETE FROM customers WHERE id=?`, [id]);
  return true;
});

ipcMain.handle("getCustomerByMobile", async (event, mobile) => {
  const db = await dbPromise;
  const customer = await db.get("SELECT * FROM customers WHERE mobile = ?", mobile);
  return customer || null;
});

// Enhanced with pagination
ipcMain.handle("getCustomerPurchaseHistory", async (_, customerId, options = {}) => {
  const db = await dbPromise;
  const { page, limit, sortBy = "b.created_at", sortOrder = "DESC" } = options;

  const orderByClause = buildOrderByClause(sortBy, sortOrder);
  const { limitClause, offset } = buildPaginationClause(page, limit);

  // Count total records
  const countQuery = `
    SELECT COUNT(DISTINCT b.id) as total
    FROM bills b
    WHERE b.customer_id = ?
  `;
  const { total } = await db.get(countQuery, [customerId]);

  // Fetch paginated data
  const dataQuery = `
    SELECT 
      b.id AS bill_id,
      b.bill_number,
      b.total_amount,
      b.created_at,
      bi.product_name,
      bi.quantity,
      bi.price,
      bi.total
    FROM bills b
    JOIN bill_items bi ON b.id = bi.bill_id
    WHERE b.customer_id = ?
    ${orderByClause}
    ${limitClause}
  `;

  const queryParams = limitClause 
    ? [customerId, limit, offset]
    : [customerId];

  const data = await db.all(dataQuery, queryParams);

  return {
    data,
    total,
    page: page || 1,
    limit: limit || total,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
});

// -------------------- Products --------------------

// Enhanced with pagination, sorting, filtering
ipcMain.handle("getAllProducts", async (_, options = {}) => {
  const db = await dbPromise;
  const { page, limit, sortBy = "id", sortOrder = "DESC", filters, search } = options;

  // Handle search across multiple fields
  let { whereClause, params } = buildWhereClause(filters);
  
  if (search) {
    const searchCondition = whereClause 
      ? `${whereClause} AND (name LIKE ? OR qr_code LIKE ? OR sku LIKE ?)`
      : `WHERE (name LIKE ? OR qr_code LIKE ? OR sku LIKE ?)`;
    whereClause = searchCondition;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const orderByClause = buildOrderByClause(sortBy, sortOrder);
  const { limitClause, offset } = buildPaginationClause(page, limit);

  // Count total records
  const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
  const { total } = await db.get(countQuery, params);

  // Fetch paginated data
  const dataQuery = `
    SELECT * FROM products 
    ${whereClause}
    ${orderByClause}
    ${limitClause}
  `;
  
  const queryParams = limitClause 
    ? [...params, limit, offset]
    : params;

  const data = await db.all(dataQuery, queryParams);

  return {
    data,
    total,
    page: page || 1,
    limit: limit || total,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
});

ipcMain.handle("getProductById", async (event, id) => {
  const db = await dbPromise;
  const product = await db.get("SELECT * FROM products WHERE id = ?", id);
  return product || null;
});

ipcMain.handle("getProductByQR", async (event, qr) => {
  const db = await dbPromise;
  const product = await db.get("SELECT * FROM products WHERE qr_code = ?", qr);
  return product || null;
});

ipcMain.handle("createProduct", async (_, product) => {
  const db = await dbPromise;
  const { name, qr_code, sku, price, gst_percent, quantity } = product;
  const stmt = await db.run(
    `INSERT INTO products (name, qr_code, sku, price, gst_percent, quantity)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, qr_code || "", sku || "", price, gst_percent || 0, quantity || 0]
  );

  if (quantity > 0) {
    await db.run(
      `INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)`,
      [stmt.lastID, quantity, "Initial stock"]
    );
  }

  return stmt.lastID;
});

ipcMain.handle("updateProduct", async (_, id, product) => {
  const db = await dbPromise;
  const { name, qr_code, sku, price, gst_percent, quantity } = product;

  const prev = await db.get("SELECT quantity FROM products WHERE id=?", [id]);
  const diff = quantity - prev.quantity;

  await db.run(
    `UPDATE products SET name=?, qr_code=?, sku=?, price=?, gst_percent=?, quantity=? WHERE id=?`,
    [name, qr_code, sku, price, gst_percent, quantity, id]
  );

  if (diff !== 0) {
    await db.run(
      `INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)`,
      [id, diff, "Stock update"]
    );
  }

  return true;
});

ipcMain.handle("deleteProduct", async (_, id) => {
  const db = await dbPromise;
  await db.run(`DELETE FROM products WHERE id=?`, [id]);
  return true;
});

// -------------------- Bills --------------------

// Enhanced with pagination, sorting, filtering
ipcMain.handle("getAllBills", async (_, options = {}) => {
  try {
    const db = await dbPromise;
    const { page, limit, sortBy = "b.created_at", sortOrder = "DESC", filters, search, dateRange } = options;

    // Build WHERE clause
    let { whereClause, params } = buildWhereClause(filters);

    // Add search functionality
    if (search) {
      const searchCondition = whereClause 
        ? `${whereClause} AND (b.bill_number LIKE ? OR c.name LIKE ? OR c.mobile LIKE ?)`
        : `WHERE (b.bill_number LIKE ? OR c.name LIKE ? OR c.mobile LIKE ?)`;
      whereClause = searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Add date range filter
    if (dateRange && dateRange.start && dateRange.end) {
      const dateCondition = whereClause 
        ? `${whereClause} AND DATE(b.created_at) BETWEEN ? AND ?`
        : `WHERE DATE(b.created_at) BETWEEN ? AND ?`;
      whereClause = dateCondition;
      params.push(dateRange.start, dateRange.end);
    }

    const orderByClause = buildOrderByClause(sortBy, sortOrder);
    const { limitClause, offset } = buildPaginationClause(page, limit);

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM bills b
      LEFT JOIN customers c ON b.customer_id = c.id
      ${whereClause}
    `;
    const { total } = await db.get(countQuery, params);

    // Fetch paginated data
    const dataQuery = `
      SELECT 
        b.id as bill_id,
        b.bill_number,
        b.customer_id,
        b.sub_total,
        b.gst_amount,
        b.cash_discount,
        b.total_amount,
        b.payment_mode,
        b.created_at,
        c.name as customer_name,
        c.mobile as customer_mobile,
        c.email as customer_email,
        c.address as customer_address,
        c.gst_number as customer_gst_number,
        c.created_at as customer_created_at
      FROM bills b
      LEFT JOIN customers c ON b.customer_id = c.id
      ${whereClause}
      ${orderByClause}
      ${limitClause}
    `;

    const queryParams = limitClause 
      ? [...params, limit, offset]
      : params;

    const data = await db.all(dataQuery, queryParams);

    return {
      data,
      total,
      page: page || 1,
      limit: limit || total,
      totalPages: limit ? Math.ceil(total / limit) : 1
    };
  } catch (error) {
    console.error("Error fetching all bills:", error);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    };
  }
});

ipcMain.handle("createBill", async (_, bill) => {
  const db = await dbPromise;
  const { 
    bill_number, 
    customer_id, 
    items, 
    sub_total, 
    gst_amount, 
    cash_discount,
    total_amount,
    payment_mode
  } = bill;

  const result = await db.run(
    `INSERT INTO bills (
      bill_number, 
      customer_id, 
      sub_total, 
      gst_amount, 
      cash_discount,
      total_amount,
      payment_mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      bill_number, 
      customer_id, 
      sub_total, 
      gst_amount, 
      cash_discount || 0,
      total_amount,
      payment_mode || 'CASH'
    ]
  );

  const bill_id = result.lastID;

  for (const item of items) {
    await db.run(
      `INSERT INTO bill_items (bill_id, product_id, product_name, quantity, price, gst_percent, total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bill_id,
        item.product_id,
        item.product_name,
        item.quantity,
        item.price,
        item.gst_percent,
        item.total
      ]
    );

    await db.run(
      `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
      [item.quantity, item.product_id]
    );

    await db.run(
      `INSERT INTO stock_logs (product_id, change, reason)
       VALUES (?, ?, ?)`,
      [item.product_id, -item.quantity, `Sold in bill ${bill_number}`]
    );
  }

  const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [customer_id]);

  return { 
    id: bill_id, 
    bill_number, 
    customer, 
    items, 
    sub_total, 
    gst_amount,
    cash_discount: cash_discount || 0,
    total_amount,
    payment_mode: payment_mode || 'CASH'
  };
});

ipcMain.handle("printBill", async (_, bill) => {
  const { bill_number, customer, items, totals } = bill;

  if (!items || !Array.isArray(items)) {
    throw new Error("Bill items missing or invalid");
  }

  const companyInfo = {
    name: "G Hari Dewasi Safa House",
    address: "Shop Address, City, State - PIN Code",
    mobile: "+91 XXXXX XXXXX",
    email: "info@safahouse.com",
    gstin: "GSTIN NUMBER",
    pan: "PAN NUMBER"
  };

  const billData = {
    bill_number: bill_number,
    created_at: bill.created_at || new Date().toISOString(),
    customer: {
      name: customer.name || "Walk-in Customer",
      mobile: customer.mobile || "",
      address: customer.address || "",
      gstin: customer.gstin || ""
    },
    items: items.map(item => ({
      product_name: item.product_name,
      hsn_code: item.hsn_code || "",
      quantity: item.quantity,
      rate: item.price,
      discount: item.discount || 0,
      gst_rate: item.gst_percent || 0,
      total: item.total
    })),
    sub_total: totals.sub_total,
    gst_amount: totals.gst_amount,
    cash_discount: totals.cash_discount || 0,
    total_amount: totals.total_amount,
    payment_status: bill.payment_status || "Paid",
    payment_mode: totals.payment_mode || "CASH"
  };

  const html = generateInvoiceHTML(billData, companyInfo);

  const printWindow = new BrowserWindow({
    width: 900,
    height: 650,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({}, (success) => {
      if (success) console.log("✅ Bill printed");
      printWindow.close();
    });
  });

  return true;
});

// -------------------- Dashboard --------------------
ipcMain.handle("getDashboardStats", async () => {
  const db = await dbPromise;
  const totalProducts = await db.get("SELECT COUNT(*) as count FROM products");
  const totalCustomers = await db.get("SELECT COUNT(*) as count FROM customers");
  const totalBills = await db.get("SELECT COUNT(*) as count FROM bills");
  const totalRevenue = await db.get("SELECT SUM(total_amount) as total FROM bills");

  return {
    totalProducts: totalProducts.count || 0,
    totalCustomers: totalCustomers.count || 0,
    totalBills: totalBills.count || 0,
    totalRevenue: totalRevenue.total || 0
  };
});

// -------------------- Bill Items --------------------
ipcMain.handle("getBillItems", async (event, billId) => {
  try {
    const db = await dbPromise;
    const items = await db.all(`
      SELECT 
        product_id,
        product_name,
        quantity,
        price,
        gst_percent,
        total
      FROM bill_items
      WHERE bill_id = ?
      ORDER BY id
    `, [billId]);
    
    return items;
  } catch (error) {
    console.error("Error fetching bill items:", error);
    return [];
  }
});

// -------------------- Sales Report --------------------
ipcMain.handle("get-daily-sales", async () => {
  const db = await dbPromise;

  return db.get(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_bills,
      SUM(total_amount) as total_sales
    FROM bills
    WHERE DATE(created_at) = DATE('now')
  `);
});

ipcMain.handle("get-total-sales", async () => {
  const db = await dbPromise;

  return db.get(`
    SELECT 
      COUNT(*) as total_bills,
      SUM(total_amount) as total_sales
    FROM bills
  `);
});

ipcMain.handle("export-daily-report", async () => {
  const db = await dbPromise;
  const today = new Date().toISOString().split("T")[0];

  const rows = await db.all(
    `SELECT b.bill_number, b.total_amount, b.created_at, c.name AS customer_name, 
            GROUP_CONCAT(bi.product_name, "; ") AS products
     FROM bills b
     LEFT JOIN customers c ON b.customer_id = c.id
     LEFT JOIN bill_items bi ON bi.bill_id = b.id
     WHERE DATE(b.created_at) = ?
     GROUP BY b.id`,
    [today]
  );

  if (!rows.length) return { error: "No sales for today" };

  const csvContent = [
    ["Bill Number", "Customer Name", "Products", "Total Amount", "Created At"],
    ...rows.map((r) => [r.bill_number, r.customer_name, r.products, r.total_amount, r.created_at])
  ]
    .map((e) => e.join(","))
    .join("\n");

  const { filePath } = await dialog.showSaveDialog({
    title: "Save Daily Report",
    defaultPath: `daily-report-${today}.csv`,
    filters: [{ name: "CSV", extensions: ["csv"] }],
  });

  if (!filePath) return { error: "Save cancelled" };

  fs.writeFileSync(filePath, csvContent);
  return { success: true, path: filePath };
});

ipcMain.handle("export-total-report", async () => {
  const db = await dbPromise;

  const rows = await db.all(
    `SELECT b.bill_number, b.total_amount, b.created_at, c.name AS customer_name,
            GROUP_CONCAT(bi.product_name, "; ") AS products
     FROM bills b
     LEFT JOIN customers c ON b.customer_id = c.id
     LEFT JOIN bill_items bi ON bi.bill_id = b.id
     GROUP BY b.id`
  );

  if (!rows.length) return { error: "No sales yet" };

  const csvContent = [
    ["Bill Number", "Customer Name", "Products", "Total Amount", "Created At"],
    ...rows.map((r) => [r.bill_number, r.customer_name, r.products, r.total_amount, r.created_at])
  ]
    .map((e) => e.join(","))
    .join("\n");

  const { filePath } = await dialog.showSaveDialog({
    title: "Save Total Report",
    defaultPath: `total-report.csv`,
    filters: [{ name: "CSV", extensions: ["csv"] }],
  });

  if (!filePath) return { error: "Save cancelled" };

  fs.writeFileSync(filePath, csvContent);
  return { success: true, path: filePath };
});