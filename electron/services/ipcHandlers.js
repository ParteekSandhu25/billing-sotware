const { ipcMain, BrowserWindow, dialog } = require("electron");
const dbPromise = require("../db/sqlite");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { generateInvoiceHTML } = require("../utils/printBillView")

// -------------------- RABC --------------------
ipcMain.handle("getUserByUsername", async (_, username) => {
  const db = await dbPromise;
  return db.get("SELECT * FROM users WHERE username = ?", [username]);
});

// ipcMain.handle("updateUserPassword", async (_, userId, newPassword) => {
//   const db = await dbPromise;
//   await db.run("UPDATE users SET password=? WHERE id=?", [newPassword, userId]);
//   return true;
// });

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

    const match = await bcrypt.compare(
      oldPassword,
      owner.password
    );

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

/* ---------------- STAFF PASSWORD ---------------- */

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

    const match = await bcrypt.compare(
      oldPassword,
      staff.password
    );

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
ipcMain.handle("login-user", async (event,  username, password ) => {
  const db = await dbPromise;

  // 1️⃣ Fetch user (pure sqlite, no async inside)
  console.log("username: ", username);
  console.log("password", password);
  const user = await db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );

  // 2️⃣ User not found
  if (!user) {
    return { error: "User not found" };
  }
  console.log("USER: ", user);


const plain = "parteek";
const hash = "$2b$10$QWxrlAQt1ymOC9zEJISxv.TV7ivh6IPnO5cyiYGYYlDxoP8B3ssOe";

console.log("test: ",await bcrypt.compare(plain, hash));

  // 3️⃣ Compare password (safe async)
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { error: "Invalid password" };
  }

  // 4️⃣ Success
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
});

ipcMain.handle("getAllUsers", async () => {
  const db = await dbPromise;
  return db.all("SELECT id, username, role, created_at FROM users");
});

// -------------------- Customers --------------------
ipcMain.handle("getAllCustomers", async () => {
  const db = await dbPromise;
  return db.all("SELECT * FROM customers ORDER BY id DESC");
});

ipcMain.handle("getCustomerById", async (_, customerId) => {
  const db = await dbPromise;

  return db.get(
    `SELECT * FROM customers WHERE id = ?`,
    [customerId]
  );
});

ipcMain.handle("createCustomer", async (_, customer) => {
  const db = await dbPromise;

  const { name, mobile, address, email, gst_number } = customer;

  // 1️⃣ Insert customer
  const result = await db.run(
    `INSERT INTO customers (name, mobile, address, email, gst_number)
     VALUES (?, ?, ?, ?, ?)`,
    [name, mobile, address || "", email || "", gst_number || ""]
  );

  // 2️⃣ Fetch newly created customer using lastID
  const createdCustomer = await db.get(
    `SELECT * FROM customers WHERE id = ?`,
    [result.lastID]
  );

  // 3️⃣ Return full customer object
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

ipcMain.handle("getCustomerPurchaseHistory", async (_, customerId) => {
  const db = await dbPromise;

  const rows = await db.all(`
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
    ORDER BY b.created_at DESC
  `, [customerId]);

  return rows;
});


// -------------------- Products --------------------
ipcMain.handle("getAllProducts", async () => {
  const db = await dbPromise;
  return db.all("SELECT * FROM products ORDER BY id DESC");
});


// Fetch product by QR code
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

  // Log initial stock
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

  // Get previous quantity
  const prev = await db.get("SELECT quantity FROM products WHERE id=?", [id]);
  const diff = quantity - prev.quantity;

  // Update product
  await db.run(
    `UPDATE products SET name=?, qr_code=?, sku=?, price=?, gst_percent=?, quantity=? WHERE id=?`,
    [name, qr_code, sku, price, gst_percent, quantity, id]
  );

  // Log stock change if quantity changed
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
ipcMain.handle("getAllBills", async () => {
  const db = await dbPromise;

  return db.all(`
    SELECT 
      b.id AS bill_id,
      b.bill_number,
      b.customer_id,
      b.sub_total,
      b.gst_amount,
      b.total_amount,
      b.created_at AS bill_created_at,

      c.id AS customer_id,
      c.name AS customer_name,
      c.mobile AS customer_mobile,
      c.email AS customer_email,
      c.address AS customer_address,
      c.gst_number AS customer_gst_number,
      c.created_at AS customer_created_at

    FROM bills b
    LEFT JOIN customers c ON b.customer_id = c.id
    ORDER BY b.id DESC
  `);
});


ipcMain.handle("createBill", async (_, bill) => {
  const db = await dbPromise;
  const { bill_number, customer_id, items, sub_total, gst_amount, total_amount } = bill;

  // Insert bill
  const result = await db.run(
    `INSERT INTO bills (bill_number, customer_id, sub_total, gst_amount, total_amount)
     VALUES (?, ?, ?, ?, ?)`,
    [bill_number, customer_id, sub_total, gst_amount, total_amount]
  );

  const bill_id = result.lastID;

  // Insert bill items
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

    // Reduce stock
    await db.run(
      `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
      [item.quantity, item.product_id]
    );

    // Add stock log
    await db.run(
      `INSERT INTO stock_logs (product_id, change, reason)
       VALUES (?, ?, ?)`,
      [item.product_id, -item.quantity, `Sold in bill ${bill_number}`]
    );
  }

  // Fetch customer info
  const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [customer_id]);

  return { id: bill_id, bill_number, customer, items, sub_total, gst_amount, total_amount };
});


// ipcMain.handle("printBill", async (_, bill) => {
//   const { bill_number, customer, items, totals } = bill;

//   if (!items || !Array.isArray(items)) {
//     throw new Error("Bill items missing or invalid");
//   }

//   const printWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     show: true, // ✅ MUST be true on Wayland    
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   });

//   const itemsHTML = items
//     .map(
//       (i) =>
//         `<tr>
//           <td>${i.product_name}</td>
//           <td>${i.price}</td>
//           <td>${i.gst_percent}</td>
//           <td>${i.quantity}</td>
//           <td>${i.total}</td>
//         </tr>`
//     )
//     .join("");

//   const html = `
//     <html>
//       <head>
//         <title>${bill_number}</title>
//       </head>
//       <body>
//         <h2>Invoice: ${bill_number}</h2>
//         <p>Customer: ${customer.name} (${customer.mobile})</p>
//         <table border="1" cellspacing="0" cellpadding="5">
//           <thead>
//             <tr>
//               <th>Product</th>
//               <th>Price</th>
//               <th>GST %</th>
//               <th>Qty</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${itemsHTML}
//           </tbody>
//         </table>
//         <h3>Totals</h3>
//         <p>Sub Total: ₹${totals.sub_total}</p>
//         <p>GST: ₹${totals.gst_amount}</p>
//         <p>Total: ₹${totals.total_amount}</p>
//       </body>
//     </html>
//   `;

//   printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);

//   printWindow.webContents.on("did-finish-load", () => {
//     printWindow.webContents.print({}, (success) => {
//       if (success) console.log("Bill printed");
//       printWindow.close();
//     });
//   });

//   return true;
// });


ipcMain.handle("printBill", async (_, bill) => {
  const { bill_number, customer, items, totals } = bill;

  if (!items || !Array.isArray(items)) {
    throw new Error("Bill items missing or invalid");
  }

  // Default company information
  const companyInfo = {
    name: "G Hari Dewasi Safa House",
    address: "Shop Address, City, State - PIN Code",
    mobile: "+91 XXXXX XXXXX",
    email: "info@safahouse.com",
    gstin: "GSTIN NUMBER",
    pan: "PAN NUMBER"
  };

  // Transform bill data to match invoice template format
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
    total_amount: totals.total_amount,
    payment_status: bill.payment_status || "Paid",
    payment_mode: bill.payment_mode || "Cash"
  };

  // Generate professional invoice HTML using the template
  const html = generateInvoiceHTML(billData, companyInfo);

  const printWindow = new BrowserWindow({
    width: 900,
    height: 650,
    show: true, // ✅ MUST be true on Wayland    
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

// -------------------- Bill Items (optional detailed fetch) --------------------
ipcMain.handle("getBillItems", async (_, billId) => {
  const db = await dbPromise;
  return db.all("SELECT * FROM bill_items WHERE bill_id=?", [billId]);
});

// -------------------- SalesReport (optional detailed fetch) --------------------

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

// Daily Report
ipcMain.handle("export-daily-report", async () => {
  const db = await dbPromise;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

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

// Total Report
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