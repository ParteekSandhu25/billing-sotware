ipcMain.handle("create-customer", async (_, data) => {
  const db = await dbPromise;
  const { name, mobile, address } = data;

  return db.run(
    "INSERT INTO customers (name, mobile, address) VALUES (?, ?, ?)",
    [name, mobile, address]
  );
});

ipcMain.handle("get-customer-by-mobile", async (_, mobile) => {
  const db = await dbPromise;
  return db.get(
    "SELECT * FROM customers WHERE mobile = ?",
    [mobile]
  );
});
