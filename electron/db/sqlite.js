const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPromise = open({
  filename: "textile.db",
  driver: sqlite3.Database
});

// Initialize all tables
(async () => {
  const db = await dbPromise;

  //  Users: staff / owner
  await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- 'owner' or 'staff'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  // Customers
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      email TEXT,
      address TEXT,
      gst_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      qr_code TEXT UNIQUE,
      sku TEXT,
      price REAL NOT NULL,
      gst_percent REAL DEFAULT 0,
      quantity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bills
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      sub_total REAL NOT NULL,
      gst_amount REAL NOT NULL,
      cash_discount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_mode TEXT NOT NULL CHECK (payment_mode IN ('CASH', 'CARD', 'UPI')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);


  // Bill Items
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bill_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      gst_percent REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (bill_id) REFERENCES bills(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Stock Logs
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stock_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      change INTEGER,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default users if table is empty
  const users = await db.all("SELECT * FROM users");
  if (users.length === 0) {
    await db.run(`
      INSERT INTO users (username, password, role) VALUES
      ('owner', 'owner123', 'owner'),
      ('staff', 'staff123', 'staff')
    `);
  }

  console.log("✅ All tables created successfully");
})();

module.exports = dbPromise;
