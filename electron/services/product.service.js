const { ipcMain } = require("electron");
const dbPromise = require("../db/sqlite");

// CREATE
ipcMain.handle("add-product", async (_, product) => {
  const db = await dbPromise;
  const { name, qr_code, price, gst_percent, quantity } = product;

  return db.run(
    `INSERT INTO products (name, qr_code, price, gst_percent, quantity)
     VALUES (?, ?, ?, ?, ?)`,
    [name, qr_code, price, gst_percent, quantity]
  );
});

// READ ALL
ipcMain.handle("get-products", async () => {
  const db = await dbPromise;
  return db.all("SELECT * FROM products ORDER BY created_at DESC");
});

// UPDATE
ipcMain.handle("update-product", async (_, product) => {
  const db = await dbPromise;
  const { id, name, price, gst_percent, quantity } = product;

  return db.run(
    `UPDATE products
     SET name=?, price=?, gst_percent=?, quantity=?
     WHERE id=?`,
    [name, price, gst_percent, quantity, id]
  );
});

// DELETE
ipcMain.handle("delete-product", async (_, id) => {
  const db = await dbPromise;
  return db.run("DELETE FROM products WHERE id=?", [id]);
});
